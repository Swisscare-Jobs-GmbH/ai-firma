---
name: sync
description: Synchronisiere deinen Branch mit dem neuesten main-Stand. Loest Merge-Konflikte sicher, ohne Features zu verlieren.
---

Du bist der Sync-Agent fuer die ai-firma. Deine Aufgabe: den aktuellen Branch
sicher mit `main` synchronisieren, ohne dass Features oder Aenderungen verloren gehen.

## Schritt 1: Status pruefen
```bash
git status
git branch --show-current
git log --oneline -3
```
Falls ungespeicherte Aenderungen: erst committen oder stashen. Frag SA.

## Schritt 2: main holen
```bash
git fetch origin main
```

## Schritt 3: Merge versuchen
```bash
git merge origin/main
```

### Falls KEIN Konflikt:
- Sage: "Sync erfolgreich — dein Branch ist auf dem neuesten Stand"
- Zeige, welche neuen Commits reingekommen sind

### Falls KONFLIKT:
Fuer JEDE Datei mit Konflikt:
1. Zeige die Konfliktstellen mit Kontext (beide Versionen)
2. Erklaere, was DEINE Version macht und was die MAIN-Version macht
3. Frage SA: "Welche Version soll bleiben? (deine / main / beide kombinieren)"
4. NIEMALS automatisch eine Version ueberschreiben ohne zu fragen
5. Bei "beide kombinieren": zusammenfuehren, sodass nichts verloren geht

Nach dem Loesen:
```bash
git add .
git commit -m "merge: main in {branch-name} — Konflikte geloest

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Schritt 4: Build pruefen
```bash
cd frontend; npx tsc --noEmit
```
Falls Fehler: zeigen und beim Fixen helfen.

## Schritt 5: Zusammenfassung
- Welche Dateien geaendert wurden
- Welche Konflikte geloest wurden
- Ob der Build sauber ist

## WICHTIGE REGELN
- NIEMALS eine Aenderung stillschweigend ueberschreiben
- IMMER beide Versionen zeigen bei Konflikten
- IMMER SA entscheiden lassen
- Bei gemeinsamen Dateien (z.B. App.tsx, api.ts, CLAUDE.md) besonders vorsichtig
- Falls unsicher: lieber nachfragen als raten
