# Klick-Beweis: App-Simulation "Cockpit — Vorschau" (app.html)

Datum: 2026-07-20 · Browser: Chrome (echt, via DevTools-Protokoll) · Datei: `kunden/finelli/demo/app.html`
Geprueft von: AB-Rechner, Session 20.07. · **Konsole am Ende: 0 Fehler, 0 Warnungen, 0 Issues.**

## Die Klicks (alle im echten Browser ausgefuehrt)

| # | Klick | Erwartet | Ergebnis |
|---|---|---|---|
| 1 | Pitch-Seite `index.html` → Link "Vorschau oeffnen" | app.html laedt | ✅ Login-Bildschirm (Beweis 1) |
| 2 | Falsche PIN `1111` eintippen | Ablehnung, kein Login | ✅ "PIN stimmt nicht — probier 2019.", nicht eingeloggt |
| 3 | PIN `2019` eintippen | Login | ✅ "Willkommen, Khawar", Uebersicht (Beweis 2) |
| 4 | Rote Ampel-Kachel "2 Leer" | Bestand gefiltert | ✅ Filter "Leer": Hoodie Classic + Jacke Coach |
| 5 | Hoodie Classic antippen | Groessen-Matrix beider Standorte | ✅ M-Zeile Zuerich 0 / Embrach 4, roter Umlagerungs-Banner (Beweis 3) |
| 6 | Banner "Umlagern" → Menge 2 → bestaetigen | Bestand wandert | ✅ M: 0/4 → 2/2, Ampel "Leer"→"Knapp", Banner weg, Toast (Beweis 4) |
| 7 | Korrektur ohne Grund speichern | Pflichtfeld blockt | ✅ "Bitte Grund waehlen — jede Aenderung ist nachvollziehbar." |
| 8 | Korrektur S auf 7, Grund "Zaehl-Fehler" | Bestand + Journal | ✅ S: 8→7, Toast "Grund im Journal notiert" |
| 9 | Bestellungen → Pickzettel #7607 aufklappen | Lagerplaetze als Laufweg | ✅ EMB-B-03 + EMB-C-05 sichtbar (Beweis 5) |
| 10 | "#7607 als verpackt markieren" | Status wechselt | ✅ "Verpackt — bereit fuer die Post." |
| 11 | Scannen → "Artikel scannen" → Einbuchen | genau 1 Buchung | ✅ Tee Box-Logo M: Embrach 16→17 (Beweis 6) |
| 12 | Einbuchen DOPPELT druecken | trotzdem 1 Buchung | ✅ 16→17 (nicht 18), Toast "Doppelt gedrueckt — trotzdem genau 1x gebucht." |
| 13 | Schalter "Lager-WLAN ausgefallen" → Scan → Einbuchen | Warteschlange statt Buchung | ✅ Karte "Warteschlange — wird nachgereicht (1)", localStorage gefuellt (Beweis 7) |
| 14 | Schalter zurueck (WLAN da) | Auto-Sync, genau 1x | ✅ Embrach M 4→5, Warteschlange + localStorage leer, Toast "Synchronisiert — 1 Buchung angekommen." |
| 15 | Frag Finelli: Chip "Was ist knapp?" + getippt "Wo liegt der Hoodie?" | Antworten aus LIVE-Zahlen | ✅ beide korrekt inkl. Lagerplatz EMB-B-03 (Beweis 8) |
| 16 | KI-Vorschlag "uebernehmen" auf Uebersicht | Entwurf, KEINE Buchung | ✅ "Als Entwurf notiert — DU entscheidest", Journal-Eintrag |
| 17 | Wochen-Bericht + Auswertungen | Bericht in Laiensprache · Sperre ehrlich begruendet | ✅ "83 Stueck verkauft" · "Kommt spaeter — mit Absicht." |
| 18 | Abmelden | zurueck zum Login, Session weg | ✅ sessionStorage geloescht, Login sichtbar |

Beispieldaten sind am KALENDERTAG verankert (DOY-Formel, kein random): 20.07. ergibt deterministisch
14 Verkaeufe heute / 83 Stueck Woche / Bestellnummern ab #7607 — morgen andere Zahlen, gleicher Tag gleiche Zahlen.

## Waehrend des Beweises gefunden und BEHOBEN (danach erneut geprueft)

1. **Anzeige-Bug Scannen:** Nach "Einbuchen" zeigte die Bestaetigung den NAECHSTEN Scan-Artikel statt
   des gebuchten (gebucht wurde korrekt — nur die Anzeige war falsch). Fix in `rScan()`, Klick 11 danach gruen.
2. **Grammatik:** "1 Buchungen angekommen" → jetzt Einzahl/Mehrzahl korrekt.
3. **A11y:** Suchfeld + Chat-Eingabe hatten kein Label (Konsolen-Issue) → `aria-label` ergaenzt, Konsole jetzt leer.
4. **Umlaut-Regel:** app.html hatte ASCII-Umlaute (ae/ue) im Kunden-sichtbaren Text — Workspace-Regel
   verlangt echte Umlaute in Kunden-HTML. Alle sichtbaren Texte umgestellt (Code/IDs unberuehrt).
5. **Pfad-Drift:** app.html lag im falschen Repo (`finelli-lagerverwaltung/`, Wurzel) — verschoben nach
   `ai-firma/kunden/finelli/demo/` (dorthin zeigt der relative Link der Pitch-Seite).

## Vorfuehr-Drehbuch fuer den Termin (Khawar klickt SELBST)

1. Pitch-Seite bis unten → "Und so sieht die App bei dir aus" → er oeffnet SEINE App.
2. PIN 2019 (Hinweis steht auf dem Login) — "PIN pro Mitarbeiter, jeder Klick zuordenbar."
3. Rote Kachel druecken → Hoodie → Umlagern: "Zuerich leer? Zwei Klicks, Embrach hilft aus."
4. Scannen: einmal normal, dann WLAN-Schalter kippen — "auch wenn dein Lager-WLAN zickt, verliert er nichts."
5. Frag Finelli: "Wo liegt der Hoodie?" tippen lassen.
6. Auswertungen antippen lassen → die ehrliche Sperre wirkt staerker als jedes Versprechen.
7. Zurueck zur Pitch-Seite → die 7 Fragen ausfuellen.

## Bildschirm-Beweise

`klick-beweis-app-1-login.png` … `klick-beweis-app-8-frag-finelli.png` (in diesem Ordner).
