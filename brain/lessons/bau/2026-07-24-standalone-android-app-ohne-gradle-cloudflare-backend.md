---
type: lesson
disziplin: bau
kunde: finelli
status: current
datum: 2026-07-24
quelle: Bau der SEA-Lager-App (finadmin) fuer Finelli, 22.-24.07.2026
---

# Muster: Standalone-Handy-App ohne Gradle + schlankes Cloud-Backend

Fuer kleine Betriebe, die eine echte Handy-App wollen (nicht nur eine Webseite), ohne App-Store
und ohne teuren Build-Stack. Bewaehrt beim Finelli-Lager-Scanner, uebertragbar auf jeden
Shop/Detailhandel-Kunden ([[shop-detailhandel]]).

## Architektur in einem Satz
Eine **einzige HTML-Datei** (App-Oberflaeche, kein Framework) wird als Asset in eine **Android-APK**
gepackt und laeuft in einer WebView. Ein **Cloudflare Worker + D1** ist das Backend und verbindet
die App mit dem bestehenden System des Kunden (hier: Shopify).

## Die vier Kniffe, die Zeit gespart haben
1. **APK ohne Gradle.** Der ganze Build ist ein Python-Skript: HTML als Asset -> `aapt2`
   compile/link -> `javac` -> `d8` (classes.dex) -> dex ins APK zippen -> `zipalign` -> `apksigner`.
   Kein Android Studio, kein Gradle-Sync, Sekunden statt Minuten. Braucht nur Android SDK
   (build-tools + platform android.jar) + ein JDK.
2. **WebView unter `https://appassets.androidplatform.net`**, NICHT `file://`. Nur so gilt die Seite
   als *sicherer Kontext* — sonst geben **Kamera** (Barcode-Scan via `BarcodeDetector`) und
   **localStorage** nichts her. Die Activity liefert die Assets ueber `shouldInterceptRequest` aus.
3. **`adb install -r` behaelt die App-Daten** (localStorage). Darum MUSS mit demselben Keystore
   signiert werden — geht der Keystore verloren, kann man nur noch deinstallieren (Daten weg). Also
   Keystore + Build-Skript **im Repo** ablegen, nicht im vergaenglichen Scratchpad.
4. **Backend = Cloudflare Worker + D1.** Kostenlos-Tier reicht, kein Server-Betrieb. Shopify-OAuth
   so bauen, dass der **Token nie von Hand kopiert** wird (der Worker tauscht den Code selbst und
   legt ihn in der DB ab). Webhooks beim Installieren registrieren.

## Fallen (echt passiert)
- **`android.permission.INTERNET` im Manifest vergessen** -> App dauerhaft "offline", aber `ping`/
  `curl` vom Handy taeuschen Gesundheit vor (die laufen ueber die Shell, nicht ueber die App).
  Diagnose nur IM App-Prozess (`onConsoleMessage` -> logcat), siehe die App-Diagnose-Lesson.
- **Cloudflare deckelt Subrequests je Worker-Lauf.** Grosse Sync-Laeufe buendeln (`env.DB.batch()`)
  und ueber einen Cursor (`?nach=`) fortsetzbar machen.
- **Neuer Worker-Pfad ist erst ~10 s nach Deploy aktiv** — direkt nach `wrangler deploy` kann eine
  neue Route noch 404 liefern. Kurz warten, dann testen.
- **Der APP_KEY steckt im APK** = kein Schutz gegen jemanden mit dem Geraet in der Hand. Fuer interne
  Lager-Apps ok, aber dem Kunden ehrlich sagen.

## Anwendung
Naechster Kunde mit "wir wollen was auf dem Handy zum Scannen/Erfassen": dieses Muster nehmen, nicht
neu erfinden. Build-Skript + Keystore aus `kunden/finelli/finadmin/android/` als Vorlage. Voller
Aufbau: `kunden/finelli/finadmin/README.md`.
