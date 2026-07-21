// Finelli KI-Mitarbeiter — Prototyp-Server. Reines Node (http, fs, path), keine
// npm-Abhaengigkeiten, kein Build-Schritt. Start: node server.js -> http://127.0.0.1:8030
// Bindet NUR auf 127.0.0.1 (kein Zugriff von aussen). Fuehrt keine Shell-Befehle aus.

const http = require("http");
const fs = require("fs");
const path = require("path");
const daten = require("./lib/daten");
const { fuehreLauf } = require("./lib/lauf");
const { heuteIso } = require("./lib/datum");

const PORT = 8030;
const HOST = "127.0.0.1";
const DATEN_ORDNER = path.join(__dirname, "daten");
const PUBLIC_ORDNER = path.join(__dirname, "public");
const ERLAUBTE_ORIGINS = ["http://127.0.0.1:" + PORT, "http://localhost:" + PORT];

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function sendeJson(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}
function sendeFehler(res, status, text) { sendeJson(res, status, { fehler: text }); }

function leseBody(req) {
  return new Promise((resolve, reject) => {
    let d = "";
    req.on("data", (t) => { d += t; if (d.length > 20e6) req.destroy(); });
    req.on("end", () => resolve(d));
    req.on("error", reject);
  });
}

// CSRF-Schutz fuer schreibende Endpunkte: nur eigene Origins.
function pruefeOrigin(req) {
  const o = req.headers.origin;
  return !o || ERLAUBTE_ORIGINS.includes(o);
}

// ---------- Lauf ----------

function baueStand(optionen) {
  daten.stelleSicher(DATEN_ORDNER, heuteIso());
  const alle = daten.ladeAlle(DATEN_ORDNER);
  const packlog = daten.ladePacklog(DATEN_ORDNER);
  const stand = fuehreLauf(alle, heuteIso(), Object.assign({ packlog }, optionen || {}));
  const prot = daten.protokolliere(DATEN_ORDNER, {
    datum: stand.lauf.datum, modus: stand.lauf.modus, status: stand.lauf.status,
    anzahl_alarme: stand.lauf.anzahl_alarme, versand_freigegeben: stand.lauf.versand_freigegeben,
  });
  stand.protokoll = prot.protokoll.laeufe.slice(-14);
  stand.lauf.war_schon_gelaufen = !prot.neu;
  return stand;
}

// ---------- CSV-Import (alte Verkaufsdaten reinfuettern) ----------
// Erwartet Kopfzeile mit den Spalten: datum, sku, menge, kanal, standort (Reihenfolge egal).

function parseCsv(text) {
  const zeilen = text.split(/\r?\n/).filter((z) => z.trim() !== "");
  if (zeilen.length < 2) throw new Error("CSV braucht Kopfzeile + mind. 1 Datenzeile");
  const trenn = zeilen[0].includes(";") ? ";" : ",";
  const kopf = zeilen[0].split(trenn).map((s) => s.trim().toLowerCase());
  const idx = (name) => kopf.indexOf(name);
  const iD = idx("datum"), iS = idx("sku"), iM = idx("menge"), iK = idx("kanal"), iO = idx("standort");
  if (iD < 0 || iS < 0 || iM < 0) throw new Error("CSV braucht mindestens die Spalten datum, sku, menge");
  const eintraege = [];
  for (let z = 1; z < zeilen.length; z++) {
    const f = zeilen[z].split(trenn).map((s) => s.trim());
    const menge = Number(f[iM]);
    if (!f[iS] || !f[iD] || !Number.isFinite(menge)) continue;
    const kanal = iK >= 0 && f[iK] ? f[iK].toLowerCase() : "online";
    eintraege.push({
      sku: f[iS], datum: f[iD], menge: menge, kanal: kanal,
      standort: iO >= 0 && f[iO] ? f[iO].toLowerCase() : (kanal === "laden" ? "laden" : "embrach"),
    });
  }
  return eintraege;
}

// ---------- API ----------

async function routeApi(req, res, pfadName) {
  const teile = pfadName.split("/").filter(Boolean); // ["api", ...]
  const bereich = teile[1];
  const rest = teile[2];

  if (bereich === "stand" && req.method === "GET") {
    return sendeJson(res, 200, baueStand({}));
  }

  if (bereich === "lauf" && req.method === "POST") {
    if (!pruefeOrigin(req)) return sendeFehler(res, 403, "Origin nicht erlaubt");
    let opt = {};
    try { const b = await leseBody(req); opt = b ? JSON.parse(b) : {}; } catch (e) { return sendeFehler(res, 400, "Ungueltiges JSON"); }
    return sendeJson(res, 200, baueStand(opt));
  }

  if (bereich === "daten") {
    if (req.method === "GET" && rest && daten.DATEIEN[rest]) {
      daten.stelleSicher(DATEN_ORDNER, heuteIso());
      return sendeJson(res, 200, daten.lies(DATEN_ORDNER, rest));
    }
    if (req.method === "PUT" && rest && daten.DATEIEN[rest]) {
      if (!pruefeOrigin(req)) return sendeFehler(res, 403, "Origin nicht erlaubt");
      let obj;
      try { obj = JSON.parse(await leseBody(req)); } catch (e) { return sendeFehler(res, 400, "Ungueltiges JSON"); }
      if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return sendeFehler(res, 400, "Muss ein JSON-Objekt sein");
      daten.schreibe(DATEN_ORDNER, rest, obj);
      return sendeJson(res, 200, { ok: true });
    }
    return sendeFehler(res, 404, "Unbekannte Daten-Datei");
  }

  if (bereich === "pack" && rest === "fertig" && req.method === "POST") {
    if (!pruefeOrigin(req)) return sendeFehler(res, 403, "Origin nicht erlaubt");
    let b;
    try { b = JSON.parse(await leseBody(req)); } catch (e) { return sendeFehler(res, 400, "Ungueltiges JSON"); }
    if (!b || !b.auftrag_id || typeof b.dauer_s !== "number") return sendeFehler(res, 400, "auftrag_id und dauer_s (Zahl) noetig");
    const bestand = daten.lies(DATEN_ORDNER, "bestand");
    const auftrag = (bestand.pack_auftraege || []).find((p) => p.id === b.auftrag_id);
    if (!auftrag) return sendeFehler(res, 404, "Auftrag nicht gefunden");
    auftrag.status = "gepackt";
    daten.schreibe(DATEN_ORDNER, "bestand", bestand);
    daten.packlogEintrag(DATEN_ORDNER, { datum: heuteIso(), auftrag_id: b.auftrag_id, dauer_s: Math.round(b.dauer_s) });
    return sendeJson(res, 200, { ok: true });
  }

  if (bereich === "pack" && rest === "order" && req.method === "POST") {
    if (!pruefeOrigin(req)) return sendeFehler(res, 403, "Origin nicht erlaubt");
    let b;
    try { b = JSON.parse(await leseBody(req)); } catch (e) { return sendeFehler(res, 400, "Ungueltiges JSON"); }
    if (!b || !b.sku) return sendeFehler(res, 400, "sku noetig");
    const bestand = daten.lies(DATEN_ORDNER, "bestand");
    if (!bestand.pack_auftraege) bestand.pack_auftraege = [];
    const auftrag = {
      id: "PA-" + heuteIso() + "-L" + (bestand.pack_auftraege.length + 1),
      quelle: "laden", status: "offen",
      positionen: [{ sku: b.sku, menge: Math.max(1, Math.round(b.menge || 1)) }],
    };
    bestand.pack_auftraege.push(auftrag);
    daten.schreibe(DATEN_ORDNER, "bestand", bestand);
    return sendeJson(res, 200, { ok: true, auftrag });
  }

  if (bereich === "mock-neu" && req.method === "POST") {
    if (!pruefeOrigin(req)) return sendeFehler(res, 403, "Origin nicht erlaubt");
    daten.neuMock(DATEN_ORDNER, heuteIso());
    return sendeJson(res, 200, { ok: true });
  }

  if (bereich === "import" && rest === "verkaeufe-csv" && req.method === "POST") {
    if (!pruefeOrigin(req)) return sendeFehler(res, 403, "Origin nicht erlaubt");
    try {
      const csv = await leseBody(req);
      const eintraege = parseCsv(csv);
      daten.schreibe(DATEN_ORDNER, "verkaeufe", { eintraege });
      return sendeJson(res, 200, { ok: true, anzahl: eintraege.length });
    } catch (e) {
      return sendeFehler(res, 400, e.message);
    }
  }

  return sendeFehler(res, 404, "Unbekannter API-Pfad: " + pfadName);
}

// ---------- Statische Dateien ----------

function handleStatisch(req, res, pfadName) {
  let relativ;
  try { relativ = decodeURIComponent(pfadName === "/" ? "/index.html" : pfadName); }
  catch (e) { return sendeFehler(res, 400, "Ungueltiger Pfad"); }
  if (relativ.includes("..")) return sendeFehler(res, 400, "Ungueltiger Pfad");
  const voll = path.normalize(path.join(PUBLIC_ORDNER, relativ));
  if (!voll.startsWith(PUBLIC_ORDNER)) return sendeFehler(res, 400, "Ungueltiger Pfad");
  if (!fs.existsSync(voll) || !fs.statSync(voll).isFile()) return sendeFehler(res, 404, "Nicht gefunden");
  res.writeHead(200, { "Content-Type": CONTENT_TYPES[path.extname(voll).toLowerCase()] || "application/octet-stream" });
  res.end(fs.readFileSync(voll));
}

const server = http.createServer(async (req, res) => {
  try {
    const pfadName = new URL(req.url, "http://" + HOST + ":" + PORT).pathname;
    if (pfadName.startsWith("/api/")) return await routeApi(req, res, pfadName);
    if (req.method === "GET") return handleStatisch(req, res, pfadName);
    return sendeFehler(res, 404, "Unbekannter Pfad");
  } catch (err) {
    console.error("Fehler:", err);
    if (!res.headersSent) sendeFehler(res, 500, "Interner Serverfehler");
    else if (!res.writableEnded) res.end();
  }
});

if (require.main === module) {
  daten.stelleSicher(DATEN_ORDNER, heuteIso());
  server.listen(PORT, HOST, () => {
    console.log("Finelli KI-Mitarbeiter (Prototyp) laeuft auf http://127.0.0.1:" + PORT);
  });
}

module.exports = { server, baueStand, parseCsv };
