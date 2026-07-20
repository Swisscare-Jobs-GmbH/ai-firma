---
type: lesson
disziplin: system
kunde: finelli
status: current
datum: 2026-07-20
quelle: Workspace-Session AB 20.07 (Bestandsaufnahme C:\Projects\AIWorks, 6-Leser-Schwarm)
---

# Zwei Rechner, ein Gedaechtnis: Wissen driftet ohne mechanischen Ruecklauf

## Was passiert ist (Vorfall 20.07)

Bei der ersten grossen Session auf dem AB-Rechner (C:\Projects\AIWorks) fanden sich vier
unabhaengige Drifts, alle in unter einem Tag entstanden:

1. **Registry-Luecke:** `kunden/UEBERSICHT.md` kannte nur `C:\dev\finelli-cockpit` — das zweite
   Finelli-Repo `finelli-lagerverwaltung` (AB-Rechner, GitHub AbdulBhatti2001, Phase-1-Projekt)
   fehlte komplett. Auch `brain/_cross-ref/` kannte es nicht.
2. **E-Register-Luecke:** `decisions/README.md` listete nur E1+E2 — E3 existierte seit 19.07,
   stand aber nicht im Register (und verletzte die eigene Frontmatter-Pflicht).
3. **Umgebungs-Drift:** Die ECC-Rules (`~/.claude/rules/ecc/`) und die globale `~/.claude/CLAUDE.md`
   fehlten auf dem AB-Rechner, obwohl Doku sie voraussetzt.
4. **Pfad-Drift:** Praktisch alle Dateien verweisen hart auf `C:\dev\...` (SA-Rechner) — auf dem
   AB-Rechner laufen diese Verweise ins Leere.

## Die Lehre

- **Jede Stand-Datei (Registry, Register, README) driftet, sobald niemand sie mechanisch
  nachfuehrt.** Text-Regeln ("Registry pflegen") reichen nicht — es braucht eine Auto-Mechanik.
- **Rechner-spezifische Pfade gehoeren an EINE Stelle** (Pfad-Karte), nicht in jede Datei.

## Was dagegen gebaut wurde (Entscheid E4)

Workspace-Meta-Layer am AIWorks-Root: Root-CLAUDE.md mit Pfad-Karte, `sync-radar`-Hook
(registriert jede Repo-Aenderung), `sync-erinnerung`-Hook (Session endet nicht ohne
`/brain-sync`), Skill `/brain-sync` (Lehren-Ruecklauf + Registry-Pflege + Push beider Repos),
Branchen-Schablonen `vorlagen/branchen/`. Kanonische Kopie: `vorlagen/workspace/`.
