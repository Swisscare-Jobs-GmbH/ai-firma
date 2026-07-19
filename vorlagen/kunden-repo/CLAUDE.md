# {KUNDE} {PRODUKT_NAME} — Projekt-Regeln (VORLAGE)

> Herkunft: Muster aus dem Finelli-Cockpit-Repo. Beim Anlegen eines neuen Kunden-Repos alle
> `{PLATZHALTER}` ersetzen und die harten Regeln auf den Kunden pruefen. Legende am Ende.

## Kunde + Kontext

{PRODUKT_TYP} fuer **{KUNDE_RECHTSFORM}** ({KUNDE_BRANCHE}, {KUNDE_ECKDATEN}) als
{AUFSATZ_ODER_STANDALONE} auf {PLATTFORM_ODER_BESTAND}. Der volle Plan: `docs/PLAN.md` — Hintergrund
im Firmen-Brain: `C:\dev\ai-firma\kunden\{KUNDE_KUERZEL}\` (Kontext/Recherche/Schmerz-Landkarte).

## Harte Regeln (nicht verhandelbar)

1. **{FUEHRENDES_SYSTEM} ist die einzige Quelle der Wahrheit fuer {WAHRHEITS_GEGENSTAND}.** Die App
   liest und schreibt ueber die {SCHNITTSTELLE} — nie eigenen {WAHRHEITS_GEGENSTAND} fuehren, bei
   Streit gewinnt immer {FUEHRENDES_SYSTEM}. *(Weglassen, wenn die App kein fuehrendes Fremd-System hat.)*
2. **NIE {VERBOTENE_DATEN} lesen oder speichern.** Nur {ERLAUBTE_DATEN}. Auch nicht "nur zum Testen".
3. **Jede {SCHREIB_AKTION} nur nach Bestaetigen-Klick.** Nie automatisch in {LIVE_ZIEL} schreiben.
   Jede Buchung wird protokolliert.
4. **KEINE `.github/workflows` ohne SA-Freigabe** — GitHub-Bau-Minuten sind Budget (firmenweit
   gedeckelt, waren schon leer). Gilt fuer jedes AI-Firma-Repo.
5. **Ports: Backend {PORT_BACKEND}, Frontend {PORT_FRONTEND}.** NIE 8000/8001/8010/3000-3002
   (SwissCare-CRM) und NIE die Ports eines anderen Kunden-Repos — pro Kunde eigener Port-Block,
   Registry: `C:\dev\ai-firma\kunden\UEBERSICHT.md`.
6. **Alle Nutzer-Texte auf Deutsch** (Umlaute als ae/oe/ue).

## Uebungs-Modus (MOCK_MODE)

`MOCK_MODE=true` (Standard-Wahl) = App laeuft komplett ohne {ECHT_SCHLUESSEL}, mit
{ANZAHL_PROBE} realistischen Probe-Daten ({PROBE_BESCHREIBUNG} — ein paar bewusst im Grenzbereich,
damit Ampeln/Alarme sichtbar werden). Erst mit echtem Schluessel und `MOCK_MODE=false` redet die App
mit {ECHT_SYSTEM}. Eigene DB je Modus (`{DB_UEBUNG}` / `{DB_ECHT}`), damit Probe-Daten nie den
Echt-Bestand beruehren.

## Verifikation (Definition von "fertig")

- Backend: `pytest` gruen **plus** echter `curl`-Aufruf gegen die laufende App.
- Frontend: echter Browser-Klick auf die laufende Seite.
- **NIE einen Build allein als Test zaehlen.**

### Anti-Fail-Riegel (aus 14 CRM-Fehlerklassen destilliert — gilt fuer jeden Kunden-Bau)

1. **Zombie-Riegel:** Vor JEDEM Beweis `curl :{PORT_BACKEND}/readiness` — `gestartet_um` muss
   JUENGER sein als die letzte Code-Aenderung, sonst serviert der Prozess alten Code (trotz
   --reload). Start nur per HANDOFF-Rezept (venv-Python, --reload, aus backend/).
2. **Vor jedem Push:** `git status --short` muss LEER sein — jede `??`-Zeile unter backend/app oder
   frontend/src ist ein Stopp (main.py darf nie ohne seine importierten Module hochgeladen werden).
   Ein lokaler pre-commit-Hook blockt Konflikt-Marker (`<<<<<<<`).
3. **Klassen-Regel:** Jeder Befund ist eine KLASSE — grep ueber die ganze App, Rapport-Pflichtzeile
   "Klasse: N gefunden, N gefixt". Doppelte Logik toeten, nicht angleichen (Schwellen/Formeln nur an
   EINER Stelle — Backend, nicht Frontend-Doppel).
4. **Haerte-Probe fuer Tests:** Fix ausbauen/Konstante verfaelschen → mindestens 1 Test muss rot
   werden. Sonst deckt der Test den kaputten Fall nicht ab (Grenzwert-Test ergaenzen).
5. **Echt-Modus-Pflichtsatz:** Bis zum ersten bewiesenen echten {ECHT_SYSTEM}-Aufruf steht in JEDEM
   Rapport woertlich "Echt-Modus nicht am Schirm gesehen" — alle Tests decken nur den Mock ab.

## Antwort-Format

Fuer SA gilt das Antwort-Format aus der globalen `~/.claude/CLAUDE.md` (Kopf-Zeile, Fazit oben,
Optionen A/B/C, Klartext, max 1 Frage). Hier NICHT duplizieren.

---

## Platzhalter-Legende (Kurz)

`{KUNDE}`/`{KUNDE_KUERZEL}`/`{KUNDE_RECHTSFORM}`/`{KUNDE_BRANCHE}`/`{KUNDE_ECKDATEN}` = Kunde ·
`{PRODUKT_NAME}`/`{PRODUKT_TYP}` = was gebaut wird · `{FUEHRENDES_SYSTEM}`/`{SCHNITTSTELLE}`/
`{ECHT_SYSTEM}`/`{ECHT_SCHLUESSEL}` = Fremd-System, an das angebunden wird ·
`{WAHRHEITS_GEGENSTAND}`/`{ERLAUBTE_DATEN}`/`{VERBOTENE_DATEN}`/`{SCHREIB_AKTION}`/`{LIVE_ZIEL}` =
Daten-Grenzen · `{PORT_BACKEND}`/`{PORT_FRONTEND}` = Ports (Registry pflegen!) ·
`{ANZAHL_PROBE}`/`{PROBE_BESCHREIBUNG}`/`{DB_UEBUNG}`/`{DB_ECHT}` = Uebungs-Modus.
