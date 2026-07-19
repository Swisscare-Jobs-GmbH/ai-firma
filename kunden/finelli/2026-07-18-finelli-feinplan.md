# Feinplan FINELLI Lager-App (Arbeitstitel: „Finelli Cockpit")

> Erstellt 2026-07-18 durch HQ (3 Design-Linsen: schlank/AI-Wow/wartungsarm + Shopify-Machbarkeits-Check gegen offizielle Doku + Synthese).
> Gehoert zu: [Firmen-Profil](2026-07-18-finelli-firma-profil.md) · [SAs Antworten](2026-07-18-finelli-antworten-sa.md) · [MVP-Bericht](2026-07-18-finelli-logistik-research.md).
> Status: 🟡 wartet auf SA-Freigabe + Shopify-Zugang von Khawar.

## 1. Fazit

Wir bauen eine kleine Web-App auf dem bestehenden Shopify-Shop: Bestand beider Lager auf einem Bildschirm, Bestellen + Umlagern mit 2 Klicks, 3 echte KI-Funktionen (Claude). **~14.5 Bau-Tage, lieferbar in 2–3 Wochen.** Einnahme CHF 4'000 + ~CHF 149/Monat Betrieb — unsere Kosten laufen bei ~CHF 15–40/Monat (Hosting + KI), Rest ist Marge + Wartungspuffer.

## 2. Was Khawar sieht

1. **Login** — Name waehlen, PIN, drin (8 Leute, je eigener Zugang).
2. **Uebersicht** — alle 60 Artikel, Bestand Embrach + Laden nebeneinander, Ampel gruen/gelb/rot, Suchfeld, oben 1 KI-Satz zum Tag.
3. **Bestellen** — KI hat schon vorgeschlagen, was beim Hersteller nachbestellt werden soll (mit Grund pro Zeile); Mengen anpassen, Knopf druecken → fertige Bestellung als PDF/Mail raus.
4. **Umlagern** — Laden bestellt Ware aus Embrach: Artikel + Menge waehlen, App bucht einen echten Shopify-Transfer mit Status (unterwegs → angekommen). Das ist „das Lager kann Ware bestellen".
5. **Frag Finelli** — Frage-Feld: „Wie viele schwarze Hoodies in L im Laden?" — Antwort mit echten Live-Zahlen.
6. **Verlauf + Wochen-Blick** — alle Bestellungen/Umlagerungen mit Datum und Status, plus der Montags-Bericht zum Nachlesen.

## 3. Die AI drin (echt)

1. **KI-Bestell-Vorschlag** — Claude liest Verkaeufe + Restbestand aus Shopify und sagt pro Artikel „bestell X Stueck, weil…" in Klartext.
2. **Frag Finelli (Lager-Chat)** — jede Lager-Frage in normaler Sprache, Antwort mit echten Zahlen — der taegliche Wow-Moment.
3. **KI-Wochen-Bericht** — jeden Montag frueh per Mail: Top-Seller, Ladenhueter, Bestell-Tipp in 10 einfachen Saetzen.

*KI-Kosten: bei 60 Artikeln und ~8 Nutzern grob CHF 5–15/Monat (Claude API) — vernachlaessigbar.*

**Bewusst NICHT drin (Phase 2, nach den 4'000):** Lieferschein-Foto-Erkennung, Barcode, B2B-Portal fuer die 40 Laeden, Retouren-Modul (bei ~1 Retoure/Monat unnoetig).

## 4. So haengt es zusammen

Shopify bleibt der Chef ueber den Bestand — dort lebt er, nirgends sonst. Unsere App ist nur das Fenster: sie liest und bucht ueber die offizielle Shopify-Schnittstelle (Custom App, nur fuer diesen einen Shop, kein Review, kostenlos — laut Machbarkeits-Check alles offiziell vorhanden, inkl. echter Umlagerungs-Funktion). Nichts wird doppelt gepflegt; aendert jemand direkt in Shopify, zieht die App automatisch nach (Live-Melder + Nacht-Abgleich). Laeuft auf unserem bewaehrten Hosting-Muster aus dem CRM (~CHF 10–30/Monat).

## 5. Bau-Etappen

| Etappe | Was fertig ist | Bau-Tage |
|---|---|---|
| 1 (Woche 1) | Shopify angebunden + Umlagerungs-Rechte getestet + **Uebersicht mit Ampel live vorzeigbar** | 4 |
| 2 | Bestellen (PDF/Mail + Verlauf) + Umlagerung Embrach → Laden | 4 |
| 3 | KI-Bestell-Vorschlag + Wochen-Bericht | 2.5 |
| 4 | Frag Finelli (Lager-Chat) + Login fuer 8 Leute + Hosting | 2.5 |
| 5 | Robustheit: Live-Melder, Nacht-Abgleich, Selbst-Waechter (App meldet Stoerungen an UNS) + Abnahme mit Khawar | 1.5 |

**Total: ~14.5 Tage** — Etappe 1 liefert nach ~1 Woche etwas Klickbares fuer Khawar.

## 6. Geld

- **CHF 1'000 bei Start** — deckt Etappe 1–2 (er sieht nach 1 Woche die Ampel-Uebersicht live).
- **CHF 3'000 bei Abnahme** — wenn alle 5 Etappen laufen und Khawar selbst geklickt hat.
- **CHF 149/Monat Betriebs-Gebuehr** (Hosting + KI + Wartung + der jaehrliche Shopify-Schnittstellen-Nachzug). Begruendung: Shopify aendert die Schnittstelle alle 3 Monate — ohne Wartungsvertrag bricht die App irgendwann still, und wir arbeiten gratis; mit Gebuehr ist das gedeckt und wir haben wiederkehrenden Umsatz.

## 7. Top-3-Risiken

1. **Shopify-Zugang + Umlagerungs-Recht** — ohne Khawars Freischaltung startet nichts, und das Umlagerungs-Recht ist in Shopifys Doku lueckenhaft → am Tag 1 anlegen UND sofort einen Test-Transfer machen, nicht erst in Woche 2.
2. **Duenne Daten** — 60 Artikel × Groessen = wenige Verkaeufe pro Variante, und Shopify zeigt nur 60 Tage Verkaufs-Historie → App sammelt ab Tag 1 selbst Summen; KI-Vorschlaege als Hilfe verkaufen, nicht als Autopilot — Khawar VOR Vertragsabschluss sagen.
3. **Schreiben in den Live-Shop** — eine Fehlbuchung waere sofort im echten Shop sichtbar → jede Buchung nur mit Bestaetigen-Klick + Protokoll, nie automatisch; bei Streit gewinnt immer Shopify. Zusatz-Regel: wir lesen NUR Artikelzeilen, nie Kundendaten (sonst verlangt Shopify einen teureren Shop-Plan).

## 8. Naechster Schritt (SA konkret)

1. **Anruf mit Khawar (10 Min):** a) Klaeren, was „bestellen" fuer ihn heisst — Nachproduktion beim Hersteller UND/ODER Laden-bestellt-bei-Embrach (wir bauen beides, aber die Reihenfolge haengt an seiner Antwort). b) Lieferzeiten der Hersteller abfragen (braucht die KI). c) Betriebs-Gebuehr CHF 149/Monat ansprechen.
2. **Shopify-Zugang holen:** Khawar soll SA im Shopify-Admin als Mitarbeiter mit Recht „Apps entwickeln" hinzufuegen — ODER selbst eine Custom App anlegen mit diesen Rechten: *Bestand lesen/schreiben, Lagerorte lesen, Umlagerungen schreiben, Bestellungen lesen* (read/write_inventory, read_locations, write_inventory_transfers, read_orders) und uns den Zugangsschluessel sicher geben.
3. Sobald der Schluessel da ist: Tag-1-Test der Umlagerungs-Funktion, dann Baustart.
