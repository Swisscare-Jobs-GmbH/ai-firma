# Eigene App aufs Handy: nur was IM App-Prozess laeuft, zaehlt

> 2026-07-23, Finelli/SEA-Lager-App (Android-APK mit WebView + Cloudflare-Worker).
> Disziplin: Bau. Verallgemeinert fuer die Schablone "Betriebs-App aufs Mitarbeiter-Handy".

## Fazit

Zwei Fehler kosteten je ueber eine Stunde, weil jede naheliegende Pruefung gruen war. Beide Male
lief die Pruefung NEBEN der App, nicht IN ihr. Merksatz: **Ein Test, der nicht im App-Prozess
laeuft, beweist nichts ueber die App.**

## Vorfall 1: App zeigte dauerhaft "offline"

- Server antwortete vom PC aus korrekt, `ping` und `curl` vom Handy aus ebenfalls.
- Ursache: die `INTERNET`-Berechtigung fehlte im Android-Manifest.
- `ping`/`curl` auf dem Handy laufen in der Shell, nicht im App-Prozess. Sie umgehen genau die
  Berechtigung, die fehlte. Darum war jede Aussenmessung gruen.

## Vorfall 2: Scan zeigte nichts an

- Server lieferte alle Zeilen, der Endpunkt war per Konsole belegt.
- Ursache: der Client zog nur die Mengen, nicht die Artikelliste. Ohne Artikelliste fand der Scan
  nichts, und die Auswahlliste zum Anlernen blieb ebenfalls leer.
- Der Server-Test bewies den Server, nicht den Client.

## Regeln fuer den naechsten Bau

1. **Selbsttest in die App einbauen, bevor sie aufs Geraet geht.** Ein Knopf, der aus dem
   App-Prozess heraus den Server ruft (einmal ohne, einmal mit Kopfzeilen) und das Ergebnis
   im Klartext anzeigt. Das haette Vorfall 1 in 30 Sekunden gezeigt.
2. **App-Protokoll auf den Rechner leiten.** Konsolen-Meldungen der Weboberflaeche plus
   `onerror` und `unhandledrejection` ins System-Log schreiben, dann am Kabel mitlesen.
   Ohne das ist eine App auf dem Geraet eine schwarze Kiste.
3. **Berechtigungs-Liste gegen die Funktionsliste pruefen**, bevor gebaut wird. Netz, Kamera,
   Speicher. Fehlt eine, scheitert die Funktion still, nicht mit einer Fehlermeldung.
4. **Wenn der Server auf Datenhaltung umgestellt wird, muss der Client ALLES von dort holen.**
   Halb umgestellt heisst: Mengen vom Server, Stammdaten noch aus dem alten Import. Das faellt
   erst beim Benutzer auf.
5. **Neue Server-Route ist nicht sofort aktiv.** Nach dem Hochladen rund 10 Sekunden warten,
   sonst misst man einen Fehler, den es nicht gibt.

## Uebertrag

Gilt fuer jede Kunden-App, die auf einem fremden Geraet laeuft und mit einem eigenen Server
spricht. Der Klick-Beweis muss AM GERAET erbracht werden, mit sichtbarem Ergebnis auf dem
Bildschirm. "Server antwortet" ist kein Klick-Beweis.

Verwandt: Klick-Beweis-Regel in `CLAUDE.md` (Quick-Digest), Skill `beweis-fertig`.
