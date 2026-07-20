# Mittwoch-Besuch Finelli (22.07.) — Plan + offene Fragen

> Stand 2026-07-18 spaet. SA-Ansagen: (a) V1 = Logistik-Kern + Verkaufs-Datenbank (siehe HANDOFF Scope-Pivot), (b) OHNE Routinen ist alles in 2 Wochen zurueck bei 80% — Routinen + "System-Chef" vor Ort gehoeren zum Produkt, (c) Mittwoch vor Ort: alles vorher planen, Preis nennen, dann bauen.

## Mittwoch-Programm (Vorschlag)

1. Demo zeigen (Cockpit laeuft mit Probe-Daten — Start-Rezept in HANDOFF.md).
2. Lager-Begehung Embrach + Laden: Fotos von Regalen/Stangen/Etiketten machen.
3. Hardware-Check: was ist da (PC/Tablet/Drucker/Scanner/WLAN), was fehlt.
4. Routinen mit dem Team festlegen: Scan bei Eingang, Scan beim Packen, Wochen-Zaehlung; EINE Person als System-Chef benennen.
5. Zaehl-/Etikettier-Tag terminieren (Grundordnung, 1-2 Tage). **Arbeitsteilung (SA 19.07,
   steht so im Angebot v5):** Khawars Team zaehlt/etikettiert/raeumt ein (mind. 1 Arbeitskraft,
   Daniya?) — WIR leiten an, richten alles ein, schulen. Wir zaehlen NICHT selbst.
6. Startkunden-Blatt + Vertrag-Entwurf besprechen, Abnahme-Liste ausfuellen, Shopify-Schluessel einrichten (docs/SHOPIFY-ZUGANG.md).

## Fragen an SA (er kennt den Laden seit Tag 1) — Antworten hier eintragen

1. Embrach: Regale/Stangen/Faecher, beschriftet, wie viele Plaetze? →
2. Laden: Nachschub-Lager wo? →
3. Hersteller-Barcodes an der Ware vorhanden? →
4. Geraete vor Ort (PC/Tablet/Drucker/Scanner)? WLAN Embrach? →
5. Hardware-Kosten-Einwand geklaert? (Nummern MUESSEN pro Groesse-Farbe ~200 sein, nicht 60 pro Modell) →
6. Team: wie viele, Sprachen, Technik-Fitness? →
7. Wer wird System-Chef vor Ort? →
8. Realistische Routinen (Eingang-Scan/Pack-Scan/Wochen-Zaehlung)? →
9. Online-Bestellung → Packer: wie laeuft das heute? →
10. B2B-Bestellungen: Kanal + wer packt? →
11. Drops pro Jahr + Stueck pro Drop? →
12. Shopify ~500/Mt: welcher Plan, welche Apps? (Ziel: runterstufen statt ersetzen!) →
13. Mittwoch: Zeitfenster + wer ist da? →
14. Mittwoch-Programm oben ok? →

## Strategie-Ansagen (ehrlich, im Chat begruendet)

- **Shopify NICHT ersetzen** — Plan runterstufen pruefen (500 → 30-80?), Ersparnis finanziert unser Abo. Ablösung = Monate + Risiko, kein Hebel.
- **Fertig-Code**: nutzen wir schon (Shopify-API, POS, Barcode-App, CRM-Bausteine). Eigenbau nur wo kein Fertigteil existiert: Lagerplaetze + Pickliste + Verkaufs-Journal.
- Etiketten pro GROESSE-FARBE (~200 Codes), nie pro Modell — sonst ist die Groessen-Zaehlung tot.

## SAs Antworten (18.07 nacht, diktiert + entwirrt)

1. Lagerplatz-Beschreibung: SA kannte den Begriff nicht → Schema definiert: **Zone-Regal-Fach** (z.B. E-R2-F3) + Stangen S1... Khawar muss nur melden: Anzahl Regale, Faecher pro Regal, Stangen.
2. Laden: Hinterraum + unten, viel Platz.
3. Etiketten: gesetzliche Textil-Etiketten (Marke/Herkunft) vermutlich ja — **Barcode unklar, Mittwoch pruefen**.
4. Geraete: unklar; Buero 5-10 Min entfernt, "dort sollte alles sein" — Mittwoch inventarisieren.
5. Scanner-Frage geklaert: EIN Code pro Groesse-Farbe (~200, wie Migros) — Scan zeigt sofort Artikel+Groesse+Farbe. SA einverstanden.
6. Team: 5 Leute gesamt; Tages-Verteilung unbekannt.
7. **System-Chef-Kandidat: Daniya (Khawars Bruder)** — Khawar muss bestaetigen.
8. Routinen-Wunsch SA: von UNSERER Seite automatische System-Pruef-Routine + Lager-Audit ("laeuft alles sauber") → Feature fuer Etappe Robustheit: Selbst-Waechter + Wochen-Zaehl-Aufgaben + Audit-Bericht. **WICHTIGER FUND: es existiert eine PACK-SOFTWARE, Name vergessen — Mittwoch identifizieren!** (sonst bauen wir am Ablauf vorbei)
10. B2B bestaetigt mit Zahlen: z.B. Metro kauft fuer 37, verkauft fuer 100. Kanal (durch Shopify oder daneben) WEITER OFFEN.
11. Drops: frueher 2/Jahr, aktuell unklar.
12. 500/Mt nur Shopify, "wird nicht sauber gefuehrt" → Mittwoch gemeinsam in Shopify-Admin schauen (Plan/Apps/Runterstufung). Claude-Shopify-Verbindung: ja, via Schluessel.
13. Mittwoch: GANZER TAG. Vorbereitung Khawar: NICHT vorzaehlen (Doppel-Arbeit!) — stattdessen: Shopify-Bestandsliste exportieren + Fotos aller Regale/Stangen + Ware grob nach Modell sortieren. Zaehlung passiert EINMAL beim Etikettier-Tag.
14. Ziel: MVP/fertiges Produkt bis Mittwoch — **2-3 Bau-Tage verfuegbar**.

## VORBEREITUNGS-NACHRICHT AN KHAWAR (SA schickt vor Mittwoch)

Khawar soll VORHER zusammenstellen (nicht vorzaehlen — Doppel-Arbeit!):
1. **Shopify-Bestandsliste exportieren** (Artikel + Mengen).
2. **Fotos** aller Regale, Stangen, Faecher — auch Hinterraum/Laden.
3. **Ware grob nach Modell sortieren** (Zaehlung passiert EINMAL beim Etikettier-Tag).
4. **SW-Kosten-Liste (SA-Ansage 18.07):** ALLE Software/Apps, die Finelli nutzt, mit
   Monatspreis je Tool — Shopify-Plan, Shopify-Apps/Add-ons, Pack-/Versand-Software,
   Buchhaltung, Kassen-System, Newsletter, alles. **Warum:** Mittwoch sehen wir schwarz
   auf weiss, wo wir ihm Geld sparen (Tool ersetzen oder Shopify-Plan runterstufen) —
   die Ersparnis finanziert unser Abo. Starkes Verkaufs-Argument + Grundlage fuer die
   spaetere Buchhaltungs-Frage.
5. Falls er's vorher weiss: **Name der Pack-Software** (sonst Mittwoch vor Ort klaeren).

## BAU-ZIEL BIS DIENSTAG (fuer den naechsten Chat — PRIO vor allem anderen)

Logistik-V1 im Uebungs-Modus fertig + klick-bewiesen:
1. **Lagerplatz-Verwaltung**: Datenmodell Variante→Platz (Zone-Regal-Fach/Stange), Plaetze anlegen/zuweisen, Uebersicht zeigt Fundort.
2. **Pickliste**: aus Bestellungen (Mock; echt via Shopify sobald Schluessel) — pro Position Fundort anzeigen, Scan/Klick-Bestaetigung beim Picken, Fehl-Pick warnt.
3. **Verkaufs-Journal**: jede Abbuchung (Verkauf/Umlagerung/Korrektur) pro SKU mit Zeitstempel abfragbar — Tages/Wochen-Sicht.
4. Etiketten-Vorbereitung: Code-Liste (~200) generierbar + druckbare Bogen-Ansicht (Browser-Druck) als Notloesung, falls Mittwoch schon etikettiert wird.
Abnahme wie immer: pytest + Browser-Klick-Beweise + Neustart-Beweis. KI-Etappe bleibt geparkt.
