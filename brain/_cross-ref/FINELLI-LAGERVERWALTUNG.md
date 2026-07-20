---
type: cross-ref
status: active
datum: 2026-07-20
---

# Cross-Ref: finelli-lagerverwaltung (zweites Finelli-Repo, AB-Rechner)

- **Was dort liegt:** Das PRODUKTIONS-Projekt fuer Finelli — mobile Lagerverwaltungs-PWA
  (Phase 1: 3 Screens Scannen/Suchen/Uebersicht + Backend + Postgres + Datenqualitaets-CLI).
  Stand 20.07: Vorbereitungsphase, **noch kein Anwendungscode** (Code-Sperre bis die 7
  Klaerungsfragen beantwortet sind). Aufgaben ausschliesslich als GitHub-Issues #1-#16.
- **Wo:** AB-Rechner `C:\Projects\AIWorks\finelli-lagerverwaltung` · GitHub
  `AbdulBhatti2001/finelli-lagerverwaltung` (privat) · Zweig `main`.
- **Abgrenzung zum Cockpit:** `finelli-cockpit` (SA-Rechner, [FINELLI-COCKPIT](FINELLI-COCKPIT.md))
  ist der Verkaufs-MVP (FastAPI+React, MOCK_MODE, Ports 8012/5173). Die Lagerverwaltung ist das
  produktive Werk nach Master-Prompt — anderes Repo, anderer Stack (Vite/React-PWA + Node +
  Postgres), andere Regeln.
- **Wann dort nachschauen:** Fuer den Projekt-Stand IMMER zuerst `docs/brain.md` (uebertragbares
  Projektgedaechtnis, Pflicht-Nachfuehrung am Sessionende); massgebliche Anforderungen in
  `docs/master-prompt-phase1.md`.
- **Harte Regeln des Repos** (Root-CLAUDE.md dort): Shopify = alleinige Bestandswahrheit ·
  kein zweites Inventarsystem · keine KI bucht Bestand · idempotent · offline-faehig ·
  Schweizer "ss" · kein Code vor beantworteten Klaerungsfragen · kein Scope-Creep (keine
  Dashboards/Prognosen in Phase 1).
- **Regel:** Code + Projekt-Stand bleiben dort; Kunden-Kontext (Deal, Schmerz, Demo) bleibt hier
  in [`kunden/finelli/`](../../kunden/finelli/). Verweisen, nicht kopieren.
