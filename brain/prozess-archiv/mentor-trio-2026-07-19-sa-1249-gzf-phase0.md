# Mentor-Detail — Session sa-1249-gzf-phase0 (2026-07-19)

> Chat-end-clean V2, Mentor-Umfang: **leicht** (Substanz 2: 1 Lesson + 1 Todo + 0 done + 0 Entscheide).
> Session: Neukunde Kaufmann Gut zu Fuss (GzF) — Playbook Phase 0 komplett.

## A) Was du heute gebaut hast

| Artefakt | Count | Wo |
|---|---|---|
| Kunden-Dokument gelesen + erklaert | 1 | GzF_Datenbank_MailFlows.docx (Konzept April 2026) |
| Recherche-Schwarm | 5 Agenten, ~432k Tokens, 146 Tool-Calls | Firmen-Profil, Reviews, Schmerzen, GP-Manager, Kritiker |
| Brain-Dokumente | 2 | users/sa/inbox/2026-07-19-gzf-firma-profil.md + -schmerz-fragen.md |
| Fragen-Katalog an Kunde | 11 Fragen, kopierfertig | im Chat ausgegeben, SA verschickt |
| Lessons | 1 | lessons/engineering/2026-07-19-google-maps-reviews-ohne-login-zaehlen.md |
| Todos neu | 1 (T767) | shared/todos/for-sa.md |

## C) Was das in Zahlen heisst

- Phase 0 des Playbooks (Soll: 0.5 Tag) lief in ~1 Session; der reine Schwarm brauchte 16 Min.
- Ergebnis: belegtes Firmen-Bild (Inhaber, Handelsregister, 4,6★/22 live) + 10 Schmerz-Hypothesen
  mit grobem Potenzial CHF 60'000–130'000/Jahr (Annahmen, warten auf Kundenzahlen).
- Risiko frueh gefunden statt in Woche 1 des Baus: CSV-Export aus GP Manager ist nirgends belegt —
  haette das MVP-Fundament gekostet.
- Budget-Rahmen gerechnet: Finelli-Modell passt unter SAs 850/Mt-Deckel (~700/Mt).

## Selbst-Eval (Step 4.86) — 3 Situationen, 1 rot

| # | Situation | Claude | User | Format | Routing | Fund |
|---|---|---|---|---|---|---|
| 3 | "erklaer in desi"-Antwort | 🔴 | 🟡 | 🟢 | 🟢 | Claude hat wegen eines unklaren Diktier-Worts die Stamm-Regel "Antworten IMMER Deutsch" uebersteuert und auf Roman-Urdu geantwortet; SA musste korrigieren (1 Extra-Runde). |

- Spiegel Claude: Diktier-Artefakte duerfen Stamm-Regeln nie ueberstimmen — im Zweifel Deutsch. (Memory language-answers-german nachgeschaerft.)
- Spiegel User: sauber — Korrektur kam sofort und klar ("nit desi ... als deutsch").
- Spiegel Routing: passte — Schwarm fuer Recherche, eigener Browser-Klick fuer den Live-Beweis, kein unnoetiges Delegieren.

Saubere Situationen: Kunden-Identifikation aus dem Dokument statt Rueckfrage (🟢) ·
Review-Zaehlung mit DOM-Fallback nach Screenshot-Timeout (🟢, Beweis stand trotz Werkzeug-Macke).

## Technische Pflicht-Zeilen

- Pre-Commit-Hygiene: 🟢 (Wegwerf-Arbeitskopie ab origin/main, nur eigene Dateien per gezieltem add)
- Push-Audit: siehe Commit-Beleg im Chat-Output
- Layer-Sync: n.a. (kein Code — reine Recherche-/Wissens-Session)
- Audit-Relevanz: keine (kein CRM-Daily-Audit-Check beruehrt)
- Active-Work: kein Marker aktiv
- Drift: 9% (Effektivitaet 9.1/10) T1=0 T2=1 T3=0 — die eine Selbst-Korrektur war die Desi-Antwort
- Drift-Recovery: Skip (<15%)
- HQ-Rapport: track-File (kein HQ-Modus): shared/hq-rapport/2026-07-19/track-sa-gzf-neukunde-phase0.md
- Handoff-Prompt: verbessert + inline (Backup: 2026-07-19-sa-1249-gzf-phase0-handoff.md)
- Rechner-Wechsel: nicht aktiv
