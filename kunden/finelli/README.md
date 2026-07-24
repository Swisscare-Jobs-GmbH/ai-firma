# Finelli — Kunden-Kontext

**Kunde:** Finelli Studios AG (Streetwear, ~60 Artikel, 2 Lager: Embrach + Laden Zuerich City).
Tueroeffner: Khawar (SAs Cousin), Kunde Nr. 1 + Referenz. **Zwei Code-Repos:**
Verkaufs-MVP `C:\dev\finelli-cockpit` (SA-Rechner, Ports 8012/5173) · Produktions-Projekt
`C:\Projects\AIWorks\finelli-lagerverwaltung` (AB-Rechner, Phase 1, noch kein Code —
`brain/_cross-ref/FINELLI-LAGERVERWALTUNG.md`).

**Termin:** SA geht **Mittwoch, 22.07.2026** vor Ort (SA-Ansage 19.07). Angebots-Blatt trug faelschlich
"Mittwoch, 23. Juli" (23. = Donnerstag) — korrigiert auf Zweig `fix/angebot-datum-mittwoch-22`.

**Stand (19.07.2026):**
- 🟡 Angebot **V6 "Momente"** ueberreicht 19.07 (PDF in SAs Downloads) — Deal-Modell: CHF 2'500 Start
  + CHF 1'000/Monat (6 Mt. Mindestlaufzeit) + Vermittlungs-Deal (Metro ~30 Standorte, Apotheken).
  - Richter-Panel-Funde vor dem Termin abarbeiten: `klick-beweis-2026-07-19.md` + Angebots-Panel (Widerspruch
    "keine versteckten Kosten" vs. Vertrag schliesst Scanner-Hardware aus).
- 🟡 **KI-Etappe** auf Sicherungs-Spur `sicherung/ki-etappe-2026-07-19`. Darauf aufgesetzt: 4 Demo-Killer
  gefixt (Draft-PR #1: Mock-Tages-Cache, KI-Timeouts 30s, CORS 127.0.0.1) — nur SA merged.
- **Naechster Schritt:** vor Mittwoch die Demo-Killer-Fixes + KI-Etappe in die Haupt-Spur, dann Klick-Probe.
- 🟡 **Bauplan "3 KI-Mitarbeiter"** (Research + KPI + Manager, SA-Auftrag 21.07) liegt vor:
  `2026-07-21-bauplan-ki-mitarbeiter.md` — von Richter-Panel geprueft.
- 🟢 **Prototyp gebaut 21.07** (Opus 4.8): `ki-mitarbeiter-prototyp/` — lauffaehige Demo aller 3
  Mitarbeiter (Node, Port 8030, `node server.js`), 18/18 Tests gruen, Klick-bewiesen. Gebaut vor
  dem Ja auf SA-Entscheid ([Gate-0-Ausnahme E5](../../brain/decisions/E5-finelli-ki-mitarbeiter-prototyp-vor-ja.md))
  als **Demo fuer Termin 22.07**. Echtbetrieb (Shopify + Live-Research) bleibt hinter Gate E5.

**Stand (22.07.2026) — Lager-Rundgang vor Ort + erste Datenauswertung:**
- 🟢 **Marktanalyse aus dem echten Bestellexport** (`2026-07-22-marktanalyse-lagerkarte.html`,
  Doppelklick): 7/30/90-Tage-Fenster, Wochenverlauf mit Prognose, Kategorien, Groessen, Kanaele,
  plus **2D-Lagerkarte in Draufsicht** mit den Zonen Renner/Standard/Saison/Abverkauf/Langsamdreher.
- 🔴 **Der Event-Effekt ist bereits vorbei:** Das Festival-Merch machte im 30-Tage-Fenster 44 % der
  Stueckzahl aus, im 7-Tage-Fenster noch 5 %. Es gehoert in den Abverkauf, nicht nach vorne.
  Lehre verallgemeinert: `brain/lessons/kunde/2026-07-22-lagerordnung-aus-verkaufsraten-statt-bestand.md`.
- 🟢 **MDE-Demo `demo-mde/lager-embrach.html` auf die echten Artikel umgestellt** (Mock-Katalog raus,
  14 reale Artikel mit ihren 7/30/90-Tage-Mengen rein), neue Zone **E = Abverkauf** in Karte und
  Legende. Klick-bewiesen: Karte oeffnet fehlerfrei, Konsole leer, Klick auf den Top-Artikel laesst
  das Fach direkt am Packplatz aufleuchten.
- 🔍 **Zwei Zahlen-Widersprueche offen:** Im Gespraech fiel eine Monats-Bestellmenge, die der Export
  um rund Faktor 10 unterbietet · der Export enthaelt 508 verschiedene Artikelnamen bei rund 60
  gepflegten Modellen (Kassen-Freitext). Beides vor der Inventur klaeren.
- 🔴 **Datenschutz:** Der Rohexport wurde vom Auto-Sync mitgepusht und ist jetzt untrackt +
  ignoriert. Historie unveraendert → SA-Entscheid **T4** in `brain/shared/todos/for-sa.md`.

**Stand (24.07.2026) — SEA-Lager-App gebaut und produktiv-nah:**
- 🟢 **Standalone-Handy-App "SEA"** (`finadmin/`, voller Aufbau in `finadmin/README.md`): eine
  HTML-Datei als Android-APK (WebView) + Cloudflare-Worker/D1-Backend, mit Shopify verbunden
  (`finelli-gmbh.myshopify.com`). Kachel-Menue (farb-orientiert): Produkt-Info (scannen/suchen),
  Wareneingang, Umlagern (Standort zh↔emb + Lagerplatz), Bestellungen (picken/packen mit Timer),
  Katalog. Produktbilder ueberall. Zwei interne Standorte (Zuerich/Embrach) auf einem Shopify-Standort.
- 🟢 **Auf zwei Handys installiert und klick-bewiesen** (Samsung S24 Ultra + TCL). EAN-Codes,
  Buchungen und Lagerplaetze syncen ueber den Server (Warteschlangen mit Retry) — man scannt nie
  denselben Artikel doppelt. Entwurf-Produkte aus Shopify erscheinen sofort (Produkt-Webhooks).
- 🔍 **Offen:** "Versenden in Shopify" braucht Scope `write_fulfillments` — der Shop muss den
  Installations-Link EINMAL neu oeffnen. Bis dahin laeuft alles andere.
- Lehren verallgemeinert: `brain/lessons/bau/2026-07-24-standalone-android-app-ohne-gradle-cloudflare-backend.md`
  · `brain/lessons/system/2026-07-24-geraeteuebergreifender-sync-server-wahrheit.md`.

**Dateien hier:** firma-profil · schmerz-landkarte · deal-strategie · wert-ranking · ausbau-plan ·
**finadmin/ (SEA-Lager-App: APK + Cloudflare-Backend, 22.-24.07 — Quelle der Wahrheit `finadmin/README.md`)** ·
**marktanalyse-lagerkarte (22.07, Auswertung des Bestellexports + Lager-Zonen)** ·
feinplan · logistik-research · offene-fragen · antworten-sa · antworten-runde2 ·
branchen-recherche-markt-schmerzen (19.07) · **bauplan-ki-mitarbeiter (21.07)** ·
angebots-panel-2026-07-19 · klick-beweis-2026-07-19 ·
wochen-bericht-2026-07-19 (Entwurf, SA muss gegenlesen) · **demo/** (Verkaufs-Demo fuer den
Termin, 20.07 — Pitch-Seite `index.html` + App-Simulation "Cockpit-Vorschau" `app.html` (PIN 2019), je mit eigenem Klick-Beweis) ·
**praesentation/** (Ueberzeugungs-Deck 3 Modelle Basic/Premium/Max + Konfig, 20.07 — Generator:
`vorlagen/praesentation/`, zuerst dessen ANLEITUNG.md lesen).
(Umgezogen aus swisscare-brain/users/sa/inbox — dort das Original noch vorhanden.)
