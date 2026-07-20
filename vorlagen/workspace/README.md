# vorlagen/workspace/ — Kanonische Kopie des AIWorks-Workspace-Layers

> Angelegt 2026-07-20 (Entscheid [E4](../../brain/decisions/E4-workspace-meta-layer.md)).
> Das Workspace-Root (`C:\Projects\AIWorks\` auf dem AB-Rechner) ist bewusst KEIN Git-Repo —
> versioniert wird der Layer HIER. Regel: Aenderungen zuerst hier (oder am Root, dann per
> /brain-sync hierher spiegeln) — nie nur am Root.

## Was drin ist

| Datei | Wird am Root zu | Zweck |
|---|---|---|
| `CLAUDE-workspace.md` | `<workspace>\CLAUDE.md` | Workspace-Karte, Pfad-Wahrheit, Sync-Gesetz |
| `hooks/workspace-karte.js` | `.claude\hooks\` | SessionStart: Repo-Stand + offene Auftraege + Sync-Stand |
| `hooks/sync-radar.js` | `.claude\hooks\` | PostToolUse: registriert Repo-Aenderungen (sync-pending.json) |
| `hooks/sync-erinnerung.js` | `.claude\hooks\` | Stop: Session endet nicht ohne /brain-sync (einmalig, Loop-Schutz) |
| `skills/brain-sync/SKILL.md` | `.claude\skills\brain-sync\` | /brain-sync — der Rueckspiel-Ablauf |
| `workflows/brain-sync.js` | `.claude\workflows\` | Schwarm: Sammeln -> Verallgemeinern -> 2 Skeptiker -> Verdichten |
| `agents/branchen-analyst.md` | `.claude\agents\` | Branche erkennen + Lehren verallgemeinern |
| `VORLAGE-workspace-settings.json` | `.claude\settings.json` | Verdrahtung der 3 Hooks (maschinenlokal) |

## Installation auf einem neuen Rechner (~5 Min)

1. Workspace-Ordner anlegen (z.B. `C:\dev\` bei SA oder `C:\Projects\AIWorks\` bei AB) und die
   Firmen-/Kunden-Repos hineinklonen.
2. Dateien gemaess Tabelle oben an ihre Root-Ziele kopieren (Spalte "Wird am Root zu").
3. In der kopierten `CLAUDE.md` die Pfad-Karte pruefen (welcher Rechner, welche Repos).
4. `.claude\local-user.md` im ai-firma-Repo anlegen (wer arbeitet hier — gitignored).
5. Test: `echo '{"tool_name":"Edit","tool_input":{"file_path":"<workspace>/ai-firma/README.md"}}'
   | node .claude/hooks/sync-radar.js` — danach muss `.claude/state/sync-pending.json` existieren.
   Eintrag wieder leeren: Datei-Inhalt `{"eintraege": {}}`.

## Abschalten im Notfall

Pro Hook per Umgebungsvariable: `AIW_KARTE_OFF=1` · `AIW_RADAR_OFF=1` · `AIW_SYNC_OFF=1`.
Alle Hooks sind fail-open (Fehler = still weiter, nie blockierter Arbeitsfluss).
