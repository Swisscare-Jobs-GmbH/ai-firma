# Workflows — Agenten-Schwaerme fuer den Neukunden-Prozess

> Diese Scripts sind wiederverwendbare Agenten-Schwaerme fuer die AI-Firma (Software fuer kleine
> Schweizer Betriebe). Aufgerufen werden sie ueber das **Workflow-Tool** mit `name` + `args`.
> Muster-Quelle: `playbook/` + die Finelli/GzF-Recherchen. Format-Regeln fuer SA: global in
> `~/.claude/CLAUDE.md` (nicht hier dupliziert).

## Uebersicht

| Workflow | Wann | Aufruf-Beispiel |
|---|---|---|
| `phase0-recherche-schwarm` | Start jedes Neukunden (Phase 0), vor dem Schmerz-Gespraech | `{ name: 'phase0-recherche-schwarm', args: { kunde: 'gzf', ort: 'Rorschach SG', branche: 'Orthopaedie-Schuhe', webseite: 'gut-zu-fuss.ch' } }` |
| `angebots-judge-panel` | Vor dem Druck jedes Angebots (Phase 4) | `{ name: 'angebots-judge-panel', args: { angebotPfad: 'kunden/gzf/angebot-v1.html', kunde: 'gzf' } }` |
| `mvp-klick-beweis` | Vor jeder Kunden-Vorfuehrung (Phase 3/5) | `{ name: 'mvp-klick-beweis', args: { kundenRepo: 'C:/dev/gzf-cockpit', ports: { frontend: 3000, backend: 8000 } } }` |
| `ki-wochen-bericht` | Jeden Montag pro laufendem Kunden | `{ name: 'ki-wochen-bericht', args: { kunde: 'finelli', kundenRepo: 'C:/dev/finelli-cockpit', seitDatum: '2026-07-12' } }` |

## Was jeder Workflow tut (1 Zeile)

- **phase0-recherche-schwarm** — 6 parallele Spaeher (Firmen-Profil, LIVE-Reviews, weitere Portale,
  Branchen-Schmerzen, bestehende Software, Konkurrenz) + Synthese → Firmen-Profil + Schmerz-Hypothesen
  als Markdown. Schreibt nichts; der Aufrufer legt das Ergebnis nach `kunden/{kunde}/` ab.
- **angebots-judge-panel** — 3 Richter (Hormozi, Menschen-Natur, Fakten-Skeptiker) + Verdichter →
  sortierte Fix-Liste. Fakten-Funde sind Pflicht-Fix vor dem Druck; `druckfreigabe` nur bei 0 offenen.
- **mvp-klick-beweis** — 3 Finder (Endpunkt-Drift, Mock-Daten-Drift, Demo-Killer) → pro Fund 2
  Skeptiker (Mehrheit) → bestaetigte Funde + Klick-Beweis-Checkliste fuer den Termin.
- **ki-wochen-bericht** — Sammler (git log seit Datum, Etappen, HANDOFF-Offene) + Schreiber →
  1-Seiten-Kundenbericht in Laien-Klartext (was lief, was kommt, 1 Kennzahl).

## Bau-Regeln (fuer neue Workflows in diesem Ordner)

- Datei-Kopf ist ein reines Literal: `export const meta = { name, description, whenToUse, phases }`.
- Bausteine im Script-Koerper: `agent(prompt, {label, phase, schema, model, effort})`,
  `parallel([() => agent(...), ...])` (Ergebnis-Array, Fehler → null, mit `.filter(Boolean)`),
  `pipeline(items, stage1, stage2)` (verkettet ohne Barriere), `phase('Titel')`, `log('...')`,
  `args` = Eingabe des Aufrufers, am Ende `return X`.
- **Modell-Regel:** Recherche-/Judge-/Verifizier-Agenten OHNE `model` (erben Fabel 5); reine
  Schreib-/Bau-Agenten mit `model: 'opus'`.
- **Verboten im Script:** `Date.now()`, `Math.random()`, `new Date()` ohne Argument, Filesystem-APIs,
  `require`/`import`. Zeitstempel immer ueber `args` reinreichen.
- **Kein** `.github/`-Ordner im Repo (Minuten-Budget).
