# Finelli — Die 2 Software-Optionen, TECHNISCH (fuer den Termin 22.07)

> Diktiert von SA am 21.07, technisch geordnet (Opus 4.8). Zweck: Khawar zeigen, **was wir bauen
> koennen** — und WO wir anfangen. Beide Orte kommen im Vollausbau; die Frage ist der Startpunkt.
> Gehoert zu: [Lager-Layout-Rollen-Spec](2026-07-21-lager-layout-rollen-spec.md) ·
> [Hebel Logistik](2026-07-21-hebel-logistik.md) · [Prototyp](ki-mitarbeiter-prototyp/) ·
> Positionierung [E6 "AN der Firma"](../../brain/decisions/E6-positionierung-an-der-firma.md).

## Fazit / Grundsatz

- **Beide Orte (Laden + Lager) kommen** — das ist der Vollausbau. Offen ist nur der **Startpunkt.**
- Der Startpunkt ist zugleich der **Faehigkeits-Beweis** ("checkt, was wir koennen"). Darum:
  **Empfehlung — im Laden anfangen** (dreht Khawars eigenen "geht-nicht"-Satz live um), das
  **Lager-Radar als Vision-Folie** zeigen, aber nicht als Erstes bauen.
- **Beide Optionen stehen auf EINEM Fundament.** Ohne das bleibt alles Stueckwerk (Khawars
  Audit-Aussage Nr. 9: "Kasse muss mit Logistik verbunden werden").

**Status-Legende:** ✅ haben (Prototyp klickbar) · 🟡 Prototyp als Mock/Optik (echt = Ausbau) ·
🔴 neu bauen (nach dem Ja).

---

## 0. Das gemeinsame Fundament (Pflicht fuer BEIDE Optionen)

| Baustein | Wie es technisch geht | Status |
|---|---|---|
| **Eine Wahrheit statt zwei Apps** | Shopify (`read_all_orders`, Khawar-OK liegt vor) + Kasse spiegeln in EINE Bestands-DB; jeder Verkauf bucht sofort ab. | 🔴 der Kern-Bau — heute lesen wir Mock/CSV, kein Live-Sync |
| **Varianten-Datenmodell** | Modell × Groesse × Farbe × Ort/Fach. Muss ab Tag 1 stimmen — nachtraeglich = Umbau. | ✅ im Prototyp gebaut (`lib/snapshot.js`, `stammdaten.json`) |
| **Wareneingang-Scan** | Neue Ware am Eingang scannen → Bestand stimmt + Fach-Vorschlag. Ohne das kein sauberer Abverkauf. | 🔴 Scan-Logik neu (Kamera-App), Fach-Vorschlag ✅ vorhanden |
| **95–99 % genau, nicht 100 %** | Rest wird per Inventur-Scan korrigiert (ehrlich sagen, nicht ueberversprechen). | Inventur-Modus 🔴 |

> **Merke fuer die Praesentation:** Das Fundament ist unsichtbar, aber es ist der eigentliche Wert.
> Beide Show-Optionen unten sind nur so gut wie diese eine Wahrheit darunter.

---

## Option 1 — Im LADEN anfangen (Shop-Logistik)  ← Empfehlung als Startpunkt

**Der Beweis-Satz:** Khawar hat gesagt *"Groesse in Embrach finden? — praktisch nicht moeglich."*
Das drehen wir live um.

| # | Was Khawar will (seine Worte) | Wie es technisch geht | Status |
|---|---|---|---|
| 1 | In welchem **Fach** welcher **Artikel** in welcher **Groesse** liegt | Scan/Eingabe SKU → Anzeige Bestand je Ort (Front `A*` / Reserve `R*` / UG `U*` / Embrach) + Fach-Chip + Farbpunkt der Groesse | ✅ Tab **Laden-Scan** + **Handy-Scan** |
| 2 | **Jedes Regal beschriftet** — welcher Artikel wo | Fach-Code + einheitliche **Groessen-Farb-Legende** (XS violett … XXL grau). Etiketten-Druck fuer die physischen Regale | Legende ✅ · Etiketten-Druck 🔴 |
| 3 | Paar Stueck verkauft → System sagt **"hol Nachschub"** | Front-Bestand faellt unter Schwelle → Hinweis "aus Reserve `R3` / UG `U3` nachfuellen" (Ware ist schon im Haus) | 🟡 Logik vorhanden (Hinweis-Typen), Front-Schwelle 🔴 |
| 4 | **Woechentliche KI-Sitzung**: "dieses Kleine raus, jenes rein" | Manager-Bericht schlaegt Sortiment-Wechsel vor (Ladenhueter raus, Renner rein); Mensch entscheidet, System merkt sich die Regel | ✅ Manager-Berichte · Regel-Merker 🟡 |
| 5 | **Neue Kollektion**: reinkommen → einscannen → wenn freigegeben "haeng sie HIER auf" | Wareneingang-Scan legt Artikel an; nach Freigabe (Khawar/KI) → **Einraeum-Anweisung** je Ort/Fach (UG mit Plan-Datum "haengt ab 04.08.") | Plan-Datum ✅ (JACK-01) · Einraeum-Flow 🔴 |
| 6 | Khawar **steuert vom Buero** aus alles | Web-App, orts-unabhaengig; Manager-/Logistik-Ansicht zeigt alle 4 Orte auf einen Blick | ✅ Tab **Logistik** + **Uebersicht** |

**Warum als Startpunkt:** kleiner, Khawars Heimspiel (er fuehlt's taeglich), loest einen
"unmoeglich"-Schmerz sofort — und baut nebenbei das Fundament (eine Wahrheit), das spaeter das Lager traegt.

---

## Option 2 — Software im LAGER (Embrach, Online-Fulfillment)  ← das Wow, als Vision zeigen

**Der Wow-Moment:** der Packer oeffnet einen Bildschirm und "sieht" das Lager.

| # | Was Khawar will (seine Worte) | Wie es technisch geht | Status |
|---|---|---|---|
| 1 | Lager **geraeumt**: Trend/viel-verkauft **vorne**, Saison/nicht-wettergerecht **hinten** | Zonen: Packzone `P*` (A-Seller nah am Packplatz) · Standard `S*` · Saison `W*` · Langsamdreher `L*`. Slotting-Hinweis wenn A-Seller nicht in `P*` | ✅ Zonen + Slotting-Hinweis |
| 2 | Picker laeuft **weniger** | Top-Seller ans Packtor → minimale Laufwege; Pickliste in Fach-Reihenfolge | ✅ Layout-Logik |
| 3 | Bestellung **anklicken** → links Artikel + **Bild** + Groesse, rechts **Farbe** + **Weg** | Pack-Auftrag öffnen → Pickliste mit Farbpunkt + fetter Groesse + Fach; 2D-Karte hebt Ziel-Fach hervor | ✅ Tab **Packstation** (Bild = 🔴 Produktfotos anbinden) |
| 4 | **2D-Karte** mit rotem Punkt / Leuchten | CSS-Grid des Embrach-Lagers; Ziel-Faecher leuchten violett | ✅ statische Karte, Faecher leuchten |
| 5 | **Radar wie auf Schiffen** (Sonar-Sweep) + Live-**Position der Person** | ⚠️ **Zwei Dinge trennen:** (a) Ziel-Fach + Weg zeigen = machbar, kein Hardware. (b) *Live-Position des Menschen* braucht Indoor-Ortung (BLE-Beacons/UWB = **Zusatz-Hardware**). Der Sonar-Sweep selbst ist reine Optik (billig). | (a) ✅ · (b) 🔴 Hardware · Sweep-Optik 🟡 |
| 6 | Gross genug zum **Nachschauen an der Shelf** + **Handy**-Anbindung | Responsive; am Fach nochmal Karte + Position; Handy-Ansicht | ✅ Handy-Scan-Rahmen vorhanden |
| 7 | Jedes Produkt **Sticker** drauf, **bestaetigt**, **gemessen** | Etikett/Barcode je Variante; Pack-Timer misst Ø-Tempo | Timer ✅ · Etiketten-Druck 🔴 · **Tempo-Messung: CH-Arbeitsrecht vor Zusage klaeren** |

---

## Gilt fuer BEIDE: Auto-Nachschub / Nachproduktion

| Was Khawar will | Wie es technisch geht | Status |
|---|---|---|
| System merkt "hat's nicht mehr viel" → **nachbestellen**, weil Hersteller **14–35 Tage** braucht | KPI-Experte rechnet Meldebestand = Ø-Absatz × (Lieferzeit + Puffer); Alarm "bestell jetzt N bei Hersteller Y, sonst leer in Z Tagen" | ✅ Rechenkern fertig (getestet), Lieferzeiten muss Khawar liefern |
| **Online-Shop foerdern** (Renner rechtzeitig in den Laden / online sichtbar) | Hinweis `laden_holen` (online-Renner, im Laden leer → vorholen) | ✅ vorhanden |

---

## Bewusst NICHT im ersten Schnitt (ehrlich — nicht ueberversprechen)

| Idee (aus dem Diktat) | Warum spaeter / separat |
|---|---|
| **Soft-Facts + Kunden-Tracking** (Verkaeufer schaetzt Alter/Herkunft; Kundin fuellt fuer Rabatt aus; "Migros-Tracking wo geht der Kunde hin") | Das ist **Retail-Analytics, nicht Logistik** — eigene Baustelle. **Datenschutz-Haken: revDSG** (Personendaten, Einwilligung). Sauber trennen, spaeter, mit Rechts-Check. |
| **Radar mit Live-Personen-Position** | Braucht Indoor-Ortungs-Hardware (Beacons). Nutzen (Ziel-Fach + Weg) geht auch ohne — erst das, Hardware spaeter falls gewuenscht. |
| **Etiketten-/Post-Druck** | Zebra-Druck + Post-Geschaeftskunden-Vertrag (kein Test-System, ~3 Tage) — frueh anstossen, aber nicht im ersten Schnitt. |

---

## Was wir MORGEN wirklich zeigen koennen (Prototyp-Stand 22.07)

- **Laden-Scan + Handy-Scan** (Option 1) — klickbar, echter Beweis-Moment.
- **Packstation** (2D-Karte, Pickliste, Timer) + **Logistik** (Empfehlungen, Lager-Landkarte) (Option 2) — klickbar als Mock.
- **Uebersicht/Berichte** der 3 KI-Mitarbeiter — klickbar.
- `node tests/test.js` → **24/24 gruen**. Start: `node server.js` → http://127.0.0.1:8030.

> Vor der Demo einmal "Mock neu wuerfeln" (Historie auf den Kalendertag verankern) ODER echte
> Verkaufsdaten reinfuettern (Shopify-CSV, siehe Prototyp-README).

---

## Wo wir improvisieren / annehmen (VOR ORT klaeren — nicht raten)

1. **Reale Fach-Anzahl + Namen je Ort** — morgen vor Ort aufnehmen (heute Vorschlag `A/R/U/P/S/W/L`).
2. **Groessen-Farb-Standard** — unser Vorschlag steht, Khawar darf umaendern.
3. **Scanner im Laden?** — SA-Entscheid: eigene **Handy-Kamera-App**, kein USB-Scanner.
4. **Hersteller-Lieferzeiten + MOQ** — Khawar liefert (Meldebestand rechnet erst dann echt).
5. **Ziel-Reichweite** (Wochen Vorrat) — an der Sitzung fixieren.
6. **Tempo-Messung** — mit Team besprechen, Prozess- nicht Personenkontrolle (CH-Arbeitsrecht).
