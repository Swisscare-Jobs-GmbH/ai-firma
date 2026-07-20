---
datum: 2026-07-20
typ: bau-auftrag
freigabe: SA 2026-07-20 (Antwort "A" im Recherche-Chat, Fabel-5-HQ)
modell: Opus 4.8 (Bau) — Denk-/Audit-Fragen zurueck an Fabel 5
status: offen
---

# Bau-Auftrag: Playbook Phase 6 „Betrieb" + SLA-Blatt + Änderungs-Regel

> Herkunft: Tiefen-Recherche 20.07. (`markt/2026-07-20-tiefenrecherche-markt-konkurrenz-swot-prozess.md`,
> Abschnitte 6+7). Kern-Befund: Abwanderung passiert zu 60–70% in Monat 1–6, Grund ist fast nie
> schlechte Arbeit, sondern unsichtbarer Wert + ungemanagte Erwartungen. Phase 6 ist die
> Lebensversicherung des Monats-Abos.

## Freigabe + Leitplanken (ZUERST lesen)

1. **`playbook/` + `vorlagen/vertrag/` sind schutz-verriegelt** (protected-change-guard). Dieser
   Auftrag IST der explizite SA-Auftrag dafür — Umfang: NUR die unten gelisteten Dateien.
2. **Arbeitsweise:** Zweig `feat/phase6-betrieb-2026-07-20` → Entwurfs-PR (Draft) → **NICHT mergen,
   SA merged.** Kein `.github/`-Ordner, keine CI.
3. **Zahlen-Ehrlichkeit:** Alle Markt-Zahlen aus der Recherche sind 🔍 = NICHT gegen-geprüft
   (Prüf-Schwarm starb am Kostenlimit). Im Playbook als „Markt-Richtwert" formulieren, nie als
   garantierten Fakt. Fakten-Live-Regel gilt unverändert für alles Richtung Kunde.
4. **Widerspruchs-Verbot (Finelli-Lektion, Angebots-Panel 19.07):** Kein Blatt darf mehr
   versprechen als der Werkvertrag hergibt. SLA-Blatt und Werkvertrag beim Bau nebeneinanderlegen.
5. Stil: wie die bestehenden Playbook-Blätter (`phase-0` … `phase-5`) — Klartext, Tabellen,
   scannbar, ASCII-Umlaute wie im jeweiligen Bestand.

## Zu bauen: 3 neue Dateien + 1 Update

### 1. `playbook/phase-6-betrieb.md` (Herzstück)

Inhalt (alles Markt-Richtwerte aus der Recherche, Abschnitt 6):

| Baustein | Spezifikation |
|---|---|
| **Woche 1–4** | Wöchentlicher Kurz-Check (Anruf/WhatsApp, ~10 Min) + Montag KI-Wochen-Bericht (Schwarm `ki-wochen-bericht` existiert) |
| **Tag 30 / 60 / 90** | Review-Gespräch „Erwartung vs. Erlebnis" (30 Min); ab Tag 90 monatlicher 30-Min-Check-in |
| **Quick-Win-Pflicht** | 1 sichtbarer Gewinn in den ersten 30 Tagen — wird schon im Kickoff (Phase 5) benannt |
| **Monats-Wert-Bericht** | 1 Seite Kunden-Sprache: Ergebnisse statt Aufgaben („X Std gespart / Y Verkäufe gerettet"), 1 Kennzahl, was kommt nächsten Monat. Struktur als Vorlagen-Skelett in die Datei |
| **Baustein-Fahrplan** | 1 neuer Baustein alle 4–8 Wochen (Finelli-Deal-Logik „Ausbau inklusive") — pro Kunde als Mini-Tabelle im Kunden-Ordner führen |
| **Referral-Moment** | Beim Tag-90-Review Vermittlungs-Joker ansprechen (Verweis `vorlagen/angebot/MARKT-ZAHLEN-JOKER.md`) — mehr nicht, Phase 7 „Referenz" ist ein SPÄTERER Auftrag |

### 2. `vorlagen/vertrag/sla-blatt.md` (1 A4, Kunden-Sprache)

Empfehlungs-Werte (SA kann am PR ändern — als solche kennzeichnen):

| Fall | Zusage |
|---|---|
| Antwort auf Nachrichten | ≤ 4 Geschäftsstunden (Mo–Fr 09–18) |
| Kritische Störung (Kunde kann nicht arbeiten/verkaufen) | Reaktion ≤ 4 Std · Behebungs-Ziel ≤ 48 Std — **wortgleich mit Werkvertrag-Folge** (Betriebs-Gebühr des Monats erlassen, Raten verschieben sich — NICHT „Monat kostenlos") |
| Normale Störung | Reaktion ≤ 1 Arbeitstag |
| Abwesenheit (Ferien/Krank) | Geplante Abwesenheit > 2 Tage wird vorab angekündigt + Notfall-Kontaktweg genannt |

Plus die 4 Pflicht-Klauseln jedes Betreuungs-Vertrags (Markt-Richtwert): Leistungsumfang ·
SLA · Haftung/Datenschutz · Kündigung/Eskalation. Das Blatt verweist auf den Werkvertrag,
es ERSETZT ihn nicht.

### 3. `vorlagen/vertrag/aenderungs-klausel.md` (2-Topf-Regel)

- **Topf 1 — im Abo:** Wunsch passt in den Leistungsumfang → wird ohne Diskussion gemacht,
  erscheint im Wochen-Bericht.
- **Topf 2 — Ausbau:** Grösser als der Umfang → Standard-Satz („Gute Idee — das ist ein Ausbau,
  ich schicke dir bis [Datum] einen Preis.") + separates Add-on-Angebot.
- **Korrektur-Runden:** 2 pro Etappe inklusive, weitere als Ausbau.
- Datei enthält: (a) die Regel fürs Team, (b) einen fertigen Klausel-Absatz zum Einsetzen in
  künftige Werkverträge. **`werkvertrag.md` selbst NICHT umschreiben.**

### 4. `playbook/README.md` aktualisieren

Phasen-Tabelle um Zeile „**6 — Betrieb**" ergänzen (Was: 30/60/90-Ritual + Wert-Bericht +
Baustein-Fahrplan · Ergebnis: Abo hält · Dauer: laufend) + Verweis auf die 3 neuen Dateien.

## Beweis vor „fertig" (beweis-fertig-Skill des Repos nutzen)

1. Alle 4 Dateien existieren, alle Verweise/Links lösen auf (Klassen-Check: keine toten Pfade).
2. SLA-Blatt gegen `vorlagen/vertrag/werkvertrag.md` gelesen — 0 Widersprüche (Rapport-Zeile im PR).
3. Entwurfs-PR mit 5-Zeilen-Zusammenfassung; **nicht mergen, nicht Ready setzen — SA klickt.**

## Nicht-Ziele (bewusst NICHT in diesem Auftrag)

- Phase 7 „Referenz-Fabrik" · Willkommens-Paket-Vorlage · Monats-Wert-Bericht als eigener
  Schwarm · Gryps-Lager-App-Zahl verifizieren (separater 10-Min-Task vor dem Finelli-Termin).
- Keine Änderung an CLAUDE.md, Skills, Hooks, bestehenden Phase-Blättern 0–5.
