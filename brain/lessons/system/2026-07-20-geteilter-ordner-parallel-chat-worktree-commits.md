---
domain: brain
type: lesson
persona: system
theme: git-parallel-chats
owner: sa
status: active
date: 2026-07-20
priority: 1
polarity: negativ
see_also: []
witness_anchors: ["a7873fe auf chore-Zweig gelandet", "Everything up-to-date-Verwirrung"]
---

# Geteilte Ordner: Parallel-Chat wechselt Zweig — Commits nur via Wegwerf-Arbeitskopie

## Wurzel
Zwei Chats arbeiten im selben Repo-Ordner (finelli-cockpit + ai-firma am 20.07.). Der
eine wechselt den Zweig (checkout -b) — der andere committet danach ahnungslos auf dem
FREMDEN Zweig. Symptom: `git push origin main` sagt "Everything up-to-date", obwohl
gerade committet wurde.

## Befund
Commit a7873fe (Angebots-Finalisierung) landete auf dem Aufraeum-Zweig des
Parallel-Chats statt auf main; ein weiterer Commit haette fast dessen halb-fertige
staged Loeschungen mit-eingepackt (nur Pfad-explizites git add verhinderte es).
Rettung: cherry-pick auf main via Wegwerf-Arbeitskopie.

## Lesson
In einem Ordner, in dem parallel ein zweiter Chat arbeitet: NIE direkt committen.
Immer: `git worktree add <tmp> <ziel-zweig>` → dort schreiben/kopieren → commit mit
expliziten Pfaden → push → `git worktree remove`. Vor jedem Commit in geteilten
Ordnern: `git branch --show-current` pruefen. "Everything up-to-date" nach frischem
Commit = Alarmsignal (falscher Zweig).

## Anwendung
In dieser Session 4x sauber angewandt (Playbook, Vollhoehe-Polish, Abschluss-Dateien).

## Optionen
1. Regel in ai-firma CLAUDE.md als Pflicht aufnehmen (geteilte Ordner = Worktree-Pflicht).
2. Kleinen Hook bauen, der bei Commit auf unerwartetem Zweig warnt.
3. Nichts weiter — Lesson reicht als Wissen.
