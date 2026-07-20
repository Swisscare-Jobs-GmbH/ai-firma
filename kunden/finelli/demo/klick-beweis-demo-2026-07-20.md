# Klick-Beweis Verkaufs-Demo — 2026-07-20

> Erstellt 2026-07-20 durch Workspace-Session AB. Geprueft im ECHTEN Browser (Chrome via
> DevTools-Steuerung, Handy-Format 390x844, file://-Aufruf ohne Internet — wie am Termin).
> Gehoert zu: [README](README.md) · [index.html](index.html).
> Dies ist zugleich das **Vorfuehr-Drehbuch** fuer den Termin (Mi 22.07.2026).

## Fazit

**Alle 10 Klicks der Checkliste bestanden, 0 Laufzeit-Fehler in der Konsole.**
Selbst geklickt und am Schirm gesehen: Screenshots 1-4 in diesem Ordner.
Bau-Weg: 3 Konzepte -> Richter (Sieger: "Werkbank") -> Opus-Bau -> 3 Pruefer
(19 Funde, 4 Pflicht) -> Fixer -> Browser-Klick-Beweis + 1 Nachfix (Notizfeld-Namen).

## Die 10 Klicks (Drehbuch mit Ist-Ergebnis)

| # | Klick | Erwartet | Ist |
|---|---|---|---|
| 1 | Tab "Suche" | Station A scrollt heran, Titel bleibt sichtbar | ✅ |
| 2 | Chip "Hoodie Classic" + Groesse "M" | Zuerich ZH-A-01: 0 (rot) · Embrach EMB-B-03: 4 (gruen) + gelber Umlagerungs-Hinweis | ✅ (Screenshot 2) |
| 3 | "Umlagerung vorschlagen" | "Vorschlag notiert. Ein Mensch entscheidet und bucht — nichts wurde automatisch gebucht." | ✅ |
| 4 | Tab "Scan" -> "Artikel scannen" | Karte "Tee Box-Logo, Groesse L" + Lagerplatz-Vorschlag EMB-A-03 | ✅ |
| 5 | "Einbuchen" 2x schnell | "Gebucht: 1x" + "Doppelt gedrueckt — trotzdem genau 1x gebucht." (kein 2. Eintrag) | ✅ |
| 6 | WLAN-Schalter AN, erneut scannen + einbuchen | Warteschlangen-Zeile "wird nachgereicht" | ✅ (Screenshot 3) |
| 7 | WLAN-Schalter AUS | Zeile wechselt auf "synchronisiert — angekommen" (beide Buchungen) | ✅ |
| 8 | Tab "Uebersicht" | "Heute erfasst" zaehlt eigene Buchungen mit (10 -> 12) + Differenzen-Liste | ✅ |
| 9 | Inventur-Segment "Embrach" | "zuletzt gezaehlt am Montag, 06.07.2026" (Montags-Anker, kein Einfrieren) | ✅ |
| 10 | F3 antippen + Chip + "Antworten kopieren" | Haken, "1 von 7 besprochen", "Kopiert — direkt in Mail oder Notizen einfuegbar." | ✅ (Screenshot 4) |

Zusatz-Beweise: Datum im Kopf live ("Montag, 20.07.2026" — am Termin steht dort automatisch
Mittwoch, 22.07.2026) · Nach Browser-Neustart bleiben Fragen-Haken + Notizen erhalten
(localStorage-Beweis: F3 blieb abgehakt) · Kein einziger externer Request (Quell-Scan:
0 Treffer auf http/fetch/CDN) · Kein Eszett, keine Deal-Zahlen, keine Review-Zahlen (Scan).

## Ehrliche Notizen (nichts verschweigen)

- **Nicht am echten Handy gesehen:** Geprueft im Chrome-Handy-Format (390x844), nicht auf einem
  physischen iPhone/Android. Vor dem Termin 1x auf dem echten Geraet oeffnen (Datei per
  WhatsApp/AirDrop aufs Handy oder von USB) — insbesondere den Kopier-Fallback auf iOS.
- Beim allerersten Oeffnen ueber die Browser-Fernsteuerung erschien EIN Konsolen-Eintrag
  ("Unsafe attempt to load URL ... file:") — Artefakt des Steuerungs-Werkzeugs, nicht der Seite
  (Quelltext hat null URL-Referenzen; nach normalem Reload: Konsole komplett leer).
- Die Zahlen 54-65% / +4-8% sind Studien-Zahlen mit Quelle im Footer; alle Finelli-Zahlen
  (80%, Bestaende) sind als "deine Schaetzung" bzw. Beispieldaten markiert — Fakten-Live-Regel
  eingehalten, nichts muss vor dem Termin nachgezaehlt werden, weil nichts Live-Pflichtiges
  behauptet wird.

## Was der Fixer eingearbeitet hat (Auszug, 19 Funde)

Zeitzonenfester Kalendertag (kein Vortages-Wert nach Mitternacht) · Sticky-Toolbar verdeckt
keine Titel mehr · No-JS-Fallbacks (Seite bleibt ohne JavaScript lesbar) · 44px-Touch-Ziele ·
iOS-Safe-Area fuer den roten Knopf · Inventur an Montags-Datum verankert · aria-Attribute fuer
Tabs/Aufklapper. Nachfix nach Browser-Pruefung: name/id fuer die 7 Notizfelder (Konsole leer).
