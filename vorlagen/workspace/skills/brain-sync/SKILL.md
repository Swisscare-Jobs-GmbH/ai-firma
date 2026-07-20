---
name: brain-sync
description: Der Rueckspiel-Ablauf des AIWorks-Workspace — Aenderungen aus Kunden-Repos als verallgemeinerte Lehren/Vorlagen nach ai-firma zurueckspielen, Registries nachziehen, BEIDE Repos committen + pushen. Triggert via /brain-sync oder Phrasen "sync das brain", "lehren zurueckspielen", "workspace sync", "alles updaten und pushen" — und SOLLTE am Ende jeder Session laufen, die Repo-Dateien geaendert hat (der Stop-Hook sync-erinnerung.js erzwingt das). Anti-Trigger: reines Lesen ohne Aenderung (dann nichts tun).
---

# /brain-sync — Lehren-Ruecklauf + Voll-Abschluss des Workspace

## Wurzel (WARUM es diesen Skill gibt)

Drift-Vorfall 20.07.2026: Die Kunden-Registry kannte das Repo `finelli-lagerverwaltung` nicht,
das E-Register kannte E3 nicht, die ECC-Rules fehlten auf dem AB-Rechner. Wissen driftet, wenn
es nicht mechanisch zurueckfliesst. WARUM im Detail:
`ai-firma/brain/lessons/system/2026-07-20-zwei-rechner-pfad-drift.md`.
Abgrenzung: `chat-end-clean` (ai-firma-Skill) schliesst EINEN Chat in EINEM Repo sauber ab —
/brain-sync ist die Workspace-Klammer darueber (Kunde -> Firma -> Push ueberall). Beide vertragen
sich: erst /brain-sync, dann optional /chat-end-clean fuer den ai-firma-Feinschliff.

## Schritte (nummeriert, keiner ueberspringen)

1. **Vorflug (messen, nicht glauben):**
   `git -C <repo> status -sb` + `git -C <repo> log --oneline -5` fuer BEIDE Repos.
   Letzten Sync-Stand lesen: `.claude/state/last-sync.json` (Commit-Hashes) und
   `.claude/state/sync-pending.json` (was diese Session angefasst hat).
2. **Schwarm starten (nur bei inhaltlichen Kunden-/Firmen-Aenderungen):**
   Workflow `.claude/workflows/brain-sync.js` mit args
   `{ "heute": "JJJJ-MM-TT", "workspace": "C:/Projects/AIWorks", "kunde": "<kuerzel>",
      "seitCommit": { "<repo>": "<hash>" } }`.
   Der Schwarm LIEST nur und liefert gepruefte Vorschlaege (2 Skeptiker je Vorschlag).
   Bei trivialen Aenderungen (Tippfehler, reine Doku-Kosmetik) darf der Schwarm uebersprungen
   werden — dann Schritt 3 von Hand mit gesundem Menschenverstand.
3. **Schreiben (NUR der Haupt-Chat schreibt):** Angenommene Vorschlaege umsetzen —
   Lessons nach `ai-firma/brain/lessons/<disziplin>/` (Frontmatter-Pflicht, Duplikat = mergen),
   Branchen-Wissen nach `ai-firma/vorlagen/branchen/`, Registry-Zeilen in
   `ai-firma/kunden/UEBERSICHT.md` + `kunden/<kunde>/README.md` (inkl. "Stand JJJJ-MM-TT"),
   Cross-Refs in `ai-firma/brain/_cross-ref/`, E-Register in `brain/decisions/README.md`.
   SCHUTZ-ZONEN (`CLAUDE.md`, `playbook/`, `vorlagen/vertrag/`, `.claude/` von ai-firma):
   nie direkt — SA-Vorschlag nach `brain/shared/todos/for-sa.md` (Schema V1).
   Wurden Root-Dateien geaendert (`workspace-root` im Pending-State): nach
   `ai-firma/vorlagen/workspace/` spiegeln (kanonische Kopie).
4. **Kunden-Repo-Ritual:** Hat die Session im Kunden-Repo gearbeitet, dessen Brain nachfuehren
   (finelli-lagerverwaltung: `docs/brain.md` Abschnitte 1/3/4/7 — sonst ist die Session laut
   Repo-Regel "nicht abgeschlossen").
5. **Hochladen + Beweis:** Beide Repos: `git add` (gezielt, nie blind -A bei fremden Dateien),
   Commit auf Deutsch (conventional, mit Co-Authored-By-Zeile), `git push`, dann
   `git log origin/<zweig> -1 --oneline` als Push-Beweis. Kein `.github/`, kein Merge, kein Force.
6. **State leeren:** `.claude/state/sync-pending.json` auf `{"eintraege": {}}` setzen und
   `.claude/state/last-sync.json` mit den neuen Commit-Hashes + Datum schreiben.

## Ausgabe-Block (1:1 in die Antwort)

```
BRAIN-SYNC <JJJJ-MM-TT>
| Repo | Commit | Push-Beweis |
|---|---|---|
| ai-firma | <hash> <msg> | origin/master @ <hash> |
| <kunden-repo> | <hash> <msg> | origin/<zweig> @ <hash> |
Lehren: <N> neu/aktualisiert (<pfad>, ...) · Registry: <ja/nein> · SA-Vorschlaege: <N>
Offen geblieben: <ehrlich benennen oder "nichts">
```

## Verbote

- NIE `.github/workflows` anlegen; NIE Repos anlegen/mergen/Ready setzen (nur SA).
- NIE Kunden-Preise/Deal-Zahlen oder Endkunden-Daten in Vorlagen/Lessons (anonymisieren).
- NIE in Schutz-Zonen von ai-firma schreiben ohne expliziten SA-Auftrag.
- NIE `settings.local.json` anfassen; NIE ins swisscare-brain schreiben.
- NIE unbelegte Zahlen ohne 🔍-Marker uebernehmen; Beleg-Status immer mitfuehren.
- Kein "fertig" ohne Push-Beweis (Schritt 5) — "muesste gepusht sein" zaehlt nicht.
