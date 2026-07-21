// SEA (Software, Efficient, Automation), lokaler Management-Server.
// Keine npm-Abhaengigkeiten, nur Node-Bordmittel (http, fs, path, child_process).
// Start: node server.js, danach http://127.0.0.1:8020

const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { spawn, exec } = require("child_process");

const PORT = 8020;
const HOST = "127.0.0.1";
const BASIS_ORDNER = __dirname;
const DATEN_ORDNER = path.join(BASIS_ORDNER, "data");
const PUBLIC_ORDNER = path.join(BASIS_ORDNER, "public");

// ---------- Nutzer + persoenliches Brain ----------
// Zwei feste Nutzer. Beim Login wird das persoenliche Brain (die .md-Dateien im
// jeweiligen Ordner unter brain/users/) als System-Prompt an jeden Claude-Aufruf
// gehaengt, damit Claude sich pro Nutzer angepasst verhaelt.
const BRAIN_ORDNER = path.join(BASIS_ORDNER, "..", "brain", "users");
const USER_STATE_DATEI = path.join(DATEN_ORDNER, "aktiver-user.json");
const SYSTEM_PROMPT_DATEI = path.join(DATEN_ORDNER, "system-prompt-aktiv.md");
const NUTZER = {
  cherry: { id: "cherry", name: "Cherry", person: "Shehryaar Khawaja", brainOrdner: "sa" },
  amb: { id: "amb", name: "Amb", person: "Abdul Bhatti", brainOrdner: "ab" }
};

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon"
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
  // Beim Start den Kunden-Spiegel im kunden-Ordner erzeugen, damit er immer
  // existiert (der Auto-Sync fasst ihn per git add an).
  const start = ladeDatei("kunden.json");
  spiegleKundenInOrdner(start && start.kunden ? start.kunden : []);
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
  if (datei === "kunden.json") {
    spiegleKundenInOrdner(inhalt && inhalt.kunden ? inhalt.kunden : []);
  }
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
// Konto-Ziel fuer cswap: Nummer, E-Mail oder Alias. Alias enger gefasst und
// mit alphanumerischem Anfang, damit kein Wert als cswap-Flag durchgeht.
const KONTO_ZIEL_MUSTER = /^[A-Za-z0-9@._+-]{1,100}$/;
const ALIAS_MUSTER = /^[A-Za-z0-9][A-Za-z0-9._-]{0,31}$/;

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
  haengeSystemPromptAn(argumente);
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

// ---------- Claude-Konten (cswap) ----------

// Konten-Verwaltung ueber das CLI "cswap" (claude-swap). Ein Wechsel tauscht die
// Credentials sofort fuer den ganzen PC. Immer spawn mit Argument-Array und
// shell:false, damit es keine Injection-Flaeche gibt.
const CSWAP_TIMEOUT_MS = 60000;

function ermittleCswapBefehl() {
  const exePfad = path.join(os.homedir(), ".local", "bin", "cswap.exe");
  return fs.existsSync(exePfad) ? exePfad : "cswap";
}

// Fuehrt cswap aus, sammelt stdout/stderr, schreibt optional stdinText hinein
// (z.B. "y\n" fuer die remove-Rueckfrage) und beendet den Prozessbaum nach
// timeoutMs. Rueckgabe { code, stdout, stderr, timeout }.
function fuehreCswapAus(argumente, optionen) {
  const opts = optionen || {};
  const timeoutMs = typeof opts.timeoutMs === "number" ? opts.timeoutMs : CSWAP_TIMEOUT_MS;
  return new Promise((resolve, reject) => {
    const kind = spawn(ermittleCswapBefehl(), argumente, { shell: false, windowsHide: true });
    let stdout = "";
    let stderr = "";
    let timeout = false;
    let fertig = false;

    const timer = setTimeout(() => {
      timeout = true;
      if (kind.exitCode === null && !kind.killed) {
        if (process.platform === "win32") {
          spawn("taskkill", ["/pid", String(kind.pid), "/T", "/F"]).on("error", (err) => {
            console.error("taskkill fuer cswap fehlgeschlagen:", err.message);
          });
        } else {
          kind.kill();
        }
      }
      // Notbremse: stirbt der Prozess nicht, den Request trotzdem beantworten
      // (der fertig-Wächter verhindert ein doppeltes resolve beim spaeten close).
      setTimeout(() => {
        if (fertig) return;
        fertig = true;
        resolve({ code: 1, stdout, stderr, timeout: true });
      }, 5000);
    }, timeoutMs);

    kind.stdout.on("data", (teil) => { stdout += teil.toString("utf8"); });
    kind.stderr.on("data", (teil) => { stderr += teil.toString("utf8"); });

    kind.on("error", (err) => {
      if (fertig) return;
      fertig = true;
      clearTimeout(timer);
      const text = err.code === "ENOENT"
        ? "claude-swap ist nicht installiert (uv tool install claude-swap)"
        : "cswap konnte nicht gestartet werden: " + err.message;
      reject(new Error(text));
    });
    kind.on("close", (code) => {
      if (fertig) return;
      fertig = true;
      clearTimeout(timer);
      resolve({ code: code === null ? 1 : code, stdout, stderr, timeout });
    });

    kind.stdin.on("error", (err) => {
      console.error("stdin-Fehler beim cswap-Prozess:", err.message);
    });
    if (typeof opts.stdinText === "string") {
      kind.stdin.write(opts.stdinText);
    }
    kind.stdin.end();
  });
}

// stdout eines --json-Befehls parsen; bei Muell kurze Fehlermeldung liefern.
function parseCswapJson(ergebnis) {
  try {
    return { wert: JSON.parse(ergebnis.stdout.trim()) };
  } catch (err) {
    const auszug = (ergebnis.stdout.trim() || ergebnis.stderr.trim()).slice(0, 300);
    return { fehler: "cswap lieferte kein gültiges JSON: " + auszug };
  }
}

// Einheitliche Fehlerantwort fuer fehlgeschlagene cswap-Laeufe.
function sendeCswapFehler(res, ergebnis) {
  if (ergebnis.timeout) {
    return sendeFehler(res, 504, "cswap hat nicht rechtzeitig geantwortet (Timeout)");
  }
  const text = (ergebnis.stderr.trim() || ergebnis.stdout.trim()).slice(0, 300);
  return sendeFehler(res, 500, text || ("cswap beendet mit Exit-Code " + ergebnis.code));
}

// Fuehrt einen --json-Befehl aus und reicht das JSON unveraendert durch.
async function handleKontenJsonBefehl(res, argumente) {
  let ergebnis;
  try {
    ergebnis = await fuehreCswapAus(argumente, {});
  } catch (err) {
    return sendeFehler(res, 500, err.message);
  }
  if (ergebnis.timeout || ergebnis.code !== 0) return sendeCswapFehler(res, ergebnis);
  const geparst = parseCswapJson(ergebnis);
  if (geparst.fehler) return sendeFehler(res, 502, geparst.fehler);
  return sendeJson(res, 200, geparst.wert);
}

// Fuehrt einen Befehl ohne JSON-Ausgabe aus und antwortet { ok, meldung }.
async function handleKontenTextBefehl(res, argumente, stdinText) {
  let ergebnis;
  try {
    ergebnis = await fuehreCswapAus(argumente, stdinText ? { stdinText } : {});
  } catch (err) {
    return sendeFehler(res, 500, err.message);
  }
  if (ergebnis.timeout || ergebnis.code !== 0) return sendeCswapFehler(res, ergebnis);
  return sendeJson(res, 200, { ok: true, meldung: ergebnis.stdout.trim() });
}

// Origin/Content-Type pruefen und JSON-Body lesen; bei Fehler ist schon
// geantwortet und es kommt null zurueck.
async function leseKontenBody(req, res) {
  const kopfFehler = pruefeClaudeRequestKopf(req);
  if (kopfFehler) {
    sendeFehler(res, kopfFehler.status, kopfFehler.text);
    return null;
  }
  const geparst = parseObjektBody(await leseBody(req));
  if (geparst.fehler) {
    sendeFehler(res, 400, geparst.fehler);
    return null;
  }
  return geparst.wert;
}

// Ziel validieren (Nummer, E-Mail oder Alias); fuehrende "-" waeren Flags.
function pruefeKontoZiel(wert) {
  const ziel = typeof wert === "string" ? wert.trim() : "";
  if (!KONTO_ZIEL_MUSTER.test(ziel) || ziel.startsWith("-")) return null;
  return ziel;
}

async function handleKontoWechseln(req, res) {
  const body = await leseKontenBody(req, res);
  if (!body) return;
  const ziel = pruefeKontoZiel(body.ziel);
  if (!ziel) return sendeFehler(res, 400, "Feld ziel fehlt oder enthält unerlaubte Zeichen");
  return handleKontenJsonBefehl(res, ["switch", ziel, "--json"]);
}

// cswap add uebernimmt das gerade in Claude Code eingeloggte Konto. Optional
// wird danach ein Alias gesetzt; scheitert das, kommt es als Warnung zurueck.
async function handleKontoHinzufuegen(req, res) {
  const body = await leseKontenBody(req, res);
  if (!body) return;
  const alias = typeof body.alias === "string" ? body.alias.trim() : "";
  if (alias !== "" && !ALIAS_MUSTER.test(alias)) {
    return sendeFehler(res, 400, "alias enthält unerlaubte Zeichen (erlaubt: Buchstaben, Ziffern, . _ -)");
  }
  let ergebnis;
  try {
    ergebnis = await fuehreCswapAus(["add"], {});
  } catch (err) {
    return sendeFehler(res, 500, err.message);
  }
  if (ergebnis.timeout || ergebnis.code !== 0) return sendeCswapFehler(res, ergebnis);

  const antwort = { ok: true, meldung: ergebnis.stdout.trim() };
  if (alias !== "") {
    const treffer = /Account (\d+)/.exec(ergebnis.stdout);
    if (!treffer) {
      antwort.warnung = "Kontonummer nicht aus der add-Ausgabe erkennbar, Alias nicht gesetzt";
    } else {
      try {
        const aliasLauf = await fuehreCswapAus(["alias", treffer[1], alias], {});
        if (aliasLauf.timeout || aliasLauf.code !== 0) {
          antwort.warnung = "Alias konnte nicht gesetzt werden: "
            + (aliasLauf.stderr.trim() || aliasLauf.stdout.trim()).slice(0, 300);
        }
      } catch (err) {
        antwort.warnung = "Alias konnte nicht gesetzt werden: " + err.message;
      }
    }
  }
  return sendeJson(res, 200, antwort);
}

// remove fragt interaktiv nach — die Bestaetigung "y" geht per stdin hinein.
async function handleKontoEntfernen(req, res) {
  const body = await leseKontenBody(req, res);
  if (!body) return;
  const ziel = pruefeKontoZiel(body.ziel);
  if (!ziel) return sendeFehler(res, 400, "Feld ziel fehlt oder enthält unerlaubte Zeichen");
  return handleKontenTextBefehl(res, ["remove", ziel], "y\n");
}

async function handleKontoAlias(req, res) {
  const body = await leseKontenBody(req, res);
  if (!body) return;
  const ziel = pruefeKontoZiel(body.ziel);
  if (!ziel) return sendeFehler(res, 400, "Feld ziel fehlt oder enthält unerlaubte Zeichen");
  const alias = typeof body.alias === "string" ? body.alias.trim() : "";
  if (alias === "") {
    return handleKontenTextBefehl(res, ["alias", ziel, "--unset"]);
  }
  if (!ALIAS_MUSTER.test(alias)) {
    return sendeFehler(res, 400, "alias enthält unerlaubte Zeichen (erlaubt: Buchstaben, Ziffern, . _ -)");
  }
  return handleKontenTextBefehl(res, ["alias", ziel, alias]);
}

async function handleKontoRotation(req, res) {
  const body = await leseKontenBody(req, res);
  if (!body) return;
  const ziel = pruefeKontoZiel(body.ziel);
  if (!ziel) return sendeFehler(res, 400, "Feld ziel fehlt oder enthält unerlaubte Zeichen");
  if (typeof body.aktiv !== "boolean") {
    return sendeFehler(res, 400, "Feld aktiv muss true oder false sein");
  }
  return handleKontenTextBefehl(res, [body.aktiv ? "enable" : "disable", ziel]);
}

function handleKontenRoute(req, res, teile) {
  const unterpfad = teile[2];
  if (!unterpfad && req.method === "GET") {
    return handleKontenJsonBefehl(res, ["list", "--json"]);
  }
  if (unterpfad === "status" && req.method === "GET" && teile.length === 3) {
    return handleKontenJsonBefehl(res, ["status", "--json"]);
  }
  if (req.method === "POST" && teile.length === 3) {
    if (unterpfad === "wechseln") return handleKontoWechseln(req, res);
    if (unterpfad === "hinzufuegen") return handleKontoHinzufuegen(req, res);
    if (unterpfad === "entfernen") return handleKontoEntfernen(req, res);
    if (unterpfad === "alias") return handleKontoAlias(req, res);
    if (unterpfad === "rotation") return handleKontoRotation(req, res);
  }
  return sendeFehler(res, 404, "Unbekannter Konten-Pfad");
}

// ---------- Claude-Chats (persistente Gespraeche) ----------

// Jeder Chat ist ein fortlaufendes claude-Gespraech mit eigener Session-UUID:
// erste Nachricht laeuft mit --session-id, jede weitere mit --resume derselben
// UUID. Die claude-CLI haelt den inhaltlichen Verlauf der Session selbst; unsere
// Datei data/chats/<id>.json ist der durchsuch- und wiederherstellbare Index
// (Metadaten + Nachrichten-Text). Chats werden NICHT nach GitHub gepusht.
const CHAT_ORDNER = path.join(DATEN_ORDNER, "chats");
const MEMORY_DATEI = path.join(DATEN_ORDNER, "claude-memory.md");
const UUID_MUSTER = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const CHAT_TITEL_MAX = 80;
// Permission-Flags aus den globalen Zusatz-Flags werden fuer Chats entfernt: die
// Bau-Freigabe steuert allein der Pro-Chat-Schalter (Sicherheit per Default).
const BERECHTIGUNGS_FLAGS = new Set(["--permission-mode", "--dangerously-skip-permissions"]);
// Verhindert zwei gleichzeitige Nachrichten im selben Chat (Session-Kollision).
const laufendeChatSessions = new Set();

function stelleChatOrdnerSicher() {
  if (!fs.existsSync(CHAT_ORDNER)) {
    fs.mkdirSync(CHAT_ORDNER, { recursive: true });
  }
}

function chatPfad(id) {
  return path.join(CHAT_ORDNER, id + ".json");
}

function ladeChat(id) {
  if (!UUID_MUSTER.test(id)) return null;
  const pfad = chatPfad(id);
  if (!fs.existsSync(pfad)) return null;
  try {
    return JSON.parse(fs.readFileSync(pfad, "utf8"));
  } catch (err) {
    console.error("Chat " + id + " nicht lesbar:", err.message);
    return null;
  }
}

function speichereChat(chat) {
  fs.writeFileSync(chatPfad(chat.id), JSON.stringify(chat, null, 2), "utf8");
}

// Kompakte Metadaten fuer die Liste (ohne den vollen Nachrichten-Text).
function chatMeta(chat) {
  return {
    id: chat.id,
    titel: chat.titel || "Neuer Chat",
    modellId: chat.modellId || "",
    cwd: chat.cwd || "",
    bauenErlaubt: !!chat.bauenErlaubt,
    erstellt: chat.erstellt || "",
    aktualisiert: chat.aktualisiert || chat.erstellt || "",
    anzahlNachrichten: Array.isArray(chat.nachrichten) ? chat.nachrichten.length : 0
  };
}

// Alle Chats als Metadaten, neueste (zuletzt aktualisiert) zuerst.
function listeChats() {
  stelleChatOrdnerSicher();
  let dateien = [];
  try {
    dateien = fs.readdirSync(CHAT_ORDNER).filter((n) => n.endsWith(".json"));
  } catch (err) {
    console.error("Chat-Ordner nicht lesbar:", err.message);
    return [];
  }
  const metas = [];
  for (const datei of dateien) {
    const chat = ladeChat(datei.slice(0, -5));
    if (chat && chat.id) metas.push(chatMeta(chat));
  }
  metas.sort((a, b) => String(b.aktualisiert).localeCompare(String(a.aktualisiert)));
  return metas;
}

// Aus dem ersten Prompt einen kurzen, einzeiligen Titel machen.
function titelAusPrompt(prompt) {
  const eine = String(prompt || "").replace(/\s+/g, " ").trim();
  if (eine === "") return "Neuer Chat";
  return eine.length > CHAT_TITEL_MAX ? eine.slice(0, CHAT_TITEL_MAX - 1).trim() + "…" : eine;
}

// Zusatz-Flags der Einstellungen ohne die Permission-Flags (die steuert der
// Pro-Chat-Schalter). Flag plus zugehoeriger Wert werden gemeinsam entfernt.
function zusatzFlagsOhneBerechtigung(flagText) {
  const tokens = String(flagText || "").trim().split(/\s+/).filter(Boolean);
  const raus = [];
  for (let i = 0; i < tokens.length; i++) {
    if (BERECHTIGUNGS_FLAGS.has(tokens[i])) {
      if (tokens[i] === "--permission-mode") i++; // Wert mitueberspringen
      continue;
    }
    raus.push(tokens[i]);
  }
  return raus;
}

// Baut die claude-Argumente fuer eine Chat-Nachricht (Modell schon geprueft).
function baueChatArgumente(chat, modellId) {
  const argumente = ["-p", "--output-format", "stream-json", "--verbose"];
  if (modellId) {
    argumente.push("--model", modellId);
  }
  if (chat.sessionGestartet) {
    argumente.push("--resume", chat.id);
  } else {
    argumente.push("--session-id", chat.id);
  }
  if (chat.bauenErlaubt) {
    argumente.push("--permission-mode", "acceptEdits");
  }
  // Persoenliches Brain des aktiven Nutzers + gemeinsames Gedaechtnis in einer Datei.
  haengeSystemPromptAn(argumente);
  const einst = ladeDatei("einstellungen.json");
  for (const token of zusatzFlagsOhneBerechtigung(einst && einst.zusatzFlags)) {
    argumente.push(token);
  }
  return argumente;
}

// --- Chat-CRUD ---

function handleChatsListe(res) {
  return sendeJson(res, 200, { chats: listeChats() });
}

async function handleChatErstellen(req, res) {
  const kopfFehler = pruefeClaudeRequestKopf(req);
  if (kopfFehler) return sendeFehler(res, kopfFehler.status, kopfFehler.text);
  const geparst = parseObjektBody(await leseBody(req));
  if (geparst.fehler) return sendeFehler(res, 400, geparst.fehler);
  const wert = geparst.wert;

  const modellId = typeof wert.modellId === "string" ? wert.modellId.trim() : "";
  if (modellId !== "" && !ARGUMENT_MUSTER.test(modellId)) {
    return sendeFehler(res, 400, "modellId enthält unerlaubte Zeichen");
  }
  const einst = ladeDatei("einstellungen.json");
  let cwd = typeof wert.cwd === "string" && wert.cwd.trim() !== ""
    ? wert.cwd.trim()
    : (einst && einst.standardCwd) || BASIS_ORDNER;
  if (!fs.existsSync(cwd) || !fs.statSync(cwd).isDirectory()) {
    return sendeFehler(res, 400, "cwd ist kein existierender Ordner: " + cwd);
  }

  stelleChatOrdnerSicher();
  const jetzt = new Date().toISOString();
  const chat = {
    id: crypto.randomUUID(),
    titel: typeof wert.titel === "string" && wert.titel.trim() !== "" ? wert.titel.trim().slice(0, CHAT_TITEL_MAX) : "",
    titelAuto: !(typeof wert.titel === "string" && wert.titel.trim() !== ""),
    modellId: modellId,
    cwd: cwd,
    bauenErlaubt: wert.bauenErlaubt === true,
    sessionGestartet: false,
    erstellt: jetzt,
    aktualisiert: jetzt,
    nachrichten: []
  };
  speichereChat(chat);
  return sendeJson(res, 200, chat);
}

function handleChatEinzel(res, id) {
  const chat = ladeChat(id);
  if (!chat) return sendeFehler(res, 404, "Chat " + id + " nicht gefunden");
  return sendeJson(res, 200, chat);
}

async function handleChatAendern(req, res, id) {
  const kopfFehler = pruefeClaudeRequestKopf(req);
  if (kopfFehler) return sendeFehler(res, kopfFehler.status, kopfFehler.text);
  const chat = ladeChat(id);
  if (!chat) return sendeFehler(res, 404, "Chat " + id + " nicht gefunden");
  const geparst = parseObjektBody(await leseBody(req));
  if (geparst.fehler) return sendeFehler(res, 400, geparst.fehler);
  const wert = geparst.wert;

  if (typeof wert.titel === "string") {
    const titel = wert.titel.trim().slice(0, CHAT_TITEL_MAX);
    if (titel !== "") {
      chat.titel = titel;
      chat.titelAuto = false;
    }
  }
  if (typeof wert.modellId === "string") {
    const modellId = wert.modellId.trim();
    if (modellId !== "" && !ARGUMENT_MUSTER.test(modellId)) {
      return sendeFehler(res, 400, "modellId enthält unerlaubte Zeichen");
    }
    chat.modellId = modellId;
  }
  if (typeof wert.bauenErlaubt === "boolean") {
    chat.bauenErlaubt = wert.bauenErlaubt;
  }
  // Arbeitsordner nur aenderbar, solange die Session nicht laeuft (danach ist
  // sie fest an diesen Ordner gebunden, ein Wechsel wuerde --resume brechen).
  if (typeof wert.cwd === "string" && wert.cwd.trim() !== "") {
    const hatVerlauf = Array.isArray(chat.nachrichten) && chat.nachrichten.length > 0;
    if (chat.sessionGestartet || hatVerlauf) {
      return sendeFehler(res, 409, "Arbeitsordner kann nach der ersten Nachricht nicht mehr geändert werden");
    }
    const cwd = wert.cwd.trim();
    if (!fs.existsSync(cwd) || !fs.statSync(cwd).isDirectory()) {
      return sendeFehler(res, 400, "cwd ist kein existierender Ordner: " + cwd);
    }
    chat.cwd = cwd;
  }
  chat.aktualisiert = new Date().toISOString();
  speichereChat(chat);
  return sendeJson(res, 200, chatMeta(chat));
}

function handleChatLoeschen(res, id) {
  if (!UUID_MUSTER.test(id)) return sendeFehler(res, 400, "Ungültige Chat-ID");
  const pfad = chatPfad(id);
  if (!fs.existsSync(pfad)) return sendeFehler(res, 404, "Chat " + id + " nicht gefunden");
  try {
    fs.unlinkSync(pfad);
  } catch (err) {
    return sendeFehler(res, 500, "Chat konnte nicht gelöscht werden: " + err.message);
  }
  return sendeJson(res, 200, { ok: true });
}

// --- Chat-Nachricht als Server-Sent-Events (mit Session-Fortsetzung) ---

async function handleChatNachricht(req, res, id) {
  const kopfFehler = pruefeClaudeRequestKopf(req);
  if (kopfFehler) return sendeFehler(res, kopfFehler.status, kopfFehler.text);
  const chat = ladeChat(id);
  if (!chat) return sendeFehler(res, 404, "Chat " + id + " nicht gefunden");

  const geparst = parseObjektBody(await leseBody(req));
  if (geparst.fehler) return sendeFehler(res, 400, geparst.fehler);
  const prompt = geparst.wert.prompt;
  if (typeof prompt !== "string" || prompt.trim() === "") {
    return sendeFehler(res, 400, "Feld prompt fehlt oder ist leer");
  }

  const modellId = typeof chat.modellId === "string" ? chat.modellId.trim() : "";
  const argumentFehler = pruefeClaudeArgumente(modellId, "");
  if (argumentFehler) return sendeFehler(res, 400, argumentFehler);

  let arbeitsOrdner = BASIS_ORDNER;
  if (typeof chat.cwd === "string" && chat.cwd.trim() !== "") {
    if (!fs.existsSync(chat.cwd) || !fs.statSync(chat.cwd).isDirectory()) {
      return sendeFehler(res, 400, "Arbeitsordner des Chats existiert nicht: " + chat.cwd);
    }
    arbeitsOrdner = chat.cwd;
  }

  if (laufendeChatSessions.has(chat.id)) {
    return sendeFehler(res, 409, "Chat verarbeitet gerade eine Nachricht");
  }
  laufendeChatSessions.add(chat.id);

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no"
  });

  const kind = spawn("claude", baueChatArgumente(chat, modellId), {
    shell: true,
    cwd: arbeitsOrdner
  });

  // stdout zeilenweise: als SSE weiterreichen UND den Antworttext + Kosten
  // serverseitig einsammeln, damit der Verlauf gespeichert werden kann.
  let antwortAkku = "";
  let ergebnisText = "";
  let kostenUsd = null;
  let sahInit = false;
  let restPuffer = "";

  function verarbeiteAusgabeZeile(sauber) {
    if (sauber === "") return;
    sendeSse(res, null, sauber);
    let obj;
    try {
      obj = JSON.parse(sauber);
    } catch (err) {
      return;
    }
    if (!obj || typeof obj !== "object") return;
    if (obj.type === "system" && obj.subtype === "init") {
      sahInit = true;
    } else if (obj.type === "assistant" && obj.message && Array.isArray(obj.message.content)) {
      for (const block of obj.message.content) {
        if (block && block.type === "text" && typeof block.text === "string") {
          antwortAkku += (antwortAkku ? "\n" : "") + block.text;
        }
      }
    } else if (obj.type === "result") {
      if (typeof obj.result === "string") ergebnisText = obj.result;
      if (typeof obj.total_cost_usd === "number") kostenUsd = obj.total_cost_usd;
    }
  }

  kind.stdout.on("data", (teil) => {
    restPuffer += teil.toString("utf8");
    const zeilen = restPuffer.split("\n");
    restPuffer = zeilen.pop();
    for (const zeile of zeilen) {
      verarbeiteAusgabeZeile(zeile.replace(/\r$/, ""));
    }
  });
  leiteStromAlsSse(kind.stderr, res, "fehler");

  function speichereVerlauf(code) {
    const jetzt = new Date().toISOString();
    const antwortText = ergebnisText || antwortAkku;
    // Frisch laden, damit parallele Metadaten-Aenderungen nicht verloren gehen.
    const frisch = ladeChat(chat.id) || chat;
    const nachrichten = Array.isArray(frisch.nachrichten) ? frisch.nachrichten.slice() : [];
    nachrichten.push({ rolle: "user", text: prompt, zeit: jetzt });
    nachrichten.push({
      rolle: "assistant",
      text: antwortText,
      zeit: new Date().toISOString(),
      modellId: modellId,
      kostenUsd: kostenUsd,
      exitCode: code === null ? 1 : code
    });
    frisch.nachrichten = nachrichten;
    if (!frisch.sessionGestartet && (sahInit || code === 0)) {
      frisch.sessionGestartet = true;
    }
    if (frisch.titelAuto !== false && (!frisch.titel || frisch.titel === "")) {
      frisch.titel = titelAusPrompt(prompt);
      frisch.titelAuto = true;
    }
    frisch.aktualisiert = jetzt;
    try {
      speichereChat(frisch);
    } catch (err) {
      console.error("Chat-Verlauf fuer " + chat.id + " nicht speicherbar:", err.message);
    }
  }

  let beendet = false;
  function beendeSauber(code) {
    if (beendet) return;
    beendet = true;
    const sauber = restPuffer.replace(/\r$/, "");
    if (sauber !== "") verarbeiteAusgabeZeile(sauber);
    restPuffer = "";
    laufendeChatSessions.delete(chat.id);
    speichereVerlauf(code);
    sendeSse(res, "ende", String(code === null ? 1 : code));
    if (!res.writableEnded) res.end();
  }

  kind.on("error", (err) => {
    sendeSse(res, "fehler", "Konnte claude nicht starten: " + err.message);
    beendeSauber(1);
  });
  kind.on("close", (code) => {
    beendeSauber(code);
  });

  // Bricht die Verbindung ab, den Prozessbaum beenden (Windows: taskkill).
  res.on("error", function () {});
  res.on("close", () => {
    if (kind.exitCode === null && !kind.killed) {
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", String(kind.pid), "/T", "/F"]).on("error", (err) => {
          console.error("taskkill fuer claude-Chat fehlgeschlagen:", err.message);
        });
      } else {
        kind.kill();
      }
    }
  });

  kind.stdin.on("error", (err) => {
    console.error("stdin-Fehler beim claude-Chat:", err.message);
  });
  kind.stdin.write(prompt);
  kind.stdin.end();
}

// --- Memory (globale Dauer-Instruktionen fuer jeden Chat) ---

const MEMORY_MAX_ZEICHEN = 20000;

function handleMemoryGet(res) {
  let text = "";
  try {
    if (fs.existsSync(MEMORY_DATEI)) text = fs.readFileSync(MEMORY_DATEI, "utf8");
  } catch (err) {
    return sendeFehler(res, 500, "Memory nicht lesbar: " + err.message);
  }
  return sendeJson(res, 200, { text: text });
}

async function handleMemorySpeichern(req, res) {
  const kopfFehler = pruefeClaudeRequestKopf(req);
  if (kopfFehler) return sendeFehler(res, kopfFehler.status, kopfFehler.text);
  const geparst = parseObjektBody(await leseBody(req));
  if (geparst.fehler) return sendeFehler(res, 400, geparst.fehler);
  const text = typeof geparst.wert.text === "string" ? geparst.wert.text : "";
  if (text.length > MEMORY_MAX_ZEICHEN) {
    return sendeFehler(res, 400, "Memory ist zu lang (max " + MEMORY_MAX_ZEICHEN + " Zeichen)");
  }
  try {
    if (text.trim() === "") {
      if (fs.existsSync(MEMORY_DATEI)) fs.unlinkSync(MEMORY_DATEI);
    } else {
      fs.writeFileSync(MEMORY_DATEI, text, "utf8");
    }
  } catch (err) {
    return sendeFehler(res, 500, "Memory nicht speicherbar: " + err.message);
  }
  return sendeJson(res, 200, { ok: true });
}

function handleMemoryRoute(req, res) {
  if (req.method === "GET") return handleMemoryGet(res);
  if (req.method === "PUT") return handleMemorySpeichern(req, res);
  return sendeFehler(res, 405, "Methode " + req.method + " hier nicht erlaubt");
}

function handleChatsRoute(req, res, teile) {
  const id = teile[2];
  const unterpfad = teile[3];

  if (!id) {
    if (req.method === "GET") return handleChatsListe(res);
    if (req.method === "POST") return handleChatErstellen(req, res);
    return sendeFehler(res, 405, "Methode " + req.method + " hier nicht erlaubt");
  }
  if (!unterpfad) {
    if (req.method === "GET") return handleChatEinzel(res, id);
    if (req.method === "PUT") return handleChatAendern(req, res, id);
    if (req.method === "DELETE") return handleChatLoeschen(res, id);
    return sendeFehler(res, 405, "Methode " + req.method + " hier nicht erlaubt");
  }
  if (unterpfad === "nachricht" && req.method === "POST") {
    return handleChatNachricht(req, res, id);
  }
  return sendeFehler(res, 404, "Unbekannter Chat-Pfad");
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
  "zentrale/data/einstellungen.json",
  "kunden/_sea/kunden-aus-sea.md"
];
let syncTimer = null;
let syncLaeuft = false;
let syncNochmal = false;

const STATUS_TEXT = {
  offen: "Noch nicht angefangen",
  in_arbeit: "In Bearbeitung",
  fertig: "Fertig"
};

// Macht einen Wert tabellensicher (keine Zeilenumbrueche, kein Pipe-Zeichen).
function einzeilig(wert) {
  return String(wert || "").replace(/\r?\n/g, " ").replace(/\|/g, "/").trim();
}

// Spiegelt die Kunden aus der App in eine gut sichtbare Datei im kunden-Ordner.
// Additiv: fasst die kuratierte kunden/UEBERSICHT.md NICHT an.
function spiegleKundenInOrdner(kunden) {
  try {
    const ordner = path.join(REPO_WURZEL, "kunden", "_sea");
    fs.mkdirSync(ordner, { recursive: true });
    const stand = new Date().toISOString().slice(0, 10);
    const zeilen = [];
    zeilen.push("# Kunden aus SEA (automatisch gespiegelt)");
    zeilen.push("");
    zeilen.push("> Automatisch aus zentrale/data/kunden.json erzeugt, bei jeder Aenderung in SEA.");
    zeilen.push("> Nicht von Hand bearbeiten. Kuratierte Registry bleibt kunden/UEBERSICHT.md.");
    zeilen.push("");
    zeilen.push("Stand: " + stand + " | Anzahl: " + kunden.length);
    zeilen.push("");
    zeilen.push("| Name | Branche | Status | Aktualisiert |");
    zeilen.push("|---|---|---|---|");
    for (const k of kunden) {
      const status = STATUS_TEXT[k.status] || einzeilig(k.status);
      zeilen.push("| " + einzeilig(k.name) + " | " + einzeilig(k.branche)
        + " | " + status + " | " + einzeilig(k.aktualisiert) + " |");
    }
    zeilen.push("");
    zeilen.push("## Notizen");
    for (const k of kunden) {
      zeilen.push("");
      zeilen.push("### " + einzeilig(k.name));
      zeilen.push((k.notizen || "").trim() || "(keine)");
    }
    zeilen.push("");
    fs.writeFileSync(path.join(ordner, "kunden-aus-sea.md"), zeilen.join("\n"), "utf8");
  } catch (err) {
    console.error("Kunden-Spiegelung fehlgeschlagen:", err.message);
  }
}

function planeDatenSync() {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(fuehreDatenSyncAus, SYNC_ENTPRELLUNG_MS);
}

// Ein einzelner git-Schritt. Loest nie aus, gibt {fehler, stdout, stderr} zurueck.
function execSchritt(befehl) {
  return new Promise((resolve) => {
    exec(befehl, { cwd: REPO_WURZEL, shell: true }, (fehler, stdout, stderr) => {
      resolve({ fehler: fehler, stdout: String(stdout || ""), stderr: String(stderr || "") });
    });
  });
}

// Robuster Auto-Sync: stagen, nur bei Aenderung committen, per Rebase die
// Remote-Commits integrieren (damit der Push nicht scheitert wenn origin voraus
// ist), dann pushen. Bei Rebase-Konflikt sauber abbrechen statt das Repo in einem
// halben Zustand zu lassen. Laeuft nie zweimal gleichzeitig.
async function fuehreDatenSyncAus() {
  syncTimer = null;
  if (syncLaeuft) { syncNochmal = true; return; }
  syncLaeuft = true;
  try {
    await execSchritt("git add " + SYNC_DATEI_PFADE.join(" "));
    // git diff --cached --quiet beendet mit Code 1, wenn es gestagte Aenderungen gibt.
    const gestaged = await execSchritt("git diff --cached --quiet");
    if (gestaged.fehler) {
      await execSchritt("git commit -m \"auto: Datenupdate aus SEA\"");
    }
    const pull = await execSchritt("git pull --rebase --autostash origin master");
    if (pull.fehler) {
      await execSchritt("git rebase --abort");
      console.error("Auto-Sync: Rebase-Konflikt, abgebrochen. Push uebersprungen, lokaler Commit bleibt erhalten.");
      return;
    }
    const push = await execSchritt("git push origin master");
    if (push.fehler) {
      const text = push.stdout + push.stderr + (push.fehler.message || "");
      if (!/everything up-to-date/i.test(text)) {
        console.error("Auto-Sync: Push fehlgeschlagen:", text.trim().slice(0, 300));
      }
    }
  } catch (err) {
    console.error("Auto-Sync Ausnahme:", err.message);
  } finally {
    syncLaeuft = false;
    if (syncNochmal) { syncNochmal = false; planeDatenSync(); }
  }
}

// ---------- Voller Sync per Knopf (committen, pullen, pushen) ----------

// Ein Knopfdruck in der App: alles stagen, nur bei Aenderung committen, origin
// per rebase integrieren, dann pushen. Bei Konflikt sauber abbrechen (nichts wird
// ueberschrieben). Antwortet immer mit HTTP 200; das Ergebnis steht im Body (ok).
async function syncRepoVoll() {
  const schritte = [];
  const merke = (name, r) => {
    schritte.push({ name, ok: !r.fehler, ausgabe: (r.stdout + r.stderr).trim().slice(0, 400) });
    return r;
  };
  const branchRoh = await execSchritt("git rev-parse --abbrev-ref HEAD");
  const branch = branchRoh.stdout.trim() || "master";

  merke("stagen", await execSchritt("git add -A"));

  let committet = false;
  const gestaged = await execSchritt("git diff --cached --quiet");
  if (gestaged.fehler) {
    const stand = new Date().toISOString().slice(0, 19).replace("T", " ");
    const commit = merke("committen", await execSchritt(
      "git commit -m \"manuell: Sync aus SEA (" + stand + ")\""));
    committet = !commit.fehler;
  }

  const pull = merke("pullen", await execSchritt("git pull --rebase --autostash origin " + branch));
  if (pull.fehler) {
    await execSchritt("git rebase --abort");
    return {
      ok: false, phase: "pullen", branch, committet,
      meldung: "Konflikt beim Pullen. Rebase sauber abgebrochen, nichts wurde ueberschrieben. Bitte die Kollision manuell klaeren.",
      schritte
    };
  }

  const push = merke("pushen", await execSchritt("git push origin " + branch));
  const pushText = (push.stdout + push.stderr + (push.fehler ? push.fehler.message : "")).toLowerCase();
  const pushOk = !push.fehler || /everything up-to-date|up to date/.test(pushText);

  const head = (await execSchritt("git rev-parse --short HEAD")).stdout.trim();
  const offen = (await execSchritt("git status --porcelain")).stdout.split("\n").filter(Boolean).length;

  return {
    ok: pushOk, branch, head, committet, offeneDateien: offen,
    meldung: pushOk
      ? (committet
          ? "Committet, gepullt und gepusht. Alles aktuell und sauber."
          : "Nichts Neues zu committen. Gepullt und gepusht. Alles aktuell.")
      : "Push fehlgeschlagen (origin evtl. nicht erreichbar). Aenderungen sind lokal committet.",
    schritte
  };
}

async function handleSync(req, res) {
  const kopfFehler = pruefeClaudeRequestKopf(req);
  if (kopfFehler) return sendeFehler(res, kopfFehler.status, kopfFehler.text);
  try {
    const ergebnis = await syncRepoVoll();
    return sendeJson(res, 200, ergebnis);
  } catch (err) {
    return sendeJson(res, 200, { ok: false, meldung: "Sync-Ausnahme: " + err.message });
  }
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
  // no-cache: der Browser holt nach jeder Aenderung den frischen Stand (lokales
  // Werkzeug, winzige Dateien) statt veraltetes JS/CSS aus dem Cache zu zeigen.
  res.writeHead(200, { "Content-Type": typ, "Cache-Control": "no-cache" });
  res.end(fs.readFileSync(vollPfad));
}

// ---------- Nutzer + persoenliches Brain ----------

// Aktiver Nutzer aus der Zustands-Datei; null wenn keiner eingeloggt ist.
function ladeAktivenUser() {
  try {
    if (fs.existsSync(USER_STATE_DATEI)) {
      const zustand = JSON.parse(fs.readFileSync(USER_STATE_DATEI, "utf8"));
      if (zustand && NUTZER[zustand.id]) return NUTZER[zustand.id];
    }
  } catch (err) {
    console.error("Nutzer-Zustand nicht lesbar:", err.message);
  }
  return null;
}

// Setzt den aktiven Nutzer (oder loggt aus bei id === null) und baut die
// System-Prompt-Datei neu. Gibt den Nutzer (oder null) zurueck.
function setzeAktivenUser(id) {
  if (id === null) {
    try { if (fs.existsSync(USER_STATE_DATEI)) fs.unlinkSync(USER_STATE_DATEI); } catch (err) {
      console.error("Nutzer-Zustand nicht loeschbar:", err.message);
    }
    schreibeSystemPromptDatei();
    return null;
  }
  const user = NUTZER[id];
  if (!user) return null;
  fs.writeFileSync(USER_STATE_DATEI, JSON.stringify({ id: user.id, zeit: new Date().toISOString() }, null, 2), "utf8");
  schreibeSystemPromptDatei();
  return user;
}

// Liest die .md-Dateien im persoenlichen Brain-Ordner und macht daraus einen
// System-Prompt-Block. Leer, wenn der Ordner (noch) fehlt.
function baueUserBrainText(user) {
  const dir = path.join(BRAIN_ORDNER, user.brainOrdner);
  const teile = [
    "# Aktiver Nutzer dieser Sitzung: " + user.name + " (" + user.person + ")",
    "Du sprichst gerade mit " + user.name + ". Passe Ansprache, Ton und Vorschlaege an",
    "dieses persoenliche Profil an. Das Folgende ist das persoenliche Brain von " + user.name + ":",
    ""
  ];
  try {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      const dateien = fs.readdirSync(dir).filter((n) => n.toLowerCase().endsWith(".md")).sort();
      for (const datei of dateien) {
        const inhalt = fs.readFileSync(path.join(dir, datei), "utf8").trim();
        if (inhalt !== "") {
          teile.push("## " + user.brainOrdner + "/" + datei, inhalt, "");
        }
      }
    }
  } catch (err) {
    console.error("Brain-Ordner " + dir + " nicht lesbar:", err.message);
  }
  return teile.join("\n").trim();
}

// Schreibt die kombinierte System-Prompt-Datei (persoenliches Brain + gemeinsames
// Gedaechtnis) und gibt ihren Pfad zurueck, oder null wenn nichts anzuhaengen ist.
// Diese Datei wird an JEDEN Claude-Aufruf (Chat, Run, Jobs) angehaengt.
function schreibeSystemPromptDatei() {
  const bloecke = [];
  const user = ladeAktivenUser();
  if (user) {
    const brain = baueUserBrainText(user);
    if (brain !== "") bloecke.push(brain);
  }
  try {
    if (fs.existsSync(MEMORY_DATEI)) {
      const memo = fs.readFileSync(MEMORY_DATEI, "utf8").trim();
      if (memo !== "") bloecke.push("# Gemeinsames Gedaechtnis\n" + memo);
    }
  } catch (err) {
    console.error("Memory-Datei nicht lesbar:", err.message);
  }
  const inhalt = bloecke.join("\n\n").trim();
  if (inhalt === "") {
    try { if (fs.existsSync(SYSTEM_PROMPT_DATEI)) fs.unlinkSync(SYSTEM_PROMPT_DATEI); } catch (err) {
      console.error("System-Prompt-Datei nicht loeschbar:", err.message);
    }
    return null;
  }
  fs.writeFileSync(SYSTEM_PROMPT_DATEI, inhalt, "utf8");
  return SYSTEM_PROMPT_DATEI;
}

// Haengt die frisch geschriebene System-Prompt-Datei an ein Argument-Array an.
function haengeSystemPromptAn(argumente) {
  const pfad = schreibeSystemPromptDatei();
  if (pfad) argumente.push("--append-system-prompt-file", pfad);
}

async function handleNutzerRoute(req, res, teile) {
  const unter = teile[2];
  if (unter === "status" && req.method === "GET") {
    const user = ladeAktivenUser();
    return sendeJson(res, 200, {
      aktiv: user ? { id: user.id, name: user.name, person: user.person } : null,
      nutzer: Object.values(NUTZER).map((u) => ({ id: u.id, name: u.name, person: u.person }))
    });
  }
  if (unter === "login" && req.method === "POST") {
    const geparst = parseObjektBody(await leseBody(req));
    if (geparst.fehler) return sendeFehler(res, 400, geparst.fehler);
    const id = typeof geparst.wert.id === "string" ? geparst.wert.id.trim() : "";
    if (!NUTZER[id]) return sendeFehler(res, 400, "Unbekannter Nutzer: " + id);
    const user = setzeAktivenUser(id);
    return sendeJson(res, 200, { aktiv: { id: user.id, name: user.name, person: user.person } });
  }
  if (unter === "logout" && req.method === "POST") {
    setzeAktivenUser(null);
    return sendeJson(res, 200, { aktiv: null });
  }
  return sendeFehler(res, 404, "Unbekannter Nutzer-Pfad");
}

// ---------- Router ----------

async function routeApi(req, res, pfadName) {
  const teile = pfadName.split("/").filter(Boolean);
  const bereich = teile[1];
  const id = teile[2];

  if (bereich === "nutzer") {
    return handleNutzerRoute(req, res, teile);
  }

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
  if (bereich === "konten") {
    return handleKontenRoute(req, res, teile);
  }
  if (bereich === "chats") {
    return handleChatsRoute(req, res, teile);
  }
  if (bereich === "memory" && teile.length === 2) {
    return handleMemoryRoute(req, res);
  }
  if (bereich === "sync" && teile.length === 2 && req.method === "POST") {
    return handleSync(req, res);
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
stelleChatOrdnerSicher();
bereinigeHaengendeJobs();
server.listen(PORT, HOST, () => {
  console.log("SEA laeuft auf http://127.0.0.1:8020");
});
