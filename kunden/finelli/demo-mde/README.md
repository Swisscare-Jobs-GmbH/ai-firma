# Finelli — 2 MDE/POS-Demos: Lager Embrach + Laden Zuerich

> Erstellt 2026-07-21 (Opus 4.8) auf AB-Auftrag: 2 selbsttragende UI-Demos zum Rumspielen, damit
> Khawar entscheidet, **wo der Rollout startet** — Gross-Lager (Embrach) oder Laden (Zuerich).
> Gehoert zu: [Lager-Layout-Rollen-Spec 21.07](../2026-07-21-lager-layout-rollen-spec.md) ·
> [Hebel-Logistik 21.07](../2026-07-21-hebel-logistik.md) · [Schmerz-Landkarte](../2026-07-18-finelli-schmerz-landkarte.md) ·
> [Ausbau-Plan](../2026-07-18-finelli-ausbau-plan.md). Schwester-Demos: [../demo/](../demo/) (Verkaufs-Cockpit),
> [../ki-mitarbeiter-prototyp/](../ki-mitarbeiter-prototyp/) (3 KI-Mitarbeiter, Port 8030).

## Was das ist

Zwei **selbsttragende HTML-Seiten** (Doppelklick, kein Server, kein Internet) im Look eines
**MDE/POS-Terminals** (Handscanner bzw. Kassen-Tablet) — auf dem Desktop mit Geraete-Rahmen, am
Handy Vollbild. Khawar klickt selbst durch und sieht, wie Scan + Fach-Ordnung + Automatik seinen
Lager-Flow vereinfachen. **Beweis statt Versprechen.**

## Oeffnen

Doppelklick auf **`index.html`** (Startseite „Wo starten wir?") → von dort in die 2 Demos.
Oder direkt: `lager-embrach.html` / `laden-zuerich.html`. Jeder Browser, keine Installation.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Startseite: rahmt die Entscheidung Embrach vs. Laden, verlinkt beide Demos. |
| `lager-embrach.html` | **Demo A — Lager (Handscanner-Terminal).** 4 Tabs: **Wareneingang** (scannen → Fach-Vorschlag → einbuchen, mit Offline-Warteschlange), **Packstation** (offene Pack-Auftraege, Pickliste mit Farbpunkt+fetter Groesse+Fach, 2D-Karte mit leuchtenden Faechern, Start/Fertig-Timer = Tempo-Messung), **Lager-Karte** (4 Zonen P/S/W/L + Fach-Beschriftung mit Groessen-Farben), **Nachschub** (Empfehlungen: nachbestellen / Online-Renner holen / umlagern / letzte Stuecke + Mitnahme-Liste). |
| `laden-zuerich.html` | **Demo B — Laden (POS/Tablet-Terminal).** 4 Tabs: **Kasse** (Warenkorb → „Verkauf abschliessen" bucht Front-Bestand automatisch ab = Schluss mit Phantom-Ware; Zahlung via SumUp), **Groesse finden** (scannen → wo liegt welche Groesse ueber Front/Reserve/UG/Embrach + Fach; fehlt sie → Hinweis oder Online-Order), **Online-Order aufnehmen** (Kunde nicht verlieren → wird Pack-Auftrag in Embrach), **Umtausch** (sauber zurueckbuchen; Defekt geht zur Pruefung). |

## Harte Regeln dieser Demos (aus CLAUDE.md + Demo-Prinzip)

- **Uebungs-Modus, nur Beispieldaten** — kalendertag-verankert (friert nie ein), keine echten
  Finelli-Zahlen, keine Endkunden-Daten, **keine Preise/Geld** (Zahlung laeuft ueber SumUp).
- **KI/Automatik empfiehlt nur, bucht nie selbst** — Khawar bleibt der Boss; Empfehlungen sind
  Vorschlaege, ein Mensch entscheidet.
- **Ehrlich, nicht ueberversprechen** — der grosse Hebel (Kasse ↔ Logistik verbinden) ist Arbeit,
  95-99 % Genauigkeit (nicht 100 %), Rest per Inventur.
- **Echte Umlaute** (kundensichtbar), Schweizer „ss", nie Eszett.
- **Groessen-Farben** = Lager-Layout-Spec 21.07 (XS violett · S gruen · M blau · L gelb · XL rot ·
  XXL/One grau). Bewusst **abweichend** von der aelteren `../demo/app.html`-Legende — der 21.07-Spec
  ist die autoritative Vision. Ist ein **Vorschlag**; Khawar darf ihn am Termin umaendern.

## Verankerung im Plan (welche Schmerzen/Hebel die Demos zeigen)

- **Lager-Demo** zeigt Logistik-Hebel 2 (Wareneingang erfassen), 4 (Renner holen), 5 (letzte
  Stuecke), 6 (gezielt umlagern) + das Lager-Layout (4 Orte, Faecher, Rolle Packer/Logistik).
- **Laden-Demo** zeigt den Killer-Schmerz 5b (Kasse bucht ab → keine Phantom-Ware), Schmerz 6
  (Groesse in 5 Sek. finden) und Hebel 7 (Kunde nicht verlieren via Online-Order) + Umtausch.

## Abnahme-Beweis (Stand 2026-07-21)

- **JS-Syntax** beider Demos: OK (`node --check`).
- **Runtime-Sandbox** (DOM-Stub, jede Ansicht + Kern-Interaktion aufgerufen): alle Pfade
  fehlerfrei — Lager 19/19, Laden 9/9 (die 7 anfaenglichen „Fehler" waren Stub-Artefakte leerer
  Select-Werte, mit gueltiger ID sauber).
- **Offen (kein Live-Klick moeglich):** Die Chrome-Extension war in dieser Session nicht verbunden,
  darum kein Screenshot-Klickbeweis. **Vor dem Termin einmal selbst durchklicken** (Drehbuch unten)
  und je 1 Screenshot pro Demo ablegen.

## Vorfuehr-Drehbuch (Termin 22.07)

1. `index.html` oeffnen → „Beides gehoert zusammen, Frage ist womit wir starten."
2. **Lager:** scannen → Fach-Vorschlag → einbuchen · WLAN-Schalter → Warteschlange · Packstation:
   Auftrag → Karte leuchtet → Start/Fertig · Nachschub: Mitnahme-Liste.
3. **Laden:** Artikel in den Warenkorb → „Verkauf abschliessen" → „Bestand stimmt sofort" ·
   „Groesse finden": Heavy Tee M → nur in Embrach → „Online-Order aufnehmen".
4. Khawar fragen: **Wo drueckt es am meisten — Lager oder Laden?** → das wird der Startpunkt.
