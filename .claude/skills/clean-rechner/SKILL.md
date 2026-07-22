---
name: clean-rechner
description: Rechner putzen wenn der PC zaeh/laut/voll ist (ai-firma). Sichere Schritte: RAM+Prozess-Snapshot (nur lesen), Temp-Cleanup >7 Tage, npm-Cache leeren, Klartext-Empfehlung. Killt NIE aktive Chats, loescht nie echte Dateien/Repos. Triggert via /clean-rechner oder Phrasen "rechner putzen", "pc aufraeumen", "pc langsam", "pc laut", "pc voll", "mach den pc sauber".
---

# `/clean-rechner` — Rechner putzen (ai-firma, sicher per Default)

Der PC ist rechner-global, nicht firma-spezifisch. Diese Version macht nur die SICHEREN
Schritte inline (Snapshot + Temp + Cache) — **kein automatisches Prozess-Killen**.

## Schritt 1 — nur anschauen (aendert nichts)
```powershell
# RAM + Top-Prozesse
Get-Process | Sort-Object WS -Descending | Select-Object -First 12 Name,@{N='RAM_MB';E={[int]($_.WS/1MB)}} | Format-Table
# Node/Claude-Prozesse (ACHTUNG: Prozess-Zahl ist NICHT Fenster-Zahl!)
(Get-Process -Name node -ErrorAction SilentlyContinue | Measure-Object).Count
# Temp-Groesse
"{0:N0} MB Temp" -f ((Get-ChildItem $env:TEMP -Recurse -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum/1MB)
```

## Schritt 2 — sicher putzen (nur Temp >7 Tage + regenerierbarer Cache)
```powershell
Get-ChildItem $env:TEMP -Recurse -ErrorAction SilentlyContinue |
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |
  Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
npm cache clean --force 2>$null
```

## Die 2 Fallen (aus SwissCare gelernt)
1. **Prozess-Zahl ≠ Chat-Zahl.** Ein Skript meldete "12 Chats offen" — offen war **1 Fenster** (Faktor 10 daneben). Im Zweifel den Founder fragen: "Wie viele Claude-Fenster hast du offen?"
2. **Lauter PC = fast immer OneDrive**, das Git-Repos synct — nicht der Prozessor. Fix ist der OneDrive-Ordner-Schalter, nicht Dateien verschieben.

## Was der Befehl NIE tut
- killt nie aktive Claude-Chats (kein Auto-Prozess-Kill in dieser Version)
- loescht nie echte Dateien/Repos (nur Temp >7 Tage + regenerierbarer Cache)
- fasst OneDrive nie automatisch an — meldet nur

## Ausgabe (SA-Format)
Fazit oben + kleine Tabelle: was geputzt · welche Wurzel · 1 konkrete Empfehlung.
