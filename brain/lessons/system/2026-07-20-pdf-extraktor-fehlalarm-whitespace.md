---
domain: brain
type: lesson
persona: system
theme: beweis-pipeline
owner: sa
status: active
date: 2026-07-20
priority: 2
polarity: negativ
see_also: [playbook/erst-offerte-prozess.md]
witness_anchors: ["Mliegt-Fehlalarm", "3 Fixe fehlen-Meldung an SA"]
---

# PDF-Text-Checks: Extraktor zerhackt lange Saetze — erst normalisieren, dann melden

## Wurzel
pypdf extrahiert Text mit Zeilenumbruechen mitten im Satz. Wort-Checks auf dem rohen
Extrakt melden "fehlt!", obwohl der Text im PDF steht.

## Befund
2x in der Finelli-Session (20.07.): "Embrach, Regal 2, Fach 3" + "Und hakt spaeter etwas?"
als fehlend gemeldet — beide waren drin. 1x ging der Fehlalarm ("3 Fixe fehlten") sogar an
SA raus, bevor die Quelle geprueft war.

## Lesson
Wort-Checks IMMER auf Whitespace-normalisiertem Text: `re.sub(r"\s+"," ", text)`.
Bei einem "fehlt"-Befund ERST die HTML-Quelle grep'en — erst wenn Quelle UND
normalisierter Extrakt leer sind, ist es ein echter Fund. Nie einen Fehlalarm an den
Founder melden, bevor die Quelle gelesen ist.

## Anwendung
Steht als Pflicht-Regel im Playbook `erst-offerte-prozess.md` Schritt 5 (Beweis-Pipeline).

## Optionen
1. Check-Snippet als wiederverwendbares Skript ins Playbook-Repo legen.
2. Beim naechsten Kunden-Dokument die Pipeline 1:1 uebernehmen.
3. Nichts weiter — Regel ist dokumentiert.
