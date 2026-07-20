# Phase 6 — Betrieb (das Abo halten)

> Ziel: {KUNDE} bleibt zahlender Abo-Kunde, weil er den Wert JEDEN Monat sieht.
> Dauer: laufend ab Go-Live (Phase 5). Baut auf dem Werkvertrag Ziffer 4 (Betriebs-Umfang) auf.
> Herkunft: Tiefen-Recherche 20.07. (`markt/2026-07-20-tiefenrecherche-markt-konkurrenz-swot-prozess.md`).

## Fazit

**Der Verkauf ist erst halb gewonnen, wenn der Kunde unterschreibt — die andere Haelfte ist der
Betrieb.** Markt-Richtwert: Digital-Dienstleister verlieren 20-40% ihrer Kunden im 1. Jahr, davon
60-70% in den ersten 6 Monaten. Der Grund ist fast nie schlechte Arbeit, sondern **unsichtbarer Wert
+ ungemanagte Erwartungen** (Kuendigungs-Grund Nr. 1: 48%; Preis erst auf Platz 6). Darum ist Phase 6
kein Nice-to-have, sondern die Lebensversicherung des Monats-Abos.

> **Alle Zahlen unten sind Markt-Richtwerte (🔍 nicht gegen-geprueft, Pruef-Schwarm starb am
> Kostenlimit).** Als Orientierung nutzen, nie als garantierten Fakt an den Kunden weitergeben.

## Das 30/60/90-Ritual (der feste Rhythmus)

| Wann | Was | Warum |
|---|---|---|
| **Woche 1-4** | Jede Woche 1 kurzer Check (Anruf/WhatsApp, ~10 Min) + Montag der KI-Wochen-Bericht (Schwarm `ki-wochen-bericht`) | Der Kunde entscheidet in den ersten Wochen, ob er bleibt — da darf er sich nie allein fuehlen |
| **Tag 30** | Review-Gespraech „Erwartung vs. Erlebnis" (30 Min): Was hast du erwartet? Was erlebst du? | Erwartungs-Abgleich frueh = Markt-Richtwert 15-20 Punkte bessere Kundenbindung |
| **Tag 60** | Review (30 Min) + 1. Baustein-Fahrplan-Update | Zeigt: das System waechst, steht nicht still |
| **Tag 90** | Review (30 Min) + **Referral-Moment** (siehe unten) | Ab hier steigt die Halte-Quote stark — jetzt Referenz + Joker ansprechen |
| **ab Monat 4** | Monatlicher 30-Min-Check-in (so schon im Werkvertrag Ziffer 4 zugesagt) | Vertragspflicht + Beziehungspflege in einem |

## Der Monats-Wert-Bericht (das Herzstueck)

**1 Seite, Kunden-Sprache, Ergebnisse statt Aufgaben.** Markt-Richtwert: ein Wert-Bericht halbiert die
fruehe Abwanderung und kostet nur ~90 Min/Monat. Nicht „ich habe X gebaut", sondern „X ist fuer dich
passiert".

Skelett (pro Kunde anpassen):

```
BETREUUNGS-BERICHT {KUNDE} — {MONAT}

1. Was diesen Monat fuer dich lief
   - {Ergebnis 1 in Kunden-Sprache — z.B. "12 Std Handarbeit gespart"}
   - {Ergebnis 2 — z.B. "3 Fehlbestellungen verhindert"}

2. Die eine Zahl des Monats
   - {EINE Kennzahl, die zaehlt — z.B. "Bestands-Genauigkeit: 96%"}

3. Was naechsten Monat kommt
   - {der naechste Baustein / die naechste Verbesserung}
```

Regel: **Ergebnisse, nie Aufgaben-Liste.** „47 gerettete Verkaeufe" schlaegt „8 Code-Aenderungen".

## Der Quick-Win (erste 30 Tage)

Ein **sichtbarer Gewinn in den ersten 30 Tagen** — wird schon im Kickoff (Phase 5) benannt und dann
bewusst frueh geliefert. Beispiel Finelli: der erste saubere Montags-Bericht mit einer echten Zahl.
Kein Quick-Win = der Kunde zweifelt, ob sich das Abo lohnt.

## Der Baustein-Fahrplan (warum 1'000/Mt haelt)

Alle 4-8 Wochen 1 neuer Baustein — so ist das Abo verteidigbar (Finelli-Deal-Logik „Ausbau inklusive").
Pro Kunde als Mini-Tabelle im Kunden-Ordner (`kunden/{KUNDE}/`) fuehren:

| Woche | Baustein | Status |
|---|---|---|
| {z.B. KW 30} | {z.B. Scan/Etiketten freigeschaltet} | {geplant/live} |

> **Grenze beachten:** „Neue Funktionen und Ausbau-Versionen" sind laut Werkvertrag Ziffer 4 NICHT im
> Betriebs-Umfang und laufen ueber die Versions-Leiter (Ziffer 6). Der Baustein-Fahrplan im Abo meint
> das schrittweise Freischalten schon vereinbarter V1-Teile — echte neue Funktionen = Ausbau
> (siehe `vorlagen/vertrag/aenderungs-klausel.md`).

## Referral-Moment (Tag 90)

Beim Tag-90-Review den Kunden-Joker aktiv ansprechen (Werkvertrag Ziffer 6): 50% Anrechnung bei
vermitteltem Kunden. Beleg-Rahmen + Marktueblichkeit: `vorlagen/angebot/MARKT-ZAHLEN-JOKER.md`.
**Mehr nicht** — die volle Referenz-Fabrik (Bewertung einsammeln, Video-Testimonial, Fall-Beispiel)
ist ein spaeterer, eigener Playbook-Schritt.

## Service-Zusagen (SLA)

Wie schnell wir reagieren, steht schriftlich im **SLA-Blatt** (`vorlagen/vertrag/sla-blatt.md`) — der
Kunde bekommt es beim Go-Live. Es spiegelt die 48h-Garantie des Werkvertrags (Ziffer 5) und ergaenzt
sie um Antwortzeiten, ueberbietet sie aber nie.

## Aenderungswuensche

Kommt im Betrieb ein Wunsch, gilt die **2-Topf-Regel** (`vorlagen/vertrag/aenderungs-klausel.md`):
passt er ins Abo → machen; ist er groesser → als Ausbau bepreisen. So bleibt „alles inbegriffen"
ehrlich, ohne dass das Abo unbezahlte Mehrarbeit auffrisst (Scope Creep).

## Ergebnis dieser Phase

Der Kunde ist ueber die kritischen ersten 90 Tage hinaus, sieht monatlich seinen Wert, hat einen
Baustein-Fahrplan — und das Abo laeuft stabil weiter statt nach der Mindestlaufzeit zu kuendigen.
