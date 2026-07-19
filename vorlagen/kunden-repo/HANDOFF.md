# HANDOFF — {KUNDE} {PRODUKT_NAME} — Stand {DATUM} (VORLAGE)

> Uebergabe an den naechsten Chat. ZUERST lesen: `CLAUDE.md` + dieses File + `docs/PLAN.md`.
> Brain-Kontext: `C:\dev\ai-firma\kunden\{KUNDE_KUERZEL}\`.
> **Stand-Aussagen sind Momentaufnahmen — vor Analyse messen (`/vorflug` bzw. `/readiness`), nicht glauben.**

## Wo wir stehen (alles gepusht, Stand origin/{BRANCH} @ {COMMIT})

| Bereich | Stand |
|---|---|
| {BEREICH_1} | {STATUS_1 — 🟢/🟡/🔴 + 1 Zeile} |
| {BEREICH_2} | {STATUS_2} |
| {BEREICH_3} | {STATUS_3} |
| Deal | {DEAL_STAND — Preis / Raten / Betrieb / Garantie / Joker (Quelle: Angebot + Vertrag)} |
| Vertrag | {VERTRAG_STAND — Entwurf auf Deal-Stand? juristisch geprueft?} |

## Blocker + Wartepunkte

1. **{BLOCKER_1 — z.B. Schluessel/Zugang vom Kunden}** (seit {DATUM}): {FOLGE_OHNE}. Anleitung:
   `docs/ZUGANG.md`. {ECHT_MODUS_HINWEIS — solange ungetestet: Pflichtsatz "Echt-Modus nicht am Schirm gesehen"}.
2. **SA-Aktionen offen:** {SA_AKTIONEN}.
3. **Vor Ort / beim Kunden klaeren:** {VOR_ORT_FRAGEN}.

## Harte Regeln (Kurzform — Details in CLAUDE.md)

- Ports **{PORT_BACKEND}** (Backend) / **{PORT_FRONTEND}** (Frontend). NIE CRM-Ports (8000/8001/3000-3002).
- {FUEHRENDES_SYSTEM} = einzige Wahrheit · NIE {VERBOTENE_DATEN} lesen · Buchung nur mit Bestaetigen-Klick.
- KEINE .github/workflows (GitHub-Minuten). {PUSH_REGEL — z.B. Direkt-Pushes auf main ok bei 1 Bauer}.
- Uebungs-Modus (MOCK_MODE=true) laeuft IMMER ohne {ECHT_SYSTEM} — eigene DB `{DB_UEBUNG}`.
- Vor "fertig": pytest + Klick-Beweis + **Zombie-Riegel** (`/readiness`: `gestartet_um` juenger als
  letzte Code-Aenderung? `code_stand` = erwarteter Commit?).
- Antwort-Format fuer SA: globale `~/.claude/CLAUDE.md` (Deutsch, Kopf, Fazit zuerst, max 1 Frage).

## Start-Rezept (NUR so — sonst Zombie-Gefahr)

```
cd {REPO_PFAD}\backend ; .\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port {PORT_BACKEND}
cd {REPO_PFAD}\frontend ; npm run dev        # {PORT_FRONTEND}, .env zeigt auf {PORT_BACKEND}
Login: {LOGIN_BEISPIEL}
Check: curl localhost:{PORT_BACKEND}/readiness  ->  gestartet_um frisch? code_stand = git rev-parse --short HEAD?
```

## Empfohlene Reihenfolge naechste Session

1. {NAECHSTER_SCHRITT_1}
2. {NAECHSTER_SCHRITT_2}
3. {NAECHSTER_SCHRITT_3}

---

## Platzhalter-Legende (Kurz)

`{KUNDE}`/`{KUNDE_KUERZEL}` · `{PRODUKT_NAME}` · `{DATUM}`/`{BRANCH}`/`{COMMIT}` = Stand-Stempel ·
`{BEREICH_x}`/`{STATUS_x}` = Fortschritts-Tabelle · `{DEAL_STAND}`/`{VERTRAG_STAND}` = kaufmaennisch ·
`{BLOCKER_1}`/`{SA_AKTIONEN}`/`{VOR_ORT_FRAGEN}` = offen · `{PORT_BACKEND}`/`{PORT_FRONTEND}`/
`{REPO_PFAD}`/`{LOGIN_BEISPIEL}` = Start · `{FUEHRENDES_SYSTEM}`/`{ECHT_SYSTEM}`/`{VERBOTENE_DATEN}`/
`{DB_UEBUNG}` = Regeln · `{NAECHSTER_SCHRITT_x}` = To-do.
