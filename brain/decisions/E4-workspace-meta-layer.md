---
type: decision
id: E4
status: aktiv
datum: 2026-07-20
entscheider: AB (Workspace-Auftrag im Chat, AB-Rechner C:\Projects\AIWorks)
---

# E4 — Workspace-Meta-Layer am AIWorks-Root (Sync-Gesetz + Branchen-Schablonen)

## Entschieden

1. Auf dem AB-Rechner liegt ueber den Repos ein **Workspace-Meta-Layer**
   (`C:\Projects\AIWorks\`: Root-CLAUDE.md, 3 Hooks, Skill `/brain-sync`, Workflow
   `brain-sync.js`, Agent `branchen-analyst`). Er erzwingt: jede Session, die Repo-Dateien
   aendert, spielt Lehren verallgemeinert nach ai-firma zurueck und pusht BEIDE Repos.
2. **Kanonische Kopie** des Layers liegt versioniert in `ai-firma/vorlagen/workspace/`
   (das Root ist bewusst kein eigenes Git-Repo — Agenten legen keine GitHub-Repos an, TEAM.md).
3. **Branchen-Schablonen** unter `vorlagen/branchen/` (Start: shop-detailhandel aus Finelli,
   kunden-rueckhol-crm aus GzF) sind der feste Zielort fuer verallgemeinerte Kunden-Lehren.

## Warum

- Drift-Vorfall 20.07: Registry kannte `finelli-lagerverwaltung` nicht, E-Register kannte E3
  nicht, ECC-Rules fehlten auf dem AB-Rechner, alle Pfade zeigten auf `C:\dev\` (SA-Rechner).
  Details: `brain/lessons/system/2026-07-20-zwei-rechner-pfad-drift.md`.
- AB-Auftrag im Chat (20.07, Aktions-Verben "mach/erstelle"): "wenn finelli angepasst wird,
  muessen Geruest und allgemeine Aenderungen ebenfalls in aifirma gemacht werden; bei jeder
  Aenderung alles updaten und pushen".

## Verworfene Alternativen

- **Root als eigenes Git-Repo + drittes GitHub-Repo:** verletzt die TEAM.md-Grenze (nur SA legt
  Repos an) und haette eine dritte Push-Stelle geschaffen. Stattdessen Versionierung via
  `vorlagen/workspace/` im bestehenden Firmen-Repo.
- **Sync-Logik in `ai-firma/.claude/`:** Schutz-Zone (protected-change-guard, nur mit
  SA-Auftrag). Der Layer liegt darum am Root; ai-firma traegt nur die kanonische Kopie in
  einem unverriegelten Ordner.
- **GitHub-Actions fuer den Sync:** harte Firmen-Regel dagegen (keine `.github/workflows`,
  Minuten-Budget-Vorfall 13.07).

## Revisit-Bedingung

- Wenn SA den Layer auf dem SA-Rechner uebernehmen will: `vorlagen/workspace/README.md`
  (Installation pro Rechner) — dann pruefen, ob Pfad-Karte und Hooks dort passen.
- Wenn ein drittes Kunden-Repo im Workspace liegt: Radar/Karte erkennen es automatisch
  (Ordner mit `.git`), aber die Registry-Pflege-Regeln in `/brain-sync` gegenlesen.
- Beim Brain-Split (E1/E3 Revisit): Zielorte des Syncs (brain/...) wandern mit.
