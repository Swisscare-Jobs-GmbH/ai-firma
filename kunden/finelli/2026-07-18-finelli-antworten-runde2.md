# Finelli — Antworten Runde 2 (Khawar via SA, 18.07 abends)

> Quelle: SA im Chat (diktiert), Antworten auf den 9-Punkte-Anruf-Zettel.
> Gehoert zu: [Offene Fragen](2026-07-18-finelli-offene-fragen.md) · [Feinplan](2026-07-18-finelli-feinplan.md).

## Antworten (entwirrt)

| # | Frage | Antwort |
|---|---|---|
| 1 | Was heisst "bestellen"? | **V1: Umlagern Laden<->Embrach in BEIDE Richtungen + das "Probe-Ding", das Khawar sagt, was er bestellen muss (= KI-Vorschlag).** Haendler/Hersteller anschreiben: erst V2/V3. |
| 2 | Shopify-Kasse im Laden? | **NEIN — Laden kassiert ueber SumUp**, Verkaeufe werden von Hand in Shopify nachgetragen. Sie zahlen ~500/Monat fuer Shopify. |
| 3 | B2B durch Shopify? | Jelmoli gibt es nicht mehr (zu, Profil war veraltet). Haendler kaufen die Ware klassisch ein (z.B. EK 37 -> VK 100, eigene Marge). Ob der B2B-Abgang in Shopify gebucht wird: **halb offen** — vermutlich manuell wie beim Laden. |
| 4 | Bestand korrekt? | "Bisschen ungenau — ~80% genau." -> Start-Zaehlung noetig + Korrektur-Funktion in der App. |
| 5 | Varianten-Zeilen? | **~200** — ueberschaubar, passt zur Planung. |
| 6 | Abnahme-Liste | SA hat's nicht verstanden -> in einfach erklaert (Zettel mit max 10 Pruef-Saetzen, 14-Tage-Regel schuetzt die 3'000er-Schlusszahlung). |
| 7 | KI-Datenweitergabe ok? | SAs Worte: "lokal machen und dann eh im Web speichern" — beste Deutung: **ok, Daten sind eh in der Cloud (Shopify)**. Wir schicken ohnehin NUR Artikel-Zahlen, nie Kundennamen. |
| 8 | 149/Monat | SA fragte, was drin ist -> erklaert: Server ~30 + KI ~15 + Wartung/Stoerungen (Shopify aendert 4x/Jahr die Technik). |
| 9 | Shopify-Zugang | SA hat's nicht verstanden -> Klartext: Khawar klickt 5 Min nach Anleitung (docs/SHOPIFY-ZUGANG.md im Repo, weiterleitbar), am Ende kommt ein Schluessel raus — NICHT per Mail, telefonisch/Passwort-Link. |

## Folgen fuer den Bau

1. **SumUp-Drift ist systemisch** (Laden-Verkaeufe manuell nachgetragen, Bestand nur 80% genau) -> **NEU in Etappe 2: Bestands-Korrektur-Funktion** (Variante + Standort + gezaehlte Menge + Pflicht-Grund, 10-Sekunden-Fix). SumUp-API-Anbindung = moeglicher V2-Verkauf.
2. Umlagern beidseitig (Laden->Embrach auch) — in Etappe 2 eingeplant.
3. KI-Bestell-Vorschlag ist Khawars Kern-Wunsch ("Probe-Ding") -> Etappe 3 bleibt prioritaer.
4. Hersteller-/Haendler-Anschreiben = V2/V3 (nicht im 4k-Umfang).
5. Vor Abnahme: Start-Zaehlung mit Khawars Team einplanen (80%-Bestand wuerde die App ab Tag 1 unglaubwuerdig machen).
6. Profil-Korrektur: Jelmoli als Referenz streichen.

## Stand Bau

Etappe 1 🟢 (Login + Uebersicht, klick-bewiesen, gepusht). Etappe 2 🟡 laeuft (Umlagern beidseitig + Verlauf + Korrektur + Bestell-Grundfunktion, Uebungs-Modus). Blocker fuer "echt": Shopify-Schluessel von Khawar.
