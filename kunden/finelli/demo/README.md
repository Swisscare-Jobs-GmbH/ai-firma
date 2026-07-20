# Finelli Verkaufs-Demo (Uebungs-Modus)

> Erstellt 2026-07-20 durch Workspace-Session AB (Konzept-Panel -> Opus-Bau -> 3 Pruefer -> Fixer).
> Gehoert zu: [README (Kunden-Stand)](../README.md) · [ausbau-plan](../2026-07-18-finelli-ausbau-plan.md) ·
> [schmerz-landkarte](../2026-07-18-finelli-schmerz-landkarte.md) ·
> Produktions-Repo: `brain/_cross-ref/FINELLI-LAGERVERWALTUNG.md`.

## Was das ist

**Eine selbsttragende HTML-Seite** (`index.html`) fuer den Vor-Ort-Termin (Mi 22.07.2026):
Sie zeigt Khawar am Handy/Tablet, was bei Finelli automatisiert werden kann — Bestellung->
Post-Etikette (laeuft heute schon, bleibt!), Lagerplaetze, Cross-Standort-Suche, Scan mit
Doppelklick-/Offline-Schutz, Ausbau-Landkarte — und sammelt dabei die 7 Klaerungsfragen ein
(WP01 des Produktions-Projekts). **Er klickt selbst — Beweis statt Versprechen.**

## Oeffnen

Doppelklick auf `demo/index.html` (jeder Browser, KEIN Internet noetig, keine Installation).
Notizen zu den Klaerungsfragen bleiben lokal im Browser gespeichert (localStorage);
"Antworten kopieren" holt sie als Text heraus.

## Harte Regeln dieser Demo (Warum: Fakten-Live-Regel + Panel-Funde 19.07)

- **Nur Beispieldaten** (Uebungs-Modus-Prinzip, am Kalendertag verankert — friert nie ein).
  Keine echten Finelli-Zahlen, keine Endkunden-Daten, keine Review-/Sterne-Zahlen.
- **Keine Deal-Zahlen** — Preise/Garantien stehen NUR im Angebot V6 (bereits ueberreicht).
  Ungeklaerter Deal-Zahlen-Widerspruch (Deal-Strategie vs. V6-Blatt) darf hier nicht einzementiert werden.
- **Ersetzt nichts:** Angebot V6 "Momente" + Blatt 2 bleiben die Verkaufs-Dokumente —
  die Demo ergaenzt sie als klickbarer Beweis.
- **Keine Phase-1-Uebertreibung:** keine Dashboards/Prognosen als Leistung des ersten Schritts;
  keine KI, die Bestand bucht (assistiert nur — Khawar bleibt der Boss).
- Aenderungen an der Demo: Verbote in `index.html`-Kopfkommentar beachten, danach Klick-Beweis
  wiederholen (`klick-beweis-demo-2026-07-20.md`).

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Pitch-Seite (Momente + Werkbank + 7 Fragen) — verlinkt am Ende auf die App-Vorschau |
| `app.html` | **App-Simulation "Cockpit — Vorschau"**: PIN-Login (Demo-PIN 2019), Dashboard mit Ampeln, Bestand mit Umlagern/Korrektur, Bestellungen mit Post-Etiketten-Status + Pickzettel, Scannen, Frag Finelli, Wochen-Bericht, gesperrte Auswertungen. Khawar probiert die "fast fertige App" selbst aus. NEU 20.07: Design wie das Praesentations-Deck (flach, Serifen-Titel), Lagerraum-Karte nach jedem Scan (Embrach 3 x 5 m von oben, leuchtender Punkt am Lagerplatz) + Groessen-Farben (S gruen, M rot, L gold, XL blau) in Karte, Fach-Ansicht und Bestand-Matrix. |
| `klick-beweis-demo-2026-07-20.md` | Klick-Beweis Pitch-Seite + Vorfuehr-Drehbuch |
| `klick-beweis-app-2026-07-20.md` | Klick-Beweis App-Simulation + Vorfuehr-Drehbuch |
| `klick-beweis-*.png` | Bildschirm-Beweise aus dem echten Browser |

Empfohlene Reihenfolge am Termin: Pitch-Seite (Momente) -> Werkbank -> **App-Vorschau**
(er klickt selbst durch "seine" App) -> 7 Fragen ausfuellen.
