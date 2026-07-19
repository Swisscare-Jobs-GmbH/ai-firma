# Todos fuer SA

> Aufgaben-Ablage der AI-Firma. **Schema V1** (abgeschaut vom swisscare-brain, nur das Spalten-Schema).
> Noch leer — der erste Todo bekommt `T1`.

---

## Schema V1 (Pflicht-Datei-Kopf pro Aufgabe)

Jeder Eintrag traegt direkt vor dem `## Heading` diesen Block:

```yaml
<!--
T: 1                           # T-Nummer, fortlaufend, nie wiederverwendet
date: 2026-07-19               # angelegt am
auftraggeber: SA-Direktive     # wer hat's angeordnet (SA-Direktive | Session-<Datum> | Lesson-XY | E<N>)
wichtigkeit: 1                 # 1=kritisch, 2=mittel, 3=low
sterne: 3                      # 1-5 Hebel-Score
leverage: high                 # low | mid | high | compound
thema: [finelli, verkauf]      # max 2 Tags
kunde: finelli                 # finelli | gzf | -   (falls kundenbezogen)
skill_used: []                 # relevante Skills (optional)
knowledge_ref: kunden/finelli/README.md   # Cross-Ref (optional)
status: active                 # active | escalated | done | parked
deadline: 2026-07-22           # konkretes Datum oder "-"
bucket: now                    # now | soon | later
bucket_reason: "1 Satz warum jetzt/spaeter"
context_summary: "1-3 Saetze, damit ein frischer Chat ohne Rueckfrage weiss, was zu tun ist"
-->
## {Emoji} {Datum} — T{N}: {Kurztitel}
{Body: Was · Was tust du · Warum jetzt · Zeit}
<!-- T:{N} END -->
```

**Heading-Emoji synchron mit `wichtigkeit`:** 🔴 (1) · 🟡 (2) · 🟢 (3).
**Bucket-Sortierung:** 🔴 now zuerst, dann 🟡 soon. Erledigt → nach `shared/todos/done/JJJJ-MM.md`
verschieben (T-Nummer bleibt).

---

<!-- Ab hier die Aufgaben. Noch keine. -->
