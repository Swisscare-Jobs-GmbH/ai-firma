---
type: lesson
disziplin: system
kunde: -
status: current
datum: 2026-07-19
quelle: SwissCare 13.07 (Bau-Minuten) + Pivot-Sitzung 07/2026 (Plan-Mode, Brain-Trennung)
---

# Warum die Prozess-Schutz-Regeln — Plan-Mode, GitHub-Minuten, Brain-Trennung

Diese Lesson traegt das WARUM hinter drei Prozess-Regeln in `CLAUDE.md`, die als knappe Zeilen
dort stehen.

## Plan-Mode ≠ Build-Mode: warum die Frage vor dem Bauen

Bei einem Discovery-Pivot (neue Info macht den Plan hinfaellig) wird gestoppt und mit A/B/C-Optionen
neu gefragt, statt blind weiterzubauen. **Grund (Token-Mathe):** Ein Drift-Bau kostet 50-70k Tokens
bei 0 Output (wird revertiert). Eine Frage kostet 200-500 Tokens. Es ist **100-300x billiger zu
fragen als zu reverten**. Darum: "User approved" beim Plan heisst nur, der Plan-Inhalt ist
akzeptiert — nicht "fuehr ihn jetzt aus".

## GitHub-Minuten: warum kein .github/workflows + Draft-PRs

Lektion aus SwissCare 13.07: Am Tag 13 war das Bau-Minuten-Budget leer → ALLE Pruefungen/Wecker
standen still, eine ganze Session litt. GitHub zaehlt pro Job, aufgerundet auf volle Minuten — viele
kleine Laeufe fressen das Budget schnell.

- **Keine `.github/workflows/`** (weder Firmen- noch Kunden-Repo) → gar keine teuren Laeufe.
- **Draft-PRs** loesen keine Laeufe aus; Ready erst am Ende.
- **Roter Check in ~4 Sek. ohne Schritte = KEIN Code-Fehler**, sondern Budget-Deckel oder Infra.
  Nicht blind re-runnen (jeder Re-Run kostet) — erst Ursache pruefen.

## Brain-Trennung: warum HIER und nicht ins swisscare-brain

Das Zweit-Gedaechtnis der AI-Firma liegt in `C:/dev/ai-firma/brain/`, NICHT im swisscare-brain.
**Grund:** Wer swisscare-brain-Zugriff hat, sieht SwissCare-Firmendaten + Founder-Privates + ein
offenes Privat-Leck in alter Historie. AI-Firma-Daten (Kunden-Deals, Finelli-Preise) gehoeren dort
nicht hin — und umgekehrt gehoert SwissCare-Geschaeftsinhalt nicht in dieses Repo. Regel: auf die
Nachbar-Repos ueber `brain/_cross-ref/` **verweisen statt kopieren**.
