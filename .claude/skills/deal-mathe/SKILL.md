---
name: deal-mathe
description: Rechnet den Kunden-Deal FRISCH aus dem Playbook aus — Wert-Ranking (Hormozi-Gleichung), Deal-Bausteine (0 vorab, Selbstkosten auf 24 Raten, Betrieb/Mt, 48h-Garantie, Kunden-Joker, Quartals-Tor, Abnahme-Liste), Preis-Mathe-Falle-Schutz und Budget-Vorab-Rechnung. Triggert via /deal-mathe oder Phrasen "deal rechnen", "was kostet das", "preis fuer {kunde}", "wert-ranking", "angebots-mathe", "raten rechnen".
---

# /deal-mathe — den Deal frisch ausrechnen (Playbook Phase 2)

## Wurzel — WARUM frisch rechnen
Der Finelli-Deal drehte sich **3x in 24 Stunden**. Ein Chat, der aus altem
Chat-Wissen "den Preis von gestern" nimmt, rechnet garantiert eine ueberholte
Version. **Regel: dieser Skill liest bei JEDEM Lauf frisch aus**
`C:/dev/ai-firma/playbook/` (Phase 2) + Memory `sa-angebots-doktrin-verkauf` —
nie aus dem Gedaechtnis, nie aus einem alten PDF.

## Schritt 1 — Wert-Ranking (Hormozi-Gleichung)
Fuer JEDEN Baustein, den der Kunde bekommen koennte:

> **Wert = Traum-Ergebnis × Erfolgs-Wahrscheinlichkeit / (Wartezeit × Kunden-Aufwand)**

Tabelle bauen, nach Wert absteigend sortieren:
| Baustein | Traum-Ergebnis (CHF-Wirkung, grob) | Wartezeit bis spuerbar | Kunden-Aufwand | Unser Bau | Wert 1-10 |
|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... |

- CHF-Wirkungen ehrlich als Schaetzung markieren, wenn keine Kunden-Zahlen da sind.
- Was hohe Wartezeit ODER hohen Kunden-Aufwand hat, faellt im Ranking — der Nenner
  frisst den Zaehler (Beispiel: reine Analyse-Bausteine landen hinten, weil sie
  erst mit sauberen Daten die Wahrheit sagen).

## Schritt 2 — Deal-Bausteine (immer diese 7)
| # | Baustein | Regel |
|---|---|---|
| 1 | **0 vorab** | Kunde zahlt nichts im Voraus — senkt die Hemmschwelle komplett. |
| 2 | **Selbstkosten auf 24 Raten** | Bau-Selbstkosten / 24 = `{PREIS_RATE}`/Monat. Kein Agentur-Aufschlag auf die Rate. |
| 3 | **Betrieb/Mt** | Laufende Kosten (Cloud, Wartung, Betreuung) als eigene Zeile `{BETRIEB}`/Monat. |
| 4 | **48h-Garantie** | Was nicht in 48h behoben ist → dieser Monat kostet nichts. Nimmt dem Kunden das Risiko. |
| 5 | **Kunden-Joker 50%** | Bringt der Kunde einen zahlenden Kunden → 50% Rabatt (Baustein schriftlich festhalten, sonst verpufft er). |
| 6 | **Quartals-Tor** | Alle 3 Monate Ueberpruefung/Kuendigungsfenster — Kunde sitzt nie in der Falle, wir muessen jedes Quartal Wert zeigen. |
| 7 | **Abnahme-Liste** | 10 Punkte / 14 Tage, **WIR bringen sie mit** (aus `vorlagen/vertrag/`). |

## Schritt 3 — Preis-Mathe-Falle (KRITISCH)
`{PREIS_RATE}` × `{LAUFZEIT}` = eine Summenzeile. Der Kunde rechnet das im Kopf nach.
- **Die Summenzeile NIEMALS "Marktwert" nennen.** Sie heisst **"Dein Preis —
  Selbstkosten"**.
- Der Agentur-Anker (was eine Agentur nehmen wuerde, 30'000+) steht SEPARAT als
  Vergleich — nie als Summe der Raten getarnt.
- Grund: Wird die Ratensumme als "Marktwert" verkauft, entlarvt die Kopf-Rechnung
  des Kunden den Aufschlag und die ganze Ehrlichkeit ist weg.

## Schritt 4 — Budget-Vorab-Rechnung
Vor dem Termin grob rechnen, ob der Deal unter den Kunden-Deckel passt.

**Muster GzF (belegt):**
```
Bau ~12'000 / 24 Raten   = 500/Mt
Betrieb                  = ~200/Mt
--------------------------------
Total                    = ~700/Mt   (unter dem 850er-Deckel)
```
Fuer {KUNDE}: Bau-Selbstkosten schaetzen → /24 → + Betrieb → gegen den
Kunden-Deckel halten. Passt es nicht: Laufzeit strecken oder Bau-Umfang senken —
**NIE die Preis-Ehrlichkeit opfern.**

## Ausgabe (Deal-Blatt)
```
DEAL {KUNDE} (frisch aus Playbook, Stand {DATUM})
Wert-Ranking: {Top 3 Bausteine mit Wert}
Rate:    {PREIS_RATE}/Mt (Selbstkosten / 24)
Betrieb: {BETRIEB}/Mt
Total:   {SUMME}/Mt  ← "Dein Preis — Selbstkosten" (Deckel: {DECKEL})
Schutz:  0 vorab · 48h-Garantie · Kunden-Joker 50% · Quartals-Tor · Abnahme-Liste
Anker:   Agentur ~30'000+ (separat, NICHT als Ratensumme)
```

## Verbote
- Preise aus altem Chat/Gedaechtnis/PDF uebernehmen — immer frisch aus dem Playbook.
- Ratensumme als "Marktwert" ausweisen.
- Preis senken statt Zeit strecken (Preis-Ehrlichkeit bleibt).
