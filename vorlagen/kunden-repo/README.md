# {KUNDE} {PRODUKT_NAME} (VORLAGE)

> Herkunft: Finelli-Cockpit-README. Platzhalter ersetzen, Legende am Ende.

**Was ist das?** {EIN_SATZ_WAS_DIE_APP_TUT — z.B. "Eine kleine Web-App fuer {KUNDE}: {KERN_NUTZEN}"}.

**Kunde:** {KUNDE_RECHTSFORM}. Die App ist {AUFSATZ_ODER_STANDALONE} auf {PLATTFORM_ODER_BESTAND} —
{FUEHRENDES_SYSTEM} bleibt der Chef ueber {WAHRHEITS_GEGENSTAND}, die App ist nur das Fenster.
*(Zweiten Satz weglassen, wenn die App eigenstaendig ist.)*

Der volle Plan steht in [docs/PLAN.md](docs/PLAN.md).

---

## Starten

**Backend** (Port {PORT_BACKEND}):

```powershell
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port {PORT_BACKEND}
```

**Frontend** (Port {PORT_FRONTEND}):

```powershell
cd frontend
npm install
npm run dev
```

---

## Uebungs-Modus (MOCK_MODE)

Mit `MOCK_MODE=true` (Standard-Wahl, in `backend/.env`) laeuft die App **komplett ohne
{ECHT_SCHLUESSEL}** — mit realistischen Probe-Daten: {PROBE_BESCHREIBUNG}, ein paar bewusst im
Grenzbereich (damit Ampeln/Alarme sichtbar werden). So kann jeder sofort klicken und testen, bevor
der echte {ECHT_SYSTEM}-Zugang da ist.

---

## Bau-Etappen

| Etappe | Was fertig ist | Status |
|---|---|---|
| 1 | {ETAPPE_1_ZIEL} | ⬜ |
| 2 | {ETAPPE_2_ZIEL} | ⬜ |
| 3 | {ETAPPE_3_ZIEL} | ⬜ |
| 4 | {ETAPPE_4_ZIEL} | ⬜ |
| 5 | Robustheit + Abnahme mit {KUNDE} | ⬜ |

Details zu jeder Etappe: [docs/PLAN.md](docs/PLAN.md) · Zugang einrichten:
[docs/ZUGANG.md](docs/ZUGANG.md) *(aus `vorlagen/termine/zugangs-anleitung.md` je Plattform)*.

---

## Platzhalter-Legende (Kurz)

`{KUNDE}`/`{KUNDE_RECHTSFORM}` = Kunde · `{PRODUKT_NAME}` = Produktname · `{EIN_SATZ_WAS_DIE_APP_TUT}`/
`{KERN_NUTZEN}` = 1-Satz-Pitch · `{AUFSATZ_ODER_STANDALONE}`/`{PLATTFORM_ODER_BESTAND}`/
`{FUEHRENDES_SYSTEM}`/`{WAHRHEITS_GEGENSTAND}` = Anbindung · `{PORT_BACKEND}`/`{PORT_FRONTEND}` =
Ports · `{ECHT_SCHLUESSEL}`/`{ECHT_SYSTEM}`/`{PROBE_BESCHREIBUNG}` = Uebungs-Modus ·
`{ETAPPE_1..4_ZIEL}` = Etappen-Ziele.
