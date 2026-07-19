// angebots-judge-panel.js — Qualitaets-Tor VOR jedem Kunden-Angebot (Playbook Phase 4).
// Drei Richter lesen dasselbe Angebot durch je eine eigene Linse und geben Punktzahl + Funde
// mit Zeilen-Bezug. Ein Verdichter sortiert alles zu EINER Fix-Liste. Harte Regel:
// jeder Fakten-Fund ist ein Pflicht-Fix VOR dem Druck (der Kunde rechnet/prueft selbst nach).
// Read-only: liest nur die Angebots-Datei, aendert sie nicht.
//
// Herkunft der Linsen (Playbook + Deal-Doktrin):
//  - Hormozi: Wert VOR Preis, Summenzeile NIE "Marktwert" (sonst rechnet der Kunde gegen).
//  - Menschen-Natur: Stolz-Einstieg, Pain benennen + ENTSCHULDEN, "du entscheidest".
//  - Fakten-Skeptiker: jede Zahl live pruefbar? Quelle? veraltete Referenz? (Jelmoli-Lektion).

export const meta = {
  name: 'angebots-judge-panel',
  description:
    'Drei-Richter-Panel prueft ein Kunden-Angebot durch die Linsen Hormozi (Wert/Preis-Framing), Menschen-Natur (Stolz/Entschulden/du-entscheidest) und Fakten-Skeptiker (jede Zahl belegt?). Verdichter liefert eine sortierte Fix-Liste; Fakten-Funde = Pflicht vor Druck.',
  whenToUse:
    'BEVOR ein Angebots-PDF gedruckt/verschickt wird (Playbook Phase 4). Braucht args {angebotPfad, kunde}. Billigste Versicherung gegen die "Marktwert = Ratensumme"-Falle und veraltete/unbelegte Zahlen.',
  phases: [
    { title: 'Richten', detail: '3 Richter parallel, je eigene Linse, Punktzahl + Funde' },
    { title: 'Verdichten', detail: 'eine sortierte Fix-Liste, Fakten-Funde als Pflicht' },
  ],
}

// --- Schema: ein Richter-Urteil ---
const RICHTER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['linse', 'punktzahl', 'funde'],
  properties: {
    linse: { type: 'string' },
    punktzahl: { type: 'number', description: '1-10, wie gut das Angebot durch DIESE Linse ist' },
    funde: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['zeile', 'problem', 'schwere', 'fix'],
        properties: {
          zeile: { type: 'string', description: 'Zeilen-Nr. oder zitiertes Text-Stueck der Fundstelle' },
          problem: { type: 'string' },
          schwere: { type: 'string', enum: ['pflicht', 'empfohlen', 'kosmetisch'] },
          fix: { type: 'string', description: 'konkrete Umformulierung/Aenderung' },
        },
      },
    },
  },
}

// --- Schema: die verdichtete Fix-Liste ---
const VERDICHTER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['fix_liste', 'pflicht_vor_druck', 'druckfreigabe', 'gesamt_urteil'],
  properties: {
    fix_liste: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['rang', 'linse', 'zeile', 'problem', 'fix', 'pflicht'],
        properties: {
          rang: { type: 'number' },
          linse: { type: 'string' },
          zeile: { type: 'string' },
          problem: { type: 'string' },
          fix: { type: 'string' },
          pflicht: { type: 'boolean', description: 'true = muss VOR Druck raus' },
        },
      },
    },
    pflicht_vor_druck: { type: 'number', description: 'Anzahl der Pflicht-Fixes, die noch offen sind' },
    druckfreigabe: { type: 'boolean', description: 'true nur wenn pflicht_vor_druck == 0' },
    gesamt_urteil: { type: 'string', description: '2-3 Zeilen Fazit fuer SA' },
  },
}

const { angebotPfad, kunde } = args
if (!angebotPfad) log('WARNUNG: kein angebotPfad in args — die Richter haben keine Datei zum Lesen.')

const leseHinweis =
  `Lies die Angebots-Datei: ${angebotPfad || '(FEHLT — melde das als Fund)'} (Kunde: ${kunde || 'unbekannt'}). ` +
  `Nur LESEN, nichts aendern. Beziehe jeden Fund auf eine Zeilen-Nr. oder ein woertliches Text-Stueck.`

// --- Die 3 Linsen ---
const RICHTER = [
  {
    key: 'hormozi',
    prompt:
      `${leseHinweis}\n\nDu bist der HORMOZI-Richter (Grand-Slam-Offer-Logik). Pruefe:\n` +
      '- Kommt der WERT vor dem Preis? Ist der Preis erst genannt, nachdem der Nutzen belegt steht?\n' +
      '- Summenzeile (Raten x Laufzeit): heisst sie "Marktwert"? Das ist ein PFLICHT-Fund — der Kunde rechnet nach. Sie muss "Dein Preis — Selbstkosten" o.ae. heissen; ein hoher Agentur-Anker (30k+) gehoert SEPARAT.\n' +
      '- Ist der Wert quantifiziert (CHF/Zeit pro Jahr) statt nur behauptet?\n' +
      '- Risiko-Umkehr sichtbar (Garantie, 0 vorab)?\n' +
      'Gib punktzahl 1-10 + Funde mit Zeile/Problem/Schwere/Fix.',
  },
  {
    key: 'menschen-natur',
    prompt:
      `${leseHinweis}\n\nDu bist der MENSCHEN-NATUR-Richter (Verkaufs-Psychologie). Pruefe:\n` +
      '- STOLZ-Einstieg: startet das Angebot positiv/mit Anerkennung — nie negativ?\n' +
      '- Pain-Deutung: wird der Schmerz benannt UND entschuldet ("nicht deine Schuld") und dann mit "Ab sofort:" gewendet?\n' +
      '- "DU ENTSCHEIDEST"-Frame am Ende statt Druck/Draengen?\n' +
      '- Ein-System-Botschaft ("alles inbegriffen, keine Extra-Abos") vorhanden?\n' +
      '- Ton auf Augenhoehe, keine Fachwort-Wand?\n' +
      'Gib punktzahl 1-10 + Funde mit Zeile/Problem/Schwere/Fix.',
  },
  {
    key: 'fakten-skeptiker',
    prompt:
      `${leseHinweis}\n\nDu bist der FAKTEN-SKEPTIKER — der haerteste Richter. Nimm JEDE Zahl und JEDE Referenz einzeln:\n` +
      '- Steht eine pruefbare Quelle dabei? Kann der Kunde die Zahl SELBST live nachschauen (z.B. Bewertungs-Anzahl auf Google)?\n' +
      '- Ist eine genannte Referenz/ein Partner/Laden noch aktuell und existiert wirklich? (Lektion: Jelmoli existierte nicht mehr — toedlich.)\n' +
      '- Widerspricht sich eine Zahl an zwei Stellen im Dokument?\n' +
      'REGEL: Jeder Zahl-/Referenz-Fund ist schwere "pflicht" — er muss VOR dem Druck raus, sonst blamiert er den Kunden-Termin.\n' +
      'Effort hoch: lieber einen Fund zu viel als eine falsche Zahl durchlassen. Gib punktzahl 1-10 + Funde mit Zeile/Problem/Schwere/Fix.',
    effort: 'high',
  },
]

// --- 3 Richter parallel (Judge-Agenten => KEIN model, erben Fabel 5) ---
const urteile = (
  await parallel(
    RICHTER.map((r) => () =>
      agent(r.prompt, { label: `richter:${r.key}`, phase: 'Richten', schema: RICHTER_SCHEMA, effort: r.effort }),
    ),
  )
).filter(Boolean)

const fundeGesamt = urteile.reduce((s, u) => s + (u.funde ? u.funde.length : 0), 0)
log(`Richten fertig: ${urteile.length}/3 Linsen, ${fundeGesamt} Funde. Verdichte zu einer Fix-Liste.`)

// --- Verdichter: sortiert alle Funde, erzwingt Fakten = Pflicht (Synthese/Judge => KEIN model) ---
const verdichtung = await agent(
  `Du bist der VERDICHTER. Aus drei Richter-Urteilen machst du EINE handlungsreife Fix-Liste fuer SA (Fazit oben, scannbar).\n\n` +
    `URTEILE (JSON): ${JSON.stringify(urteile)}\n\n` +
    `HARTE REGELN:\n` +
    `- Jeder Fund der Linse "fakten-skeptiker" ist pflicht=true — IMMER, egal was der Richter als schwere schrieb.\n` +
    `- Jeder Fund mit schwere "pflicht" ist pflicht=true.\n` +
    `- Sortiere: alle Pflicht-Fixes zuerst (rang 1..n), dann empfohlen, dann kosmetisch.\n` +
    `- pflicht_vor_druck = Anzahl pflicht=true. druckfreigabe = (pflicht_vor_druck == 0).\n` +
    `- Duplikate (gleiche Zeile, gleiches Problem aus 2 Linsen) zusammenfassen, aber die strengste Einstufung behalten.\n` +
    `gesamt_urteil: 2-3 Zeilen — druckreif oder nicht, und was der groesste Hebel ist.\n` +
    `Gib fix_liste, pflicht_vor_druck, druckfreigabe, gesamt_urteil zurueck.`,
  { label: 'verdichter', phase: 'Verdichten', schema: VERDICHTER_SCHEMA },
)

const scores = {}
for (const u of urteile) scores[u.linse || 'unbekannt'] = u.punktzahl

log(
  verdichtung?.druckfreigabe
    ? 'Verdichter: DRUCKFREIGABE — 0 Pflicht-Fixes offen.'
    : `Verdichter: NICHT druckreif — ${verdichtung?.pflicht_vor_druck ?? '?'} Pflicht-Fixes offen.`,
)

return {
  kunde: kunde || null,
  angebotPfad: angebotPfad || null,
  punktzahlen: scores,
  druckfreigabe: verdichtung?.druckfreigabe ?? false,
  pflicht_vor_druck: verdichtung?.pflicht_vor_druck ?? null,
  fix_liste: verdichtung?.fix_liste || [],
  gesamt_urteil: verdichtung?.gesamt_urteil || '',
  richter_roh: urteile,
}
