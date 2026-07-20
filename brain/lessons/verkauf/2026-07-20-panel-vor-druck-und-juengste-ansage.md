# Panel VOR Druck zahlt sich aus — und die juengste SA-Ansage schlaegt alte Regel-Texte

> Session 20.07.2026 abend (GzF-Mappe v2 + 3-Pakete-Brief). Status: bestaetigt.

## Wurzel

GzF-Angebots-Mappe v2 wurde nach der neuesten Finelli-Mappe gebaut. Erstmals lief das
4-Richter-Panel VOR dem Druck (bei Finelli v6 lief es erst NACH der Uebergabe).

## Befund

1. **Panel vor Druck fing 8 Pflicht-Funde**, die der Kunde selbst gefunden haette — die zwei
   dicksten: Kontakt-Mail mit fremdem Namen + SwissCare-Domain (Daten-Wand-Bruch!) und ein
   Eigentums-Widerspruch Seite 3 vs. Seite 4 (Variante A). Kosten des Panels: ~30 Min. Kosten
   eines Fundes durch den Vater am Termin: der Deal.
2. **Regel-Konflikt alt vs. neu:** Projekt-Regeln sagten Summenzeile = "Dein Preis — Selbstkosten";
   Playbook V2 (SA 20.07) verbietet "Selbstkosten" auf dem Blatt ("klingt billig"). Der Richter
   meldete das Fehlen als Pflicht-Fund. Aufloesung: **juengste SA-Ansage gewinnt** — und der
   bewusste Override MUSS im Panel-Protokoll dokumentiert werden, sonst meldet jeder kuenftige
   Richter-Lauf denselben Schein-Fund neu.
3. **Referenz-Mappe lebt:** Das Finelli-PDF in Downloads war innerhalb eines Tages 2x neuer als
   der Repo-Stand (Momente-Text → Fluss-Bild). Hash/Text-Diff statt Annahme hat beide Wechsel
   gefangen — nie "das kenne ich schon" bei einer Referenz-Datei.

## Lesson

Panel + Final-Lesung VOR jedem Kunden-PDF ist Pflicht und billig. Bewusste Abweichungen von
Panel-Funden immer mit Quelle (juengste SA-Ansage) ins Protokoll schreiben. Referenz-Dateien vor
jedem Nachbau frisch diffen.

## Anwendung

- Jede neue Mappe: Panel-Workflow VOR Druck + Final-Lesung mit "Entscheide gesetzt"-Kontext.
- Overrides gehoeren in `kunden/{kunde}/angebots-panel-{datum}.md` (GzF-Muster).
- Vor Nachbau aus Downloads/fremden Staenden: Hash- oder Text-Diff gegen den Repo-Stand.
