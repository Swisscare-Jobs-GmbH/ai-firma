#!/usr/bin/env python3
"""PreToolUse-Hook: Fakten-Live-Waechter fuer Angebote + Vertraege.

Zweck (Vorfall 18.07, Fehlerklasse 2x nur von SA selbst gefangen): In ein Angebot
rutschten Beleg-Zahlen ("41 Bewertungen", Referenz-Kunden), die NICHT live an der
Quelle nachgezaehlt waren. Eine Text-Checkliste reicht nachweislich nicht — nur
eine Auto-Mechanik faengt es.

Verhalten: BLOCKT NICHT. Wenn ein Write/Edit auf eine Angebots-/Vertrags-Datei
zielt UND der neue Inhalt Zahlen mit Beleg-Charakter enthaelt (Bewertungen, Sterne,
Reviews, Referenz, "Kunden wie ..."), gibt der Hook eine WARNUNG aus (exit 0 +
systemMessage + stderr): "FAKTEN-CHECK: Zahl X gefunden — live verifiziert?"

Kein Netz-Zugriff, nur Text-Pruefung. Robust: bei jeder Unsicherheit still exit 0.

Ziel-Pfade (lowercase, /-normalisiert):
  vorlagen/angebot/**, vorlagen/vertrag/**, kunden/**/angebot*, kunden/**/vertrag*

Verdrahtung in .claude/settings.local.json (PreToolUse, Matcher Write|Edit|MultiEdit):
  {"type":"command","command":"python .claude/hooks/fakten-live-waechter.py"}

Abschalten: env AIF_FAKTEN_OFF=1 setzen, ODER den Hook-Eintrag entfernen.
"""
import json
import os
import re
import sys

# Beleg-Muster (Such-Muster): Zahl+Beleg-Wort ODER Referenz-Formulierungen.
PATTERNS = (
    re.compile(r"\d+\s*(?:Bewertung(?:en)?|Sterne?|Reviews?|Rezension(?:en)?)", re.IGNORECASE),
    re.compile(r"\bReferenz(?:en|kunden)?\b", re.IGNORECASE),
    re.compile(r"Kunden wie\b", re.IGNORECASE),
)


def target_is_offer_or_contract(p):
    """p = lowercase, /-normalisierter Pfad."""
    if "/vorlagen/angebot/" in p or "/vorlagen/vertrag/" in p:
        return True
    if "/kunden/" in p:
        base = p.rsplit("/", 1)[-1]
        if "angebot" in base or "vertrag" in base:
            return True
    return False


def collect_new_text(tool, ti):
    """Sammelt den zu schreibenden Text ueber Write/Edit/MultiEdit hinweg."""
    parts = []
    if tool == "Write":
        parts.append(ti.get("content") or ti.get("file_text") or "")
    elif tool == "Edit":
        parts.append(ti.get("new_string") or "")
    elif tool == "MultiEdit":
        for e in (ti.get("edits") or []):
            if isinstance(e, dict):
                parts.append(e.get("new_string") or "")
    return "\n".join(x for x in parts if x)


def main():
    if os.environ.get("AIF_FAKTEN_OFF") == "1":
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
    if not target_is_offer_or_contract(p):
        sys.exit(0)

    text = collect_new_text(tool, ti)
    if not text:
        sys.exit(0)

    # Alle Treffer einsammeln (dedupliziert, kurz gehalten fuer die Meldung).
    found = []
    for rx in PATTERNS:
        for m in rx.findall(text):
            hit = m if isinstance(m, str) else " ".join(m)
            hit = hit.strip()
            if hit and hit not in found:
                found.append(hit)
    if not found:
        sys.exit(0)

    beispiele = ", ".join(found[:5])
    if len(found) > 5:
        beispiele += ", ..."

    msg = (
        f"FAKTEN-CHECK ({os.path.basename(path)}): Beleg-Zahl(en) gefunden — {beispiele}. "
        f"Live verifiziert? Regel: Quelle (Google Maps / Bewertungs-Seite) SELBST "
        f"nachzaehlen, nicht aus dem Gedaechtnis (Vorfall 18.07). Blockt nicht — nur Warnung."
    )

    # Nicht blocken: Warnung als systemMessage (User sieht sie) + stderr (Log/Transcript).
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
        },
        "systemMessage": msg,
    }))
    sys.stderr.write(msg + "\n")
    sys.exit(0)


if __name__ == "__main__":
    main()
