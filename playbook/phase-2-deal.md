# Phase 2 — Deal

> Ziel: ein Deal, den {KUNDE} als fair + risikolos erlebt — und der die AI-Firma traegt.
> Dauer: ~0.5 Tag. Baut auf der Schmerz-Landkarte (Phase 1) auf. Vertrags-Vorlage: `vorlagen/vertrag/`.

## Fazit

Erst **Wert ranken** (welche Loesung ist wie viel wert), dann die **Deal-Bausteine** anlegen.
Der Deal drehte sich bei Finelli 3x in 24h — darum ist er hier fest kodiert. Nie eine alte Version rechnen.

## Schritt 1 — Wert-Ranking (Hormozi-Gleichung)

Pro Loesung aus der Schmerz-Landkarte: Traum-Ergebnis x Erfolgs-Wahrscheinlichkeit ÷ (Zeit x Aufwand
fuer den Kunden). Was hoch rankt, kommt in V1 — der Rest wandert auf die Versions-Leiter.

## Schritt 2 — Die Deal-Doktrin (fest, nicht neu erfinden)

| Baustein | Regel |
|---|---|
| **Vorkasse** | **CHF 0 vorab.** Der Kunde startet ohne Risiko. |
| **Preis-Basis** | **Selbstkosten** (nicht Marktwert) — was uns der Bau real kostet, ehrlich angesetzt. |
| **Zahlung** | Selbstkosten aufgeteilt auf **{LAUFZEIT}** (Muster: 24 Raten) → `{PREIS_RATE}`/Monat. |
| **Betrieb** | `{BETRIEB_RATE}`/Monat (Muster: 500) — kommt ZUR Rate dazu (KI-Betreuung, Wartung, Wochen-Bericht). |
| **Garantie** | **48h-Flick-Versprechen.** Nicht geschafft (betriebsverhindernde Stoerung, gemeldet) → Rate verschiebt sich + die Betriebs-Gebuehr des Monats wird **erlassen**. Pause-Cap 3 Monate. |
| **Kunden-Joker** | {KUNDE} bringt einen vermittelten Kunden, der unterschreibt → **50% des Einmal-Honorars** dieses Kunden werden auf die Restschuld angerechnet. Metro-Liga-Kunde (>{GROSS_SCHWELLE}) → Restschuld weg + naechste Version geschenkt. |
| **Quartals-Tor** | Aufstieg zur naechsten Version = Restschuld der Vorversion **innert 1 Quartal** beglichen ODER Kunde gebracht. |
| **Abnahme** | 10-Punkte-Abnahme-Liste — **WIR bringen sie mit** (Phase 5). |

## Schritt 3 — Die zwei eisernen Grundsaetze

> Diese zwei Saetze stehen ueber allem. Sie sind der Grund, warum der Deal kundenfreundlich UND
> tragbar ist.

1. **"Preis nie reduziert, nur Zeit verschoben."** Der Software-Preis (die Selbstkosten-Summe) wird
   **NIE gesenkt oder erlassen** bei Stoerungen — es gibt nur MEHR ZEIT (Raten verschieben sich).
   Erlassen wird hoechstens die Betriebs-Gebuehr im Stoerungs-Monat. Einzige Schuld-Reduktion = Kunden-Joker.

2. **Summenzeile NIE "Marktwert" nennen.** Raten x Laufzeit = eine Summe, die der Kunde nachrechnet.
   Diese Zeile heisst **"Dein Preis — Selbstkosten"**, nie "Marktwert". Der Agentur-Anker (30k+) steht
   **separat** als Vergleich, nie als deine Summenzeile (Falle vermieden 18.07).

## Schritt 4 — 3 Schutz-Klauseln im Werkvertrag (PFLICHT)

Damit die Garantie nicht ausgenutzt wird (Markt-belegt, nicht sketchy — kundenfreundlicher als ueblich):

1. **Stoerung hart definieren** + Ausschluesse: Dritt-Ausfaelle (Shopify etc.) + Kundenfehler zaehlen NICHT.
2. **Gewaehrleistung 12 Mt ab Abnahme** + Abnahme-Fiktion (30 Tage keine Ruege ODER produktiver Einsatz
   = abgenommen — sonst laesst sich die Zahlung ewig verzoegern).
3. **Nutzungsrecht erst bei voller Zahlung** + Verzug macht Rest faellig + Pause-Cap 3 Monate.

> Wiederverwendungs-Klausel (Vertrag Ziffer 8): erlaubt der AI-Firma, Bausteine wieder zu verwenden.
> Gehoert in JEDEN neuen Vertrag. Vorlage: `vorlagen/vertrag/`.

## Ergebnis dieser Phase

Angebots-Zahlen (Rate, Laufzeit, Betrieb, Joker-Schwellen) + angepasster Vertrags-Entwurf in `kunden/{KUNDE}/`.
