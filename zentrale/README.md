# AIWorks Zentrale

Lokale Management-Plattform für die Firma: Kunden, Workflows und Claude-Läufe an einem Ort. Reines Node.js ohne npm-Abhängigkeiten, Frontend in Vanilla JS ohne Build-Schritt.

## Start

```
node server.js
```

Danach im Browser: http://127.0.0.1:8020 (bindet nur auf 127.0.0.1, kein Zugriff von aussen).

## Die 5 Ansichten

| Ansicht | Zweck |
|---|---|
| Dashboard | Überblick über Kunden und Workflows |
| Kunden | Kunden anlegen, bearbeiten, Status pflegen (offen, in_arbeit, fertig) |
| Workflows | Workflows mit Nodes und Verbindungen (Start, Claude, Bedingung, Aktion, Notiz) |
| Claude | Prompt direkt an die Claude-CLI schicken, Ausgabe als Live-Stream |
| Einstellungen | Standard-Modell, Zusatz-Flags, Theme, Standard-Ordner, Modell-Regeln |

## Daten

Alle Daten liegen als JSON im Ordner `data/`:

- `data/kunden.json` (Kunden-Liste)
- `data/workflows.json` (Workflow-Definitionen)
- `data/einstellungen.json` (Einstellungen inklusive Modell-Regeln)

Fehlende Dateien legt der Server beim Start mit Defaults neu an. Die Dateien lassen sich auch von Hand editieren (Server danach neu starten oder Ansicht neu laden).

## Modell-Regeln anpassen

In den Einstellungen (UI oder direkt in `data/einstellungen.json`) stehen Regeln der Form:

```json
{
  "muster": ["plan", "audit"],
  "modellId": "claude-fable-5",
  "grund": "Firmen-Regel: Recherche, Plan und Audit laufen auf Fabel 5"
}
```

Jedes Wort in `muster` wird case-insensitive als Teilstring im Prompt gesucht. Die erste Regel mit Treffer gewinnt, darum spezifische Regeln vor generischen einsortieren. Ohne Treffer wird Sonnet 5 empfohlen.

## Voraussetzung für Claude-Läufe

Die Claude-CLI (`claude`) muss auf dem Rechner installiert und im PATH sein. Der Server startet sie mit `-p --output-format stream-json` und streamt die Ausgabe als Server-Sent-Events an das Frontend.
