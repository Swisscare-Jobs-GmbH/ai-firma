---
type: lesson
disziplin: system
kunde: finelli
status: current
datum: 2026-07-22
quelle: Session AB 22.07 (Marktanalyse aus Shopify-Orders-Export; Fund beim Vorflug des /brain-sync)
---

# Kunden-Rohexporte gehoeren nie in ein Repo — Endkundendaten reisen sonst automatisch mit

## Was passiert ist

Der Kunde legte einen Shopify-Bestellexport (2,4 MB, 3'316 Zeilen, rund 2'100 Bestellungen) in
seinen Kundenordner im Firmen-Repo, damit daraus eine Marktanalyse entsteht. Die Datei traegt
79 Spalten, darunter `Email`, `Billing Name`, `Billing Address1`, `Billing Zip`, `Billing City`,
`Shipping Phone` und `Phone` — also Name, Mailadresse, Wohnadresse und Telefonnummer von rund
2'100 Endkunden.

Ein automatischer Sync-Commit hat die Datei noch am selben Tag mitgenommen und auf den
Remote gepusht, bevor jemand sie gesehen hat. Der Commit trug den generischen Titel
"manuell: Sync aus SEA" und nannte keine einzige Datei.

## Warum das durchrutschte (drei Ursachen, alle strukturell)

1. **Kein Ignore-Muster fuer Rohdaten.** Die `.gitignore` deckte Privat-Dateien, maschinenlokale
   Verdrahtung und Build-Muell ab, aber keine Datenexporte in `kunden/`.
2. **Automatik ohne Inhaltsblick.** Ein Sync, der pauschal alles Neue committet, kann nicht
   unterscheiden zwischen einer Auswertung und einem Rohdatensatz.
3. **Ablageort wirkte harmlos.** Der Kundenordner ist der naheliegende Platz fuer alles, was zum
   Kunden gehoert. Genau deshalb landet dort auch, was nicht in die Historie darf.

## Die Regel daraus

- **Auswertungen ja, Rohdaten nein.** Was aus einem Export berechnet wurde (Stueckzahlen,
  Anteile, Zeitreihen, Zonen), darf ins Repo. Der Export selbst nie.
- **Ignore-Muster vor dem ersten Export anlegen**, nicht danach:
  `kunden/**/*.csv`, `kunden/**/orders_export*`, `kunden/**/customers_export*`.
- **Rohdaten in den Scratchpad** oder einen anderen Ort ausserhalb jedes Repos legen und den
  Pfad im Auswertungsdokument nennen.
- **Beim Auswerten nur die noetigen Spalten lesen.** Bei diesem Export waren das `Created at`,
  `Lineitem name`, `Lineitem quantity`, `Lineitem price`, `Source`, `Cancelled at`. Die
  Personenspalten wurden nie eingelesen, damit sie auch nicht versehentlich in einer Ausgabe
  landen.
- **Vorflug jedes Syncs pruefen, WAS committet wird.** `git status` lesen, nicht blind `-A`.
  Ein generischer Auto-Commit-Titel ist ein Warnzeichen, kein Beleg.

## Wichtig: Untracken heilt die Historie nicht

`git rm --cached` plus Ignore-Muster verhindert weitere Verbreitung ab sofort. Die Datei bleibt
aber in jedem bereits gepushten Commit lesbar. Die Bereinigung der Historie ist ein
Force-Push-Vorgang und damit **nie eine Agenten-Entscheidung** — sie geht als Vorschlag an SA
(`brain/shared/todos/for-sa.md`, T2). Wer nur untrackt und "erledigt" meldet, taeuscht sich und
den Kunden.

## Uebertragbar auf

Jeden Kunden, der uns Daten aus seinem System schickt: Shopify- und WooCommerce-Exporte,
Kassenauszuege, CRM-Listen, Buchhaltungsexporte, Lieferantenlisten. Die Frage ist immer dieselbe:
*Steht in einer Spalte ein Mensch?* Wenn ja, gehoert die Datei nicht in ein Repo.

Verwandt: [[2026-07-19-finelli-echte-vorfaelle]] (Fakten-Live-Regel, Belegpflicht),
[[2026-07-20-zwei-rechner-pfad-drift]] (Automatik ersetzt keine Kontrolle).
