# Finelli — 3 KI-Mitarbeiter (Prototyp)

> Lauffaehiger Prototyp der 3 KI-Mitarbeiter aus dem
> [Bauplan](../2026-07-21-bauplan-ki-mitarbeiter.md). Gebaut 2026-07-21 (Opus 4.8) auf
> ausdruecklichen SA-Entscheid ([Gate-0-Ausnahme E5](../../../brain/decisions/E5-finelli-ki-mitarbeiter-prototyp-vor-ja.md))
> als **Demo fuer den Finelli-Termin 22.07**. Reines Node, keine npm-Abhaengigkeiten,
> kein Build-Schritt. Nach dem Ja wandert der Code ins `finelli-cockpit` (`ki-mitarbeiter/`).

## Start

```
node server.js
```

Dann im Browser: **http://127.0.0.1:8030** (bindet nur auf 127.0.0.1). Tests: `node tests/test.js`.

## Die 3 Mitarbeiter

| # | Mitarbeiter | Was er tut | Wo im Code |
|---|---|---|---|
| 1 | **Research-Spaeher** | Branchen-Trends aus gepruefteten Quellen (Whitelist Tier A/B/C), je mit Quelle + Abrufdatum. Im Prototyp: Mock-Dossier. | `lib/research.js`, `daten/trend-dossier.json` |
| 2 | **KPI-Experte** | Rechnet je Artikel 7/30/90/365-Tage-Absatz, Sell-Through, Reichweite, Meldebestand, ABC+D, Nachbestell- und Umlagerungs-Bedarf. Reiner, getesteter Code. | `lib/kennzahlen.js`, `lib/abc.js`, `lib/bestelllogik.js`, `lib/snapshot.js` |
| 3 | **Manager** | Verbindet beide zu Bestell-Alarm + Wochen- + Monatsbericht in Laien-Klartext. Zahlen rendert der Code, mit Vor-Versand-Check. | `lib/manager.js` |

Orchestriert vom **Tageslauf** (`lib/lauf.js`): Snapshot -> Einschaetzung -> Berichte -> Vor-Versand-Check.

## Wichtigste Regeln (aus dem Bauplan)

- **Liest nur, bucht nie Bestand** — alle Ausgaben sind Empfehlungen; buchen tut ein Mensch.
- **Zahlen kommen aus dem Rechenkern, nie aus dem Sprachmodell.** Der Vor-Versand-Check blockt
  jeden Bericht, in dem eine Zahl nicht im Snapshot steht (Test 8 beweist das).
- **Am Anfang nur empfehlen** (Ton-Stufe 1): Bandbreite + Konfidenz, ehrlich "das sind die Zahlen,
  so lese ich sie". Bestimmter Ton erst bei sauberer Datenlage.
- **Deterministisch pro Kalendertag** — nach Neustart identisch, Mitternacht sauber (kein Daten-Drift).

## Alte Daten + Logistik reinfuettern ("einfuetter"-Grenze)

Der gleiche Code rechnet mit Mock- ODER echten Daten. Im Tab **"Daten fuettern"**:

1. **Alte Verkaeufe** als CSV importieren (Spalten `datum, sku, menge, kanal, standort` — z.B. Shopify-Export).
2. **Logistik-Stammdaten** (Hersteller, Lieferzeiten min/typisch/max, MOQ, EK/VK, NOS/Saison) bearbeiten.
3. **Tageslauf starten** — alle Kennzahlen + Berichte rechnen neu.

Direkt: die Dateien in `daten/*.json` ersetzen. Fehlen sie, erzeugt der Server Mock-Daten.

| Datei | Inhalt |
|---|---|
| `daten/stammdaten.json` | Modelle + Varianten + Logistik (Hersteller, Lieferzeiten, MOQ, EK/VK, NOS/Saison) |
| `daten/verkaeufe.json` | Verkaufszeilen (sku, datum, menge, kanal, standort) |
| `daten/wareneingaenge.json` | Wareneingaenge je Variante (fuer Sell-Through) |
| `daten/bestand.json` | Aktueller Bestand je Variante/Standort + offene Bestellungen |
| `daten/trend-dossier.json` | Trend-Dossier (Mitarbeiter 1) |
| `daten/config.json` | `sauber_seit` (Schnitt-Datum fuer Datenqualitaet) |

## Grenzen des Prototyps (bewusst)

- **Kein echter Shopify-Zugang, kein Live-Research** — beides ist der spaeter aktivierbare Teil
  (nach dem Ja, Bauplan E5). Live-Research: `lib/research.js#holeDossierLive`.
- **Mock-Daten sind Uebungsdaten**, keine echten Finelli-Zahlen. Fuer die Demo mit echten Zahlen
  am Termin: alte Verkaeufe + Logistik reinfuettern (oben).
- Fuer den Termin am 22.07: einmal **"Mock neu wuerfeln"** klicken, damit die Uebungs-Historie auf
  den Tag verankert ist (oder gleich echte Daten reinfuettern).

## Abnahme-Beweis (Stand 2026-07-21)

- `node tests/test.js` → **18/18 gruen** (Formeln handnachgerechnet, ABC, Idempotenz,
  Vor-Versand-Check blockt manipulierte Zahl).
- `GET /api/stand` end-zu-end: 16 Modelle, 3 ROT-Alarme, alle Checks ok.
- Browser-Klick auf "Bestell-Alarme" → volle Alarm-Karten mit Rechenweg + Trend-Einschaetzung.
- Alle Pflicht-Szenarien im Mock belegt: ROT-Alarm (A), MOQ>Ziel-Entscheidungsfall,
  Umlagerung Embrach->Laden, Ladenhueter (D), Saison-Jacke im Juli ruht (nicht D).
