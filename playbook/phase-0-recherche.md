# Phase 0 — Recherche

> Ziel: bevor SA mit {KUNDE} spricht, wissen wir mehr ueber den Laden als der Kunde erwartet.
> Dauer: ~0.5 Tag. Laeuft als **Agenten-Schwarm parallel** (bei Finelli 7-9 Agenten, bei GzF erprobt).

## Fazit-Regel

Alles, was hier gesammelt wird, muss der Kunde **selbst nachpruefen** koennen. Eine falsche Zahl
im spaeteren Angebot zerstoert Vertrauen — siehe die harte Fakten-Live-Regel unten.

## Was gesammelt wird

| Baustein | Quelle | Achtung |
|---|---|---|
| **Firmen-Profil** | Handelsregister + Webseite + Social | Rechtsform, Groesse, Standorte, wer entscheidet |
| **ALLE Reviews** | **Google Maps LIVE** (nicht nur Trustpilot!) — positiv UND negativ | Anzahl selbst zaehlen, nie schaetzen |
| **Genutzte Software** | Webseite, Job-Inserate, Kunde fragen | Was kostet Geld/Monat? → spaeterer Spar-Hebel |
| **Schmerz-Hypothesen** | aus Reviews + Branche abgeleitet | 3-5 Vermutungen, die Phase 1 bestaetigt/verwirft |

## PFLICHT: Fakten-Live-Regel (aus echtem Fehler)

**Jede Zahl LIVE verifizieren, bevor sie irgendwo landet.** Vorfall Finelli 18.07:
- "41 Bewertungen" → Google hatte real **130**. Nur SA selbst hat es gefangen.
- Referenz "Jelmoli" → Firma **existierte nicht mehr**.

Der Waechter-Hook (`.claude/hooks/fakten-live-waechter`) warnt automatisch — aber die Haltung zaehlt:
**belegte Zahl mit Quelle ODER "weiss ich nicht".** Nie eine geratene Zahl.

**Geloeschte Reviews:** technisch nicht abrufbar — ehrlich so sagen, nicht versprechen.

## Vorlagen / Muster

- Firmen-Profil-Muster: `vorlagen/termine/` + Finelli-Beispiel im `kunden/finelli/`-Ordner.
- Recherche-Schwarm: der Phase-0-Workflow (`.claude/skills/`) faechert die Agenten selbst auf.

## Ergebnis dieser Phase

Ein Profil-Blatt in `kunden/{KUNDE}/` mit: Firmen-Fakten · verifizierte Review-Lage (mit Quelle+Datum)
· genutzte Software (mit Monatspreisen) · 3-5 Schmerz-Hypothesen fuer Phase 1.
