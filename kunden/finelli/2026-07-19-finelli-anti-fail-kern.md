# Finelli Anti-Fail-Kern (19.07.2026) — CRM-Fehlerklassen + Verkaufs-Recherche

> Quelle: Anti-Fail-Schwarm (16 Agenten, 14 Fehlerklassen aus 2 Wochen CRM gegen das
> Finelli-Repo geprueft) + PDF/DISC-Recherche + Judge-Panel Angebot v5 (Noten 8 / 8.5 / 8).
> Fixes sind UMGESETZT (Commit 9c26d4f im finelli-cockpit) — dieses File ist das WARUM.

## 1. Die 14 CRM-Fehlerklassen — Treffer-Bild bei Finelli

**Volltreffer (ja, war offen oder live):**
1. **Doppelte Logik an 2+ Orten** — Ampel-Schwellen lebten in Backend (rot<=3/gelb<=10)
   UND Frontend (rot<=2/gelb<=8) mit ABWEICHENDEN Werten; Uebersicht vs. Wochen-Bericht
   haetten sich Mittwoch in der Demo widersprochen. Fix: Frontend-Formel GELOESCHT,
   Backend-Feld wird durchgereicht. Lehre: Doppel-Logik toeten, nicht angleichen.
2. **Zombie-Prozess / Umgebungs-Doku geglaubt** — Backend lief seit 00:43 und servierte
   alten Code OHNE die neuen Routen, obwohl mit --reload gestartet (WatchFiles hing);
   /readiness war blind (statische Version). netstat zeigte sogar eine tote PID als
   Port-Besitzer (Waisen-Kind hielt das Socket). Fix: /readiness liefert jetzt
   `gestartet_um` + `code_stand` — Messung statt Glauben.
3. **Meldung statt Beweis beim Speichern** — main.py importierte 4 Dateien, die noch
   UNGETRACKT waren; ein `git add -u`-Sammel-Commit haette ein kaputtes Repo gepusht
   (kein CI als Netz!). Fix: Regel „git status --short muss leer sein vor Push" +
   pre-commit-Hook gegen Konflikt-Marker.

**Klasse schlaegt abgewandelt zu (teilweise):** gruene Tests blind (Haerte-Probe:
ROT_SCHWELLE 3→6 verfaelscht → 47/47 Tests BLIEBEN GRUEN, weil Mock-Daten die
Grenzbereiche 3-6/8-10 meiden → Grenzwert-Test ergaenzt) · Stand-Verwechslung
(eine DB fuer Mock+Echt → getrennte Dateien cockpit-uebung.db/cockpit.db; Mock-IDs
als MOCK- markiert) · CWD-Falle (.env + SQLite-Pfad waren relativ zum Start-Ordner
→ fest am backend-Ordner verankert) · create_all erweitert nie Tabellen (→ Mini-
Schema-Waechter mit Klartext-Stopp) · HANDOFF-Behauptungen driften („alles gepusht"
stimmte am Folgetag nicht mehr → Kopfzeile „messen, nicht glauben") · Konflikt-Marker
(globale Skills machen git add -A ohne Marker-Check — Finelli-lokal per Hook gefixt).

**Nicht relevant (Struktur fehlt):** Master-Drift/Migrations-Kollision,
Stacked-PR-Falle, CI-CONFLICTING-Blocker — Finelli hat 1 Bauer, 1 Zweig, kein CI.

**Offene Empfehlung an SA (globale Skills, NICHT umgesetzt — Freigabe noetig):**
chat-end-clean (git add -A) und /sync (git add .) haben KEINEN Konflikt-Marker-Check —
1-Zeilen-Gate wuerde CRM + Finelli gleichzeitig schuetzen.

## 2. Echt-Modus-Warnung (bleibt bis Schluessel-Tag)

ALLE 48 Tests decken nur den Mock ab. shopify_client.py markiert sich selbst 5x als
UNGETESTET. Pflichtsatz in jedem Rapport bis zum ersten echten Shopify-Aufruf:
„Echt-Modus nicht am Schirm gesehen." Erster Schritt mit Schluessel: Orders-Paginierung,
dann pro MOCK_MODE-Gabel (6 Stellen) 1 Rauch-Test.

## 3. Verkaufs-Recherche-Kern (fuer JEDES kuenftige Angebot wiederverwendbar)

**Onepager-Aufbau (Dock.us/Qwilr/Hormozi):** Ergebnis-Headline mit Zahl (NIE Produktname)
→ 3-Zahlen-Scan-Leiste → Wert-Stapel mit hergeleitetem Preis-Anker → Beweise (exakte,
pruefbare Zahlen) → konditionale Garantie („Wenn X nicht bis Y, dann Z" — das Wort
„Garantie" allein ist wertlos) → Verknappung NUR mit logischem Grund (Kapazitaet) →
EIN spezifischer CTA. Max ~300 Woerter, 40% Weissraum, Kaufentscheid faellt im
30-Sekunden-Scan.

**Blau-Rot (DISC) kauft:** Fazit zuerst, Beweis danach · ROI in CHF mit offenem
Rechenweg (konservativ rechnen + dazuschreiben) · Worst-Case schwarz auf weiss ·
er entscheidet (Optionen + Empfehlung, nie Befehl) · Skepsis = Kaufsignal.
**Blau-Rot toetet:** Smalltalk, Hype-Sprache, EINE unbelegte Zahl (diskreditiert alle
anderen), Druck ohne Grund, vage Woerter statt Zahl+Datum.

**Judge-Panel v5 (Noten 8/8.5/8) — wichtigste Textfixes fuer ein evtl. v7:**
„Marktwert 18'000" umbenennen (750x24=18'000 — ein Blauer rechnet nach; als
„Selbstkosten" deklarieren haelt den 30'000-Anker glaubwuerdig) · Bewertungs-Zahl
exakt auszaehlen („X von Y feiern FINELLI" statt „praktisch alle") · 48h-Garantie
praezisieren (welche Rate, wie lange) · „Ketten-Liga?" durch klare Bedingung ersetzen ·
Deadline als Entscheidung rahmen („Am Mittwoch entscheidest du, ob du Kunde Nr. 1 bist").

## 4. Prozess-Lehren (destilliert)

- **Messen schlaegt Glauben:** /readiness-Stempel vor jeder Umgebungs-Aussage; openapi.json
  als Routen-Probe hat den Zombie entlarvt.
- **Haerte-Probe als Pflicht:** Fix ausbauen → 1 Test muss rot werden. Mock-Daten muessen
  die GRENZWERTE enthalten, sonst testen sie die Schwellen nie.
- **Browser-Panel-Macke (React):** synthetische Klicks/Tipp-Eingaben kommen nicht immer an —
  DOM-Klick + native Setter + requestSubmit als bewaehrter Fallback (Klick-Beweise bleiben echt:
  dieselben Handler laufen).
