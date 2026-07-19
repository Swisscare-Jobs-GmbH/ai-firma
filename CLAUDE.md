# ai-firma — Custom-AI-Software fuer kleine Schweizer Betriebe

> Arbeitsname **"ai-firma"**. Angelegt 2026-07-19 aus dem SwissCare-Pivot (Weg E, Sitzung 17.07)
> + dem Finelli-Playbook (18.-19.07). Geschaeft: Software bauen UND per KI weiter betreuen —
> fuer kleine Schweizer Betriebe. Erste 2 Kunden: **Finelli** (Streetwear Zuerich, Lager-App)
> + **GzF / Kaufmann "Gut zu Fuss"** (Orthopaedie-Schuhe Rorschach, Kundendatenbank + Mail-Flows).
>
> Dies ist ein **anderes Geschaeft** als SwissCare. Keine SwissCare-Regeln hier uebernehmen
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

- **Antwort-Format, Sprache, Ton:** gelten rechnerweit ueber `~/.claude/CLAUDE.md` (Person + Sprache
  + Format). **Nicht hier duplizieren** — die globale Datei greift in diesem Ordner automatisch.
  Kern in einem Satz: Deutsch, Fazit oben, scannbar, max 1 Frage, Klartext (10-Jaehrige-Test).
- **Anderer Mensch am Rechner?** Pruefe `.claude/local-user.md` (gitignored, pro Rechner). Fehlt sie:
  User ist SA.

---

## >>> Die 3 Leitplanken (aus der Pivot-Sitzung 17.07) <<<

> Quelle: `swisscare-brain/sitzungen/quartal/2026-07-pivot/05-WEG-E-UHREN-ODER-AI.md`.
> Ohne diese 3 Regeln wird die AI-Firma die "42k-Falle" — Jahr 1 duenn, frisst das Kerngeschaeft.

1. **Verkauf vor Bau.** Mindestens 1 Firma sagt per Absichtserklaerung/Vorbestellung Ja, BEVOR SA
   weiterbaut. Kein Bau auf Verdacht.
2. **SA-Zeit gedeckelt.** Das laufende SwissCare-Vermittlungsgeschaeft (400-600k/Jahr) darf **nicht
   kannibalisiert** werden. Im Zweifel hat das Kerngeschaeft Vorrang.
3. **AB-Closing-Schutz.** AB verkauft die AI-Software nur, wenn sein SwissCare-Case-Closing nicht
   leidet — sonst Umsatzverlust an zwei Fronten.

**Warum hart:** Dieselben 3 Leute bedienen die Cash-Maschine UND bauen Neues. Halbe Kraft auf beiden
Seiten = beide in Gefahr. Die Leitplanken halten den Neu-Weg klein + mit Beweis-Zwang.

---

## >>> Die 6 harten Regeln (aus dem Finelli-Playbook, gelernt aus echten Fehlern) <<<

> Quelle: `swisscare-brain/users/sa/inbox/2026-07-19-playbook-neukunde-software.md`.
> Volle Herleitung im `playbook/` dieses Repos.

| # | Regel | Warum (echter Vorfall) |
|---|---|---|
| 1 | **Bestehendes System des Kunden NIE ersetzen — aufsetzen.** "Alles inbegriffen, keine Extra-Abos." | Shopify ersetzen = Monate + Risiko, kein Hebel (Finelli 18.07). |
| 2 | **Jede Zahl muss der Kunde selbst nachpruefen koennen.** Reviews/Referenzen LIVE verifizieren. | "41 Bewertungen" waere peinlich gewesen — Google hatte 130. Referenz "Jelmoli" existierte nicht mehr (18.07). |
| 3 | **Kunden-Team macht die Handarbeit — wir leiten an.** Nie selbst zaehlen/einraeumen anbieten. | Sonst haftet die AI-Firma fuer fremde Handarbeit (Finelli-Etikettier-Tag). |
| 4 | **Preis-Mathe-Falle: Summenzeile NIE "Marktwert" nennen.** "Dein Preis — Selbstkosten"; Agentur-Anker (30k+) separat. | Raten x Laufzeit = Summe → Kunde rechnet nach, fuehlt sich getaeuscht (Deal-Session 18.07). |
| 5 | **Mock-Formeln am KALENDERTAG verankern** (toordinal), nie am Tages-Abstand. | Sonst Daten-Drift nach jedem Neustart der Uebungs-Welt (Finelli-Bau). |
| 6 | **Jede Etappe speichern + hochladen, Draft-PRs, keine .github/workflows.** | Bau-Minuten-Budget (Lektion aus SwissCare 13.07: Budget leer = alles steht). |

---

## >>> Plan-Mode ≠ Build-Mode (PFLICHT) <<<

"User approved" beim Plan heisst: **der Plan-Inhalt ist akzeptiert** — NICHT "fuehr ihn jetzt aus".
Vor dem ersten Bauen (Edit/Write/Commit) nach Plan-Freigabe explizit fragen:
> "Plan steht. Soll ich jetzt anfangen zu bauen, oder erst noch was klaeren?"

**Ausnahme:** SAs Nachricht enthielt selbst ein Aktions-Verb ("ja bau das" / "los" / "go") → bauen erlaubt.

Drei Stufen (Sprung Lx→Ly, y>x, braucht ein Aktions-Verb):
- **L1** = reden / erklaeren / vorschlagen (Output: Text)
- **L2** = planen (Output: Plan)
- **L3** = bauen / aendern (Output: Edit/Write/Commit)

**Bei Discovery-Pivot** (neue Info macht den Plan hinfaellig): STOP, neuer Vorschlag mit A/B/C-Optionen,
auf SA warten. **Grund:** Ein Drift-Bau kostet 50-70k Tokens bei 0 Output. Eine Frage kostet 200-500.
**100-300x billiger zu fragen als zu reverten.**

---

## >>> GitHub-Minuten-Regel (Budget wie Tokens behandeln) <<<

> Lektion aus SwissCare 13.07: Am Tag 13 war das Bau-Minuten-Budget leer → ALLE Pruefungen standen.

1. **KEINE `.github/workflows/`** — weder in DIESEM Repo noch in einem Kunden-Repo. Bewusst. Als
   harte Regel: nie einen `.github/`-Ordner anlegen.
2. **PRs als Entwurf (Draft) oeffnen**, Ready erst wenn fertig — Draft-PRs loesen keine teuren Laeufe aus.
3. **Roter Check in ~4 Sek. ohne Schritte = KEIN Code-Fehler** — das ist Budget-Deckel oder Infra.
   Nicht blind re-runnen (kostet), erst Ursache pruefen.

---

## >>> Fakten-Live-Regel (nie eine Kunden-Zahl aus dem Bauch) <<<

> Vorfall 18.07 (Finelli): 2x hat nur SA selbst den Fehler gefangen. Text-Checkliste reicht
> nachweislich NICHT — darum ein Auto-Waechter (`.claude/hooks/fakten-live-waechter`).

**Jede Zahl, die in ein Kunden-Dokument geht — Reviews, Bewertungs-Anzahl, Referenzen, Marktzahlen —
wird VOR der Verwendung LIVE nachgeschlagen** (z.B. Google Maps selbst oeffnen, nicht nur Trustpilot).

- "41 Bewertungen" → Google hatte real 130 (peinlich vermieden).
- Referenz "Jelmoli" → Firma existierte nicht mehr (toedliche veraltete Referenz vermieden).

**Merksatz:** Belegte Zahl mit Quelle ODER "weiss ich nicht" — nie eine geratene Zahl im Angebot.

---

## >>> Brain ist dein Zweit-Gedaechtnis (HIER, nicht swisscare-brain) <<<

Das Zweit-Gedaechtnis dieser Firma liegt in **`C:/dev/ai-firma/brain/`** — ein Ordner IM Repo.

- **NICHT** ins `swisscare-brain` schreiben. Grund: Wer swisscare-brain-Zugriff hat, sieht
  SwissCare-Firmendaten + Founder-Privates + ein offenes Privat-Leck in alter Historie. AI-Firma-Daten
  (Kunden-Deals, Finelli-Preise) gehoeren dort nicht hin — und umgekehrt.
- Bei WARUM-Fragen / wichtigen Entscheiden: ins `brain/` schreiben (`decisions/`, `lessons/`).
- **"brain merk dir X"** → in `C:/dev/ai-firma/brain/` schreiben, speichern, hochladen —
  1-Zeilen-Bestaetigung, dann weiter.
- Verweise auf die Nachbar-Repos stehen in `brain/_cross-ref/` (SwissCare, Finelli) — **verweisen
  statt kopieren.**

---

## >>> Kunden-Registry <<<

**Wer ist Kunde, welches Repo, welche Ports, welcher Deal-Stand** → **`kunden/UEBERSICHT.md`**.
Das ist die Quelle der Wahrheit fuer alles Kunden-Konkrete. Neuer Kunde = dort eintragen (Registry),
dann eigener Ordner unter `kunden/`.

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
