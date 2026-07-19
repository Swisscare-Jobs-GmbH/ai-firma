# Zugang einrichten — Anleitung fuer {KUNDE} (VORLAGE)

> Herkunft: Finelli-Shopify-Zugang. Zweck: dem Kunden Schritt fuer Schritt zeigen, wie er uns sicher
> Zugang zu seinem System gibt. Diese Datei ins Kunden-Repo als `docs/ZUGANG.md` kopieren, den
> passenden Plattform-Abschnitt behalten, Rest loeschen. Die Bloecke "Schluessel sicher uebergeben"
> und "Warum wir keine Kundendaten wollen" gelten fuer JEDE Plattform — immer mitnehmen.

Hallo {KUNDE_ANSPRECHPARTNER},

damit wir {PRODUKT_NAME} an dein System anschliessen koennen, brauchen wir einmalig einen
Zugang mit **genau den noetigen Rechten — nicht mehr**. Weniger Zugriff = weniger Risiko fuer dich.
So geht's:

---

## Plattform: Shopify (Beispiel — konkret durchgespielt)

> Dauer ~10 Min. Kostenlos, gilt nur fuer deinen Shop, jederzeit wieder loeschbar.

### Schritt 1: App anlegen
1. Oeffne deinen **Shopify-Admin** (dein normaler Shop-Login).
2. Unten links auf **Einstellungen**.
3. Auf **Apps und Vertriebskanaele**.
4. Oben auf **Apps entwickeln** (falls gefragt: "Entwicklung von Custom Apps erlauben" bestaetigen).
5. Auf **App erstellen** und nenne sie **"{PRODUKT_NAME}"**.

### Schritt 2: Berechtigungen ankreuzen
In der neuen App auf **"Admin-API-Integration konfigurieren"** klicken und **genau diese** Haken setzen:

| Berechtigung | Wozu |
|---|---|
| **Bestand** — Lesen **und** Schreiben | Bestand anzeigen und Buchungen eintragen |
| **Lagerorte** — Lesen | Standorte unterscheiden |
| **Umlagerungen (Transfers)** — Schreiben | Ware zwischen Standorten buchen |
| **Bestellungen** — Lesen | Verkaufszahlen fuer die Vorschlaege |

**Wichtig: KEINE Haken bei Kunden/Kundendaten setzen** (warum, steht unten). Danach **Speichern** und
die App **installieren**.

### Schritt 3: Schluessel sicher uebergeben
Nach dem Installieren zeigt Shopify einmalig den **Admin-API-Zugriffsschluessel** (beginnt mit
`shpat_...`). Siehe Block "Schluessel sicher an uns geben".

---

## Plattform: {PLATTFORM_2} (Vorlage — pro weiterer Plattform kopieren)

> Fuer jede weitere Plattform (z.B. GP Manager, ein Kassen-/Branchen-System, eine Buchhaltung) diesen
> Abschnitt kopieren und ausfuellen. Wenn die Plattform KEINE Schnittstelle/App-Rechte hat, hier den
> Plan B notieren (z.B. direkter Datenbank-Zugriff, CSV-Export, Bildschirm-Freigabe beim Termin).

### Schritt 1: Zugang/Integration anlegen
{PLATTFORM_2_SCHRITT_1 — wo im System, wie heisst der Menuepunkt}.

### Schritt 2: Rechte begrenzen
Nur diese Rechte: {PLATTFORM_2_RECHTE}. **Keine {PLATTFORM_2_VERBOTENE_RECHTE}.**

### Schritt 3: Zugang sicher uebergeben
{PLATTFORM_2_SCHLUESSEL_ART — Token / Login / Export-Datei} — siehe Block "Schluessel sicher an uns geben".

**Plan B, falls keine Schnittstelle:** {PLATTFORM_2_PLAN_B}.

---

## Schluessel sicher an uns geben (gilt fuer jede Plattform)

- **Bitte NICHT einfach per Mail im Klartext schicken.** Der Schluessel ist wie ein Haustuer-Schluessel
  zu deinen Daten.
- Sicher geht es so (eins reicht):
  - **A = Telefonisch:** Du rufst uns an und liest ihn vor. *(Empfehlung — einfachste Variante)*
  - **B = Einmal-Link:** Auf einer Selbstzerstoer-Seite (z.B. onetimesecret.com) einfuegen und uns nur
    den Link schicken — der Link zerstoert sich nach einmal Oeffnen selbst.

Falls der Schluessel doch mal offen verschickt wurde: kein Drama — im System "Schluessel widerrufen",
neuen erzeugen, sicher uebergeben.

## Warum wir KEINE {VERBOTENE_DATEN} wollen

Wir brauchen fuer {PRODUKT_NAME} nur {ERLAUBTE_DATEN} — nie {VERBOTENE_DATEN} deiner Kunden. Weniger
Zugriff = weniger Risiko fuer dich und keine Datenschutz-Baustelle. Ausserdem verlangen manche
Systeme fuer Kundendaten-Zugriff einen teureren Plan — den sparen wir uns beide.

---

## Platzhalter-Legende (Kurz)

`{KUNDE}`/`{KUNDE_ANSPRECHPARTNER}`/`{PRODUKT_NAME}` · `{PLATTFORM_2}` + `{PLATTFORM_2_*}` = weitere
Plattform (Schritte/Rechte/Schluessel/Plan B) · `{ERLAUBTE_DATEN}`/`{VERBOTENE_DATEN}` = Daten-Grenze.
