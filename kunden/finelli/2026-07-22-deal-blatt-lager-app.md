# Finelli — Deal-Blatt Lager-App (SEA Lager), Stand 22.07.2026

> Frisch gerechnet nach `playbook/phase-2-deal.md` (nicht aus alten Zahlen).
> Gehoert zu: [Ausbau-Plan](2026-07-18-finelli-ausbau-plan.md) - [Marktanalyse](2026-07-22-marktanalyse-lagerkarte.html).
> Gebaut am 22.07: Android-App SEA (EAN-Scan, Lagerkarte, Wareneingang, Umlagerung,
> Kommissionierung) + Cloudflare-Worker mit Shopify-Anbindung (OAuth, Webhooks, Abgleich).

## Wert-Ranking (Hormozi)

| Baustein | Traum-Ergebnis | Wartezeit | Kunden-Aufwand | Wert |
|---|---|---|---|---:|
| Bestand stimmt automatisch | 20% Falschbestaende weg, keine Phantom-Verkaeufe, keine 14-35 Tage Wartezeit | sofort | null | 10 |
| Scannen statt suchen | die 15 Min Suchen je Order fallen weg | sofort | Etiketten einmalig kleben | 9 |
| Zwei Standorte sichtbar | Groesse in ZH oder EMB ohne Anruf | sofort | null | 8 |
| Wareneingang mit Aufteilung | Ware wird erstmals erfasst, Abverkauf rechenbar | ab naechster Lieferung | scannen statt nur einlagern | 7 |
| Kommissionierung mit Abhaken | weniger Fehlversand | ab Nutzung | Umgewoehnung | 6 |

## Bau-Selbstkosten

Geschaetzter Aufwand ohne KI-Unterstuetzung: **12 Bau-Tage**
(Lagerkonzept 2 - Android-App 6 - Server mit Shopify-Anbindung 3 - Einrichtung/Test 1).
**Schaetzung, keine gemessene Zahl.**

Satz laut Ausbau-Plan ab V2: 750-900 CHF/Tag, gerechnet mit 800.
**12 x 800 = CHF 9600, gerundet CHF 9500.**

## Der Deal

```
Rate:    396/Mt  (Selbstkosten 9500 auf 24 Raten)
Betrieb: 149/Mt  (Cloud, Wartung, Betreuung)
-----------------------------------------------
Total:   545/Mt   <- "Dein Preis - Selbstkosten"
```

Zu hoch? **Laufzeit strecken, nie Preis senken:** 36 Raten = 264 + 149 = **413/Mt**.

Schutz: CHF 0 vorab - 48h-Garantie - Kunden-Joker 50% - Quartals-Tor - 10-Punkte-Abnahme.

## Agentur-Anker (separat, NICHT als Ratensumme)

CH-Agentur 160-200 CHF/h = 1300-1600/Tag. Dieselben 12 Tage = **CHF 15600-19200**,
als native App eher 25000-35000.

## Offen vor der Offerte

1. **Khawars Budget-Deckel fuer diesen Baustein ist unbekannt.** Die CHF 3000 im Repo
   galten fuer V1 im Juli. Neu fragen, sonst rechnet die Offerte gegen eine tote Zahl.
2. **Differenz zum Ausbau-Plan aktiv erklaeren.** Dort steht V3 Scan mit CHF 4500 fuer
   eine Wareneingangs-Maske. Geliefert wurde eine eigene Android-App plus komplette
   Shopify-Anbindung mit Webhooks. Wer den alten Plan kennt, fragt sonst nach.