# Finelli — Dashboard-Idee (Bau-Auftrag an Abdul)

> Von SA, 23.07.2026 (vor Ort mit Khawar/Lager). **Auf Bestehendes aufsetzen, nicht neu bauen:**
> die Marktanalyse-Lagerkarte (22.07) und finadmin rechnen das Meiste schon.

## Ziel in einem Satz

Ein KPI-Dashboard, das auf einen Blick zeigt: **was läuft, was liegt, wo wird's knapp** — plus **wie das Lager aussieht**.

## Die Bausteine

| # | Baustein | Was es tut |
|---|---|---|
| 1 | **Zeitfenster-Schalter** | Umschalten **7 / 30 / 90 Tage / 1 Jahr** — alle Zahlen richten sich danach |
| 2 | **Top-Artikel** | die meistverkauften im gewählten Zeitfenster (Renner) |
| 3 | **Flop / Ladenhüter** | wenig/gar nicht verkauft im Zeitfenster, mit Saison-Kennzeichen (nicht mit totem Bestand verwechseln) |
| 4 | **Größen-Aufschlüsselung pro Artikel** | im Artikel **alle Größen mit Bestand** sehen (Bsp: M 40, S 2) |
| 5 | **Leer / bald leer** | Warnung für Artikel **und einzelne Größen**, die leer oder knapp sind |
| 6 | **Manueller Eingabe-Knopf** | Bestand von Hand reinschreiben/korrigieren |
| 7 | **Lager-Ansicht** | zeigt den Lager-Grundriss / die Belegung (aus der bestehenden Lagerkarte) |
| 8 | **Offene Orders** | wie viele Bestellungen offen (noch nicht verschickt) sind |
| 9 | **Orders heute** | wie viele Bestellungen heute reingekommen sind |
| 10 | **Nicht erfüllbar — mit Grund** | Orders, die gerade nicht gepackt werden können, mit Grund: (a) Ware liegt in **Embrach** statt im Laden → umlagern; (b) Ware ist **nicht produziert** → nachbestellen |

## Der Kern-Gedanke bei Baustein 4 (SA)

Wenn man **alle Größen pro Artikel** sieht (z.B. **40× M, nur 2× S**), erkennt Khawar das Ungleichgewicht sofort — und kann **gezielt vermarkten**: die Größe mit Überhang bewusst bewerben/bundeln, um sie rauszubekommen. Darum: **das Dashboard soll bei starkem Größen-Überhang einen Hinweis geben** („viel M — gezielt bewerben").

## Der wertvollste Teil: nicht-erfüllbare Orders (10)

Das macht den **Killer-Schmerz sichtbar** — Kunde kauft Ware, die fehlt, und wartet 14–35 Tage. Das Dashboard trennt zwei Gründe:
- **In Embrach statt Laden** → lösbar per Umlagern (welcher Standort was hat, kennt Shopify).
- **Nicht produziert** → Nachbestellung nötig; dieser Status muss gepflegt werden (Hand-Markierung oder aus der Bestell-Funktion) — Shopify weiß das nicht von allein.

## Warum der manuelle Knopf (6) Pflicht ist

Der Shopify-Bestand ist heute nur **~50 % verlässlich**. Ohne Hand-Korrektur zeigt „leer / bald leer" Unsinn. Der Eingabe-Knopf überbrückt das, **bis Kasse + eine Voll-Inventur laufen**.

## Schon vorhanden (bitte wiederverwenden, nicht doppeln)

- **Marktanalyse-Lagerkarte** (`2026-07-22-marktanalyse-lagerkarte.html`): rechnet Top/Flop/Saison + Größen-Verteilung 7/30/90 Tage schon.
- **finadmin**: kennt Fach + Größen-Ebenen pro Artikel.
- **KI-Mitarbeiter-Bauplan** (`2026-07-21-bauplan-ki-mitarbeiter.md`): Ampeln (Umsatz, Lager-Gesundheit) + „bald-leer"-Meldebestand-Alarm sind schon spezifiziert.

## Offen (Abdul: vor dem Bau kurz mit SA klären)

1. **Bestands-Quelle:** Shopify-Schlüssel (fehlt noch) — oder starten wir mit **manueller Eingabe zuerst**?
2. **Wo lebt das Dashboard:** eigene Seite im Cockpit, oder in finadmin/SEA?
3. Jahr-Fenster (1 Jahr) braucht Daten > 60 Tage — Shopify-API liefert der App nur ~60 Tage; also aus gespeichertem Export/eigener DB ziehen.
