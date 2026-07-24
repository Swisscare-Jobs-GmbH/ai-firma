# SEA Lager — Finelli Lager-App (Zuerich, Lagerraum 1)

> Angelegt 22.07.2026, seither stark ausgebaut (Stand 24.07.2026). Standalone-Android-App (APK)
> plus Cloud-Backend, mit Shopify verbunden. Diese Datei ist die **Quelle der Wahrheit** fuer den
> App-Stand — bei jeder Aenderung hier nachfuehren, damit die naechste Session ohne viel Kontext
> weiterarbeiten kann.

## Fazit in 30 Sekunden

- **App:** eine einzige Datei `finadmin.html` (HTML+CSS+JS, kein Framework), als Asset in eine
  Android-APK gepackt. Laeuft in einer WebView unter `https://appassets.androidplatform.net`
  (sicherer Kontext, sonst gaeben Kamera + localStorage nichts her). Firmenname **SEA**.
- **Backend:** Cloudflare Worker `sea-lager.abdulm447.workers.dev` + D1-Datenbank `sea-lager`.
  Verbindet die App mit Shopify (`finelli-gmbh.myshopify.com`).
- **Was sie kann:** Produkt-Info (scannen/suchen), Wareneingang, Umlagern (Standort + Lagerplatz),
  Bestellungen picken/packen mit Timer, Katalog. Produktbilder ueberall.
- **Zwei interne Standorte** (Zuerich `zh` / Embrach `emb`) auf **einem** Shopify-Standort. Die
  Aufteilung lebt nur im Backend, Shopify sieht nur den Gesamtbestand. Verkauf zieht erst zh, dann emb.

## Kernfakten (nicht raten, hier steht es)

| Was | Wert |
|---|---|
| Server-URL | `https://sea-lager.abdulm447.workers.dev` |
| APP_KEY (im Header `X-Sea-Key`, steckt auch im APK) | `sea-fb363a7bedda4ffe8d9925f078befca5` |
| Shop | `finelli-gmbh.myshopify.com` (verbunden via OAuth) |
| D1-Datenbank | `sea-lager` (binding `DB`, Region EEUR) |
| Android-Paket | `ch.sea.lager` |
| Keystore | `android/sea.keystore`, Passwort `sealager`, Alias `sea` (fuer `install -r` = Daten bleiben) |
| Testgeraete (adb) | Samsung S24 Ultra `RFCX10JEERP` · TCL T521K `75E6VGAIGIZXHUHE` |
| Shopify API-Version | `2026-07` |

## Aufbau der App (Kachel-Menue, farb-orientiert)

Startbildschirm = grosse farbige Kacheln, jede Funktion eine eigene Farbe (idiotensicher, ueberall
durchgezogen ueber CSS-Variable `--akz`):

| Kachel | Farbe | Was |
|---|---|---|
| **Produkt-Info** | blau `--f-info` | scannen ODER nach Name suchen; Artikel mit **einem** kleinen Bild (Klick vergroessert, Lightbox), Groessen+Mengen als Text, Fach, Lagerkarte |
| **Wareneingang** | gruen `--f-eingang` | scannen, Stueckzahl eingeben, in Zuerich einbuchen. Ein Schritt. |
| **Umlagern** | orange `--f-umlager` | Segment mit zwei Modi: **Standort** (zh↔emb) und **Lagerplatz** (Fach aendern, Mehrfachauswahl, anwaehlbare Karte) |
| **Bestellungen** | violett `--f-bestell` | offene Shopify-Bestellungen; starten (Timer) → picken mit Karte → fertig (misst Zeit) → versenden |
| **Katalog** | grau `--f-katalog` | EAN-Export/CSV-Import, zeigt `KATALOG.length / EANS-Zahl` |

Navigation: Home-Kacheln + Zurueck-Knopf (Haus-Icon) je Screen. Kein unteres Menue mehr.

## Datenfluss und Synchronisation

Der **Server ist die Wahrheit**. Die App holt beim Start und bei jeder Rueckkehr in den Vordergrund
(`visibilitychange`) via `vomServer()` den Stand und baut Katalog, Bestand, Plaetze, EANs, Bilder neu.

Drei **Warteschlangen** mit Wiederholung sichern Schreibvorgaenge auch bei kurzem Offline
(localStorage-Keys `sea.warteschlange.v1`, `sea.fachwarte.v1`, `sea.eanwarte.v1`):

- **Buchungen** (`zumServer`/`sendeWarteschlange`) → `POST /api/buchung`
- **Fach-Aenderungen** (`fachZumServer`/`sendeFachWarte`) → `POST /api/fach`
- **Angelernte EANs** (`eanZumServer`/`sendeEanWarte`) → `POST /api/ean`

**EAN-Sync ueber mehrere Geraete:** lernt Handy A einen Barcode an, geht er ueber die Warteschlange
sicher zum Server; Handy B bekommt ihn beim naechsten `vomServer()`. Der Server ist autoritativ,
nur Codes in der eigenen Warteschlange bleiben lokal erhalten (kein Hin-und-Her). So muss man
denselben Artikel nie mit beiden Geraeten scannen.

**Produktbilder:** ein Bild pro Artikel, Spalte `bild` in der DB. Befuellt aus `products_export_1.csv`
(einmalig) und laufend vom Abgleich (`featuredImage`). Die App zeigt Thumbnails (`?width=120`),
gross `?width=400`, Lightbox `?width=1200`. Laden direkt vom Shopify-CDN, kosten keinen App-Speicher.

**Entwuerfe sofort verfuegbar:** Webhooks `PRODUCTS_CREATE` + `PRODUCTS_UPDATE` (`/webhooks/products`)
uebernehmen jedes neue/geaenderte Produkt sofort in den Katalog, auch Entwuerfe. Bestehende ueber
`/api/abgleich` (paginiert, fortsetzbar via `?nach=`).

**Bestell-Timer:** `POST /api/kommission` speichert Packzeit je Bestellung (Tabelle `kommission`)
fuer spaetere Prozess-Optimierung. Zustand lokal in `sea.bestellzustand.v1`
(offen→lauf→fertig→versendet), Bestellungen sind IMMER ansehbar, nie gesperrt.

## Server-Endpunkte (`server/src/index.js`)

| Pfad | Zweck |
|---|---|
| `GET /` | Statuscheck (verbunden? Zeilenzahl) |
| `GET /oauth/start`, `/oauth/callback` | Shopify-Installation, legt Token in Tabelle `laden`, registriert Webhooks |
| `POST /webhooks/orders`, `/refunds`, `/products` | Verkauf abziehen, Retoure gutschreiben, Produkt/Entwurf uebernehmen |
| `GET /api/bestand` | ganzer Bestand (artikel, groesse, titel, fach, zh, emb, ean, bild) |
| `POST /api/buchung` | Bestand buchen (+/-), idempotent ueber `schluessel`, setzt Shopify-Gesamt |
| `POST /api/ean` | angelernten Barcode je (artikel, groesse) speichern |
| `POST /api/fach` | Lagerplatz je Artikel setzen/entfernen (alle Groessen) |
| `GET /api/bestellungen` | offene Bestellungen, Positionen mit Fach/zh/emb/holen/bild angereichert |
| `POST /api/fulfill` | Bestellung in Shopify als versendet markieren (**braucht `write_fulfillments`**) |
| `POST /api/kommission` | Packzeit protokollieren |
| `POST /api/setup-webhooks` | Webhooks mit gespeichertem Token neu registrieren (ohne Neu-Login) |
| `GET /api/abgleich` | Voll-Sync aller Varianten aus Shopify (paginiert via `?nach=`) |

Schluessel-Schema: `artikel` = `normal(Produkttitel)` (kleingeschrieben, nur a-z0-9-Umlaute).
`groesse` = `normGroesse(variant title)`. Primary key `(artikel, groesse)`. Details `server/schema.sql`.

## Bauen und Aufspielen (ohne Gradle)

```bash
python android/build.py            # baut android/SEA.apk aus finadmin.html
adb -s <GERAET> install -r android/SEA.apk   # -r behaelt App-Daten (EANs!)
```

`build.py` macht: HTML in `apk/assets/index.html` verpacken → aapt2 compile/link → javac → d8 →
classes.dex ins APK → zipalign → apksigner (mit `sea.keystore`). Toolchain-Pfade (Android SDK,
JDK) stehen oben im Skript und sind maschinenspezifisch (aktuell AB-Rechner).

Server deployen:

```bash
cd server && npx wrangler deploy
```

DB-Migration einzeln, z.B. neue Spalte: `npx wrangler d1 execute sea-lager --remote --command "..."`.

## Offen / To-do

- **Versenden in Shopify braucht Re-Auth:** Scope `write_fulfillments` ist im OAuth eingetragen, aber
  der Shop muss den Installations-Link **einmal** neu oeffnen, damit Shopify das Recht erteilt:
  `https://sea-lager.abdulm447.workers.dev/oauth/start?shop=finelli-gmbh.myshopify.com`
  Bis dahin meldet der Versenden-Knopf "Berechtigung fehlt".
- `test-finadmin.js` ist vom Alt-Stand (lokale Version), deckt den heutigen Umfang nicht mehr ab.
- Zwei Artikel ohne Bild (unfertige Entwuerfe) — loesen sich, sobald in Shopify Bild gesetzt.

## Alt-Stand (Historie)

Ursprung 22.07 war eine rein lokale Artifact-App (kein Server, nur Fach-Anzeige, Anlern-Modus,
CSV-Export). Seither: Cloudflare-Backend + Shopify-OAuth, zwei interne Standorte, Bestandsbuchung,
Standalone-APK statt Artifact, Kachel-Menue + Farbsystem, Produktbilder, Bestellungen mit Timer,
Entwurf-Webhooks, geraeteuebergreifender EAN-Sync.
