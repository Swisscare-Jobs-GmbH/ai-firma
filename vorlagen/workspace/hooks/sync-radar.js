#!/usr/bin/env node
// sync-radar.js — PostToolUse-Hook (Write|Edit|MultiEdit|NotebookEdit) am Workspace-Root.
//
// Zweck: Merkt sich JEDE Datei-Aenderung in einem Workspace-Repo (ai-firma,
//   finelli-lagerverwaltung, kuenftige Kunden-Repos) in .claude/state/sync-pending.json,
//   damit der Stop-Hook (sync-erinnerung.js) eine Session mit offenem /brain-sync
//   nicht einfach enden laesst.
// Wurzel: Drift-Vorfall 20.07 — Registry kannte finelli-lagerverwaltung nicht,
//   E-Register kannte E3 nicht. Wissen driftet ohne mechanischen Ruecklauf.
//   WARUM: ai-firma/brain/lessons/system/2026-07-20-zwei-rechner-pfad-drift.md
// Verhalten: fail-open (jede Unsicherheit -> still exit 0). new Date() ist in einem
//   Hook ERLAUBT (nur in Workflow-Scripts verboten).
// Verdrahtung: .claude/settings.json -> PostToolUse, matcher "Write|Edit|MultiEdit|NotebookEdit".
// Abschalten: env AIW_RADAR_OFF=1

'use strict';
const fs = require('fs');
const path = require('path');

function norm(p) { return String(p || '').replace(/\\/g, '/').toLowerCase(); }

try {
  if (process.env.AIW_RADAR_OFF === '1') process.exit(0);

  let input = '';
  try { input = fs.readFileSync(0, 'utf8'); } catch (e) { process.exit(0); }
  let data = {};
  try { data = JSON.parse(input || '{}'); } catch (e) { process.exit(0); }

  const ti = data.tool_input || {};
  const roh = ti.file_path || ti.path || ti.notebook_path || '';
  if (!roh) process.exit(0);

  const wurzel = path.resolve(__dirname, '..', '..'); // C:\Projects\AIWorks
  const wurzelNorm = norm(wurzel);
  const datei = norm(path.resolve(roh));
  if (!datei.startsWith(wurzelNorm + '/')) process.exit(0);

  // Ausnahmen: Zustands-/Muell-Pfade zaehlen nie als Sync-pflichtige Aenderung
  const AUSNAHMEN = ['/.git/', '/node_modules/', '/.claude/state/', '/__pycache__/', '/dist/', '/build/'];
  if (AUSNAHMEN.some((a) => datei.includes(a))) process.exit(0);

  const rel = datei.slice(wurzelNorm.length + 1); // z.B. "ai-firma/kunden/..."
  const erstesSegment = rel.split('/')[0];

  // Repo = Unterordner mit .git; alles direkt am Root (CLAUDE.md, .claude/*) =
  // "workspace-root" (muss nach ai-firma/vorlagen/workspace/ gespiegelt werden).
  let eimer;
  if (fs.existsSync(path.join(wurzel, erstesSegment, '.git'))) {
    eimer = erstesSegment;
  } else {
    eimer = 'workspace-root';
  }

  const stateDir = path.join(wurzel, '.claude', 'state');
  const stateDatei = path.join(stateDir, 'sync-pending.json');
  fs.mkdirSync(stateDir, { recursive: true });

  let state = { eintraege: {}, seit: new Date().toISOString() };
  try { state = JSON.parse(fs.readFileSync(stateDatei, 'utf8')); } catch (e) { /* frisch */ }
  if (!state.eintraege || typeof state.eintraege !== 'object') state.eintraege = {};
  if (!Array.isArray(state.eintraege[eimer])) state.eintraege[eimer] = [];

  const relInRepo = eimer === 'workspace-root' ? rel : rel.slice(erstesSegment.length + 1);
  if (!state.eintraege[eimer].includes(relInRepo)) state.eintraege[eimer].push(relInRepo);
  state.zuletzt = new Date().toISOString();

  fs.writeFileSync(stateDatei, JSON.stringify(state, null, 2), 'utf8');
  process.exit(0);
} catch (e) {
  process.exit(0); // fail-open
}
