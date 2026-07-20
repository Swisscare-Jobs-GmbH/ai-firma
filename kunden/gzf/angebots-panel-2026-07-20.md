# Richter-Panel: Angebot GzF Mappe v2 (20.07.2026)

> 4 Richter (Workflow `angebots-judge-panel`) + Final-Lesung (Durchlauf 2) prueften
> `kunden/gzf/angebot/2026-07-20-angebot-gzf-mappe-v2.html`. Beide Durchlaeufe VOR dem Druck —
> anders als bei Finelli v6 (dort lief das Panel erst nach der Uebergabe).

## Noten (Durchlauf 1)

| Richter | Note |
|---|---|
| Hormozi (Wert/Preis-Framing) | 8/10 |
| Menschen-Natur (Psychologie) | 8/10 |
| Fakten-Skeptiker (Zahlen/Belege) | 7/10 |
| Geschaefts-Check (4 Pflicht-Fragen) | 9/10 — alle 4 bestanden |

**Durchlauf 1: KEINE Druckfreigabe (8 Pflicht-Funde) → alle gefixt → Durchlauf 2 (Final-Lesung
mit "Entscheide gesetzt"-Kontext): FREIGABE JA.**

## Die 8 Pflicht-Funde und ihre Fixe

| # | Fund | Fix |
|---|---|---|
| 1 | Kontakt-Mail `alikhawaja@swisscarejobs.ch`: fremder Name + SwissCare-Domain (Daten-Wand-Bruch), Postfach unbewiesen | Mail ganz raus (wie Finelli-Mappe). 🔴 **VOR Versand: SA setzt lebende Adresse ein + Test-Mail** |
| 2 | Eigentums-Widerspruch S.3 ("gehoert euch NACH 24 Mt") vs. S.4 ("gehoert ja euch") | S.3 auf Variante A angeglichen: "Die Software gehoert euch — abbezahlt ist sie nach 24 Monaten" |
| 3 | "Erinnerungen halbieren verpasste Termine" unbelegt | Belegte Zahnarzt-Analogie: "von rund 20% auf 5%", als Analogie benannt |
| 4 | 25'000er-Rechnung: Einlagen-Annahme unausgesprochen, Nachrechner kommt auf 34k | Annahme ausgesprochen + "gut 34'000 → bewusst vorsichtig ueber 25'000" |
| 5 | Bewertungs-Bitte "nach dem Termin" — System kennt keine Termine (one-way) | "nach jedem Kauf bei euch" |
| 6 | Deckblatt-Zitat als "eure Kunden" (Mehrzahl) attribuiert | "ein Kunde bei Google; 20 von 22 mit 4–5 Sternen" |
| 7 | Summenzeile ohne "Selbstkosten"-Frame | **BEWUSST SO GELASSEN** — Playbook V2 (SA 20.07) verbietet "Selbstkosten" auf dem Blatt; Verteidigung liegt im internen Merksatz (markt-anker-beleg) |
| 8 | "Gratis-Analyse nur bei euch" = Kunden-Aussage als Fakt | Gespiegelt: "wie ihr selbst sagt" |

Dazu 7 Empfehlungen umgesetzt: Nutzen-Rechnung VOR die Preis-Tabelle · ROI-Zeile (7'800/Jahr vs.
25'000+ = mehr als 3x) · "kein fremdes Zusatz-Abo" · "ehrlich" von 6x auf 2x · GESCHENKT-Caps →
"ueber 9'000 Franken erlassen" ("geschenkt" exklusiv fuer 48h-Garantie) · Verknappung mit Grund
(einziger Referenz-Startkunde Orthopaedie) · Schluss-Satz = Du-entscheidest-Frame.

## Beweis-Pipeline (Playbook Schritt 5)

HTML → Edge headless → pypdf-Guards (4 Seiten exakt · Muss-Woerter · Verbots-Woerter · S.2 ohne
Deal-Franken · Rechnungen aufgehend) → Seiten-Bilder gesichtet (pypdfium2) → PDF identisch in Repo
+ Downloads (`GZF-Angebot.pdf`, md5-gleich).

## Offen vor Versand (🔴)

1. **Lebende Kontakt-Adresse einsetzen** (Fund 1) — Test-Mail schicken, Antwort abwarten.
2. **GzF-Vertrag existiert nicht** — muss jedes Blatt-Versprechen decken (Joker-Wahl 10%/20%,
   48h-Garantie-Wortlaut, Variante-A-Exit, Abnahme-Liste). Finelli-Lehre: Vertrag lief 2x hinterher.
