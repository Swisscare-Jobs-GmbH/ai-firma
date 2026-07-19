// ki-wochen-bericht.js — Wochen-Bericht pro Kunde, der das Monats-Abo verteidigt.
// Sammler zieht aus dem Kunden-Repo die Roh-Fakten (git log seit Datum, erledigte Etappen,
// offene Punkte aus HANDOFF). Schreiber macht daraus einen 1-Seiten-Bericht in Klartext,
// als ob der Kunde ein Laie ist: was lief, was kommt, EINE Kennzahl. Rueckgabe = Markdown.
// Zeitfenster kommt ueber args.seitDatum (nie new Date() im Script).

export const meta = {
  name: 'ki-wochen-bericht',
  description:
    'Erzeugt den woechentlichen Kunden-Bericht: ein Sammler liest git log seit Datum + erledigte Etappen + offene HANDOFF-Punkte, ein Schreiber macht daraus eine 1-Seiten-Zusammenfassung in Laien-Klartext (was lief, was kommt, 1 Kennzahl).',
  whenToUse:
    'Jeden Montag pro laufendem Kunden, damit das Monats-Abo sichtbaren Wert zeigt. Braucht args {kunde, kundenRepo, seitDatum}. seitDatum bestimmt das Zeitfenster (git --since).',
  phases: [
    { title: 'Sammeln', detail: 'Roh-Fakten aus Repo: git log, Etappen, HANDOFF-Offene' },
    { title: 'Schreiben', detail: '1-Seiten-Kundenbericht in Laien-Klartext' },
  ],
}

// --- Schema: was der Sammler an Roh-Fakten liefert ---
const SAMMLER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['git_zusammenfassung', 'erledigte_etappen', 'offene_punkte', 'kennzahl_vorschlag'],
  properties: {
    git_zusammenfassung: { type: 'string', description: 'was seit seitDatum committet wurde, in Stichworten' },
    erledigte_etappen: { type: 'array', items: { type: 'string' } },
    offene_punkte: { type: 'array', items: { type: 'string' }, description: 'aus HANDOFF/offenen TODOs' },
    kennzahl_vorschlag: { type: 'string', description: 'EINE greifbare Zahl fuer den Kunden (z.B. "3 Etappen fertig", "12 Mock-Kunden im System")' },
  },
}

// --- Schema: der fertige Bericht ---
const BERICHT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['bericht_md'],
  properties: {
    bericht_md: { type: 'string', description: '1-Seiten-Markdown, Laien-Klartext, max ~2500 Zeichen' },
  },
}

const { kunde, kundenRepo, seitDatum } = args
if (!kundenRepo) log('WARNUNG: kein kundenRepo in args — der Sammler hat kein Repo zum Lesen.')
if (!seitDatum) log('WARNUNG: kein seitDatum in args — git-Zeitfenster ist offen, Sammler nimmt "letzte Woche" als Text.')

// --- Sammeln: Roh-Fakten aus dem Repo (Recherche-Agent => KEIN model, erbt Fabel 5) ---
const sammler = await agent(
  `Du bist der SAMMLER fuer den Wochen-Bericht von Kunde "${kunde || '(unbekannt)'}". Trage die Roh-Fakten zusammen, NUR LESEN.\n\n` +
    `Repo: ${kundenRepo || '(FEHLT)'}\n` +
    `Zeitfenster ab: ${seitDatum || '(kein Datum — nimm die letzten 7 Tage)'}\n\n` +
    `Fuehre aus:\n` +
    `1. git -C "${kundenRepo || '.'}" log --since="${seitDatum || '7 days ago'}" --pretty="%h %s" — fasse zusammen, was gebaut/gefixt wurde.\n` +
    `2. Lies HANDOFF.md (und falls vorhanden PLAN.md/README.md) im Repo: welche Etappen sind fertig abgehakt, welche Punkte sind offen.\n` +
    `3. Leite EINEN greifbaren Kennzahl-Vorschlag ab, den ein Laie versteht.\n\n` +
    `Gib git_zusammenfassung, erledigte_etappen, offene_punkte, kennzahl_vorschlag zurueck. Nichts erfinden — was fehlt, weglassen.`,
  { label: 'sammler', phase: 'Sammeln', schema: SAMMLER_SCHEMA },
)

log(
  `Sammeln fertig: ${(sammler?.erledigte_etappen || []).length} erledigte Etappen, ${(sammler?.offene_punkte || []).length} offene Punkte. Schreibe Kunden-Bericht.`,
)

// --- Schreiben: 1-Seiten-Bericht in Laien-Klartext (reiner Schreib-Agent => model 'opus') ---
const schreiber = await agent(
  `Du schreibst den WOCHEN-BERICHT fuer Kunde "${kunde || '(unbekannt)'}". Der Leser ist ein LAIE — kein Tech-Wort ohne Uebersetzung, keine Commit-Hashes, keine Datei-Namen.\n\n` +
    `ROH-FAKTEN (JSON): ${JSON.stringify(sammler || {})}\n` +
    `Zeitfenster ab: ${seitDatum || '(letzte Woche)'}\n\n` +
    `Bau genau eine A4-Seite Markdown mit dieser Struktur:\n` +
    `- Kopf: "Wochen-Update ${kunde || ''}" + Zeitraum.\n` +
    `- "Was diese Woche lief": 3-5 Punkte in Alltags-Sprache, was der Kunde jetzt hat/kann.\n` +
    `- "Was als Naechstes kommt": 2-3 Punkte aus den offenen Punkten, positiv formuliert.\n` +
    `- "Eine Zahl der Woche": die Kennzahl gross und verstaendlich erklaert.\n` +
    `Ton: warm, sicher, kein Fachchinesisch, keine Entschuldigungen, keine leeren Floskeln. ae/oe/ue statt Umlaute.\n` +
    `Gib bericht_md zurueck.`,
  { label: 'schreiber', phase: 'Schreiben', schema: BERICHT_SCHEMA, model: 'opus' },
)

return {
  kunde: kunde || null,
  seitDatum: seitDatum || null,
  bericht_md: schreiber?.bericht_md || '',
  roh_fakten: sammler || null,
}
