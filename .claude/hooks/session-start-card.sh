#!/usr/bin/env bash
# SessionStart-Karte fuer die AI-Firma -- injiziert eine kompakte Orientierung
# ins Modell beim Chat-Start: git-Status + offene PRs + Kunden-Ampel + Format-Erinnerung.
# So kennt jede Session den Stand, ohne dass Befehle/PRs/Kunden pro Chat neu erarbeitet werden.
#
# Ausgabe: JSON mit hookSpecificOutput.additionalContext (SessionStart-Vertrag).
# Personal (via .claude/settings.local.json, gitignored) -- kein Team-Zwang.
set -euo pipefail

ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || echo '.')}"

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"
dirty="$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"

# Offene PRs -- damit die Session weiss was in Arbeit ist (nicht doppelt bauen,
# Base pruefen). Fail-soft: wenn gh fehlt/nicht authed -> Platzhalter.
prs="$(gh pr list --state open --limit 12 \
        --json number,title,headRefName \
        -q '.[] | "  #\(.number) \(.title)  [\(.headRefName)]"' 2>/dev/null | head -15 || true)"
[ -z "$prs" ] && prs="  (keine offenen PRs / gh nicht verfuegbar)"

# Kunden-Ampel -- Registry-Tabelle aus kunden/UEBERSICHT.md (nur Tabellen-Zeilen).
# Quelle der Wahrheit fuer Kunde -> Repo -> Ports -> Deal-Stand.
ampel="  (kunden/UEBERSICHT.md noch nicht angelegt)"
if [ -f "${ROOT}/kunden/UEBERSICHT.md" ]; then
  ampel="$(grep '|' "${ROOT}/kunden/UEBERSICHT.md" 2>/dev/null | head -20 || true)"
  [ -z "$ampel" ] && ampel="  (kunden/UEBERSICHT.md leer / keine Tabelle)"
fi

# Alter-Stempel: alte Fakten luegen still (SA "seit wann"-Pflicht). Ganze Tage
# zwischen einem YYYY-MM-DD-Datum und heute. new Date/date ist im Hook erlaubt.
age_days() {  # $1 = YYYY-MM-DD -> Anzahl Tage (oder "?" wenn unlesbar)
  local d="$1" then now
  then="$(date -d "$d" +%s 2>/dev/null || echo '')"
  [ -z "$then" ] && { echo '?'; return; }
  now="$(date -d "$(date +%Y-%m-%d)" +%s)"
  echo $(( (now - then) / 86400 ))
}

# Neueste Lesson -- juengste Datei unter brain/lessons/ (.gitkeep-Platzhalter
# ignoriert). Zeigt Pfad + Datei-Datum + Alter, damit die Session sieht wie
# frisch das letzte Gelernte ist. Robust wenn Ordner fehlt/leer.
lessons_dir="${ROOT}/brain/lessons"
lesson="  (brain/lessons/ fehlt)"
if [ -d "$lessons_dir" ]; then
  newest="$(find "$lessons_dir" -type f ! -name '.gitkeep' -printf '%T@\t%TY-%Tm-%Td\t%p\n' 2>/dev/null | sort -rn | head -1 || true)"
  if [ -n "$newest" ]; then
    l_date="$(printf '%s' "$newest" | cut -f2)"
    l_path="$(printf '%s' "$newest" | cut -f3)"
    l_age="$(age_days "$l_date")"
    lesson="  ${l_path}  (${l_date}, ${l_age} Tage alt)"
  else
    lesson="  (noch keine Lessons -- nur Platzhalter)"
  fi
fi

# Registry-Alter -- gleiche Logik wie der kunden-anker-inject-Hook, hier in bash.
stand_line="  (kein Stand-Datum in UEBERSICHT.md)"
if [ -f "${ROOT}/kunden/UEBERSICHT.md" ]; then
  s_date="$(grep -oE 'Stand [0-9]{4}-[0-9]{2}-[0-9]{2}' "${ROOT}/kunden/UEBERSICHT.md" 2>/dev/null | head -1 | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' || true)"
  if [ -n "$s_date" ]; then
    s_age="$(age_days "$s_date")"
    stand_line="  Registry-Stand ${s_date} = ${s_age} Tage alt"
    if [ "$s_age" != '?' ] && [ "$s_age" -gt 7 ] 2>/dev/null; then
      stand_line="${stand_line}  [WARNUNG: aelter als 7 Tage -- vor Kunden-Aussagen pruefen]"
    fi
  fi
fi

read -r -d '' card <<EOF || true
== ai-firma -- Session-Start-Karte ==
Branch: ${branch}  |  uncommitted Dateien: ${dirty}

Offene PRs (VOR neuem Bau pruefen -- nicht doppeln, Base checken):
${prs}

Kunden-Ampel (Registry -- Kunde / Repo / Ports / Deal-Stand):
${ampel}

Registry-Alter (alte Fakten luegen still -- vor Kunden-Aussagen pruefen):
${stand_line}

Neueste Lesson (juengstes Gelerntes unter brain/lessons/):
${lesson}

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
  # stdin ZWINGEND als UTF-8 lesen -- sonst dekodiert Python die UEBERSICHT.md-Bytes
  # (Gedankenstriche, Ampel-Emojis) ueber die Locale-Kodierung (Windows cp1252) falsch.
  # -X utf8 + PYTHONIOENCODING = doppelt abgesichert; json.dumps escaped ASCII-sicher raus.
  esc="$(printf '%s' "$card" | PYTHONIOENCODING=utf-8 python -X utf8 -c 'import json,sys; print(json.dumps(sys.stdin.read()))' 2>/dev/null || printf '""')"
  printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":%s}}\n' "$esc"
fi
