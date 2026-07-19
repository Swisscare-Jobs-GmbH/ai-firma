---
name: chat-end-clean
description: Sauberer Chat-Abschluss (ai-firma, schlank). Hygiene-Gate, Commit+Push+Verify, 1 Lesson ins Brain, offene Arbeit als Handoff, Handoff-Prompt ausgeben. Triggert via /chat-end-clean, /chat-ende oder Phrasen "chat ende", "chat schluss", "alles pushen", "fertig fuer heute", "ich wechsle chat", "machen wir Schluss". Anti-Trigger (NICHT abschliessen): "kurz warte", "moment", "pausieren".
---

# `/chat-end-clean` — sauberer Abschluss in 5 Schritten (ai-firma)

Brain-Pfade: alles unter `C:/dev/ai-firma/brain/`.

---

## Schritt 1 — Hygiene-Gate (git status)
1. `git status` + `git branch --show-current`. **NIE direkt auf `main`
   committen/pushen** — HEAD auf main → Warnung + Feature-Branch vorschlagen.
2. Geaenderte Dateien pruefen BEVOR committet wird:
   - **Bloat** raus: `node_modules/`, `.venv/`, `dist/`, `__pycache__/`, `*.exe`,
     grosse Binaries/Bilder.
   - **Secrets** raus: `.env`, Tokens, Keys, `settings.local.json`.
   - **Fremd-Arbeit** (Dateien, die ein anderer Chat/Strang angefasst hat) NICHT
     mit-committen, 1 Zeile melden.

## Schritt 2 — Commit + Push + Verify
1. Thematisch gruppierte Commits, konventionelles Format (feat/fix/chore/docs),
   Deutsch. Message endet mit
   `Co-Authored-By: Claude <noreply@anthropic.com>`.
2. Push auf den Feature-Branch (NIE main).
3. **Verify:** `git log origin/<branch>..HEAD` muss leer sein — sonst ist der Push
   nicht durch. Ergebnis 1 Zeile melden.
4. Code geaendert → vorher `npm run build` (frontend) + `pytest -q` (backend),
   falls das Kunden-Repo diese hat.

## Schritt 3 — 1 Lesson ins Brain (PFLICHT: min. 1 pro Session)
Auch ohne Code — zur Not ein Werkzeug-Kniff, eine Sackgasse, ein Prozess-Punkt.
- Ablage: `C:/dev/ai-firma/brain/lessons/<disziplin>/<datum>-<kurz-tag>.md`
  (disziplin = verkauf / bau / kunde / system / feedback).
- **Frontmatter-Konvention** (Pflicht-Kopf):
  ```
  ---
  datum: 2026-07-19
  disziplin: bau
  kunde: {KUNDE oder "-"}
  tags: [kurz, schlagworte]
  ---
  ```
- **Dedup zuerst:** Thema in `brain/lessons/` greppen — Treffer = Datei UPDATEN,
  nie doppeln.

## Schritt 4 — offene Arbeit als Handoff
Alles Offene in EINE neue Datei (append-only = konfliktfrei bei Parallel-Chats):
`C:/dev/ai-firma/brain/_handoff/HANDOFF-<datum>-<thema>.md`. Pro offenem Punkt
genau 4 Zeilen:
- **Was** (1 Satz)
- **Hebel** (warum wichtig, CHF-/Zeit-Anker + Blocker ja/nein)
- **Kontext** (2-3 Saetze, verstaendlich OHNE diesen Chat)
- **Prio** 🔴 jetzt / 🟡 spaeter

Lesson (Schritt 3) + Handoff sind Brain-Dateien → mit-committen und pushen.

## Schritt 5 — Handoff-Prompt ausgeben (copy-paste-ready im Chat)
Am Ende einen kurzen Start-Prompt fuer den Folge-Chat ausgeben, den SA direkt
kopieren kann:
```
Weiter an {THEMA} fuer {KUNDE}. Stand + offene Punkte:
C:/dev/ai-firma/brain/_handoff/HANDOFF-<datum>-<thema>.md
Zuerst /vorflug (Ports aus kunden/UEBERSICHT.md), dann Punkt 1 anpacken.
```

---

## Abschluss-Block (SA-Format: Kopf + Fazit ZUERST)
```
Stufe L1 · Lead: HQ · Skills: chat-end-clean

**Fazit:** <1-2 Zeilen: sauber zu? wichtigster Fund der Session?>

Branch:  <branch> · Push: <up to date | gepusht + verifiziert | BLOCKIERT weil ...>
Lesson:  <was gelernt> -> brain/lessons/<disziplin>/<datei> (IMMER gefuellt)
Handoff: <N> offene Punkte -> HANDOFF-<datum>-<thema>.md
Prompt:  siehe oben (copy-paste)
```

## Harte Regeln
- NIE direkt auf `main`. Keine Secrets/.env. Fremd-Arbeit nie mit-committen.
- Genau EINE Lesson-Pflicht — "keine Erkenntnis" gilt nicht.
- Sichtbarer Output kurz halten (Legasthenie/ADHS-Schutz) — Details nur auf "mehr".
- Format-Regeln (Kopf/Fazit/Klartext) gelten global aus `~/.claude/CLAUDE.md` —
  hier nicht duplizieren.
