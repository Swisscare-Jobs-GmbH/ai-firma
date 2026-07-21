---
type: decision
id: E5
status: aktiv
datum: 2026-07-21
entscheider: SA
---

# E5 — Finelli KI-Mitarbeiter-Prototyp VOR dem Finelli-Ja bauen (Gate-0-Ausnahme)

## Was entschieden wurde

SA hat am 21.07.2026 ausdruecklich angeordnet, den kompletten Prototyp der **3 KI-Mitarbeiter**
(Research-Spaeher · KPI-Experte · Manager) **jetzt zu bauen** — als lauffaehige Demo, die Finelli
beim Termin **morgen (22.07.2026)** gezeigt werden kann, "sobald wir Logistik und alte Daten
reingetan haben".

Das ist eine bewusste **Ausnahme von Gate 0** ("Verkauf vor Bau", Leitplanke 1) — genau die
Ausnahme, die der Bauplan vorsieht: *"Ausnahme nur als dokumentierter SA-Entscheid in
brain/decisions/"* (siehe [Bauplan Abschnitt 3/10](../../kunden/finelli/2026-07-21-bauplan-ki-mitarbeiter.md)).

## Warum (SAs Begruendung + Einordnung)

1. **Der Bau DIENT dem Verkauf, statt ihn zu riskieren.** Die 42k-Falle (Leitplanke 1) warnt vor
   Produktiv-Arbeit auf Verdacht, die nie verkauft wird. Hier ist der Zweck umgekehrt: ein
   klickbares System soll Finelli beim Entscheid-Termin ueberzeugen. Ein Demo fuer den Sales-Termin
   ist vom Playbook ausdruecklich gedeckt (phase-3-mvp: "Mock zuerst, demo-faehig").
2. **Reiner Mock, kein Produktivsystem:** keine echten Shopify-Zugaenge, keine echten Kundendaten,
   voll zuruecknehmbarer lokaler Code. Das eigentliche Produktiv-Gate (echte Anbindung, Backfill,
   taeglicher Echtbetrieb) bleibt bestehen — es liegt weiterhin hinter dem Finelli-Ja + den
   Bedingungen am E5-Gate des Bauplans (inkl. POS-Regel "V4 erst nach V2").
3. **Finelli fuettert am Termin selbst Logistik (Hersteller-Lieferzeiten) + alte Verkaufsdaten
   rein** — das ist Teil der Ueberzeugung ("euer System, mit euren Zahlen") und liefert uns zugleich
   echte Stammdaten fuer den spaeteren Bau.

## Verworfene Alternativen (aus der A/B/C-Frage an SA)

- **B — Warten aufs Finelli-Ja:** strikt regelkonform, aber SA will etwas Klickbares fuer den
  Termin. Verworfen von SA.
- **A — nur E0+E1 (Rechenkern) bauen:** zu wenig fuer eine ueberzeugende Demo. Verworfen von SA
  zugunsten des vollen Systems.

## Randbedingungen (bleiben in Kraft)

- Gebaut wird als **eigenstaendiger Prototyp im ai-firma-Repo** (`kunden/finelli/ki-mitarbeiter-prototyp/`),
  weil `finelli-cockpit` auf dem aktuellen Rechner nicht liegt (G11-Vorflug, 21.07). Nach dem Ja
  wandert der Code ins finelli-cockpit (`ki-mitarbeiter/`).
- Alle uebrigen Leitplanken gelten unveraendert: read-only-Prinzip, keine KI bucht Bestand,
  Fakten-Live (Quellen mit Beleg), keine .github/workflows, Schweizer "ss", eigener Port (8030,
  registriert in kunden/UEBERSICHT.md).

## Revisit-Bedingung

Faellt der Finelli-Entscheid **negativ** aus (kein Ja), wird der Prototyp NICHT weiter zum
Produktivsystem ausgebaut — er bleibt Demo/Vorlage. Faellt er **positiv** aus, gilt wieder der
regulaere Bauplan ab E5-Gate (Shopify-Zugang, Backfill, POS-Regel, Anlaufphase mit SA-Gegenlesen).
