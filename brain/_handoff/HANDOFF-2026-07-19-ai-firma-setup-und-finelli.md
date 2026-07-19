---
datum: 2026-07-19
chat: ai-firma-setup (HQ, Fabel 5)
status: sauber abgeschlossen
---

# Übergabe — AI-Firma-Aufbau + Finelli-Härtung (19.07.2026)

> ⚠️ **ZUERST LESEN — Doppelarbeit vermeiden:** Ein PARALLELER Chat arbeitet gerade an
> **GzF-Angebot** (`ai-firma/kunden/gzf/angebot/`, untracked) und an **Finelli Blatt 2**
> (`finelli-cockpit/docs/angebot/2026-07-19-system-kosten-blatt-v1.html`, modifiziert). Diese
> zwei NICHT anfassen — gehören dem anderen Chat.

## Was dieser Chat FERTIG gemacht hat (nicht neu bauen)

### AI-Firma-Grundgerüst
- **Neues Repo `C:/dev/ai-firma` = GitHub `Swisscare-Jobs-GmbH/ai-firma`** (privat). Steht komplett:
  CLAUDE.md, README, TEAM.md, playbook/ (Phase 0-5), vorlagen/ (Vertrag, Angebot, Kunden-Repo, Termine),
  kunden/ (Registry + finelli + gzf + swisscare), brain/ (Blaupause + E1/E2/E3), .claude/ (6 Skills,
  5 Hooks, 4 Workflows).
- **4 Auto-Mechaniken scharf + bewiesen:** protected-change-guard, fakten-live-waechter, session-start-card
  (mit Alter-Stempel), kunden-anker-inject, verbots-wall (kein Repo/Merge/CI ohne SA).
- **Web-Recherche-Verbesserungen umgesetzt:** Verbots-Wall, Alter-Stempel (warnt ab 7 Tagen), Richter
  unabhängig + 4 Geschäfts-Checks, Vertrags-Klausel „Vorlage bleibt bei uns", beide CLAUDE.md
  entschlackt, Umzug-Marker im swisscare-brain gesetzt.
- **4 Workflow-Schwärme im Trockenflug getestet** (Fund: args kam als Text statt Objekt → gefixt in
  allen 4). Ergebnisse liegen in kunden/.
- **3 Setup-Entscheide (E3):** Absender vorerst Swiss Care Jobs GmbH · Repo-Zugriff nur SA · avatar.md
  lokal + gitignored (beweisbar nie hochgeladen).

### Finelli — KOMPLETT, das v6-Momente-Angebot NICHT mehr anfassen
- **`docs/angebot/2026-07-19-angebot-finelli-v6-momente.html` ist final** (main @ 23612c5):
  - Termin-Datum korrigiert: **Mittwoch, 22. Juli** (23. war Donnerstag).
  - Widerspruch „keine versteckten Kosten" ↔ Scanner-Hardware gelöst (ehrlich benannt).
  - 7 Richter-Feinschliffe: Anker durchgestrichen, Betrieb kündbar, Nachrechen-Falle entkräftet,
    Entschuldung Szene 1, Rest-Betrag statt Restschuld, Ultimatum entschärft.
  - **1 A4-Seite (PDF-geprüft).** Korrigiertes PDF: `C:/Users/shehryaar/Downloads/Angebot-Finelli-v6-KORRIGIERT-22juli.pdf`.
    → Das ALTE PDF (ohne „KORRIGIERT") ist veraltet, nicht verwenden.
- **4 Demo-Killer gefixt + gemergt** (PR #1 auf main): Mock-Tages-Cache (kein Einfrieren über
  Mitternacht), KI-Timeouts 30s, CORS 127.0.0.1. Beweis: 49 Tests grün inkl. neuem Mitternacht-Test.
- **KI-Etappe** ist auf main (via PR #1). Sicherungs-Spur `sicherung/ki-etappe-2026-07-19` existiert noch.

## Offen / für andere / nächste Schritte
- **GzF:** anderer Chat baut Angebot — Firmen-Profil + Schmerz-Hypothesen liegen in kunden/gzf/ (Hebel Nr. 1:
  kein Konkurrent macht Rückhol-Erinnerung; IV zahlt 2 Paar Schuhe/Jahr).
- **Finelli-Angebot Wert-in-Franken:** 1 empfohlener Fund BEWUSST offen gelassen — braucht Finellis
  Durchschnitts-Verkaufspreis pro Teil (nicht erfinden). Wenn SA die Zahl gibt, kann eine harte
  CHF-Wert-Zeile rein.
- **CRM-PR #399** (schlanke CLAUDE.md) von SA gemergt. **safe-merge Klartext-Login** (task_6447678d)
  läuft in separater Session.

## Lektionen aus diesem Chat
- **Workflow-`args` können als JSON-Text ankommen** — im Script immer robust parsen (`typeof === 'string'`
  → JSON.parse). Der Trockenflug hat es gefangen, nicht ein Review.
- **Trockenflug lohnt sich:** jeder der 4 Schwärme fand beim ersten Echt-Einsatz echten Wert (Demo-Killer,
  Angebots-Widerspruch, GzF-Hebel). Nie einen Schwarm ungetestet an einen Kunden lassen.
- **Merge-Konflikt-Wurzel bei PR #1:** Sicherungs-Zweig schleppte die KI-Etappe doppelt (main hatte sie
  schon via 9c26d4f). Lösung: Zweig auf main neu aufsetzen, nur die Fixes cherry-picken — nicht Konflikte
  einzeln lösen.
