# HANDOFF 2026-07-21 — Finelli KI-Mitarbeiter (Prototyp + Termin 22.07)

Stand: Prototyp der 3 KI-Mitarbeiter + Lager-Layout + 4 Rollen-Ansichten + Handy-Scan gebaut,
getestet (24/24), klick-bewiesen, auf `origin/master` gepusht. Ordner:
`kunden/finelli/ki-mitarbeiter-prototyp/` (Start: `node server.js` -> http://127.0.0.1:8030).
Kontext-Dateien: `kunden/finelli/2026-07-21-bauplan-ki-mitarbeiter.md`,
`...-lager-layout-rollen-spec.md`, `...-hebel-logistik.md`, Entscheid `brain/decisions/E5-*`.

---

## 1. Termin 22.07 vorbereiten
- **Was:** Vor der Demo einmal "Mock neu wuerfeln" (verankert Zahlen auf den Tag), dann durch die
  Tabs klicken: Uebersicht -> Packstation -> Handy-Scan -> Logistik -> Berichte.
- **Hebel:** Entscheid-Termin morgen; die Demo ist das Verkaufs-Argument. Kein Blocker.
- **Kontext:** Server laeuft lokal auf 8030, reiner Mock, keine Zugaenge noetig. Tab-Wechsel
  braucht echte Maus-Klicks (MCP-Synthetik hakte, echte Klicks laufen).
- **Prio:** 🔴 jetzt

## 2. Fachliche Fragen vor Ort aufnehmen (aus dem Audit)
- **Was:** Reale Fach-Anzahl/Namen je Ort · Hersteller-Lieferzeiten (min/typisch/max) + MOQ ·
  Ziel-Reichweite (Wochen Vorrat) · Rollen-Besetzung · Berichts-Tag/-Kanal.
- **Hebel:** Ohne diese Zahlen bleibt das System Mock; sie machen es echt. Kein CHF-Anker, aber
  Voraussetzung fuer Produktivbetrieb.
- **Kontext:** Antworten-Stand steht schon in `...-hebel-logistik.md` (Abschnitt Audit). Offen sind
  genau die 5 oben.
- **Prio:** 🔴 jetzt (morgen)

## 3. Git-Autor-Zeile bestaetigen
- **Was:** Meine Commits tragen `alexanderbeck@swisscarejobs.ch` (Git hatte keine user.identity).
  SA soll bestaetigen oder umschreiben lassen (`git config user.email` + evtl. rebase).
- **Hebel:** Kosmetik/Sauberkeit der Historie. Kein Blocker.
- **Kontext:** Betrifft die Commits 6d4b5ef, ce4182e, fb5c626, 39a3ccd, d74e8dd auf master.
- **Prio:** 🟡 spaeter

## 4. Nach dem Finelli-Ja: scharf schalten (Gate E5)
- **Was:** Prototyp ins `finelli-cockpit` (`ki-mitarbeiter/`) ziehen · echte Shopify-Anbindung
  read-only (`read_all_orders`) · **Kasse <-> Logistik verbinden** (der Kern-Hebel, Khawars
  Aussage) · Wareneingang-Scan · Handy-App mit echtem Barcode-Kamera-Scan.
- **Hebel:** Das ist der eigentliche Produktiv-Wert (Betriebsgebuehr). Grosser Aufwand, erst nach Ja.
- **Kontext:** Regeln stehen im Bauplan Abschnitt 8-10 (Backfill, Schnitt-Datum, Voll-Inventur,
  POS-Regel "V4 erst nach V2"). Nicht ins Lagerverwaltungs-Repo (Scope-Trennung G13).
- **Prio:** 🟡 spaeter (Gate: Ja + Shopify-Zugang)

## 5. Mitarbeiter-Tracking rechtlich pruefen
- **Was:** Packer-Tempo-Messung vor Kunden-Zusage arbeitsrechtlich (CH) pruefen — als transparente
  Prozess-Messung gebaut, nicht Personenueberwachung.
- **Hebel:** Rechts-Risiko vermeiden; falsch kommuniziert killt Vertrauen.
- **Kontext:** SA-Antwort im Audit: "muessen wir selber messen, da nicht gemessen" — ok, aber
  Rahmen klaeren.
- **Prio:** 🟡 spaeter
