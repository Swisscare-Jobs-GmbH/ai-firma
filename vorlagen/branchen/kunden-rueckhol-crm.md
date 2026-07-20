# Fachgeschaeft mit Wiederkauf-Potenzial — Kunden-Rueckhol/CRM (BRANCHEN-VORLAGE)

> Herkunft: GzF-Projekt (Schmerz-Landkarte + Angebot 19.07) / destilliert am 2026-07-20.
> Zielbild: Fachgeschaeft ({KUNDE}, z.B. Orthopaedie, Optik, Velo) mit bestehendem
> Branchen-System ({FACH_SYSTEM}, z.B. GP Manager) und tiefem Wiederkauf trotz
> Verbrauchs-Produkt. Verwandt: `shop-detailhandel.md` (andere Branche).

## Fazit

Bei dieser Branche gewinnt man mit **Rueckhol-Erinnerung**: Der Killer-Pain ist fast immer
"Kunden kommen erst nach Jahren oder nie wieder, obwohl das Produkt frueher ersetzt gehoert".
Die Loesung setzt auf das bestehende Fach-System auf (es bleibt fuehrend), ergaenzt Kundendatenbank-
Hygiene (E-Mail-Erfassung ab Neuverkauf!) und getaktete Erinnerungs-Fluesse.

## Kern-Lehren (verallgemeinert)

1. **Start mit Neuverkaeufen, nicht mit Alt-Daten:** Alt-Bestand hat oft keine Kontaktdaten
   (E-Mail fehlt) — der MVP darf nicht am Daten-Export haengen. Erfassung ab Tag 1 neu aufbauen.
2. **Technische Annahmen am ECHTEN System pruefen, bevor gebaut wird:** Export-Faehigkeit des
   Fach-Systems ist oft unbewiesen ("glaube schwierig"); Plan B (direkter DB-Zugriff) frueh
   verifizieren. Das groesste Bau-Risiko liegt fast nie im eigenen Code.
3. **Daten-Grenze hart ziehen:** Nur Name, Kontakt, Kaufdatum, Produkt-Typ — KEINE Gesundheits-/
   Sensibel-Daten exportieren oder verarbeiten (revDSG).
4. **Alleinstellung pruefen statt behaupten:** Vorher live checken, ob Mitbewerber im Umkreis
   Rueckhol-Erinnerungen anbieten (bei GzF: 0 von 5 ✅ live geprueft 19.07) — nur dann als
   Alleinstellung verkaufen.
5. **Anrede-Falle:** Inhaber-Name != Laden-Name (Vorgaenger-Namen!). Vor jedem Kontakt den
   echten Inhaber verifizieren (Handelsregister + Impressum).

## Klaerungsfragen-Katalog vor Baustart

1. Wieviele Kaeufe/Monat, wieviel davon Wiederkauf? Nach welcher Zeit gehoert das Produkt ersetzt?
2. Welche Kundendaten existieren im Fach-System, wieviele mit E-Mail/Handy?
3. Kann das Fach-System exportieren (CSV/DB)? Am echten System getestet oder nur vermutet?
4. Wer beantwortet Antworten auf Erinnerungen (Kapazitaet im Laden)?
5. Welche Kanaele passen zur Kundschaft ({KANAL}: Mail, SMS, WhatsApp, Brief)?

## Platzhalter-Legende (Kurz)

| Platzhalter | Bedeutung |
|---|---|
| {KUNDE} | Kundenname |
| {FACH_SYSTEM} | fuehrendes Branchen-System (bleibt, wird nicht ersetzt) |
| {KANAL} | Erinnerungs-Kanal passend zur Kundschaft |
