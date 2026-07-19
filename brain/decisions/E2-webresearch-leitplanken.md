---
type: decision
id: E2
status: aktiv
datum: 2026-07-19
entscheider: SA
---

# E2 — Webrecherche-Leitplanken (kein RAG, Schwaerme nur zum Lesen, Richter voten unabhaengig)

## Entscheid

Aus dem Web-Recherche-Abgleich vom 2026-07-19 (4 Spaeher + 1 Richter, Fabel 5) werden drei
Leitplanken fuer die AI-Firma festgehalten:

- **(a) Kein Vektor-DB / RAG fuers Brain.** Das Zweit-Gedaechtnis bleibt reines Markdown (kleiner
  Index + Detail-Dateien). Keine Vektor-Datenbank, kein RAG-Aufbau.
- **(b) Schwaerme nur fuer paralleles Lesen** (Recherche, Pruefen, Inventar) — **nie** fuer Denk-
  oder Bau-Arbeit und **nicht** als Ersatz fuer ein Richter-/Panel-Urteil. Gedacht + gebaut wird im
  Haupt-Chat; die Schwaerme tragen nur Fakten zu.
- **(c) Richter voten unabhaengig, ohne Debatten.** Jeder Richter gibt sein Urteil getrennt ab, je
  mit **1-Satz-Begruendung aus der Web-Recherche**. Es wird ausgezaehlt — keine Debatten-Runden
  zwischen den Richtern.

## Warum

1. **Markdown schlaegt Technik (a).** Praktiker-Bilanz 2026: "Markdown + bash gewann, alles Clevere
   verlor" — bis in den Tausender-Bereich an Eintraegen bringt eine Vektor-DB nichts ausser Wartung.
   Die Energie gehoert in die Kuration, nicht in die Technik.
2. **Schwaerme sind teuer, wenn sie denken (b).** Agenten-Schwaerme fuer Denk-/Bau-Arbeit kosten
   ~15x Token bei "Stille-Post"-Risiko (Cognition/Devin: nur Haupt-Chat schreibt, Schwaerme lesen —
   genau das Muster haelt). Fuers parallele Lesen sind sie ideal und werden genau dort eingesetzt.
3. **Debatten verstaerken Mitlaeufer-Effekt (c).** Nach Runde 1 verstaerken Debatten-Runden den Bias;
   unabhaengig voten + auszaehlen ist das belegte Muster. Der Panel-Vorteil kommt aus Modell-Vielfalt
   — die haben wir nicht (nur Claude) — also Panels klein + strikt unabhaengig halten, nicht ausbauen.

## Verworfene Alternativen

- **Vektor-DB / RAG jetzt aufsetzen** — verworfen (Punkt 1): Aufwand ohne Nutzen bei der aktuellen
  Groesse; Wiedervorlage erst im vierstelligen Eintrags-Bereich (Revisit).
- **Schwaerme auch bauen/denken lassen** — verworfen (Punkt 2): ~15x Kosten, Stille-Post-Fehler.
- **Richter miteinander debattieren lassen** — verworfen (Punkt 3): verstaerkt Bias statt ihn zu
  korrigieren.

## Revisit-Bedingung

- (a) neu pruefen, sobald das Brain in den vierstelligen Eintrags-Bereich waechst und Volltext-Suche
  spuerbar langsam/ungenau wird.
- (b)+(c) neu pruefen, sobald echte Modell-Vielfalt vorliegt (mehr als nur Claude als Richter) —
  dann kann ein groesseres, weiterhin unabhaengiges Panel Sinn ergeben.

## Quelle

`brain/audits/aufgaben-audit/2026-07-19-sa-ai-firma-setup.md` (Anhang: Web-Recherche-Abgleich,
Abschnitte 2 #4 und 3).
