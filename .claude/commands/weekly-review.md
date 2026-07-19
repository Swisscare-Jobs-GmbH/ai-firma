---
name: weekly-review
description: Woechentlicher Health-Check der ai-firma — Code-Qualitaet, offene TODOs, Stale Branches, Test-Status, Security, Kunden-Ampel.
---

Du bist der Weekly-Review-Agent fuer die ai-firma. Fuehre einen vollstaendigen
Wochen-Check durch. Repo-Wurzel: `C:/dev/ai-firma` (Kunden-Repos separat unter
`C:/dev/{KUNDE}-cockpit`).

## 1. Git-Ueberblick (Was ist diese Woche passiert?)
```bash
git log --oneline --since="7 days ago" --all
```
Fasse zusammen: Wie viele Commits? Welche Bereiche (playbook/vorlagen/kunden/
brain/.claude)? Branches aelter als 14 Tage?
```bash
git branch -a --sort=-committerdate --format="%(refname:short) %(committerdate:relative)"
```
Markiere Branches aelter als 14 Tage als "⚠️ Stale — loeschen oder mergen?"

## 2. Build-Status (Geht alles?)
Nur relevant, wenn ein Kunden-Repo Code hat. Pro aktivem Kunden-Repo:
```bash
cd C:/dev/{KUNDE}-cockpit/frontend; npx tsc --noEmit 2>&1 | tail -20
cd C:/dev/{KUNDE}-cockpit/backend; python -m pytest tests/ -q --tb=no 2>&1 | tail -10
```
Zusammenfassung: ✅ oder ❌ pro Repo mit Anzahl Fehler.

## 3. Offene TODOs im Code
```bash
grep -rn "TODO\|FIXME\|HACK\|XXX" --include="*.py" --include="*.ts" --include="*.tsx" C:/dev/ai-firma 2>/dev/null | grep -v node_modules | grep -v __pycache__
```
Gruppiere nach Bereich, hebe neue TODOs (diese Woche) hervor.

## 4. Security Quick-Check
```bash
grep -rn "password\|secret\|token\|api_key\|apikey" --include="*.py" --include="*.ts" --include="*.tsx" --include="*.md" C:/dev/ai-firma 2>/dev/null | grep -v node_modules | grep -v __pycache__ | grep -v ".example" | grep -v "test_"
```
Verdaechtige Eintraege → sofort warnen. Auch pruefen:
```bash
git diff HEAD~10 --name-only | grep -E "\.(env|key|pem|secret)" 2>/dev/null
```

## 5. Stale Worktrees
```bash
git worktree list 2>/dev/null
```
Mehr als 3 Worktrees → Aufraeum-Aktion empfehlen.

## 6. Kunden-Ampel aktualisieren
Lies `C:/dev/ai-firma/kunden/UEBERSICHT.md` und pruefe pro Kunde den Deal-Stand.
**Kunden-Ampel in `kunden/UEBERSICHT.md` aktualisieren** (Phase 0-5 · Deal-Stand ·
naechster Schritt). Frage SA, ob sich seit letzter Woche etwas geaendert hat.

## 7. Zusammenfassung
```
ai-firma Weekly Review — [Datum]
================================
Commits diese Woche:   XX
Aktive Kunden:         XX (Ampel: gruen/gelb/rot je Kunde)
Build/Tests:           ✅/❌ pro Kunden-Repo
Offene TODOs:          XX (XX neu)
Stale Branches:        XX
Security Issues:       ✅/❌
================================
```

### Empfohlene Aktionen diese Woche (Top 3, priorisiert):
1. Security Issues (SOFORT)
2. Build-Fehler (DIESE WOCHE)
3. Stale Branches / Kunden-Ampel nachziehen (NICE TO HAVE)

## REGELN
- Sei direkt und konkret, keine Floskeln. Zahlen und Fakten, keine Vermutungen.
- Fehlgeschlagener Check (z.B. pytest nicht installiert) → ueberspringen, als
  "⏭️ Uebersprungen" markieren.
- Am Ende: Frage SA, ob er eine der Aktionen sofort angehen will.
