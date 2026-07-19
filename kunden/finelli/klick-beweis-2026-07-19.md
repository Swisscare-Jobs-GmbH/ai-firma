# Klick-Beweis-Bericht finelli-cockpit (Trockenflug 19.07.2026)

> Schwarm mvp-klick-beweis: Finder + je 2 unabhaengige Skeptiker pro Fund (Mehrheit zaehlt).
> 7 Roh-Funde, 4 bestaetigt, 3 verworfen. Statisch geprueft (Code gelesen), App nicht gestartet.
> WICHTIG: Fixes gehoeren in den Finelli-Arbeits-Strang (dort liegt ungespeicherte Arbeit an denselben Dateien) — NICHT von hier aus patchen.

## Bestaetigte Demo-Killer (vor dem Kunden-Termin fixen)

### 1. MOCK_BESTELLUNGEN wird nur EINMAL beim Server-Start erzeugt — 'heute' friert ein (2/2 Skeptiker, Risiko: falsche-daten)

**Ort:** backend/app/services/mock_data.py:122 und :166

_erzeuge_bestellungen() nimmt heute = datetime.now(timezone.utc) und das Ergebnis wird als Modul-Konstante MOCK_BESTELLUNGEN eingefroren (shopify_client.py:226 liefert immer diese Liste). Die Tages-Werte selbst sind zwar per toordinal am Kalendertag verankert (gut), aber das 28-Tage-Fenster klebt am BOOT-Tag: laeuft das Backend ueber Mitternacht (Server Freitag gestartet, Demo Montag), fehlen die Verkaeufe der neuen Tage komplett — Journal-Zeile 'heute' = 0, Wochen-Summen und Renner/Ladenhueter-Ampeln rechnen auf altem Fenster. Zusatz-Symptom: der Test-Helfer _erwartete_verkaeufe (tests/test_logistik_v1.py:247) rechnet 'heute' zur LAUFZEIT neu — ueber Mitternacht laufende Test-Sessions weichen vom eingefrorenen Modul-Stand ab.

**Fix-Vorschlag:** MOCK_BESTELLUNGEN nicht als Import-Konstante, sondern als Funktion mit Tages-Cache: beim Zugriff heute.toordinal() pruefen und bei Tageswechsel neu erzeugen (z.B. _cache: tuple[int, list] und mock_bestellungen() -> list; shopify_client ruft die Funktion statt der Konstante). Werte bleiben dank toordinal-Verankerung identisch, nur das Fenster rollt korrekt mit.

### 2. KI-Aufrufe laufen ins 10-Sekunden-Timeout, sobald der ANTHROPIC_API_KEY gesetzt ist (2/2 Skeptiker, Risiko: leere-ansicht)

**Ort:** frontend/src/api/client.ts:34 (timeout: 10000) + fetchBestellVorschlag (Z. 548) + fetchWochenBericht (Z. 508)

Der Axios-Client hat 10s Standard-Timeout. Mit gesetztem KI-Schluessel macht das Backend bei GET /api/bestell-vorschlag (vorschlag_service._ki_begruendungen, max_tokens 2000) und GET /api/wochen-bericht/aktuell (bericht_service.ki_feinschliff, max_tokens 1000) einen synchronen Claude-Aufruf, der oft laenger als 10s dauert. Das Frontend bricht ab und zeigt 'Der Bestell-Vorschlag ist gerade nicht erreichbar' bzw. 'Bericht konnte nicht geladen werden — laeuft das Backend (Port 8012)?', obwohl das Backend arbeitet. Nur fragFinelli (Z. 593) hat bereits 30s. Klasse: 3 KI-Aufrufe im Frontend, 1 abgesichert, 2 offen. Trifft exakt die geplante Demo-Konfiguration (HANDOFF: 'ANTHROPIC_API_KEY setzen — KI-Feinschliff wird automatisch aktiv'); im reinen Mock ohne Schluessel tritt es nicht auf.

**Fix-Vorschlag:** In client.ts bei fetchBestellVorschlag und fetchWochenBericht wie bei fragFinelli { timeout: 30000 } als Request-Option mitgeben (Klasse komplett schliessen). Zusaetzlich robuster: KI-Begruendung/Feinschliff im Backend mit eigenem Timeout kapseln, damit die Regel-Antwort steht, bevor das Frontend abbricht.

### 3. CORS erlaubt nur http://localhost:5173 — 127.0.0.1 oder LAN-IP macht die App komplett stumm (1/2 Skeptiker, Risiko: leere-ansicht)

**Ort:** backend/app/config.py:42 (CORS_ORIGINS Standard-Wahl)

Wird das Frontend im Browser ueber http://127.0.0.1:5173 oder die LAN-IP geoeffnet (z.B. Demo-Laptop des Kunden, Handy im gleichen Netz, oder Browser-Verlauf schlaegt 127.0.0.1 vor), blockt der Browser jeden API-Aufruf (CORS). Der Login zeigt dann 'Server nicht erreichbar — bitte pruefen, ob das Backend laeuft (Port 8012)', obwohl Backend und Frontend beide laufen. Klassische Erst-Aufruf-Falle, die vor Ort schwer zu diagnostizieren ist.

**Fix-Vorschlag:** CORS_ORIGINS-Standard auf 'http://localhost:5173,http://127.0.0.1:5173' erweitern; fuer eine Vor-Ort-Demo ueber LAN die eigene IP vorab in backend/.env eintragen. Demo-Regel: immer exakt http://localhost:5173 oeffnen.

### 4. Mock-Verkaeufe frieren beim Prozess-Start ein — nach Mitternacht fehlt der aktuelle Tag (2/2 Skeptiker, Risiko: falsche-daten)

**Ort:** backend/app/services/mock_data.py:121-166 (MOCK_BESTELLUNGEN = _erzeuge_bestellungen() auf Modul-Ebene, 'heute' = Startzeitpunkt)

Die 28-Tage-Probe-Bestellungen werden einmal beim Import erzeugt und haengen am Kalendertag des Prozess-Starts. Laeuft das Backend ueber Mitternacht (z.B. am Vorabend der Mittwoch-Demo gestartet), zeigt das Journal fuer 'heute' 0 Verkaeufe, die Tages-/Wochen-Summen und der Wochen-Bericht enden bei gestern, und die 'OFFEN'-Bestellungen in der Pickliste haengen am Vortag. Kein Absturz, aber die Live-Zahlen stimmen im Kundengespraech nicht ('Was lief heute?' -> nichts). Verwandt mit der bekannten Zombie-Klasse, tritt aber auch bei einem voellig gesunden Dauerlauf auf.

**Fix-Vorschlag:** MOCK_BESTELLUNGEN von der Modul-Konstante in eine Funktion umbauen, die get_recent_orders pro Aufruf (oder pro Kalendertag gecacht) mit dem aktuellen Datum erzeugt — der Determinismus ueber toordinal bleibt erhalten, der idempotente Import auch. Kurzfristige Demo-Regel: Backend am Demo-Tag frisch starten (deckt sich mit dem Zombie-Riegel im HANDOFF).

## Verworfene Funde (Skeptiker-Mehrheit dagegen)

- Buchungen: Frontend schickt sku als optional (null), Backend verlangt Pflicht-String — variante_id wird ignoriert
- Bestell-Status OFFEN/ERFUELLT haengt am Tages-ABSTAND d, nicht am Kalendertag
- Kalendertag-Anker ist der UTC-Tag, nicht der Schweizer Tag

## Klick-Beweis-Checkliste (was SA vor dem Termin selbst durchklickt)

**Klick-Beweis-Checkliste — Finelli-Cockpit (Vorfuehrung)**

Kein bestaetigter Bruch ist ein Total-Absturz. Die 4 Bruecke machen die App entweder STUMM (leere Ansicht) oder zeigen FALSCHE Zahlen. Reihenfolge unten: erst die Stumm-Macher, dann die Falsch-Zahlen.

**Vorab einstellen (noch nicht klicken):**
- Backend am Demo-Morgen FRISCH starten (Port 8012).
- Im Browser exakt `http://localhost:5173` tippen — NICHT 127.0.0.1, NICHT die WLAN-IP.

---

**Die 7 Beweis-Klicks**

**1. Login-Seite: Namen waehlen + „Anmelden".**
- ✅ Erwartet: Du landest auf der Uebersicht. KEIN roter Text „Server nicht erreichbar — Port 8012".
- Deckt ab: CORS-Bruch (bei falscher Adresse waere die ganze App stumm).

**2. Uebersicht (Handy-Leiste unten: „Bestand"): laden lassen.**
- ✅ Erwartet: Artikel-Kacheln mit Bestand Embrach + Laden Zuerich, Ampeln sichtbar. KEIN „Bestand konnte nicht geladen werden".
- Deckt ab: Erreichbarkeit/CORS + erster Blick auf Renner/Ladenhueter-Ampeln.

**3. Menue „Bestellen" antippen.**
- ✅ Erwartet: Kasten „KI-Bestell-Vorschlag" fuellt sich mit Zeilen (dringendste zuerst). NICHT „Der Bestell-Vorschlag ist gerade nicht erreichbar".
- Deckt ab: KI-10-Sekunden-Timeout — Screen 1 von 2.

**4. Menue „Wochen-Bericht" antippen.**
- ✅ Erwartet: Bericht-Text erscheint und endet bei HEUTE. NICHT „Bericht konnte nicht geladen werden — Port 8012".
- Deckt ab: KI-Timeout Screen 2 von 2 UND Mock-Einfrier-Bruch (Fenster muss bis heute reichen).

**5. Menue „Journal", Filter auf „Tag (7 Tage)".**
- ✅ Erwartet: Zeile fuer HEUTE zeigt Verkaeufe groesser 0 (nicht 0), Tages-Summe stimmt.
- Deckt ab: Mock-Einfrier-Bruch (nach Mitternacht stuende „heute" sonst auf 0).

**6. Menue „Frag Finelli": Frage tippen „Was lief heute?" + senden.**
- ✅ Erwartet: Antwort erscheint in ~30 Sek (dieser Weg hat schon 30-Sek-Puffer).
- Deckt ab: Gegenprobe — beweist, dass der KI-Weg grundsaetzlich traegt.

**7. Menue „Mehr" → „System-Waechter".**
- ✅ Erwartet: alle Checks gruen.
- Deckt ab: Gesamt-Gesundheit (Daten + KI-Schluessel) auf einen Blick.

---

**Muss vor dem Termin gefixt sein (Pflicht-Fixes)**

**1. 🔴 KI-Timeout schliessen — SONST fallen Klick 3 + 4 aus, sobald der KI-Schluessel gesetzt ist.**
In `frontend/src/api/client.ts` bei `fetchBestellVorschlag` (Z. 548) UND `fetchWochenBericht` (Z. 508) `{ timeout: 30000 }` mitgeben — genau wie `fragFinelli` (Z. 593) es schon hat. Ohne Fix zeigen beide Screens „nicht erreichbar", obwohl das Backend rechnet. Das ist der wichtigste Fix, weil die geplante Demo den Schluessel setzt.

**2. 🟡 CORS erweitern ODER Demo-Regel halten.**
In `backend/app/config.py` (Z. 42) `CORS_ORIGINS` auf `http://localhost:5173,http://127.0.0.1:5173` setzen — sonst ist die App stumm, sobald jemand 127.0.0.1 oder die WLAN-IP oeffnet. Minimal-Absicherung ohne Fix: immer exakt `localhost:5173` aufrufen.

**3. 🟡 Mock-Fenster mitrollen ODER Backend frisch starten.**
In `backend/app/services/mock_data.py` `MOCK_BESTELLUNGEN` von Konstante auf Funktion mit Tages-Cache umbauen — sonst zeigt „heute" nach Mitternacht 0 Verkaeufe. Notfall-Regel bis dahin: Backend am Demo-Morgen neu starten (deckt sich mit Klick 5).