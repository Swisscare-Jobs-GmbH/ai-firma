# Werkvertrag {KUNDE} — VORLAGE

> Herkunft: destilliert aus dem Finelli-Werkvertrag (Deal V3, 2026-07-18). Struktur + bewiesene
> Klauseln bleiben, alles Kunden-Konkrete ist `{PLATZHALTER}`.
>
> **VOR Unterschrift von einem Juristen pruefen lassen** (~200-400 CHF — lohnt ab ~10'000 CHF
> Volumen). Die Ziffern-Nummerierung nicht umstellen; **Ziffer 8 (Wiederverwendungs-Klausel)
> MUSS in jeden Vertrag** — sie erlaubt uns, allgemeine Bausteine (Login, Schnittstellen,
> Berichts-Motor) beim naechsten Kunden wiederzuverwenden.
>
> Absender: `{ABSENDER}` (offener Firmen-Entscheid — vorerst Swiss Care Jobs GmbH).
> Platzhalter-Legende steht am Ende.

**Parteien:** {ABSENDER} ("Anbieter") und {KUNDE_RECHTSFORM}, {KUNDE_ORT} ("Kunde").

**1. Gegenstand (Version 1).** {WERK_NAME} — {WERK_KURZBESCHRIEB} — als {AUFSATZ_ODER_STANDALONE}
auf {PLATTFORM_ODER_BESTAND} des Kunden, bestehend aus:
- (a) {BAUSTEIN_A}
- (b) {BAUSTEIN_B}
- (c) {BAUSTEIN_C}
- (d) {BAUSTEIN_D}
- (e) {BAUSTEIN_E}

Dazu gehoeren: {EINRICHTUNG_VOR_ORT} und die Schulung der Mitarbeiter. {FUEHRENDES_SYSTEM} bleibt
das fuehrende System (Ziffer 7).

**2. Abnahme.** Gemeinsame Pruef-Liste mit max. 10 Punkten (Anhang A). Der Kunde prueft und
meldet Maengel innert 14 Tagen schriftlich. **Abnahme-Fiktion:** Liegt 30 Tage nach Bereitstellung
keine schriftliche Maengel-Ruege vor ODER setzt der Kunde das System produktiv im Tagesgeschaeft
ein, gilt das Werk als abgenommen. Punkte ausserhalb der Pruef-Liste sind Zusatzauftraege mit
eigenem Preis.

**3. Verguetung.**
- **Werk-Preis Version 1: CHF {WERK_PREIS}.** Keine Vorkasse. Zahlbar in **{LAUFZEIT} Monatsraten
  a CHF {PREIS_RATE}**, erste Rate im Monat nach Abnahme, jeweils per Monatsende.
- **Betriebs-Gebuehr: CHF {BETRIEB_PREIS} pro Monat** ab Abnahme (Umfang: Ziffer 4), zusaetzlich
  zur Rate. Laufzeit mindestens bis zur vollstaendigen Zahlung des Werk-Preises; danach monatlich
  kuendbar auf Monatsende.
- **Grundsatz:** Der Werk-Preis wird nicht reduziert und nicht erlassen — auch nicht bei
  Stoerungen. Stoerungen geben ausschliesslich MEHR ZEIT (Raten-Verschiebung nach Ziffer 5) sowie
  ggf. Erlass der Betriebs-Gebuehr des Stoerungs-Monats. Einzige Verkleinerung der Restschuld ist
  der Kunden-Joker (Ziffer 6).
- **Verzug:** Bleibt eine Rate trotz Mahnung und Nachfrist von 20 Tagen unbezahlt, wird die gesamte
  Restschuld sofort faellig.

**4. Betriebs-Umfang (CHF {BETRIEB_PREIS}/Mt.).** Server und Betrieb, Stoerungs-Behebung, Wartung
inkl. Nachzug bei {SCHNITTSTELLEN_AENDERUNG}, Betrieb {LAUFENDER_KI_TEIL}, monatlicher
30-Min-Check-in. NICHT enthalten: neue Funktionen und Ausbau-Versionen (Ziffer 6, Versions-Leiter),
Fremdkosten (z.B. {FREMDKOSTEN_BEISPIELE}) — diese traegt der Kunde direkt.

**5. 48-Stunden-Garantie, Gewaehrleistung, Haftung.**
- **48h-Flick-Versprechen:** Eine **betriebsverhindernde** Stoerung (das System ist fuer den
  Tagesbetrieb unbrauchbar), die der Kunde gemeldet hat und die der Anbieter zu vertreten hat, wird
  innert 48 Stunden ab Meldung behoben. Gelingt das nicht: Die Monatsrate des Stoerungs-Monats
  **verschiebt sich** um einen Monat nach hinten (Laufzeit verlaengert sich entsprechend) und die
  Betriebs-Gebuehr (CHF {BETRIEB_PREIS}) dieses Monats wird **erlassen**.
- **Ausschluesse:** Keine Stoerung im Sinne dieser Garantie sind Ausfaelle von Dritt-Diensten (z.B.
  {DRITT_DIENSTE}, Hosting-Anbieter, Internet/Strom beim Kunden), Fehlbedienung durch den Kunden
  sowie Eingriffe Dritter am System.
- **Pause-Deckel:** Ueber die gesamte Laufzeit verschieben sich hoechstens **3 Monatsraten** aus
  Garantie-Faellen. Weitergehende gesetzliche Rechte bei anhaltender Schlechterfuellung bleiben
  vorbehalten.
- **Gewaehrleistung:** 12 Monate kostenlose Nachbesserung ab Abnahme (ersetzt die gesetzliche
  Regelung).
- **Haftung:** Gesamthaft begrenzt auf die vom Kunden bis zum Ereignis bezahlten Raten des
  Werk-Preises, hoechstens CHF {WERK_PREIS}. Keine Haftung fuer Folgeschaeden, entgangenen Gewinn
  oder Datenverluste ausserhalb des Einflusses des Anbieters. {BESTAETIGEN_KLICK_SATZ}

**6. Kunden-Joker, Quartals-Tor, Versions-Leiter.**
- **Kunden-Joker:** Vermittelt der Kunde einen Neukunden, der einen Software-Vertrag mit dem
  Anbieter unterschreibt, werden **50% des Einmal-Honorars (Werk-Preis) des vermittelten Kunden**
  auf die Restschuld des Kunden angerechnet. Ist das vermittelte Projekt groesser als
  **CHF {JOKER_GROSS_SCHWELLE}** Werk-Preis: Die gesamte Restschuld ist erlassen UND die naechste
  Version wird kostenlos gebaut. Riegel: Anrechnung erfolgt bar-los (keine Auszahlung), hoechstens
  bis zur Hoehe der Restschuld, nur auf das Einmal-Honorar des Neukunden (nicht auf dessen laufende
  Gebuehren). Die Anrechnung wird bei Vertrags-Unterschrift des Neukunden gutgeschrieben; zahlt der
  Neukunde sein Honorar nicht (Ausfall trotz Mahnung), lebt die angerechnete Restschuld wieder auf.
- **Quartals-Tor:** Die naechste Version (V2 usw.) wird gebaut, sobald der Kunde die Restschuld der
  Vorversion innert eines Quartals beglichen hat ODER einen Neukunden (Joker) gebracht hat. Jede
  neue Version erhaelt ein eigenes Angebot nach demselben Muster (Preis, Raten, Betriebs-Gebuehr
  bleibt CHF {BETRIEB_PREIS} gesamt).
- **Tueroeffner:** Der Kunde stellt den Anbieter innert 6 Monaten bei 3 Firmen persoenlich vor (z.B.
  {TUEROEFFNER_BEISPIELE}).
- **Schaufenster:** Der Anbieter darf {KUNDE} mit Logo als Referenz nennen und das System
  {LIVE_DEMO_ORT} Interessenten live zeigen (Termine in Absprache; Text-Freigabe durch den Kunden).
- **Beweis-Bonus:** Gibt der Kunde 90 Tage nach Abnahme ein Video-Testimonial, wird ihm 1 Monat
  Betriebs-Gebuehr (CHF {BETRIEB_PREIS}) erlassen. (Der Werk-Preis bleibt unveraendert — Grundsatz
  Ziffer 3.)

**7. Daten + {FUEHRENDES_SYSTEM}.** {FUEHRENDES_SYSTEM} ist die einzige Quelle der Wahrheit fuer
{WAHRHEITS_GEGENSTAND}; bei Abweichungen gilt {FUEHRENDES_SYSTEM}. Die App liest und schreibt nur
{ERLAUBTE_DATEN} — {AUSGESCHLOSSENE_DATEN}. {KI_DATENSCHUTZ_SATZ} Der {KUNDEN_ACCOUNT} samt Daten
bleibt Eigentum des Kunden.

**8. Nutzungsrecht + Code.** Der Kunde erhaelt das unbefristete Nutzungsrecht an Version 1 **mit
vollstaendiger Zahlung des Werk-Preises** (Zahlung aller Raten oder Erlass per Kunden-Joker). Bis
dahin besteht ein einfaches Nutzungsrecht auf Zeit, solange die Raten vertragsgemaess bezahlt
werden. **Allgemeine Bausteine (Login, Schnittstellen-Anbindung, Berichts-Motor) bleiben beim
Anbieter wiederverwendbar.**

**{PRUEFEN_ANWALT}** — Eigentums-Klarstellung (CH-Werkvertragsrecht-ueblich): Vorlagen, Werkzeuge und
wiederverwendbare Bausteine bleiben Eigentum der Auftragnehmerin; der Kunde erhaelt ein einfaches
Nutzungsrecht am gelieferten Werk.

> **Diese Ziffer 8 ist Pflicht in JEDEM Vertrag.** Sie trennt das kundenspezifische Werk (gehoert
> nach Zahlung dem Kunden) von den wiederverwendbaren Grund-Bausteinen (bleiben unser Eigentum) —
> nur so kann der naechste Kunden-Bau auf dem bestehenden Fundament aufsetzen.

**9. Ende.** Endet die Betriebs-Gebuehr nach vollstaendiger Zahlung des Werk-Preises, laeuft die App
3 Monate weiter (Auslauf-Frist); danach Abschaltung oder Uebergabe an den Kunden gegen Aufwand
(Tagessatz CHF {TAGESSATZ}). Bei Vertragsende vor vollstaendiger Zahlung (Ziffer 3, Verzug)
erlischt das Nutzungsrecht mit der Abschaltung.

**Anhang A:** Abnahme-Liste (wird vor Baustart gemeinsam ausgefuellt, max. 10 Punkte — Vorlage:
`abnahme-liste.md`).

Ort/Datum: ____________  Anbieter: ____________  Kunde: ____________

---

## Platzhalter-Legende

| Platzhalter | Was rein muss | Finelli-Beispiel (Referenz) |
|---|---|---|
| `{ABSENDER}` | Firmenname, der verkauft | Swiss Care Jobs GmbH |
| `{KUNDE}` / `{KUNDE_RECHTSFORM}` / `{KUNDE_ORT}` | Kunden-Name / volle Rechtsform / Sitz | Finelli / Finelli Studios AG / Zuerich |
| `{WERK_NAME}` / `{WERK_KURZBESCHRIEB}` | Produktname + 1 Satz was es ist | "Finelli Cockpit" / Lager- und Verkaufs-System |
| `{AUFSATZ_ODER_STANDALONE}` / `{PLATTFORM_ODER_BESTAND}` | worauf es aufsetzt | Aufsatz auf / den Shopify-Shop |
| `{BAUSTEIN_A..E}` | die 3-5 Kern-Bausteine | Lagerplatz-Verwaltung, Pickliste, ... |
| `{EINRICHTUNG_VOR_ORT}` | Vor-Ort-Leistung | ein Einsatz-Tag: zaehlen, etikettieren, einraeumen |
| `{FUEHRENDES_SYSTEM}` | System, das den Ton angibt | Shopify |
| `{WERK_PREIS}` | Einmal-Preis | 18'000 |
| `{LAUFZEIT}` / `{PREIS_RATE}` | Anzahl Raten / Rate pro Monat | 24 / 750 |
| `{BETRIEB_PREIS}` | Betriebs-Gebuehr/Monat | 500 |
| `{SCHNITTSTELLEN_AENDERUNG}` | was gewartet wird | Shopify-Schnittstellen-Aenderungen |
| `{LAUFENDER_KI_TEIL}` | laufender KI-Dienst im Abo | des woechentlichen KI-Berichts |
| `{FREMDKOSTEN_BEISPIELE}` | Fremdkosten des Kunden | Scanner/Drucker-Hardware, Shopify-Gebuehren |
| `{DRITT_DIENSTE}` | ausgeschlossene Dritt-Ausfaelle | Shopify |
| `{BESTAETIGEN_KLICK_SATZ}` | Schreib-Schutz-Satz (falls App schreibt) | "Jede Bestands-Buchung ... Bestaetigen-Klick ... protokolliert." |
| `{JOKER_GROSS_SCHWELLE}` | Schwelle "grosser Kunde" | 30'000 |
| `{TUEROEFFNER_BEISPIELE}` | Vorstell-Ziele | Handels-/Filialpartner, Apotheken |
| `{LIVE_DEMO_ORT}` | wo live gezeigt wird | "im Laden" |
| `{WAHRHEITS_GEGENSTAND}` / `{ERLAUBTE_DATEN}` / `{AUSGESCHLOSSENE_DATEN}` | Daten-Grenzen | Bestand / Artikel-, Bestands-, Verkaufs-Zahlen / keine Endkunden-Daten |
| `{KI_DATENSCHUTZ_SATZ}` | Datenschutz-Zusage | "KI-Auswertung erfolgt ohne Personendaten (revDSG-konform)." |
| `{KUNDEN_ACCOUNT}` | Konto des Kunden | Shopify-Account |
| `{TAGESSATZ}` | Uebergabe-Tagessatz | 900 |
