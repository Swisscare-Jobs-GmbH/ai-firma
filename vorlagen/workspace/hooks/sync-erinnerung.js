#!/usr/bin/env node
// sync-erinnerung.js — Stop-Hook am Workspace-Root.
//
// Zweck: Eine Session, die Repo-Dateien geaendert hat (sync-radar.js hat sie in
//   .claude/state/sync-pending.json registriert), soll nicht enden, ohne dass
//   /brain-sync gelaufen ist (Lehren zurueckspielen + committen + pushen).
//   Der Hook blockt das Stoppen EINMAL mit klarer Anweisung; /brain-sync leert
//   den State am Ende (Schritt 6 des Skills) — danach geht das Stoppen durch.
// Loop-Schutz: stop_hook_active in der Eingabe => nie erneut blocken.
// Verhalten: fail-open (Unsicherheit -> exit 0, kein Block).
// Verdrahtung: .claude/settings.json -> Stop.
// Abschalten: env AIW_SYNC_OFF=1

'use strict';
const fs = require('fs');
const path = require('path');

try {
  if (process.env.AIW_SYNC_OFF === '1') process.exit(0);

  let input = '';
  try { input = fs.readFileSync(0, 'utf8'); } catch (e) { process.exit(0); }
  let data = {};
  try { data = JSON.parse(input || '{}'); } catch (e) { /* weiter, Felder optional */ }

  if (data.stop_hook_active) process.exit(0); // nie doppelt blocken (Loop-Schutz)

  const wurzel = path.resolve(__dirname, '..', '..');
  const stateDatei = path.join(wurzel, '.claude', 'state', 'sync-pending.json');
  if (!fs.existsSync(stateDatei)) process.exit(0);

  let state = {};
  try { state = JSON.parse(fs.readFileSync(stateDatei, 'utf8')); } catch (e) { process.exit(0); }
  const eimer = Object.keys((state && state.eintraege) || {}).filter(
    (k) => Array.isArray(state.eintraege[k]) && state.eintraege[k].length > 0
  );
  if (eimer.length === 0) process.exit(0);

  const anzahl = eimer.map((k) => `${k}: ${state.eintraege[k].length} Datei(en)`).join(' · ');
  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason:
      'Brain-Sync ausstehend (' + anzahl + '). Bitte jetzt /brain-sync ausfuehren: ' +
      'Lehren nach ai-firma zurueckspielen, Registries nachziehen, beide Repos committen + pushen, ' +
      'dann .claude/state/sync-pending.json leeren (macht Schritt 6 des Skills). ' +
      'Wenn der Sync in dieser Session schon gelaufen ist: State-Datei leeren und normal abschliessen.'
  }));
  process.exit(0);
} catch (e) {
  process.exit(0); // fail-open
}
