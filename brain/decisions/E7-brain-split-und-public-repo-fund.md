---
type: decision
id: E7
status: aktiv
datum: 2026-07-21
entscheider: SA (Chat-Freigabe "A" 21.07 — T1 aufloesen + Split-Plan festhalten)
---

# E7 — Brain-Split beschlossen · Sofort-Fund: ai-firma-Repo ist OEFFENTLICH

> Loest Todo T1 (`shared/todos/for-sa.md`) und den Revisit von [E1](E1-brain-im-firmen-repo.md) +
> [E3](E3-setup-entscheide-19-07.md) Punkt 2 aus. SA-Freigabe "A" am 21.07: erst Zugriff LIVE
> pruefen, dann Split-Plan als Entscheid festhalten. Die Live-Pruefung hat ein groesseres Problem
> aufgedeckt als erwartet.

## Live-geprueft am 21.07.2026 (gh CLI, Konto SAKSCJ, read:org)

| Fakt | Befund | Kommando |
|---|---|---|
| **Sichtbarkeit** | **PUBLIC** (`isPrivate:false`) — jeder im Internet kann `brain/` lesen | `gh repo view Swisscare-Jobs-GmbH/ai-firma --json visibility` |
| Collaborators | `AbdulBhatti2001` (admin), `JTSCJ` (admin), `SAKSCJ` (admin) | `gh api repos/.../collaborators` |
| Org-Owner (sehen ALLE Org-Repos) | `JTSCJ`, `SAKSCJ` | `gh api orgs/Swisscare-Jobs-GmbH/members?role=admin` |

Damit ist die T1-Annahme ("AB hat Zugriff, JT pruefen") nicht nur bestaetigt, sondern **massiv
verschaerft**: Das Repo liegt nicht nur im SwissCare-Org — es ist **weltoeffentlich**. Der ganze
Grund fuer E1 (Datentrennung, kein Privat-Leck vererben) ist damit aktuell voll verletzt.

## Was gerade oeffentlich lesbar ist (Auszug)

- `brain/` komplett: SA-Profil (Psychologie, Werte, Wachstums-Bereiche), Kunden-Deals,
  Finelli-Preise/Strategie, alle Entscheide E1-E7, alle Lehren.
- `kunden/`, `playbook/`, `vorlagen/` — Angebots-Mathe, Deal-Bausteine, Konkurrenz-Analysen.

## Entscheid

1. **Sofort (SA-Aktion — nur SA darf Einstellungen aendern):** Repo-Sichtbarkeit auf **privat**
   stellen. Das ist "die Blutung stoppen" — alles Weitere kommt danach.
   Direkt-Link: `https://github.com/Swisscare-Jobs-GmbH/ai-firma/settings` → unten "Change
   repository visibility" → Private.
2. **Danach: `brain/` ausgliedern** in ein eigenes, privates Repo (der ~1-Tages-Umzug aus E1/E3),
   BEVOR ein Helfer (Abdul) regulaeren Zugriff bekommt. Firmen-Repo (Code/Vorlagen) und
   Gedaechtnis (`brain/`) werden getrennt.
3. **AB-Zugriff:** `AbdulBhatti2001` ist aktuell admin. Nach dem Split bekommt er nur das
   Code-/Vorlagen-Repo, nicht das brain-Repo. Bis dahin bleibt sein Zugriff bewusst bestehen
   (Workspace-Layer [E4](E4-workspace-meta-layer.md) laeuft auf seinem Rechner).

## Update 21.07 — SA-Entscheid: Abdul ZUSAMMEN im Brain (Option B)

SA hat auf die Frage "Abdul getrennt (eigenes Repo) oder zusammen (Ordner im gemeinsamen Brain)?"
**B — zusammen** gewaehlt: Abdul bekommt einen Ordner `users/abdul/` im bestehenden Brain und sieht
bewusst alles (Profil, Deals, Preise). SA nimmt das in Kauf.

**Folgen fuer den Plan:**

- Schritt 1 (Repo **privat** stellen) bleibt **Pflicht** — unabhaengig von A/B.
- Der Split in ein separates Repo ist damit **nicht mehr noetig**: das Brain bleibt im `ai-firma`-Repo,
  Abdul ist als Mitleser bewusst erlaubt. Der Split-Runbook ist entsprechend als vereinfacht markiert.
- E1/E3 (Trennung vor Helfer-Zugriff) werden durch diesen **bewussten** SA-Entscheid ueberstimmt,
  NICHT durch Vergessen — das ist der Unterschied. Kommt spaeter ein WENIGER vertrauter Helfer dazu,
  ist die Frage neu zu stellen (Revisit).

## Wichtig: oeffentlich gewesen = muss als geleakt gelten

Sobald etwas oeffentlich war, kann es zwischengespeichert / geforkt / von Suchmaschinen indexiert
sein — auch nach dem Privat-Stellen. Die Git-Historie enthaelt alles je Committete. Konsequenz:

- Preise/Strategie so behandeln, als koennte ein Konkurrent sie gesehen haben.
- **Sekret-Check:** pruefen, ob je Zugangsdaten/Passwoerter/Tokens ins Repo committet wurden —
  falls ja, rotieren. (Eigener Kurz-Task, siehe Revisit.)

## Verworfene Alternativen

- **B aus T1 (AB-Zugriff freigeben, E3 ersetzen, alles so lassen):** bei einem PRIVATEN Repo waere
  das diskutierbar gewesen — bei einem OEFFENTLICHEN ist es keine Option. Verworfen durch den Fund.
- **Nur privat stellen, nicht splitten:** stoppt die Blutung, loest aber E1/E3 (Helfer erbt das
  ganze Gedaechtnis) nicht. Der Split bleibt noetig vor Helfer-Onboarding.

## Revisit-Bedingung

- Nach dem Privat-Stellen: dieser Punkt von 🔴 auf 🟡 (Blutung gestoppt, Split noch offen).
- Nach dem Split: E1 + E3 Punkt 2 auf `ersetzt-durch-E7` markieren; T1 nach `shared/todos/done/`
  verschieben.
- Sekret-Check (keine Tokens im Repo/History) als eigener Kurz-Task abschliessen.
