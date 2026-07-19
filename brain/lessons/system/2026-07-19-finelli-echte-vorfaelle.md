---
type: lesson
disziplin: system
kunde: finelli
status: current
datum: 2026-07-19
quelle: Finelli-Prozess 18.-19.07 (destilliert ins playbook/; Original-Notizen im SwissCare-Brain)
---

# Echte Vorfaelle aus dem Finelli-Prozess — Quelle der 6 harten Regeln

Diese Lesson traegt die Vorfall-Geschichten hinter den "6 harten Regeln" in `CLAUDE.md`. Dort steht
je 1 Regel-Zeile; die konkreten Fehler, aus denen sie stammen, stehen hier.

## 1 — Bestehendes System NIE ersetzen, aufsetzen

Das bestehende Shopify des Kunden ersetzen zu wollen haette Monate gekostet + Risiko gebracht + war
kein Hebel (Finelli 18.07). Regel: aufsetzen statt ersetzen, "alles inbegriffen, keine Extra-Abos".

## 2 — Jede Kunden-Zahl LIVE verifizieren (Reviews/Referenzen)

Im Angebot stand fast "41 Bewertungen" — Google hatte real **130**. Das waere peinlich gewesen.
Die Referenz "Jelmoli" war genannt, obwohl die Firma **nicht mehr existierte** — eine toedlich
veraltete Referenz. Beide Male fing nur SA selbst den Fehler. Text-Checklisten reichen nachweislich
NICHT — darum gibt es zusaetzlich den Auto-Waechter `.claude/hooks/fakten-live-waechter`.

**Regel:** Jede Zahl, die in ein Kunden-Dokument geht (Reviews, Bewertungs-Anzahl, Referenzen,
Marktzahlen), wird VOR der Verwendung LIVE nachgeschlagen (z.B. Google Maps selbst oeffnen, nicht nur
Trustpilot). Belegte Zahl mit Quelle ODER "weiss ich nicht" — nie eine geratene Zahl im Angebot.

## 3 — Kunden-Team macht die Handarbeit, wir leiten nur an

Nie selbst zaehlen/einraeumen anbieten (Finelli-Etikettier-Tag). Sonst haftet die AI-Firma fuer
fremde Handarbeit.

## 4 — Preis-Mathe-Falle: Summenzeile NIE "Marktwert" nennen

Raten x Laufzeit ergibt eine Summe → der Kunde rechnet nach und fuehlt sich getaeuscht, wenn diese
Summe als "Marktwert" verkauft wurde (Deal-Session 18.07). Regel: die Summenzeile heisst "Dein Preis
/ Selbstkosten", der Agentur-Anker (30k+) steht separat.

## 5 — Mock-Formeln am Kalendertag verankern

Uebungs-Daten am KALENDERTAG verankern (toordinal), nie am Tages-Abstand. Sonst driften die Daten
nach jedem Neustart der Uebungs-Welt (Finelli-Bau).

## 6 — Jede Etappe speichern + hochladen, Draft-PRs, keine .github/workflows

Bau-Minuten-Budget schonen (Lektion aus SwissCare 13.07: Budget leer = alles steht). Detail zum
Budget-Warum siehe `2026-07-19-prozess-guards-warum.md`.
