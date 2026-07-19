# brain/ — Zweit-Gedaechtnis der AI-Firma

> Angelegt 2026-07-19. Blaupause abgeschaut vom `swisscare-brain` — **ohne** dessen Inhalte.
> Dieses Brain gehoert der AI-Firma (Software fuer kleine Schweizer Betriebe), NICHT SwissCare.
> Es liegt bewusst IM `ai-firma`-Repo (Entscheid [E1](decisions/E1-brain-im-firmen-repo.md)) —
> nicht im swisscare-brain (Datentrennung + dokumentiertes Privat-Leck dort).

Das Format aller Antworten an SA steht in der globalen `~/.claude/CLAUDE.md` (Person + Sprache +
Kopf/Fazit/Optionen). **Hier NICHT duplizieren** — nur darauf verweisen. Diese Datei regelt, wie
das Brain befuellt und gelesen wird.

---

## 1. Session-Start-Ritual (immer, bevor du arbeitest)

1. **Wer sitzt am Rechner?** Pruefe `.claude/local-user.md` (pro Rechner, nie geteilt). Fehlt sie:
   User ist SA laut globaler `~/.claude/CLAUDE.md`.
2. **Stand ziehen:** `git pull` — auf altem Stand zu arbeiten kostet doppelt.
3. **Offene Uebergabe?** Schau in `_handoff/` — liegt dort ein Prompt vom letzten Chat, ist DAS dein
   Einstieg.
4. **Aktive Arbeit?** `shared/active-work/` zeigt, was ein anderer Chat gerade offen hat — nicht
   doppelt anfassen.
5. **Kunden-Stand:** Fuer Kunden-Fragen zuerst `../kunden/UEBERSICHT.md` (Ampel + Repo + Ports) und
   dann den Kunden-Ordner `../kunden/<kunde>/`.

---

## 2. Auto-Persistence (sofort schreiben, nie im Kopf behalten)

**Regel:** Sobald ein Entscheid faellt, eine Lesson entsteht oder eine Aufgabe angeordnet wird —
SOFORT ins Brain schreiben, committen, hochladen. Nicht auf das Chat-Ende warten. Ziel: **nie zwei
Mal dasselbe erklaeren muessen.**

| Was faellt an | Wohin | Konvention |
|---|---|---|
| Firmen-Entscheid (zitierbar) | `decisions/` | E-Nummer, siehe [decisions/README](decisions/README.md) |
| Erkenntnis / Fehler-Lehre | `lessons/<disziplin>/` | Datum-Slug + Frontmatter, siehe [lessons/README](lessons/README.md) |
| Aufgabe fuer SA | `shared/todos/for-sa.md` | Schema V1 |
| Uebergabe an naechsten Chat | `_handoff/` | Datum-Slug |
| Kunden-Kontext | `../kunden/<kunde>/` | pro Kunde |

Wenn SA sagt **"brain merk dir X"** → an die passende Stelle schreiben, speichern, hochladen,
1-Zeilen-Bestaetigung, weiter.

---

## 3. Halluzinations-Guard (Quelle nennen oder "weiss nicht")

- **Keine harte Aussage ohne Beleg.** Rollen, Zahlen, Preise, Kunden-Fakten NIE raten — Quelle +
  Datum citen (`kunden/finelli/...` / `decisions/E4` / Chat-Datum) oder ehrlich "weiss nicht" sagen.
- **Live-Korrektur des Users schlaegt jedes Doc.** Sagt SA "das hat sich geaendert", ist das die neue
  Wahrheit — die alte Version nie wieder behaupten. Danach: alte Datei nachziehen.
- **READ-BEFORE-ASK:** Bevor du SA fragst, selbst suchen — (1) Chat-Verlauf, (2) dieses Brain
  (`decisions/`, `lessons/`, `kunden/`), (3) das jeweilige Kunden-Repo. Treffer → nutzen, nicht
  fragen. Alle leer → EINE Frage mit konkreten Optionen (A/B/C).
- **"Fertig" braucht Beweis, nie Behauptung.** Ein gruener Build ist kein Beweis, dass etwas laeuft
  (Skill `beweis-fertig`). Kein Selbst-Attest als Abnahme.

---

## 4. Frontmatter-Pflicht fuer Lessons (Datei-Kopf)

Jede Lesson-Datei traegt oben einen YAML-Kopf — sonst ist sie nicht auffindbar und veraltet blind:

```yaml
---
type: lesson
disziplin: verkauf | bau | kunde | system | feedback
kunde: finelli | gzf | -            # falls kundenbezogen
status: current | superseded | archive
datum: 2026-07-19
quelle: <Chat-Datum / Vorfall / Datei>
---
```

Dateiname immer `JJJJ-MM-TT-slug.md`. Ohne Quelle keine Lesson. Keine Duplikate — bei Doppel mergen
und am alten Ort einen 2-Zeilen-Wegweiser (`-> verschoben nach X`) lassen.

---

## 5. Konventionen kurz

- **Umlaute als ae/oe/ue** schreiben (Repo-Konvention).
- **Ein Fakt lebt an EINER Stelle** — alle anderen Seiten verlinken dorthin, statt zu kopieren.
- **Platzhalter in Vorlagen:** `{KUNDE}`, `{PREIS_RATE}`, `{LAUFZEIT}` — GROSS, geschweifte Klammern.
- **Kein `.github/workflows/`** im Repo (GitHub-Bau-Minuten sind Budget) — harte Regel der Firma.
- **Privat-Wand:** `users/*/journal/`, `users/*/sessions/`, `avatar.md` sind gitignored (siehe
  Root-`.gitignore`) — persoenliche Denk-Dateien landen nie in der Historie.

---

## 6. Nachbar-Wissen (verweisen statt kopieren)

- **SwissCare-Brain** (`C:\dev\swisscare-brain`): getrenntes Geschaeft, getrenntes Repo. Wann man
  dort nachschaut: [_cross-ref/SWISSCARE-BRAIN.md](_cross-ref/SWISSCARE-BRAIN.md).
- **Finelli-Cockpit** (`C:\dev\finelli-cockpit`): das erste Kunden-Repo (lebender Code).
  [_cross-ref/FINELLI-COCKPIT.md](_cross-ref/FINELLI-COCKPIT.md).

---

## Landkarte brain/

| Ordner | Was drin liegt |
|---|---|
| `decisions/` | Firmen-Entscheide E1, E2, … (zitierbar) |
| `lessons/` | Lern-Ablage nach Disziplin (verkauf/bau/kunde/system/feedback) |
| `shared/` | `todos/` (Aufgaben-Schema V1) · `hq-rapport/` · `active-work/` |
| `users/sa/` | Person + Antwort-Format-Praeferenzen (personengebunden) |
| `firm/` | Firmen-Landkarte 00-fakten … 50-systeme (leeres Skelett) |
| `knowledge/_global/` | Kommunikations-Bibel + Fable5-Guard |
| `_handoff/` | Uebergabe-Prompts zwischen Chats |
| `_cross-ref/` | Verweise auf Nachbar-Repos |
