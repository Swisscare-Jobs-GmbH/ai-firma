# Phase 3 — MVP bauen

> Ziel: eine App, die {KUNDE} am Termin SELBST anklicken kann — ohne echte Zugaenge, ohne Risiko.
> Dauer: 1-3 Tage. Code-Basis kopierbar aus `finelli-cockpit` (FastAPI + SQLite + React).

## Fazit

**Uebungs-Modus zuerst.** Die App muss mit Mock-Daten demo-faehig sein, BEVOR ein einziger echter
Kunden-Zugang existiert. So kann am Termin sofort geklickt werden — und der Bau haengt nicht an Zugaengen.

## Die 4 Bau-Regeln

| Regel | Warum |
|---|---|
| **1. Uebungs-Modus / Mock zuerst** | Demo-faehig ohne Kunden-Zugaenge. Echte Daten kommen erst nach Unterschrift. |
| **2. Eigene Ports pro Kunde** | Kein Kollisions-Chaos zwischen Kunden-Apps auf demselben Rechner. |
| **3. Klick-Beweis Pflicht** | pytest + echter Browser-Klick ODER Service-Aufruf mit echten Parametern + Rollback-Beweis. |
| **4. Mock-Formeln am Kalendertag verankern** | `toordinal`, nie Tages-Abstand — sonst Daten-Drift nach Neustart (Finelli-Fehler). |

## PFLICHT: Klick-Beweis vor "fertig"

**Ein Build zaehlt NIE als Test.** Vor jeder "fertig"-Meldung:
1. **Klassen-Sweep:** Befund X ist eine Klasse, kein Einzelfall — die ganze App absuchen, alle Stellen fixen/listen.
2. **Selbst klicken:** echter Schirm-Klick ODER Uebungswelt-Durchlauf (Service-Aufruf mit exakten
   Frontend-Parametern + Rollback + SELECT-Beweis). Geht kein Klick: woertlich "nicht am Schirm gesehen" in den Rapport.
3. Der Skill `.claude/skills/beweis-fertig` erzwingt diesen Ablauf + baut den Beweis-Block.

> SA klickt nur zur ABNAHME (Phase 5), nie zur Fehlersuche.

## Nach dem Bau: Review-Schwarm

Finder-Agenten suchen Fehler → adversariale Verifizierer bestaetigen/verwerfen → Fixes.
Bei Finelli fand der Schwarm (45 Pruef-Agenten) 33 echte Funde + 3 Demo-Killer VOR dem Termin.
Workflow: `.claude/skills/` (MVP-Klick-Beweis + Review-Schwarm).

## Was V1 typisch enthaelt

Der Killer-Pain-Kern (Phase 1) + eine **KI-Sichtbarkeit** (z.B. Wochen-Bericht), die den
"Custom-AI-Software"-Claim + die Betriebs-Gebuehr traegt. Bestehende Systeme des Kunden NIE ersetzen —
aufsetzen (Fertig-Teile nutzen: Shopify-API, POS, Barcode-App; Eigenbau nur wo kein Fertigteil existiert).

## Speichern

Jede Etappe speichern + hochladen, **Draft-PRs, keine `.github/workflows`** (Minuten-Budget).

## Ergebnis dieser Phase

Demo-faehige App im Uebungs-Modus, klick-bewiesen, Review-Schwarm durch — bereit fuer Angebot (Phase 4) + Termin (Phase 5).
