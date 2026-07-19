---
name: neukunden-bootstrap
description: Neues Kunden-Repo aus finelli-cockpit klonen und umbauen (~0.5 Tag statt 2). Klont die lebende Code-Vorlage, tauscht Branding + Mock-Daten (Mock am KALENDERTAG verankert!), vergibt eigene Ports, setzt die vorlagen/kunden-repo-Skelette ein und macht den ersten Commit. Triggert via /neukunden-bootstrap oder Phrasen "neuer kunde", "kunden-repo anlegen", "repo bootstrappen", "kunde nummer zwei", "gzf-repo bauen".
---

# /neukunden-bootstrap — Kunden-Repo in ~0.5 Tag

## Wurzel / Hebel
Groesster messbarer Zeit-Hebel im Playbook (Phase 3): finelli-cockpit ist die
lebende Code-Basis (FastAPI + SQLite + React, Login, Uebersicht, Journal,
Waechter). Klonen + Mock/Branding tauschen statt neu bauen = ~0.5 statt 2 Tage.
Quelle: `C:/dev/ai-firma/playbook/` (Phase 3) + Playbook-Regel 5 (Mock-Daten am
Kalendertag verankern).

## Voraussetzung
Finelli-Repo `C:/dev/finelli-cockpit` ist gesichert (committet + gepusht) — sonst
klonst du einen halben Stand. Vorher pruefen: `git -C C:/dev/finelli-cockpit status`.

## Schritte

### 1. Vorlage klonen, Historie kappen
```
git clone --depth 1 C:/dev/finelli-cockpit C:/dev/{KUNDE}-cockpit
```
Dann die alte Historie loeschen und frisch starten (Kunden-Repos teilen KEINE
Historie — Datentrennung):
```
Remove-Item -Recurse -Force C:/dev/{KUNDE}-cockpit/.git
git -C C:/dev/{KUNDE}-cockpit init
```

### 2. Branding tauschen
- Firmenname, Logo/Farben, Titel, Login-Text → auf {KUNDE} umstellen.
- grep nach "finelli" / "Finelli" ueber das ganze Repo, jeden Treffer bewerten
  (Klassen-Sweep — nicht nur die erste Stelle).
- Absender/Fusszeile = offener Entscheid (vorerst Swiss Care Jobs GmbH, bis SA
  eine eigene Marke festlegt).

### 3. Mock-Daten tauschen — am KALENDERTAG verankern (Regel 5!)
- Mock-Datensaetze auf {KUNDE}-Realitaet umschreiben (Produkte, Kunden, Faelle).
- **Datums-Formeln IMMER am Kalendertag verankern** (`date.toordinal()` /
  festes Bezugsdatum), NIE am Tages-Abstand ("heute minus 3") — sonst driften die
  Mock-Daten nach jedem Neustart und die Demo zeigt Unsinn.
- MOCK_MODE muss ohne Kunden-Zugaenge demo-faehig sein (Playbook Phase 3).

### 4. Eigene Ports vergeben + registrieren
- Freie Ports fuer Backend + Frontend waehlen (nicht mit einem anderen Kunden
  kollidieren — bestehende Belegung in `kunden/UEBERSICHT.md` pruefen).
- **In `C:/dev/ai-firma/kunden/UEBERSICHT.md` eintragen:** Zeile Kunde · Repo ·
  Ports · Deal-Stand-Ampel. Diese Datei ist die Quelle fuer /vorflug und den
  Kunden-Anker-Hook.
- Ports in `.env.example` + Start-Skripten des Kunden-Repos setzen.

### 5. Vorlagen-Skelette einsetzen
Aus `C:/dev/ai-firma/vorlagen/kunden-repo/` ins neue Repo kopieren und die
{PLATZHALTER} fuellen:
- `CLAUDE.md` (Kunden-Kontext + Ports + Business-Regeln DIESES Kunden)
- `HANDOFF.md`
- `PLAN.md` (8 Sektionen) — **alte Finelli-Preise NICHT uebernehmen** (ueberholt),
  Preise kommen frisch aus dem Deal-Mathe-Skill.
- `README.md`, `ETAPPE-SPEC`, `.env.example`

### 6. Erster Commit + Repo durch SA anlegen
```
git -C C:/dev/{KUNDE}-cockpit add -A
git -C C:/dev/{KUNDE}-cockpit commit -m "chore: {KUNDE}-cockpit aus finelli-cockpit gebootstrappt

Co-Authored-By: Claude <noreply@anthropic.com>"
```
- **Privates Repo legt SA an** (GitHub, Org Swisscare-Jobs-GmbH, sichtbar: privat)
  — Agent legt keine Remotes/Repos an. Danach `git remote add origin ...` + push
  durch SA.
- **NIEMALS `.github/workflows/`** anlegen (Minuten-Budget).

## Beweis vor "fertig"
`/beweis-fertig` im neuen Repo: MOCK_MODE startet, Login + Uebersicht klicken,
Datums-Anker gegen den Kalendertag pruefen. Kein "fertig" ohne Beweis-Block.
