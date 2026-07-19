---
datum: 2026-07-19
disziplin: system
kunde: "-"
tags: [workflow, trockenflug, schwarm, verifikation]
status: aktiv
---

# Schwärme trocken fliegen lassen + args robust einlesen

## Wurzel
Vier neue Agenten-Schwärme (Recherche, Angebots-Richter, Klick-Beweis, Wochen-Bericht)
wurden gebaut und syntaktisch geprüft — aber nie mit einem echten Auftrag gestartet.
"Syntax grün" ≠ "läuft im Ernstfall".

## Befund
- **args-Falle:** Das Workflow-Tool reichte die Parameter als JSON-**Text** statt als Objekt
  durch. Alle vier Schwärme lasen `const {x} = args` → alles leer. Der Angebots-Richter reagierte
  korrekt (keine Druckfreigabe ohne Datei, ehrliche Meldung) — kein erfundenes Urteil. Erst der
  Trockenflug deckte es auf, kein Review.
- **Jeder Trockenflug fand echten Wert:** Demo-Killer in der Finelli-App (Mock friert über
  Mitternacht ein), ein Angebots-Widerspruch (keine-versteckten-Kosten ↔ Scanner-Hardware),
  der GzF-Verkaufs-Hebel (kein Konkurrent macht Rückhol-Erinnerung).
- **PR-Konflikt-Wurzel:** Der Sicherungs-Zweig schleppte die KI-Etappe doppelt (main hatte sie
  schon). Lösung: Zweig auf main neu aufsetzen + nur die Fixes cherry-picken — NICHT Konflikte
  Datei für Datei lösen.

## Lesson
1. Kein Schwarm geht ungetestet an einen echten Kunden — immer ein Trockenflug mit echtem Auftrag.
2. Workflow-Scripts lesen `args` robust: `typeof args === 'string' → JSON.parse`, sonst Objekt.
3. Bei „doppelter" Merge-Konflikt-Datei zuerst fragen: hat main den Inhalt schon? Dann Zweig
   neu aufsetzen statt Konflikte lösen.

## Anwendung
Gilt für jeden neuen Workflow im ai-firma-Repo. Die 4 Schwärme sind jetzt gehärtet (args-Fix
committet). Verweise: [[projekt-ai-firma-setup]], Handoff 2026-07-19.
