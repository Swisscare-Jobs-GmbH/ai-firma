# Kunden-Uebersicht (Registry)

> Die eine Liste aller Kunden. **Quelle fuer den `kunden-anker-inject`-Hook** — die Tabelle unten
> wird pro Chat oben eingeblendet. Ampel: 🟢 laeuft/bezahlt · 🟡 in Anbahnung/offen · 🔴 blockiert.
> Stand 2026-07-20. Pfad-Karte pro Rechner: `brain/_cross-ref/WORKSPACE-AIWORKS.md`.

| Kunde | Repo | Ports (Backend/Frontend) | Stack | Deal-Stand | seit |
|---|---|---|---|---|---|
| **SwissCare** (Kunde 0 — Serum/CRM, internes Produkt) | `C:\dev\swisscare-crm` | 8000 / 3000 (reserviert) | Astro+React / FastAPI / Supabase | 🟢 laeuft produktiv, wird weiter betreut | vor Firmen-Start |
| **Finelli** (Streetwear Zuerich, Lager-App auf Shopify) | MVP: `C:\dev\finelli-cockpit` (SA) · Produktion: `C:\Projects\AIWorks\finelli-lagerverwaltung` (AB, GitHub `AbdulBhatti2001/finelli-lagerverwaltung`, Phase 1 — noch kein Code) | 8012 / 5173 (Cockpit) · Lagerverwaltung noch offen | Cockpit: Python/FastAPI + Vite · Lagerverwaltung: React-PWA + Node + Postgres (geplant) | 🟡 Angebot V6 ueberreicht 19.07 · Verkaufs-Demo in `finelli/demo/` (20.07) | 18.07.2026 |
| **GzF** (Kaufmann Gut zu Fuss, Orthopaedie Rorschach — Kundendatenbank + Mail-Flows) | noch kein Repo | noch offen | offen (finelli-Basis vs. NocoDB) | 🟡 Angebots-Mappe v2 gebaut 20.07 (650/Mt, unter Deckel 850), Uebergabe-Termin offen | 19.07.2026 |

## Detail pro Kunde

- **SwissCare** → [swisscare/README.md](swisscare/README.md) — internes Produkt, Daten-Wand beachten.
- **Finelli** → [finelli/README.md](finelli/README.md) — Deal 2'500 + 1'000/Mt, KI-Etappe in Arbeit.
- **GzF** → [gzf/README.md](gzf/README.md) — Schmerz-Gespraech ausstehend, Inhaber Farhad Akbarzada.

## Konvention

- Neue Kunden bekommen eine Zeile hier + einen Ordner `kunden/<kuerzel>/` mit `README.md` (Stand,
  Deal, naechster Schritt) und dem Kunden-Kontext (Recherche, Schmerz, Angebot).
- Ports NIE 8000/8001/3000-3002 (dort laeuft das SwissCare-CRM) — pro Kunde eigener Port-Block.
