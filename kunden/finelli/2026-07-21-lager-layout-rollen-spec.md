# Finelli — Lager-Layout + Rollen (Vision SA 21.07, Spec fuer AB)

> Diktiert von SA am 21.07 abends, geordnet durch Fabel 5. Zweck: AB versteht, was SA
> business-technisch im Kopf hat, und der Prototyp (`ki-mitarbeiter-prototyp/`, Port 8030)
> zeigt es morgen am Termin 22.07 **sichtbar in der Front**. Ergaenzt den
> [Bauplan 3 KI-Mitarbeiter](2026-07-21-bauplan-ki-mitarbeiter.md) — die KI-Mitarbeiter liefern
> die Zahlen, dieses Spec beschreibt Lager-Struktur + Menschen-Rollen darauf.

## 1. Fazit

**Ein Lager-System mit 4 Orten und beschrifteten Faechern (Name + Groessen-Farbe), darauf 4
Rollen-Ansichten: Packer (2D-Karte + Pickliste + Tempo), Laden (Scan → wo liegt's + Online-Order
aufnehmen), Logistik-Leiter (Empfehlungen) und Manager (KI-Berichte).** Sobald das Lager einmal
sauber eingeraeumt/erfasst ist ("gesaeht"), ist die Software brauchbar.

## 2. Die 4 Lager-Orte

| Ort | Was dort liegt | Fach-Praefix |
|---|---|---|
| **Laden-Front** | Was der Kunde sieht. Pro Laden Faecher — man weiss exakt, was draussen steht. | `A1, A2, ...` |
| **Laden-Reserve** (hinter dem Laden) | Nachschub der Front: gleiche Artikel in weiteren Groessen + die naechsten Stuecke, die raus sollen. | `R1, R2, ...` |
| **Untergeschoss** | Groessen-Vorrat + **kommende Kollektionen** mit Plan-Datum ("haengt ab 04.08.") — planbares Vorgehen; je mehr mit Claude gearbeitet wird, desto besser die Planung. | `U1, U2, ...` |
| **Embrach (Gross-Lager)** | Alles; hier werden Online-Pakete gepackt + verschickt. **Abteilungen:** Packzone `P*` (Top-/Trend-Artikel, die auch im Laden sind — rund um den Packplatz = **minimale Laufwege**) · Standard `S*` · Saison `W*` (z.B. Winter) · Langsamdreher `L*` (Flops, teure Einzelstuecke). | `P1/S1/W1/L1, ...` |

**Fach-Beschriftung:** Name/Code + **Groessen-Farbe** (einheitliche Legende, damit Mitarbeiter auf
einen Blick greifen): XS violett · S gruen · M blau · L gelb · XL rot · XXL grau · One/Schuhe grau
mit fetter Zahl. (Farbstandard mit Khawar fixieren — offener Punkt.)

## 3. Die Rollen (wer sieht was)

| Rolle | Ansicht | Kern |
|---|---|---|
| **Packer (online)** | 2D-Lagerkarte Embrach am Bildschirm: offene Pack-Auftraege, markierte Faecher, Weg dorthin; pro Position **Farbpunkt + fette Groesse (S/M/XL/42)**. Start/Fertig-Knopf misst die Packzeit. | Pakete schneller raus, Laufwege minimal. **Tempo-Messung = transparente Prozess-Messung** (Ø-Zeit, Ausreisser mit Grund) — NICHT heimliche Ueberwachung (CH-Arbeitsrecht, vor Kunden-Zusage pruefen). |
| **Laden-Mitarbeiter** | **Scan-Front:** Artikel scannen (USB-Scanner tippt wie Tastatur) → sofort: wo liegt welche Groesse (Front/Reserve/UG/Embrach + Fach + Farbe). Dazu Knopf **"Online-Order aufnehmen"**: Groesse nicht im Haus → Bestellung direkt fuer den Kunden erfassen = **Kunde nicht verlieren**. | Nie mehr "kurz hinten suchen". |
| **Logistik-Leiter** | Alles oben + **Empfehlungs-Liste** aus den KI-Zahlen: (1) nachbestellen (Meldebestand), (2) **Online-Renner in den Laden holen**, (3) **letzte Stuecke in den Laden zum Abverkauf** (bald fertig, kein Nachschub geplant), (4) Umlagerung Embrach→Laden, (5) **Slotting**: Top-Seller naeher an die Packzone. | "Pure Logistik" — eine Person steuert den Warenfluss. |
| **Manager** (Logistik / Onlineshop / Shop) | Die Berichte der 3 KI-Mitarbeiter (Alarm/Woche/Monat) + Top-vs-Dead-Entscheide ("behalten oder auslaufen"). | Entscheidet mit den Zahlen der Logistik. |

## 4. Verzahnung mit den 3 KI-Mitarbeitern

KPI-Experte rechnet (Absatz 7/30/90/365, ABC+D, Meldebestand, Online-Anteil) → daraus entstehen die
**Logistik-Hinweise** (Abschnitt 3, Punkte 1-5) → Manager verpackt sie in Berichte. Das Lager-Layout
liefert dem Packer/Laden die ORTE dazu. Eine Datenbasis, vier Sichten.

## 5. Ergaenzungen (von Fabel 5 mitgedacht — SA abnicken)

1. **Wareneingang-Scan** (V3 im Ausbau-Plan): neue Ware am Embrach-Eingang scannen → Fach-Vorschlag.
2. **Retouren-Platz** am Packtisch (zurueck → pruefen → Fach).
3. **Inventur-Modus**: Fach scannen → zaehlen → Korrektur mit Grund (stuetzt die 95-99%-Genauigkeit).
4. **Fach-Umzug/Slotting-Assistent**: bei Umzug Etikett neu drucken, sonst driftet die Karte.
5. **Tracking-Recht**: Tempo-Messung offen kommunizieren, Prozess- nicht Personenkontrolle — rechtlich pruefen vor Kunden-Zusage.
6. **Offline-Faehigkeit im Laden** (Repo-Regel der Lagerverwaltung) fuer den Scan.

## 6. Morgen in der Praesentation sagen (Checkliste)

1. 4 Orte + Faecher mit Farben = jeder weiss in Sekunden, wo alles ist.
2. Packer sieht 2D-Karte → Pakete schneller, Laufwege minimal, Tempo messbar.
3. Laden scannt statt sucht → Kunde wartet nie, Online-Order rettet den Verkauf.
4. Logistik bekommt taeglich Empfehlungen (nachbestellen / in den Laden / letzte Stuecke / umlagern).
5. Manager bekommt Berichte von den 3 KI-Mitarbeitern — je laenger es laeuft, desto schlauer.
6. Voraussetzung: Lager einmal sauber einraeumen + erfassen ("saehen") — Khawars Team macht das, wir leiten an.

## 7. Offene Fragen an SA/Khawar (nicht raten)

Reale Fach-Anzahl + Bezeichnungen je Ort? · Gibt es schon einen Farb-Standard? · Scanner im Laden
vorhanden? · Wer pflegt Fach-Zuordnungen? · Tracking mit Team besprochen?

---

## 8. Bau-Spec fuer Opus 4.8 (Prototyp-Erweiterung, heute)

Alles in `kunden/finelli/ki-mitarbeiter-prototyp/`. Regeln: reines Node ohne Abhaengigkeiten,
ae/oe/ue + "ss", deterministisch pro Kalendertag, bestehende 18 Tests bleiben gruen.

### Datenmodell (lib/mock.js + lib/bestelllogik.js)

- `stammdaten.json`: neu `groessen_farben` (Legende oben) und pro Modell `faecher`:
  `{ front: "A3", reserve: "R3", untergeschoss: "U3", embrach: "P2" }`. Embrach-Fach nach Abteilung:
  A-Modelle → `P1..P6` (Packzone), Saison → `W1..W6`, D/Langsamdreher → `L1..L6`, Rest → `S1..S12`.
  Deterministisch aus Katalog-Reihenfolge. Ein Modell (neu: `TEE-05` "Heavy Tee", Kategorie T-Shirts,
  rate 0.3, online-lastig ~85%, szen `ladenholen`) bekommt Front-Bestand 1 bei vollem Embrach.
- `bestand.json` Positionen: `laden` wird aufgeteilt in `front`, `reserve`, `untergeschoss`
  (ca. 40/30/30, deterministisch gerundet); `embrach` bleibt. NEU `pack_auftraege`: 3 offene
  Auftraege `{ id: "PA-<datum>-1", positionen: [{sku, menge}], status: "offen" }` aus A-Modellen.
  JACK-01 (Winter) liegt im UG mit `geplant_ab` (naechster 01.09.) in den Stammdaten-Faechern.
- `lib/bestelllogik.js#bestandVariante`: liefert weiterhin `{ laden, embrach, ... }`, wobei
  `laden = front + reserve + untergeschoss` (Formeln unveraendert!); Detail-Felder zusaetzlich
  durchreichen (`front`, `reserve`, `untergeschoss`).

### Snapshot (lib/snapshot.js)

- Pro Artikel neu: `faecher`, `online_anteil_t30` (0-100), `bestand_detail`
  `{front, reserve, untergeschoss, embrach}` (Summen ueber Varianten).
- NEU `snapshot.logistik_hinweise`: Array `{typ, modell_id, name, text}` mit:
  `laden_holen` (online_anteil_t30 >= 60 && abc A && front <= 2 && embrach > 0) ·
  `letzte_stuecke` (bestand_gesamt 1..10 && (abc C/D || bestellvorschlag.moq_ueber_ziel)) ·
  `slotting` (abc A && embrach-Fach nicht `P*`) ·
  `umlagerung` (bestehende Umlagerungs-Vorschlaege, 1 Zeile pro Artikel).
- `snapshot.pack`: `{ auftraege: [...aus bestand.json, angereichert pro Position: name, groesse,
  farbe (aus groessen_farben), fach (embrach)], statistik: {anzahl_gepackt, dauer_avg_s, letzte: [...]}
  aus packlog }`.

### Server (server.js)

- `POST /api/pack/fertig` `{auftrag_id, dauer_s}` → haengt an `daten/packlog.json`
  `{datum, auftrag_id, dauer_s}` an, markiert Auftrag "gepackt". Origin-Check wie ueblich.
- `POST /api/pack/order` `{sku, menge}` → neuer pack_auftrag (Quelle "laden") — der
  "Online-Order aufnehmen"-Knopf. Antwort: der Auftrag.

### UI (public/) — 3 neue Tabs nach "Uebersicht": Packstation · Laden-Scan · Logistik

- **Packstation:** links offene Auftraege (Klick = aktiv, "Start"/"Fertig" → Timer client-seitig,
  Fertig postet dauer_s). Rechts 2D-Karte Embrach als CSS-Grid: Zellen = Faecher mit Label,
  Packplatz-Zelle markiert, Zonen beschriftet (Packzone/Standard/Saison/Langsamdreher);
  Faecher des aktiven Auftrags leuchten violett. Pickliste: pro Position Farbpunkt der Groesse +
  **fette** Groesse (S/M/XL/42) + Fach. Unten Mini-Statistik (Ø Zeit, letzte 5).
- **Laden-Scan:** grosses Eingabefeld (Autofokus, Enter = Scan; SKU oder Modell-ID). Ergebnis:
  Artikel + pro Ort Bestand mit Fach-Chip (Front/Reserve/UG/Embrach) und Varianten-Zeile mit
  Farbpunkten; wenn Front 0 aber Reserve/UG > 0 → Hinweis "im Haus: Reserve Fach R3". Wenn nirgends
  am Laden-Standort → Knopf "Online-Order fuer Kunden aufnehmen" (postet /api/pack/order, zeigt ok).
- **Logistik:** Karten je Hinweis-Typ (Nachbestellen = vorhandene Alarme kurz verlinkt ·
  In-den-Laden-holen · Letzte-Stuecke · Umlagerung · Slotting) + Lager-Landkarte: 4 Orte mit
  Stueckzahl + Wert (EK) + Hinweis auf kommende Kollektion (JACK-01 ab 01.09).
- Groessen-Farblegende als kleine Leiste in Packstation + Laden-Scan.

### Tests (tests/test.js, zusaetzlich ~5)

faecher fuer jedes Modell vorhanden + Embrach-Fach von A-Modellen beginnt mit P ·
pack_auftraege >= 1 · Hinweis-Typ `laden_holen` kommt vor (TEE-05) · Hinweis `letzte_stuecke`
oder `slotting` kommt vor · bestandVariante: laden = front+reserve+untergeschoss (Handrechnung).

### Abnahme

`node tests/test.js` gruen (alt + neu) · Server-Start + `GET /api/stand` zeigt logistik_hinweise
+ pack · README des Prototyps um die 3 Ansichten ergaenzen (kurz).
