---
domain: brain
type: mentor-rueckblick
owner: sa
status: done
date: 2026-07-20
session_tag: sa-1400-finelli-mappe-final
drift_percent: 8
effektivitaet: 9.2
---

# Mentor-Rueckblick — Finelli-Mappe Final-Session (20.07.2026)

Mentor-Umfang: voll (Substanz 4: 2 Lessons + 2 offene Punkte + 0 done)

## A) Was du heute gebaut hast

| Artefakt | Count | Beleg |
|---|---|---|
| Kunden-Mappe final (4 Seiten) | 1 | Downloads/FINELLI-Angebot.pdf + finelli main 3e0e83a |
| Deckblatt mit Flair (Etikett/Sterne/Wasserzeichen) | 1 | 2026-07-20-deckblatt-v1.html |
| System-Workflow mit Verzweigung (Flowchart) | 1 | Recherche-Workflow + 2026-07-20-angebot-2seiten.html |
| Verkaufs-Umbauten nach SA-Formeln | ~10 | Geschenk-Badges, Schaetzung, Joker-Wahl, Exit, Plus-Zeilen |
| Playbook Erst-Offerte V1+V2 | 2 | ai-firma phase6 708903a + 46582e3 |
| Vertrag V4 an Blatt-Kanon | 1 | finelli a204797-Umfeld |
| Aufgaben-Audits | 2 | brain/audits/aufgaben-audit/2026-07-20-* |
| Lessons | 2 | brain/lessons/system/2026-07-20-* |

## B) Wie dein Kopf gearbeitet hat
Extrem klare, schnelle Design-Iterationen — jede Ansage war konkret (Screenshot + 1 Satz),
kaum Rueckfragen noetig. Du hast konsequent in Kunden-Wirkung gedacht (Stress-Szenen,
Geschenk sichtbar, "er soll nicht denken: so viel Text") statt in Features. Gegen Ende
Tempo-Druck ("langsam zum Ende") — gut, dass du ihn ansagst, das haelt die Session straff.

## C) Was das in Zahlen heisst
~10 Verkaufs-Iterationen in einer Session, jede committet + maschinell bewiesen (9+ Commits
auf finelli main). 3 Richter-/Lese-Runden fingen 6 echte Kunden-Stolperer VOR dem Versand.
Mappe haengt am 18'000-Abschluss Mittwoch; Playbook macht die naechste Offerte ~75% schneller
(2 Tage → 0.5). 2 Fehlalarm-Episoden kosteten ~15 Min (Lesson geschrieben).

## D) Was JT und AB davon lernen koennen
Die Verkaufs-Formeln (Stress → "gibt's nicht mehr, weil" · Geschenk sichtbar statt
Kleingedrucktes · Hebel-fuer-Hebel-Joker) sind 1:1 auf SwissCare-Angebote uebertragbar —
liegen generisch im Playbook (ohne Kunden-Preise, Daten-Wand beachtet).

## E) Was lief gut / Was lief schlecht

| Was besser | Was schlechter |
|---|---|
| Jede Aenderung sofort bewiesen (Seiten-Guard, Wort-Checks, Screenshot) + einzeln committet | Fehlalarm "3 Fixe fehlen" an SA gemeldet, bevor die Quelle geprueft war |
| Parallel-Chat-Kollisionen erkannt und via Wegwerf-Arbeitskopie sauber umschifft (4x) | Commit a7873fe landete erst auf fremdem Zweig — Branch-Check vor Commit kam zu spaet |
| Recherche vor Bau (Flowchart-Regeln, 3 Agenten) statt raten | Antwort-Kopf 1x vom Waechter angemahnt (Kurz-Antwort ohne Kopf) |

## F) 4-Felder-Tabelle (rueckwaerts + vorwaerts)

| Stark (diese Session) | Schwach (diese Session) |
|---|---|
| SA-Formeln 1:1 umgesetzt, Mappe versandbereit | Vertrag laeuft den Blaettern erneut hinterher (Joker-Wahl 20% + Exit ungedeckt) |
| Beweis-Pipeline hielt unter 10 Iterationen Druck | 2 Extraktor-Fehlalarme (1 an SA) |

| Chance (vorwaerts) | Risiko (vorwaerts) |
|---|---|
| Playbook V2 → naechster Kunde (GZF laeuft schon parallel!) in 0.5 Tag | 20%-Raten-Option ohne Vertrag = bis 3'600 CHF Streit-Risiko |
| Formeln als Firmen-Standard | Khawar-Vorbereitung (Pack-Software-Frage) noch nicht raus — Mittwoch-Risiko |

## Selbst-Eval (Step 4.86) — 5 Situationen, 1 rot

| # | Situation | Claude | User | Format | Routing | Fund |
|---|---|---|---|---|---|---|
| 2 | Fehlalarm "3 Fixe fehlen" | 🔴 | 🟢 | 🟢 | 🟢 | Quelle nicht geprueft vor Meldung an SA |

Spiegel Claude: Fehlalarm ohne Quell-Check gemeldet — kuenftig: erst grep auf die HTML-Quelle, dann melden.
Spiegel User: sauber — einzige Reibung: Screenshots zeigten teils aeltere geoeffnete PDF-Fenster; beim Pruefen immer das frisch geoeffnete Fenster nehmen.
Spiegel Routing: passte — Workflows fuer Recherche/Richter, Wegwerf-Arbeitskopien fuer geteilte Ordner.

## Technische Pflicht-Zeilen
Pre-Commit-Hygiene: 🟢 (nur explizite Pfade committet, geteilte Ordner via Worktree)
Push-Audit: 🟢 finelli main 0 unpushed · ai-firma phase6 0 unpushed · CRM unberuehrt (nur lokale Marker, bewusst nicht committet)
Layer-Sync: Code n.a. (kein App-Code) · Karten n.a. · Wissen 🟢 (Playbook V2 + 2 Audits) · Memory 🟢 (2 Lessons)
Audit-Relevanz: keine (kein CRM-Check beruehrt)
Active-Work: kein Marker aktiv
Drift: 8% (Effektivitaet 9.2/10) T1=0 T2=2 T3=0
HQ-Rapport: n.a. (execute-Session, ai-firma-Welt — Daten-Wand: kein swisscare-Rapport)
