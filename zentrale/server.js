// SEA (Software, Efficient, Automation), lokaler Management-Server.
// Keine npm-Abhaengigkeiten, nur Node-Bordmittel (http, fs, path, child_process).
// Start: node server.js, danach http://127.0.0.1:8020

const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn, exec } = require("child_process");

const PORT = 8020;
const HOST = "127.0.0.1";
const BASIS_ORDNER = __dirname;
const DATEN_ORDNER = path.join(BASIS_ORDNER, "data");
const PUBLIC_ORDNER = path.join(BASIS_ORDNER, "public");

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png"
};

const STANDARD_EINSTELLUNGEN = {
  standardModell: "auto",
  zusatzFlags: "",
  theme: "dunkel",
  standardCwd: "C:/Projects/AIWorks",
  modellRegeln: [
    {
      muster: ["plan", "architektur", "audit", "recherche", "konzept", "analyse", "review", "strategie"],
      modellId: "claude-fable-5",
      grund: "Firmen-Regel: Recherche, Plan und Audit laufen auf Fabel 5"
    },
    {
      muster: ["baue", "implementier", "feature", "refactor", "umbauen", "erstelle app", "migration"],
      modellId: "claude-opus-4-8",
      grund: "Firmen-Regel: Bau läuft auf Opus 4.8"
    },
    {
      muster: ["fix", "tippfehler", "umbenenn", "formatier", "kleine", "doku", "kommentar", "aufräumen"],
      modellId: "claude-haiku-4-5-20251001",
      grund: "Mechanische Kleinarbeit: Haiku spart am meisten Tokens"
    }
  ]
};

const DATEI_DEFAULTS = {
  "kunden.json": { kunden: [] },
  "workflows.json": { workflows: [] },
  "einstellungen.json": STANDARD_EINSTELLUNGEN,
  "jobs.json": { jobs: [] }
};

// Nur diese drei Daten-Dateien loesen den Auto-GitHub-Sync aus (jobs.json nicht).
const SYNC_DATEI_NAMEN = new Set(["kunden.json", "workflows.json", "einstellungen.json"]);

const KOLLEKTIONEN = {
  kunden: { datei: "kunden.json", schluessel: "kunden", praefix: "k_" },
  workflows: { datei: "workflows.json", schluessel: "workflows", praefix: "w_" }
};

// ---------- Daten-Ablage (synchron, immer komplette Datei) ----------

function stelleDatenDateienSicher() {
  if (!fs.existsSync(DATEN_ORDNER)) {
    fs.mkdirSync(DATEN_ORDNER, { recursive: true });
  }
  for (const [datei, standard] of Object.entries(DATEI_DEFAULTS)) {
    const pfad = path.join(DATEN_ORDNER, datei);
    if (!fs.existsSync(pfad)) {
      fs.writeFileSync(pfad, JSON.stringify(standard, null, 2), "utf8");
    }
  }
}

function ladeDatei(datei) {
  const pfad = path.join(DATEN_ORDNER, datei);
  try {
    return JSON.parse(fs.readFileSync(pfad, "utf8"));
  } catch (err) {
    console.error("Konnte " + datei + " nicht lesen, nutze Defaults:", err.message);
    return JSON.parse(JSON.stringify(DATEI_DEFAULTS[datei]));
  }
}

function speichereDatei(datei, inhalt) {
  const pfad = path.join(DATEN_ORDNER, datei);
  fs.writeFileSync(pfad, JSON.stringify(inhalt, null, 2), "utf8");
  if (SYNC_DATEI_NAMEN.has(datei)) {
    planeDatenSync();
  }
}

// ---------- HTTP-Helfer ----------

function sendeJson(res, status, objekt) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(objekt));
}

function sendeFehler(res, status, text) {
  sendeJson(res, status, { fehler: text });
}

function leseBody(req) {
  return new Promise((resolve, reject) => {
    let daten = "";
    req.on("data", (teil) => { daten += teil; });
    req.on("end", () => resolve(daten));
    req.on("error", reject);
  });
}

function parseObjektBody(body) {
  try {
    const wert = JSON.parse(body === "" ? "{}" : body);
    if (typeof wert !== "object" || wert === null || Array.isArray(wert)) {
      return { fehler: "Request-Body muss ein JSON-Objekt sein" };
    }
    return { wert };
  } catch (err) {
    return { fehler: "Ungültiges JSON im Request-Body" };
  }
}

function isoDatum() {
  return new Date().toISOString().slice(0, 10);
}

// ---------- Kunden und Workflows (gleiche Mechanik) ----------

async function handleKollektion(req, res, name, id) {
  const konf = KOLLEKTIONEN[name];
  const daten = ladeDatei(konf.datei);
  const liste = Array.isArray(daten[konf.schluessel]) ? daten[konf.schluessel] : [];

  if (req.method === "GET" && !id) {
    return sendeJson(res, 200, { [konf.schluessel]: liste });
  }
  if (req.method === "POST" && !id) {
    return await erstelleEintrag(req, res, konf, liste);
  }
  if ((req.method === "PUT" || req.method === "DELETE") && id) {
    return await aenderEintrag(req, res, konf, liste, id);
  }
  return sendeFehler(res, 405, "Methode " + req.method + " hier nicht erlaubt");
}

async function erstelleEintrag(req, res, konf, liste) {
  const geparst = parseObjektBody(await leseBody(req));
  if (geparst.fehler) return sendeFehler(res, 400, geparst.fehler);

  const neu = Object.assign({}, geparst.wert, {
    id: konf.praefix + Date.now(),
    aktualisiert: isoDatum()
  });
  speichereDatei(konf.datei, { [konf.schluessel]: liste.concat([neu]) });
  return sendeJson(res, 200, neu);
}

async function aenderEintrag(req, res, konf, liste, id) {
  const index = liste.findIndex((eintrag) => eintrag && eintrag.id === id);
  if (index < 0) return sendeFehler(res, 404, "Eintrag " + id + " nicht gefunden");

  if (req.method === "DELETE") {
    const neueListe = liste.filter((eintrag) => eintrag.id !== id);
    speichereDatei(konf.datei, { [konf.schluessel]: neueListe });
    return sendeJson(res, 200, { ok: true });
  }

  const geparst = parseObjektBody(await leseBody(req));
  if (geparst.fehler) return sendeFehler(res, 400, geparst.fehler);

  const gemergt = Object.assign({}, liste[index], geparst.wert, {
    id,
    aktualisiert: isoDatum()
  });
  const neueListe = liste.map((eintrag, i) => (i === index ? gemergt : eintrag));
  speichereDatei(konf.datei, { [konf.schluessel]: neueListe });
  return sendeJson(res, 200, gemergt);
}

// ---------- Einstellungen ----------

async function handleEinstellungen(req, res) {
  if (req.method === "GET") {
    return sendeJson(res, 200, ladeDatei("einstellungen.json"));
  }
  if (req.method === "PUT") {
    const geparst = parseObjektBody(await leseBody(req));
    if (geparst.fehler) return sendeFehler(res, 400, geparst.fehler);
    speichereDatei("einstellungen.json", geparst.wert);
    return sendeJson(res, 200, geparst.wert);
  }
  return sendeFehler(res, 405, "Methode " + req.method + " hier nicht erlaubt");
}

// ---------- Claude-Lauf als Server-Sent-Events ----------

// Schutz gegen CSRF: nur eigene Origins, nur JSON, nur harmlose Argument-Zeichen.
const ERLAUBTE_ORIGINS = ["http://127.0.0.1:" + PORT, "http://localhost:" + PORT];
const ARGUMENT_MUSTER = /^[A-Za-z0-9._-]+$/;

function pruefeOrigin(req) {
  const origin = req.headers.origin;
  if (origin && !ERLAUBTE_ORIGINS.includes(origin)) {
    return { status: 403, text: "Origin nicht erlaubt: " + origin };
  }
  return null;
}

function pruefeClaudeRequestKopf(req) {
  const originFehler = pruefeOrigin(req);
  if (originFehler) return originFehler;
  const contentType = String(req.headers["content-type"] || "").toLowerCase();
  if (!contentType.startsWith("application/json")) {
    return { status: 400, text: "Content-Type muss application/json sein" };
  }
  return null;
}

function pruefeClaudeArgumente(modellId, zusatzFlags) {
  if (typeof modellId === "string" && modellId.trim() !== "" && !ARGUMENT_MUSTER.test(modellId.trim())) {
    return "modellId enthält unerlaubte Zeichen";
  }
  if (typeof zusatzFlags === "string" && zusatzFlags.trim() !== "") {
    for (const token of zusatzFlags.trim().split(/\s+/)) {
      if (!ARGUMENT_MUSTER.test(token)) {
        return "zusatzFlags enthält unerlaubte Zeichen: " + token;
      }
    }
  }
  return null;
}

function baueClaudeArgumente(modellId, zusatzFlags) {
  const argumente = ["-p"];
  if (typeof modellId === "string" && modellId.trim() !== "") {
    argumente.push("--model", modellId.trim());
  }
  argumente.push("--output-format", "stream-json", "--verbose");
  if (typeof zusatzFlags === "string" && zusatzFlags.trim() !== "") {
    argumente.push(...zusatzFlags.trim().split(/\s+/));
  }
  return argumente;
}

function sendeSse(res, eventName, daten) {
  if (res.writableEnded || res.destroyed) return;
  if (eventName) res.write("event: " + eventName + "\n");
  res.write("data: " + daten + "\n\n");
}

function leiteStromAlsSse(strom, res, eventName) {
  let rest = "";
  strom.on("data", (teil) => {
    rest += teil.toString("utf8");
    const zeilen = rest.split("\n");
    rest = zeilen.pop();
    for (const zeile of zeilen) {
      const sauber = zeile.replace(/\r$/, "");
      if (sauber !== "") sendeSse(res, eventName, sauber);
    }
  });
  strom.on("end", () => {
    const sauber = rest.replace(/\r$/, "");
    if (sauber !== "") sendeSse(res, eventName, sauber);
    rest = "";
  });
}

async function handleClaudeRun(req, res) {
  const kopfFehler = pruefeClaudeRequestKopf(req);
  if (kopfFehler) return sendeFehler(res, kopfFehler.status, kopfFehler.text);

  const geparst = parseObjektBody(await leseBody(req));
  if (geparst.fehler) return sendeFehler(res, 400, geparst.fehler);
  const { prompt, modellId, cwd, zusatzFlags } = geparst.wert;

  if (typeof prompt !== "string" || prompt.trim() === "") {
    return sendeFehler(res, 400, "Feld prompt fehlt oder ist leer");
  }
  const argumentFehler = pruefeClaudeArgumente(modellId, zusatzFlags);
  if (argumentFehler) return sendeFehler(res, 400, argumentFehler);
  let arbeitsOrdner = BASIS_ORDNER;
  if (typeof cwd === "string" && cwd.trim() !== "") {
    if (!fs.existsSync(cwd) || !fs.statSync(cwd).isDirectory()) {
      return sendeFehler(res, 400, "cwd ist kein existierender Ordner: " + cwd);
    }
    arbeitsOrdner = cwd;
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no"
  });

  const kind = spawn("claude", baueClaudeArgumente(modellId, zusatzFlags), {
    shell: true,
    cwd: arbeitsOrdner
  });

  leiteStromAlsSse(kind.stdout, res, null);
  leiteStromAlsSse(kind.stderr, res, "fehler");

  kind.on("error", (err) => {
    sendeSse(res, "fehler", "Konnte claude nicht starten: " + err.message);
    sendeSse(res, "ende", "1");
    if (!res.writableEnded) res.end();
  });
  kind.on("close", (code) => {
    sendeSse(res, "ende", String(code === null ? 1 : code));
    if (!res.writableEnded) res.end();
  });
  // res close feuert beim Verbindungsabbruch zuverlaessig (req close in modernem
  // Node nicht, wenn der Body schon konsumiert ist). Auf Windows haengt claude als
  // Enkelprozess unter der cmd.exe-Shell, darum den ganzen Prozessbaum beenden.
  res.on("error", function () {});
  res.on("close", () => {
    if (kind.exitCode === null && !kind.killed) {
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", String(kind.pid), "/T", "/F"]);
      } else {
        kind.kill();
      }
    }
  });

  kind.stdin.on("error", (err) => {
    console.error("stdin-Fehler beim claude-Prozess:", err.message);
  });
  kind.stdin.write(prompt);
  kind.stdin.end();
}

// ---------- Jobs (Hintergrund-Builds) ----------

const JOB_LOG_ORDNER = path.join(DATEN_ORDNER, "job-logs");
const CWD_PRAEFIXE = ["C:/Projects/AIWorks", "C:\\Projects\\AIWorks"];
const ERLAUBTE_JOB_ARTEN = ["website", "crm", "automation", "custom"];
const laufendeJobs = new Map(); // jobId -> Kindprozess, ueberlebt keinen Neustart

function ladeJobs() {
  const daten = ladeDatei("jobs.json");
  return Array.isArray(daten.jobs) ? daten.jobs : [];
}

function speichereJobs(jobs) {
  speichereDatei("jobs.json", { jobs });
}

function jobLogPfad(id) {
  return path.join(JOB_LOG_ORDNER, id + ".log");
}

function stelleJobLogOrdnerSicher() {
  if (!fs.existsSync(JOB_LOG_ORDNER)) {
    fs.mkdirSync(JOB_LOG_ORDNER, { recursive: true });
  }
}

function aktualisiereJob(id, aenderung) {
  const jobs = ladeJobs();
  const index = jobs.findIndex((job) => job && job.id === id);
  if (index < 0) return null;
  const gemergt = Object.assign({}, jobs[index], aenderung);
  speichereJobs(jobs.map((job, i) => (i === index ? gemergt : job)));
  return gemergt;
}

// Beim Start alle noch als "laeuft" markierten Jobs auf "abgebrochen" setzen
// (der Kindprozess ueberlebt einen Serverneustart nicht).
function bereinigeHaengendeJobs() {
  const jobs = ladeJobs();
  let veraendert = false;
  const neu = jobs.map((job) => {
    if (job && job.status === "laeuft") {
      veraendert = true;
      return Object.assign({}, job, { status: "abgebrochen", beendet: new Date().toISOString() });
    }
    return job;
  });
  if (veraendert) speichereJobs(neu);
}

function istErlaubterCwd(cwd) {
  if (typeof cwd !== "string" || cwd.trim() === "") return false;
  const norm = cwd.trim();
  return CWD_PRAEFIXE.some((praefix) => norm.startsWith(praefix));
}

// stdout und stderr zeilenweise an die Logdatei anhaengen.
function haengeStromAnLog(strom, schreibeLog) {
  let rest = "";
  strom.on("data", (teil) => {
    rest += teil.toString("utf8");
    const zeilen = rest.split("\n");
    rest = zeilen.pop();
    for (const zeile of zeilen) {
      schreibeLog(zeile.replace(/\r$/, "") + "\n");
    }
  });
  strom.on("end", () => {
    if (rest !== "") {
      schreibeLog(rest.replace(/\r$/, "") + "\n");
      rest = "";
    }
  });
}

// Ein bereits abgebrochener oder beendeter Job wird nicht mehr veraendert.
function beendeJob(id, status, exitCode) {
  laufendeJobs.delete(id);
  const jobs = ladeJobs();
  const aktuell = jobs.find((job) => job && job.id === id);
  if (!aktuell || aktuell.status !== "laeuft") return;
  aktualisiereJob(id, { status, exitCode, beendet: new Date().toISOString() });
}

function starteJobProzess(job, prompt, modellId, zusatzFlags) {
  stelleJobLogOrdnerSicher();
  const logPfad = jobLogPfad(job.id);
  const schreibeLog = (text) => {
    try {
      fs.appendFileSync(logPfad, text, "utf8");
    } catch (err) {
      console.error("Job-Log fuer " + job.id + " nicht schreibbar:", err.message);
    }
  };

  const kind = spawn("claude", baueClaudeArgumente(modellId, zusatzFlags), {
    shell: true,
    cwd: job.cwd
  });
  laufendeJobs.set(job.id, kind);

  haengeStromAnLog(kind.stdout, schreibeLog);
  haengeStromAnLog(kind.stderr, schreibeLog);

  kind.on("error", (err) => {
    schreibeLog("[Fehler] Konnte claude nicht starten: " + err.message + "\n");
    beendeJob(job.id, "fehler", 1);
  });
  kind.on("close", (code) => {
    beendeJob(job.id, code === 0 ? "fertig" : "fehler", code === null ? 1 : code);
  });

  kind.stdin.on("error", (err) => {
    console.error("stdin-Fehler beim Job " + job.id + ":", err.message);
  });
  kind.stdin.write(prompt);
  kind.stdin.end();
}

async function handleJobErstellen(req, res) {
  const kopfFehler = pruefeClaudeRequestKopf(req);
  if (kopfFehler) return sendeFehler(res, kopfFehler.status, kopfFehler.text);

  const geparst = parseObjektBody(await leseBody(req));
  if (geparst.fehler) return sendeFehler(res, 400, geparst.fehler);
  const { art, name, prompt, modellId, cwd, zusatzFlags } = geparst.wert;

  if (typeof prompt !== "string" || prompt.trim() === "") {
    return sendeFehler(res, 400, "Feld prompt fehlt oder ist leer");
  }
  const argumentFehler = pruefeClaudeArgumente(modellId, zusatzFlags);
  if (argumentFehler) return sendeFehler(res, 400, argumentFehler);
  if (!istErlaubterCwd(cwd)) {
    return sendeFehler(res, 400, "cwd muss mit C:/Projects/AIWorks beginnen");
  }
  const arbeitsOrdner = cwd.trim();
  try {
    fs.mkdirSync(arbeitsOrdner, { recursive: true });
  } catch (err) {
    return sendeFehler(res, 400, "cwd-Ordner konnte nicht angelegt werden: " + err.message);
  }

  const id = "job_" + Date.now();
  const job = {
    id,
    art: ERLAUBTE_JOB_ARTEN.includes(art) ? art : "custom",
    name: typeof name === "string" && name.trim() !== "" ? name.trim() : id,
    cwd: arbeitsOrdner,
    modellId: typeof modellId === "string" ? modellId.trim() : "",
    status: "laeuft",
    erstellt: new Date().toISOString(),
    beendet: null,
    exitCode: null
  };
  speichereJobs(ladeJobs().concat([job]));

  starteJobProzess(job, prompt, modellId, zusatzFlags);
  return sendeJson(res, 200, job);
}

function handleJobsListe(res) {
  const jobs = ladeJobs().slice().sort((a, b) => {
    return String(b.erstellt || "").localeCompare(String(a.erstellt || ""));
  });
  return sendeJson(res, 200, { jobs });
}

function handleJobEinzel(res, id) {
  const job = ladeJobs().find((eintrag) => eintrag && eintrag.id === id);
  if (!job) return sendeFehler(res, 404, "Job " + id + " nicht gefunden");
  return sendeJson(res, 200, job);
}

// Liefert den Logtext ab Byte-Offset "von" plus die aktuelle Gesamtlaenge,
// damit der Client beim naechsten Poll mit von=laenge nur Neues nachlaedt.
function handleJobLog(res, id, vonRoh) {
  const job = ladeJobs().find((eintrag) => eintrag && eintrag.id === id);
  if (!job) return sendeFehler(res, 404, "Job " + id + " nicht gefunden");

  let von = parseInt(vonRoh, 10);
  if (!Number.isFinite(von) || von < 0) von = 0;

  const pfad = jobLogPfad(id);
  if (!fs.existsSync(pfad)) {
    return sendeJson(res, 200, { text: "", laenge: 0, status: job.status, exitCode: job.exitCode });
  }

  let laenge = 0;
  let text = "";
  try {
    laenge = fs.statSync(pfad).size;
    if (von < laenge) {
      const fd = fs.openSync(pfad, "r");
      try {
        const puffer = Buffer.alloc(laenge - von);
        fs.readSync(fd, puffer, 0, puffer.length, von);
        text = puffer.toString("utf8");
      } finally {
        fs.closeSync(fd);
      }
    }
  } catch (err) {
    console.error("Job-Log fuer " + id + " nicht lesbar:", err.message);
  }
  return sendeJson(res, 200, { text, laenge, status: job.status, exitCode: job.exitCode });
}

function handleJobStop(req, res, id) {
  const originFehler = pruefeOrigin(req);
  if (originFehler) return sendeFehler(res, originFehler.status, originFehler.text);

  const job = ladeJobs().find((eintrag) => eintrag && eintrag.id === id);
  if (!job) return sendeFehler(res, 404, "Job " + id + " nicht gefunden");

  const kind = laufendeJobs.get(id);
  if (kind && kind.exitCode === null && !kind.killed) {
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", String(kind.pid), "/T", "/F"]);
    } else {
      kind.kill();
    }
  }
  laufendeJobs.delete(id);
  if (job.status === "laeuft") {
    aktualisiereJob(id, { status: "abgebrochen", beendet: new Date().toISOString() });
  }
  return sendeJson(res, 200, { ok: true });
}

function handleJobsRoute(req, res, teile) {
  const id = teile[2];
  const unterpfad = teile[3];

  if (!id) {
    if (req.method === "POST") return handleJobErstellen(req, res);
    if (req.method === "GET") return handleJobsListe(res);
    return sendeFehler(res, 405, "Methode " + req.method + " hier nicht erlaubt");
  }
  if (!unterpfad && req.method === "GET") {
    return handleJobEinzel(res, id);
  }
  if (unterpfad === "log" && req.method === "GET") {
    const von = new URL(req.url, "http://" + HOST + ":" + PORT).searchParams.get("von");
    return handleJobLog(res, id, von);
  }
  if (unterpfad === "stop" && req.method === "POST") {
    return handleJobStop(req, res, id);
  }
  return sendeFehler(res, 404, "Unbekannter Jobs-Pfad");
}

// ---------- Auto-GitHub-Sync der drei Daten-Dateien ----------

// Nach jedem Schreiben von kunden.json, workflows.json oder einstellungen.json
// wird ein entprellter git add/commit/push im Repo-Wurzelordner ausgeloest.
// Der Debounce buendelt schnelle Aenderungen zu einem Commit. Fehler blockieren
// nie den Request (der Sync laeuft asynchron nach der Antwort). Jobs-Daten werden
// bewusst nicht committed (siehe .gitignore).
const REPO_WURZEL = path.join(BASIS_ORDNER, "..");
const SYNC_ENTPRELLUNG_MS = 4000;
const SYNC_DATEI_PFADE = [
  "zentrale/data/kunden.json",
  "zentrale/data/workflows.json",
  "zentrale/data/einstellungen.json"
];
let syncTimer = null;

function planeDatenSync() {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(fuehreDatenSyncAus, SYNC_ENTPRELLUNG_MS);
}

function fuehreDatenSyncAus() {
  syncTimer = null;
  const befehl = "git add " + SYNC_DATEI_PFADE.join(" ")
    + " && git commit -m \"auto: Datenupdate aus SEA\""
    + " && git push";
  exec(befehl, { cwd: REPO_WURZEL, shell: true }, (fehler, stdout, stderr) => {
    if (!fehler) return;
    const text = String(stdout || "") + String(stderr || "") + fehler.message;
    // "nothing to commit" ist kein Fehler, nur nichts zu tun.
    if (/nothing to commit/i.test(text)) return;
    console.error("Auto-Sync fehlgeschlagen:", text.trim());
  });
}

// ---------- Statische Dateien ----------

function handleStatisch(req, res, pfadName) {
  let relativ;
  try {
    relativ = decodeURIComponent(pfadName === "/" ? "/index.html" : pfadName);
  } catch (err) {
    return sendeFehler(res, 400, "Ungültiger Pfad");
  }
  if (relativ.includes("..")) {
    return sendeFehler(res, 400, "Ungültiger Pfad");
  }
  const vollPfad = path.normalize(path.join(PUBLIC_ORDNER, relativ));
  if (!vollPfad.startsWith(PUBLIC_ORDNER)) {
    return sendeFehler(res, 400, "Ungültiger Pfad");
  }
  if (!fs.existsSync(vollPfad) || !fs.statSync(vollPfad).isFile()) {
    return sendeFehler(res, 404, "Nicht gefunden: " + relativ);
  }
  const typ = CONTENT_TYPES[path.extname(vollPfad).toLowerCase()] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": typ });
  res.end(fs.readFileSync(vollPfad));
}

// ---------- Router ----------

async function routeApi(req, res, pfadName) {
  const teile = pfadName.split("/").filter(Boolean);
  const bereich = teile[1];
  const id = teile[2];

  if ((bereich === "kunden" || bereich === "workflows") && teile.length <= 3) {
    return handleKollektion(req, res, bereich, id);
  }
  if (bereich === "einstellungen" && teile.length === 2) {
    return handleEinstellungen(req, res);
  }
  if (bereich === "claude" && id === "run" && teile.length === 3 && req.method === "POST") {
    return handleClaudeRun(req, res);
  }
  if (bereich === "jobs") {
    return handleJobsRoute(req, res, teile);
  }
  return sendeFehler(res, 404, "Unbekannter API-Pfad: " + pfadName);
}

const server = http.createServer(async (req, res) => {
  try {
    const pfadName = new URL(req.url, "http://" + HOST + ":" + PORT).pathname;
    if (pfadName.startsWith("/api/")) {
      return await routeApi(req, res, pfadName);
    }
    if (req.method === "GET") {
      return handleStatisch(req, res, pfadName);
    }
    return sendeFehler(res, 404, "Unbekannter Pfad: " + pfadName);
  } catch (err) {
    console.error("Unerwarteter Fehler:", err);
    if (!res.headersSent) {
      sendeFehler(res, 500, "Interner Serverfehler");
    } else if (!res.writableEnded) {
      res.end();
    }
  }
});

stelleDatenDateienSicher();
stelleJobLogOrdnerSicher();
bereinigeHaengendeJobs();
server.listen(PORT, HOST, () => {
  console.log("SEA laeuft auf http://127.0.0.1:8020");
});
