// Daten-Ablage. Liest/schreibt die JSON-Dateien im daten/-Ordner (die "einfuetter"-
// Grenze). Fehlen sie, werden sie EINMAL aus dem Mock erzeugt (kalendertag-verankert).
// Sind echte Daten drin, bleiben sie unangetastet — gleicher Code rechnet weiter.

const fs = require("fs");
const path = require("path");
const { generiere } = require("./mock");

const DATEIEN = {
  stammdaten: "stammdaten.json",
  verkaeufe: "verkaeufe.json",
  wareneingaenge: "wareneingaenge.json",
  bestand: "bestand.json",
  config: "config.json",
  dossier: "trend-dossier.json",
};

function pfad(ordner, name) {
  return path.join(ordner, DATEIEN[name]);
}

function schreibe(ordner, name, obj) {
  fs.writeFileSync(pfad(ordner, name), JSON.stringify(obj, null, 2), "utf8");
}

function lies(ordner, name) {
  return JSON.parse(fs.readFileSync(pfad(ordner, name), "utf8"));
}

// Erzeugt fehlende Dateien aus dem Mock. Nur was fehlt — vorhandene (echte) Daten bleiben.
function stelleSicher(ordner, heuteIso) {
  if (!fs.existsSync(ordner)) fs.mkdirSync(ordner, { recursive: true });
  const fehlt = Object.keys(DATEIEN).some((n) => !fs.existsSync(pfad(ordner, n)));
  if (!fehlt) return false;
  const daten = generiere(heuteIso);
  for (const name of Object.keys(DATEIEN)) {
    if (!fs.existsSync(pfad(ordner, name))) schreibe(ordner, name, daten[name]);
  }
  return true;
}

// Ueberschreibt ALLE Daten-Dateien mit frischem Mock (fuer den "neu wuerfeln"-Knopf).
function neuMock(ordner, heuteIso) {
  const daten = generiere(heuteIso);
  for (const name of Object.keys(DATEIEN)) schreibe(ordner, name, daten[name]);
  return daten;
}

function ladeAlle(ordner) {
  return {
    stammdaten: lies(ordner, "stammdaten"),
    verkaeufe: lies(ordner, "verkaeufe"),
    wareneingaenge: lies(ordner, "wareneingaenge"),
    bestand: lies(ordner, "bestand"),
    config: lies(ordner, "config"),
    dossier: lies(ordner, "dossier"),
  };
}

// ---------- Lauf-Protokoll (Idempotenz ueber Kalendertag, Bauplan G9) ----------

function protokollPfad(ordner) {
  return path.join(ordner, "laufprotokoll.json");
}

function ladeProtokoll(ordner) {
  const p = protokollPfad(ordner);
  if (!fs.existsSync(p)) return { laeufe: [] };
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch (e) { return { laeufe: [] }; }
}

// Traegt den heutigen Lauf ein, falls noch nicht vorhanden. Doppelter Start am selben
// Tag erzeugt KEINEN zweiten Eintrag. Gibt {neu, protokoll} zurueck.
function protokolliere(ordner, laufInfo) {
  const prot = ladeProtokoll(ordner);
  const schonDa = prot.laeufe.some((l) => l.datum === laufInfo.datum);
  if (!schonDa) {
    prot.laeufe.push(laufInfo);
    if (prot.laeufe.length > 90) prot.laeufe = prot.laeufe.slice(-90);
    fs.writeFileSync(protokollPfad(ordner), JSON.stringify(prot, null, 2), "utf8");
  }
  return { neu: !schonDa, protokoll: prot };
}

module.exports = { DATEIEN, stelleSicher, neuMock, ladeAlle, schreibe, lies, ladeProtokoll, protokolliere };
