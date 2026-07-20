// brain-sync.js — Lehren-Ruecklauf-Schwarm des AIWorks-Workspace.
//
// Zweck: Aenderungen in Kunden-/Firmen-Repos einsammeln, per Branchen-Analyst
//   verallgemeinern (anonymisiert, ohne Preise/Kundendaten), jeden Vorschlag von
//   2 Skeptikern pruefen lassen und fertige Datei-Texte fuer den Haupt-Chat
//   verdichten. Der Schwarm SCHREIBT NICHTS — der Aufrufer legt das Ergebnis ab
//   (E2-Leitplanke: Schwaerme nur Lesen/Urteilen, der Haupt-Chat schreibt).
// Verdrahtete Lektionen:
//   - args kann als JSON-Text ankommen (Trockenflug-Fund 19.07) -> robust einlesen.
//   - Modell-Regel: Denk-/Pruef-Agenten OHNE model (erben Fabel 5),
//     reiner Schreib-Agent model 'opus' (TEAM.md, SA-Direktive 19.07).
//   - Drift-Vorfall 20.07 (Registry kannte finelli-lagerverwaltung nicht):
//     brain/lessons/system/2026-07-20-zwei-rechner-pfad-drift.md
// Aufruf: Skill /brain-sync, Schritt 2. Kein Date.now()/new Date() — Datum via args.heute.

export const meta = {
  name: 'brain-sync',
  description: 'Lehren-Ruecklauf: Repo-Aenderungen sammeln, verallgemeinern, 2 Skeptiker je Vorschlag, Datei-Texte verdichten',
  whenToUse: 'Am Ende jeder Session mit Repo-Aenderungen (via /brain-sync); liest nur, schreibt nie',
  phases: [
    { title: 'Sammeln', detail: '1 Spaeher pro geaendertem Repo' },
    { title: 'Verallgemeinern', detail: 'Branchen-Analyst destilliert Lehren' },
    { title: 'Pruefen', detail: '2 Skeptiker je Vorschlag, Mehrheits-Regel' },
    { title: 'Verdichten', detail: 'Opus baut fertige Datei-Texte', model: 'opus' },
  ],
}

// args kann als JSON-Text ankommen (Trockenflug-Fund 19.07) — robust einlesen
let _args = args || {}
if (typeof _args === 'string') {
  try { _args = JSON.parse(_args) } catch (e) { log('WARNUNG: args war Text und kein JSON — fahre mit leeren args fort'); _args = {} }
}
const heute = _args.heute || ''
if (!heute) log('WARNUNG: kein heute in args — Datums-Angaben in Lessons muessen im Haupt-Chat ergaenzt werden')
const workspace = _args.workspace || 'C:/Projects/AIWorks'
const kunde = _args.kunde || ''
if (!kunde) log('WARNUNG: kein kunde in args — Branchen-Zuordnung laeuft ohne Kunden-Anker')
const seitCommit = _args.seitCommit || {}
const repoNamen = Object.keys(seitCommit)
if (repoNamen.length === 0) log('WARNUNG: kein seitCommit in args — Spaeher lesen nur den letzten Commit je Repo')
const repos = repoNamen.length ? repoNamen : ['ai-firma']

const AENDERUNG_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['repo', 'zusammenfassung', 'aenderungen'],
  properties: {
    repo: { type: 'string', description: 'Repo-Ordnername' },
    zusammenfassung: { type: 'string', description: 'Max 3 Saetze: was sich geaendert hat und warum' },
    aenderungen: {
      type: 'array',
      description: 'Eine Zeile pro inhaltlicher Aenderung',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['pfad', 'was', 'bedeutung'],
        properties: {
          pfad: { type: 'string', description: 'Datei-Pfad relativ zum Repo' },
          was: { type: 'string', description: 'Was geaendert wurde (1 Satz)' },
          bedeutung: { type: 'string', description: 'Warum das fuer Firma/Vorlagen relevant sein koennte (oder "nur lokal")' },
        },
      },
    },
  },
}

const VORSCHLAG_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['branche', 'schablone', 'vorschlaege', 'sa_vorschlaege'],
  properties: {
    branche: { type: 'string', description: 'Erkannte Branche des Kunden (z.B. Shop/Detailhandel)' },
    schablone: { type: 'string', description: 'Ziel-Schablone in vorlagen/branchen/ (bestehend oder NEU:<name>)' },
    vorschlaege: {
      type: 'array',
      description: 'Verallgemeinerte, anonymisierte Rueckspiel-Vorschlaege',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['titel', 'typ', 'ziel_pfad', 'inhalt_md', 'begruendung', 'beleg'],
        properties: {
          titel: { type: 'string', description: 'Kurz-Titel der Lehre' },
          typ: { type: 'string', description: 'lesson | vorlage | registry | cross-ref | entscheid' },
          ziel_pfad: { type: 'string', description: 'Ziel-Datei relativ zu ai-firma/ (Konventionen beachten)' },
          inhalt_md: { type: 'string', description: 'Fertiger Markdown-Inhalt bzw. praezises Update (ae/oe/ue!)' },
          begruendung: { type: 'string', description: 'Warum uebertragbar auf den naechsten Kunden' },
          beleg: { type: 'string', description: 'Beleg-Status: belegt(Quelle+Datum) | 🔍 | 💡' },
        },
      },
    },
    sa_vorschlaege: {
      type: 'array',
      description: 'Aenderungen, die eine Schutz-Zone betreffen — nur als SA-Vorschlag (todos), nie direkt',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['titel', 'begruendung'],
        properties: {
          titel: { type: 'string' },
          begruendung: { type: 'string' },
        },
      },
    },
  },
}

const VOTE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['ok', 'einwand'],
  properties: {
    ok: { type: 'boolean', description: 'true = Vorschlag ist korrekt verallgemeinert und regelkonform' },
    einwand: { type: 'string', description: 'Konkreter Einwand (Regel-Verstoss, Kundendaten-Leck, Duplikat, falscher Zielort) oder "-"' },
  },
}

const VERDICHTUNG_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['dateien', 'commit_vorschlaege', 'ablage_hinweis'],
  properties: {
    dateien: {
      type: 'array',
      description: 'Fertige Datei-Texte fuer den Haupt-Chat',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['pfad', 'modus', 'inhalt_md'],
        properties: {
          pfad: { type: 'string', description: 'Ziel-Pfad relativ zum Workspace (z.B. ai-firma/brain/lessons/...)' },
          modus: { type: 'string', description: 'neu | update (dann Update-Anweisung im inhalt_md) | merge (Duplikat gefunden)' },
          inhalt_md: { type: 'string', description: 'Kompletter Datei-Inhalt bzw. exakte Update-Anweisung' },
        },
      },
    },
    commit_vorschlaege: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['repo', 'nachricht'],
        properties: {
          repo: { type: 'string' },
          nachricht: { type: 'string', description: 'Deutsche conventional-commit-Nachricht' },
        },
      },
    },
    ablage_hinweis: { type: 'string', description: 'Was der Haupt-Chat jetzt tun muss (Schritte 3-6 des Skills)' },
  },
}

const REGELN = `Harte Regeln (jede Verletzung = Vorschlag verwerfen):
- Anonymisieren: keine Kunden-Preise/Deal-Zahlen, keine Endkunden-/Personendaten, keine internen Links als Fakten.
- Zielorte nach ai-firma-Konvention (lessons mit YAML-Frontmatter type/disziplin/kunde/status/datum/quelle; ohne Quelle keine Lesson; Duplikat = mergen).
- Schutz-Zonen (ai-firma CLAUDE.md, playbook/, vorlagen/vertrag/, .claude/) NIE als direkte Aenderung — nur sa_vorschlaege.
- Beleg-Status mitfuehren (✅/🔍/💡); unbelegte Zahlen nie als Fakt.
- Umlaute in ai-firma-Dateien als ae/oe/ue. Ein Fakt lebt an EINER Stelle (verweisen statt kopieren).`

// ---- Phase 1: Sammeln (Denk-Agenten => KEIN model, erben Fabel 5) ----
phase('Sammeln')
const gesammelt = (await parallel(repos.map((r) => () => agent(
  `Du bist ein Spaeher (nur LESEN, nichts schreiben). Repo: ${workspace}/${r}
Lies mit git (nur lesende Kommandos): "git -C ${workspace}/${r} log --oneline ${seitCommit[r] ? seitCommit[r] + '..HEAD' : '-1'}",
dazu "git -C ${workspace}/${r} diff ${seitCommit[r] ? seitCommit[r] + '..HEAD' : 'HEAD~1..HEAD'} --stat" und bei Bedarf einzelne Dateien.
Auch UNCOMMITTETE Aenderungen pruefen: "git -C ${workspace}/${r} status --porcelain" + geaenderte Dateien lesen.
Fasse zusammen, was sich inhaltlich geaendert hat und was davon fuer die Firma (Vorlagen, Lessons, Registry) relevant sein koennte.`,
  { label: `spaeher:${r}`, phase: 'Sammeln', schema: AENDERUNG_SCHEMA }
)))).filter(Boolean)
log(`Sammeln fertig: ${gesammelt.length}/${repos.length} Repos gelesen, ${gesammelt.reduce((s, g) => s + g.aenderungen.length, 0)} Aenderungen.`)

// ---- Phase 2: Verallgemeinern (Branchen-Analyst, erbt Fabel 5) ----
phase('Verallgemeinern')
const analyse = await agent(
  `Kunde: ${kunde || 'unbekannt — aus Kontext ableiten'} · Datum: ${heute || 'unbekannt'} · Workspace: ${workspace}
Gesammelte Aenderungen (JSON):
${JSON.stringify(gesammelt, null, 2)}

Bestimme die Branche, ordne die Schablone in ${workspace}/ai-firma/vorlagen/branchen/ zu (lies den Ordner!)
und destilliere verallgemeinerte Rueckspiel-Vorschlaege nach ai-firma. Lies bei Bedarf
${workspace}/ai-firma/kunden/${kunde || ''}/ und die bestehenden Lessons (Duplikat-Check!).
${REGELN}`,
  { label: 'branchen-analyst', phase: 'Verallgemeinern', agentType: 'branchen-analyst', schema: VORSCHLAG_SCHEMA }
)
const vorschlaege = (analyse && analyse.vorschlaege) || []
log(`Verallgemeinern fertig: Branche "${analyse?.branche || '?'}", ${vorschlaege.length} Vorschlaege, ${(analyse?.sa_vorschlaege || []).length} SA-Vorschlaege.`)

// ---- Phase 3: Pruefen (2 Skeptiker je Vorschlag, effort high; Mehrheits-Regel wie mvp-klick-beweis) ----
phase('Pruefen')
const geprueft = await parallel(vorschlaege.map((v, i) => () =>
  parallel([1, 2].map((n) => () => agent(
    `Du bist Skeptiker ${n}. Versuche diesen Rueckspiel-Vorschlag zu WIDERLEGEN — er ist nur ok,
wenn er wirklich verallgemeinert (keine Kundendaten/Preise), am richtigen Zielort liegt, kein
Duplikat einer bestehenden Lesson ist (bei Bedarf in ${workspace}/ai-firma/brain/lessons/ nachlesen)
und die Konventionen einhaelt.
${REGELN}

Vorschlag ${i + 1}: ${JSON.stringify(v, null, 2)}`,
    { label: `skeptiker${n}:${(v.titel || '').slice(0, 24)}`, phase: 'Pruefen', effort: 'high', schema: VOTE_SCHEMA }
  ))).then((votes) => {
    const gueltig = votes.filter(Boolean)
    const jas = gueltig.filter((x) => x.ok).length
    return { vorschlag: v, angenommen: jas >= 1 && gueltig.length > 0, einwaende: gueltig.map((x) => x.einwand).filter((e) => e && e !== '-') }
  })
))
const angenommen = geprueft.filter(Boolean).filter((g) => g.angenommen)
const verworfen = geprueft.filter(Boolean).filter((g) => !g.angenommen)
log(`Pruefen fertig: ${angenommen.length} angenommen, ${verworfen.length} verworfen.`)

// ---- Phase 4: Verdichten (reiner Schreib-Agent => model 'opus') ----
phase('Verdichten')
let verdichtung = null
if (angenommen.length > 0) {
  verdichtung = await agent(
    `Du bist der Schreiber. Baue aus den angenommenen Vorschlaegen FERTIGE Datei-Texte
(ae/oe/ue, Fazit/Struktur nach ai-firma-Konvention, Lessons mit YAML-Frontmatter
type/disziplin/kunde/status/datum/quelle, Datum = ${heute || 'DATUM-EINSETZEN'}).
Arbeite Einwaende der Skeptiker ein. Dazu je Repo ein deutscher conventional-Commit-Vorschlag.
Du schreibst NUR Text zurueck — keine Dateien anlegen.

Angenommen (mit Einwaenden): ${JSON.stringify(angenommen, null, 2)}`,
    { label: 'schreiber:verdichtung', phase: 'Verdichten', model: 'opus', schema: VERDICHTUNG_SCHEMA }
  )
}
log(`Verdichten fertig: ${verdichtung?.dateien?.length || 0} Datei-Texte.`)

return {
  branche: analyse?.branche || '',
  schablone: analyse?.schablone || '',
  angenommen: angenommen.map((g) => g.vorschlag.titel),
  verworfen: verworfen.map((g) => ({ titel: g.vorschlag.titel, einwaende: g.einwaende })),
  sa_vorschlaege: analyse?.sa_vorschlaege || [],
  dateien: verdichtung?.dateien || [],
  commit_vorschlaege: verdichtung?.commit_vorschlaege || [],
  ablage_hinweis: verdichtung?.ablage_hinweis ||
    'Keine Datei-Texte erzeugt — Haupt-Chat prueft, ob die Aenderungen wirklich keinen Ruecklauf brauchen, und macht dann Skill-Schritte 4-6 (Kunden-Brain, Push, State leeren).',
}
