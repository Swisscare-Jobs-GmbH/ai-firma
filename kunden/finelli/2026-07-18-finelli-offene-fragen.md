# Finelli — Offene Fragen VOR dem Baustart (Research 18.07)

> Erstellt 2026-07-18 durch HQ-Research (4 Fragen-Spaeher: Projekt-Checklisten, Shopify-Fallen, Mode-Spezifik, Vertrag/Betrieb + Redakteur).
> Gehoert zu: [Feinplan](2026-07-18-finelli-feinplan.md). Gefiltert gegen alles schon Gewusste — nur NEUE Punkte.

## ⚠️ Die Top-Gefahr

**Laufen die B2B-Bestellungen der ~40 Laeden durch Shopify — oder per Mail/Rechnung daneben?**
Wenn daneben: Die groesste Waren-Bewegung der Firma fehlt in der "Quelle der Wahrheit", jede Zahl der App ist systematisch falsch, und der noetige B2B-Baustein sprengt Budget (4k) und Zeitfenster.

## A) An Khawar — VOR Baustart (fertig zum Vorlesen)

1. Kassierst du im Laden in Zuerich ueber die Shopify-Kasse (POS) — und ist die Kasse dort auf den Standort "Laden Zuerich" eingestellt, nicht auf Embrach? *(Sonst zeigt die App fuer den Laden dauerhaft falsche Zahlen.)*
2. Laufen die Bestellungen deiner ~40 Laeden (Jelmoli, Ciolina usw.) durch Shopify und ziehen den Embrach-Bestand ab — oder daneben per Mail und Rechnung? *(Die Top-Gefahr, siehe oben.)*
3. Stimmt der Shopify-Bestand heute mit dem echten Regal ueberein — wann habt ihr zuletzt komplett durchgezaehlt? *(Startet die App auf falschen Zahlen, wirkt sie ab Tag 1 kaputt — dann vor Start eine Zaehlung einplanen.)*
4. Wie viele Groessen-Farb-Kombinationen stecken hinter den 60 Artikeln — eher 200 oder eher 600 Bestands-Zeilen in Shopify? *(Kleidung geht pro Groesse aus, nicht pro Artikel — bestimmt Aufwand jeder Liste.)*
5. Machen wir vor dem Start eine kurze Abnahme-Liste (max. 10 Punkte) — mit der Regel: 14 Tage keine Maengel = abgenommen, alles ausserhalb = Zusatzauftrag mit eigenem Preis? *(Ohne schriftliche Kriterien entscheidet Bauchgefuehl ueber die 3'000 Schlusszahlung.)*
6. Ist es ok, dass Verkaufs- und Lagerzahlen (KEINE Kundennamen) fuer die 3 KI-Funktionen an einen externen KI-Anbieter gehen (Server evtl. EU/USA)? *(Sagt er nach dem Bau Nein, fliegen 3 Kern-Funktionen raus.)*

## B) An Khawar — reicht waehrend Bau / vor Abnahme

1. Schreibt neben Shopify noch etwas anderes Bestaende rein — Kassen-App, B2B-Tool, Rich Returns, Excel-Import? *(Zwei Schreiber auf demselben Bestand = Konflikte.)*
2. Welche Artikel sind Dauerlaeufer zum Nachbestellen, welche einmalige Drops? Mindest-Mengen im Kopf? *(Bestell-Vorschlag fuer einen Drop macht die KI unglaubwuerdig.)*
3. Wie laeuft Wareneingang + Umlagerung Embrach→Laden heute konkret — wer bucht was, wann, in Shopify?
4. Bucht Rich Returns eine Retoure automatisch zurueck in den Shopify-Bestand — und an welchem Standort?
5. Wer arbeitet mit der App (Lager, Laden, Buero) — Handy/Tablet/PC? Kleben Barcodes auf der Ware?
6. Vor Abnahme: 1-2 Wochen Parallel-Betrieb + gemeinsame Zaehl-Stichprobe (10 Artikel) + die Lager-Person testet mit — einverstanden?

## C) Intern — WIR entscheiden/pruefen (kein Kunde noetig)

1. Sobald Zugang da: Shopify-Plan + eingebautes Bestellwesen (Stocky/Purchase Orders/Transfers) pruefen — nichts Doppeltes bauen; wir punkten, wo Shopify schwach ist.
2. Schreib-Mechanik: Plus/Minus-Buchung (inventoryAdjustQuantities mit Vergleichswert + Doppelklick-Schutz) statt absoluter Werte; native Shopify-Umlagerung (inventoryTransferCreate); alles auf Groessen-Ebene.
3. Rechte-Liste (Scopes) der Custom App FINAL fixieren, BEVOR Khawar sie anlegt — jede fehlende Berechtigung kostet bei einem Kunden ohne Technik-Team Tage.
4. Kundendaten-Problem loesen: Verkaufs-Historie OHNE Kundennamen ziehen (Shopify "protected customer data"-Auflagen + revDSG pruefen) — sonst bricht entweder unser Versprechen oder das wichtigste KI-Feature.
5. Kurzer Werkvertrag (2-3 Seiten): Abnahme-Liste, Haftungs-Deckel 4'000 ohne Folgeschaeden, 3 Monate Gratis-Nachbesserung (sonst gilt gesetzlich bis 2 Jahre), was die Monats-Gebuehr deckt, Exit-Klausel, Bausteine bleiben wiederverwendbar, Referenz-Erlaubnis.
6. Buchungs-Protokoll ab Tag 1 (wer/wann/was, mit Bestaetigen-Klick) — bei "Bestand stimmt nicht" sind sonst automatisch wir die Schuldigen.
