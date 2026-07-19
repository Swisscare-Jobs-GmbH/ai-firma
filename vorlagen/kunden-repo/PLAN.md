# Feinplan {KUNDE} {PRODUKT_NAME} (VORLAGE — 8 Sektionen)

> Herkunft: Finelli-Feinplan (8-Sektionen-Muster). Struktur behalten, Inhalt = Platzhalter.
> **Preise NICHT aus Finelli uebernehmen** — der Deal steht in `vorlagen/angebot/` + `vorlagen/vertrag/`;
> hier nur der Bau-Plan. Erstellt durch HQ (Design-Linsen + Machbarkeits-Check + Synthese).
> Status: 🟡 wartet auf {WARTET_AUF}.

## 1. Fazit

Wir bauen {WAS_KURZ}. **~{BAU_TAGE} Bau-Tage, lieferbar in {LIEFERZEIT}.** Einnahme laut Angebot
(siehe `vorlagen/angebot/`), unsere laufenden Kosten ~CHF {KOSTEN_MONAT}/Monat ({KOSTEN_POSTEN}) —
Rest ist Marge + Wartungspuffer.

## 2. Was {KUNDE} sieht

1. **{SCREEN_1}** — {SCREEN_1_BESCHREIB}.
2. **{SCREEN_2}** — {SCREEN_2_BESCHREIB}.
3. **{SCREEN_3}** — {SCREEN_3_BESCHREIB}.
4. **{SCREEN_4}** — {SCREEN_4_BESCHREIB}.
5. **{SCREEN_5 (oft die eine KI-/Wow-Funktion)}** — {SCREEN_5_BESCHREIB}.
6. **{SCREEN_6 (Verlauf/Bericht)}** — {SCREEN_6_BESCHREIB}.

## 3. Die AI drin (echt)

1. **{KI_1}** — {KI_1_BESCHREIB}.
2. **{KI_2 (der taegliche Wow-Moment)}** — {KI_2_BESCHREIB}.
3. **{KI_3 (Wochen-Bericht — traegt den AI-Claim + das Abo)}** — {KI_3_BESCHREIB}.

*KI-Kosten grob CHF {KI_KOSTEN}/Monat — {KI_KOSTEN_EINORDNUNG}.*

**Bewusst NICHT drin (Phase 2, spaetere Version):** {SPAETER_1}, {SPAETER_2}, {SPAETER_3}.

## 4. So haengt es zusammen

{FUEHRENDES_SYSTEM} bleibt der Chef ueber {WAHRHEITS_GEGENSTAND} — dort lebt er, nirgends sonst.
Unsere App ist nur das Fenster: sie liest und schreibt ueber {SCHNITTSTELLE} ({SCHNITTSTELLE_DETAIL —
offiziell? Review noetig? Kosten?}). Nichts wird doppelt gepflegt; aendert jemand direkt in
{FUEHRENDES_SYSTEM}, zieht die App nach ({ABGLEICH_MECHANIK}). Laeuft auf unserem bewaehrten
Hosting-Muster (~CHF {HOSTING_KOSTEN}/Monat). *(Diese Sektion anpassen/kuerzen, wenn die App
eigenstaendig ist.)*

## 5. Bau-Etappen

| Etappe | Was fertig ist | Bau-Tage |
|---|---|---|
| 1 (Woche 1) | {ETAPPE_1_ZIEL — muss etwas Klickbares liefern} | {E1_TAGE} |
| 2 | {ETAPPE_2_ZIEL} | {E2_TAGE} |
| 3 | {ETAPPE_3_ZIEL} | {E3_TAGE} |
| 4 | {ETAPPE_4_ZIEL} | {E4_TAGE} |
| 5 | Robustheit: {ROBUSTHEIT_TEILE} + Abnahme mit {KUNDE} | {E5_TAGE} |

**Total: ~{BAU_TAGE} Tage** — Etappe 1 liefert nach ~1 Woche etwas Klickbares.

## 6. Geld

> **Der verbindliche Deal steht im Angebot + Vertrag** (`vorlagen/angebot/`, `vorlagen/vertrag/`).
> Hier nur die Bau-Sicht: was uns der Kunde bringt vs. was uns der Betrieb kostet.

- **Werk-Preis: CHF {WERK_PREIS}** — {ZAHLUNGS_MODELL, z.B. "0 vorab, {LAUFZEIT} Raten a {PREIS_RATE}"}.
- **Betriebs-Gebuehr: CHF {BETRIEB_PREIS}/Monat** — {BETRIEB_BEGRUENDUNG — Hosting + KI + Wartung +
  Schnittstellen-Nachzug; ohne Wartungsvertrag bricht die App still und wir arbeiten gratis}.
- **Unsere laufenden Kosten: ~CHF {KOSTEN_MONAT}/Monat** — Rest ist Marge + Puffer.

## 7. Top-3-Risiken

1. **{RISIKO_1 — meist Zugang/Schluessel/Rechte}** — {RISIKO_1_FOLGE} → {RISIKO_1_GEGENMASSNAHME}.
2. **{RISIKO_2 — meist duenne/unsaubere Daten}** — {RISIKO_2_FOLGE} → {RISIKO_2_GEGENMASSNAHME}.
3. **{RISIKO_3 — meist Schreiben ins Live-System}** — {RISIKO_3_FOLGE} → {RISIKO_3_GEGENMASSNAHME}
   (jede Buchung nur mit Bestaetigen-Klick + Protokoll, bei Streit gewinnt {FUEHRENDES_SYSTEM}).

## 8. Naechster Schritt (SA konkret)

1. **{SCHRITT_1 — z.B. Anruf/Termin mit dem Kunden, was klaeren}**.
2. **{SCHRITT_2 — Zugang/Schluessel holen}** — Anleitung: `docs/ZUGANG.md`.
3. **{SCHRITT_3 — sobald Zugang da: Tag-1-Test der riskantesten Schnittstelle, dann Baustart}**.

---

## Platzhalter-Legende (Kurz)

`{KUNDE}`/`{PRODUKT_NAME}` · `{WAS_KURZ}`/`{BAU_TAGE}`/`{LIEFERZEIT}` = Fazit ·
`{SCREEN_1..6}` = was der Kunde sieht · `{KI_1..3}` = echte KI-Funktionen ·
`{FUEHRENDES_SYSTEM}`/`{SCHNITTSTELLE}`/`{WAHRHEITS_GEGENSTAND}`/`{ABGLEICH_MECHANIK}` = Anbindung ·
`{ETAPPE_1..5_ZIEL}`/`{E1..5_TAGE}` = Bau-Plan · `{WERK_PREIS}`/`{PREIS_RATE}`/`{LAUFZEIT}`/
`{BETRIEB_PREIS}`/`{KOSTEN_MONAT}` = Geld (aus Angebot/Vertrag) · `{RISIKO_1..3}` = Risiken ·
`{SCHRITT_1..3}` = SA-To-do.
