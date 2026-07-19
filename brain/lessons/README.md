---
type: folder-readme
domain: brain
status: active
datum: 2026-07-19
---

# lessons/ — Lern-Ablage

Erkenntnisse aus Sessions: was schiefging, was funktionierte, welche Regel daraus folgt. Jede Lesson
ist eine eigene Datei, sortiert nach **Disziplin**.

## Namens-Konvention

Dateiname: `JJJJ-MM-TT-slug.md` (z.B. `2026-07-19-echt-modus-nie-am-schirm-gesehen.md`).

## Frontmatter-Pflicht (Datei-Kopf)

```yaml
---
type: lesson
disziplin: verkauf | bau | kunde | system | feedback
kunde: finelli | gzf | -            # nur falls kundenbezogen
status: current | superseded | archive
datum: 2026-07-19
quelle: <Chat-Datum / Vorfall / Datei>
---
```

## Disziplin-Ordner

| Ordner | Wofuer |
|---|---|
| `verkauf/` | Angebot, Deal, Preis-Logik, Verhandlung |
| `bau/` | Kunden-Software bauen, Test-/Beweis-Disziplin, Technik |
| `kunde/` | Umgang mit dem Kunden, Termine, Zugaenge, Erwartungen |
| `system/` | Das eigene Firmen-System: Repo, Hooks, Vorlagen, Prozess |
| `feedback/` | Wie mit SA arbeiten, Format-Treffer/Fehler, Kommunikation |

## Anti-Pattern

- Keine Lesson ohne Quelle/Kontext.
- Keine Duplikate — bei Doppel mergen, am alten Ort einen 2-Zeilen-Wegweiser (`-> verschoben nach X`).
- Kein "Tests gruen" als Beweis fuer "Feature laeuft" — Beweis heisst echter Klick / echter Aufruf.
