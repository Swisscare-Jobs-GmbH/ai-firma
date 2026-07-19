#!/usr/bin/env python3
"""PreToolUse-Hook: Schutz-Wall vor Aenderungen an Verfassung + Vorlagen.

Zweck: Die tragenden Dateien der AI-Firma (Firmen-Verfassung, Prozess-Playbook,
Vertrags-Vorlagen, .claude-Konfig) werden NIE "per Zuruf" geaendert. Vor jedem
Write/Edit/MultiEdit an einer GESCHUETZTEN Datei erzwingt dieser Hook eine bewusste
Rueckfrage (permissionDecision "ask") — auch dann, wenn die Session im Auto-/
AcceptEdits-Modus laeuft (der Hook ueberstimmt den Auto-Modus). Aenderung nur mit
explizitem SA-Auftrag im Chat.

GESCHUETZT (fragt nach):
  CLAUDE.md, playbook/**, vorlagen/vertrag/**, .claude/** (hooks/settings/skills/commands)
FREI (kein Zwang):
  Scratchpad, Build-Artefakte, uebrige vorlagen/ (angebot/kunden-repo/termine),
  kunden/**, brain/** (dafuer greift ggf. der Fakten-Live-Waechter).

Fail-open: bei jeder Unsicherheit still exit 0 (blockt NIE faelschlich einen Edit).

Verdrahtung (Aktivierung = SA-Paste, Agent-gesperrt) in .claude/settings.local.json:
  {"hooks":{"PreToolUse":[{"matcher":"Write|Edit|MultiEdit","hooks":[
    {"type":"command","command":"python .claude/hooks/protected-change-guard.py"}]}]}}

Abschalten: den PreToolUse-Block wieder entfernen, ODER env AIF_GUARD_OFF=1 setzen.
"""
import json
import os
import sys


def emit_ask(reason):
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "ask",
            "permissionDecisionReason": reason,
        }
    }))
    sys.exit(0)


# Verzeichnisse, die eine Rueckfrage ausloesen (normalisierte /-Pfade, lowercase).
PROTECTED = (
    "/playbook/",
    "/vorlagen/vertrag/",
    "/.claude/",
)
# Dateien, die eine Rueckfrage ausloesen (Pfad-Ende, lowercase).
PROTECTED_FILES = (
    "/claude.md",
)
# Ausnahmen: hier NIE fragen (auch wenn oben ein Treffer waere).
EXEMPT = (
    "/.claude/projects/",      # Memory / Transcript
    "/appdata/local/temp/",    # Scratchpad
    "/node_modules/",
    "/dist/",
    "/build/",
    "/.planning/",
)


def main():
    if os.environ.get("AIF_GUARD_OFF") == "1":
        sys.exit(0)
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    tool = data.get("tool_name", "")
    if tool not in ("Write", "Edit", "MultiEdit"):
        sys.exit(0)

    ti = data.get("tool_input") or {}
    path = ti.get("file_path") or ti.get("path") or ""
    if not path:
        sys.exit(0)

    p = path.replace("\\", "/").lower()

    if any(x in p for x in EXEMPT):
        sys.exit(0)

    hit = any(x in p for x in PROTECTED) or any(p.endswith(f) for f in PROTECTED_FILES)
    if not hit:
        sys.exit(0)

    # Zone bestimmen (fuer die Meldung)
    if "/vorlagen/vertrag/" in p:
        zone = "Vertrags-Vorlage"
    elif "/playbook/" in p:
        zone = "Playbook (Prozess-Regeln)"
    elif p.endswith("/claude.md"):
        zone = "CLAUDE.md (Governance)"
    elif "/.claude/" in p:
        zone = ".claude-Konfig (Hooks/Skills/Commands)"
    else:
        zone = "geschuetzte Datei"

    emit_ask(
        f"SCHUTZ-WALL: Aenderung an geschuetzter Datei ({zone}) — "
        f"{os.path.basename(path)}. Nur mit explizitem SA-Auftrag im Chat aendern. "
        f"Bewusst bestaetigen: stimmen Umfang + betroffene Stellen? Kein Aendern per Zuruf."
    )


if __name__ == "__main__":
    main()
