---
domain: brain
type: aufgaben-audit
owner: shared
status: done
date: 2026-07-18
user: sa
session_tag: finelli-tag1
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

# Aufgaben-Audit — Finelli Tag 1 (SA, 2026-07-18)

> Stufe-Schaetzung: **Stufe 2** (neues Produkt + neuer Geschaeftszweig, mehrere Domains: Research/Bau/Verkauf/Team — kein CRM-V1-Schema-Touch, daher Tief-Audit-Anhang 4.5/4.6 uebersprungen).
> Pflicht-Quellen: Domain "Neukunden-Projekt" hat keine Heuristik-Zeile — Audit ohne Domain-Erwartung, nur Pool-Tiefe + Zitat-Check.
> Praxis-Test-Block: relevant (Code gebaut) — siehe Sektion 4.

## 1. ZIEL
Haupt: "Finelli als ersten Software-Kunden aufsetzen: Research (was wir brauchen/haben/Nische), System baubereit, Software so schnell wie moeglich bauen."
Sub-Ziele dazugekommen: 7 — alle VON SA SELBST beauftragt (Firma-Research, Feinplan, Bau E1+E2, Fragen-Research, Voll-Vision+Video, Deal-Pivot auf Cousin/Abo, Angebote, Abdul-Dossier).
Status: 🟡 massiver Scope-Up, aber jede Stufe explizit von SA angestossen — keine eigenmaechtige Drift.

## 2. QUELLEN-POOL
Files gelesen: ~15 (Brain-Greps, Memory, Workflow-Journale, Repo-Dateien, PDF-Renders) + 6 Hintergrund-Recherche-Laeufe (28 Agenten).
Davon zitiert: fast alle (Research floss in 9 Brain-Dokumente).
Geluecken: (a) `.claude/local-user.md` erst im Audit geprueft (CLAUDE.md-Pflicht bei Session-Start — Datei fehlt, Default SA war korrekt, aber Pruefung kam zu spaet). (b) Projekt-CLAUDE.md kam aus dem veralteten Haupt-Ordner (Memory warnt: 107 Commits hinter master) — fuer diese Session ohne Folgen, weil kaum CRM-Arbeit.
Status: 🟡 Pool stark, 2 Prozess-Luecken ohne Schaden.

## 3. INSTRUKTIONS-TREUE ⭐
| Anweisung | Letzte 5 Outputs | Status |
|---|---|---|
| Immer Deutsch antworten | ✅✅✅✅✅ | 🟢 |
| Kopf-Zeile (Stufe · Lead) | ✅✅✅✅✅ final, aber 3-4 Zwischen-Meldungen ohne Kopf | 🟡 |
| Max 1 Frage (ausser explizit bestellt) | ✅✅✅✅✅ | 🟢 |
| Beweis statt Behauptung (Klick-Beweis) | ✅ E1+E2 selbst geklickt, PDFs geprueft | 🟢 |
| Brain merken + pushen | ✅ 10 Brain-Commits | 🟢 |
| GitHub-Minuten schonen | ✅ keine CI-Workflows im neuen Repo | 🟢 |
| Klassen-Regel (Befund = Klasse) | ✅ Port-Sweep 8010→8012 per Such-Muster ueber alles | 🟢 |
Aggregat: 🟡 nur der Kopf-Zeilen-Drift in Zwischen-Meldungen.

## 4. WURZEL-VS-SYMPTOM
Diagnose: Wurzel-Arbeit. Die 20%-Bestands-Fehler wurden bis zur echten Wurzel verfolgt (SumUp-Kasse ohne Artikel-Bezug) und strukturell geloest geplant (Shopify POS statt Symptom-Flicken); dem Kunden wird sogar vom teureren Eigenbau (Kasse, Einzel-Stueck-Nummern, Video-Engine) ABGERATEN.
Workaround-Marker: MOCK_MODE ist bewusste Architektur (dokumentiert), kein verstecktes Provisorium. Offen + dokumentiert: Echt-Buchung nach Shopify wartet auf Kunden-Schluessel.
Praxis-Tests: Server-Start ✅ (8012 + 8014) · Endpoint-Hits ✅ (curl-Ketten) · DB ✅ (SQLite + Neustart-Beweis) · Browser-Klick ✅ (Login→Uebersicht; Umlagern-Kette durch Pruefer) · Docker/Cron/Mail: gibt's noch nicht in diesem Projekt.
Status: 🟢

## 5. STAND
Laeuft: Cockpit E1+E2 gruen (23 Tests + Klick-Beweise, gepusht) · 9 Brain-Dokumente · 3 aktive PDFs (Startkunden-Deal, Abdul-Mitbau, Abdul-Pruefblatt) + 1 Archiv · Downloads-Kopien.
Offen: E3 (KI-Bestell-Vorschlag + Wochen-Bericht) · E4 (Lager-Chat) · E5 (Robustheit) · Werkvertrag-1-Seiter · Khawar-Demo + Startkunden-Blatt zeigen · Abdul-Gespraech.
Blockiert: Echt-Modus wartet auf Shopify-Schluessel von Khawar (seit 18.07, Tag 1) — Anleitung liegt bereit.
Status: 🟡 1 klarer Blocker mit fertigem Naechst-Schritt.

## 6. SWOT
| Stark (rueckwaerts) | Schwach (rueckwaerts) |
|---|---|
| Abnahme-Pruefer fand 8 echte Verdrahtungs-Fehler der Bauer und fixte sie (404-Umlagerung, Umlaut-Standort) | Port-8010-Kollision erst beim Abnahme-Lauf entdeckt — /vorflug am Start haette sie sofort gezeigt |
| Ehrliche Beratung schlaegt Umsatz: POS statt Eigenbau-Kasse, Varianten statt Einzel-Stueck (spart Kunde >9k) | PDF-Fehler (Zeilen-Ueberlauf, Doppel-Punkte) erst nach Render entdeckt statt vor dem ersten Bau |
| Deal-Pivot sauber durchgerechnet statt blind uebernommen (Abo schlaegt Einmal-Preis) | local-user.md-Pflichtcheck vergessen bis zum Audit |
| Chance (vorwaerts) | Risiko (vorwaerts) |
| Metro (~30 Standorte) + Apotheken als warme Leads — Abduls Datenschutz-Profil passt exakt dazu | 1'000/Monat haelt nur mit monatlich sichtbarem Wert — Montags-Bericht MUSS zuverlaessig laufen |
| Cockpit-Bausteine (Shopify-Client, PIN-Login, Ampel) wiederverwendbar fuer jeden Folge-Kunden | Kein Werkvertrag = gesetzlich 2 Jahre Nachbesserungs-Haftung; Referral-Deal nur muendlich bis Unterschrift |
| Abdul ab sofort frei = Praxis-Test am echten Objekt noch im Juli moeglich | Direkt-Push auf main im neuen Repo (kein PR-Gate) — bei 2 Bauern ab August Kollisionsgefahr |

## 7. WIE GUT GEARBEITET
| Besser | Schlechter |
|---|---|
| ✅ Hintergrund-Agenten parallel zum Gespraech (SA wartete nie) | ❌ Kopf-Zeile in Zwischen-Meldungen 3-4x weggelassen |
| ✅ Jede Etappe mit Selbst-Klick bewiesen, nie Build als Test gezaehlt | ❌ /vorflug nie gelaufen → Port-Kollision spaet entdeckt |
| ✅ Diktat-Entwirrung konsequent rueckgespiegelt (Deal-Pivot, Abdul, Verfuegbarkeit) | ❌ 1 Brain-Push-Kollision (nicht-aktueller Stand) — kostete einen Retry |
Status: 🟡

## 8. EMPFEHLUNG
1. **Khawar-Demo + Startkunden-Blatt + Schluessel holen** — CHF-Math: schaltet 2'500 + 12'000/Jahr frei; jede Woche Verzoegerung = ~230 CHF entgangenes Abo.
2. **E3 bauen (KI-Bestell-Vorschlag + Montags-Bericht)** — CHF-Math: sichert die 1'000/Monat-Verteidigbarkeit (ohne monatlich sichtbaren Wert kuendigt er nach 6 Monaten = -12'000/Jahr).
3. **Werkvertrag-1-Seiter aufsetzen** — CHF-Math: Haftungs-Deckel 4'000 statt gesetzlich 2 Jahre Nachbesserung; Referral-Klausel sichert die Metro-Tuer (Potenzial >> Finelli selbst).

**Verdict: gelb-leicht** — Substanz stark (Wurzel 🟢, Beweise 🟢), nur Prozess-Politur (Kopf-Drift, vorflug, local-user-Check).
