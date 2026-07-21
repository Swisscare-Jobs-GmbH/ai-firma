---
type: folder-readme
domain: brain
status: active
datum: 2026-07-19
---

# decisions/ — Firmen-Entscheide (zitierbar)

Hier liegt jeder bewusste Firmen-Entscheid als eigene Datei mit einer **E-Nummer**. So kann jeder
Chat einen Entscheid zitieren (`E1`), statt ihn neu auszudiskutieren.

## Konvention

- **Dateiname:** `E<N>-kurz-slug.md` — fortlaufend ab E1, Nummer wird nie wiederverwendet.
- **Frontmatter-Pflicht:**

```yaml
---
type: decision
id: E1
status: aktiv | ersetzt-durch-E{N} | zurueckgezogen
datum: 2026-07-19
entscheider: SA
---
```

- **`status` ist Pflicht** (jede Entscheid-Datei traegt genau einen Wert):
  - `aktiv` — gilt aktuell.
  - `ersetzt-durch-E{N}` — ein neuerer Entscheid hat diesen abgeloest; `{N}` ist dessen E-Nummer.
  - `zurueckgezogen` — fallengelassen, ohne Nachfolger.

- **Inhalt pro Entscheid:** Was entschieden wurde · Warum (Gruende) · Verworfene Alternativen ·
  Revisit-Bedingung (wann der Entscheid neu geprueft wird).
- **Aendert sich ein Entscheid:** Der ALTE Entscheid wird **nicht geloescht**. Nur sein Status wird auf
  `ersetzt-durch-E{N}` geaendert und **1 Verweis-Zeile** auf den neuen Entscheid ergaenzt; der neue wird
  mit neuer Nummer angelegt. Nie ueberschreiben — die Historie ist der Wert.

## Register

| E-Nr | Titel | Status | Datum |
|---|---|---|---|
| [E1](E1-brain-im-firmen-repo.md) | brain/ liegt im ai-firma-Repo | aktiv | 2026-07-19 |
| [E2](E2-webresearch-leitplanken.md) | Webrecherche-Leitplanken (kein RAG, Schwaerme nur Lesen, unabhaengige Richter) | aktiv | 2026-07-19 |
| [E3](E3-setup-entscheide-19-07.md) | Setup-Entscheide 19.07 (Absender vorerst Swiss Care Jobs GmbH · Repo-Zugriff nur SA · avatar.md lokal) | aktiv | 2026-07-19 |
| [E4](E4-workspace-meta-layer.md) | Workspace-Meta-Layer am AIWorks-Root (Sync-Gesetz, Branchen-Schablonen, kanonische Kopie in vorlagen/workspace/) | aktiv | 2026-07-20 |
| [E5](E5-finelli-ki-mitarbeiter-prototyp-vor-ja.md) | Finelli KI-Mitarbeiter-Prototyp VOR dem Ja bauen (Gate-0-Ausnahme, Demo fuer Termin 22.07) | aktiv | 2026-07-21 |
| [E6](E6-positionierung-an-der-firma.md) | Master-Positionierung "AN der Firma, nicht drin" (Helden-Ton, IN/AN-Tabelle, Klein vs. Mittel) | aktiv | 2026-07-21 |
| [E7](E7-brain-split-und-public-repo-fund.md) | Brain-Split beschlossen + Sofort-Fund: Repo ist PUBLIC (live geprueft) — erst privat stellen, dann brain/ ausgliedern | aktiv | 2026-07-21 |
