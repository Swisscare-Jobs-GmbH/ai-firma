---
name: schmerz-fragen
description: Baut die 10 Schmerz-Fragen fuer einen neuen Kunden nach GzF-Muster — Tabelle Frage/Warum, Split "vorab per Mail OK" vs "NUR live", Pflicht-Geld-Hebel-Frage und Live-Beleg-Pflicht (Google Maps selbst nachzaehlen). Triggert via /schmerz-fragen oder Phrasen "schmerz-fragen", "fragen fuer {kunde}", "gespraechs-zettel", "10 fragen", "kunden-interview vorbereiten", "schmerz-landkarte".
---

# /schmerz-fragen — 10 Fragen fuer den Kunden-Termin (Playbook Phase 1)

## Wurzel / Zweck
Phase 1 im Playbook: SA sitzt LIVE beim Kunden, stellt 10 Schmerz-Fragen, notiert
jede Antwort woertlich, findet den Killer-Pain + echte Zahlen. Muster: GzF-Zettel
(`C:/dev/ai-firma/kunden/gzf/2026-07-19-gzf-schmerz-fragen.md`). Dieser Skill
erzeugt denselben Zettel fuer {KUNDE} aus der Phase-0-Recherche.

## Schritt 0 — Live-Beleg PFLICHT (vor den Fragen)
- **Google Maps SELBST im Browser nachzaehlen** (eingeloggt): Sterne + Zahl der
  Bewertungen + Verteilung (wie viele 5★/4★/.../1★). Nie aus dem Gedaechtnis, nie
  nur Trustpilot — die Zahl kommt live aus Maps.
- Die **niedrigste** Bewertung (1★/3★) im Text lesen — dort steht der echte Schmerz.
- Warum hart: eine falsche/veraltete Referenz im Gespraech ist toedlich (bei
  Finelli waere eine erfundene Bewertungszahl peinlich gewesen; ein laengst
  geschlossener Vergleichs-Laden ebenso).

## Schritt 1 — Die 10 Fragen bauen (Tabelle Frage / Warum)
Aus der Phase-0-Recherche fuer {KUNDE} konkretisieren. Jede Frage MUSS eine
Warum-Spalte haben (sonst weiss SA im Gespraech nicht, warum er nachbohrt). Diese
10 Schablonen abdecken:

| # | Frage-Typ | Was abfragen | Warum |
|---|---|---|---|
| 1 | Volumen | Kaeufe/Faelle pro Monat, getrennt nach Art | Basis jeder CHF-Rechnung + Umfang der Automatisierung |
| 2 | Daten-Fundament | Wie viele Datensaetze — bei wie vielen ist die Kontakt-Adresse gepflegt? | Ohne gepflegte Daten keine Strecke — groesstes Risiko |
| 3 | Einwilligung | Duerfen Bestandskunden angeschrieben werden (dokumentiert)? | Datenschutz + halbiert sonst den Wert in Jahr 1 |
| 4 | **Technik-Beweis (am Rechner zeigen lassen)** | "Ziehen Sie mir kurz einen Export/eine Liste raus" + Versionsnummer ablesen | Der Export ist das Fundament des MVP — nie annehmen, IMMER live sehen |
| 5 | Personal-Realitaet | Wer traegt ein / reagiert auf Alarme, wie viele seid ihr? | Ob der Ablauf im Alltag ueberhaupt gelebt wird |
| 6 | Preis-Anker | Was kostet bei EUCH das Kern-Produkt/die Kern-Leistung? | SEINE Zahl macht die Geld-Rechnung unwiderlegbar |
| 7 | Neukunden-Quelle | Woher kommen Kunden (Laufkundschaft / Zuweiser / Aerzte)? Namen? | Zuweiser-/Herkunfts-Report als Verkaufs-Argument |
| 8 | Kanal | Welcher Kanal wirklich gewollt — Mail reicht, oder mehr (WhatsApp)? | Zusatz-Kanaele kosten extra, nicht ungefragt einplanen |
| 9 | **GELD-HEBEL (Pflicht!)** | Wie viele kommen heute von selbst wieder (Wiederkauf/Recall)? | Differenz × Frage 6 = verlorener Umsatz/Jahr = der Kauf-Grund |
| 10 | Entscheider + Budget | Entscheidest du allein? Budget einmalig oder monatlich gemeint? | Abschluss-Weg + Deal-Rahmen |

**Die Geld-Hebel-Frage (#9) ist Pflicht** — sie liefert die eine Zahl, die den
ganzen Deal traegt: `(heutiger Wiederkauf-Anteil vs. moeglicher) × Preis pro
Einheit = Umsatz, der jedes Jahr liegen bleibt`. Ohne sie ist das Angebot Bauchgefuehl.

## Schritt 2 — Split: vorab per Mail OK vs. NUR live
- **Vorab per Mail OK:** reine Fakten-Fragen, die der Kunde nachschauen/vorbereiten
  kann (Volumen, Daten-Stand, Einwilligung — Typ 1, 2, 3).
- **NUR live:** Schmerz-, Geld- und Entscheider-Fragen + der Rechner-Beweis
  (Typ 4, 5, 6, 7, 8, 9, 10). Per Mail kommen Einzeiler zurueck und der Hebel ist
  weg — diese Fragen brauchen Nachfassen im Gespraech.

## Ausgabe
Ein fertiger Zettel fuer {KUNDE}:
1. Live-Beleg-Block (Maps-Zahlen + niedrigste Bewertung).
2. Die 10 Fragen als Tabelle Frage/Warum, auf {KUNDE} konkretisiert.
3. Split-Kasten "Vorab OK" / "NUR live".
4. Gespraechs-Muni: 3-5 belegte Fakten der Branche zum Einstreuen.

## Verbote
- Bewertungszahlen/Referenzen aus dem Gedaechtnis — immer live nachzaehlen.
- Schmerz-/Geld-/Entscheider-Fragen vorab per Mail rausgeben.
- Die Geld-Hebel-Frage weglassen.
