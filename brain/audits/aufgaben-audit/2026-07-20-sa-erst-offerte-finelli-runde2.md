---
domain: brain
type: aufgaben-audit
owner: shared
status: done
date: 2026-07-20
user: sa
session_tag: erst-offerte-finelli-runde2
verdict: gelb
gelb_typ: leicht
sektion_status:
  ziel: gruen
  quellen_pool: gruen
  instruktions_treue: gruen
  wurzel_symptom: gelb
  stand: gelb
  swot: na
  wie_gearbeitet: gelb
  empfehlung_count: 3
---

# Aufgaben-Audit — Erst-Offerte Finelli, Runde 2 (20.07.2026)

Stufe 3 (Kunden-Dokumente, Mandatory-Trigger "kunde" → voller Audit, kein Hard-Audit).
Umfang der Runde: Deckblatt (2 Iterationen, Etiketten-Motiv) · Mappe 5→3→4 Seiten ·
Momente nach SA-Formel (Stress → "gibt's nicht mehr, weil") · Logistik-Story (Reviews-Hook) ·
Geschenk-Badges · Mehr-Umsatz-Schaetzung · Joker-Wahl (10%/20%) · Plus-Zeilen statt
Markt-Preise · Exit neu · 500er aufgeschluesselt · 2 Richter-Workflows (Leserlichkeit final).

## 1. ZIEL
Kunden-Mappe fuer Mittwoch nach SAs Verkaufs-Ansagen fertigmachen. ~10 SA-Iterationen, jede
direkt beauftragt und sofort umgesetzt. Status: gruen.

## 2. QUELLEN-POOL
Alle Blatt-Quellen im Kontext; 2 Workflows (3 Lese-Richter + Buendel; 300k Tokens) lieferten
die letzten 10 Textfixes; Recherche-Zahlen aus Runde 1 wiederverwendet (12-20% Dead-Stock,
Marktplatz-Abgaben). Status: gruen.

## 3. INSTRUKTIONS-TREUE
Alle SA-Ansagen der Runde umgesetzt und maschinell bewiesen (Badges, Schaetzung, Joker-Wahl,
Plus-Zeilen, Exit, 500er, Stress-Formel 4x, Logistik-Hook, max-4-Seiten, Weissraum).
Format-Kopf: 1 Hook-Block (Zwischenbericht ohne Kopf) — deutlich besser als Runde 1 (3 Bloecke).
Status: gruen (Rest-Hinweis Format bei Hintergrund-Meldungen).

## 4. WURZEL-VS-SYMPTOM
Sauber: Seiten-Overflow 2x an der Wurzel geloest (Abstands-System kompaktiert statt Inhalt
gestrichen); PDF-Extraktor-Fehlalarm-KLASSE erkannt (zerhackt lange Saetze an Zeilenumbruechen)
→ Whitespace-Normalisierung als Standard-Check etabliert. Einmal falsch gemeldet ("3 Fixe
fehlen"), am Ist-Stand korrigiert — Transparenz ok, aber Fehlalarm ging an SA raus.
OFFEN (NEU, rot fuer den Vertrag): Blaetter versprechen jetzt MEHR als der Vertrag —
(a) Joker-Wahl "20% runter auf Raten" existiert in Ziffer 6 nicht (nur 10%),
(b) Exit "Raten laufen fertig + Betrieb weg = keine Updates" ersetzt die alte
3-Monats-Auslauf-Logik von Ziffer 9 nicht sauber.
Status: gelb — Arbeit sauber, Vertrags-Luecke dokumentiert.

## 5. STAND
Laeuft: Mappe FINELLI-Angebot.pdf (4 Seiten) versandbereit, 9 Commits gepusht (9f2a138).
Offen: Vertrag Ziffer 6+9 nachziehen (Joker-Wahl + Exit) · Khawar-Vorbereitungs-Nachricht ·
Playbook-Ergaenzung (dieser Auftrag). Blockiert: Shopify-Schluessel (Khawar, seit 18.07).
Status: gelb.

## 6. SWOT
| Stark | Schwach |
|---|---|
| Beweis-Pipeline hielt: 2x Overflow vom Seitenzahl-Guard gefangen | Fehlalarm "3 Fixe fehlen" an SA gemeldet (Extraktor-Artefakt) |
| SA-Verkaufs-Formeln 1:1 umgesetzt (Stress→weil, Hebel-fuer-Hebel) | Vertrag laeuft den Blaettern schon wieder hinterher |
| Lese-Richter fingen 80%-Missverstaendnis + 12'000-Rechenluecke | Kompaktierung noetig = Inhalt wuchs ohne Platz-Plan |

| Chance | Risiko |
|---|---|
| Formeln ins Playbook → naechste Offerte massiv schneller | 20%-Raten-Option (3'600 CHF) muendlich zusagen ohne Vertrag |
| Schaetz-Bloecke ("pro 100k Umsatz") als Standard-Baustein | Khawar-Fragen (Pack-Software) weiter offen vor Mittwoch |

## 7. WIE GEARBEITET
Besser: jede Ansage einzeln committet + maschinell + visuell bewiesen; Ist-Stand gelesen statt
auf eigenen Fehlalarm gebaut. Schlechter: Fehlalarm ueberhaupt gemeldet ohne Quell-Check;
ein Kopf-Verstoss. Status: gelb.

## 8. EMPFEHLUNG
1. Vertrag Ziffer 6 (Joker-Wahl 10%/20%) + Ziffer 9 (Exit: Raten laufen fertig, Betrieb weg =
   Update-/KI-Stopp) angleichen VOR Unterschrift — CHF-Math: 20%-Option = bis 3'600 CHF;
   ungedeckt = Streit-Risiko im Referral-Fall.
2. Playbook-Ergaenzung V2 (dieser Auftrag) — CHF-Math: Verkaufs-Formeln wiederverwendbar,
   naechste Offerte ~0.5 Tag statt 2 (3 Kunden in Pipeline).
3. Khawar-Vorbereitungs-Nachricht heute (MITTWOCH-PLAN Vorlage) — CHF-Math: sichert den
   18'000-Anker-Termin; Pack-Software-Frage ist das groesste Demo-Risiko.

Verdict: **gelb-leicht** — Arbeit stark und bewiesen; offen sind Vertrag-Nachzug + Versand-Vorbereitung.
