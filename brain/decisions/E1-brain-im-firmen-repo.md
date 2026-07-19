---
type: decision
id: E1
status: aktiv
datum: 2026-07-19
entscheider: SA
---

# E1 — brain/ liegt im ai-firma-Repo (nicht im swisscare-brain)

## Entscheid

Das Zweit-Gedaechtnis der AI-Firma lebt als `brain/`-Ordner **im `ai-firma`-Repo** — nicht als
Unterordner im bestehenden `swisscare-brain` und nicht als eigenes Repo.

## Warum

1. **Datentrennung SwissCare vs. AI-Firma.** Das sind zwei verschiedene Geschaefte. Kunden-Deals
   (Finelli-Preise, GzF-Budget) gehoeren nicht dorthin, wo SwissCare-Interna und andere Founder
   mitlesen — und umgekehrt.
2. **Privat-Leck-Historie im alten Brain.** Das swisscare-brain traegt ein dokumentiertes offenes
   Privat-Leck in aelteren Commits. Wer dieses Repo bekommt, erbt das. Kuenftige AI-Firma-Beteiligte
   duerfen diese Altlast nie erben.
3. **Ein Repo = ein Push.** Code, Vorlagen, Kunden-Kontext und Brain in einem Repo halten SAs
   Overhead klein: ein `git pull`, ein `git push`, eine Uebergabe.

## Verworfene Alternativen

- **Unterordner im swisscare-brain** — verworfen wegen Punkt 1 + 2 (Vermischung + Leck-Vererbung).
- **Eigenes `ai-firma-brain`-Repo** — lohnt erst, wenn Aussenstehende Code-Zugriff aufs `ai-firma`
  brauchen, das Brain aber nicht sehen duerfen. Bis dahin unnoetiger Doppel-Overhead.

## Revisit-Bedingung

Sobald jemand ausserhalb von SA Zugriff auf das `ai-firma`-Repo braucht (Helfer, Kunden-Einblick),
wird `brain/` VOR dem Zugriff in ein eigenes, privates Repo ausgegliedert. Das ist ein ~1-Tages-Umzug
und verhindert die gleiche Leck-Falle wie im alten Brain.
