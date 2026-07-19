// phase0-recherche-schwarm.js — Phase 0 des Neukunden-Playbooks.
// Paralleler Spaeher-Schwarm sammelt Firmen-Fakten + LIVE-Reviews + Branchen-Schmerzen,
// ein Schreiber verdichtet zu zwei Markdown-Bloecken (Firmen-Profil + Schmerz-Hypothesen).
// Read-only: der Workflow schreibt NICHTS auf die Platte — der Aufrufer legt das Ergebnis
// nach kunden/{kunde}/ ab. Zeitstempel kommen ueber args, nie ueber new Date().
//
// Lektionen, die hier hart verdrahtet sind (Playbook-Regel 2):
//  - Review-Zahlen LIVE nachzaehlen. Finelli: "41" waere peinlich gewesen, Google hatte 130.
//  - Veraltete Referenzen sind toedlich (Jelmoli existierte nicht mehr).
//  - Namensvetter-Falle: Firmenname != Inhaber-Name (GzF-Inhaber heisst Akbarzada, nicht Kaufmann).

export const meta = {
  name: 'phase0-recherche-schwarm',
  description:
    'Phase-0-Neukunden-Recherche: paralleler Spaeher-Schwarm (Firmen-Profil, LIVE-Reviews, weitere Portale, Branchen-Schmerzen, bestehende Software, Konkurrenz vor Ort) + Synthese zu Firmen-Profil und Schmerz-Hypothesen.',
  whenToUse:
    'Am Start jedes neuen Software-Kunden (Playbook Phase 0), BEVOR SA das Schmerz-Gespraech fuehrt. Braucht args {kunde, ort, branche, webseite}. Reine Recherche — schreibt nichts, gibt Markdown zurueck; der Aufrufer speichert es nach kunden/{kunde}/.',
  phases: [
    { title: 'Spaeher', detail: '6 parallele Recherche-Agenten, je eine Quelle' },
    { title: 'Synthese', detail: 'ein Schreiber verdichtet zu Firmen-Profil + Schmerz-Hypothesen' },
  ],
}

// --- Schema: was jeder Spaeher zurueckgibt ---
const SPAEHER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['thema', 'befunde_md', 'belege', 'unsicher'],
  properties: {
    thema: { type: 'string' },
    befunde_md: { type: 'string', description: 'Markdown, scannbar, max ~1800 Zeichen' },
    belege: {
      type: 'array',
      description: 'jede Aussage mit pruefbarer Quelle (URL/Register-Nr.)',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['aussage', 'quelle'],
        properties: {
          aussage: { type: 'string' },
          quelle: { type: 'string' },
        },
      },
    },
    unsicher: { type: 'string', description: 'was NICHT belegt werden konnte (ehrlich, statt raten)' },
  },
}

// --- Schema: was der Synthese-Schreiber zurueckgibt ---
const SYNTHESE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['firma_profil_md', 'schmerz_hypothesen_md'],
  properties: {
    firma_profil_md: { type: 'string', description: 'fertiger Markdown-Block "Firmen-Profil"' },
    schmerz_hypothesen_md: { type: 'string', description: 'fertiger Markdown-Block "Schmerz-Hypothesen"' },
  },
}

// args kann als JSON-Text ankommen (Trockenflug-Fund 19.07) -- robust einlesen
let _args = args || {}
if (typeof _args === 'string') { try { _args = JSON.parse(_args) } catch (e) { log('WARNUNG: args ist Text und kein gueltiges JSON -- laufe ohne Parameter'); _args = {} } }
const { kunde, ort, branche, webseite } = _args
const kopf = `Kunde: ${kunde || '(unbekannt)'} · Ort: ${ort || '(unbekannt)'} · Branche: ${branche || '(unbekannt)'} · Webseite: ${webseite || '(keine)'}`

if (!kunde) log('WARNUNG: kein kunde in args — Recherche laeuft, aber Ablage-Pfad kunden/{kunde}/ ist offen.')

// --- 6 Spaeher, je eigene Quelle. Enge Prompts, jeder mit Beleg-Pflicht. ---
const SPAEHER = [
  {
    key: 'handelsregister',
    prompt:
      `Recherchiere das AMTLICHE Firmen-Profil. ${kopf}\n` +
      'Quellen: Schweizer Handelsregister (Zefix), Impressum der Webseite, serioese Web-Portraets.\n' +
      'Finde: Rechtsform, Gruendungsjahr, Kapital, Inhaber/Entscheider (NAME), Mitarbeiterzahl, was die Firma genau verkauft.\n' +
      'ACHTUNG Namensvetter-Falle: Firmenname ist NICHT der Inhaber-Name. Pruefe ALLE Treffer und sag klar, welcher der Kunde ist und welche nur gleich heissen.\n' +
      'Jede Aussage mit Beleg (Register-Nr. oder URL). Was du nicht findest: in "unsicher" ehrlich vermerken. NUR lesen, nichts schreiben.',
  },
  {
    key: 'google-reviews-live',
    prompt:
      `Oeffne die Google-Maps/Google-Business-Seite des Kunden LIVE im Browser und ZAEHLE selbst nach. ${kopf}\n` +
      'Pflicht: Gesamt-Sternschnitt + GESAMT-Zahl der Bewertungen + Verteilung nachzaehlen (z.B. 17x 5-Stern / 3x 4-Stern / 1x 3-Stern / 0x 2-Stern / 1x 1-Stern).\n' +
      'Lies die NIEDRIGSTEN Bewertungen (1-2 Stern) im Wortlaut — dort stehen die echten Schmerzpunkte.\n' +
      'WICHTIG (Playbook-Regel 2): NIE eine Zahl aus dem Gedaechtnis oder aus einem alten Bericht uebernehmen — nur was du JETZT live siehst. Eine falsche Bewertungs-Zahl im Angebot ist peinlich, weil der Kunde selbst nachschaut.\n' +
      'Beleg = der Maps-Link (cid). Was der Login blockiert: in "unsicher" vermerken. NUR lesen.',
  },
  {
    key: 'weitere-review-portale',
    prompt:
      `Suche Bewertungen auf WEITEREN Portalen ausser Google. ${kopf}\n` +
      'Kandidaten je nach Branche: Trustpilot, local.ch, search.ch, Facebook, branchenspezifische Verzeichnisse.\n' +
      'Pro Portal: Schnitt + Anzahl + wiederkehrende Lob- und Kritik-Themen. Zahlen wieder LIVE, nicht geschaetzt.\n' +
      'Beleg = URL je Portal. Findest du nichts: "unsicher" = "keine weiteren Portale gefunden". NUR lesen.',
  },
  {
    key: 'branchen-schmerzen',
    prompt:
      `Recherchiere die typischen SCHMERZEN dieser Branche. ${kopf}\n` +
      'Gesucht: wiederkehrende Zeit-/Geld-Lecks (Wartezeiten, Fehlerquoten, verpasste Wiederkaeufe, Doppel-Pflege von Daten), belegte Branchen-Zahlen/Kosten-Rahmen.\n' +
      'Ziel ist Verkaufs-Muni: belegte Fakten, die SA im Gespraech einstreuen kann (z.B. gesetzliche Wiederkauf-Zyklen, Ausfall-Quoten ohne System).\n' +
      'Jede Zahl mit Quelle. Reine Vermutungen als solche kennzeichnen. NUR lesen.',
  },
  {
    key: 'bestehende-software',
    prompt:
      `Finde heraus, welche SOFTWARE der Kunde heute schon nutzt. ${kopf}\n` +
      'Suche Hinweise auf Shop-System, Buchungstool, Branchen-Software, Kassensystem (Webseite-Fusszeile, Job-Anzeigen, Portale, Screenshots).\n' +
      'Fuer jedes System: was kann es — und wo ist die LUECKE, die wir fuellen (Playbook-Regel 1: bestehendes System NIE ersetzen, aufsetzen).\n' +
      'Beleg = URL/Fundstelle. Unsicheres offen sagen. NUR lesen.',
  },
  {
    key: 'konkurrenz-vor-ort',
    prompt:
      `Recherchiere die KONKURRENZ am Ort / in der Region. ${kopf}\n` +
      'Finde 2-5 vergleichbare Betriebe in der Naehe. Pro Betrieb: machen sie schon das, was wir anbieten wuerden (z.B. Kunden-Mailings, Online-Buchung, Recall)?\n' +
      'Ziel: ist unser Angebot ein Vorsprung oder Gleichstand? Belege mit deren Webseiten. NUR lesen.',
  },
]

// --- Spaeher parallel laufen lassen (Fehler => null, dann filtern) ---
const funde = (
  await parallel(
    SPAEHER.map((s) => () =>
      agent(s.prompt, { label: `spaeher:${s.key}`, phase: 'Spaeher', schema: SPAEHER_SCHEMA }),
    ),
  )
).filter(Boolean)

log(`Spaeher fertig: ${funde.length}/${SPAEHER.length} Quellen geliefert. Verdichte zu Firmen-Profil + Schmerz-Hypothesen.`)

// --- Synthese-Schreiber: verdichtet die Roh-Funde zu 2 fertigen Markdown-Bloecken ---
// Reiner Schreib-Agent -> model 'opus' (er produziert den Deliverable-Text).
const synthese = await agent(
  `Du bist der Synthese-Schreiber fuer Phase 0. Verdichte die Roh-Funde des Spaeher-Schwarms zu ZWEI Markdown-Bloecken fuer SA (Legasthenie+ADHS: Fazit oben, Tabellen, kurze Zeilen, ae/oe/ue statt Umlaute).\n\n` +
    `KONTEXT: ${kopf}\n\n` +
    `ROH-FUNDE (JSON): ${JSON.stringify(funde)}\n\n` +
    `Block 1 "firma_profil_md": Was macht die Firma, wer entscheidet (NAME!), Groesse, bestehende Software + deren Luecke, Namensvetter-Warnung falls vorhanden. Kurz-Tabelle "Firma in 6 Zeilen" mit Beleg-Spalte.\n` +
    `Block 2 "schmerz_hypothesen_md": 3-6 Schmerz-Hypothesen nach Hormozi geordnet (groesster Geld-/Zeit-Hebel zuerst). Tabelle Schmerz | Hinweis-Beleg | moegliche Loesung | Sicherheit(hoch/mittel/Annahme).\n\n` +
    `HARTE REGELN:\n` +
    `- JEDE Zahl braucht eine Quelle aus den Roh-Funden. Zahlen ohne Beleg als "Annahme" markieren, NICHT als Fakt.\n` +
    `- Live-gezaehlte Review-Zahlen exakt uebernehmen (nie runden/schaetzen).\n` +
    `- Was die Spaeher in "unsicher" gemeldet haben, kommt als offene Frage ans Ende — nicht verschweigen.\n` +
    `Gib firma_profil_md + schmerz_hypothesen_md zurueck.`,
  { label: 'synthese', phase: 'Synthese', schema: SYNTHESE_SCHEMA, model: 'opus' },
)

log(
  `Ergebnis wird NICHT geschrieben — Aufrufer legt firma-profil.md + schmerz-hypothesen.md nach kunden/${kunde || '{kunde}'}/ ab.`,
)

return {
  kunde: kunde || null,
  quellen_geliefert: funde.length,
  firma_profil_md: synthese?.firma_profil_md || '',
  schmerz_hypothesen_md: synthese?.schmerz_hypothesen_md || '',
  roh_funde: funde,
  ablage_hinweis: `kunden/${kunde || '{kunde}'}/firma-profil.md + kunden/${kunde || '{kunde}'}/schmerz-hypothesen.md`,
}
