# Phase 4 — Angebot

> Ziel: 1 Seite A4, die {KUNDE} zum Ja bringt — nie negativ eroeffnen, Stolz zuerst, Preis zuletzt.
> Dauer: ~0.5 Tag. Design-Vorlage: `vorlagen/angebot/`. Pflicht-Haltung: `sa-angebots-doktrin-verkauf`.
> **V2 (20.07.2026): Voller End-zu-End-Prozess inkl. Blatt-2-Architektur, Richter-Workflows,
> Beweis-Pipeline und Checkliste jetzt in `erst-offerte-prozess.md`** — dieses File ist der
> Kompass, jenes die Strassenkarte.

## Fazit

Die Reihenfolge ist alles. **Erst Stolz + Wert, ganz am Ende erst der Preis.** Wer mit dem Preis oder
einem Problem eroeffnet, hat verloren. Hormozi-Reihenfolge, dann ein 3-Richter-Panel drueber.

## Die Hormozi-Reihenfolge (so ist das Blatt aufgebaut)

| # | Block | Inhalt |
|---|---|---|
| 1 | **Stolz-Einstieg** | Mit BELEGTEN Zahlen aus Phase 0/1 (Reviews, Umsatz, Erreichtes) — nie negativ eroeffnen. |
| 2 | **Momente die du kennst** | Pain gedeutet: benennen → ENTSCHULDEN ("das ist nicht deine Schuld") → **"Ab sofort:"-Wende.** |
| 3 | **Beweis** | Die laufende App / Demo — was V1 konkret loest. |
| 4 | **Aufwand ~0** | Fuer den Kunden: wir richten ein, schulen, warten. Sein Aufwand minimal. |
| 5 | **Preis** | Erst JETZT. **V2-Korrektur (Richter-Fund Finelli 19.07):** Wert-Stack MIT geschenkten Posten → Marktwert-Summe sichtbar UEBER dem Preis (z.B. 24k → 18k). Summenzeile = **"Dein Preis als Kunde Nr. 1 / Startkunden-Preis"** — das Wort "Selbstkosten" ist VERBOTEN (redet den Wert klein, Wert=Preis ist Anti-Hormozi). Agentur-Anker (30k+) separat. |
| 6 | **Ein-System-Botschaft** | "Alles inbegriffen, keine Extra-Abos." Bestehendes NICHT ersetzen — aufsetzen. |
| 7 | **Joker** | Kunden-Joker: **markt-ueblich 10% vom Erstauftrag des vermittelten Kunden, auf seine Kosten angerechnet** (SA-Entscheid 19.07 — ersetzt die alte 50%-Anrechnung; muss die Servietten-Rechnung ueberleben: "ganze Monats-Raten zahlen andere fuer dich"). + Versions-Leiter als Ausblick. |
| 8 | **"Du entscheidest"-Frame** | Kunde hat die Wahl — kein Druck. **Ehrliche Verknappung ist PFLICHT, wenn wahr:** "Kunde Nr. 1 gibt es genau einmal. Am {Datum} klickst du selbst." Kein Blatt endet ohne Verknappung + Datum + naechsten Schritt (Richter-Fund 19.07). |

## Das "Momente"-Muster (Herzstueck)

Jeder Schmerz aus Phase 1 wird zu einem "Moment": **benennen** ("du sitzt abends und rechnest im Kopf,
was heute raus ist") → **entschulden** ("das ist nicht dein Fehler, dafuer gab es nie ein Werkzeug") →
**wenden** ("ab sofort: ein Knopf, und der Wochen-Bericht liegt da"). Belegt mit den woertlichen Zitaten
+ Zahlen aus der Schmerz-Landkarte.

## PFLICHT: Judge-Panel (3 Richter) vor dem Druck

Bevor das Angebot als PDF rausgeht, laeuft ein 3-Richter-Panel drueber:
1. **Hormozi-Richter** — stimmt die Wert-Reihenfolge, ist der Preis am Ende?
2. **Menschen-Natur-Richter** — fuehlt es sich fair + risikolos an, oder nach Masche?
3. **DISC-Richter** — passt der Ton zum Kunden-Typ?

Das Panel fing bei Finelli die "Marktwert = Ratensumme"-Falle VOR dem Druck ab — billigste Versicherung
vor jedem Kunden-PDF. Workflow: `.claude/skills/` (Angebots-Judge-Panel). Funde werden eingearbeitet, DANN gedruckt.

## Fakten-Live vor dem Druck

Jede Zahl im Blatt noch einmal LIVE gegenpruefen (Reviews, Referenzen) — siehe Fakten-Live-Regel in `CLAUDE.md`.

## Druck

1 Seite A4 im bekannten Schwarz-Weiss-Stil. HTML-Vorlage (`vorlagen/angebot/`) → Edge headless
`--print-to-pdf`. Keine 750KB-Bild-PDFs — nur die HTML-Quelle pflegen.

## Ergebnis dieser Phase

Fertiges 1-Seiten-Angebot (PDF) in `kunden/{KUNDE}/`, Judge-Panel durch, alle Zahlen belegt.
