---
datum: 2026-07-21
disziplin: bau
kunde: finelli
tags: [server, port, node, powershell, debugging, klick-beweis]
---

# Orphan-Server auf dem Port liefert ALTEN Code — Port hart per PowerShell freiraeumen

## Vorfall

Beim Bau des Finelli-KI-Mitarbeiter-Prototyps (Node-Server, Port 8030) mehrfach `node server.js &`
ueber das Bash-Tool gestartet. Ein alter Lauf blieb als **Orphan-Prozess** auf 8030 haengen und
beantwortete `GET /api/stand` weiter — mit dem CODE-STAND von damals. Symptom: die API lieferte
`snapshot.pack = undefined` und `lagerwert.laden = null`, obwohl der neue Code diese Felder korrekt
baut. Mehrere Runden am falschen Ort gesucht ("Frankenstein-Debugging": neue Mock-Daten trafen auf
alte Snapshot-Logik). `netstat -ano | taskkill` erwischte den PID nicht zuverlaessig; EADDRINUSE
beim Neustart wurde uebersehen, weil `&` den Fehler ins Log schob.

## Lehre (was ich naechstes Mal anders mache)

1. **Alte API-Felder = zuerst Orphan-Prozess verdaechtigen, nicht den Code.** Wenn ein frisch
   geaenderter Endpunkt "alte" Werte liefert, prueft man ZUERST, ob ueberhaupt der neue Prozess
   antwortet (Log auf EADDRINUSE lesen), bevor man die Logik zerlegt.
2. **Port hart per PowerShell freiraeumen**, nicht per netstat/taskkill:
   `Get-NetTCPConnection -LocalPort <P> -State Listen | %{ Stop-Process -Id $_.OwningProcess -Force }`
   — das trifft den Owner zuverlaessig; danach 1s warten + prueben, ob frei.
3. **Nach `node server.js &` im Bash-Tool immer das Start-Log lesen** ("laeuft auf ..." vs.
   EADDRINUSE). Ein `&`-Start, der scheitert, ist stumm — der ALTE Prozess bedient weiter.
4. Klick-Beweis lief zuverlaessig ueber `javascript_tool` (dispatchEvent click + innerText lesen),
   NICHT ueber Screenshots (die timeouteten). Fuer Tab-/Interaktions-Beweise diesen Weg nehmen.

## Was gut lief (nicht die Lesson, aber merken)

Recherche-Schwarm + Richter-Panel VOR dem Bau -> Bauplan trug; Tests-first mit Handrechnungs-
Fixtures fing den ABC-Grenzfall (Top-Artikel landete faelschlich in C) sofort.
