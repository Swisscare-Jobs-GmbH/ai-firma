// Taeglicher Lauf (Orchestrator). Verbindet die 3 Mitarbeiter zu EINEM Durchlauf:
//   Snapshot (Mitarbeiter 2) -> Einschaetzung (Mitarbeiter 2, Fabel 5) ->
//   Berichte (Mitarbeiter 3) -> Vor-Versand-Check.
// Reine Funktion (kein Dateizugriff) — damit testbar. Idempotenz + Protokoll macht
// der Aufrufer (server.js) ueber den Kalendertag-Schluessel (Bauplan G9).

const { baueSnapshot } = require("./snapshot");
const { ladeDossier, fuerKategorie } = require("./research");
const manager = require("./manager");

// Interpretations-Schritt. IM ECHTBETRIEB schreibt hier Fabel 5 1-2 Saetze Einordnung.
// IM PROTOTYP: deterministische Vorlage, die NUR vorhandene Snapshot-Zahlen + eine
// Dossier-ID referenziert (erfindet keine Zahl — G3). Nur fuer Artikel mit Trigger.
function ergaenzeEinschaetzung(snapshot, dossier) {
  for (const a of snapshot.artikel) {
    if (!a.bestellvorschlag) continue;
    const trend = fuerKategorie(dossier, a.kategorie);
    let text = "Verkauft sich zuletzt ~" + a.bestellvorschlag.tagesabsatz + "/Tag (30 Tage: " + a.absatz.t30 + " Stueck).";
    let dossierId = null;
    if (trend) {
      dossierId = trend.id;
      text += " Branchen-Trend " + a.kategorie + ": " + trend.richtung + " (" + trend.id + ") stuetzt die Nachbestellung.";
    }
    a.einschaetzung = { text, dossier_id: dossierId };
  }
}

function fuehreLauf(daten, heute, optionen) {
  const opt = optionen || {};
  const snapshot = baueSnapshot(daten, heute, {
    modus: opt.modus || "MOCK",
    status: opt.dritt_ausfall ? "dritt-ausfall" : "ok",
    dritt_ausfall: opt.dritt_ausfall || null,
    packlog: opt.packlog || { eintraege: [] },
  });
  const dossier = ladeDossier(daten);

  ergaenzeEinschaetzung(snapshot, dossier);

  const { alarme, sammelBericht } = manager.baueAlarme(snapshot, dossier);
  const woche = manager.baueWochenbericht(snapshot, dossier);
  const monat = manager.baueMonatsbericht(snapshot, dossier);

  // Vor-Versand-Check ueber alle Berichte.
  const alleBerichte = alarme.concat(sammelBericht ? [sammelBericht] : []).concat([woche, monat]);
  const checks = alleBerichte.map((b) => ({
    typ: b.typ,
    titel: b.titel,
    ergebnis: manager.vorVersandCheck(b, snapshot, dossier),
  }));
  const versandOk = checks.every((c) => c.ergebnis.ok);

  return {
    lauf: {
      datum: heute,
      modus: snapshot.lauf.modus,
      status: snapshot.lauf.status,
      dritt_ausfall: snapshot.lauf.dritt_ausfall,
      versand_freigegeben: versandOk,
      anzahl_alarme: alarme.length,
    },
    snapshot,
    dossier,
    berichte: { alarme, sammel: sammelBericht, woche, monat },
    checks,
  };
}

module.exports = { fuehreLauf, ergaenzeEinschaetzung };
