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

<!-- Ab hier die Aufgaben. -->

<!--
T: 1
date: 2026-07-20
auftraggeber: Session-2026-07-20 (Workspace-Setup AB)
wichtigkeit: 1
sterne: 4
leverage: high
thema: [governance, brain]
kunde: -
skill_used: []
knowledge_ref: brain/decisions/E3-setup-entscheide-19-07.md
status: active
deadline: -
bucket: now
bucket_reason: "E3 Punkt 2 ist faktisch verletzt, solange AB Repo-Zugriff hat und brain/ im Repo liegt"
context_summary: "E3 sagt: VOR jedem Helfer-Invite (z.B. Abdul) brain/ in ein eigenes Repo ausgliedern. AB arbeitet seit 20.07 mit vollem Workspace-Zugriff auf ai-firma (C:\\Projects\\AIWorks). SA entscheidet: (A) brain/-Split jetzt durchziehen (1-Tages-Umzug laut E1/E3), (B) AB-Zugriff bewusst freigeben und E3 per neuem Entscheid ersetzen. Zusatz laut user-brain-v2-bauplan: JT-Mitzugriff auf ai-firma pruefen/entfernen."
-->
## 🔴 2026-07-20 — T1: Brain-Split vs. AB-Zugriff — E3 Punkt 2 aufloesen
Was: E3 verlangt brain/-Ausgliederung vor Helfer-Zugriff; AB hat seit 20.07 Zugriff.
Was tust du: Entscheid A (Split jetzt) oder B (E3 ersetzen) — 1 Antwort genuegt.
Warum jetzt: Gedaechtnis + Kunden-Deals liegen sonst offen fuer jeden Repo-Zugriff. Zeit: 5 Min Entscheid, Umzug ~1 Tag.
<!-- T:1 END -->

<!--
T: 2
date: 2026-07-20
auftraggeber: Session-2026-07-20 (Workspace-Setup AB)
wichtigkeit: 2
sterne: 3
leverage: mid
thema: [doku, entscheide]
kunde: -
skill_used: []
knowledge_ref: brain/_cross-ref/WORKSPACE-AIWORKS.md
status: active
deadline: -
bucket: soon
bucket_reason: "Schutz-Zonen (CLAUDE.md) darf nur SA aendern; Drift bleibt bis dahin dokumentiert"
context_summary: "Zwei Nachzieh-Punkte, beide in SA-Schutz-Zonen: (1) ai-firma/CLAUDE.md verweist hart auf C:/dev/ai-firma/brain/ — auf Pfad-Karte (brain/_cross-ref/WORKSPACE-AIWORKS.md) umstellen. (2) Absender-Entscheid vom 19.07 abends ('Shehryaar Khawaja — Software & KI' fuer Kunden-Blaetter, Handoff 19.07) als E-Entscheid formalisieren und E3 Punkt 1 entsprechend als ersetzt markieren."
-->
## 🟡 2026-07-20 — T2: CLAUDE.md-Pfade + Absender-Entscheid formalisieren
Was: Pfad-Verweis in CLAUDE.md auf die Pfad-Karte umstellen; Absender-Wechsel als E5 festschreiben.
Was tust du: Kurzer SA-Auftrag an einen Chat ("mach T2") — die Aenderungen sind vorbereitet beschrieben.
Warum jetzt: Beides sind dokumentierte Drifts; ohne Formalisierung tauchen sie wieder auf. Zeit: ~15 Min.
<!-- T:2 END -->

<!--
T: 3
date: 2026-07-20
auftraggeber: AB-Direktive 2026-07-20 (Praesentations-Session)
wichtigkeit: 1
sterne: 5
leverage: compound
thema: [strategie, verkauf]
kunde: finelli
skill_used: []
knowledge_ref: kunden/finelli/praesentation/konfig-finelli.json
status: active
deadline: 2026-07-22
context_summary: "AB will die Firmen-Strategie aendern: ai-firma soll Voll-Anbieter werden (eigene Website/Shop-Plattform statt Aufsatz auf Shopify), Kunden holen in hoeheren Modellen (Premium/Max) alle Dienstleistungen bei uns, Ziel maximale Kundenbindung. Das kollidiert mit harter Regel Nr. 1 der ai-firma/CLAUDE.md (Bestehendes NIE ersetzen, aufsetzen), mit der Architektur von finelli-lagerverwaltung (Shopify = alleinige Bestandswahrheit) und mit Angebot V6 + Demo + Deck, die Finelli woertlich das Aufsetzen versprechen. CLAUDE.md ist SA-Schutz-Zone, darum liegt der Entscheid hier. Optionen: (A) Strategie aendern und OFFEN verkaufen (eigener Shop als Ausbau-Stufe, Kunde weiss es und waehlt es; Angebot/Deck/Architektur werden angepasst), (B) beim Aufsetz-Modell bleiben, Bindung ueber Phase-6-Betrieb, (C) Hybrid: Phase 1 wie versprochen auf Shopify, eigener Shop ab Premium/Max als offen deklarierte spaetere Etappe. Wichtig fuer den Entscheid: heimliche Abhaengigkeit (kein Fallback, Kunde merkt es nicht) waere Taeuschung gegenueber Khawar und gefaehrdet Referenz Nr. 1."
bucket: now
bucket_reason: "Finelli-Termin ist am 22.07; Deck und Angebot muessen zur beschlossenen Strategie passen"
-->
## 🔴 2026-07-20 — T3: Strategie-Entscheid: Voll-Anbieter mit eigener Website vs. Aufsetz-Regel
Was: AB schlaegt vor, die harte Regel "Bestehendes NIE ersetzen" zu kippen: eigene Website/Shop-Plattform als Kern-Dienstleistung, alle Services aus einer Hand, hoehere Modelle = mehr bei uns.
Was tust du: Entscheid A (offener Voll-Anbieter, CLAUDE.md + Angebot + Architektur anpassen), B (beim Aufsetzen bleiben) oder C (Hybrid: Shopify jetzt, eigener Shop als offene Ausbau-Stufe ab Premium). 1 Antwort genuegt, Umsetzung ist vorbereitet.
Warum jetzt: Termin 22.07 — Deck, Angebot V6 und Phase-1-Architektur haengen alle an diesem Entscheid. Zeit: 10 Min Entscheid.
<!-- T:3 END -->
