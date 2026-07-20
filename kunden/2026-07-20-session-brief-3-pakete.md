# Session-Brief: 3-Pakete-Architektur Finelli + GzF (fuer die 4.8-Bau-Session)

> SA-Planaenderung 20.07 abend: Beide Kunden bekommen dieselbe Verkaufs-Architektur — **3 Pakete**,
> damit wir sehen, worauf der Kunde anspringt. Vorbereitet von Fabel 5 (3 Denker parallel + Skeptiker),
> gebaut wird mit Opus 4.8. Quellen: kunden/finelli/* · kunden/gzf/* · Playbook V2
> (`erst-offerte-prozess.md`, Commit 46582e3) · Denker-Lauf 20.07.

## Ziel der Session

1. **Finelli:** Einlege-Blatt „Deine 3 Wege" fuer Mi 22.07 (Mappe bleibt Herzstueck = Paket 1).
2. **GzF:** Mappe v2 fertig drucken (Umbau-WIP liegt committet) + Paket-Treppe festzurren.
3. P2/P3-Preise durch `/deal-mathe` + Richter-Panel, BEVOR ein Kunde sie sieht.

## Was FIX ist (nicht neu verhandeln)

| Kanon | Finelli | GzF |
|---|---|---|
| P1-Deal (unantastbar) | 18'000 = 24×750 + 500 Betrieb = **1'250/Mt** | 10'800 = 24×450 + 200 Betrieb = **650/Mt** |
| Regeln | Preis nie senken, nur Zeit · „Startkunden-Preis" (nie Marktwert/Selbstkosten) · Geschenk sichtbar · Joker-Wahl 10%/20% · Story-Seite ohne Deal-Franken · Exit ohne Angst | gleich |
| Termin | **Mi 22.07, 10:00** — Demo, er klickt selbst | offen (ohne Eile) |

## Paket-Schnitt FINELLI (Denker 1)

| Paket | Name | Inhalt | Preis (VORSCHLAG, ausser P1) |
|---|---|---|---|
| P1 | **Lager im Griff** | = gedruckte Mappe (Logistik-Kern, Etiketten+Kasse, KI-Paket, Schulung, Einricht-Woche geschenkt) | 1'250/Mt (KANON) |
| P2 | **Schaufenster** | KI-Webseite (misst jeden Klick, Bestand live) + Drop-Helfer (Foto→fertiger Eintrag) | +9'000 → 36×750, Betrieb 600 → **1'350/Mt** |
| P3 | **Kunden-Radar** | Kunden-/Lager-Radar (wer/was/wo aus Online+Kasse) + Content-Radar (sein eigener Wunsch!) + Verkaeufer-Empfehlung am Tablet | +9'000 → 48×750, Betrieb 700 → **1'450/Mt** |

- **Upgrade-Pfad ist technisch zwingend:** ohne P1-Bestand zeigt die P2-Webseite Falsch-Verfuegbarkeit, ohne P2-Daten ist der P3-Radar blind. „Du faengst nie wieder bei null an."
- **Mittwoch: Option A (Empfehlung der Denker):** Mappe + Demo wie geplant; am Schluss EIN Einlege-Blatt „Deine 3 Wege" — P2/P3 nur Name + „Dein Plus (Schaetzung)", **KEINE Franken-Zahlen** (Skeptiker-Regel: kein improvisierter Preis neben dem Gedruckten). Option B (Pakete als Eroeffnung) nur wenn SA den Anker-Effekt will — Risiko: Abschluss streut.

## Paket-Schnitt GZF (Denker 2)

| Paket | Name | Inhalt | Preis (VORSCHLAG, ausser P1) |
|---|---|---|---|
| P1 | **Eure Kunden kommen wieder** | = Mappe v2 (Kartei, 2-Min-Eintrag, Mail-Strecke 6/12 Mt, Bewertungs-Bitte) — UNVERAENDERT | 650/Mt (KANON) |
| P2 | **Euer Auftritt + volle Termine** | Neue Website (sein Wunsch) + Termin-Erinnerung + Monats-Blatt (als sichtbares Geschenk) | ~900/Mt · Unter-Deckel-Variante nur Website: 800 |
| P3 | **Euer Konzept, komplett** | Bestandskunden-Erwecker (1000 aus GP Manager) + Zuweiser-Quartals-Bericht + volle Auswertungen + KK/IV-Strecke | ~1'250/Mt |

- **Deckel-Treppe statt Preis-Senkung:** P2/P3-Raten koennen starten, wenn P1-Raten auslaufen (ab Monat 25 sind 450 frei) — Monatslast bleibt nah an 850, Gesamtpreis unangetastet.
- **Leverage-Einbauten in P1 (beim BAU einplanen — machen P2/P3 zwingend):** sichtbarer Adress-Zaehler mit ausgegrautem „1000 im GP Manager, noch unerreichbar" · Zuweiser-Feld ab Tag 1 · Produkt-Typ-Feld (beantwortet offene Frage 1 nebenbei) · 90-Tage-Zahlen-Termin als Ausbau-Moment · Klick-/Buchungs-Zaehlung pro Mail · No-Show-Haekchen · Import idempotent vorbereiten.
- **Vater-Formulierung (Handwerker-Bild):** „Ihr muesst heute nicht das ganze Haus bestellen. Schritt eins ist das Fundament — die Kartei, die eure Kunden zurueckholt. Ob Stockwerk zwei und drei kommen, entscheidet ihr, wenn ihr die ersten Zahlen schwarz auf weiss gesehen habt."
- **Deckel-Ehrlichkeit:** Die 850 sind SAs Zahl, der Kunde sagte nur „lieber monatlich" — **nie als sein Budget zitieren.** Voll-CRM fuer 850 ginge nur unter Selbstkosten → Reihenfolge-Frame: „Stufe 2 bauen wir, sobald Stufe 1 das Geld dafuer reingeholt hat."

## ROTE LINIEN (Skeptiker — gilt fuer die ganze Session)

1. 🔴 **„Wo gegriffen"-Tracking im Laden:** Amazon-Go-Klasse-Technik (Kamera-KI/Regal-Sensorik), mit unserem Stack NICHT baubar. nDSG: personenbezogenes Laden-Profiling praktisch tot; **Alter/Herkunft per Kamera schaetzen = NIE** (besonders schuetzenswert); Sicherheits-Kameras fuers Marketing = NIE. **Verkaufbare ehrliche Variante:** Online+Kassen-Kaufdaten + Verkaeufer tippt Beobachtung am Tablet + anonyme Zonen-Zaehlung. (Quellen im Denker-Protokoll.)
2. 🔴 **Preis-Fallen:** P1 nie als „kleinste Variante" rahmen (oeffnet „gibt's was Kleineres?") · keine 3 Franken-Zahlen als Zettel neben der gedruckten Mappe · P3 nur mit lieferbarem Inhalt bepreisen · Finelli-Preise nie in GzF-Unterlagen spiegeln (Daten-Wand).
3. 🔴 **Zeit bis Mi:** Engpass ist die Demo-Haertung (laeuft in der Finelli-Session), nicht die Pakete. Diese Session baut nur das Einlege-Blatt — kein Mappen-Neudruck fuer Finelli.
4. 🟡 **Offene Vorbedingung:** Laeuft Finellis Ladenkasse ueber Shopify POS? Unbelegt — auf die Mittwoch-Fragenliste, vorher nichts zu Laden-Daten versprechen.

## Offene SA-Entscheide (in der Session abholen)

A) Mittwoch: Einlege-Blatt (Option A, Empfehlung) oder Pakete als Eroeffnung (B)?
B) GzF Testimonial-Bonus (Video nach 90 Tagen = 1 Rate geschenkt) in die Mappe: ja/nein?
C) P2/P3-Preisvorschlaege absegnen (erst nach /deal-mathe + Panel).

## Arbeits-Reihenfolge fuer die 4.8-Session

1. Finelli Einlege-Blatt „Deine 3 Wege" (HTML im Mappen-Stil, ohne P2/P3-Preise) → drucken → Panel-Kurzcheck.
2. GzF Mappe v2: Umbau-WIP (Fluss-Bild, committet auf `feat/gzf-angebot-mappe-v2-2026-07-20`) drucken + Guards + Sichtpruefung → PDF nach Downloads.
3. `/deal-mathe` fuer P2/P3 beider Kunden → Richter-Panel → dann erst Preis-Blaetter.
4. GzF-Vertrag + Finelli-Vertrag an Paket-Logik angleichen (Vertrag deckt JEDES Blatt-Versprechen).
5. Alles committen + Draft-PR aktualisieren.
