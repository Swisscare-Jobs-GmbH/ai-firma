---
domain: brain
type: aufgaben-audit
owner: shared
status: done
date: 2026-07-20
user: sa
session_tag: erst-offerte-finelli
verdict: gelb
gelb_typ: leicht
sektion_status:
  ziel: gruen
  quellen_pool: gruen
  instruktions_treue: gelb
  wurzel_symptom: gelb
  stand: gelb
  swot: na
  wie_gearbeitet: gelb
  empfehlung_count: 3
---

# Aufgaben-Audit — Erst-Offerte Finelli (Session 19.-20.07.2026)

Stufe-Schaetzung: **Stufe 3** (1 Domain: Kunden-Angebots-Dokumente; Mandatory-Trigger "kunde" aktiv
→ kein Trivial-Skip, voller Audit; kein CRM-V1-Bau → kein Hard-Audit-Mode).

Pflicht-Quellen geladen: keine Domain-Heuristik fuer "Angebots-Bau" — de-facto-Pflichtquellen alle
im Chat gelesen: beide Blatt-HTMLs, VERTRAG-ENTWURF.md, HANDOFF.md, MITTWOCH-PLAN.md,
ANGEBOT-SESSION-BRIEF.md (grep), PLAN.md (grep) + 7-Agenten-Recherche (Brain + Web).

8-Anker-Status: 1 Praxis-Test ✅ (PDF-Pipeline verifiziert) · 2 CORS ❌ kein Code-Bau · 3 Externer-Review
✅ (2× 3-Richter-Panel) · 4 CHF-Math ✅ (in Empfehlungen) · 5 Worktree ❌ kein Parallel-Risiko (finelli-Repo
solo) · 6 Quellen ✅ · 7 Bequemlichkeit ✅ (Vertrag-Nachzug NICHT verschoben-vergessen, sondern notiert)
· 8 RAV-No-Touch ❌ kein DB-Touch.

Praxis-Test: nicht Code-Domain — ersetzt durch Dokument-Beweise: Seitenzahl-Guard (pypdf) ✅ ·
Muss/Verboten-Wortlisten ✅ · Screenshot-Sichtpruefung ✅ · Downloads-Kopien ✅.

## 1. ZIEL
Haupt: Finelli-Angebots-Mappe fuer Mittwoch 22.07. finalisieren (Blatt 1 + Blatt 2).
Sub-Ziele (alle von SA direkt beauftragt, kein Drift): 10%-Praemie · Eigentums-Argument ·
Wert-vor-Preis-Umbau · Umsatz-Hebel-Sektion · 2× 3-Richter-Panel + Fixes · Blatt 3 Ausbau-Karte
mit Markt-Recherche · Fusion zu 3 Seiten · Exit-Block.
Status: gruen — iterative SA-Ansagen, jede sofort umgesetzt.

## 2. QUELLEN-POOL
Files gelesen: 8 direkt + 7-Agenten-Recherche (lokale Files + ~50 Web-Quellen mit URLs).
Zitiert in Output: durchgehend (Zahlen aus MITTWOCH-PLAN/Brief flossen in Blaetter).
Pflicht-Quellen gefehlt: keine. Umsonst gelesen: keine.
Status: gruen.

## 3. INSTRUKTIONS-TREUE
| Anweisung | Befolgt | Status |
|---|---|---|
| Weissraum steuert Lesen (SA-Design-Ansage) | Blatt 3 luftig gebaut, Skill geladen | gruen |
| Preis erst Seite 2 / Monats-Zahl unten | maschinell bewiesen (pypdf preisfrei-Check) | gruen |
| nur Shopify-500 als Fakt, Rest Schaetzung | umgesetzt + Richter-Fix Blatt 1 | gruen |
| SA-Antwort-Format (Kopf + Fazit) | 3× vom user-brain-guard-Hook geblockt (Kopf fehlte nach Task-Notifications, 1× Fragen-Regel) | GELB |
Aggregat: gelb — Inhalt treu, Format-Kopf riss 3× bei Hintergrund-Task-Antworten.

## 4. WURZEL-VS-SYMPTOM
Diagnose: Richter-Funde an der Wurzel gefixt (Geld-Geschichte vereinheitlicht, "Selbstkosten"-Framing
ersetzt, Overclaims gestrichen statt umschminkt). Render-Escaping-Bug: Wurzel erkannt (Schleifen-Var),
Prozess auf explizites Rendern umgestellt. OFFEN dokumentiert: VERTRAG hinkt Blatt-Kanon hinterher
(50%-Joker Ziffer 6 vs. 10% auf Blaettern; Abnahme-Fiktion Ziffer 2 vs. "steht & laeuft").
Workaround-Marker im Diff: 0.
Status: gelb — Wurzel-Arbeit sauber, 1 offene Wurzel (Vertrag) transparent notiert.

## 5. STAND
Laeuft: Blatt 1 (1 S.) + Blatt 2 (3 S.) versandbereit, 2× Richter-Panel durch, gepusht (fa6609a), Downloads aktuell.
Offen: Vertrag an Blatt-Kanon angleichen · Vorbereitungs-Nachricht an Khawar · Playbook (dieser Auftrag).
Blockiert: Shopify-Schluessel von Khawar (seit 18.07, 2 Tage).
Status: gelb — 1 Blocker mit klarem Owner.

## 6. SWOT
| Stark (rueckwaerts) | Schwach (rueckwaerts) |
|---|---|
| Beweis-Pipeline: pypdf-Guards + Screenshots fingen 2× Seiten-Overflow | Format-Kopf 3× gerissen (Hook musste blocken) |
| 3-Richter-Panels fingen 3 rote Geld-Widersprueche VOR dem Kunden | Render-Escaping-Bug erzeugte kurz falsche PDFs |
| Ehrlichkeits-Linie konsequent (Schaetzung markiert, Overclaims raus) | Blatt-1-Overflow erst nach Render bemerkt (kein Vorab-Guard) |

| Chance (vorwaerts) | Risiko (vorwaerts) |
|---|---|
| Playbook → naechste Offerte 0.5-1 Tag statt ~2 | Vertrag ≠ Blaetter → 750-CHF-Ueber-Versprechen-Klasse bei Unterschrift |
| Richter-Workflow + Recherche-Workflow wiederverwendbar | Offene Mittwoch-Fragen (Pack-Software! B2B-Kanal) koennen Demo kippen |

## 7. WIE GEARBEITET
| Besser | Schlechter |
|---|---|
| Jede Aenderung sofort maschinell verifiziert + committet (9 Commits, alle gepusht) | Kopf-Format nach Task-Notifications vergessen |
| Klassen-Fege nach jedem Begriffs-Wechsel (Selbstkosten/Abnahme/Pickliste app-weit) | PDFs anfangs ohne Seitenzahl-Guard ueberschrieben |
Status: gelb.

## 8. EMPFEHLUNG
1. Playbook Erst-Offerte schreiben (JETZT, dieser Auftrag) — CHF-Math: naechste Offerte ~1 Tag statt 2
   → bei 3 Kunden-Pipeline ~3 Tage frei fuer Bau = frueherer 2. Abschluss (18k-Klasse).
2. Vertrag an Blatt-Kanon angleichen VOR Unterschrift (10%-Joker, "steht & laeuft") — CHF-Math:
   verhindert 750-9'000 CHF Streit-/Ueber-Versprechens-Risiko im Garantie-/Joker-Fall.
3. Vorbereitungs-Nachricht an Khawar heute senden (MITTWOCH-PLAN Vorlage) — CHF-Math: Mittwoch
   entscheidet ueber 18'000; ungeklaerte Fragen (Pack-Software) sind das groesste Demo-Risiko.

Verdict: **gelb-leicht** (D2: Substanz-Sektionen 3+4 gelb, kein rot) — Arbeit stark, Politur-Punkte offen.
