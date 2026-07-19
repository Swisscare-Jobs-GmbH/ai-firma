#!/usr/bin/env python3
"""PreToolUse-Hook: Verbots-Wall — harte Auto-Bremse fuer gefaehrliche Kommandos.

Zweck: Text-Verbote in CLAUDE.md brechen in langen Chats (der Agent "vergisst"
sie mit der Zeit). Diese Wall greift als Auto-Mechanik: sie prueft JEDES
Bash-Kommando und JEDEN Write/Edit/MultiEdit-Pfad und sagt hart "deny" (blockt,
auch im Auto-/AcceptEdits-Modus), wenn eine der verbotenen Aktionen versucht wird.

VERBOTEN (deny):
  Bash:
    - gh repo create             -> neues Repo anlegen (SA/Mensch-Sache)
    - gh pr merge                -> PR zusammenfuehren (nur SA per GitHub-Klick)
    - gh pr ready                -> Draft-PR scharf schalten (nur SA; loest CI-Kosten aus)
    - git push --force auf master|main  -> geteilte Historie ueberschreiben
    - git merge auf master|main-Checkout -> in den Haupt-Zweig mergen
    - alles was .github/workflows anlegt (mkdir / Pfad im Kommando)
  Write/Edit/MultiEdit:
    - file_path enthaelt .github/workflows

ERLAUBT (geht durch): normales git push (ohne --force), gh pr create, alle
uebrigen Kommandos.

Schalter/Ausnahmen:
  - gh pr ready wird durchgelassen, wenn env AIF_SA=1 gesetzt ist (SA am Werk).
  - Komplett abschalten: env AIF_VERBOT_OFF=1.

Fail-open: jede Unsicherheit / jeder Fehler im Hook => still exit 0 (blockt NIE
faelschlich einen erlaubten Vorgang). Orientiert am Protokoll von
protected-change-guard.py (stdin-JSON, hookSpecificOutput).

Verdrahtung in .claude/settings.local.json (PreToolUse):
  - eigener Eintrag matcher "Bash"          -> prueft Kommandos
  - Eintrag matcher "Write|Edit|MultiEdit"  -> prueft Datei-Pfade
"""
import json
import os
import re
import subprocess
import sys


def deny(reason):
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason,
        }
    }))
    sys.exit(0)


# --force / --force-with-lease / kurzes -f als eigenstaendiges Flag.
FORCE_RE = re.compile(r"--force\b|(?<![\w-])-f(?![\w-])")
# master|main nur als eigenstaendiger Ref-Token (nicht in "feature-main-x").
PROTECTED_BRANCH_RE = re.compile(r"(?:^|[\s/])(?:master|main)(?=$|[\s:])")
GITHUB_WF = ".github/workflows"


def current_branch(cwd):
    """Aktueller Checkout-Zweig (lowercase) — leer bei jedem Fehler (fail-open)."""
    try:
        out = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            cwd=cwd or None,
            capture_output=True,
            text=True,
            timeout=3,
        )
        return (out.stdout or "").strip().lower()
    except Exception:
        return ""


def check_bash(command, cwd):
    if not command:
        return
    low = command.lower()
    slashed = low.replace("\\", "/")
    ws = re.sub(r"\s+", " ", slashed).strip()

    # .github/workflows anlegen (mkdir oder Pfad taucht irgendwo im Kommando auf)
    if GITHUB_WF in slashed:
        deny(
            "VERBOTS-WALL: Anlegen/Bearbeiten von .github/workflows ist gesperrt. "
            "CI-Workflows legt der Agent nie an (Minuten-Budget + Governance). "
            "Wenn das wirklich noetig ist: SA macht es selbst."
        )

    # gh repo create
    if "gh repo create" in ws:
        deny(
            "VERBOTS-WALL: 'gh repo create' ist gesperrt. Neue Repos legt SA/Mensch "
            "bewusst an, nicht der Agent."
        )

    # gh pr merge
    if "gh pr merge" in ws:
        deny(
            "VERBOTS-WALL: 'gh pr merge' ist gesperrt. PRs mergt nur SA (Mensch) "
            "per GitHub-Klick — nie der Agent."
        )

    # gh pr ready — nur mit SA-Freigabe (env AIF_SA=1)
    if "gh pr ready" in ws and os.environ.get("AIF_SA") != "1":
        deny(
            "VERBOTS-WALL: 'gh pr ready' (Draft scharf schalten) ist gesperrt — das "
            "loest CI-Kosten aus und ist SA-Sache. Nur SA schaltet scharf (env AIF_SA=1)."
        )

    # git push --force auf master|main
    if "git push" in ws and FORCE_RE.search(ws):
        if PROTECTED_BRANCH_RE.search(ws) or current_branch(cwd) in ("master", "main"):
            deny(
                "VERBOTS-WALL: 'git push --force' auf master/main ist gesperrt — das "
                "ueberschreibt die geteilte Historie. Normales git push (ohne --force) "
                "geht durch."
            )

    # git merge auf master|main-Checkout
    if "git merge" in ws and current_branch(cwd) in ("master", "main"):
        deny(
            "VERBOTS-WALL: 'git merge' auf einem master/main-Checkout ist gesperrt — in "
            "den Haupt-Zweig mergt nur SA (Mensch). Erst auf einen Feature-Zweig wechseln "
            "oder SA uebernehmen lassen."
        )


def check_path(tool_input):
    path = tool_input.get("file_path") or tool_input.get("path") or ""
    if not path:
        return
    p = path.replace("\\", "/").lower()
    if GITHUB_WF in p:
        deny(
            "VERBOTS-WALL: Schreiben unter .github/workflows ist gesperrt. CI-Workflows "
            "legt der Agent nicht an — das macht SA selbst."
        )


def main():
    if os.environ.get("AIF_VERBOT_OFF") == "1":
        sys.exit(0)
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    try:
        tool = data.get("tool_name", "")
        ti = data.get("tool_input") or {}
        cwd = data.get("cwd") or ""
        if tool == "Bash":
            check_bash(ti.get("command") or "", cwd)
        elif tool in ("Write", "Edit", "MultiEdit"):
            check_path(ti)
    except SystemExit:
        raise
    except Exception:
        sys.exit(0)

    sys.exit(0)


if __name__ == "__main__":
    main()
