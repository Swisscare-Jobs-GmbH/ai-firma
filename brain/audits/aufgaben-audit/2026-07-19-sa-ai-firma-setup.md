---
domain: ai-firma
type: aufgaben-audit
owner: sa
status: done
date: 2026-07-19
user: sa
session_tag: ai-firma-setup
verdict: gelb
gelb_typ: leicht
sektion_status:
  ziel: gelb
  quellen_pool: gruen
  instruktions_treue: gruen
  wurzel_symptom: gruen
  stand: gelb
  swot: na
  wie_gearbeitet: gelb
  empfehlung_count: 4
---

# Aufgaben-Audit — AI-Firma-Setup-Session (2026-07-19, SA)

> Stufe-Schaetzung: **2** (gross, mehrere Domains: Recherche + Repo-Bau + Governance — aber kein
> CRM-V1-Schema-Touch, kein Mandatory-Trigger → kein Hard-Audit-Anhang, kein Trivial-Skip).
> Marker-Lage: Vorheriger Marker gehoerte Session `sa-finelli-logistik-v1-haertung` (01:05) — kein Doppellauf.

## Pflicht-Quellen geladen (V2-Pflicht)

- Alle 5 globalen Skills (`~/.claude/skills/`) ✅ (Inventar-Spaeher, dokumentiert in Synthese)
- CRM-Hook-Inventar `.claude/hooks/` inkl. origin/master-Drift-Check ✅
- Brain-Struktur + `SKILLS-INDEX.md` ✅ (Brain-Spaeher)
- Playbook + Pivot-Doku (05-WEG-E, Playbook-Neukunde, GzF, 8x Finelli) ✅
- finelli-cockpit komplett (docs/, CLAUDE.md, HANDOFF) ✅

## 8-Anker-Status

| # | Anker | Status |
|---|---|---|
| 1 | Praxis-Test-Block (7 Punkte) | ✅ angewandt (unten) |
| 2 | CORS / Production-Hardening | ❌ trifft nicht zu — kein Server-Bau in dieser Session |
| 3 | Externer Review | ❌ kein CRM-Stufe-1-2-Sub-Plan; Aussen-Sicht kommt via Web-Recherche-Schwarm |
| 4 | Hormozi-CHF-Math-Anker | ✅ in Sektion 8 |
| 5 | Worktree-/Parallel-Chat-Risiko | ✅ geprueft (finelli-Sicherung ueber eigene Spur, Marker-Kollision geprueft) |
| 6 | Pflicht-Quellen-Lese-Status | ✅ alle gelesen |
| 7 | Bequemlichkeits-Pattern ("kommt spaeter") | ✅ ehrlich deklariert: Workflows ungetestet = offen, nicht "fertig" |
| 8 | RAV-No-Touch-Beweis | ❌ kein DB-Touch — Session hat keine SwissCare-DB angefasst |

## Praxis-Test-Status (Code-committed ≠ Code-funktioniert)

| # | Test | Status |
|---|---|---|
| 1 | 4 Hooks mit echtem stdin-JSON ausgefuehrt | ✅ (Fakten-Warnung, Schutz-Wall "ask", Inject, Start-Karte) |
| 2 | settings.local.json JSON-Parse | ✅ |
| 3 | Syntax-Checks py_compile / node --check / bash -n | ✅ (durch Bauer + Auditor + nach Fixes wiederholt) |
| 4 | Push-Verify (`git log origin/master..HEAD` leer) | ✅ (3 Commits auf GitHub) |
| 5 | Workflow-Scripts (4 Schwaerme) live ausgefuehrt | ❌ unverifiziert — nur Syntax-Wrap-Check |
| 6 | Neue Skills im Live-Chat getriggert | ❌ unverifiziert — erst naechste Session im ai-firma-Ordner moeglich |
| 7 | Landkarte-Artifact gerendert | ✅ (publiziert, 3 Fassungen) |

2x unverifiziert (unter der 3er-Schwelle; ehrlich in Sektion 5 + 8 adressiert).

---

## 1. ZIEL

Haupt: "Landkarte unseres AI-Setups bauen + neues GitHub fuer die AI-Firma + recherchieren was
vom Setup rueberkopierbar ist + welche Skills/Mitarbeiter/Hooks die AI-Firma braucht — fang an."
Sub-Ziele dazugekommen: 3, alle von SA selbst (#2 Kosten + Team ins Dokument, #3 SwissCare als
Kunde + Mentor, #5 Hooks scharf schalten nach A/B-Frage).
Unaufgeloest: "du weisst ein viudo" aus Input #1 — 1x nachgefragt, nie geklaert. Kleiner
moeglicher Auftrags-Teil verloren.
Status: gelb — Hauptziel klar erfuellt, Scope-Ups sauber mit SA-Zuruf, aber 1 Wort-Fetzen offen.

## 2. QUELLEN-POOL

Files gelesen: ~45 ueber 2 Schwaerme (5 Inventar-Spaeher, 2 Auditoren) + direkt im Chat (~12).
Davon in Outputs zitiert/verwendet: die Synthese verdichtet alle 5 Spaeher-Berichte; Landkarte +
Repo bauen direkt darauf. Pflicht-Quellen gefehlt: keine. Umsonst gelesen: praktisch nichts —
Inventar war der Auftrag.
Besonders: CRM-Drift-Falle (Hauptordner 107 Commits hinter master, Memory-Warnung) aktiv
umgangen — Hooks gegen origin/master verglichen (Diff leer, Beleg im Bauer-Bericht).
Status: gruen.

## 3. INSTRUKTIONS-TREUE

| Input # | Anweisung | Letzte 5 Outputs | Status |
|---|---|---|---|
| #1 | Landkarte + GitHub + Kopier-Recherche + Skills/Mitarbeiter/Hooks | erfuellt (Artifact, Repo, Synthese, TEAM.md) | gruen |
| #1b | "Recherche/Plan/Audit = Fabel 5, sonst Opus 4.8" | alle Schwaerme so gebaut (Denk-Agenten erben Fabel, Bauer/Fixer opus) — auch in TEAM.md + CLAUDE.md als Regel verankert | gruen |
| #2 | "Mitarbeiter/Skills/Schwaerme auch im Dokument" | Landkarte Abschnitt 4 + TEAM.md | gruen |
| #3 | "SwissCare auch Kunde + Mentor dazu" | Registry-Zeile, kunden/swisscare/, TEAM.md, chat-end-Verdrahtung | gruen |
| #5 | "A" (Hooks scharf schalten) | kopiert + 4 Beweis-Laeufe + Zeichensalat-Fix | gruen |
| global | Format (Kopf, Fazit oben, max 1 Frage, Deutsch, Klartext) | alle Outputs konform; genau 1 A/B-Frage gestellt | gruen |

Aggregat: gruen — keine Abweichung von einer SA-Anweisung ueber den Verlauf.

## 4. WURZEL-VS-SYMPTOM

Diagnose: Wurzel-Arbeit. (a) Daten-Wand als Struktur-Entscheid (E1: eigenes brain/ im Repo) statt
bequemem Weiterschreiben ins swisscare-brain; (b) Fakten-Waechter macht aus der 2x nur-durch-SA-
gefangenen Fehlerklasse eine Auto-Mechanik (Wurzel: Checkliste reicht nachweislich nicht);
(c) gitignore-Blocker vom Fixer mit Ground-Truth-Beweis (git ls-tree) statt Behauptung;
(d) finelli-Sicherung als eigene Spur statt Commit auf main (bewusst, dokumentiert).
Workaround-Marker im Diff: 0. Bewusst belassene, dokumentierte Rest-Ungenauigkeit: Stern-Regex im
Warn-Hook ("4.8 Sterne" nennt "8 Sterne") — Warn-only, kein Logik-Einfluss.
Status: gruen.

## 5. STAND

Was laeuft: Repo live auf GitHub (3 Commits, Push-verifiziert) · Landkarte-Artifact (3 Fassungen) ·
4 Hooks scharf + einzeln bewiesen · Finelli-KI-Etappe gesichert (Spur sicherung/ki-etappe-2026-07-19) ·
globale Projekt-Registry + Memory geschrieben.
Was offen: 3 SA-Entscheide (Firmenname/Absender · Repo-Zugriff · avatar.md) — seit 19.07, 0 Tage ·
4 Workflow-Schwaerme + 6 Skills noch nie live gelaufen · GzF-Repo (wartet auf Schmerz-Gespraech) ·
kunden/-Kontext ist KOPIE (Originale bleiben im swisscare-brain — Doppel-Pflege-Risiko).
Was blockiert: nichts hart.
Status: gelb — kein Blocker, aber ungetestete Bauteile ehrlich offen.

## 6. SWOT — Session (rueckwaerts) + System (Auftrag: ganzes Claude-System + Landkarte)

### Session

| Stark (rueckwaerts) | Schwach (rueckwaerts) |
|---|---|
| Beweis-Kultur durchgehalten: 4 Hook-Testlaeufe, Push-Verify, Fixer mit git-ls-tree-Beleg | Erster ls uebersah versteckte Ordner → kurzzeitige Falsch-Warnung (".claude fehlt") an SA |
| "Fertig-Meldung-luegt"-Muster aktiv gegengeprueft (Platte statt Bericht) | Video-Fetzen aus Input #1 bis Session-Ende ungeklaert |
| SA wartete nie: Schwaerme im Hintergrund, Gespraech lief weiter (Kosten-Frage, Kunde 0, Mentor) | Workflows nur syntax-geprueft — Erstflug steht aus |

| Chance (vorwaerts) | Risiko (vorwaerts) |
|---|---|
| GzF-Start in 0.5 statt 2 Tagen (Bootstrap-Skill + Vorlagen) | Erster Schwarm-Einsatz platzt beim echten Kunden-Termin (nie trocken geflogen) |
| Setup selbst ist verkaufbares Muster (jeder Kunde = gleiches Geruest) | Doppel-Pflege: Kunden-Kontext liegt in 2 Gedaechtnissen (brain-inbox + kunden/) |

### System (ganzes Claude-Setup, Landkarten-Sicht)

| Stark | Schwach |
|---|---|
| Format-System barriere-gerecht + rechnerweit (globale CLAUDE.md, Kopf-Waechter-Hook) | Wildwuchs: 3 Fassungen chat-end-clean, doppelte gsd:*-Skill-Listen, 22 Personas — Altlast im CRM/Brain |
| Beweis- + Audit-Kultur ist einzigartig (beweis-fertig, vorflug, aufgaben-audit, Klick-Beweis) | swisscare-crm-Hauptordner haengt 107 Commits hinter master (bekannte Falle, bleibt Stolperstein) |
| Gedaechtnis mit Entscheid-Historie (E-Nummern, Lessons mit Vorfall+Datum) | Brain-Privat-Leck-Historie offen (Purge aussteht seit 15.07 = 4 Tage); Klartext-Login in CRM-safe-merge.md (heute geflaggt als Task-Chip) |
| NEU: saubere Daten-Wand zwischen 2 Firmen (Registry + getrennte Brains) | Kein Ende-zu-Ende-Test-Ritual fuer neue Setups (Hooks ja, Schwaerme/Skills nein) |

| Chance | Risiko |
|---|---|
| Web-Recherche-Abgleich (laeuft) kann gezielt zeigen was Markt-Standard bestaetigt/verbessert | SA-Zeit-Deckel (Leitplanke 2): Setup-Basteln kann Verkaufszeit fressen — Verkauf vor Bau gilt auch fuers eigene Werkzeug |
| Wochen-Bericht-Schwarm verteidigt das Monats-Abo (Churn-Bremse) | 3 offene Entscheide bleiben liegen und blockieren spaeter (z.B. Helfer-Zugriff vs. brain/ im Repo) |

## 7. WIE GUT GEARBEITET

| Was besser | Was schlechter |
|---|---|
| Blockade transparent gemacht statt umgangen (Repo-Sperre → Klick-Link fuer SA) | Falsch-Alarm ".claude fehlt" vor dem Gegencheck ausgesprochen |
| Klassen-Denken: Sicherheitsfund (safe-merge) nicht verschluckt, sondern als eigener Task geflaggt | Kunden-Kontext kopiert statt Umzug sauber zu regeln (Doppel-Quelle bleibt) |
| Jede Bauer-Behauptung gegen Platte/git geprueft | Landkarte 3x nachtraeglich angefasst statt Team/Kunde-0 beim ersten Wurf mitzudenken |

Status: gelb — stark in Beweis + Transparenz, 2 vermeidbare Nachbesserungen.

## 8. EMPFEHLUNG

1. **Trockenflug der 4 Schwaerme** (angebots-judge-panel aufs fertige Finelli-Angebot als Test) —
   CHF-Math: verhindert, dass der Erstflug beim GzF-Angebot platzt; ein verlorener GzF-Deal ≈
   12'000 Bau + 200/Mt Betrieb.
2. **GzF nach dem Schmerz-Gespraech mit /neukunden-bootstrap starten** — CHF-Math: spart ~1.5 Tage
   SA-Zeit pro Kunde, die ins Kerngeschaeft zurueckfliessen (Leitplanke 2; 1.5 Tage ≈ Wert eines
   halben Vermittlungs-Closings an Zuarbeit).
3. **Doppel-Quelle aufloesen:** die 9 Finelli/GzF-Dateien im swisscare-brain-Inbox als "umgezogen
   nach ai-firma/kunden/" markieren (1 Zeile pro Datei) — CHF-Math: verhindert Beratung auf
   veralteter Deal-Zahl beim Kunden (Peinlichkeits-/Vertrauens-Schaden, Playbook-Regel 2).
4. **Web-Recherche-Ergebnis umsetzen** (siehe Anhang unten, sobald Schwarm fertig) — nur die
   Verbesserungen mit klarem Solo-Nutzen.

---

## ANHANG: Web-Recherche-Abgleich (4 Spaeher + 1 Richter, Fabel 5, 19.07)

### 1. BEHALTEN — von der Recherche bestaetigt

| Was wir haben | Was es stuetzt |
|---|---|
| Schutz-Wall-Hook (Auto-Bremsen statt nur Text-Regeln) | Anthropic-Blog: Text-Regeln brechen unter Druck — nur Hooks greifen sicher |
| Brain als Markdown-Dateien (kleiner Index + Details, keine Datenbank) | Praktiker-Bilanz 2026: "Markdown + bash gewann, alles Clevere verlor" |
| beweis-fertig (kein "fertig" ohne Klick-Beweis) | METR-Studie: 16-80% der Agenten-Fertigmeldungen waren geschummelt |
| Nur Haupt-Chat schreibt, Schwaerme lesen; Agent mergt nie | Cognition/Devin: genau das Muster, das haelt — "Stille Post" ist der Multi-Agenten-Killer |
| Lessons anhaengen mit Datum+Vorfall, nie umschreiben | Forschung 2026: selbst-umgeschriebenes Gedaechtnis driftet messbar |
| Wochen-Kundenbericht-Workflow | Agentur-Daten: Kunden kuendigen wegen unsichtbarem Wert, nicht wegen Preis |

### 2. VERBESSERN — priorisiert, klein, solo-tauglich

| # | Was tun | Aufwand | Bringt |
|---|---|---|---|
| 1 | CLAUDE.md entschlacken: Vorfall-Historie ins brain/, pro Regel 1 Zeile (Richtwert ~200 Zeilen) | ~2 Std pro Firma | Offizielles Anti-Pattern Nr. 1 weg — Claude befolgt die wichtigen Regeln wieder |
| 2 | Verbots-Regeln haerten: "kein Merge / keine CI / keine Repos" zusaetzlich als Sperr-Hook/Deny-Regel | ~1 Std | Regel greift auch wenn Text-Gehorsam bricht (lange Chats) |
| 3 | Alter anzeigen: Start-Hook stempelt Registry-/Lesson-Zeilen mit "N Tage alt" | ~30 Min | Passt zur "seit wann"-Pflicht; alte Fakten luegen nicht mehr still |
| 4 | Richter-Prompts schaerfen: strikt unabhaengig voten, Skeptiker NUR auf Korrektheit | ~30 Min | Debatten verstaerken Bias; Luecken-Sucher findet sonst IMMER was |
| 5 | Status-Feld fuer E-Entscheide: "aktiv / ersetzt durch E-xx" | ~1 Std | Widerspruechliche Entscheide stehen nicht still nebeneinander |
| 6 | Angebots-Panel + Werkvertrag: 4 Pflicht-Checks (Abo? Vorlage? Anker? Werkzeuge?) + Klausel "Vorlage bleibt bei uns" | ~1 Std | Marge + Wiederverwendung rechtlich streitfest (CH) |

**Widerspruch aufgeloest:** "Viele kleine Richter schlagen einen grossen" vs. "bei gleichem Budget
gewinnt der Einzel-Agent" — der Panel-Vorteil kommt aus Modell-VIELFALT; wir haben nur Claude.
Urteil: Panels behalten, aber klein + strikt unabhaengig, nicht weiter ausbauen.

### 3. FINGER WEG — Hype/Fallen

| Was | Warum nicht |
|---|---|
| Vektor-Datenbank / RAG fuers Brain | Bis Tausende Eintraege schlaegt Markdown alles — Energie in Kuration, nicht Technik |
| Agenten-Schwaerme fuer Denk-/Bau-Arbeit | ~15x Token-Kosten; Schwaerme NUR fuer paralleles LESEN (Recherche) — genau da haben wir sie |
| Debatten-Runden zwischen Richtern | Verstaerkt Mitlaeufer-Effekt nach Runde 1 — unabhaengig voten + auszaehlen ist das belegte Muster |

Weitere Roh-Erkenntnisse (Skills-Trigger, Kontext-Hygiene, pfad-gebundene Regeln):
Workflow-Journal `wf_f8083228-5e3` (Session-Transkript).
