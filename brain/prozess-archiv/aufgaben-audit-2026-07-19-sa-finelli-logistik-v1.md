---
domain: brain
type: aufgaben-audit
owner: shared
status: done
date: 2026-07-19
user: sa
session_tag: finelli-logistik-v1-haertung
verdict: gelb
gelb_typ: leicht
sektion_status:
  ziel: gelb
  quellen_pool: gelb
  instruktions_treue: gelb
  wurzel_symptom: gruen
  stand: gelb
  swot: na
  wie_gearbeitet: gelb
  empfehlung_count: 3
---

# Aufgaben-Audit 2026-07-19 — Finelli Logistik-V1 (Bau + Haertung + Vertrag + Angebot)

🔬 HARD-AUDIT-MODE AKTIV (Trigger #1 Stufe 2 Kunden-Deal + Trigger #4 "deep/hard-audit" im Auftrag)
Stufe-Schaetzung: **2** — Kunden-Deal (18k CHF) + Mehr-Domaenen (Vertrag/Recherche/Voll-Bau/Design), kein CRM-Schema-Touch.
Marker-Hinweis: Alt-Marker von Session sa-finelli-tag1 (18.07 14:21) — andere Session, kein Idempotenz-Stopp.

Pflicht-Quellen geladen (V2-Pflicht):
- HANDOFF.md ✅ (Session-Start, komplett)
- docs/ANGEBOT-SESSION-BRIEF.md ✅
- docs/MITTWOCH-PLAN.md ✅
- CLAUDE.md (finelli) ✅
- docs/ETAPPE-3-SPEC.md ✅
- docs/VERTRAG-ENTWURF.md ✅
- docs/PLAN.md ❌ NIE GELESEN (HANDOFF sagte "ZUERST lesen") — Sektion 2 🟡
- Brain-Inbox 2026-07-18-finelli-*.md ❌ nicht gelesen (nur als Zeiger bekannt) — Sektion 2 🟡

8-Anker-Status:
| # | Anker | Status |
|---|---|---|
| 1 | Praxis-Test-Block (7 Punkte) | ✅ angewandt (siehe Block 3) |
| 2 | CORS / Production-Hardening | ✅ CORS fix auf 5173; ❌-Anteil: JWT-Secret dev-default + PIN 0000 — vor Kunden-Betrieb aendern (dokumentiert) |
| 3 | Externer-Review | ✅ teilweise: 42-Pruefer-Adversarial-Schwarm (30 bestaetigte Funde eingebaut); echtes claude.ai-Cross-Review NICHT gemacht |
| 4 | Hormozi-CHF-Math-Anker | ✅ in Empfehlung |
| 5 | Worktree/Parallel-Chat-Risiko | ✅ kein Worktree, 1 Chat, main-Direktpush (Greenfield-Regel Finelli) |
| 6 | Pflicht-Quellen-Lese-Status | ❌ PLAN.md + Brain-Inbox fehlten |
| 7 | Bequemlichkeits-Pattern | ✅ Echt-Modus-Paginierung BEWUSST geparkt + im Code-Docstring dokumentiert, kein stilles "kommt spaeter" |
| 8 | RAV-No-Touch | ✅ trifft nicht zu — Finelli-Repo, CRM-DB/Ports nie beruehrt (8012/5173 eingehalten) |

Praxis-Test-Status:
| # | Test | Status |
|---|---|---|
| 1 | Server-Start (uvicorn 8012 → /readiness 200) | ✅ mehrfach, roh zitiert |
| 2 | DB-Setup (SQLite create_all + Neustart-Beweis) | ✅ Zuweisung/Pickliste ueberleben Neustart |
| 3 | Endpoint-Hit (curl journal/waechter/zuweisungen) | ✅ roh zitiert |
| 4 | Docker-Build | gibt's nicht in dieser Domain |
| 5 | Cron/Scheduler | gibt's nicht in dieser Domain |
| 6 | Email/Alarm | gibt's nicht in dieser Domain |
| 7 | Integration gegen echte DB | ✅ 36 Tests (frische DB je Test) + Browser-Klick-Kette gegen Dev-DB |

## 1. ZIEL
Haupt: Finelli weiterfuehren — (1) Werkvertrag auf Deal V3, (2) Markt-Zahlen belegen, (3) Logistik-V1 bauen (5 Teile, Uebungs-Modus, Beweis-Pflicht), (4) SA an Khawar-Nachricht + Angebots-PDF erinnern.
Sub-Ziele dazugekommen (mit SA-Ansage): Fix-Tiefe A (robust + App-Killer) + System-Waechter · Design-Auswahl A/B (B gewaehlt) · SW-Kosten-Frage an Khawar · Anti-Fail-Audit + PDF-Recherche.
Status: 🟡 — Fix-Umfang ging leicht ueber Antwort "A" hinaus (billige Echt-Modus-Fixes mitgenommen statt geparkt); im Geist von "wir duerfen nicht failen", aber ohne explizite Rueckfrage.

## 2. QUELLEN-POOL
Files gelesen: ~30 (kompletter Backend-/Frontend-Code, Docs, Skill-Anhang, Review-Ergebnisse).
Davon zitiert/verwendet: fast alle (Code-Bau).
Pflicht-Quellen gefehlt: docs/PLAN.md (HANDOFF-ZUERST-Anweisung) · Brain-Inbox finelli-* (Deal-Strategie/Schmerz-Landkarte).
Folgen-Einschaetzung: gering fuer den Bau (Scope-Pivot + MITTWOCH-PLAN deckten alles); moeglicher Verlust an Deal-Nuancen fuer Angebots-Arbeit.
Umsonst gelesen: keine.
Status: 🟡 — 2 Pflicht-Zeiger nicht gelesen, Rest stark.

## 3. INSTRUKTIONS-TREUE

| Input | Anweisung | Letzte 5 relevante Outputs | Status |
|---|---|---|---|
| Auftrag | Deutsch + SA-Format (Kopf, Fazit zuerst, Tabellen, Klartext) | ✅✅✅✅✅ | 🟢 |
| Auftrag | Reihenfolge Vertrag→Zahlen→Bau→Erinnern | eingehalten | 🟢 |
| Auftrag | jede Etappe committen+pushen | 11 Etappen-Commits | 🟢 |
| Auftrag | vor "fertig": pytest + Klick-Beweis | ✅ inkl. ehrlichem "nicht am Schirm gesehen" bei Race-Fixes | 🟢 |
| SA "A" | nur Demo-Absicherung + App-Killer fixen | mehr gefixt als A verlangte (billige Robustheit dazu) | 🟡 |
| Global | max 1 Frage pro Antwort | 1x Entscheid-Stau-Liste (3 offene Punkte gleichzeitig ausgewiesen) | 🟡 |
| CLAUDE.md | keine .github/workflows, Ports 8012/5173, nichts selbst an Khawar senden | ✅ | 🟢 |

Aggregat: 🟡 — 2 leichte Abweichungen, keine systematische.

## 4. WURZEL-VS-SYMPTOM
Diagnose: Session hat 2-stufig gearbeitet — erster Mock-ID-Fix war NUR SYMPTOM (IDs datumsfest, Formeln nicht); der Hard-Audit hat die Rest-Wurzel gefunden: Formeln hingen am Tages-Abstand → Kalendertag-Verankerung (toordinal) nachgezogen + Dev-DB bereinigt (310 Alt-Zeilen) + Beweis 440=440 (Live-Journal = Formel-Erwartung).
Workaround-Marker im Diff: 0 neue TODO/HACK/skip; 2 bewusst geparkte Echt-Modus-Punkte offen im Docstring dokumentiert (Paginierung, lineItems>20).
asyncio-Sperren: architektur-angemessen fuer 1 Prozess, Postgres-Pfad dokumentiert.
Status: 🟢 — Wurzel am Ende sauber; Lehre: halber Fix waere ohne Hard-Audit liegen geblieben.

## 4.5 LIVE-DB-CHECK (best effort — Finelli/SQLite, kein CRM)
DB: backend/data/cockpit.db (rohes Output in Session zitiert)
Tabellen: 7 (umlagerungen, korrekturen, bestellungen, plaetze, platz_zuweisungen, picklisten, verkaeufe) — 🟢
Unique-Constraints: (standort,code) plaetze · (sku,standort) zuweisungen · (bestellung_id) picklisten · (bestellung_id,sku) verkaeufe — Idempotenz per Test + Live bewiesen — 🟢
Alt-Daten-Drift: 310 verseuchte Zeilen GEFUNDEN + geloescht; Re-Sync 440 = Formel 440 — 🟢 (nach Fund)
CRM-public-Tables: nicht zutreffend — CRM-DB nie beruehrt (nur data/cockpit.db) — 🟢
Tests: 36 (23 Etappe1+2, 13 Logistik) — 🟢
Status: 🟢 best-effort — der Drift-Fund IST der Wert dieses Checks.

## 4.6 EXTERNER-REVIEW
Stufe: 2. Durchgefuehrt: 42-Agenten-Adversarial-Review (18.07 nacht, 37 Funde → 30 bestaetigt → eingebaut) + zweiter Anti-Fail-Schwarm (CRM-Muster + PDF-Recherche) laeuft.
Echtes claude.ai-Cross-Review: ❌ nicht gemacht.
Status: 🟡 — unabhaengige Agenten-Reviews ja, externes Zweit-System nein; Vertrag geht ohnehin zum Juristen (SA-Pflichtpunkt).

## 5. STAND
Was laeuft: V1 komplett (5 Teile) + 30 Review-Fixes + System-Waechter + Datums-Wurzel-Fix — alles gepusht, 36 Tests gruen, Klick-Beweise.
Was offen: Anti-Fail-Schwarm-Ergebnis einarbeiten · PDF Variante B bauen · Khawar-Antworten (SW-Kosten-Liste etc.) · Echt-Modus nach Schluessel.
Was blockiert: Shopify-Schluessel (seit 18.07, 1 Tag) → Echt-Modus + KI-Feinschliff-Key.
Status: 🟡 — 1 externer Blocker, klare naechste Schritte.

## 6. SWOT

| Stark (rueckwaerts) | Schwach (rueckwaerts) |
|---|---|
| Beweis-Kultur hart: 440=440-Abgleich, Klick-Ketten, Haerte-Tests (alter Code muss rot sein) | Pflicht-Quellen PLAN.md + Brain-Inbox nie gelesen (HANDOFF-Anweisung) |
| 42-Pruefer-Review VOR Kunde — 30 echte Funde, 2 App-Killer eliminiert | Erster Mock-ID-Fix war halb (Symptom) — Wurzel erst im Hard-Audit |
| Ehrliches Parken statt stillem Skippen (Echt-Modus-Punkte im Docstring) | Backend anfangs ohne --reload gestartet → Zombie-Stale-Code-Risiko selbst erzeugt (CRM-Muster!) |

| Chance (vorwaerts) | Risiko (vorwaerts) |
|---|---|
| Demo Mittwoch aus Position der Staerke (Waechter als Abo-Wert-Beweis) | Echt-Modus ungetestet — Shopify-Kosten-Limit-Punkte NUR dokumentiert, nicht gebaut |
| Schwarm-Fehler-Landkarte wird wiederverwendbare Anti-Fail-Checkliste | Barcode nie mit echtem Scanner getestet (Hardware erst Mittwoch bekannt) |
| PDF-B + DISC-Recherche → Angebot das Blau-Rot hookt | Dev-Secrets (PIN 0000/JWT-default) duerfen NICHT in den Kunden-Betrieb |

## 6.5 OUTSIDE-LENS (10 Ebenen)

| # | Ebene | Befund (Beleg) | Severity |
|---|---|---|---|
| 1 | Schema | 4 Unique-Constraints aktiv; Idempotenz live bewiesen (Re-Sync 0 neu) | 🟢 |
| 2 | Code | Sperren prozess-lokal statt DB-atomar — ok fuer 1 Worker, dokumentiert (picklisten.py/verkauf_service.py) | 🟡 |
| 3 | Test-Coverage | Mock stark (36); Echt-Modus 0 Tests — ohne Schluessel nicht testbar, ehrlich markiert | 🟡 |
| 4 | Security | JWT_SECRET dev-default + PIN 0000 in config.py — Uebungs-Modus ok, Kunden-Betrieb NEIN | 🟡 |
| 5 | Production-Readiness | kein Logging-Konzept, kein SQLite-Backup-Plan — vor Echt-Betrieb noetig | 🟡 |
| 6 | Senior-Reviewer | Barcode-SVG selbst gebaut (Norm-Tabelle im Review verifiziert), aber 0 echte Scanner-Tests | 🟡 |
| 7 | CRM-No-Touch | Ports 8012/5173, keine CRM-Pfade im Diff (git log sauber) | 🟢 |
| 8 | Hormozi CHF | Fixes schuetzen direkt die 18k-Unterschrift + 500/Mt (48h-Garantie = jede Stoerung kostet real) | 🟢 |
| 9 | Bau-Test-Zyklus | Plan→Bau→Klick→Schwarm-Review→Fix→Beweis eingehalten | 🟢 |
| 10 | Lessons angewandt | Zombie-Muster erkannt+behoben (--reload), gruene-Tests-blind adressiert (Haerte-Tests), Klick-Beweis-Pflicht gelebt | 🟢 |

ROT-Count: 0 · Gelb: 5 (alle vor Echt-Betrieb abzuarbeiten, keiner blockt Mittwoch-Demo)

## 7. WIE GUT GEARBEITET

| Was besser | Was schlechter |
|---|---|
| Fund im Audit selbst: 310-Zeilen-Drift entdeckt BEVOR er die Demo verfaelscht | HANDOFF-Lese-Anweisung (PLAN.md) uebergangen |
| SA-Ansagen sofort umgesetzt (B-Design, SW-Kosten-Frage in MITTWOCH-PLAN + Entwurfstext) | Halber ID-Fix zuerst — Wurzel-Frage nicht sofort zu Ende gedacht |
| Ehrliche Fertig-Meldungen (nicht-am-Schirm-gesehen ausgewiesen) | Entscheid-Stau: 3 offene A/B-Punkte parallel statt sauber nacheinander |

Status: 🟡

## 8. EMPFEHLUNG
1. Schwarm-Ergebnis einarbeiten + PDF Variante B bauen (heute) — CHF-Math: das Angebot ist der direkte Hebel auf die 18'000-CHF-Unterschrift am Mittwoch.
2. Generalprobe vor Mittwoch: frische Dev-DB, Start-Rezept MIT --reload, komplette Klick-Kette einmal durch — CHF-Math: verhindert Demo-Fail vor Kunde Nr. 1 (18k + Tueroeffner-Wette Metro-Liga ≈ 30k+ Folgewert).
3. Vor Echt-Betrieb-Block (nach Schluessel): JWT-Secret/PINs ersetzen + SQLite-Backup + Orders-Paginierung bauen + Scanner-Test — CHF-Math: schuetzt 500/Mt Betrieb + 48h-Garantie (jede verpasste Stoerung = 500 erlassen + Rate verschoben = direkter Cash-Verlust).
