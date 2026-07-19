# Finelli — Lager-Software fuer Kleidung: Entscheidungs-Bericht

> Erstellt 2026-07-18 durch HQ-Research (9 Agenten: 5 Spaeher + Kritiker + 2 Nachrecherchen + Synthese).
> Anlass: Erster Software-Kunde "Finelli" will eine Logistik-Software fuer Kleidungsstuecke.
> Status: 🔴 OFFEN — Kernfrage an SA/Finelli unbeantwortet (Haendler vs. Lager-Dienstleister vs. anderes).

## 1. Fazit

**Ja, wir koennen das bauen.** Unser technisches Fundament (Server, Login, Hosting, Datenbank) ist fertig und kopierbar — aber Barcode-Scan und Etiketten-Druck fehlen komplett (bestaetigt: null Treffer im Code, beides Neubau).
**Schnellster Weg: ERST 30 Minuten mit Finelli reden, DANN bauen.** Die halbe Feature-Liste haengt an einer einzigen offenen Frage: Ist Finelli ein Haendler mit eigener Ware — oder lagert er fuer mehrere Auftraggeber?
Der Betrieb kostet uns nur ~CHF 45–50 pro Monat (fly.io/docs/about/pricing, supabase.com/pricing, vercel.com/pricing) — teuer ist allein unsere Bauzeit.

---

## 2. Die Nische in 5 Punkten — was Kleider-Logistik besonders macht

1. **Groessen-Farben-Matrix**: 1 Modell × 6 Farben × 8 Groessen = 48 Lager-Nummern. 200 Modelle = Tausende Positionen. Daran scheitern normale Lager-Tools (aims360.com).
2. **Scan an jeder Station**: Groesse M und L sehen im Regal gleich aus — ohne Barcode-Scan bei Eingang, Picken und Packen stimmt der Bestand nie.
3. **Retouren als Kern-Prozess**: Kleidung ist die meist-retournierte Ware. US-Zahlen sagen 25–40% Ruecklaeufer (cart.com/blog/apparel-returns-management) — ob das fuer Finelli gilt: **weiss nicht** (sein B2B-Anteil ist unbekannt).
4. **Haengeware vs. Liegeware**: Maentel an Stangen, T-Shirts in Faechern — jeder Lagerplatz muss wissen, welcher Typ dort erlaubt ist.
5. **Saison-Druck**: Alte Kollektion muss raus, bevor die neue kommt (Aeltestes-zuerst-Prinzip), sonst wird der Bestand wertlos.

---

## 3. Was wir schon HABEN (aus unserem CRM-Code)

Fazit: Das ganze Fundament ist kopierbar — das spart Wochen Grundlagen-Arbeit.

| Baustein | Status |
|---|---|
| Server-Geruest (Start, Einstellungen, DB-Verbindung, Boot-Schutz, Fehler-Glocke) | ✅ direkt nutzbar |
| Login-Kern (Token + Passwort-Verschluesselung, als eigenes Modul gebaut) | ✅ direkt nutzbar |
| Frontend-Start (API-Anbindung, Login-Maske, App-Rahmen, 5 Design-Bausteine) | ✅ direkt nutzbar |
| Hosting-Bauplan (Fly.io Frankfurt + Supabase + Vercel, mit Auto-DB-Nachzug) | ✅ kopieren, Namen aendern |
| Server-Wecker (Zeit-Jobs) + Gesundheits-Checks | ✅ direkt nutzbar |
| Mail-Modul (Outlook-Cloud: senden, lesen, Anhaenge) | ⚠️ Umbau — neue Firmen-Rechte noetig |

**Achtung, wichtiger Nebenbefund:** Der echte Frontend-Stand (origin/master) ist **Astro 6 + React 19** + Tailwind v4 + TanStack Query — nicht mehr React 18 + Vite pur. Alte Projekt-Beschreibungen hinken hinterher.

---

## 4. Was uns FEHLT

Fazit: Zwei bestaetigte Luecken (Scan + Druck) plus das Kleider-Datenmodell — alles Neubau. Die Aufwaende sind grobe Schaetzungen, nicht geprueft.

| Baustein | Aufwand grob |
|---|---|
| Barcode-Scan (USB-Scanner tippt wie Tastatur = einfach; Handy-Kamera = mehr Arbeit) | Tage bis ~1 Woche |
| Etiketten-/PDF-Druck (Zebra Browser Print ist gratis — nur mit Zebra-Drucker) | ~1–2 Wochen |
| Varianten-Datenmodell (Modell × Groesse × Farbe) — muss von Tag 1 stimmen | ~1 Woche |
| Post-Etiketten-Anbindung (API gratis, aber Geschaeftskunden-Vertrag noetig; KEINE Test-Umgebung mehr seit 2023 — developer.post.ch) | ~1–2 Wochen + Vertrag frueh |
| Echte Benutzer-Verwaltung (heute: 3 feste Nutzer, 1 gemeinsames Passwort) | Tage |
| Mandanten-Trennung (Bestaende pro Auftraggeber strikt getrennt) | 🔴 offen — haengt an Frage 1; nachtraeglich einbauen ist fast unmoeglich |

---

## 5. MVP-Vorschlag Version 1

1. **Artikel-Stamm mit Groessen-Farben-Matrix** — DER Unterschied zu normaler Lager-Software; nachtraeglich einbauen = Datenmodell-Umbau.
2. **Excel/CSV-Import der Start-Daten** — schlechte Start-Daten sind der Top-Scheiter-Grund bei Lager-Projekten (made4net.com).
3. **Wareneingang mit Barcode-Scan** — Zaehl-Fehler beim Eingang ziehen sich durch alles.
4. **Lagerplatz-Verwaltung (wo liegt was — Stange oder Fach)** — ohne Platz-System sucht man Kleider von Hand.
5. **Echtzeit-Bestand mit Suche** — die Frage "wie viel habe ich wovon, wo?" muss in 5 Sekunden beantwortet sein.
6. **Auftraege + Pickliste mit Scan-Bestaetigung** — verhindert den teuersten Fehler: falsche Groesse verschickt.
7. **Retouren-Abwicklung (zurueck, pruefen, wieder einlagern)** — bei Kleidung kein Randfall, sondern Kern-Prozess.
8. **Handy-tauglich + Aenderungs-Verlauf** — im Lager steht kein PC; die Historie klaert Zaehl-Differenzen.

**Bewusst NICHT in V1:** Post-/Planzer-Etiketten (aber Post-Vertrag SOFORT anstossen, siehe Punkt 8) · QR-Rechnung (bexio ab CHF 29/Monat reicht daneben) · Webshop-Anbindung · Kunden-Portal · Paletten-Versand an Handelsketten (SSCC/EDI) · Saison-Automatik · Prognosen/KI.

**Was sich je nach Finelli-Antwort aendert:**

| Finelli ist… | Folge fuers MVP |
|---|---|
| Haendler (eigene Ware, 1 Lager) | Keine Mandanten-Trennung noetig — dann ehrlich pruefen, ob ein Fertig-Tool reicht |
| Lager-Dienstleister (lagert fuer andere) | Mandanten-Trennung ab Tag 1 ins Datenmodell + Abrechnung der Lager-Leistungen dazu |
| Etwas anderes (z.B. Aufbereitung/Reinigung) | Anderes Produkt — Plan neu machen, nicht diesen Bericht umbiegen |

---

## 6. Markt-Check (ehrlich)

Fertige Tools gibt es ab EUR 24.90 pro Nutzer/Monat (Odoo, odoo.com/pricing) bis ~USD 161/Monat (inFlow) — aber keines kann alle 4 Schweiz-Punkte (Varianten-Matrix + Mandanten-Trennung + CH-Post-Etiketten + QR-Rechnung) unter ~CHF 500/Monat ohne Einrichtungs-Partner.
**Ehrlich:** Ist Finelli ein einfacher Haendler mit 1 Lager, reicht ihm eventuell Odoo oder inFlow — dann sagen wir ihm das und bauen NICHT.
Lagert er fuer mehrere Auftraggeber, ist Eigenbau stark: Mandanten-Trennung kostet im billigsten Fertig-System EUR 1'290/Monat (pulpowms.com/prices), und Planzer-Etiketten hat KEIN geprueftes Lager-Tool eingebaut.

Nachgeprueft (Konkurrenz-Gegenprobe): Die These "zwischen Excel und teurem ERP bedient niemand" kippt als Pauschalsatz — es gibt Miet-Software ab 25–200 CHF/Monat. Sie haelt aber im Kern: KEIN Fertigprodukt liefert alle 4 Schweiz-Anforderungen unter ~CHF 500/Monat sofort mietbar.

---

## 7. Fragen an Finelli (fuers 30-Min-Gespraech)

1. **Was bist du genau: Haendler mit eigener Ware, Lager-Dienstleister fuer mehrere Auftraggeber, oder etwas anderes?** (Kernfrage — entscheidet das halbe Produkt)
2. Deine Zahlen: Wie viele Modelle, Groessen, Farben — und wie viele Auftraege pro Tag?
3. Lieferst du an Laeden (Kartons/Paletten) oder an Endkunden (Einzelpakete) — und wie viele Retouren kommen zurueck?
4. Wie arbeitest du heute — Excel, Papier, altes Programm? Und in welchem Format liegen deine Bestandsdaten?
5. Versand: Post, Planzer, DPD? Wie viele Pakete pro Woche — und hast du schon einen Post-Geschaeftskunden-Vertrag?
6. Was darf die Loesung kosten — einmalig oder monatlich? Und was zahlst du heute fuer deine Ablaeufe?

---

## 8. Grobe Dauer + naechster Schritt

**Dauer: grob 6–10 Wochen bis zum nutzbaren V1.** Zum Vergleich: Agenturen rechnen 3–5 Monate und 30–50k USD (appwrk.com — Zahl von Verkaeufern, mit Vorsicht). Unser Fundament spart den Unterbau. Aber: **Ohne das Finelli-Gespraech ist jede Zahl geraten.**

**Kosten fuer uns:** Betrieb ~CHF 45–50/Monat. Hardware einmalig: Scanner CHF 100–300 + Zebra-Etikettendrucker CHF 400–1'100 (digitec.ch, rajapack.ch). Was Finelli ZAHLEN soll: **weiss nicht** — nie durchgerechnet, gehoert ins Gespraech (Frage 6).

**Naechster Schritt:**
1. Gespraech mit Finelli fuehren — die 6 Fragen oben (30 Min).
2. Falls Versand-Etiketten gewuenscht: Post-Geschaeftskunden-Vertrag sofort anstossen (Zugang ~3 Arbeitstage, keine Test-Umgebung — der Vertrag darf das Projekt nicht blockieren).
3. Erst danach: Feinplan + verbindliche Schaetzung.

---

## Anhang: Vorbehalte des Kritikers (ehrliche Schwachstellen der Recherche)

- Kunden-Typ + echte Zahlen von Finelli fehlen komplett — alle Recherchen RATEN nur; das klaert kein Web, nur das Gespraech.
- Mandanten-Frage unentschieden — veraendert das Datenmodell von Tag 1, nachtraeglich fast unmoeglich.
- Mehrere Schluessel-Zahlen aus interessengefaerbten Quellen (Agentur-Schaetzungen, Anbieter-Blogs) — unverifiziert.
- Retouren-Zahlen sind US-Online-Handel — gelten nicht automatisch fuer Finelli.
- Rechtliches als Lager-DIENSTLEISTER ungeklaert: Haftung/Versicherung fuer fremde Ware, Auftragsverarbeitungs-Vertrag (revDSG), 10 Jahre Beleg-Aufbewahrung.
- Post-API-Details (Onboarding-Dauer, Mindestvolumen) und Passar-Termin Okt 2026 brauchen Beleg von der Original-Quelle.
- Zweites Produkt frisst aus demselben GitHub-3000-Minuten-Topf (war am 13.07. schon leer) — Konsequenz nie abgeschaetzt.
