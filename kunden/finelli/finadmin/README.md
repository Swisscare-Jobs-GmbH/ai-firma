# Finadmin — Lagerplatz-Scanner Finelli (Zuerich, Lager Raum 1)

> Gebaut 2026-07-22 auf AB-Auftrag vor Ort. Handy-App zum Scannen von EAN-Etiketten,
> zeigt Fach und Groessen-Ebene. Standort fest: **Zuerich, Lager Raum 1** — sonst nichts.
> Gehoert zu: [Marktanalyse + Lagerkarte](../2026-07-22-marktanalyse-lagerkarte.html) ·
> [MDE-Demo Lager](../demo-mde/lager-embrach.html)

## Was das ist

Eine selbsttragende Web-App fuer Android-Chrome. Sie liest EAN-Barcodes ueber die Handykamera
(`BarcodeDetector`, im Browser eingebaut, keine externe Bibliothek) und zeigt sofort:
Fachcode gross, Regal und Zone, Artikelname, Groesse farbig, und im Regalschema die richtige
Ebene markiert.

**Alles laeuft lokal.** Kein Server, kein Netzwerkzugriff im Code, keine Daten verlassen das
Geraet. Katalog, angelernte Barcodes, Klaerliste und Scan-Protokoll liegen im `localStorage`
unter `finadmin.katalog.v1`, `.plaetze.v1`, `.eans.v1`, `.klaer.v1`, `.log.v1`.

## Der Anlern-Modus — warum es ihn gibt

Stand 22.07 sind die EAN-Codes auf den Etiketten **nicht** mit den Shopify-Produkten verbunden.
Ein Produktexport bringt also Titel und Groessen, aber leere Barcode-Spalten. Statt zuerst
hunderte Barcodes von Hand in Shopify einzutragen, lernt die App sie beim Arbeiten:

1. Barcode scannen, der unbekannt ist
2. Artikel einmal aus der Liste antippen
3. ab dem naechsten Scan zeigt die App sofort das Fach

Am Ende exportiert die App alle gelernten Paare als CSV mit den Spalten
`Handle, Title, Option1 Value, Variant SKU, Variant Barcode`, die sich in Shopify importieren
laesst. Damit sind die Barcodes dann auch dort hinterlegt, ohne dass jemand sie abgetippt hat.

## Fach-Schema (48 Plaetze)

| Regal | Aufbau | Plaetze |
|---|---|---|
| Regalwand 1 | 4 Regale zu 3 Spalten | 12 |
| Zwischengestell 1 | Seite A und B je 2 Regale, Front 1 Regal, je 3 Spalten | 15 |
| Zwischengestell 2 | gleich | 15 |
| Regalwand 2 | 2 Regale zu 3 Spalten | 6 |

**Spalte = Artikel, Ebene = Groesse.** In jedem Regal gleich: oben XS+S, dann M, dann L,
unten XL+XXL. Ausnahme: die Front von Zwischengestell 2 hat 6 Ebenen, dort liegt jede Groesse
einzeln. Hosen laufen mit 30/32/34/36 statt Buchstaben.

Die Pilot-Belegung vom 22.07 ist als Startwert hinterlegt (Zwischengestell 1 Seite A + Front 1,
Regalwand 1 Faecher 1a bis 2a).

## Dateien

| Datei | Zweck |
|---|---|
| `finadmin.html` | Die App. Wird als Artifact veroeffentlicht, weil die Handykamera zwingend HTTPS braucht. Enthaelt kein `<html>`/`<body>`, das ergaenzt der Artifact-Wrapper. |
| `test-finadmin.js` | 58 Pruefungen ohne Browser: `node test-finadmin.js` |

## Testen

```
node test-finadmin.js
```

Deckt ab: Groessen-Normalisierung, Ebenenzuordnung bei 4 und 6 Ebenen, Hosengroessen,
CSV-Parser inklusive mehrzeiliger Felder und fehlender Barcode-Spalte, alle Pilot-Zuordnungen,
Anlernen eines unbekannten Codes, Fehlerfaelle. Alle Testdaten sind synthetisch.

## Grenzen (Stand 22.07)

- **Zeigt nur, wohin ein Artikel gehoert.** Bucht keinen Bestand, redet nicht mit Shopify.
- **Kamera braucht HTTPS.** Eine lokal geoeffnete Datei bekommt keinen Kamerazugriff. Darum die
  Veroeffentlichung als Artifact. Fallback: Nummer eintippen oder Bluetooth-Handscanner.
- **Android Chrome.** `BarcodeDetector` fehlt in Safari. Fuer iPhone braeuchte es eine
  eingebettete Bibliothek.
- Nur Standort Zuerich Lager Raum 1. Embrach und Laden-Front sind bewusst nicht drin.
