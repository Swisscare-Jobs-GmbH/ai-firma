#!/usr/bin/env bash
# SessionStart-Karte fuer die AI-Firma — injiziert eine kompakte Orientierung
# ins Modell beim Chat-Start: git-Status + offene PRs + Kunden-Ampel + Format-Erinnerung.
# So kennt jede Session den Stand, ohne dass Befehle/PRs/Kunden pro Chat neu erarbeitet werden.
#
# Ausgabe: JSON mit hookSpecificOutput.additionalContext (SessionStart-Vertrag).
# Personal (via .claude/settings.local.json, gitignored) — kein Team-Zwang.
set -euo pipefail

ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || echo '.')}"

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"
dirty="$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"

# Offene PRs — damit die Session weiss was in Arbeit ist (nicht doppelt bauen,
# Base pruefen). Fail-soft: wenn gh fehlt/nicht authed -> Platzhalter.
prs="$(gh pr list --state open --limit 12 \
        --json number,title,headRefName \
        -q '.[] | "  #\(.number) \(.title)  [\(.headRefName)]"' 2>/dev/null | head -15 || true)"
[ -z "$prs" ] && prs="  (keine offenen PRs / gh nicht verfuegbar)"

# Kunden-Ampel — Registry-Tabelle aus kunden/UEBERSICHT.md (nur Tabellen-Zeilen).
# Quelle der Wahrheit fuer Kunde -> Repo -> Ports -> Deal-Stand.
ampel="  (kunden/UEBERSICHT.md noch nicht angelegt)"
if [ -f "${ROOT}/kunden/UEBERSICHT.md" ]; then
  ampel="$(grep '|' "${ROOT}/kunden/UEBERSICHT.md" 2>/dev/null | head -20 || true)"
  [ -z "$ampel" ] && ampel="  (kunden/UEBERSICHT.md leer / keine Tabelle)"
fi

read -r -d '' card <<EOF || true
== ai-firma — Session-Start-Karte ==
Branch: ${branch}  |  uncommitted Dateien: ${dirty}

Offene PRs (VOR neuem Bau pruefen — nicht doppeln, Base checken):
${prs}

Kunden-Ampel (Registry — Kunde / Repo / Ports / Deal-Stand):
${ampel}

READ-BEFORE-ASK (Reihenfolge): Chat-Verlauf -> Repo/Git-History -> brain/ (ai-firma-Repo).
Treffer = nutzen, nicht fragen. Alle leer = Frage mit konkreten Optionen a/b/c.

SA-Format (Legasthenie/ADHS-Accommodation, PFLICHT): Fazit zuerst (1-3 Zeilen + klare Empfehlung),
Tabellen statt Fliesstext, Optionen nummeriert (max 4), max 1 Frage, Fachbegriffe in Klartext,
kein Coddling/keine Theatralik, keine Pause-Vorschlaege. (Details: globale ~/.claude/CLAUDE.md.)
EOF

# JSON sicher bauen (jq escaped alles). Fallback ohne jq: python, sonst minimal.
if command -v jq >/dev/null 2>&1; then
  jq -cn --arg c "$card" '{hookSpecificOutput:{hookEventName:"SessionStart",additionalContext:$c}}'
else
  esc="$(printf '%s' "$card" | python -c 'import json,sys; print(json.dumps(sys.stdin.read()))' 2>/dev/null || printf '""')"
  printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":%s}}\n' "$esc"
fi
