// mvp-klick-beweis.js — Demo-Haerte-Test VOR jedem Kunden-Termin (Playbook Phase 3/5).
// Phase Pruefen: parallele Finder suchen die 3 Klassen von Demo-Bruch. Phase Verifizieren:
// jeder Fund wird adversarial von 2 Skeptikern geprueft (Mehrheit entscheidet). Danach ein
// Schreiber baut die Klick-Beweis-Checkliste: welche Klicks SA im Termin selbst vorfuehren muss.
// Read-only: Finder/Skeptiker LESEN nur Code, sie starten/aendern nichts.
//
// Warum genau diese 3 Finder-Klassen (Finelli-Lektionen):
//  - Endpunkt-Abgleich: Frontend ruft Routen, die es im Backend nicht (mehr) gibt -> leere Kachel.
//  - Mock-Drift: Mock-Daten am Tages-ABSTAND statt am Kalendertag (toordinal) verankert ->
//    nach Neustart driften die Daten (Playbook-Regel 5).
//  - Demo-Killer: Absturz bei leerer DB / fehlendem Seed -> die App muss OHNE Kunden-Zugaenge
//    aus dem Uebungs-Modus heraus demofaehig sein.

export const meta = {
  name: 'mvp-klick-beweis',
  description:
    'Demo-Haerte-Test: parallele Finder suchen Endpunkt-Drift, Mock-Daten-Drift (Kalendertag-Verankerung) und Demo-Killer (Absturz bei leerer DB); jeder Fund wird von 2 Skeptikern adversarial verifiziert (Mehrheit). Rueckgabe: bestaetigte Funde + Klick-Beweis-Checkliste.',
  whenToUse:
    'BEVOR ein MVP dem Kunden vorgefuehrt wird (Playbook Phase 3 Abschluss / vor Phase 5). Braucht args {kundenRepo, ports}. Baut auf dem beweis-fertig-Prinzip auf: nichts gilt als "geht", bis der Klick bewiesen ist.',
  phases: [
    { title: 'Pruefen', detail: '3 parallele Finder, je eine Bruch-Klasse' },
    { title: 'Verifizieren', detail: 'pro Fund 2 Skeptiker adversarial, Mehrheit entscheidet' },
    { title: 'Checkliste', detail: 'Schreiber baut die Klick-Vorfuehr-Liste fuer SA' },
  ],
}

// --- Schema: ein Finder-Bericht ---
const FIND_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['bereich', 'funde'],
  properties: {
    bereich: { type: 'string' },
    funde: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['titel', 'ort', 'problem', 'demo_risiko', 'fix_vorschlag'],
        properties: {
          titel: { type: 'string' },
          ort: { type: 'string', description: 'datei:zeile oder Funktion' },
          problem: { type: 'string' },
          demo_risiko: { type: 'string', enum: ['absturz', 'falsche-daten', 'leere-ansicht', 'kosmetisch'] },
          fix_vorschlag: { type: 'string' },
        },
      },
    },
  },
}

// --- Schema: eine Skeptiker-Stimme ---
const VOTE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['ist_echt', 'begruendung'],
  properties: {
    ist_echt: { type: 'boolean', description: 'true = echter Demo-Bruch, false = Fehlalarm (default bei Unsicherheit)' },
    begruendung: { type: 'string' },
  },
}

// --- Schema: die Klick-Beweis-Checkliste ---
const CHECK_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['checkliste_md'],
  properties: {
    checkliste_md: { type: 'string', description: 'Markdown: nummerierte Klicks, die SA vorfuehrt, je mit erwartetem Ergebnis' },
  },
}

const { kundenRepo, ports } = args
const portsText = ports && typeof ports === 'object' ? JSON.stringify(ports) : String(ports || '(keine angegeben)')
if (!kundenRepo) log('WARNUNG: kein kundenRepo in args — die Finder haben kein Repo zum Lesen.')

const repoHinweis =
  `Kunden-Repo: ${kundenRepo || '(FEHLT — melde das als Fund)'} · Ports: ${portsText}. ` +
  `Arbeite READ-ONLY mit Read/Grep/Glob. NICHT starten, NICHT aendern.`

// --- 3 Finder, je eine Bruch-Klasse ---
const FINDER = [
  {
    key: 'endpunkt-abgleich',
    prompt:
      `${repoHinweis}\n\nDu bist der ENDPUNKT-FINDER. Gleiche Backend-Routen gegen Frontend-Aufrufe ab.\n` +
      '- Sammle alle Backend-Routen (z.B. FastAPI @router.get/post, Express-Routen).\n' +
      '- Sammle alle Frontend-Aufrufe (fetch/axios/react-query URLs).\n' +
      '- Melde: Frontend ruft eine Route, die es im Backend nicht (mehr) gibt (-> leere Ansicht/Fehler); ODER Methode/Pfad/Parameter passen nicht.\n' +
      'Pro Mismatch ein Fund mit ort=datei:zeile und demo_risiko. Kein Mismatch: leeres funde-Array.',
  },
  {
    key: 'mock-drift',
    prompt:
      `${repoHinweis}\n\nDu bist der MOCK-DRIFT-FINDER. Suche Mock-/Seed-Daten, deren Datum am Tages-ABSTAND haengt statt am Kalendertag.\n` +
      '- Gesucht: timedelta(days=...), now()-X, relative Datums-Arithmetik, die nach einem Neustart andere Werte liefert.\n' +
      '- Richtig waere Verankerung am Kalendertag (z.B. toordinal / fixes Referenzdatum), damit die Demo-Daten stabil bleiben (Playbook-Regel 5).\n' +
      'Pro Fundstelle ein Fund (demo_risiko meist "falsche-daten"). Sauber verankert: leeres funde-Array.',
  },
  {
    key: 'demo-killer',
    prompt:
      `${repoHinweis}\n\nDu bist der DEMO-KILLER-FINDER. Suche alles, was bei einer frischen Vorfuehrung knallt.\n` +
      '- Absturz/500er bei LEERER Datenbank oder fehlendem Seed (ungefangene None/null, leere Listen ohne Guard, Division durch 0).\n' +
      '- Laeuft die App im Uebungs-/Mock-Modus OHNE Kunden-Zugaenge (keine echten API-Keys noetig)? Wenn ein Zugang fehlt und die Seite deshalb bricht: Fund.\n' +
      '- Erst-Aufruf-Fallen: Login-Redirect-Schleife, Hydration-Fehler, 403 wegen fehlender Origin/Env.\n' +
      'Pro Stelle ein Fund mit demo_risiko. Nichts gefunden: leeres funde-Array.',
  },
]

// --- Phase Pruefen: Finder parallel ---
phase('Pruefen')
const finderBerichte = (
  await parallel(
    FINDER.map((f) => () => agent(f.prompt, { label: `finder:${f.key}`, phase: 'Pruefen', schema: FIND_SCHEMA })),
  )
).filter(Boolean)

// Funde flach ziehen, mit Bereich markieren
const alleFunde = []
for (const b of finderBerichte) {
  for (const fund of b.funde || []) alleFunde.push({ ...fund, bereich: b.bereich })
}
log(`Pruefen fertig: ${alleFunde.length} Roh-Funde aus ${finderBerichte.length} Findern. Adversariale Verifikation startet.`)

// --- Phase Verifizieren: pro Fund 2 Skeptiker, Mehrheit entscheidet ---
// Mehrheits-Regel: 3-koepfiges Panel = der Finder (behauptet "echt") + 2 Skeptiker.
// bestaetigt, wenn mind. 1 Skeptiker zustimmt (>=2/3). Vor einem Kunden-Termin lieber
// einen Fund zu viel pruefen als einen echten Demo-Bruch uebersehen. konsens zeigt die Staerke.
phase('Verifizieren')

const macheStimme = (fund, n) =>
  agent(
    `Du bist Demo-Skeptiker #${n}. Pruefe ADVERSARIAL, ob dieser gemeldete Demo-Bruch ECHT ist oder Fehlalarm.\n` +
      `Repo: ${kundenRepo || '(fehlt)'} — lies die genannte Stelle selbst gegen (Read/Grep, read-only).\n` +
      `FUND: ${JSON.stringify({ titel: fund.titel, ort: fund.ort, problem: fund.problem, demo_risiko: fund.demo_risiko })}\n` +
      `Sag ist_echt true nur, wenn der Bruch in einer echten Kunden-Vorfuehrung wirklich auftreten wuerde. Bei Unsicherheit false. Kurze begruendung.`,
    { label: `skeptiker${n}:${(fund.titel || '').slice(0, 24)}`, phase: 'Verifizieren', schema: VOTE_SCHEMA, effort: 'high' },
  )

const pruefeFund = async (fund) => {
  const stimmen = (await parallel([() => macheStimme(fund, 1), () => macheStimme(fund, 2)])).filter(Boolean)
  const jaStimmen = stimmen.filter((s) => s.ist_echt).length
  return {
    ...fund,
    skeptiker_stimmen: stimmen.length,
    ja_stimmen: jaStimmen,
    konsens: `${jaStimmen}/${stimmen.length}`,
    bestaetigt: jaStimmen >= 1,
    begruendungen: stimmen.map((s) => s.begruendung),
  }
}

const geprueft = (await parallel(alleFunde.map((fund) => () => pruefeFund(fund)))).filter(Boolean)
const bestaetigt = geprueft.filter((g) => g.bestaetigt)
const verworfen = geprueft.filter((g) => !g.bestaetigt)
log(`Verifiziert: ${bestaetigt.length} bestaetigt, ${verworfen.length} als Fehlalarm verworfen.`)

// --- Phase Checkliste: Schreiber baut die Klick-Vorfuehr-Liste (reiner Schreib-Agent => model 'opus') ---
phase('Checkliste')
const check = await agent(
  `Du baust die KLICK-BEWEIS-CHECKLISTE fuer SA (Legasthenie+ADHS: nummeriert, kurze Zeilen, ein Klick pro Punkt, ae/oe/ue).\n\n` +
    `Repo: ${kundenRepo || '(fehlt)'} · Ports: ${portsText}\n` +
    `BESTAETIGTE DEMO-BRUECHE (JSON): ${JSON.stringify(bestaetigt.map((b) => ({ titel: b.titel, ort: b.ort, problem: b.problem, demo_risiko: b.demo_risiko, fix: b.fix_vorschlag })))}\n\n` +
    `Baue eine Liste konkreter Klicks, die SA im Termin SELBST vorfuehren muss, um zu beweisen, dass die App traegt. Je Punkt: (1) welchen Screen/Knopf klicken, (2) was das erwartete Ergebnis ist, (3) welcher bestaetigte Bruch damit abgedeckt wird.\n` +
    `Beginne mit den Klicks, die die groessten Demo-Killer (demo_risiko=absturz) absichern. Am Ende ein kurzer Block "Muss vor dem Termin gefixt sein" mit den offenen Pflicht-Fixes.\n` +
    `Gib checkliste_md zurueck.`,
  { label: 'checkliste', phase: 'Checkliste', schema: CHECK_SCHEMA, model: 'opus' },
)

return {
  kundenRepo: kundenRepo || null,
  ports: ports || null,
  funde_gesamt: alleFunde.length,
  bestaetigt,
  verworfen,
  klick_beweis_checkliste: check?.checkliste_md || '',
}
