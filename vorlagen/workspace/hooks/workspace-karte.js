#!/usr/bin/env node
// workspace-karte.js — SessionStart-Hook am Workspace-Root.
//
// Zweck: Zeigt beim Chat-Start die Workspace-Karte: Git-Stand beider Repos
//   (Zweig, ungespeicherte Dateien, ahead/behind), offene Handoff-Auftraege in
//   ai-firma/brain/_handoff/, Sync-Stand (sync-pending.json) und das Alter der
//   Kunden-Registry (alte Fakten luegen still — Warnung ab 7 Tagen).
//   Windows-taugliche Workspace-Variante der ai-firma session-start-card.sh
//   (die braucht bash/gh und ist repo-gebunden).
// Verhalten: fail-open; jeder Teil-Ausfall wird still uebersprungen.
// Verdrahtung: .claude/settings.json -> SessionStart.
// Abschalten: env AIW_KARTE_OFF=1

'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const STALE_TAGE = 7;

function git(repo, args) {
  try {
    return execSync(`git -C "${repo}" ${args}`, { encoding: 'utf8', timeout: 8000, stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch (e) { return ''; }
}

try {
  if (process.env.AIW_KARTE_OFF === '1') process.exit(0);
  const wurzel = path.resolve(__dirname, '..', '..');

  const zeilen = [];
  zeilen.push('=== AIWorks Workspace-Karte (Hook: workspace-karte.js) ===');

  // 1) Repo-Stand
  let repos = [];
  try {
    repos = fs.readdirSync(wurzel).filter((d) => {
      try { return fs.existsSync(path.join(wurzel, d, '.git')); } catch (e) { return false; }
    });
  } catch (e) { /* leer */ }
  for (const r of repos) {
    const repoPfad = path.join(wurzel, r);
    const zweig = git(repoPfad, 'rev-parse --abbrev-ref HEAD') || '?';
    const dirty = git(repoPfad, 'status --porcelain');
    const dirtyAnzahl = dirty ? dirty.split('\n').filter(Boolean).length : 0;
    const sb = git(repoPfad, 'status -sb').split('\n')[0] || '';
    const drift = (sb.match(/\[(.+)\]/) || [])[1] || 'synchron mit origin';
    zeilen.push(`- ${r}: Zweig ${zweig} · ${dirtyAnzahl} ungespeicherte Datei(en) · ${drift}`);
  }

  // 2) Offene Handoffs/Auftraege in ai-firma/brain/_handoff/
  try {
    const handoffDir = path.join(wurzel, 'ai-firma', 'brain', '_handoff');
    const offene = fs.readdirSync(handoffDir).filter((f) => {
      if (!f.endsWith('.md')) return false;
      try {
        const kopf = fs.readFileSync(path.join(handoffDir, f), 'utf8').slice(0, 500);
        return /status:\s*offen/i.test(kopf);
      } catch (e) { return false; }
    });
    if (offene.length) zeilen.push(`- OFFENE AUFTRAEGE in brain/_handoff/: ${offene.join(', ')} (Einstieg pruefen!)`);
  } catch (e) { /* still */ }

  // 3) Sync-Stand
  try {
    const state = JSON.parse(fs.readFileSync(path.join(wurzel, '.claude', 'state', 'sync-pending.json'), 'utf8'));
    const eimer = Object.keys(state.eintraege || {}).filter((k) => (state.eintraege[k] || []).length > 0);
    if (eimer.length) zeilen.push(`- WARNUNG: /brain-sync ausstehend seit ${state.seit || '?'} (${eimer.join(', ')})`);
  } catch (e) { /* kein offener Sync */ }

  // 4) Registry-Alter (alte Fakten luegen still)
  try {
    const reg = fs.readFileSync(path.join(wurzel, 'ai-firma', 'kunden', 'UEBERSICHT.md'), 'utf8');
    const m = reg.match(/Stand\s+(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const stand = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      const alterTage = Math.floor((Date.now() - stand.getTime()) / 86400000);
      zeilen.push(alterTage > STALE_TAGE
        ? `- WARNUNG: Kunden-Registry ist ${alterTage} Tage alt (Stand ${m[0].slice(6)}) — vor Kunden-Aussagen aktualisieren`
        : `- Kunden-Registry: ${m[0]} (${alterTage} Tag(e) alt)`);
    }
  } catch (e) { /* still */ }

  zeilen.push('- Ritual: git pull beide Repos · brain/_handoff pruefen · nach Aenderungen /brain-sync (Regeln: CLAUDE.md am Root)');

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: zeilen.join('\n') }
  }));
  process.exit(0);
} catch (e) {
  process.exit(0); // fail-open
}
