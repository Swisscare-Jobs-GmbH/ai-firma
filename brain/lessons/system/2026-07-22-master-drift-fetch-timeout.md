---
datum: 2026-07-22
disziplin: system
kunde: -
tags: [git, master-drift, fetch-timeout, befehle-uebernehmen]
---

# master-Drift + fetch-Timeout beim Zusammenfuehren

## Was
Beim Bau von 2 Skills (aufgaben-audit + clean-rechner) in einem Worktree lief die
Haupt-Spur (master) durch automatische "auto: Datenupdate aus SEA"-Commits weiter.
`git push HEAD:master` wurde abgelehnt ("remote contains work you do not have locally").
Ausserdem hing `git fetch origin` (ALLE refs) volle 2 Minuten in den Timeout.

## Lesson
- **Langer Bau -> master driftet.** Vor dem Zusammenfuehren auf master IMMER:
  `git fetch origin master` (nur master) -> `git rebase FETCH_HEAD` -> `git push origin HEAD:master`.
  Der Rebase ist konfliktfrei, solange die eigenen Dateien (.claude/skills, kunden/...) nicht die
  SEA-Datendateien sind.
- **`git fetch origin` (alle refs) haengt** in diesem Repo -> nie blind, immer gezielt
  `git fetch origin <branch>` mit Timeout.

## Anwendung
Jeder ai-firma-Chat, der laenger baut und auf master zusammenfuehrt: gezielter Fetch + Rebase,
nie `git push` blind auf master, nie `git fetch origin` ohne Ref.
