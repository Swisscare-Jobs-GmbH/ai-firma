---
datum: 2026-07-21
chat: cowork-cloud (AB-Auftrag, Praesentation V3)
status: gebaut + geliefert — Commit/Push OFFEN (Cloud-Session kann nicht pushen)
---

# Uebergabe — Praesentations-Vorlage V3 + Finelli-Deck 21.07

**Fazit:** AB-Auftrag (Finelli-Ueberzeugungs-Deck + generalisierte Vorlage) war zu 90% schon
von den 20.07-Sessions erledigt. Diese Session hat NICHT neu gebaut, sondern die V2 gemaess
ANLEITUNG fortgefuehrt: neuer Mockup-Typ `cockpit` (Desktop-Shop), Demo-Inhalte generalisiert,
Deck neu gebaut. Details im Changelog der `vorlagen/praesentation/ANLEITUNG.md`.

## Was diese Session geaendert hat (alles vom Rechner-Stand 21.07 vormittags aus)

| Datei | Aenderung |
|---|---|
| `vorlagen/praesentation/baue_praesentation.py` | V3: `cockpit()`-Mockup, `STANDARD_DEMO` + `demo`-Block je Mockup (Kunden-Woerter raus aus dem Generator), Einfuehrungs-Folie zentriert. |
| `vorlagen/praesentation/konfig-vorlage.json` | Cockpit-Mockup + `demo`-Bloecke mit Platzhaltern, parallel zur Finelli-Konfig. |
| `vorlagen/praesentation/vorlage-kunden-praesentation.pptx` | Muster-Deck neu gebaut (16 Folien). |
| `vorlagen/praesentation/ANLEITUNG.md` | Dramaturgie V3, Demo-Regeln, stale V1-Regel 4 ersetzt, Changelog. |
| `kunden/finelli/praesentation/konfig-finelli.json` | Cockpit-Folie ("Das Shop-Cockpit") + Demo-Texte (Hoodie/Tee/Cap-Beispiele, wie gehabt). |
| `kunden/finelli/praesentation/finelli-praesentation-2026-07-21.pptx` | **NEU — dieses Deck fuer den Termin verwenden.** 16 Folien. Validiert + visuell geprueft. |
| `kunden/finelli/README.md` | Praesentations-Zeile auf Stand 21.07. |

## Fuer den Termin morgen (Mittwoch 22.07, SA vor Ort)

- **Deck = `finelli-praesentation-2026-07-21.pptx`** (16 Folien). Das -20-Deck war waehrend
  dieser Session in PowerPoint offen und wurde bewusst nicht angefasst; es ist jetzt ueberholt.
- Neue Folie 9 "Das Shop-Cockpit" zeigt die Premium-Funktionen (Regal-Zahlen, Kaeufer-Zahlen,
  Website-Avatar, KI-Vorschlag) als gezeichnetes Bild — Untertitel sagt "Zahlen als Beispiel."
  (Fakten-Live-Regel: alle Zahlen im Mockup sind Demo, keine Kundenzahlen behauptet.)

## OFFEN (naechste Session am Rechner)

1. **`/brain-sync` + Commit + Push** in ai-firma — diese Cloud-Session hat die Dateien nur auf
   die Platte geschrieben, git lief nicht.
2. PowerPoint-Sichtpruefung durch AB/SA (Fonts Georgia/Segoe UI sind fuer Windows-PowerPoint
   gesetzt; Cloud-QA lief ueber LibreOffice-Render — Schatten dort sind Render-Artefakt,
   PPTX ist flach).
3. Optional: altes `finelli-praesentation-2026-07-20.pptx` archivieren, wenn SA das -21 gut
   findet (nicht loeschen ohne SA/AB-Ok).

## Lektionen

- **Datums-Falle:** Session-Kontext sagte "20.07", echte Uhr sagte Dienstag 21.07 — vor
  Datums-Entscheiden (Dateinamen!) immer `date` pruefen. Termin ist MORGEN.
- **LibreOffice-Schatten sind kein Regelverstoss:** PPTX hatte `effectLst` leer (geprueft im
  XML), nur der LO-Renderer malt Schatten dazu. Nicht "fixen".
- **Windows-mtime-Drift ohne Inhalts-Aenderung:** Der Schreib-Schutz der Cloud-Session schlug
  bei 5 Dateien an ("seit dem Lesen geaendert") — Neu-Laden zeigte: Inhalt byte-identisch zur
  V2, nur mtime/Groessen-Metadaten hatten sich bewegt (offenes PowerPoint/Indexierung). Regel:
  bei so einem Treffer erst Inhalt vergleichen, dann gezielt ueberschreiben — nie blind force,
  nie blind abbrechen.
