# AIWorks-Workspace — Karte + Sync-Gesetz

> Angelegt 2026-07-20 (Auftrag AB in diesem Workspace). Kanonische Kopie dieser Datei + aller
> Root-Mechaniken liegt versioniert in `ai-firma/vorlagen/workspace/` — Aenderungen DORT machen
> und hierher kopieren, nie nur hier. Dieses Root ist bewusst KEIN eigenes Git-Repo
> (kein Agent legt GitHub-Repos an — TEAM.md-Grenze); versioniert wird ueber ai-firma.

---

## Quick-Digest (30 Sekunden)

| Regel | Kurz |
|---|---|
| **2 Repos** | `ai-firma/` = Firmen-Repo (Brain, Playbook, Kunden-Doku) · `finelli-lagerverwaltung/` = Kunden-Projekt-Repo (Phase 1, noch kein Code). |
| **Sync-Gesetz** | Jede Arbeits-Session, die etwas aendert, endet mit `/brain-sync`: Lehren verallgemeinert nach ai-firma, Registries nachgezogen, BEIDE Repos committed + gepusht. |
| **Regel-Hierarchie** | Repo-CLAUDE.md des jeweiligen Repos gilt VOR dieser Datei. Diese Datei schwaecht nie eine Repo-Regel ab. |
| **Schutz-Zonen** | In ai-firma: `CLAUDE.md`, `playbook/`, `vorlagen/vertrag/`, `.claude/` nur mit explizitem SA-Auftrag. In finelli-lagerverwaltung: Code-Sperre bis Klaerungsfragen beantwortet. |
| **Nie** | `.github/workflows` (kein Repo!), GitHub-Repos anlegen, mergen, PR ready setzen — nur SA klickt das. |
| **Modelle** | Recherche/Plan/Audit = Fabel 5 · Bau = Opus 4.8. |
| **Fakten** | Keine Kunden-Zahl ohne Live-Beleg; unbelegt = 🔍 markieren oder weglassen. |

---

## Wer arbeitet hier?

Dieser Rechner gehoert **AB (Abdul, GitHub `AbdulBhatti2001`)**. SA (Shehryaar Khawaja) arbeitet
auf seinem eigenen Rechner unter `C:\dev\`. Antwort-Format fuer beide: Fazit oben, scannbar,
Klartext (Kern in `ai-firma/brain/knowledge/_global/kommunikations-bibel.md` — die globale
`~/.claude/CLAUDE.md` existiert auf diesem Rechner NICHT, darum gilt die Bibel direkt).

## Pfad-Wahrheit (die eine Tabelle gegen die Pfad-Drift)

| Was | SA-Rechner | Dieser Rechner (AB) |
|---|---|---|
| Firmen-Repo ai-firma | `C:\dev\ai-firma` | `C:\Projects\AIWorks\ai-firma` |
| Finelli Verkaufs-MVP "Cockpit" (FastAPI+React, Mock, Ports 8012/5173) | `C:\dev\finelli-cockpit` | nicht vorhanden |
| Finelli Produktions-Projekt "Lagerverwaltung" (Phase 1, PWA-Plan) | — | `C:\Projects\AIWorks\finelli-lagerverwaltung` |
| SwissCare (getrenntes Geschaeft, NIE mischen) | `C:\dev\swisscare-*` | nicht vorhanden |

**Es gibt ZWEI Finelli-Code-Staende:** das Cockpit (Verkaufs-Demo-App, SA-Rechner) und die
Lagerverwaltung (produktives Phase-1-Projekt, dieser Rechner, GitHub
`AbdulBhatti2001/finelli-lagerverwaltung`, privat). Details:
`ai-firma/brain/_cross-ref/FINELLI-LAGERVERWALTUNG.md`.

## Session-Start-Ritual (immer)

1. `git pull` in BEIDEN Repos (alter Stand kostet doppelt).
2. `ai-firma/brain/_handoff/` pruefen — liegt dort ein offener Auftrag, ist DAS der Einstieg.
3. Fuer Kunden-Arbeit: `ai-firma/kunden/UEBERSICHT.md` (Registry = Quelle der Wahrheit) und bei
   Finelli-Projekt-Arbeit zusaetzlich `finelli-lagerverwaltung/docs/brain.md` lesen.
4. Der SessionStart-Hook (`.claude/hooks/workspace-karte.js`) zeigt Repo-Stand + offene Syncs.

## Das Sync-Gesetz (Kern dieses Workspace)

**Warum:** Am 20.07 kannte die Kunden-Registry das Repo `finelli-lagerverwaltung` nicht, das
E-Register kannte E3 nicht, die ECC-Rules fehlten auf diesem Rechner — Wissen driftet, wenn es
nicht mechanisch zurueckfliesst. (Lesson:
`ai-firma/brain/lessons/system/2026-07-20-zwei-rechner-pfad-drift.md`)

**Regel:** Wird in einem Kunden-Repo (oder in ai-firma) etwas geaendert, laeuft vor Session-Ende
`/brain-sync`. Der Ablauf (Details im Skill `.claude/skills/brain-sync/SKILL.md`):

1. **Sammeln** — was hat sich seit dem letzten Sync geaendert (beide Repos)?
2. **Verallgemeinern** — der Branchen-Analyst ordnet den Kunden einer Branchen-Schablone zu
   (`ai-firma/vorlagen/branchen/`) und destilliert uebertragbare Lehren — anonymisiert,
   ohne Preise, ohne Kundendaten, Beleg-Marker (✅/🔍/💡) bleiben erhalten.
3. **Pruefen** — 2 Skeptiker je Vorschlag (Mehrheits-Regel wie im mvp-klick-beweis).
4. **Schreiben** — der HAUPT-Chat (nie der Schwarm) schreibt: Lessons nach
   `brain/lessons/<disziplin>/`, Vorlagen-Updates nach `vorlagen/branchen/`, Registry-Zeilen in
   `kunden/UEBERSICHT.md` + `kunden/<kunde>/README.md`, Cross-Refs. Schutz-Zonen (playbook/ etc.)
   bekommen nur einen SA-Vorschlag in `brain/shared/todos/for-sa.md`.
5. **Hochladen** — beide Repos committen + pushen + Push verifizieren. Kunden-Repo-Ritual
   respektieren (finelli-lagerverwaltung: `docs/brain.md` nachfuehren, sonst ist die Session
   "nicht abgeschlossen").

Die Auto-Mechanik dazu: `sync-radar.js` (merkt sich jede Repo-Aenderung in
`.claude/state/sync-pending.json`) + `sync-erinnerung.js` (laesst eine Session mit offenem
Sync nicht einfach enden). Abschalten pro Hook: `AIW_RADAR_OFF=1` / `AIW_SYNC_OFF=1`.

## Geerbte harte Regeln (Kurzform, Quelle = ai-firma/CLAUDE.md + Kunden-Repo)

- **Verkauf vor Bau** — kein Bau auf Verdacht; Plan-Mode ≠ Build-Mode (Aktions-Verb noetig).
- **Keine `.github/workflows`**, Draft-PRs, nur SA merged/legt Repos an/setzt Ready.
- **Fakten LIVE pruefen** — jede Kunden-Zahl belegt mit Quelle+Datum oder als Annahme markiert.
- **Kein "fertig" ohne Klick-Beweis** (Skill `beweis-fertig`); "Tests gruen" zaehlt nicht.
- **Shopify/Bestehendes NIE ersetzen — aufsetzen**; keine Endkunden-/Personendaten anfassen.
- **Preis nie senken, Summenzeile nie "Marktwert"**, Agentur-Anker separat.
- **Mock am KALENDERTAG verankern** (toordinal-Prinzip), deterministisch, kein random.
- **Umlaute:** ai-firma-Dateien ae/oe/ue · finelli-lagerverwaltung docs mit echten Umlauten ·
  ueberall Schweizer "ss", nie Eszett · Kunden-Sichtbares (HTML/PDF) mit echten Umlauten.
- **Daten-Waende:** nichts ins swisscare-brain; Kunden-Preise nie in Bau-Dateien/Vorlagen;
  Ports nie 8000/8001/8010/3000-3002.
- **settings.local.json fasst kein Agent an** — Hook-Verdrahtung am Root liegt in
  `.claude/settings.json` (dieser Workspace, maschinenlokal, auf AB-Auftrag 20.07 verdrahtet).

## Werkzeuge dieses Root-Layers

| Werkzeug | Zweck |
|---|---|
| `.claude/skills/brain-sync/` | `/brain-sync` — der Rueckspiel-Ablauf (oben). |
| `.claude/workflows/brain-sync.js` | Schwarm: Sammeln → Verallgemeinern → 2 Skeptiker → Verdichten. Read-only, Haupt-Chat schreibt. |
| `.claude/agents/branchen-analyst.md` | Subagent: Branche erkennen, Lehren verallgemeinern, Zielorte vorschlagen. |
| `.claude/hooks/workspace-karte.js` | SessionStart: Repo-Stand, offene Handoffs, Sync-Stand, Registry-Alter. |
| `.claude/hooks/sync-radar.js` | PostToolUse: registriert Aenderungen in Repo-Dateien. |
| `.claude/hooks/sync-erinnerung.js` | Stop: blockt Session-Ende bei offenem Sync (einmal, kein Loop). |

ECC-Plugin ist installiert (Agents/Skills wie `ecc:code-reviewer`, `ecc:planner` — Empfehlungen je
Repo stehen in dessen CLAUDE.md). ECC-Rules liegen unter `~/.claude/rules/ecc/` (common,
typescript, react — am 20.07 aus dem Plugin-Cache wiederhergestellt).
