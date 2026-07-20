# Shop / Detailhandel mit Lager (BRANCHEN-VORLAGE)

> Herkunft: Finelli-Projekt (Verkaufs-Doku 18.-19.07 + Lagerverwaltungs-Master-Prompt 19.-20.07) /
> destilliert am 2026-07-20. Zielbild: kleiner Haendler ({KUNDE}) mit Laden(n) + Online-Shop
> ({SHOP_SYSTEM}, z.B. Shopify) und 1-3 Lagern. Verwandt: `vorlagen/kunden-repo/` (Repo-Skelett),
> `playbook/` (Verkaufs-Prozess), `kunden-rueckhol-crm.md` (andere Branche).

## Fazit

Bei dieser Branche gewinnt man mit **Bestands-Wahrheit**: Der Killer-Pain ist fast immer
"System sagt X, Regal sagt Y" (Phantom-Verkaeufe, Groesse-nicht-auffindbar, Renner unbemerkt leer).
Die Loesung setzt IMMER auf das bestehende Shop-System auf (es bleibt die einzige Bestandswahrheit)
und ergaenzt nur, was fehlt: Lagerplaetze, mobile Erfassung, Historie, Hinweise.

## Typische Schmerzen (Reihenfolge nach Wert fuer den Kunden)

| # | Schmerz | Beleg |
|---|---|---|
| 1 | Phantom-Verkaeufe: Online-Kunde kauft, was nicht da ist -> Storno/Wartezeit | Finelli live bestaetigt (Kundenaussage) |
| 2 | "Ist Groesse/Variante X noch irgendwo?" nicht in Sekunden beantwortbar -> verlorener Laden-Verkauf | Finelli live bestaetigt |
| 3 | Manuelle Kassen-Nachtraege (z.B. SumUp -> Shop von Hand) als strukturelle Fehlerquelle | Finelli live bestaetigt |
| 4 | Renner unbemerkt ausverkauft / Ladenhueter binden Kapital | Finelli live bestaetigt |
| 5 | Bestandsdaten im Handel generell 54-65% fehlerhaft (Fashion ~54%) | ✅ DeHoratius/Raman 2008 + ECR/Cardiff 2019 |
| 6 | Inventur-Korrektur bringt +3,8-8,4% Umsatz (Feldexperiment) | ✅ ECR/Cardiff 2019 |
| 7 | Manuelle Bestandspflege Laden+Online kostet "schnell eine halbe Stelle" | ✅ digitalzentrumhandel.de (BMWK), gelesen 19.07.2026 |

## Architektur-Regeln (aus dem Finelli-Master-Prompt verallgemeinert, nicht verhandelbar)

1. **{SHOP_SYSTEM} ist die alleinige Bestandswahrheit.** Eigene DB spiegelt hoechstens, fuehrt nie.
2. **Kein zweites Inventarsystem.** Nur ergaenzen, was fehlt: Lagerplaetze (Regal/Fach pro
   Standort, Muster `{STANDORT_KUERZEL}-A-03`), Historie ueber die System-Grenze hinaus
   (Nacht-Snapshots), mobile Erfassung in einem Durchgang.
3. **Keine KI schreibt in den Bestand.** Jede Buchung loest ein Mensch aus; KI assistiert
   (Vorschlaege, Berichte), entscheidet nicht.
4. **Alle Schreibvorgaenge idempotent** (idempotency_key clientseitig, append-only Bewegungs-Log
   als Pruefpfad; Status-Uebergang pending->ok/failed als einzige erlaubte Aenderung).
   Bestand nie blind setzen — nur Delta oder Vergleich-und-Setze.
5. **Offline-faehig** (Lager-WLAN ist schlecht): lokale Warteschlange, sichtbarer Sync-Status,
   Abbruch mitten in der Inventur verliert nichts.
6. **API-Version fest pinnen, nie "latest"; kein Trainingswissen** — jede Schnittstellen-Aussage
   gegen die aktuelle Doku des Systems verifizieren (Quelle + Abrufdatum notieren).
7. **Keine Endkunden-/Personendaten** lesen oder anzeigen — nur Artikel-/Bestands-/Verkaufszahlen
   (revDSG; bei Shopify zudem "protected customer data" = teurerer Plan).
8. **Token/Keys nie ins Frontend**; Schreibzugriffe nur uebers Backend, mit Bestaetigen-Klick + Protokoll.

## Klaerungsfragen-Katalog vor Baustart (Finelli-Muster, pro Kunde anpassen)

1. Wieviele Artikel/Varianten, wieviel davon mit Barcode/EAN?
2. Welche Standorte existieren im Shop-System (Locations), welche real?
3. Liegt das Online-Lager getrennt oder in einem Laden-/Lager-Standort?
4. Welche Kasse ist im Einsatz, bucht sie automatisch in den Shop-Bestand?
5. Welche Zusatz-Apps haengen am Shop (Abloese-Termine pruefen! Beispiel: Stocky-Abschaltung
   31.08.2026 🔍 gemaess Shopify-Ankuendigung — vor Nutzung als Fakt verifizieren)?
6. Welche Geraete (iOS/Android, Bluetooth-Scanner vorhanden)?
7. Wunsch-Format Lagerplaetze (Regal/Fach) + Regal-Anordnung pro Standort?
8. Laufen B2B-/Grosskunden-Bestellungen DURCH das Shop-System oder daneben (Mail/Rechnung)?
   Wenn daneben: groesste Warenbewegung fehlt in der "Quelle der Wahrheit" — zuerst klaeren!

## Bausteine-Leiter (Ausbau-Logik, Reihenfolge begruendet)

| Stufe | Baustein | Warum diese Reihenfolge |
|---|---|---|
| V1 | Bestands-Cockpit (Ampeln, Umlagern, Korrektur mit Pflicht-Grund, Bericht) | toetet den Killer-Pain zuerst |
| V2 | Kasse an den Shop anbinden (Fertigteil des Shop-Systems, z.B. POS Lite) | stopft die strukturelle Fehlerquelle — VOR jeder Analyse |
| V3 | Scan + Etiketten (Lagerplaetze, Pickliste, Wareneingang) | Ordnung wird bedienbar |
| V4 | Analyse (Ladenhueter, Verteil-Empfehlung) | erst NACH V2 — sonst rechnet sie auf falschen Daten |
| V5+ | Branchen-Spezials ({SPEZIAL}, z.B. Drop-Helfer) | nur bei echtem, wiederholtem Bedarf |

Regel dazu: **Fertigteile nutzen statt Eigenbau** (POS, Barcode-Scan, Berichts-Sprache des
Shop-Systems); Eigenbau nur, wo kein Fertigteil existiert.

## Demo-/Mock-Regeln fuer diese Branche

- Demo traegt ohne Kunden-Zugaenge (Uebungs-Modus), Beispiel-Artikel klar als Beispieldaten markiert.
- Mock-Formeln am KALENDERTAG verankern (sonst friert die Demo ueber Mitternacht ein — echter
  Finelli-Demo-Killer, gefixt 19.07); deterministisch, kein random.
- Staerkster Demo-Moment: der "laeuft heute schon"-Baustein des Kunden zeigen (z.B. Bestellung ->
  Versand-Etikette) und NUR das Fehlende ergaenzen — Beweis fuer "aufsetzen statt ersetzen".
- Cross-Standort-Hinweis ("hier 0, dort N") ist das Herzstueck jeder Vorfuehrung.

## Platzhalter-Legende (Kurz)

| Platzhalter | Bedeutung |
|---|---|
| {KUNDE} | Kundenname |
| {SHOP_SYSTEM} | fuehrendes Shop-/Kassen-System (z.B. Shopify) |
| {STANDORT_KUERZEL} | Kuerzel je Standort fuer Lagerplatz-Codes (z.B. EMB) |
| {SPEZIAL} | branchen-/kundenspezifischer Zusatz-Baustein |
