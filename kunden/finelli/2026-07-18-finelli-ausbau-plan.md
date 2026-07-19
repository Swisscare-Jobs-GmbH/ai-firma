# Finelli — Ausbau-Plan Voll-Vision (18.07)

> Erstellt 2026-07-18 durch HQ-Research (4 Spaeher: Kassen-Wege, Scan/Etiketten, Analysen, Fertig-Bausteine + Roadmap-Rechner).
> Gehoert zu: [Feinplan V1](2026-07-18-finelli-feinplan.md) - [Antworten R2](2026-07-18-finelli-antworten-runde2.md).
> SA-Bestaetigung 18.07: Varianten-Logik (1 Artikelnummer pro Groesse-Farbe + Anzahl, Verkauf zaehlt runter) = gesetzt.

# Finelli — Ausbau-Plan Voll-Vision (Stand 18.07.2026)

## 1. Fazit

**Ja, Khawars Voll-Vision ist machbar — aber der kluegste Weg ist: Kasse und Wochen-Berichte FERTIG von Shopify nehmen (kostet fast nichts), nur Scan-Wareneingang und Verteil-Analyse selbst bauen.**
Beim Kassen-Problem gibt es genau EINE Empfehlung: **Shopify POS Lite** — schon im bezahlten Shopify-Abo gratis drin, bucht jeden Laden-Verkauf automatisch ab, die 20%-Fehlerquelle ist strukturell zu (shopify.com/pos/pricing).
Reihenfolge getauscht: **Kasse zuerst (V2)**, denn solange 20% der Verkaeufe falsch gebucht sind, rechnet jede Analyse mit falschen Zahlen. Gesamt fuer uns: **CHF 15'500 einmalig + 149/Monat**, alles in ~10-14 zusaetzlichen Bau-Tagen.

---

## 2. Das Kassen-Problem — 3 Wege

**Fazit: Weg A gewinnt haushoch. Ehrlich gesagt: ein eigenes Kassen-Produkt (Khawars Idee c) waere fuer uns mehr Umsatz, aber fuer Finelli wirtschaftlich unsinnig — das sagen wir ihm so.**

| Weg | Einmalig | Monatlich | Bau-Tage | Urteil |
|---|---|---|---|---|
| **A — Shopify POS Lite** (Kassen-App auf iPad/Handy, SumUp bleibt reines Kartengeraet als „externe Zahlung") | CHF 0 (evtl. gebrauchtes iPad) | CHF 0 extra (im Abo drin) + Kartengebuehr | 1-2 (nur Einrichtung + Schulung) | ✅ **Empfehlung** — Verkauf bucht Artikel automatisch ab, Fehlerquelle strukturell zu |
| B — SumUp behalten + API-Anbindung bauen | CHF 0 Hardware | ~CHF 0 fix + SumUp-Gebuehr | 3-6 | ❌ Wacklige Kruecke: braucht genau die Tipp-Disziplin, die heute fehlt, plus doppelte Pflege der 200 Varianten (SumUp-API hat keine Katalog-Verwaltung, developer.sumup.com/api) |
| C — Eigene Kasse bauen (Khawars „Kassenprodukt") | grob CHF 15'000-30'000 Gegenwert | Cloud + Terminal-Gebuehren + Dauerpflege | 15-30+ | ❌ Unsinnig fuer 1 Laden: fertige CH-Kassen kosten 0-69 CHF/Mt. (Paymash CHF 69, helloCash ab gratis), rechtlich zwar erlaubt (CH hat keine Fiskalisierungs-Pflicht), aber null Vorsprung fuer Wochen Arbeit |

**Wichtig fuer das Gespraech mit Khawar:** Kartenzahlung laeuft anfangs weiter ueber das vorhandene SumUp-Geraet — der Verkauf wird in der POS-App als „extern bezahlt" markiert. Ob Shopify-Kartenleser (WisePad 3, CHF 64) in der Schweiz wirklich lieferbar sind, ist widerspruechlich belegt (Hardware-Shop de-ch sagt ja, Community-Thread sagt nein) → vor Bestellung 10 Min pruefen.

---

## 3. Stufen-Plan V1-V4 (Reihenfolge: Kasse VOR Scan — sie stoppt die Fehler sofort)

**Fazit: Jede Stufe einzeln verkaufbar, jede lohnt sich fuer uns. V1 war mit ~275 CHF/Tag ein Kampfpreis — ab V2 rechnen wir fair mit ~750-900 CHF/Tag (Markt: CH-Agenturen 160-200+ CHF/Stunde = 1'300-1'600/Tag, magicheidi.ch — wir bleiben also immer noch klar drunter).**

| Stufe | Was drin ist | Bau-Tage | Preis Khawar | Monatlich dazu |
|---|---|---|---|---|
| **V1** (laeuft) | Cockpit: 2-Lager-Uebersicht, Umlagern, Korrektur, KI-Bestell-Vorschlag, Chat | ~14.5 | **CHF 4'000** (fix) | CHF 149 Betrieb |
| **V2 Kasse** | Shopify POS Lite einrichten: Standorte, Katalog, Schulung, Testverkaeufe | 1-2 | **CHF 1'500** pauschal | CHF 0 (POS Lite gratis) |
| **V3 Scan+Etiketten** | Wareneingangs-Maske (Scan → +1 im richtigen Lager), Etiketten via Shopify-Gratis-App „Retail Barcode Labels", USB-Scanner tippt wie Tastatur | 4-5 | **CHF 4'500** + Hardware ~CHF 250-450/Standort (Scanner ~130 arp.ch, Drucker ab 116 toppreise.ch) | CHF 0 (nur Etiketten-Rollen) |
| **V4 Analyse** | Verteil-Empfehlung Store vs. Embrach, Ladenhueter-Ampel, Kollektions-Auswertung — nur Produkt/Menge/Standort/Datum, keine Kundendaten (Shopify Level-1, immer erlaubt) | 5-7 | **CHF 5'500** | CHF 0-10 |

**Fabrik-Trick fuer V3:** Hangtags mit Barcode ab Werk bestellen (~$0.07/Stueck, weprintbarcodes.com) — dann entfaellt das Selber-Etikettieren beim Wareneingang fast komplett, gescannt wird nur noch zum Einbuchen. Kostet Finelli fast nichts, spart jede Woche Arbeit.

---

## 4. Was wir NICHT bauen (fertig kaufen/kopieren)

- **Kasse** → Shopify POS Lite, CHF 0 (im Abo; shopify.com/pos/pricing). Eigenbau waere 15-30 Tage fuer null Vorsprung.
- **Wochen-Berichte „was lief wie oft"** → schon im Shopify-Advanced-Plan enthalten (Berichts-Baukasten ShopifyQL; help.shopify.com). 0 Bau-Tage, nur ~0.5 Tag Einrichtung — steckt im V4-Paket.
- **Barcode-Erzeugung + Etiketten-Druck** → Shopify-Gratis-App „Retail Barcode Labels" (Code 128 pro Variante, druckt auf Zebra/Dymo/Avery). Grenze: kein Massendruck — falls das nervt, bauen wir spaeter fuer 2-3 Tage eigenen Druck via gratis Zebra Browser Print nach.
- **Scan-Software** → keine noetig: USB-Scanner (~CHF 130) „tippt" den Code wie eine Tastatur in jede Web-App.
- **Finger weg von:** Odoo/ERPNext (Anpassung ~ab 18'000 USD Marktwert, dritte Daten-Insel), Erply (ab 59 USD/Mt., loest das Sync-Problem nicht), SumUp Stock Sync (kann keine 2 Standorte, schlechte Bewertungen), **Stocky** (Shopify schaltet die App am 31.08.2026 komplett ab — darauf darf nichts gebaut werden).

---

## 5. Einzel-Stueck-Nummern — ehrliche Antwort fuer Khawar

**Varianten-Ebene reicht: 1 Barcode pro Groesse-Farbe (~200 Codes), jedes physische Teil traegt diesen Code, das System zaehlt Mengen.** Das ist Branchen-Standard fuer kleine Modemarken (shopify.com/blog/sku-vs-serial-number). Die 20% Fehler verschwinden durch SCANNEN (Wareneingang + Kasse), nicht durch Seriennummern.

Echte Einzel-Stueck-Nummern (jedes Teil eigene Nummer + eigene Datenbank-Zeile) wuerden **10-15 Bau-Tage extra kosten (~CHF 9'000-13'500)** — fuer **null Gewinn bei der Bestands-Genauigkeit**. Die Branche nutzt das nur bei Limited Editions, Garantie-Ware oder Diebstahl-Nachverfolgung. Khawar so sagen: „Jedes Stueck bekommt ein Etikett und wird gescannt — genau deine Vision. Nur die Nummer dahinter ist pro Groesse-Farbe, nicht pro Einzelteil. Das macht fuer deinen Bestand keinen Unterschied, spart dir aber ueber 9'000 Franken."

Und ehrlich zu „200% akkurat": realistisch sind **95-99%** — Rest-Fehler (Diebstahl, Umtausch, Bruch) bleiben und werden per Inventur-Zaehlung im Cockpit korrigiert. Das versprechen, nicht mehr.

---

## 6. Gesamt-Rechnung

**Fazit: Khawar zahlt einmalig ~CHF 15'900-16'400 (inkl. Hardware) und ~CHF 150-160/Monat — dafuer ist die komplette Voll-Vision (a)-(e) abgedeckt. Fuer uns: CHF 15'500 Honorar bei ~25-27 Bau-Tagen gesamt, Marge auf dem Monats-Betrieb ~110-135 CHF.**

| Posten | Betrag |
|---|---|
| Einnahmen fuer uns (V1-V4 Honorar) | **CHF 15'500** (4'000 + 1'500 + 4'500 + 5'500) |
| Khawars Einmal-Total | **~CHF 15'900-16'400** (Honorar + Scanner/Drucker ~250-450/Standort; evtl. + gebrauchtes iPad) |
| Khawars Monats-Total | **~CHF 150-160** (149 Betrieb aus V1 + 0-10 Cloud V4; Kartengebuehr pro Zahlung wie heute; optional spaeter POS Pro +69) |
| Unsere Monats-Kosten | **~CHF 15-40** (Fly.io/Supabase/Vercel — bewaehrtes CRM-Setup) |

---

## 7. Risiken / Ehrlichkeit

- **CH-Kartenleser widerspruechlich belegt** (Shopify-Hardware-Shop sagt lieferbar, Community sagt nein) — aendert nichts am Plan (SumUp bleibt als Terminal), aber vor Hardware-Zusage pruefen. Exakte CH-Laden-Kartengebuehr: weiss nicht.
- **Bau-Tage V3/V4 sind eigene Schaetzungen** (keine Web-Quelle) — Puffer ist drin, aber Retouren-/Sonderfaelle koennen V3 Richtung 5-6 Tage schieben.
- **V4 lohnt erst NACH V2** — verkauft Khawar die Analyse vor der Kasse, rechnet sie auf 20%-Fehler-Daten. Reihenfolge ist nicht verhandelbar.
- **„200% akkurat" gibt es nicht** — wir versprechen 95-99% plus Inventur-Funktion, sonst bauen wir uns eine Erwartung, die niemand erfuellen kann.

## Anhang: Kassen-Empfehlung in 1 Satz

Shopify POS Lite als Laden-Kasse nehmen — ist im bestehenden Shopify-Abo schon gratis drin, bucht jeden Verkauf automatisch vom Laden-Bestand ab und stopft damit die 20%-Fehlerquelle strukturell (Quelle: shopify.com/pos/pricing). Kein eigenes Kassen-Produkt bauen: fertige Schweizer Kassen kosten 0-69 CHF/Monat, ein Eigenbau kostet 15-30+ Bau-Tage und schafft genau das Zahlungs-Risiko, das SA vermeiden will.
