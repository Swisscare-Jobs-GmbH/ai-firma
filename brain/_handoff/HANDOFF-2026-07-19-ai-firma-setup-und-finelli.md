---
datum: 2026-07-19
chat: ai-firma-setup (HQ, Fabel 5)
status: sauber abgeschlossen
---

# Übergabe — AI-Firma-Aufbau + Finelli-Härtung (19.07.2026)

> ⚠️ **ZUERST LESEN — Doppelarbeit vermeiden:** Ein PARALLELER Chat arbeitet gerade am
> **GzF-Angebot** (`ai-firma/kunden/gzf/angebot/`, untracked) — NICHT anfassen.
> **Finelli Blatt 2 ist inzwischen FERTIG** (Nachtrag unten) — nicht neu bauen.

## Stand-Nachtrag (19.07 abends, Finelli-Chat — NEUESTER Stand)

- **Blatt 2 „Dein System im Detail" FERTIG:** `finelli-cockpit/docs/angebot/2026-07-19-system-kosten-blatt-v1.html`
  + PDF, main @ d2019d6. 2 A4-Seiten, Aufbau nach SA-Diktat: ① Was das System täglich tut (Bestand >95%,
  Packer-Tempo, Bestell-Melder mit einstellbarem Zeitraum, Montags-Bericht, Frag-FINELLI mit Jahres-Vergleich
  für Kollektions-Planung) ② Software-Kosten heute ~1'500 → 1'250 (Schätz-Zahlen, Mittwoch live ausfüllen)
  ③ „Keine …"-Liste ④ Einrichten + Einschulung + 1 Tag/Woche im 1. Monat ⑤ Zukunfts-Andock inkl.
  Hersteller-Zugang ⑥ Wert-Stapel + Abzahl-Prozess. 3-Richter-Panel gelaufen (14 Fixes) + 4 SA-Feedback-Runden.
  **Kern-Framing (SA-Ansage): das System assistiert — SA/Khawar bleibt der Boss, es entscheidet NICHT.**
- **Absender-Entscheid SA 19.07 (gilt für BEIDE Kunden-Blätter):** „Shehryaar Khawaja — Software & KI" statt
  Swiss Care Jobs — E3 (Vertrag rechtlich über SwissCare) bleibt unangetastet, betrifft nur die Blätter.
- **PDF-Lage Downloads AUFGERÄUMT:** beide v6-Dateinamen (`…v6-momente.pdf` UND `Angebot-Finelli-v6-KORRIGIERT-22juli.pdf`)
  sind jetzt derselbe frische main-Stand (22. Juli + Absender + alle Feinschliffe) — egal welches SA druckt.
  Blatt 2 = `2026-07-19-system-kosten-blatt-v1.pdf`.
- **Datums-Klassen-Fege:** „Mittwoch 23.07." auch in MITTWOCH-PLAN.md + ANGEBOT-SESSION-BRIEF.md + Memory
  auf **22.07.** korrigiert (Archiv-Dateien bewusst gelassen).
- **Ebenfalls schon erledigt (nicht neu bauen):** Anti-Fail-Schwarm ausgewertet → Fixes auf finelli-main
  (Ampel nur noch Backend-Quelle, /readiness mit Startzeit+Code-Stand als Zombie-Wächter, getrennte
  Übungs-DB `cockpit-uebung.db`, lokaler Marker-Hook); Kern im swisscare-brain (PR #1594 gemergt, T764 grün);
  Marker-Gates in globalem chat-end-clean + /sync + CRM-Kopie (PR #397 gemergt).
- **Offen:** Khawar-Vorbereitungs-Nachricht (Entwurf in MITTWOCH-PLAN) noch nicht verschickt · GzF beim
  anderen Chat · Firmenname weiter offen (Absender-Tausch auf Blättern = 2 Zeilen je Blatt).

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
