---
name: vorflug
description: Mess-Basis-Stempel VOR jeder Arbeit und jeder Umgebungs-Aussage — ein Lauf liefert Zweig@Hash, PR-Status und Port->PID->Ordner->Startzeit; warnt LAUT wenn Ordner-HEAD != laufender Code. Ports kommen pro Kunde aus kunden/UEBERSICHT.md. Triggert via /vorflug oder Phrasen "vorflug", "auf welchem stand", "mess-basis", "stack-check", "welcher port laeuft", "stimmt der stand", "wo laeuft das backend" — und SOLLTE von jedem Kunden-Chat beim Session-Start + vor jeder Mess-Aussage laufen.
---

# `/vorflug` — erst messen, dann urteilen (auf DEMSELBEN Stand)

## Wurzel (die teuerste Fehlerklasse)
Aus SwissCare uebernommen: 8 von 14 "roten" Klicktest-Befunden waren Fehlalarm —
"fast alle aus einem Grund": auf dem einen Stand gemessen, ueber den anderen
geurteilt. Ein .env-Kommentar sagte einen Port, die Wahrheit war ein anderer.
Text-Lehren verhinderten 0 dieser Fehler — darum Mechanik statt Merkzettel.

## Ports pro Kunde
Die Ports stehen in `C:/dev/ai-firma/kunden/UEBERSICHT.md` (Spalte "Ports" pro
Kunde). Immer die Ports DIESES Kunden uebergeben — nie raten, nie CRM-Ports annehmen.

## Ablauf (READ-ONLY, ~10 Sek)
1. Skript laufen lassen — vom Arbeitsordner des Kunden-Repos aus:
   ```
   pwsh -File "C:\dev\ai-firma\.claude\skills\vorflug\vorflug.ps1" -Pfad <Kunden-Repo> -Ports <aus UEBERSICHT.md>
   ```
   (ohne Netz-Abgleich: `-KeinFetch`)
2. Den Stempel-Block **ganz oben** in Chat-Antwort/Rapport/PR-Text uebernehmen —
   das ist der Zeitstempel "mein Stand ist von {Zeit}, miss selbst nach".
3. Bei **WARNUNG** (Ordner-HEAD != laufender Code / Zombie-Verdacht): **STOPP.**
   Erst Stand angleichen (pull / richtiger Ordner / Server neu starten), DANN
   messen und urteilen. Nie "trotzdem kurz schauen".

## Regeln
- **Urteil nur auf dem Stand, auf dem gemessen wurde.** HEAD und laufender Code
  muessen zusammenpassen.
- **Prozess-Beweis schlaegt Papier:** PID -> Ordner -> Startzeit zaehlt;
  .env-Kommentare, Start-Prompts und Cross-Chat-Meldungen sind nur Hypothesen.
- **Zombie-Verdacht:** Prozess-Startzeit aelter als die letzte Code-Aenderung =
  wahrscheinlich laeuft alter Code (HTTP 200 heisst nicht gesund).

## Schwester-Skills
- `/vorflug` prueft die UMGEBUNG, in der gearbeitet wird (VOR der Arbeit).
- `/beweis-fertig` prueft EIN Arbeitspaket VOR der Fertig-Meldung.

## Ablage
- Skript: `C:/dev/ai-firma/.claude/skills/vorflug/vorflug.ps1` (ASCII-only,
  aendert nichts).
