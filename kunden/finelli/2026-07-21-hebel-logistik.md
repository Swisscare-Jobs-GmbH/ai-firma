# Finelli — Wert-Hebel LOGISTIK (fuer den Logistik-Mitarbeiter)

> SA-Auftrag 21.07: die Hebel NUR fuer Logistik, presentation-fertig fuer den Termin 22.07.
> Eingearbeitet: SAs Antworten aus dem Aufgaben-Audit (unten). Gehoert zu:
> [Lager-Layout-Rollen-Spec](2026-07-21-lager-layout-rollen-spec.md) · [Prototyp](ki-mitarbeiter-prototyp/).

## Fazit (der EINE Satz fuer Khawar)

**"Heute laufen deine Kasse und dein Shopify getrennt — keiner weiss wirklich, was reinkommt und
was rausgeht. Der Logistik-Bildschirm macht daraus EINE Wahrheit: ein Mensch sieht auf einen Blick,
was wo liegt, was nachbestellt werden muss und was er auf seiner Fahrt mitnehmen soll."**

---

## Der Schmerz heute (aus Khawars eigenen Worten)

- **Zwei getrennte Systeme:** Kasse und Shopify reden nicht miteinander → der Bestand stimmt nie sauber.
- **Wareneingang wird "einfach eingelagert"** → nirgends erfasst → Phantom-Bestand, Abverkauf nicht messbar.
- **Nachbestellen aus dem Bauch**, Lieferzeiten der Hersteller nicht griffbereit.
- **Eine Person faehrt ~20 Min** zwischen Laden und Embrach — heute ohne Plan, was genau mit muss.

Jeder Punkt unten ist ein Hebel, der genau einen dieser Schmerzen loest.

## Die 7 Logistik-Hebel (Schmerz -> was die Software tut -> Wert)

| # | Hebel | Was der Logistik-Mitarbeiter bekommt | Wert (Zeit/Geld) |
|---|---|---|---|
| 1 | **Eine Wahrheit statt zwei Apps** | Kasse + Shopify + beide Lager in EINER Ansicht: echter Bestand Laden/Embrach live. | Schluss mit "ich glaube wir haben noch". Falsche Bestaende kosten laut Studien >5 % Umsatz. |
| 2 | **Wareneingang wird erfasst** (scannen statt nur einlagern) | Neue Ware am Handy scannen -> Fach-Vorschlag, Bestand stimmt sofort. | Macht Abverkaufsquote + Nachbestellung ueberhaupt erst rechenbar. Keine Phantom-Bestaende. |
| 3 | **Nie mehr blind nachbestellen** | System sagt: "Artikel X unter Meldebestand, Hersteller Y braucht Z Tage — jetzt N bestellen." | Verhindert die 2 teuersten Fehler: leer = verlorener Verkauf · zu viel = totes Kapital. |
| 4 | **Online-Renner rechtzeitig in den Laden** | Sieht, was online laeuft aber im Laden fehlt -> vorholen, bevor der Renner im Laden verpasst wird. | Mehr Umsatz aus Ware, die schon im Haus ist — 0 Einkauf noetig. |
| 5 | **Ladenhueter / letzte Stuecke steuern** | Was tot ist oder nur noch wenige Stuecke: Hinweis "in den Laden zum Abverkauf". | Bindet weniger Kapital, macht Platz in Embrach, holt Geld aus totem Bestand. |
| 6 | **Gezielt umlagern statt Leerfahrten** | Vor der 20-Min-Fahrt: exakte Liste, was mitnehmen (Variante + Menge + Fach). | Eine geplante Fahrt statt drei Bauch-Fahrten. Spart Zeit + Sprit jede Woche. |
| 7 | **Kunde nicht verlieren** | Laden scannt, Groesse fehlt -> Order direkt aufgenommen -> erscheint beim Logistiker als offener Auftrag. | Jeder gerettete Kunde = ein Verkauf, der sonst zur Konkurrenz geht. |

## So klingt es in der Praesentation (1 Absatz)

"Stell dir vor, deine Logistik-Person oeffnet morgens EINEN Bildschirm. Sie sieht sofort: drei
Artikel sind knapp — das System hat schon gerechnet, bei welchem Hersteller, wie viele, bis wann.
Sie sieht: dieser Hoodie explodiert online, ist aber im Laden leer — vorholen. Sie sieht: diese
Cargo dreht nicht mehr — in den Laden zum Abverkauf. Und bevor sie nach Embrach faehrt, hat sie
die genaue Mitnahme-Liste. Aus 'wir glauben' wird 'wir wissen' — mit einer Person."

## Ehrlich dazu sagen (nicht ueberversprechen)

- Der grosse Hebel (Hebel 1) braucht, dass **Kasse und Logistik verbunden werden** — das ist Arbeit,
  aber genau der Kern-Wert. Ohne diese Verbindung bleibt es Stueckwerk (Khawars eigene Aussage Nr. 9).
- **95-99 % Genauigkeit**, nicht 100 % — der Rest wird per Inventur-Scan korrigiert.

---

## Stand aus dem Aufgaben-Audit (SA, 21.07) — fuer Abdul + Co-Founder-Session

1. Fach-Anzahl/Namen je Ort: **morgen vor Ort aufnehmen**.
2. Grössen-Farben: **wir praesentieren unseren Vorschlag, Khawar darf umaendern**.
3. Scannen: **eigene Handy-App mit Kamera-Scan** (kein USB-Scanner).
4. Hersteller-Lieferzeiten + MOQ: **noch einholen** (Khawar liefert).
5. Transfer Embrach->Laden: **~20 Min, Khawar faehrt selbst**, kein Lieferservice.
6. Ziel-Reichweite (Wochen Vorrat): **an der Sitzung mit Khawar klaeren**.
7. Shopify `read_all_orders`: **ja**.
8. Daten: **2 Apps, Shopify + Kasse nicht sauber synchron**; **Wareneingaenge werden nur eingelagert, nicht erfasst**.
9. **Kasse muss mit Logistik verbunden werden** — sonst kein sauberes Rein/Raus (Kern-Aufgabe).
10. Rollen-Besetzung: **offen** (an der Sitzung).
11. Packer-Tempo: **wir messen es selbst neu** (heute nicht gemessen).
12. Berichts-Kanal/Tag: **vorerst keiner**, Volumen nach Implementierung festlegen.
