---
type: lesson
disziplin: system
kunde: finelli
status: current
datum: 2026-07-24
quelle: EAN-Sync zwischen zwei Handys in der SEA-Lager-App, 24.07.2026
---

# Geraeteuebergreifender Sync: Server = einzige Wahrheit, Warteschlangen mit Retry

Sobald **mehrere Geraete** dieselben Daten erfassen (zwei Handys scannen EAN-Codes an, buchen
Bestand, aendern Lagerplaetze), muss geklaert sein: wer gewinnt, wann sieht das andere Geraet die
Aenderung, was passiert bei kurzem Offline. Beim Finelli-Lager an zwei Handys geloest — Muster.

## Regeln
1. **Der Server ist die einzige Wahrheit.** Beim App-Start und bei jeder Rueckkehr in den
   Vordergrund (`visibilitychange`) zieht die App den Server-Stand und baut ihre lokale Sicht neu
   auf. Kein Datentyp lebt "nur lokal".
2. **Jeder Schreibvorgang geht ueber eine Warteschlange mit Wiederholung** (localStorage-Liste,
   In-Flight-Sperre, bei Fehler in der Queue lassen, beim naechsten Sync erneut senden). So geht
   nichts verloren, wenn beim Erfassen kurz das WLAN weg ist. Gilt fuer JEDEN Schreibtyp gleich
   (Buchung, Lagerplatz, angelernter Code).
3. **Beim Zurueckholen den Server autoritativ uebernehmen** — lokal genau spiegeln, was er liefert.
   Einzige Ausnahme: Eintraege, die noch in der eigenen Warteschlange stecken (noch nicht
   hochgeladen), bleiben lokal erhalten.

## Die Falle, die ich gebaut und wieder entfernt habe
Ich hatte eine "Reconciliation" eingebaut: beim Sync alle lokalen Codes, die der Server (noch) nicht
kennt, automatisch hochschieben. Das **ping-pongt**: lernen zwei Geraete fuer denselben Artikel
UNTERSCHIEDLICHE Codes, ueberschreiben sie sich gegenseitig endlos. **Loesung:** keine Auto-
Reconciliation. Nur die explizite Erfassung schreibt (ueber die Warteschlange), der Server bleibt
autoritativ, letzte Erfassung gewinnt — kein Hin-und-Her.

## Merke beim Zaehlen/Debuggen
Eine Differenz in den Zahlen ist nicht automatisch ein Sync-Loch. Beim Finelli waren es 35 Zeilen
aber 32 Codes, weil **ein Barcode auf 4 Artikeln gleichzeitig klebte** (gemeinsamer Aufkleber).
Erst die Daten anschauen, dann ein "Loch" behaupten.

## Anwendung
Jede Kunden-App, die auf mehreren Geraeten laeuft: Server autoritativ, drei gleiche Warteschlangen,
keine Auto-Reconciliation. Umsetzung als Vorlage: `kunden/finelli/finadmin/finadmin.html`
(`sendeWarteschlange`/`sendeFachWarte`/`sendeEanWarte`).
