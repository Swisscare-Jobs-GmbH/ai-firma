---
type: lesson
disziplin: bau
kunde: finelli
status: current
datum: 2026-07-20
quelle: Session AB 20.07 (Klick-Beweis app.html, Commit ai-firma 92a9d80)
---

# Verkaufs-Demo-Artefakte: richtiges Repo + Konventions-Sweep VOR dem Klick-Beweis

## Was passiert ist

Die App-Simulation "Cockpit-Vorschau" (`app.html`, reines Verkaufs-Artefakt) lag nach der
Bau-Session in der WURZEL des Produktions-Repos `finelli-lagerverwaltung` — untracked.
Dorthin gehoert sie doppelt nicht: (a) der relative Link der Pitch-Seite zeigt auf
`ai-firma/kunden/finelli/demo/`, (b) das Produktions-Repo hat Code-Sperre + Scope-Waechter
(keine Dashboards/KI in Phase 1) — ein Commit dort haette die Repo-Regeln verletzt.
Zusaetzlich: Die neue Datei nutzte ASCII-Umlaute (ae/ue) im Kunden-sichtbaren Text, die
Schwester-Seite `index.html` im selben Ordner echte Umlaute — Regel "Kunden-Sichtbares mit
echten Umlauten" war verletzt, und der Kunde haette den Stilbruch am Termin gesehen.

## Die Lehre (verallgemeinert, gilt fuer jeden Kunden)

1. **Verkaufs-Artefakte leben im Firmen-Repo** unter `kunden/<kunde>/demo/` — NIE im
   Produktions-Repo des Kunden. Faustregel: Was der Kunde am Termin anschaut, ist
   Verkaufs-Material (ai-firma); was spaeter produktiv laeuft, ist Kunden-Repo.
2. **Vor jedem Klick-Beweis ein Konventions-Sweep** der neuen Kunden-sichtbaren Dateien:
   Ablage-Ort korrekt? Umlaut-Konvention wie die Nachbar-Dateien (Kunden-HTML = echte
   Umlaute, Schweizer ss)? Verlinkung aufloesbar (relative Pfade!)?
3. Der Klick-Beweis selbst fand danach noch einen echten Anzeige-Bug (Scan-Bestaetigung
   zeigte den naechsten statt des gebuchten Artikels) — Beweis-Pflicht wirkt, siehe
   `kunden/finelli/demo/klick-beweis-app-2026-07-20.md`.

Verwandt: `../system/2026-07-20-zwei-rechner-pfad-drift.md` (Wissens-Drift zwischen
Rechnern — dieselbe Wurzel: ohne mechanischen Check driftet Ablage und Konvention).
