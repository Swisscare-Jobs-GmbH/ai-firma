# vorlagen/branchen/ — Branchen-Schablonen (was der Sync-Layer befuellt)

> Angelegt 2026-07-20 (Workspace-Auftrag AB, Entscheid [E4](../../brain/decisions/E4-workspace-meta-layer.md)).
> Zweck: Pro Branche EINE Schablone mit den uebertragbaren Lehren aus echten Kunden-Projekten.
> Befuellt wird sie vom Workspace-Sync (`/brain-sync` + Branchen-Analyst): Kunden-Arbeit ->
> verallgemeinerte Lehre -> hier. Kundenspezifisches (Preise, Namen, Zahlen) bleibt draussen —
> Preise leben NUR in `vorlagen/angebot/` + `vorlagen/vertrag/`.

## Regeln fuer jede Schablonen-Datei

1. Kopf: H1 mit "(BRANCHEN-VORLAGE)" + Blockquote `> Herkunft: <Kunde>-<Artefakt> / destilliert am DATUM`.
2. Platzhalter GROSS in geschweiften Klammern (`{KUNDE}`, `{STANDORT_1}`) + Legende am Datei-Ende.
3. Beleg-Marker an jeder Zahl: ✅ gegen-geprueft · 🔍 nicht gegen-geprueft · 💡 eigene Einschaetzung.
4. Duplikat-Verbot: bestehende Schablone UPDATEN, nie eine zweite fuer dieselbe Branche anlegen.
5. Umlaute als ae/oe/ue (Repo-Konvention).

## Register

| Schablone | Branche | Herkunft | Stand |
|---|---|---|---|
| [shop-detailhandel.md](shop-detailhandel.md) | Laden + Online-Shop (Bestand/Lager) | Finelli (Kunde 1) | 2026-07-20 |
| [kunden-rueckhol-crm.md](kunden-rueckhol-crm.md) | Fachgeschaeft mit Wiederkauf-Potenzial (CRM/Recall) | GzF (Kunde 2) | 2026-07-20 |

Neue Branche = neue Zeile hier + neue Datei (Format oben). Der `branchen-analyst`-Agent
(Workspace `.claude/agents/`) schlaegt beides vor; geschrieben wird im Haupt-Chat.
