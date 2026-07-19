# Wer ist Kaufmann Gut zu Fuss? — Firmen-Profil (Recherche 19.07)

> Erstellt 2026-07-19 durch HQ-Recherche-Schwarm (4 Spaeher + 1 Kritiker, ~430k Tokens).
> Gehoert zu: [Fragen-Zettel](2026-07-19-gzf-schmerz-fragen.md) · Playbook: `2026-07-19-playbook-neukunde-software.md`.
> Sicherheit der Zuordnung: **hoch** — Zefix-Eintrag + Website + Telefon stimmen eindeutig ueberein.

## Fazit

Kaufmann Gut zu Fuss ist ein **Einzelunternehmen in Rorschach SG** — Orthopaedie-Fachgeschaeft
(Masseinlagen, orthopaedische Schuhe, Kompressionsstruempfe, Schuhservice).
**Der Inhaber heisst NICHT Kaufmann, sondern Farhad Akbarzada** (seit 2015, uebernahm das
Traditionsgeschaeft von Matthias Kaufmann, HR-Spur bis 2006). ⚠️ Im Gespraech NIE "Herr Kaufmann" sagen.

**Wichtigster Risiko-Fund:** Der Baustein "CSV-Export 1x/Woche aus GP Manager" aus dem
Kunden-Konzept ist in der oeffentlichen GP-Manager-Doku **NICHT belegt** — dokumentiert ist nur
ein proprietaeres GPF-Format. Vor dem Bau am echten System zeigen lassen. Plan B: SQL-Zugriff
auf die GP-Datenbank (Microsoft SQL Server Express, machbar, braucht IT-Zugang).

## Die Firma in 6 Zeilen

| Punkt | Antwort | Beleg |
|---|---|---|
| Was | Orthopaedie-Fachgeschaeft: Masseinlagen (auch Diabetiker/Kinder/Sport/sensomotorisch nach Jahrling), orthopaedische Serien-/Massschuhe, Bandagen, Kompressionsstruempfe, Schuhservice | gut-zu-fuss.ch |
| Rechtsform | Einzelunternehmen, UID CHE-153.021.030, eingetragen 11.06.2015 | Zefix-API |
| Chef | **Farhad Akbarzada** — Inhaber mit Einzelunterschrift, laut Website 30+ Jahre Orthopaedietechniker (Eigenangabe) | business-monitor.ch + Website |
| Adresse | Hauptstrasse 40, 9400 Rorschach SG (einziger Standort) · Tel +41 71 841 00 61 · laden@gut-zu-fuss.ch | Website/search.ch |
| Software | GP Manager (go-tec/GeBioM, Muenster DE; CH-Partner: H. Siegenthaler AG Herzogenbuchsee) — nur aus Konzept-Dokument bekannt, oeffentlich nicht verifizierbar | gpsupport.de + Konzept-Doc |
| Online | Wix-Website MIT Online-Terminbuchung (kostenlose 1h-Erstberatung!), Instagram/Facebook/LinkedIn vorhanden, KEIN Newsletter | gut-zu-fuss.ch/online-buchen |

**Oeffnungszeiten (widerspruechlich):** Website sagt Di–Fr 09–12 + 13:30–18:30, Sa 09–12
(**Montag zu**); search.ch/local.ch sagen Mo–Fr. → Anruf Di–Fr vormittags am sichersten.

## Bewertungen (Playbook-Regel 2: live verifiziert)

| Portal | Zahl | Stand |
|---|---|---|
| **Google Maps** | **4,6★ / 22 Bewertungen** — 17× 5★, 3× 4★, 1× 3★, 0× 2★, 1× 1★ | LIVE im Browser gezaehlt 19.07 (HQ selbst + Spaeher unabhaengig, identisch) |
| Trustpilot | kein Eintrag (404, live geprueft) | 19.07 |
| search.ch | 4.7 / 3 Bewertungen (local.ch zeigt 0 — gleiche Datenbasis, nur Google-Zahl im Pitch verwenden) | 19.07 |

- Maps-Link zum Nachpruefen: https://maps.google.com/?cid=279202168046168637
- **Lob-Themen:** Beratung (Google-Themen-Chip: 3×), Wirkung der Einlagen (Knie/Stabilitaet), Reparaturdienst.
- Bestes Zitat (5★): "Ich hatte lange Zeit starke Probleme mit den Knien... dank der Unterstuetzung hier bin ich wieder viel stabiler... selbst auf der Baustelle, beim Tragen oder laengeren Stehen merke ich den Unterschied."
- ⚠️ Die Texte der einen 1★- und der einen 3★-Bewertung sind ohne Google-Login nicht abrufbar (evtl. reine Sterne ohne Text). Vor dem Termin 2 Min eingeloggt nachschauen: Rezensionen → Sortieren → Niedrigste.

## Stolz-Punkte (fuer den Angebots-Einstieg — nie negativ eroeffnen!)

1. Traditionsgeschaeft der Bodenseeregion (HR-Spur bis 2006, "lange Tradition").
2. 30+ Jahre Orthopaedietechniker-Erfahrung des Inhabers (Eigenangabe — als Kompliment nutzen, nicht als Beleg).
3. 4,6★ bei Google, 20 von 22 Bewertungen 4-5★ — Beratung ist DAS Lob-Thema.
4. Spezialitaeten, die nicht jeder hat: sensomotorische Einlagen nach Jahrling, Diabetiker-/Kinder-Einlagen, Gipsmodell-Einlagen.
5. Alles unter einem Dach: Analyse → Einlage/Schuh → Reparatur — und schon HEUTE Online-Terminbuchung (moderner als viele Kollegen).
6. Er hat das Datenbank-Konzept SELBST geschrieben — er weiss, was er will. Das ist Vorlage, kein Verkaufs-Hindernis.

## Schmerz-Hypothesen (Top 5 nach CHF-Wert — ALLES Annahmen bis seine Zahlen da sind)

| # | Schmerz | CHF/Jahr (Annahme) | MVP-Loesung |
|---|---|---|---|
| 1 | Verpasste Einlagen-Erneuerung (Zyklus ~1 Jahr, Selbstzahler, niemand erinnert) | 21'000–42'000 | 1-Jahres-Mail ab Kaufdatum + Buchungslink |
| 2 | IV-Anspruch verfaellt: 2 Paar Spezialschuhe/Jahr, Eigenanteil nur CHF 120 — Patienten wissen es nicht | 12'000–30'000 | KK/IV-Strecke mit Anspruchs-Reminder |
| 3 | Zuweiser-Aerzte kriegen nie Feedback — Kanal haengt an Gewohnheit | 8'000–25'000 | Quartals-Report pro Arzt aus Tag-14-Fragebogen |
| 4 | Keine 6-Monats-Kontrolle → durchgetretene Einlagen, "wirkt nicht mehr"-Frust | 8'000–15'000 | 6-Monats-Check-Mail + Cross-Selling im Laden |
| 5 | Einlauf-Abbrecher: Einlage landet in der Schublade, Kunde verloren | 7'000–10'000 | Tag-3-Einlauftipps + Tag-14-Abfang |

Weitere: Kompressionsstruempfe-MiGeL-Zyklus (2 Paar/Jahr kassenbezahlt, 3-6k), Doppel-Erfassungs-Zeitwert (5-8k),
Bewertungs-Motor (4-8k), nDSG-Einwilligungs-Unterbau (Tuersteher fuer alles), Kopf-Monopol des Inhabers (Versicherungs-Wert).
**Gesamt-Potenzial grob CHF 60'000–130'000/Jahr — steht komplett auf Annahme "500-800 aktive Kunden". Im Gespraech mit SEINEN Zahlen live rechnen.**

Harte Branchen-Fakten (belegt): Masseinlage CH CHF 330–600 · Grundversicherung zahlt Einlagen NICHT (Selbstzahler!) ·
Lebensdauer 6–12 Mt · IV: 2 Paar/Jahr, Eigenanteil 120/70 · MiGeL: 2 Paar Struempfe/Jahr · 70-80% folgen Arzt-Empfehlung ·
Recall-Analogie Zahnarzt: 20% No-Show ohne vs. 5% mit Erinnerung.

## GP Manager — was die Software kann und was nicht

**Kann:** Kundenverwaltung + Fussscan/Druckmessung + CAD bis Fertigung, Dokumente pro Kunde, Duplikat-Merge.
**Kann NICHT:** Terminkalender, Abrechnung, CRM, Newsletter, Mail-Automation ("GP Mail" = Datentransfer zwischen
GP-Installationen, KEIN Kunden-Mailing), keine offene API, **kein dokumentierter CSV-Export der Kundenliste**.
→ Unsere Luecke ist real und bestaetigt. Technik-Unterbau: MS SQL Server Express (DB "GpBank") — Plan B fuer Export.

**MVP-Risiken:** CSV-Export unbestaetigt · Version unklar (V6.5 vs V7) · E-Mail evtl. gar nicht als Feld gepflegt ·
Umlaute/Encoding-Falle (ASCII/DBF-Welt) · Duplikate real · Import muss idempotent sein (gleiche Zeile 2× ≠ 2 Mails) ·
kein Rueckkanal → strikt one-way bauen · Gesundheitsdaten NIE mitexportieren (nur Name, Mail, Kaufdatum, Produkt-Typ).

## Luecken (Kritiker) — muessen ins Gespraech oder vorher erledigt werden

1. 🔴 **Seine echten Zahlen** (Kunden, Einlagen/Jahr, IV-Anteil, Preise) — alle CHF-Schaetzungen sind gewuerfelt bis dahin.
2. 🔴 **GP-Manager-Beweis am Rechner:** "Zeigen Sie mir, wie Sie heute eine Kundenliste rausziehen wuerden" + Version ablesen.
3. 🔴 **E-Mail-Abdeckung:** bei wie vielen Kunden ist eine Adresse gepflegt? (Ohne Mail keine Strecke.)
4. 🟡 1★/3★-Google-Texte eingeloggt nachlesen (vor Termin, 2 Min).
5. 🟡 CH-Recht Bestandskunden-Mails: UWG Art. 3 Abs. 1 lit. o (Bestandskunden-Ausnahme mit Opt-out) vor Gespraech 30 Min verifizieren.
6. 🟡 Zuweiser konkret (welche Aerzte, wie viele), Mitarbeiterzahl, Wettbewerb Region (Ortho-Team etc.), Montag offen?

## Spaeher-Widersprueche (Kritiker gefunden — NICHT ungeprueft verwenden)

- Instagram "~80 Follower" (Reviews-Spaeher) vs. "Login-Mauer" (Profil-Spaeher) → Zahl unbelegt.
- Facebook-Seite: existiert laut Profil-Spaeher (URL von Website), Reviews-Spaeher fand keine → URL gilt.
- Umzugs-Datum Loewenstrasse→Hauptstrasse: unbelegt (HR-Publikation 01.12.2021 koennte es sein).
- "GP Mail = Mails an Kunden" (Schmerz-Spaeher) vs. "nur Installations-Transfer" (GPM-Spaeher, besser belegt) → vor Pitch klaeren, sonst widerlegt er uns am eigenen Bildschirm.

## Quellen-Abdeckung

Zefix-API (amtlich) · business-monitor.ch (HR-Historie) · gut-zu-fuss.ch (alle Unterseiten) · local.ch/search.ch/citymed ·
Google Maps LIVE · Trustpilot (404) · gpsupport.de + go-tec.de + Handbuecher V6/V7 (GP Manager) · ahv-iv.ch/BSV/MiGeL
(Anspruchs-Regeln) · insole.ch/numo.ch (CH-Preise) · brightlocal.com (Review-Statistik).
Nicht erreichbar: Moneyhouse/Kompass (403 → Mitarbeiterzahl offen), Social-Follower (Login-Mauern).


---

## Nachtrag 19.07 abends — 2. Schwarm-Lauf (Trockenflug, nur oeffentliche Quellen, live)

> 6 Spaeher + Synthese. Bestaetigt Zefix-Profil + Inhaber. NEU gegenueber oben:

- **Impressum/AGB auf gut-zu-fuss.ch sind Platzhalter** (falsche UID "CHE-123456789", deutsches
  "HRB 9876") — rechtlich angreifbar. **Quick-Win fuers Angebot:** echte Firmendaten eintragen.
- **Konkurrenz-Check Umkreis (St. Gallen/Amriswil/Altstaetten): 0 von 5 Betrieben wirbt mit
  Rueckhol-Erinnerung** — Recall ist Alleinstellung, nicht nur Feature. Online-Buchung haben 2 von 5
  (nur Gleichstand). Einziger digital starker Gegner: Kette ORTHO-TEAM.
- **Story-Gold:** 2 Braende (Dez 2019 + Feb 2021) zerstoerten den alten Laden Loewenstrasse,
  dazwischen Lockdown; Aug 2021 Neustart Hauptstrasse 40 — er nennt es selbst "der 3. Start"
  (Rorschacher Echo 21.05.2021). Perfekter Stolz-Einstieg.
- **Wix Bookings hat nur 2 Termin-Typen** (Erstberatung gratis 1h + Folgeberatung) — dahinter
  keine Kartei/Erinnerung sichtbar.
- **GP Manager oeffentlich unsichtbar** — der 2. Lauf fand ihn in keiner Quelle. Deckt sich mit dem
  Risiko-Fund oben: Faehigkeiten NUR aus dem Kunden-Konzept bekannt, am echten System zeigen lassen.
- Schmerz-Hypothesen nach Hormozi-Ranking: eigene Datei [2026-07-19-gzf-schmerz-hypothesen.md](2026-07-19-gzf-schmerz-hypothesen.md).
