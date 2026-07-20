# Praesentations-Vorlage der ai-firma — Anleitung fuer Claude (und Menschen)

> Angelegt 2026-07-20 (AB-Auftrag: Finelli-Ueberzeugungs-Deck + generalisierte Vorlage).
> REGEL: Diese Anleitung wird bei JEDER Aenderung an Vorlage/Generator FORTGESCHRIEBEN
> (Changelog unten). Erst hier lesen, DANN bauen — nie ein Kunden-Deck von Null anfangen.

## Was hier liegt

| Datei | Zweck |
|---|---|
| `baue_praesentation.py` | Generator: `python vorlagen/praesentation/baue_praesentation.py <konfig.json> <ziel.pptx>` — IMMER aus der Repo-Wurzel (`ai-firma/`) aufrufen, Bild-Pfade in Konfigs sind repo-relativ. Braucht `pip install python-pptx`. |
| `konfig-vorlage.json` | Generalisierte Konfig mit `{PLATZHALTERN}` — kopieren nach `kunden/<kunde>/praesentation/konfig-<kunde>.json` und ausfuellen. |
| `vorlage-kunden-praesentation.pptx` | Gebautes Muster-Deck aus der Vorlage-Konfig (zum Anschauen, nicht von Hand editieren — Quelle ist immer die Konfig). |

## Folien-Dramaturgie V2 (fest im Generator, Reihenfolge nicht wuerfeln)

1. **Titel** (dunkel) → 2. **Momente** (3 Schmerz-Karten + Statistik-Band mit Balken, nur belegte
Zahl) → 3. **Drei Zusagen** → 4. **Business-Folie** (8 Abteilungs-Kacheln vs. "ein System") →
5. **OS-Flow** (Deine Systeme → OPERATING SYSTEM → Deine Menschen) → 6.-8. **gezeichnete
Handy-Mockups** (Typen: uebersicht / scan / chat; KEINE Screenshots) → 9. **Einfuehrung**
(Chevron-Pfeile) → 10. **Modell-Treppe** (klein/mittel/gross, Stile hell/akzent/dunkel+gold) →
11.-13. **je Modell 1 Klartext-Folie** → 14. **Wer macht was** → 15. **Abschluss** (dunkel).

## Stil-Regeln V2 (AB-Feedback 20.07, verbindlich)

- **KEINE Gedankenstriche** in Folien-Texten. Kurze Saetze, Punkt statt Einschub. Trenner "·".
- **Direkte Sprache, kein Kitsch** (nicht "wenn das WLAN zickt", sondern "Ohne WLAN wartet die
  Buchung").
- **`**fett**`-Marker** in jedem Konfig-Text moeglich; den Kern jedes Satzes fetten.
- **Keine Schatten**, flache Flaechen, viel Weissraum, wenig Text, mehr Diagramme.
- **Mockups zeichnen statt Screenshots** kleben (Funktion `phone()` im Generator; neue
  Screen-Typen dort ergaenzen, nicht pro Kunde hacken).

## Harte Regeln beim Ausfuellen einer Kunden-Konfig

1. **Kunden-sichtbarer Text = echte Umlaute + Schweizer ss** (nie Eszett). Diese Anleitung selbst
   ist intern → ae/oe/ue.
2. **Preise kommen NUR von SA/AB** (Auftrag, Screenshot, Angebot) — nie erfinden, nie senken,
   Summen nie als "Marktwert". Fusszeile verweist auf den Vertrag.
3. **Zahlen/Belege nur LIVE geprueft** in die momente-Fusszeile, sonst Zeile leer lassen.
4. **UI-Screens nehmen, nicht malen:** Screenshots aus `kunden/<kunde>/demo/` (Klick-Beweis-PNGs
   der lauffaehigen Demo). Gibt es noch keine Demo, `"pfad": null` lassen → der Generator baut
   einen sauberen Platzhalter-Rahmen.
5. **Laiensprache-Pflicht:** jedes Feature bekommt einen `klartext`-Satz (Was hat der Kunde
   davon?). Kein Fachwort ohne Uebersetzung (KPI → "Zahlen", Dashboard → "Uebersicht").
6. **Nichts versprechen, was der Vertrag nicht hergibt** (Widerspruchs-Verbot, Finelli-Lektion
   19.07). Garantien gehoeren ins Angebot/Vertrag, nicht in Folien.
7. Farben pro Kunde nur ueber `farben` tauschen (Akzent = Markenfarbe des Kunden); Layout nie
   pro Kunde verbiegen — wenn das Layout klemmt, den GENERATOR verbessern (gilt dann fuer alle).

## Ablage-Konvention

- Kunden-Konfig + fertiges Deck: `kunden/<kunde>/praesentation/` (Deck: `<kunde>-praesentation-JJJJ-MM-TT.pptx`).
- Verallgemeinerbare Verbesserungen SOFORT hier zurueckspielen (Generator/Vorlage/diese Anleitung)
  und im Changelog notieren — das ist das Sync-Gesetz des Workspace in klein.

## Changelog (immer ergaenzen: Datum · was · warum)

- 2026-07-20 · V1: Generator + Vorlage-Konfig + Finelli-Erstanwendung (3 Modelle Basic/Premium/Max
  ab User-Screenshot, UI-Screens aus der Cockpit-Vorschau-Demo). Warum: Finelli-Termin 22.07,
  Decks sollen nie wieder von Null entstehen.
- 2026-07-20 · V2 nach AB-Feedback: gezeichnete Handy-Mockups statt Screenshots, Business-Folie
  (Abteilungen vs. ein System, ohne fremde $-Zahlen), OS-Flow-Diagramm, Statistik-Band mit Balken,
  Modell-Treppe klein/mittel/gross (hell/akzent/dunkel+gold), Chevron-Einfuehrung, `**fett**`-Marker,
  keine Gedankenstriche, keine Schatten, direkte Sprache. Konfig-Schema: `ui_screens` ersetzt durch
  `mockups`, neu `momente.stat`, `abteilungen`, `os_flow`, Modell-Felder `stufe/stil/kurz`.
