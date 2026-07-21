# Finelli — Bauplan "3 KI-Mitarbeiter" (Research · KPI · Manager)

> Erstellt 2026-07-21 durch Fabel 5 (Plan) auf SA-Sprachauftrag vom 21.07. Methode: Repo-Kontext +
> Recherche-Schwarm (6 Agenten: Regel-Rahmen, Quellen-Whitelist, Report-Praxis, KPI-Methodik —
> Quellen und Formeln adversarial LIVE geprueft, Abrufdatum 21.07.2026) + Richter-Panel
> (3 Richter: Regel-Treue, Daten-Realismus, Opus-Baubarkeit — alle 12 Pflicht-Funde eingearbeitet).
> **Bau: Opus 4.8** nach den Etappen in Abschnitt 10.
> **Status (21.07): Prototyp E0-E4 als Mock GEBAUT** in `ki-mitarbeiter-prototyp/` — auf SA-Entscheid
> ([Gate-0-Ausnahme E5](../../brain/decisions/E5-finelli-ki-mitarbeiter-prototyp-vor-ja.md)) als Demo
> fuer Termin 22.07. Etappe E5 (Echtbetrieb: Shopify + Live-Research + POS-Regel) bleibt hinter dem Ja.
> Gehoert zu: [README](README.md) · [Ausbau-Plan V4 Analyse](2026-07-18-finelli-ausbau-plan.md) ·
> [Feinplan KI-Etappe](2026-07-18-finelli-feinplan.md) · [Branchen-Recherche](2026-07-19-branchen-recherche-markt-schmerzen.md)

## 1. Fazit

**Wir bauen 3 KI-Mitarbeiter fuer Finelli: einen Research-Spaeher (Branchen-Trends aus geprueften
Quellen), einen KPI-Experten (Verkaufs- und Bestell-Zahlen 7/30/90/365 Tage, ABC, Meldebestand) und
einen Manager (verbindet beides zu Berichten an den Co-Founder).** Der Workflow laeuft taeglich
(der Research-Teil woechentlich — bewusste Abweichung, Abschnitt 4); Bestell-Alarm nur bei echtem
Engpass, dazu Wochen- und Monatsbericht. Am Anfang EMPFIEHLT das System nur ("mit den Zahlen, die
ich habe, lese ich es so") — bestimmend wird es erst, wenn die Datenlage sauber ist. Die Zahlen
rechnet deterministischer Code, die KI interpretiert und schreibt — nie umgekehrt. **Gebaut wird
erst nach dem Finelli-Ja (Leitplanke "Verkauf vor Bau" — Gate 0 in Abschnitt 10); dieser Bauplan
ist die Vorbereitung, kein Baustart.**

---

## 2. Der Auftrag in Klartext (Reprompt von SAs Sprachnachricht, 21.07)

SAs Auftrag, sauber aufgeschrieben — das ist die Anforderungs-Quelle fuer diesen Bauplan:

1. **Baue 3 KI-Mitarbeiter** fuer unseren ersten Kunden (Finelli, Streetwear Zuerich):
2. **Mitarbeiter 1 — Research:** Recherchiert Markt, Branche und Nische des Kunden (Kleidung /
   Streetwear). Welche Trends kommen, welche Sachen werden weniger. **Sehr wichtig:** keine losen
   Quellen — nur Quellen, die legit und respektabel sind, sodass wir sie spaeter vor dem Klienten
   vertreten koennen.
3. **Mitarbeiter 2 — KPI-/Daten-Experte:** Schaut die Verkaufs- und Logistik-Daten an — letzte 7,
   30, 90 und 365 Tage, pro Artikel: wie verkauft er sich, welcher Hersteller, wie lange braucht
   die Nachproduktion, was sollte nachbestellt werden. Dafuer muessen alte Daten erst gefuettert
   und neue Daten sauber eingebaut werden.
4. **Mitarbeiter 3 — Manager:** Verlinkt beide. Wenn das System Nachbestellen empfiehlt, schickt er
   dem Co-Founder einen fertigen Bericht: Artikel + Verkaufszahlen (7/30/90/365), ABC-Kategorie,
   Trend-Einschaetzung aus dem Research, und die Empfehlung nachbestellen ODER langsam aus dem
   Sortiment nehmen. Er baut auch die Wochen- und Monatsberichte und recherchiert, wie ein guter
   Bericht fuer einen Co-Founder/CEO aussehen soll.
5. **Ton-Stufen:** Am Anfang nur empfehlen, nicht "hardcore" — ehrlich sagen "das sind die Zahlen,
   so lese ich sie", weil wir anfangs vieles noch nicht richtig tracken oder zu wenig Daten haben.
   Spaeter, mit sauberer Datenlage, darf das System bestimmt sagen "das behalten wir, das nicht".
6. **Takt:** Der ganze Workflow laeuft taeglich einmal. Output nur, wenn Ware zu wenig ist — plus
   woechentlich und monatlich Bericht (welcher Tag: mit dem Co-Founder festlegen).
7. **Weiterentwicklung:** Spaeter setzt sich der Co-Founder in eine Session mit Claude (wie bei
   SwissCareJobs) und verbessert die Workflows mit mehr Kontext. Jetzt braucht es erst mal die
   solide Grund-Version.

---

## 3. Harte Leitplanken (nicht verhandelbar — je mit Quelle)

| # | Leitplanke | Quelle | Folge fuer den Bau |
|---|---|---|---|
| G1 | **Verkauf vor Bau:** Deal-Stand Finelli ist 🟡 (Angebot V6 ueberreicht 19.07, Termin 22.07). "Kein Bau auf Verdacht." | CLAUDE.md Leitplanke 1 · kunden/UEBERSICHT.md | **Gate 0 steht VOR Etappe E0:** kein Bau der 3 Mitarbeiter (auch nicht im Mock) vor dem Finelli-Ja. Die Demo fuer den Termin 22.07 existiert bereits (Cockpit V1 + demo/) — dafuer braucht es diesen Bau nicht. Ausnahme nur als dokumentierter SA-Entscheid in brain/decisions/. |
| G2 | **Shopify = alleinige Bestandswahrheit. Keine KI bucht Bestand.** | brain/_cross-ref/FINELLI-LAGERVERWALTUNG.md | Alle 3 Mitarbeiter sind read-only. Keine Auto-Bestellung, keine Bestands-Korrektur durch KI. Empfehlung → Mensch klickt in Shopify. |
| G3 | **Zahlen rechnet Code, nicht das Sprachmodell.** | Ableitung aus G2 + Fakten-Live-Regel | KPI-Rechenkern = deterministischer, getesteter Code. Code rendert ALLE Zahlen in die Berichte (Abschnitt 7); die KI liefert nur Text-Bausteine und erfindet nie Zahlen. |
| G4 | **Fakten-Live-Regel:** jede Marktzahl mit Quelle + Abrufdatum oder "weiss nicht" | CLAUDE.md · Vorfaelle 41-Bewertungen/Jelmoli | Research-Mitarbeiter zitiert NUR von der Quellen-Whitelist (Abschnitt 5), mit URL + Datum. Automatischer Quellen-Check vor jedem Bericht-Versand. |
| G5 | **Kein `.github/workflows/`** | CLAUDE.md GitHub-Minuten-Regel | Taeglicher Lauf ueber lokalen Scheduler (Abschnitt 9), nie ueber GitHub Actions. |
| G6 | **Kunden-Team macht Handarbeit — wir leiten an** | CLAUDE.md Regel 3 | Stammdaten (Lieferzeiten, MOQ, EK-Preise), Inventur und Zaehlungen macht Finellis Team nach unserer Anleitung. Berichte empfehlen ("euer Team soll X"), versprechen nie unsere Handarbeit. |
| G7 | **Modell-Regel:** Denken = Fabel 5, Bauen/Schreiben = Opus 4.8 | CLAUDE.md · TEAM.md | Research + KPI-Interpretation: Fabel 5. Manager-Berichtstexte: Opus 4.8. Bau des Systems: Opus 4.8. **Im Finelli-Backend werden beide Modell-IDs explizit per ENV/Konfig gepinnt** (die Claude-API kennt kein "erben"; TEAM.md-Konvention "ohne model-Option" gilt nur fuer Workflow-Scripts im Firmen-Repo). |
| G8 | **Mock zuerst, am Kalendertag verankert (toordinal)** | playbook/phase-3-mvp.md · Demo-Killer-Lesson | Nach Gate 0 laufen alle 3 Mitarbeiter zuerst komplett im MOCK_MODE, deterministisch pro Kalendertag. Mitternachts-Uebergang explizit testen. |
| G9 | **Idempotenz + Schweizer "ss"** | FINELLI-LAGERVERWALTUNG.md | Tageslauf doppelt gestartet = kein doppelter Bericht (Lauf-Schluessel = Datum). Berichte ohne Eszett. |
| G10 | **Keine Extra-Abos fuer den Kunden** | CLAUDE.md Regel 1 | Nur Gratis-Quellen + unsere API-Kosten (in der Betriebsgebuehr inbegriffen). Paywall-Quellen sind ein SA-INTERNER Kostenentscheid — nie ein Budget-Thema beim Kunden. |
| G11 | **Kein harter Pfad, zwei Rechner** | brain/lessons/system/2026-07-20-zwei-rechner-pfad-drift.md | Alle Pfade/Zugaenge/Modell-IDs ueber Konfiguration/ENV. Neue Komponente in kunden/UEBERSICHT.md registrieren. Vor E0: Vorflug-Check, dass das Cockpit-Repo lokal existiert (Pfad-Karte brain/_cross-ref/WORKSPACE-AIWORKS.md) — sonst STOP "nur auf SA-Rechner baubar". |
| G12 | **Klick-Beweis vor "fertig" + Trockenflug** | CLAUDE.md · beweis-fertig · Trockenflug-Lesson | Jede Etappe endet mit echtem Lauf-Beweis. Vor dem ersten Kunden-Einsatz: kompletter Tageslauf als Trockenflug, Bericht an SA statt Co-Founder. |
| G13 | **Scope-Trennung:** nicht in finelli-lagerverwaltung Phase 1 bauen | FINELLI-LAGERVERWALTUNG.md (kein Dashboard/Prognose-Scope dort) | Die 3 Mitarbeiter leben als eigenes Modul im Finelli-Cockpit-Repo (`ki-mitarbeiter/`), nicht im Lagerverwaltungs-Repo. |
| G14 | **SA-Zeit-Deckel:** SwissCare (400-600k) hat im Zweifel Vorrang | CLAUDE.md Leitplanke 2 | SA-Aufwand dieses Plans: ~6 Draft-PR-Merges, Gegenlesen der Anlaufphase, 1 Co-Founder-Session. Gegenlesen ist zeitlich begrenzt (Vorschlag: 4 Wochen ODER 8 fehlerfreie Berichte, dann Freigabe-Routine). Kollidiert der Bau mit SwissCare-Arbeit, verschiebt sich der Bau — nicht SwissCare. |

---

## 4. Die 3 Mitarbeiter im Ueberblick

| Mitarbeiter | Modell | Takt | Input | Output |
|---|---|---|---|---|
| **1 — Research-Spaeher** | Fabel 5 | woechentlich Scan + monatlich Tiefen-Update | Quellen-Whitelist (Abschnitt 5), Finelli-Sortiment (Kategorien) | **Trend-Dossier** (versionierte Datei): was kommt / was geht, je mit Quelle + Abrufdatum + Konfidenz |
| **2 — KPI-Experte** | Rechenkern = Code · Interpretations-Schritt = Fabel 5 (Definition Abschnitt 6, gebaut in E3) | taeglich | Verkaufs-/Bestands-/Wareneingangs-Snapshots, Stammdaten (Hersteller, Lieferzeiten min/typisch/max, MOQ, EK, NOS/Saison, Transferzeit) | **KPI-Snapshot** (JSON, Mindest-Schema Abschnitt 6): Kennzahlen, ABC-Klasse, Trigger, Bestellvorschlag mit Rechenweg, Datenqualitaets-Ampel |
| **3 — Manager** | Opus 4.8 (nur Text-Bausteine; Zahlen rendert Code, G3) | taeglich (Alarm nur bei Trigger) + Montag + 1. Werktag/Monat | KPI-Snapshot + Trend-Dossier | **Bestell-Alarm** · **Wochenbericht** · **Monatsbericht** an Co-Founder (Anlaufphase: erst an SA zum Gegenlesen) |

> **Bewusste Abweichung von Auftrag Punkt 6** ("der ganze Workflow taeglich"): Mitarbeiter 1 laeuft
> woechentlich/monatlich, weil Branchen-Trends nicht taeglich drehen und taegliche Web-Recherche nur
> Kosten + Rauschen erzeugt. Der KPI- und Manager-Teil laeuft taeglich wie beauftragt.
> **SA bitte abnicken** (Abschnitt 12, Punkt 8).

**Datenfluss (taeglicher Lauf):**
Shopify (read-only) → Daten-Sammler (Code) → KPI-Rechenkern (Code) → KPI-Snapshot →
Manager prueft Trigger → wenn Engpass/Berichtstag: Code rendert Zahlen ins Template, KI schreibt
Text-Bausteine, Trend-Kontext aus dem Dossier → Vor-Versand-Check (Code) → Ablage/Zustellung
(Anlaufphase: an SA).

---

## 5. Mitarbeiter 1 — Research-Spaeher (Fabel 5)

**Auftrag:** Markt, Branche und Nische von Finelli beobachten (Streetwear, Fashion-Einzelhandel
Schweiz/DACH): welche Kategorien/Styles gewinnen, welche verlieren, was heisst das fuer das
Sortiment. **Nie aus Modellwissen zitieren — immer live nachschlagen (G4).**

### Quellen-Whitelist (live geprueft 21.07.2026, adversarial verifiziert)

**Tier A — beim Kunden zitierfaehig** (Studie, Amt, Verband, Leitmedium):

| Quelle | Kosten | Einsatz | Pruef-Hinweis |
|---|---|---|---|
| The State of Fashion 2026 (McKinsey x BoF) — mckinsey.com | gratis (PDF) | 1x/Jahr Makro-Rahmen (2026: Resale waechst 2-3x schneller als Erstmarkt) | Insight-Seite drosselt Bots — direkten PDF-Link in der Konfig hinterlegen |
| Swiss Textiles (swisstextiles.ch/branche/facts-and-figures) | gratis | CH-Branchenkontext Quartal | Primaerquellen der Grafiken unbenannt — bei Zitat nachfragen |
| HANDELSVERBAND.swiss (Jahreserhebung mit GfK/NIQ + Post) | Reports gratis | Benchmark fuer Finellis Online-Kanal: Fashion/Schuhe CH 2025 = CHF 2.09 Mrd., +2.5%, 16% Anteil am Online-Markt (Jahreserhebung-PDF 11.03.2026) | beste CH-Quelle im Set |
| BFS Detailhandelsumsatzstatistik (bfs.admin.ch) | gratis | monatlicher Konjunktur-Kontext (amtlich = hoechste Zitierfaehigkeit) | — |
| BTE (bte.de) | Basiszahlen gratis, Factbook kostenpflichtig | DACH-Vergleich, Pro-Kopf-Ausgaben Mode | — |
| TextilWirtschaft (textilwirtschaft.de) | Teil-Paywall | woechentlicher DACH-Scan (Insolvenzen, Flaechen, Konsumklima) | nur zitieren, was wirklich gelesen wurde |
| Business of Fashion (businessoffashion.com) | Paywall | internationale Einordnung | Direkt-Abruf liefert 403 — nur via Suche/Abo; ohne Abo begrenzt nuetzlich |

**Tier B — Trend-Signal** (zitierbar als "Signal", nicht als Marktgroesse):
FashionUnited (gratis DACH-News-Feed — **nicht** als Schweiz-Quelle fuehren, Inhalt ist faktisch
deutsch) · FashionNetwork DE (gratis) · Lyst Index (quartalsweise, jeweils NEUESTE Ausgabe pruefen) ·
Google Trends (geo=CH, nur Relativwerte mit Zeitraum/Region) · Heuritech-Reports (Lead-Gen eines
Anbieters — immer mit Vendor-Kennzeichnung) · Hypebeast (Fruehsignal Kultur/Drops) · Highsnobiety
(**Achtung: Zalando haelt seit 2022 die Mehrheit** — bei Retail-/Zalando-Themen als befangen
kennzeichnen) · StockX (Resale-Preissignale auf PRODUKT-Seiten, News-Bereich ist Editorial).

**Tier C — nur intern, nie im Kundenbericht:**
Grailify (Release-Kalender, operativ) · Reddit r/streetwear (Stimmung; blockt Bots — ggf. via
Suche) · TikTok Creative Center (**vor Aufnahme real testen**, ob automatisiert auslesbar — sonst
streichen) · Statista **nur als Wegweiser zur Primaerquelle**, nie "laut Statista" zitieren.

**Sperrliste (nie nutzen):** SEO-Report-Muehlen ("Markt waechst mit CAGR X bis 2032", Report kostet
3'000-5'000 USD, kein Impressum/Analyst) · KI-generierte Trend-Blogs ohne Autor/Quellen · einzelne
Social-Posts als "Marktbeleg" · Pressemitteilungs-Portale als Primaerquelle · Zahlen aus
LLM-Antworten ohne verlinkte Quelle.

**Harte Regel im Agenten-Prompt:** Jede Zahl braucht eine Whitelist-Quelle (A fuer Kundenberichte,
B fuer Trend-Aussagen, C nur intern mit Warnhinweis). Quelle nicht auf der Liste → erst pruefen und
Liste erweitern, oder ehrlich "weiss nicht". Paywall-Quellen: Start nur mit Gratis-Quellen; ob wir
selbst ein Abo zahlen, entscheidet SA intern (G10). Zulaessige Kunden-Frage ist nur, ob Finelli
BEREITS Abos besitzt, die wir mitnutzen duerfen.

### Output: das Trend-Dossier

Versionierte Datei (`trend-dossier.md` + maschinenlesbar `trend-dossier.json`), pro Eintrag mit
eindeutiger ID: Kategorie/Style → Richtung (kommt/stabil/geht) → Beleg (Quelle, URL, Abrufdatum,
Tier) → Konfidenz (hoch/mittel/niedrig) → Bezug zum Finelli-Sortiment. Der Manager zitiert NUR
Dossier-IDs — nie frei.

---

## 6. Mitarbeiter 2 — KPI-Experte (Rechenkern in Code + Fabel-5-Interpretation)

### Artikel-Kennzahlen (Formeln adversarial verifiziert, je 2+ unabhaengige Quellen)

| Kennzahl | Formel | Verwendung |
|---|---|---|
| Abverkaufsquote (Sell-Through) | verkaufte Stueck ÷ erhaltene Stueck × 100 | Richtwert-Bandbreite 60-80%/Saison ("Branchenrichtwert, keine Norm"); <50% = Abschriften-Signal. **Braucht Wareneingangs-Daten (siehe Fenster-Tabelle + Abschnitt 8).** |
| Lagerumschlag | Wareneinsatz ÷ Ø-Bestand zu Einstandspreisen | Kapitalbindung. Ø-Bestand ab Go-Live = Tagesmittel aus den Snapshots (robuster als (Anfang+Ende)÷2 bei Drop-getriebenem Bestand). |
| Reichweite (Tage/Wochen) | Bestand ÷ Ø-Absatz; vorausschauend: (Bestand + offene Bestellungen) ÷ Prognose | DIE Zahl fuer den Co-Founder ("reicht noch X Tage"). Umrechnung 52÷Umschlag NUR als Plausibilitaets-Check (gilt nur auf Ø-Bestand). |
| Meldebestand (Reorder Point) | Ø-Tagesabsatz × Wiederbeschaffungszeit + Sicherheitsbestand | Wiederbeschaffungszeit = KOMPLETTE Kette: Hersteller-Produktion + Transport + Einlagern Embrach + Transfer Laden (typischer Wert aus Stammdaten). |
| Sicherheitsbestand | **Start verbindlich: pauschal +2 Wochen Reichweite** (= 2 × Wochenabsatz), offen ausgewiesen. Ausbaustufe spaeter: Z-Formel — dann in der erweiterten Form Z × √(L × σ_D² + D² × σ_L²), weil gerade die LIEFERZEIT-Streuung der Treiber ist; einfache Z × σ_D × √L nur bei nachweislich konstanter Lieferzeit. | Puffer gegen Nachfragespitzen + Lieferverzug. Normalverteilungs-Annahme gilt bei n<5/Woche nicht — darum Start mit Pauschale. |
| GMROI | Rohertrag ÷ Ø-Bestand zu Einstandskosten | Ranking "welches Modell behalten/auslaufen" (>1 = verdient Geld; 2-3 = Richtwert). **Gleicher Rollier-Vorbehalt wie Umschlag:** erst ab genuegend Snapshot-Tagen, annualisiert, in Datenqualitaets-Ampel gekennzeichnet. |

### Fenster-Tabelle (welche Kennzahl auf welchem Zeitfenster — Pflicht fuer E1)

| Groesse | Fenster |
|---|---|
| Absatz + Umsatz (Berichte, Alarm-Fakten) | 7 / 30 / 90 / 365 Tage |
| Sell-Through | NUR pro Saison bzw. kumuliert seit letztem Wareneingang — nie 7/30 Tage (Nenner waere meist 0) |
| Umschlag + GMROI | 90 Tage rollierend annualisiert; zusaetzlich 365, sobald Historie vorhanden |
| Ø-Absatz fuer Meldebestand / Bestellmenge / Reichweite | Referenzfenster **30 Tage**; Fallback **90 Tage**, wenn n < 5 Verkaeufe/Woche; Saisonware: nur In-Saison-Fenster |

### Bericht-Kennzahlen (ebenfalls Rechenkern — Heimat fuer die Templates in Abschnitt 7)

| Groesse | Definition (deterministisch) |
|---|---|
| Umsatz je Kanal + Vergleich | Umsatz gesamt / Online / Laden je Fenster, Delta vs. Vorwoche bzw. Vormonat in % |
| Lagerwert | Summe (Bestand × EK) ueber alle Varianten, je Standort |
| Ladenhueter-Anteil | Anteil D-Modelle an allen aktiven Modellen (%) |
| Verpasste Verkaufstage | Tage mit Bestand 0 je Variante (ab Tag 1 taeglich mitgeschrieben); Kachel zeigt Summe der Stockout-Tage + geschaetzte entgangene Stueck (Stockout-Tage × Ø-Tagesabsatz 90T) + geschaetzte CHF (× VK), als Schaetzung markiert |
| Groessen-Luecken | Varianten mit Laden-Bestand 0, deren Modell A oder B ist |
| Effekt-Schaetzer fuer Empfehlungen | deterministische Formel: Reichweiten-Luecke (Tage) × Ø-Tagesabsatz × VK — als "grobe Schaetzung" gekennzeichnet |

### Bestell-Logik (der Kern von SAs "wuerde gut sein nachzubestellen")

1. **Verfuegbarer Bestand (Inventory Position)** = Bestand Laden + Bestand Embrach
   + offene Hersteller-Bestellungen **− bereits verkaufte, noch nicht versandte Kundenbestellungen**
   (sonst zaehlt das System Ware doppelt, die schon einem Kunden gehoert).
2. **Zwei getrennte Trigger** (Zwei-Standort-Falle: leerer Laden bei vollem Embrach!):
   a) **Hersteller-Nachbestellung** auf **MODELL-Ebene**, wenn Inventory Position ≤ Meldebestand
   (MOQs gelten bei Streetwear pro Style/Colorway, nicht pro Groesse).
   b) **Umlagerungs-Hinweis Embrach → Laden** auf **VARIANTEN-Ebene**, wenn der Laden-Bestand
   unter seinen Transfer-Meldebestand faellt (Basis: Transferzeit Embrach→Laden aus Stammdaten).
3. **Bestellmenge (Modell)** = Ziel-Reichweite (Vorschlag 8-12 Wochen, mit Co-Founder festlegen) ×
   Wochenabsatz − verfuegbarer Bestand; Verteilung auf Groessen ueber die Size Curve; dann
   MOQ-Regel: bestellt wird max(MOQ, Zielmenge). **MOQ deutlich ueber Zielmenge = Entscheidungsfall
   im Bericht, kein Automatismus** (A-Artikel: akzeptieren · B/C: Sammelbestellung beim selben
   Hersteller pruefen · sonst auslaufen lassen — MOQ-Zwangskaeufe sind eine Hauptursache fuer
   Ladenhueter).
4. **NOS vs. Saison:** Diese Logik gilt nur fuer NOS-Artikel (Basics, laufen immer). Saisonware
   wird pro Saison geplant (Open-to-Buy); Nachorder nur bei klar ueberplanmaessigem Sell-Through
   frueh in der Saison UND Ankunft deutlich vor Saisonende. Stammdaten-Flag NOS/Saison, Finelli
   bestaetigt (Abschnitt 11).
5. **Prognose-Ebene:** auf MODELL-Ebene rechnen (stabiler), dann ueber die Groessen-Farb-Kurve
   (Size Curve) auf Varianten herunterbrechen. Kurve rollierend alle 4-8 Wochen neu berechnen
   (statische Kurven kippen laut Beleg innert Wochen); bei duennen Daten Kategorie-Kurve nutzen.
   Neue Artikel: am aehnlichsten Vorgaenger ankern, woechentlich nachjustieren.

### ABC-Kategorisierung (SAs "ABC-Artikel")

- **A/B/C nach Pareto auf MODELL-Ebene** (bei ~60 Modellen; Varianten-Ebene zersplittert):
  nach Rohertrag absteigend, kumuliert — A = bis 80%, B = 80-95%, C = Rest (Startpunkt, kein Gesetz).
- **Klasse D = Ladenhueter:** 0 Verkaeufe in 90 Tagen INNERHALB der relevanten Saison, oder
  Saison-Sell-Through < 50%. **Saison-Fairness:** Winterjacken im Juli sind keine Ladenhueter —
  Saisonware erst am Saisonende bewerten.
- **Kein XYZ am Anfang:** bei n<5 Verkaeufen/Woche landet fast alles in Z, die Einteilung wird
  wertlos. Erst mit sauberer Datenlage evtl. einfuehren, Schwellen dann an Finellis realer
  Verteilung kalibrieren.

### Interpretations-Schritt (Fabel 5 — gebaut in E3)

Nach dem Rechenkern laeuft pro Trigger-/Auffaelligkeits-Artikel ein Fabel-5-Schritt, der das Feld
`einschaetzung` im KPI-Snapshot fuellt: 1-2 Saetze Einordnung ("verkauft sich seit 3 Wochen
schneller, Trend-Dossier T-07 stuetzt das") — **keine neuen Zahlen**, nur Bezuege auf Snapshot-Werte
und Dossier-IDs. Der Manager uebernimmt diese Einschaetzung in den Bericht.

### KPI-Snapshot — Mindest-Schema (JSON, ein Artikel mit 1 Variante als Beispiel)

```json
{
  "lauf": { "datum": "2026-07-21", "modus": "MOCK", "status": "ok", "dritt_ausfall": null },
  "aggregate": {
    "umsatz": { "t7_gesamt": 7190, "t7_online": 4210, "t7_laden": 2980, "vs_vorwoche_pct": -4.1 },
    "lagerwert_ek": { "laden": 21300, "embrach": 47100 },
    "ladenhueter_anteil_pct": 12.0,
    "stockout": { "t30_tage": 9, "t30_entgangene_stueck_geschaetzt": 18, "t30_chf_geschaetzt": 1440 }
  },
  "artikel": [{
    "modell_id": "HOOD-01", "abc": "A", "nos": true, "saison_fenster": null,
    "absatz": { "t7": 14, "t30": 61, "t90": 178, "t365": 601 },
    "reichweite_tage": 26, "meldebestand": 56, "inventory_position": 52,
    "trigger": "hersteller_nachbestellung",
    "bestellvorschlag": {
      "menge": 60, "groessen": { "S": 10, "M": 20, "L": 20, "XL": 10 },
      "rechenweg": "Ziel 8 Wo x 14/Wo = 112 - 52 verfuegbar = 60; MOQ 50 erfuellt"
    },
    "datenqualitaet": { "ampel": "gelb", "saubere_tage": 41, "schaetzanteil_pct": 18, "letzte_zaehlung": "2026-07-14" },
    "einschaetzung": null,
    "varianten": [{ "sku": "HOOD-01-M-BLK", "bestand_laden": 8, "bestand_embrach": 12,
                    "offene_kundenorders": 2, "stockout_tage_t30": 3, "transfer_trigger": false }]
  }]
}
```

(Feldnamen sind verbindliche Mindest-Struktur fuer E1/E3; Erweiterungen erlaubt, Umbenennungen nicht.)

---

## 7. Mitarbeiter 3 — Manager (Opus 4.8 schreibt Text, Code rendert Zahlen)

**Bauweise (verbindlich, G3):** Der Code setzt ALLE Zahlen-Felder deterministisch aus dem
KPI-Snapshot ins Template. Opus 4.8 liefert nur die Text-Bausteine (Warum-Saetze, "Na-und?"-Saetze,
Empfehlungs-Formulierungen) mit Bezug auf Snapshot-Werte und Dossier-IDs. Der Vor-Versand-Check
prueft dann: jedes Zahlen-Feld gegen den Snapshot, jedes Zitat gegen eine Dossier-ID — sonst kein
Versand. (Nicht: LLM schreibt Freitext mit Zahlen und Code parst hinterher.)

Berichts-Prinzipien (recherchierte Executive-Report-Praxis): Pyramiden-Prinzip (Empfehlung zuerst) ·
"So what?"-Pflicht (keine Zahl ohne Konsequenz) · immer gleiches Format · Ampeln nur mit
dokumentierten Schwellen + Trendpfeil · kein Jargon ("Ladenhueter" statt "Slow Mover",
"reicht noch X Tage" statt "Days of Supply").

### Ampel-Schwellen (Startwerte — Vorschlag, mit Co-Founder kalibrieren; Abschnitt 12 Punkt 4)

| Ampel | GRUEN | GELB | ROT |
|---|---|---|---|
| Artikel-Bestand (Trigger) | Reichweite ≥ 1.5 × Wiederbeschaffungszeit | Reichweite < 1.5 × WBZ, aber Inventory Position > Meldebestand | Inventory Position ≤ Meldebestand |
| Umsatz vs. Vorwoche | ≥ −5% | −5% bis −20% | < −20% |
| Lager-Gesundheit | Ladenhueter-Anteil < 10% | 10-20% | > 20% |
| Ausverkaufs-Risiken | 0 A/B-Artikel auf GELB/ROT | 1-2 | ≥ 3 |
| Datenqualitaet | ≥ 60 saubere Tage UND < 10% Schaetzanteil | dazwischen | < 30 saubere Tage ODER > 30% Schaetzanteil |

### (a) Bestell-Alarm (sofort, nur bei ROT, Lesezeit ~15 Sekunden)

Alle Zahlen kommen aus dem Rechenkern — das folgende Beispiel ist formelkonform durchgerechnet
(Ø 2/Tag = 14/Woche · WBZ 14 Tage · Sicherheit = +2 Wochen = 28 → Meldebestand 2×14+28 = 56 ·
verfuegbar 52 ≤ 56 → ROT · Menge = 8 Wo × 14 − 52 = 60):

- Betreff = Ampel + Handlung: "ROT: Hoodie [Modell] — bis [Datum] nachbestellen".
- Zeile 1 (Empfehlung): "Empfehlung: 60 Stueck bei [Hersteller] bestellen (S 10 / M 20 / L 20 /
  XL 10), spaetestens [Datum] — Bestand reicht noch ~26 Tage, Nachschub braucht 14. Jetzt bestellt
  = keine Luecke."
- Zeile 2 (Warum, 1 Satz): "Noch 52 Stueck verfuegbar (Laden 22 / Embrach 30), verkauft sich
  ~2x/Tag, Meldebestand 56 unterschritten."
- Fakten-Block (5 feste Felder): Modell (+ betroffene Groessen) | Bestand je Standort | Verkauf
  7/30/90/365 | ABC-Klasse + Trend-Einschaetzung (Dossier-ID + Quelle) | empfohlene Menge MIT
  Rechenweg aus dem Snapshot.
- Abschluss: Empfehlung nachbestellen ODER auslaufen lassen + Antwort-Optionen
  "OK / ANDERE MENGE / AUSLAUFEN LASSEN".
- **Anti-Alarm-Muedigkeit:** nur A/B-Modelle auf ROT loesen Sofort-Alarm aus; C/D und GELB sammeln
  sich im Wochenbericht. Max. 1 Modell pro Alarm, **max. 3 Sofort-Alarme pro Tag** — weitere ROT-
  Faelle gehen als priorisierte Sammel-Liste im selben Versand. **Erster Echtlauf (E5):** einmaliger
  "Startbestands-Bericht" mit allen Faelligkeiten statt N Einzel-Alarmen.

### (b) Wochenbericht (Montag, 1 Seite, 3 Minuten Lesezeit)

1. Kopf: 3 Ampeln mit Trendpfeil (Umsatz vs. Vorwoche | Lager-Gesundheit | Ausverkaufs-Risiken)
   + 1 Satz "Das Wichtigste diese Woche".
2. Verkauf: gesamt, Online vs. Laden, vs. Vorwoche — je mit 1 Satz Warum.
3. Top 3 / Flop 3 (Rohertrag-Beitrag; Sell-Through nur wo Saison-/Eingangsdaten es erlauben) +
   je 1 "Na-und?"-Satz.
4. Groessen-Luecken: Varianten mit Laden-Bestand 0 bei A/B-Modellen (= wo verlieren wir gerade
   Verkaeufe).
5. Unterwegs: offene Bestellungen + Liefertermine.
6. **"DIESE WOCHE ENTSCHEIDEN"** (max. 3 Ja/Nein-Empfehlungen mit Effekt-Schaetzer in CHF/Stueck
   aus dem Rechenkern, als grobe Schaetzung gekennzeichnet).

### (c) Monatsbericht (1. Werktag, max. 1.5 Seiten)

1. Der Monat in 1 Satz. 2. Fuenf Kennzahlen-Kacheln (Umsatz Online/Laden | Sell-Through (Saison,
sofern rechenbar) | Lagerwert CHF | Ladenhueter-Anteil | verpasste Verkaufstage) mit Ampel + Pfeil.
3. Highlights (max. 3, konkret). 4. Lowlights (max. 3, ehrlich). 5. Markt-Blick: 1-2 Punkte aus
dem Trend-Dossier, NUR wenn handlungsrelevant, mit Quelle. 6. **"NAECHSTEN MONAT"** (max. 3
Empfehlungen) + genau 1 Entscheidungsfrage an den Co-Founder. Fusszeile: Datenstand + Abzugsdatum.

### Ton-Stufen (SAs Vorgabe "erst empfehlen, spaeter bestimmen")

| Stufe | Wann | Ton |
|---|---|---|
| **1 — Empfehlen** (Start) | solange Datenlage unsauber | Immer Bandbreite + Konfidenz: "Erwartung 8-15 Stueck, mittlere Sicherheit — basiert auf 6 Wochen Daten, Laden-Zahlen davor geschaetzt. Bitte pruefen, du kennst den Laden." Bei zu duenner Basis explizit: "Datenbasis reicht hier nicht — Bauchgefuehl des Teams zaehlt mehr." Sicherheitsbestaende bewusst grosszuegiger, Aufschlag transparent. |
| **2 — Bestimmt** | erst wenn messbare Kriterien erfuellt (Vorschlag, mit Co-Founder fixieren): POS-Kasse ≥ 60 Tage live + Voll-Inventur gemacht + Zaehl-Abweichung < 5% + ≥ 2 Quartale saubere Historie | Klare Ansage: "Nachbestellen: 60 Stueck. / Auslaufen lassen." — Umschalten ist ein bewusster Entscheid von SA + Co-Founder, nie automatisch. |

**Anlaufphase (beide Stufen):** Berichte gehen zuerst an SA zum Gegenlesen (Muster
ki-wochen-bericht; zeitlich begrenzt nach G14), erst nach Freigabe-Routine direkt an den
Co-Founder. **Zustellweg bis E5:** Berichte werden als Dateien mit Datum-Schluessel abgelegt und
sind ueber eine Cockpit-Ansicht/Endpunkt abrufbar; "Versand" = Statuswechsel nach bestandenem
Vor-Versand-Check. Mail/WhatsApp-Zustellung erst in E5 nach Klaerung von Punkt 1 (Abschnitt 12).

---

## 8. Daten-Fundament ("alte Daten fuettern, neue sauber einbauen")

**Das ist die kritischste Etappe — schlechte Startdaten sind der Top-Scheiter-Grund (Logistik-Research).**

1. **Backfill (alte Daten):** Die Shopify-API liefert der App nur ~60 Tage Bestell-Historie
   (Feinplan Risiko 2). Fuer 365-Tage-KPIs: beim Einrichten der Custom App den Scope
   `read_all_orders` beantragen (volle Historie) — Fallback: Shopify-Admin-CSV-Export durch
   Khawars Team nach Anleitung. B2B-Abgaenge + Laden-Nachtraege als "unsicher" etikettieren.
2. **Daten-Genauigkeit (Fakten-Stand):** Belegt aus Runde 2 (18.07): Bestand "~80% genau",
   Laden-Verkaeufe werden von Hand in Shopify nachgetragen. Die oft zitierte **~20%
   Verkaufs-Fehlbuchungs-Quote ist eine ABLEITUNG (Ausbau-Plan 18.07), keine gemessene Groesse** —
   in der Co-Founder-Session validieren (Abschnitt 12 Punkt 6). **Schnitt-Datum:** Ab POS-Livegang
   (V2 Kasse) beginnt die "saubere Zone". Alt-Daten behalten, als Schaetzung markiert. Der
   Korrektur-Faktor (Annahme ~20%) wird NUR auf Modell-/Kategorie-Ebene und Aggregate angewendet —
   Varianten-KPIs vor dem Schnitt-Datum ausschliesslich aus dem Online-Kanal rechnen (pauschale
   Skalierung auf Varianten-Ebene waere Scheinpraezision).
3. **Bestands-Anker:** Zum Schnitt-Datum eine einmalige **VOLL-Inventur beider Standorte**
   (Finelli-Team zaehlt nach unserer Anleitung, bei ~200 Varianten an 1 Tag machbar) — ohne
   korrekten Startbestand korrigieren alle spaeteren Zaehlungen auf falscher Basis. Danach
   **zyklische Teilzaehlungen** (A-Artikel monatlich, Rest seltener) durch das Laden-Team.
4. **Neue Daten sauber (taeglicher Snapshot, Code):** Verkaeufe je Variante/Standort/Kanal,
   Bestand je Standort, offene Hersteller-Bestellungen, offene Kundenbestellungen,
   **Wareneingaenge je Variante mit Datum** (Quelle: Shopify Inventory-Adjustments/Transfers bzw.
   Wareneingangs-Erfassung des Finelli-Teams) und **Stockout-Tage (Bestand = 0) je Variante**.
   Append-only-Ablage mit Datum-Schluessel (idempotent). Historische Wareneingaenge fuer die
   365-Tage-Sicht: aus Shopify-Adjustments rekonstruieren, sonst ehrlich "nicht verfuegbar" —
   Sell-Through dann erst ab Go-Live ausweisen.
5. **Neue Stammdaten** (Finelli pflegt ueber einfache Maske, wir leiten an): Hersteller je Modell,
   **Lieferzeit min/typisch/max** (komplette Kette!), **Transferzeit Embrach→Laden (Tage)**,
   MOQ (pro Modell), EK-Preis, VK-Preis, NOS/Saison-Flag + Saison-Fenster.

---

## 9. Technik: wo lebt und laeuft das

- **Code-Ort:** Finelli-Cockpit-Repo (Pfad je Rechner laut Pfad-Karte
  brain/_cross-ref/WORKSPACE-AIWORKS.md; Stand 21.07 nur auf dem SA-Rechner vorhanden), neues Modul
  `ki-mitarbeiter/` — Aufbau auf der bestehenden KI-Etappe (KI-Bestell-Vorschlag + Wochen-Bericht
  aus dem Feinplan werden zu Mitarbeiter 2 + 3 ausgebaut, nichts doppelt bauen). NICHT im
  Lagerverwaltungs-Repo (G13). **Vorflug-Check vor E0 (G11):** Cockpit-Repo lokal vorhanden?
  Sonst STOP "nur auf SA-Rechner baubar". Kein neuer Port noetig (laeuft im Backend 8012); falls
  doch eigener Dienst → Finelli-Port-Block + Eintrag in kunden/UEBERSICHT.md.
- **Taeglicher Lauf (G5-konform, ohne GitHub Actions):** Rechenkern + Snapshot als Zeit-Job im
  Backend (Server-Wecker-Muster aus dem CRM-Fundament ist vorhanden). Der Wochen-Takt des
  Research-Spaehers haengt am selben Scheduler (E4). Agenten-Laeufe ueber die Claude-API aus dem
  Backend heraus; **Modell-IDs explizit per ENV/Konfig gepinnt** (Research/Interpretation =
  Fabel-5-ID, Manager-Text = Opus-4.8-ID; G7).
- **Research-Abruf (E2):** Claude-API mit Websuche-Tool, erlaubte Domains = Whitelist-Konfig aus
  Abschnitt 5; fuer 403-/Paywall-Quellen dokumentierter Fallback (Suche statt Direktabruf bzw.
  "weiss nicht"); McKinsey ueber den hinterlegten PDF-Direktlink.
- **MOCK_MODE:** kompletter Tageslauf mit Mock-Shopify-Daten UND Mock-Trend-Dossier
  (Kalendertag-verankert, G8) — vorfuehrbar ohne einen einzigen echten Zugang.
- **Idempotenz:** Lauf-Protokoll mit Schluessel = Kalendertag (Felder: datum, modus, status,
  dritt_ausfall, berichte[]); zweiter Start am selben Tag = "schon gelaufen", kein Doppel-Bericht (G9).
- **Fehler-Handling:** Shopify-API down → Lauf bricht sauber ab, protokolliert "Dritt-Ausfall"
  (wichtig fuer die 48h-Garantie-Abgrenzung im Vertrag), naechster Lauf holt Snapshots nach.
- **Kosten (Schaetzung, in Betriebsgebuehr gedeckt):** taeglicher Lauf + Wochen-/Monatsberichte
  grob CHF 10-30/Monat Claude-API (Groessenordnung Feinplan: 5-15 fuer weniger Laeufe) — vor
  Etappe E4 einmal real messen. Keine Extra-Abos (G10).

---

## 10. Bau-Etappen fuer Opus 4.8 (jede Etappe: Draft-PR, Klick-/curl-Beweis, nur SA merged)

> **GATE 0 — VOR ALLEM BAU (G1): Finelli sagt Ja (Absichtserklaerung/Auftrag).**
> Bis dahin existiert nur dieser Bauplan. Ausnahme nur als dokumentierter SA-Entscheid
> in brain/decisions/.

| Etappe | Was fertig ist | Beweis (Pflicht vor "fertig") |
|---|---|---|
| **E0 — Daten-Fundament (Mock)** | Datenmodell Snapshots (inkl. Wareneingaenge, Stockout-Tage, offene Kundenorders) + Stammdaten (Hersteller, Lieferzeit min/typisch/max, Transferzeit, MOQ, EK/VK, NOS/Saison), Mock-Generator kalendertag-verankert **mit Pflicht-Szenario-Katalog** (je min. 1 deterministischer Fall: ROT-Alarm A-Modell, Umlagerungs-Fall, MOQ>Zielmenge, Ladenhueter D, Saisonartikel ausserhalb Saison, Mitternachts-Grenzfall), **Mock-Trend-Dossier** (3-5 fixe Eintraege im Dossier-Format, klar als MOCK markiert), Stammdaten-Maske | Mock-Lauf erzeugt 365 Tage Historie; Neustart = identische Werte; alle Pflicht-Szenarien nachweislich vorhanden; Maske im Browser geklickt |
| **E1 — KPI-Rechenkern** | Alle Kennzahlen aus Abschnitt 6 **inkl. Fenster-Tabelle und Bericht-Kennzahlen** als getesteter Code (ABC+D, beide Trigger auf richtiger Ebene, MOQ-Fall, Size Curve, Effekt-Schaetzer, Ampel-Schwellen, Datenqualitaets-Ampel), KPI-Snapshot exakt nach Mindest-Schema | Unit-Tests mit Handrechnungs-Fixtures (jede Formel 1 nachgerechnetes Beispiel, inkl. des Alarm-Beispiels aus Abschnitt 7a); curl-Beweis KPI-Snapshot-Endpunkt |
| **E2 — Research-Spaeher** | Quellen-Whitelist als Konfig (Tier + Sperrliste + PDF-Direktlinks + Fallbacks), Agent-Prompt mit harter Quellen-Regel, Trend-Dossier-Format (md+json, IDs), TikTok-Quelle real getestet (sonst raus) | Ein echter Lauf liefert Dossier, in dem JEDER Eintrag ID + URL + Abrufdatum + Tier hat; Stichprobe: 3 URLs von Hand geoeffnet |
| **E3 — Manager + Interpretation** | 3 Templates (Alarm/Woche/Monat) exakt nach Abschnitt 7, Bauweise "Code rendert Zahlen, Opus schreibt Text", Fabel-5-Interpretations-Schritt (fuellt `einschaetzung`), Ton-Stufen-Schalter (Stufe 1 aktiv), Alarm-Deckel (max 3/Tag + Sammel-Liste), Vor-Versand-Check (Zahl→Snapshot-Feld, Zitat→Dossier-ID), Berichts-Ablage + Cockpit-Ansicht | Mock-Alarm + Mock-Wochenbericht erzeugt und in der Cockpit-Ansicht gelesen; Vor-Versand-Check blockt nachweislich einen manipulierten Test-Bericht |
| **E4 — Taeglicher Lauf** | Scheduler (Server-Wecker; taeglich KPI/Manager, woechentlich Research), Idempotenz, Mitternachts-Test, Fehler-Handling Dritt-Ausfall, Kosten-Messung | **Trockenflug:** 3 komplette Tageslaeufe hintereinander im Mock (inkl. simuliertem Doppel-Start + simuliertem Shopify-Ausfall), Berichte an SA (= Datei-Ablage + Cockpit-Ansicht) |
| — **GATE E5: Shopify-Zugang (Scopes inkl. read_all_orders) + Co-Founder-Session (Abschnitt 12) + POS-Regel: solange die V2-Kasse NICHT live ist, laeuft NUR Ton-Stufe 1, jede Laden-Zahl ist als Schaetzung markiert, und es gehen KEINE Fixmengen-Bestell-Alarme fuer ladenlastige Artikel raus ("V4 lohnt erst NACH V2 — nicht verhandelbar", Ausbau-Plan)** — | | |
| **E5 — Echtbetrieb** | Echtdaten-Anbindung read-only, Backfill, einmaliger Startbestands-Bericht, Anleitung Voll-Inventur + Stammdaten-Erfassung fuers Finelli-Team, Anlaufphase mit SA-Gegenlesen (begrenzt nach G14) | Erster echter Wochenbericht von SA gegengelesen und freigegeben; mvp-klick-beweis-Schwarm vor der ersten Co-Founder-Zustellung |

**Aufwand: total grob 8-12 Bau-Tage (eigene Schaetzung, keine Web-Quelle).** Die Zuordnung zum
aktuellen Deal (V6 "Momente") rechnet SA frisch mit `deal-mathe` — keine Rahmen-Behauptung aus
alten Paketmodellen.

---

## 11. Handarbeit des Finelli-Teams (wir leiten an, G6)

1. Hersteller-Liste je Modell mit Lieferzeiten (min/typisch/max), Transferzeit Embrach→Laden,
   MOQ und EK-/VK-Preisen liefern und pflegen.
2. NOS/Saison-Einstufung je Artikel bestaetigen (wir schlagen vor).
3. Voll-Inventur am Schnitt-Tag (1 Tag, beide Standorte) + danach Teilzaehlungen nach Plan.
4. Wareneingaenge erfassen (Scan/Erfassung beim Einbuchen — Basis fuer Sell-Through).
5. Shopify-Custom-App-Zugang klicken (Anleitung im Cockpit-Repo: docs/SHOPIFY-ZUGANG.md — Existenz
   dort vor E5 verifizieren; + read_all_orders).
6. Rueckmeldung auf Berichte (OK / andere Menge / auslaufen) — das fuettert die Lernschleife.

## 12. Offene Punkte fuer die Co-Founder-Session (nicht raten — dort klaeren)

1. **Versand-Kanal** der Berichte (Mail? WhatsApp? In der App?) und wer sie ausser dem Co-Founder sieht.
2. **Berichts-Tage:** Wochenbericht Montag frueh? Monatsbericht 1. Werktag? (SA: "muessen wir noch bestimmen")
3. **Ziel-Reichweite** (8-12 Wochen?) und Servicegrad je ABC-Klasse — Vorschlaege liegen an, Entscheid beim Kunden.
4. **Ampel-Schwellen + Kriterien fuer Ton-Stufe 2** — Startwerte stehen in Abschnitt 7, Kunde muss sie abnicken.
5. **Betriebs-Ort** des taeglichen Laufs (SA-Rechner reicht nicht fuer Produktiv — Hosting-Muster Fly.io wie Cockpit?).
6. **Historische Daten:** read_all_orders-Scope ok? B2B-Abgaenge wie erfasst? Wie hoch ist die
   Laden-Fehlbuchungs-Quote wirklich (unsere ~20% sind eine Annahme)? SumUp-Alt-Daten vorhanden/noetig?
7. **Vorhandene Abos:** Besitzt Finelli bereits Fachmedien-Abos (z.B. TextilWirtschaft), die wir
   mitnutzen duerfen? (KEINE neuen Abos beim Kunden — G10; eigene Abos entscheidet SA intern.)
8. **Research-Takt abnicken:** Mitarbeiter 1 woechentlich statt taeglich (bewusste Abweichung, Abschnitt 4).

## 13. Ehrlichkeit / Risiken

- **Duenne Daten sind das Hauptrisiko**, nicht die Technik: ~200 Varianten, wenige Verkaeufe pro
  Variante/Woche → darum Modell-Ebene + Size Curve + Ton-Stufe 1. Das System wird die ersten
  Monate SICHTBAR vorsichtig sein — das ist Absicht und wird dem Kunden so verkauft.
- **Vor POS-Livegang (V2 Kasse) bleiben Laden-Zahlen Schaetzungen.** Belegt (Runde 2, 18.07):
  Bestand "~80% genau", Laden-Verkaeufe manuell nachgetragen. Die ~20% Verkaufs-Fehlbuchungs-Quote
  ist eine Ableitung des Ausbau-Plans (18.07), keine Messung — Validierung in der Co-Founder-Session.
  Reihenfolge V2 vor scharfen Analysen ist nicht verhandelbar und steht als Bedingung am Gate E5.
- **Sell-Through braucht Wareneingangs-Daten** — vor deren Erfassung (bzw. Rekonstruktion aus
  Shopify-Adjustments) wird die Kennzahl ehrlich als "noch nicht rechenbar" ausgewiesen, nie
  improvisiert.
- **Benchmarks (Sell-Through 60-80%, Umschlag, GMROI 2-3) sind Vendor-Konventionen** mit Streuung —
  im Bericht immer als "Branchenrichtwert" mit Quelle, nie als harte Norm.
- **Trend-Research ist Einschaetzung, keine Prophezeiung** — darum Konfidenz-Label + Quellen-Tier
  an jedem Dossier-Eintrag, und der Manager nutzt Trends nur als KONTEXT zur Zahlen-Empfehlung.
- **Aufwands-Schaetzungen in Abschnitt 10 sind eigene Schaetzungen** ohne Web-Quelle.
