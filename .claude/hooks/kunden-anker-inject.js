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

// Alter-Stempel: alte Fakten luegen still. Die Registry traegt eine Zeile
// "Stand YYYY-MM-DD" — wir rechnen ihr Alter aus und blenden es sichtbar ein,
// damit keine Session auf einem veralteten Kunden-Stand argumentiert.
// new Date() ist in einem Hook ERLAUBT (nur in Workflow-Scripts verboten).
const STALE_TAGE = 7;

function extractStand(text) {
  const m = /Stand\s+(\d{4}-\d{2}-\d{2})/.exec(text);
  return m ? m[1] : null;
}

// Ganze Tage zwischen dem Stand-Datum und heute (UTC-Mitternacht, DST-sicher).
function tageAlt(isoDate) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) return null;
  const stand = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  const jetzt = new Date();
  const heute = Date.UTC(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate());
  return Math.round((heute - stand) / 86400000);
}

// Baut die Alter-Stempel-Zeile(n), die an den injizierten Kontext angehaengt werden.
function altersStempel(text) {
  const stand = extractStand(text);
  if (!stand) {
    return '\n\n---\nRegistry-Stand: unbekannt (keine "Stand YYYY-MM-DD"-Zeile in UEBERSICHT.md)';
  }
  const n = tageAlt(stand);
  if (n === null) {
    return '\n\n---\nRegistry-Stand: ' + stand + ' (Datum unlesbar)';
  }
  let out = '\n\n---\nRegistry-Stand: ' + stand + ' = ' + n + ' Tage alt';
  if (n > STALE_TAGE) {
    out += '\nWARNUNG: Registry aelter als 7 Tage — vor Kunden-Aussagen pruefen/aktualisieren';
  }
  return out;
}

function emit() {
  let body = null;
  try {
    if (fs.existsSync(SOURCE)) body = fs.readFileSync(SOURCE, 'utf8').trim();
  } catch (_) { body = null; }
  if (!body) process.exit(0);

  const ctx = '# Kunden-Anker (auto-injected — VOR jedem Urteil ueber Kunde/Repo/Ports/Deal-Stand)\n\n' +
    '> Kanonische Kunden-Registry der AI-Firma. Kunden-Fakten (Repo-Pfad, Ports, Deal-Stand) ' +
    'NIE raten — citen oder „weiss nicht". Live-Korrektur des Users im Chat schlaegt jedes Doc.\n\n' +
    body +
    altersStempel(body);

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
