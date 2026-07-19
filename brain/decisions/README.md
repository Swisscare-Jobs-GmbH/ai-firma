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
status: aktiv | ersetzt | zurueckgezogen
datum: 2026-07-19
entscheider: SA
---
```

- **Inhalt pro Entscheid:** Was entschieden wurde · Warum (Gruende) · Verworfene Alternativen ·
  Revisit-Bedingung (wann der Entscheid neu geprueft wird).
- **Aendert sich ein Entscheid:** alten auf `status: ersetzt` setzen, neuen mit neuer Nummer anlegen,
  im alten einen Zeiger auf den neuen lassen. Nie ueberschreiben — die Historie ist der Wert.

## Register

| E-Nr | Titel | Status | Datum |
|---|---|---|---|
| [E1](E1-brain-im-firmen-repo.md) | brain/ liegt im ai-firma-Repo | aktiv | 2026-07-19 |
