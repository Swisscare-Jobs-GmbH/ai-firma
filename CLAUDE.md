# ai-firma — Custom-AI-Software fuer kleine Schweizer Betriebe

> Arbeitsname **"ai-firma"**. Angelegt 2026-07-19 aus dem SwissCare-Pivot (Weg E, Sitzung 17.07)
> + dem Finelli-Playbook (18.-19.07). Geschaeft: Software bauen UND per KI weiter betreuen —
> fuer kleine Schweizer Betriebe. 3 Kunden: **SwissCare** (Kunde 0 — Serum/CRM, laeuft produktiv)
> + **Finelli** (Streetwear Zuerich, Lager-App) + **GzF / Kaufmann "Gut zu Fuss"** (Orthopaedie-
> Schuhe Rorschach, Kundendatenbank + Mail-Flows). Team-Rollen: `TEAM.md`.
>
> Dies ist ein **anderes Geschaeft** als SwissCare. Keine SwissCare-Regeln uebernehmen
> (RAV, Provision, Rot-System, JT/AB-Rollen gelten hier NICHT).

---

## Quick-Digest (immer aktiv — die 30-Sekunden-Version)

| Regel | Kurz |
|---|---|
| **Verkauf vor Bau** | Erst 1 Kunde sagt Ja (Absichtserklaerung/Vorbestellung), DANN wird gebaut. |
| **SA-Zeit-Deckel** | SwissCare-Kerngeschaeft (400-600k) hat Vorrang — die AI-Firma darf es nicht auffressen. |
| **Fakten LIVE pruefen** | Jede Kunden-Zahl (Reviews, Referenzen) vor Nutzung selbst nachschlagen. Nie aus dem Bauch. |
| **Preis nie senken, nur Zeit** | Software-Preis wird nie reduziert — bei Stoerung verschieben sich nur die Raten. |
| **Summenzeile nie "Marktwert"** | Raten x Laufzeit = "Dein Preis / Selbstkosten", NIE als Marktwert benannt. |
| **Keine .github/workflows** | Weder im Firmen- noch in Kunden-Repos. Draft-PRs. Spart Bau-Minuten-Budget. |
| **Klick-Beweis vor "fertig"** | Kein "fertig" ohne echten Klick/Service-Aufruf. Ein Build zaehlt nie als Test. |
| **Brain = `brain/` HIER** | Zweit-Gedaechtnis dieser Firma liegt in `C:/dev/ai-firma/brain/`, NICHT im swisscare-brain. |
| **Modelle** | Recherche/Plan/Audit = Fabel 5 · Bau = Opus 4.8. |

---

## >>> Wer arbeitet hier? <<<

**Standard-User = SA (Shehryaar Khawaja).** Er baut die Firma auf.

- **Format, Sprache, Ton** gelten rechnerweit ueber `~/.claude/CLAUDE.md` — **nicht hier duplizieren**.
  Kern: Deutsch, Fazit oben, scannbar, max 1 Frage, Klartext (10-Jaehrige-Test).
- **Anderer Mensch am Rechner?** Pruefe `.claude/local-user.md` (gitignored). Fehlt sie: User ist SA.

---

## >>> Die 3 Leitplanken (Pivot-Sitzung 17.07) <<<

> Warum: `brain/lessons/system/2026-07-19-leitplanken-42k-falle.md` (die "42k-Falle" + warum hart).

1. **Verkauf vor Bau.** Min. 1 Firma sagt per Absichtserklaerung/Vorbestellung Ja, BEVOR weitergebaut wird. Kein Bau auf Verdacht.
2. **SA-Zeit gedeckelt.** Das SwissCare-Geschaeft (400-600k/Jahr) darf nicht kannibalisiert werden — im Zweifel Vorrang.
3. **AB-Closing-Schutz.** AB verkauft die AI-Software nur, wenn sein SwissCare-Case-Closing nicht leidet.

---

## >>> Die 6 harten Regeln (Finelli-Playbook) <<<

> Warum (echte Vorfaelle je Regel): `brain/lessons/system/2026-07-19-finelli-echte-vorfaelle.md`.
> Destillat auch in `playbook/`.

1. **Bestehendes System des Kunden NIE ersetzen — aufsetzen.** "Alles inbegriffen, keine Extra-Abos."
2. **Jede Zahl muss der Kunde selbst nachpruefen koennen.** Reviews/Referenzen LIVE verifizieren.
3. **Kunden-Team macht die Handarbeit — wir leiten an.** Nie selbst zaehlen/einraeumen anbieten.
4. **Preis-Mathe-Falle: Summenzeile NIE "Marktwert" nennen.** "Dein Preis — Selbstkosten"; Agentur-Anker (30k+) separat.
5. **Mock-Formeln am KALENDERTAG verankern** (toordinal), nie am Tages-Abstand.
6. **Jede Etappe speichern + hochladen, Draft-PRs, keine .github/workflows.**

---

## >>> Plan-Mode ≠ Build-Mode (PFLICHT) <<<

> Warum (Drift-Bau kostet 50-70k Tokens, Frage 200-500 → 100-300x billiger): `brain/lessons/system/2026-07-19-prozess-guards-warum.md`.

"User approved" beim Plan = der Plan-**Inhalt** ist akzeptiert, NICHT "fuehr ihn jetzt aus". Vor dem
ersten Bauen (Edit/Write/Commit) fragen: *"Plan steht. Jetzt bauen, oder erst noch klaeren?"*

- **Ausnahme:** SAs Nachricht enthielt selbst ein Aktions-Verb ("ja bau das" / "los" / "go") → bauen erlaubt.
- **Stufen** (Sprung Lx→Ly braucht Aktions-Verb): **L1** reden · **L2** planen · **L3** bauen/aendern.
- **Bei Discovery-Pivot** (neue Info macht Plan hinfaellig): STOP, neuer Vorschlag mit A/B/C, auf SA warten.

---

## >>> GitHub-Minuten-Regel (Budget wie Tokens behandeln) <<<

> Warum (SwissCare 13.07: Budget leer = alles stand still): `brain/lessons/system/2026-07-19-prozess-guards-warum.md`.

1. **KEINE `.github/workflows/`** — weder in diesem noch in einem Kunden-Repo. Nie einen `.github/`-Ordner anlegen.
2. **PRs als Entwurf (Draft) oeffnen**, Ready erst wenn fertig — Draft-PRs loesen keine teuren Laeufe aus.
3. **Roter Check in ~4 Sek. ohne Schritte = KEIN Code-Fehler**, sondern Budget-Deckel/Infra. Nicht blind re-runnen — erst Ursache pruefen.

---

## >>> Fakten-Live-Regel (nie eine Kunden-Zahl aus dem Bauch) <<<

> Warum (Vorfaelle "41 statt 130 Bewertungen", tote Referenz "Jelmoli"): `brain/lessons/system/2026-07-19-finelli-echte-vorfaelle.md`.

**Jede Zahl fuer ein Kunden-Dokument** (Reviews, Bewertungs-Anzahl, Referenzen, Marktzahlen) wird
VOR der Verwendung LIVE nachgeschlagen (z.B. Google Maps selbst oeffnen, nicht nur Trustpilot).
Auto-Waechter: `.claude/hooks/fakten-live-waechter`. **Merksatz:** Belegte Zahl mit Quelle ODER
"weiss ich nicht" — nie eine geratene Zahl im Angebot.

---

## >>> Brain ist dein Zweit-Gedaechtnis (HIER, nicht swisscare-brain) <<<

> Warum (swisscare-brain enthaelt Firmendaten + Privates + Alt-Leck): `brain/lessons/system/2026-07-19-prozess-guards-warum.md`.

Das Zweit-Gedaechtnis dieser Firma liegt in **`C:/dev/ai-firma/brain/`** — ein Ordner IM Repo.

- **NICHT** ins `swisscare-brain` schreiben. AI-Firma-Daten (Kunden-Deals, Finelli-Preise) und SwissCare-Inhalt bleiben getrennt.
- Bei WARUM-Fragen / wichtigen Entscheiden: ins `brain/` schreiben (`decisions/`, `lessons/`).
- **"brain merk dir X"** → in `brain/` schreiben, speichern, hochladen — 1-Zeilen-Bestaetigung, weiter.
- Nachbar-Repos ueber `brain/_cross-ref/` — **verweisen statt kopieren.**

---

## >>> Kunden-Registry <<<

**Wer ist Kunde, welches Repo, welche Ports, welcher Deal-Stand** → **`kunden/UEBERSICHT.md`** (Quelle
der Wahrheit). Neuer Kunde = dort eintragen, dann eigener Ordner unter `kunden/`.

---

## >>> Modell-Regel (SA-Direktive 19.07) <<<

| Aufgabe | Modell |
|---|---|
| Recherche · Plan · Audit | **Fabel 5** |
| Bau (Code schreiben/aendern) | **Opus 4.8** |

---

## >>> READ-BEFORE-ASK (PFLICHT) <<<

Vor **jeder** Frage an SA zuerst selbst suchen — in dieser Reihenfolge:
1. **Chat-Verlauf** (wurde es schon gesagt?)
2. **Repo** (Code, `playbook/`, `vorlagen/`, `kunden/`, Git-History)
3. **Brain** (`C:/dev/ai-firma/brain/` — hier steht das WARUM)
4. **Nachbar-Repos** ueber `brain/_cross-ref/` (nur wenn wirklich noetig)

**Treffer:** Antwort verwenden, nicht fragen. **Alle Quellen leer:** Frage mit konkreten Optionen
(A/B/C mit Empfehlung), nicht "was meinst du?".
