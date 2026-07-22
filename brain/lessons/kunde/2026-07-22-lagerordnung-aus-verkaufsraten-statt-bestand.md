---
type: lesson
disziplin: kunde
kunde: finelli
status: current
datum: 2026-07-22
quelle: Session AB 22.07 (Lager-Rundgang vor Ort + Marktanalyse aus dem Bestellexport)
---

# Ein Lager laesst sich aus Verkaufsraten ordnen, auch wenn der Bestand unzuverlaessig ist

## Ausgangslage

Der Kunde sagt selbst, sein Bestand im Shopsystem stimme nur etwa zur Haelfte. Gleichzeitig soll
das Lager geordnet werden: welcher Artikel kommt nach vorne, welcher nach hinten. Der Reflex ist,
zuerst zu zaehlen und dann zu ordnen. Das kostet Tage und blockiert alles andere.

**Der Reflex ist falsch.** Fuer die Frage "was gehoert an den kuerzesten Weg" braucht es keinen
korrekten Bestand, sondern die **Abverkaufsrate**. Wie oft ein Artikel gegriffen wird, steht im
Bestellexport, und der ist belegt, unabhaengig davon wie falsch der Bestand ist. Zaehlen kann
danach passieren.

## Drei Fallen, die in den Zahlen sichtbar wurden

### 1. Event-Spike als Dauertrend missdeuten

Der Kunde war Hauptsponsor eines grossen Festivals und verkaufte dazu eigenes Merch. Im
30-Tage-Fenster machte dieses Merch **44 Prozent der gesamten Stueckzahl** aus. Im 7-Tage-Fenster
waren es noch **5 Prozent**. Der Spike war zum Zeitpunkt der Analyse bereits kollabiert.

Wer nach 30-Tage-Zahlen slottet, legt totes, jahresgebundenes Merch auf den besten Platz im Lager
und die echten Renner nach hinten. Der Schaden haelt bis zum naechsten Umraeumen an.

**Regel: Slotting nie aus einem einzigen Zeitfenster.** Immer 7 gegen 30 gegen 90 Tage rechnen und
das Verhaeltnis (Momentum) betrachten. Faellt die 7-Tage-Rate deutlich unter die 30-Tage-Rate,
ist der Artikel im Abschwung, egal wie gross seine 30-Tage-Zahl ist. Eventgebundene Artikel
bekommen eine eigene Zone "Abverkauf", nie die Packzone.

### 2. Kassen-Freitext blaeht die Artikelzahl auf

Der Export enthielt **508 verschiedene Artikelnamen**, obwohl der Kunde von rund 60 Modellen
spricht. Ein grosser Teil der Namen sind offensichtlich an der Kasse von Hand eingetippte
Bezeichnungen, teils mit Groesse im Namen. Diese Positionen lassen sich keinem gepflegten Artikel
zuordnen.

**Regel: Vor jeder Sortimentsanalyse die Zahl distinkter Artikelnamen im Export gegen die Zahl
gepflegter Modelle halten.** Eine grosse Differenz bedeutet Freitext-Erfassung, und die ist
zugleich eine Hauptursache jeder Bestandsdrift. Das gehoert vor der Inventur geloest, sonst
zaehlt man gegen ein kaputtes Stammdatenmodell.

### 3. Volumenzahlen aus dem Gespraech sind oft um eine Groessenordnung daneben

Im Gespraech fiel eine Bestellmenge pro Monat, die der Export um etwa **Faktor zehn** unterbot.
Selbst die Rekordwoche des Jahres lag deutlich unter der genannten Monatszahl geteilt durch vier.
Wer die Packstation nach der Gespraechszahl dimensioniert, plant fuer ein Lager, das es nicht gibt.

**Regel: Mengengeruest immer aus dem Export, nie aus der Erinnerung des Inhabers.** Das ist die
Fakten-Live-Regel angewandt auf Betriebszahlen, nicht nur auf Marketingzahlen.

## Was daraus die Lagerordnung wird

| Zone | Aufnahmekriterium | Platz |
|---|---|---|
| Renner | Verkauf in den letzten 7 Tagen, Rate stabil oder steigend | kuerzester Weg ab Packtisch |
| Standard | Verkauf in den letzten 30 Tagen | zweite Reihe |
| Saison | starke 90-Tage-Zahl, aber fast keine 30-Tage-Zahl | hinten, tauscht halbjaehrlich mit Renner |
| Abverkauf | eventgebunden oder jahresgebunden | sichtbar, aber nicht auf dem besten Platz |
| Langsamdreher | kein Verkauf in 30 Tagen | Nebenraum |

Dazu die Groessen: die Haeufigkeitsreihenfolge der Groessen aus dem Export bestimmt die
**Greifhoehe**. Die zwei haeufigsten Groessen gehoeren auf Hueft- bis Brusthoehe, die seltenen
nach oben. Das ist mit Zahlen belegbar und muss nicht geschaetzt werden.

**Adressierung:** Die Groesse gehoert nicht in die Lagerplatz-Adresse. Sonst bekommt jeder Artikel
vier bis sechs Adressen und jede Umlagerung wird zu ebenso vielen Buchungen — die Karte driftet
innert Wochen. Adresse bis zur Regalebene, Groesse ueber Farbmarkierung am Fachrand.

## Uebertragbar auf

Jeden Detailhandels- oder Modekunden mit Onlineshop und Laden. Die Reihenfolge ist immer:
Verkaufsexport auswerten, Zonen festlegen, Regale beschriften, dann einraeumen und dabei zaehlen.
Nicht umgekehrt.

Verwandt: [[2026-07-22-endkundendaten-in-kunden-exporten]] (wie der Export zu behandeln ist),
[[2026-07-19-finelli-echte-vorfaelle]] (Fakten-Live-Regel).
