# Etappe {N} — Bau-Anleitung: {ETAPPE_TITEL} (VORLAGE)

> Herkunft: Finelli-Etappe-3-Spec. Zweck: so schreiben, dass der naechste Chat OHNE Neu-Denken sofort
> bauen kann. Kontext: `CLAUDE.md` + `docs/PLAN.md` lesen. Vorige Etappen sind gruen (Uebungs-Modus,
> Ports {PORT_BACKEND}/{PORT_FRONTEND}). Eine Datei pro Etappe (ETAPPE-1-SPEC.md, ETAPPE-2-SPEC.md, ...).

## Ziel

{ETAPPE_ZIEL — der Kern-Wunsch des Kunden in 1-2 Saetzen + warum es den Deal/das Abo traegt}.

## A) {BAUSTEIN_A_TITEL — oft die Daten-/Voraussetzungs-Basis}

1. `app/services/{SERVICE_A}.py` — {WAS_ES_LIEFERT}.
   - MOCK_MODE: {MOCK_QUELLE — deterministischer Generator, Seed fix, KEIN random zur Laufzeit}.
     {MOCK_VERTEILUNG — welche Faelle abgedeckt sein muessen, inkl. Grenzbereiche fuer Ampeln}.
   - ECHT (spaeter, braucht Schluessel): {ECHT_QUELLE} — NUR {ERLAUBTE_FELDER}, NIEMALS
     {VERBOTENE_FELDER} abfragen ({WARUM_VERBOTEN — z.B. teurerer Plan / Datenschutz-Auflagen}).

## B) {BAUSTEIN_B_TITEL — oft die Rechen-/KI-Funktion}

2. `app/services/{SERVICE_B}.py`:
   - Rechenteil (OHNE KI, testbar): {FORMEL_ODER_REGEL — Schwelle/Formel, alle Konstanten in config.py}.
   - KI-Teil: Claude API (`ANTHROPIC_API_KEY` in config, **eigener Key pro Kunde — NIE einen anderen
     Key wiederverwenden**). Modell: `{MODELL — guenstig reicht meist}`. Prompt: Rechen-Daten rein →
     {KI_AUSGABE} auf Deutsch. OHNE Key/MOCK: regelbasierte Ausgabe aus dem Rechenteil (gleicher
     Satzbau) — App bleibt voll vorfuehrbar.
3. `{HTTP_ENDPUNKT — z.B. GET /api/...}` — {ENDPUNKT_BESCHREIB + Sortierung + Felder}.
4. Frontend `{FRONTEND_SEITE}`: {FRONTEND_BESCHREIB}. Etwaige "kommt spaeter"-Platzhalter ENTFERNEN.

## C) {BAUSTEIN_C_TITEL — optional, z.B. Bericht/Export}

5. `app/services/{SERVICE_C}.py`: {SERVICE_C_BESCHREIB}. KI-Feinschliff via Claude, MOCK ohne Key =
   Vorlage-Text mit echten Zahlen.
6. `{HTTP_ENDPUNKT_C}` + {ANZEIGE_ORT}.
7. {SCHEDULER_ODER_VERSAND — falls zeitgesteuert: Stub anlegen, Versand erst spaeter verdrahten;
   bis dahin in DB ablegen + im Frontend zeigen. Keinen fremden Versand-Weg ohne SA-Entscheid kopieren}.

## D) Abnahme (Klick-Beweise Pflicht)

- pytest: Rechenteil mit {N_FAELLE} Faellen ({FALL_BEISPIELE — inkl. Grenzwert}) + Service liefert
  alle Pflicht-Bloecke.
- Browser: {BROWSER_KLICK_KETTE — konkrete Klick-Kette mit erwartetem Ergebnis}.
- Neustart-Beweis: {WAS_UEBERLEBT} bleibt (DB).
- Prozesse danach beenden, `frontend/.env` auf {PORT_BACKEND} zuruecksetzen.

## Kosten-Rahmen

Claude-API fuer {DATEN_UMFANG}: {AUFRUF_FREQUENZ} = Rappen-Betraege. Bei >1 CHF/Tag stimmt etwas
nicht (Schleifen-Bug) — sofort stoppen und pruefen.

---

## Platzhalter-Legende (Kurz)

`{N}`/`{ETAPPE_TITEL}`/`{ETAPPE_ZIEL}` = welche Etappe · `{SERVICE_A..C}`/`{HTTP_ENDPUNKT*}`/
`{FRONTEND_SEITE}` = Code-Orte · `{MOCK_QUELLE}`/`{MOCK_VERTEILUNG}`/`{ECHT_QUELLE}`/
`{ERLAUBTE_FELDER}`/`{VERBOTENE_FELDER}` = Daten · `{FORMEL_ODER_REGEL}`/`{MODELL}`/`{KI_AUSGABE}` =
Rechnen/KI · `{N_FAELLE}`/`{FALL_BEISPIELE}`/`{BROWSER_KLICK_KETTE}`/`{WAS_UEBERLEBT}` = Abnahme ·
`{PORT_BACKEND}`/`{PORT_FRONTEND}` = Ports.
