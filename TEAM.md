# TEAM.md — Das KI-Team der AI-Firma

> Angelegt 2026-07-19. Wer hier "arbeitet", welches Modell er nutzt und welche Werkzeuge er hat.
> Modell-Regel (SA-Direktive 19.07): **Fabel 5 denkt** (Recherche, Plan, Urteil, Audit) ·
> **Opus 4.8 baut** (Code, Dateien, Berichte). In Workflow-Scripts: Denk-Agenten OHNE
> model-Option (erben Fabel 5), Bau-Agenten mit `model: 'opus'`.

## Die Mitarbeiter (Agenten-Rollen)

| Rolle | Modell | Einsatz | Was er tut |
|---|---|---|---|
| **HQ** (Chef-Koordinator) | Fabel 5 | jeder Chat | Fuehrt das Gespraech, verteilt Arbeit an Subagenten, webt Ergebnisse ein. Antwortet SA im Pflicht-Format. |
| **Spaeher** | Fabel 5 | `phase0-recherche-schwarm` | Firmen-Profil (Handelsregister+Web), Reviews LIVE nachzaehlen, Branchen-Schmerzen, Konkurrenz. |
| **3 Richter** (Hormozi · Menschen-Natur · Fakten-Skeptiker) | Fabel 5 | `angebots-judge-panel` | Zerpfluecken jedes Angebot vor dem Druck. Fakten-Funde = Pflicht-Fix. |
| **Skeptiker** (Verifizierer) | Fabel 5 | `mvp-klick-beweis` + Audits | Versucht jeden Fund zu WIDERLEGEN — nur Bestaetigtes zaehlt (2 Skeptiker, Mehrheit). |
| **Bauer** | Opus 4.8 | MVP-Etappen, Vorlagen einsetzen | Schreibt Code und Dateien nach Plan, testet Syntax selbst. |
| **Fixer** | Opus 4.8 | nach jedem Audit | Behebt bestaetigte Funde, prueft Syntax nach, aendert NUR was der Fund verlangt. |
| **Schreiber** | Opus 4.8 | `ki-wochen-bericht` | 1-Seiten-Kundenbericht in Laien-Klartext (was lief, was kommt, 1 Kennzahl). |
| **Mentor** | Fabel 5 | Chat-Ende + Aufgaben-Audit | Blickt auf die ARBEITSWEISE zurueck (nicht aufs Ergebnis): was lief gut/schlecht, 1 Lesson nach brain/lessons/, Format-Drift anmahnen. |

> **Bewusst NICHT uebernommen:** die 22-Personas-Sammlung aus dem SwissCare-Brain.
> Neustart klein (SA 19.07): Mentor zuerst, weitere Rollen nur bei echtem, wiederholtem Bedarf.

## Ihre Werkzeuge

### 6 Skills (`.claude/skills/` — wiederverwendbare Befehle)

| Skill | Was er tut |
|---|---|
| `neukunden-bootstrap` | Kunden-App aus finelli-cockpit-Basis klonen: Branding + Mock-Daten tauschen, Ports registrieren — 0.5 statt 2 Tage. |
| `deal-mathe` | Rechnet Deals IMMER frisch nach Playbook Phase 2 (0 vorab · Selbstkosten auf 24 Raten · Garantie · Joker) — nie aus altem Chat-Wissen. |
| `schmerz-fragen` | Erzeugt die 10 Schmerz-Fragen fuer einen neuen Kunden (GzF-Muster, Geld-Hebel-Frage Pflicht). |
| `beweis-fertig` | Kein "fertig" ohne Beleg: Klassen-Sweep + Selbst-Klick-Beweis im MOCK_MODE des Kunden-Repos. |
| `vorflug` | Mess-Basis-Stempel vor jeder Arbeit: Zweig@Hash, Port->Prozess->Ordner — nie auf falschem Stand arbeiten. |
| `chat-end-clean` | Sauberer Chat-Abschluss: Commit+Push+Verify, 1 Lesson, Uebergabe-Prompt. |

### 4 Auto-Mechaniken (`.claude/hooks/` — laufen von selbst)

| Hook | Was er tut |
|---|---|
| `fakten-live-waechter` | Warnt bei jeder Beleg-Zahl in Angebot/Vertrag: "live nachgezaehlt?" — die Fehlerklasse, die 2x nur SA selbst fing (41-Bewertungen/Jelmoli, 18.07). |
| `protected-change-guard` | Schuetzt CLAUDE.md, playbook/, vorlagen/vertrag/, .claude/ vor Aenderung ohne expliziten SA-Auftrag. |
| `session-start-card` | Zeigt beim Chat-Start: git-Stand, offene PRs, Kunden-Ampel, Format-Erinnerung. |
| `kunden-anker-inject` | Spielt die Kunden-Registry (kunden/UEBERSICHT.md) als Kontext in jeden Chat ein. |

### 3 Befehle (`.claude/commands/`)

| Befehl | Was er tut |
|---|---|
| `safe-commit` | Neuer Endpunkt ohne curl-Beweis = kein Commit. |
| `sync` | Zweig sicher mit main abgleichen, Konflikte ohne Feature-Verlust loesen. |
| `weekly-review` | Woechentlicher Gesundheits-Check + Kunden-Ampel aktualisieren. |

### 4 Schwaerme (`.claude/workflows/` — Agenten-Teams)

| Schwarm | Wann | Team |
|---|---|---|
| `phase0-recherche-schwarm` | neuer Kunde, Tag 1 | 6 Spaeher parallel + 1 Verdichter |
| `angebots-judge-panel` | vor JEDEM Kunden-PDF | 3 Richter + 1 Verdichter |
| `mvp-klick-beweis` | vor jedem Kunden-Termin | Finder + 2 Skeptiker pro Fund |
| `ki-wochen-bericht` | jeden Montag pro Kunde | 1 Sammler + 1 Schreiber |

## Grenzen (was KEIN Mitarbeiter darf)

- GitHub-Repos anlegen, Zweige zusammenfuehren, Freigaben setzen — **nur SA klickt das**.
- Kunden-Zahlen behaupten ohne Live-Beleg (Quelle nennen oder "weiss nicht").
- In fremde Firmen-Gedaechtnisse schreiben (SwissCare-Brain <-> ai-firma/brain sind getrennt).
- `.github/workflows/` anlegen (GitHub-Minuten-Budget).
