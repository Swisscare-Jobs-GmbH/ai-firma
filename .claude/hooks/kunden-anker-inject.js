#!/usr/bin/env node
/**
 * kunden-anker-inject.js — SessionStart-Injektor (Muster: firm-rollen-inject.js)
 *
 * Injiziert die Kunden-Registry beim Chat-Start als kanonischen Kontext-Anker. So
 * raet keine Session, welcher Kunde welches Repo/welche Ports/welchen Deal-Stand
 * hat — die Wahrheit steht EINMAL in kunden/UEBERSICHT.md und wird von dort geladen.
 *
 * Quelle = kunden/UEBERSICHT.md (die Registry-Tabelle). Kein Laufzeit-Cross-Repo-Read.
 *
 * Aktivierung (pro Rechner, gitignored): Eintrag in .claude/settings.local.json unter
 * hooks.SessionStart. Fail-safe: fehlt die Datei, passiert nichts (exit 0).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, '..', '..');
const SOURCE = path.join(PROJECT_ROOT, 'kunden', 'UEBERSICHT.md');

function emit() {
  let body = null;
  try {
    if (fs.existsSync(SOURCE)) body = fs.readFileSync(SOURCE, 'utf8').trim();
  } catch (_) { body = null; }
  if (!body) process.exit(0);

  const ctx = '# Kunden-Anker (auto-injected — VOR jedem Urteil ueber Kunde/Repo/Ports/Deal-Stand)\n\n' +
    '> Kanonische Kunden-Registry der AI-Firma. Kunden-Fakten (Repo-Pfad, Ports, Deal-Stand) ' +
    'NIE raten — citen oder „weiss nicht". Live-Korrektur des Users im Chat schlaegt jedes Doc.\n\n' +
    body;

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: ctx
    }
  }));
  process.exit(0);
}

// SessionStart liefert JSON auf stdin; Inhalt ist fuer uns irrelevant.
let data = '';
process.stdin.on('data', c => data += c);
process.stdin.on('end', emit);
// Fallback falls kein stdin (z.B. Test): direkt emittieren.
setTimeout(emit, 200);
