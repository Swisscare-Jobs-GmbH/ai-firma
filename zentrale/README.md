# SEA

Software. Efficient. Automation.

SEA ist eine KI-Firma, die anderen Firmen hilft, ihre Ablaeufe zu automatisieren. Dieses Repo enthaelt die lokale SEA-Plattform: Kunden, Workflows, Claude-Laeufe und ein Generator, der ganze Projekte im Hintergrund baut, an einem Ort. Reines Node.js ohne npm-Abhaengigkeiten, Frontend in Vanilla JS ohne Build-Schritt.

## Start

```
node server.js
```

Danach im Browser: http://127.0.0.1:8020 (bindet nur auf 127.0.0.1, kein Zugriff von aussen).

## Die Ansichten

| Ansicht | Zweck |
|---|---|
| Dashboard | Ueberblick ueber Kunden und Workflows |
| Generator | Websites, CRMs, Automatisierungen oder eigene Projekte per Fragebogen starten. Der Bau laeuft als Hintergrund-Job mit Live-Log. |
| Kunden | Kunden anlegen, bearbeiten, Status pflegen (offen, in_arbeit, fertig) |
| Workflows | Workflows mit Nodes und Verbindungen (Start, Claude, Bedingung, Aktion, Notiz) |
| Claude | Vollwertiges Chat-Fenster wie das Original: gespeicherte Gespraeche mit Gedaechtnis, Sidebar mit Chat-Liste, Markdown- und Code-Rendering, Live-Streaming, Modell- und Ordner-Wahl pro Chat, Memory (globale Instruktionen) |
| Konten | Claude-Konten ansehen (5h/7d/Modell-Auslastung) und mit einem Klick wechseln — der Wechsel gilt sofort fuer Claude Code am ganzen PC |
| Einstellungen | Standard-Modell, Zusatz-Flags, Theme, Standard-Ordner, Modell-Regeln |

## Generator und Jobs

Der Generator fragt vor jedem Bau alles Noetige ab (Kunde, Ziel, Umfang, Stil) und baut daraus einen klaren Build-Prompt. Beim Absenden startet ein Hintergrund-Job:

- `POST /api/jobs` legt den Job an und startet die Claude-CLI im Zielordner.
- `GET /api/jobs` listet alle Jobs, neueste zuerst.
- `GET /api/jobs/:id` liefert einen einzelnen Job.
- `GET /api/jobs/:id/log?von=N` liefert den Logtext ab Byte-Offset N plus die aktuelle Gesamtlaenge. So kann der Client pollen und beim naechsten Mal mit `von=laenge` nur Neues nachladen.
- `POST /api/jobs/:id/stop` beendet den Job und seinen Prozessbaum.

Generierte Projekte landen als lokale Ordner unter `C:/Projects/AIWorks/projekte/<slug>`. Sie sind bewusst kein neues Git-Repo und werden nicht automatisch gepusht (Firmenregel).

Fuer echtes Erstellen von Dateien braucht die Claude-CLI ein Permission-Flag, zum Beispiel `--permission-mode acceptEdits` in den Zusatz-Flags der Einstellungen.

## Daten

Alle Daten liegen als JSON im Ordner `data/`:

- `data/kunden.json` (Kunden-Liste)
- `data/workflows.json` (Workflow-Definitionen)
- `data/einstellungen.json` (Einstellungen inklusive Modell-Regeln)
- `data/jobs.json` (Job-Liste, lokal, nicht versioniert)
- `data/job-logs/` (Logdateien der Jobs, lokal, nicht versioniert)

Fehlende Dateien legt der Server beim Start mit Defaults neu an. Die Dateien lassen sich auch von Hand editieren (Server danach neu starten oder Ansicht neu laden). Beim Start werden ausserdem alle Jobs, die noch als `laeuft` markiert sind, auf `abgebrochen` gesetzt, denn ihr Prozess ueberlebt einen Serverneustart nicht.

## Auto-GitHub-Sync

Nach jedem Schreiben von `kunden.json`, `workflows.json` oder `einstellungen.json` loest der Server einen entprellten (etwa 4 Sekunden) Sync im Repo-Wurzelordner aus: `git add` der drei Daten-Dateien, dann `git commit`, dann `git push`. Schnelle Aenderungen werden so zu einem Commit gebuendelt. Ein leerer Commit (`nothing to commit`) wird still uebersprungen, Fehler werden nur geloggt und blockieren nie eine Anfrage. Jobs-Daten (`jobs.json`, `job-logs/`) werden nicht committed (siehe `.gitignore`).

## Claude-Chat (persistente Gespraeche)

Der Claude-Tab ist ein vollwertiges Chat-Fenster auf Basis der Claude-Code-CLI. Jeder Chat ist ein fortlaufendes Gespraech mit eigener Session-UUID: die erste Nachricht laeuft mit `--session-id`, jede weitere mit `--resume` derselben UUID, sodass Claude den Verlauf behaelt. Metadaten und Nachrichten liegen als `data/chats/<uuid>.json` (lokal, nicht in Git). Markdown und Code werden mit den lokalen Vendor-Libs (`public/vendor/`: marked, DOMPurify, highlight.js — kein npm, kein Build) sicher gerendert.

- `GET /api/chats` listet alle Chats (Metadaten, neueste zuerst).
- `POST /api/chats` legt einen Chat an (`{titel?, modellId?, cwd?, bauenErlaubt?}`).
- `GET /api/chats/:id` liefert einen Chat samt Verlauf.
- `PUT /api/chats/:id` aendert Titel, Modell, Bau-Freigabe (und `cwd`, solange kein Verlauf existiert).
- `DELETE /api/chats/:id` loescht einen Chat.
- `POST /api/chats/:id/nachricht` `{prompt}` sendet eine Nachricht (Server-Sent-Events, fuehrt die Session fort).
- `GET`/`PUT /api/memory` liest/schreibt die globale Memory (`data/claude-memory.md`), die jedem Chat per `--append-system-prompt-file` als System-Prompt mitgegeben wird.

**Bau-Freigabe:** Standardmaessig darf ein Chat nur lesen und antworten. Der Schalter "Bauen erlauben" pro Chat schaltet Datei-Aenderungen frei (`--permission-mode acceptEdits`). Der Arbeitsordner ist nach der ersten Nachricht fest (die Session ist an ihn gebunden). Claude erbt im gewaehlten Ordner dessen `CLAUDE.md` und Hooks — fuer ein neutrales Verhalten einen Ordner ohne Projekt-Regeln waehlen.

## Claude-Konten (cswap)

Die Konten-Ansicht steuert das CLI [claude-swap](https://github.com/realiti4/claude-swap) (`cswap`) — Voraussetzung: `uv tool install claude-swap` auf dem Rechner (der Server sucht `~/.local/bin/cswap.exe`, sonst `cswap` im PATH). Konten werden uebernommen, indem man sich in Claude Code mit dem Konto einloggt und in der Ansicht "Konto uebernehmen" klickt. Ein Wechsel tauscht die Credentials dateibasiert, Claude Code liest sie bei Aenderung neu — kein Neustart noetig.

- `GET /api/konten` listet alle Konten mit Auslastung (`cswap list --json`).
- `GET /api/konten/status` liefert das aktive Konto (fuer den Chip in der Claude-Ansicht).
- `POST /api/konten/wechseln` `{ziel}` wechselt (Nummer, E-Mail oder Alias).
- `POST /api/konten/hinzufuegen` `{alias?}` uebernimmt das eingeloggte Konto.
- `POST /api/konten/entfernen` `{ziel}` entfernt ein Konto aus der Verwaltung.
- `POST /api/konten/alias` `{ziel, alias}` setzt einen Alias (leer = entfernen).
- `POST /api/konten/rotation` `{ziel, aktiv}` pausiert ein Konto bzw. setzt es fort.

## Modell-Regeln anpassen

In den Einstellungen (UI oder direkt in `data/einstellungen.json`) stehen Regeln der Form:

```json
{
  "muster": ["plan", "audit"],
  "modellId": "claude-fable-5",
  "grund": "Firmen-Regel: Recherche, Plan und Audit laufen auf Fabel 5"
}
```

Jedes Wort in `muster` wird case-insensitive als Teilstring im Prompt gesucht. Die erste Regel mit Treffer gewinnt, darum spezifische Regeln vor generischen einsortieren. Ohne Treffer wird Sonnet 5 empfohlen. Firmen-Regel: Recherche, Plan und Audit laufen auf Fabel 5, der Bau laeuft auf Opus 4.8.

## Voraussetzung fuer Claude-Laeufe

Die Claude-CLI (`claude`) muss auf dem Rechner installiert und im PATH sein. Sie nutzt das eingeloggte Claude-Konto — welches das ist, laesst sich in der Konten-Ansicht wechseln. Ein API-Key ist nicht noetig. Der Server startet sie mit `-p --output-format stream-json --verbose` und streamt die Ausgabe: bei der Claude-Ansicht als Server-Sent-Events, bei Jobs in eine Logdatei, die die Generator-Ansicht pollt.

## Ports

Der Server laeuft fest auf Port 8020 und bindet nur 127.0.0.1.
