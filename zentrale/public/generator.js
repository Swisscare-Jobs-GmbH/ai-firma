// generator.js: Generator-View der SEA Plattform. Das Herzstueck.
// Karten (Website, CRM, Automatisierung, Eigenes Projekt) oeffnen je einen kurzen
// Fragebogen. Beim Absenden entsteht ein ausfuehrlicher Build-Prompt, der als
// Hintergrund-Job (POST /api/jobs) laeuft. Die Builds-Liste zeigt den Live-Log
// (Polling GET /api/jobs/:id/log?von=), Status und einen Stopp-Knopf.
// Vanilla JS, kein Build. Nutzt window.api, window.toast, window.escapeHtml,
// window.infoIcon, window.modelle, window.modellEmpfehlung, window.formatiereClaudeZeile.

(function () {
  "use strict";

  // ---------- Konstanten ----------

  const PROJEKT_BASIS = "C:/Projects/AIWorks/projekte";
  const STANDARD_MODELL_ID = "claude-opus-4-8"; // Firmen-Regel: Bau laeuft auf Opus.
  const POLL_MS = 1500;
  const ARTEN_REIHENFOLGE = ["website", "crm", "automation", "custom"];

  const STATUS_LABEL = {
    laeuft: "Läuft",
    fertig: "Fertig",
    fehler: "Fehler",
    abgebrochen: "Abgebrochen"
  };

  const ART_LABEL = {
    website: "Website",
    crm: "CRM",
    automation: "Automatisierung",
    custom: "Eigenes Projekt"
  };

  const GENERATOR_INFO =
    "Wähle eine Bau-Option. Ein kurzer Fragebogen erfasst alles Nötige, danach baut " +
    "Claude das Projekt im Hintergrund. Der Fortschritt erscheint unten unter Builds.";
  const BUILDS_INFO =
    "Laufende und fertige Builds. Das Log aktualisiert sich live. Ergebnisse liegen " +
    "als lokaler Ordner unter C:/Projects/AIWorks/projekte.";
  const MODELL_INFO =
    "Standard ist Opus (Firmen-Regel: Bau läuft auf Opus 4.8). Auto wählt automatisch " +
    "anhand der Regeln aus den Einstellungen.";
  const ZIEL_INFO =
    "Das Projekt entsteht als lokaler Ordner. Es wird kein Git-Repo angelegt und nichts " +
    "hochgeladen (Firmenregel).";
  const FLAG_INFO =
    "claude ändert Dateien nur mit einem Permission-Flag. Empfehlung: " +
    "--permission-mode acceptEdits in den Einstellungen bei Zusatz-Flags eintragen. " +
    "Ohne Flag beschreibt Claude nur, was es tun würde.";

  // Gemeinsame Bau-Vorgaben, haengen an jeden Build-Prompt.
  const VORGABEN = [
    "Erstelle alle nötigen Dateien direkt im aktuellen Ordner, sodass das Ergebnis sofort lauffähig ist.",
    "Schreibe sauberen, wartbaren Code und ein modernes, klar bedienbares Design.",
    "Deutsche Texte mit echten Umlauten und Schweizer ss (kein Eszett).",
    "Lege kein neues Git-Repo an und lade nichts hoch (der Projektordner bleibt lokal).",
    "Fasse am Ende kurz zusammen, was erstellt wurde und wie man es startet."
  ];

  // Pflicht-Feld fuer jede Art: der Projektname liefert den Ordner-Slug.
  const PROJEKT_FELD = {
    key: "projektname",
    label: "Projektname",
    typ: "text",
    pflicht: true,
    platzhalter: "z.B. Finelli Website"
  };

  // Fragebogen je Art. typ: text | textarea | kunde. Der Kunde wird aus /api/kunden befuellt.
  const ARTEN = {
    website: {
      icon: "🌐",
      titel: "Website erstellen",
      kurz: "Auftritt und Seiten.",
      info: "Erzeugt eine lauffähige Website (mehrere Seiten, modernes Design) im " +
        "Projektordner. Der Fragebogen klärt Ziel, Seiten, Stil und Farben.",
      einleitung: "Baue eine vollständige, lauffähige Website als Projekt im aktuellen Ordner.",
      felder: [
        { key: "kunde", label: "Für welchen Kunden", typ: "kunde" },
        { key: "branche", label: "Branche", typ: "text", platzhalter: "z.B. Streetwear, Orthopädie" },
        { key: "ziel", label: "Ziel der Website", typ: "textarea", platzhalter: "Was soll die Seite erreichen?" },
        { key: "seiten", label: "Gewünschte Seiten", typ: "text", standard: "Start, Über uns, Leistungen, Kontakt" },
        { key: "stil", label: "Stil / Vibe", typ: "text", platzhalter: "z.B. modern, minimalistisch, verspielt" },
        { key: "farben", label: "Farben", typ: "text", platzhalter: "z.B. Violett und Weiss" },
        { key: "sprache", label: "Sprache", typ: "text", standard: "Deutsch (Schweiz)" },
        { key: "besonderheiten", label: "Besonderheiten", typ: "textarea", platzhalter: "Wünsche, Funktionen, Beispiele" }
      ]
    },
    crm: {
      icon: "🗂️",
      titel: "CRM erstellen",
      kurz: "Daten und Abläufe verwalten.",
      info: "Erzeugt ein einfaches CRM (Kundendaten, Status, Ansichten). Der Fragebogen " +
        "klärt welche Daten, welche Abläufe und wer es nutzt.",
      einleitung: "Baue ein einfaches, lauffähiges CRM als Projekt im aktuellen Ordner.",
      felder: [
        { key: "kunde", label: "Für welchen Kunden", typ: "kunde" },
        { key: "daten", label: "Welche Daten werden verwaltet", typ: "textarea", platzhalter: "z.B. Kontakte, Bestellungen, Termine" },
        { key: "ablaeufe", label: "Abläufe und Status", typ: "textarea", platzhalter: "z.B. offen, in Arbeit, erledigt" },
        { key: "nutzer", label: "Wer nutzt es", typ: "text", platzhalter: "z.B. 2 Mitarbeitende im Büro" },
        { key: "ansichten", label: "Gewünschte Ansichten", typ: "text", platzhalter: "z.B. Liste, Board, Detail" },
        { key: "integrationen", label: "Integrationen (optional)", typ: "text", platzhalter: "z.B. E-Mail, Kalender" }
      ]
    },
    automation: {
      icon: "⚙️",
      titel: "Automatisierung erstellen",
      kurz: "Abläufe automatisieren.",
      info: "Erzeugt ein Skript oder kleines Programm, das eine wiederkehrende Aufgabe " +
        "automatisiert. Der Fragebogen klärt Auslöser, Schritte und Ergebnis.",
      einleitung: "Baue eine lauffähige Automatisierung (Skript oder kleines Programm) im aktuellen Ordner.",
      felder: [
        { key: "kunde", label: "Für welchen Kunden", typ: "kunde" },
        { key: "ablauf", label: "Welcher Ablauf soll automatisiert werden", typ: "textarea", pflicht: true, platzhalter: "Beschreibe den Ablauf" },
        { key: "ausloeser", label: "Auslöser", typ: "text", platzhalter: "z.B. neue E-Mail, jeden Morgen um 8 Uhr" },
        { key: "schritte", label: "Schritte", typ: "textarea", platzhalter: "Was soll nacheinander passieren?" },
        { key: "ergebnis", label: "Ergebnis", typ: "text", platzhalter: "Was kommt am Ende heraus?" }
      ]
    },
    custom: {
      icon: "🧩",
      titel: "Eigenes Projekt",
      kurz: "Frei beschreiben.",
      info: "Für alles andere: beschreibe frei, was gebaut werden soll. Claude baut es " +
        "als lauffähiges Projekt im Ordner.",
      einleitung: "Baue das folgende Projekt als lauffähiges Ergebnis im aktuellen Ordner.",
      felder: [
        { key: "beschreibung", label: "Was soll gebaut werden", typ: "textarea", pflicht: true, platzhalter: "Beschreibe das Projekt möglichst konkret" }
      ]
    }
  };

  // ---------- Zustand ----------

  let kundenListe = [];
  let jobs = [];
  const jobUi = new Map(); // jobId -> { logEl, statusEl, stopBtn, toggleBtn, offset, rest, geladen, offen, inFlight }
  const polls = new Map(); // jobId -> Intervall-Timer

  // ---------- Hilfen ----------

  function infoChip(text) {
    return typeof window.infoIcon === "function" ? window.infoIcon(text) : "";
  }

  function aktuelleFlags() {
    return ((window.einstellungen && window.einstellungen.zusatzFlags) || "").trim();
  }

  // Ohne ein Permission-Flag schreibt Claude keine Dateien, der Build endet dann
  // scheinbar erfolgreich mit leerem Ordner. Erkennt die gaengigen Freigabe-Flags.
  function hatPermissionFlag() {
    const flags = aktuelleFlags();
    return /--permission-mode\b/.test(flags) || /--dangerously-skip-permissions\b/.test(flags);
  }

  function artLabel(art) {
    return ART_LABEL[art] || "Projekt";
  }

  // Wandelt den Projektnamen in einen sicheren Ordner-Slug.
  function baueSlug(name) {
    const ersatz = { "ä": "ae", "ö": "oe", "ü": "ue", "\u00df": "ss" };
    let s = String(name || "").trim().toLowerCase();
    s = s.replace(/[äöü\u00df]/g, function (ch) { return ersatz[ch] || ch; });
    s = s.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return s || "projekt";
  }

  function formatiereZeit(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString("de-CH", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  }

  // ---------- CSS ----------

  function cssEinfuegen() {
    if (document.getElementById("css-generator")) return;
    const style = document.createElement("style");
    style.id = "css-generator";
    style.textContent = `
      .gen-karten { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin-bottom: 30px; }
      .gen-karte { position: relative; display: flex; flex-direction: column; gap: 8px; padding: 20px; cursor: pointer; border-radius: 16px; background: var(--panel); border: 1px solid var(--border); overflow: hidden; transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease; }
      .gen-karte::after { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(100deg, var(--akzent), var(--akzent-hell)); opacity: 0.7; }
      .gen-karte:hover { transform: translateY(-3px); border-color: var(--akzent); box-shadow: 0 12px 30px rgba(139, 61, 255, 0.28); }
      .gen-karte:focus-visible { outline: none; border-color: var(--akzent); box-shadow: 0 0 0 3px var(--akzent-weich), 0 12px 30px rgba(139, 61, 255, 0.28); }
      .gen-karte-icon { font-size: 30px; line-height: 1; }
      .gen-karte-titel { font-size: 17px; font-weight: 700; }
      .gen-karte-kurz { font-size: 13px; color: var(--muted); }

      .gen-builds-kopf { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
      .gen-builds-kopf h2 { margin: 0; font-size: 18px; font-weight: 700; }
      .gen-builds { display: flex; flex-direction: column; gap: 12px; }

      .build-karte { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 14px 16px; }
      .build-kopf { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
      .build-icon { font-size: 20px; }
      .build-name { font-weight: 700; }
      .build-fueller { flex: 1; }
      .build-zeit { color: var(--muted); font-size: 12px; }
      .build-meta { color: var(--muted); font-size: 12px; margin: 8px 0; word-break: break-all; }

      .build-status { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; border: 1px solid var(--border); }
      .build-status::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
      .status-laeuft { color: var(--akzent-hell); border-color: var(--akzent); }
      .status-laeuft::before { animation: gen-puls 1.1s ease-in-out infinite; }
      .status-fertig { color: var(--gruen); border-color: var(--gruen); }
      .status-fehler { color: var(--rot); border-color: var(--rot); }
      .status-abgebrochen { color: var(--muted); }
      @keyframes gen-puls { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }

      .build-log { margin-top: 10px; max-height: 240px; overflow-y: auto; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; font-family: "Consolas", ui-monospace, monospace; font-size: 12.5px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
      .build-log[hidden] { display: none; }
      .log-zeile { color: var(--text); }
      .log-zeile.log-fehler { color: var(--rot); }
      .log-leer { color: var(--muted); }

      .gen-modal .gen-felder { display: flex; flex-direction: column; gap: 12px; }
      .gen-modal .gen-felder label { display: block; font-size: 13px; color: var(--muted); margin-bottom: 4px; }
      .gen-modal .eingabe { width: 100%; }
      .gen-optionen { margin-top: 16px; display: flex; flex-direction: column; gap: 10px; }
      .gen-optionen label { display: block; font-size: 13px; color: var(--muted); margin-bottom: 4px; }
      .gen-ziel { font-size: 12.5px; color: var(--muted); }
      .gen-ziel code { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 2px 6px; color: var(--text); word-break: break-all; }
      .gen-flags { font-size: 12.5px; padding: 8px 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--panel-2); }
      .gen-flags-warn { border-color: var(--gelb); color: var(--gelb); }
      .gen-modal .modal-aktionen { display: flex; gap: 8px; margin-top: 20px; }
      .gen-modal .modal-fueller { flex: 1; }
    `;
    document.head.appendChild(style);
  }

  // ---------- Karten (Bau-Optionen) ----------

  function karteHtml(art) {
    const conf = ARTEN[art];
    return '<div class="karte gen-karte" data-art="' + art + '" tabindex="0" role="button" aria-label="' +
      window.escapeHtml(conf.titel) + '">' +
      '<span class="gen-karte-icon" aria-hidden="true">' + conf.icon + "</span>" +
      '<span class="gen-karte-titel">' + window.escapeHtml(conf.titel) + "</span>" +
      '<span class="gen-karte-kurz">' + window.escapeHtml(conf.kurz) + " " + infoChip(conf.info) + "</span>" +
      "</div>";
  }

  // ---------- Fragebogen-Modal ----------

  function kundenOptionenHtml() {
    const opts = ['<option value="">(kein Kunde)</option>'];
    for (const k of kundenListe) {
      opts.push('<option value="' + window.escapeHtml(k.id) + '">' + window.escapeHtml(k.name) + "</option>");
    }
    return opts.join("");
  }

  function feldHtml(feld) {
    const id = "gen-feld-" + feld.key;
    const label = window.escapeHtml(feld.label) + (feld.pflicht ? " (Pflicht)" : "");
    if (feld.typ === "kunde") {
      return '<div><label for="' + id + '">' + label + "</label>" +
        '<select class="eingabe" id="' + id + '">' + kundenOptionenHtml() + "</select></div>";
    }
    const platz = feld.platzhalter ? ' placeholder="' + window.escapeHtml(feld.platzhalter) + '"' : "";
    const standard = feld.standard ? window.escapeHtml(feld.standard) : "";
    if (feld.typ === "textarea") {
      return '<div><label for="' + id + '">' + label + "</label>" +
        '<textarea class="eingabe" id="' + id + '" rows="3"' + platz + ">" + standard + "</textarea></div>";
    }
    return '<div><label for="' + id + '">' + label + "</label>" +
      '<input class="eingabe" id="' + id + '"' + platz + ' value="' + standard + '"></div>';
  }

  function modellSelectHtml() {
    const opts = ['<option value="">Auto (Empfehlung)</option>'];
    for (const m of (window.modelle || [])) {
      const sel = m.id === STANDARD_MODELL_ID ? " selected" : "";
      opts.push('<option value="' + window.escapeHtml(m.id) + '"' + sel + ">" +
        window.escapeHtml(m.name) + " (" + "$".repeat(m.kosten) + ")</option>");
    }
    return '<select class="eingabe" id="gen-modell">' + opts.join("") + "</select>";
  }

  function flagsZeileHtml() {
    const flags = aktuelleFlags();
    if (hatPermissionFlag()) {
      return '<div class="gen-flags">Zusatz-Flags aktiv: ' + window.escapeHtml(flags) + " " + infoChip(FLAG_INFO) + "</div>";
    }
    return '<div class="gen-flags gen-flags-warn">Kein Permission-Flag gesetzt. Ohne z.B. ' +
      "--permission-mode acceptEdits (Einstellungen) erstellt Claude keine Dateien, " +
      "der Build lässt sich so nicht starten. " + infoChip(FLAG_INFO) + "</div>";
  }

  function modalHtml(art) {
    const conf = ARTEN[art];
    const felder = [PROJEKT_FELD].concat(conf.felder);
    const felderHtml = felder.map(feldHtml).join("");
    return (
      '<div class="modal gen-modal" role="dialog" aria-modal="true" aria-labelledby="gen-modal-titel">' +
      '<h2 id="gen-modal-titel">' + conf.icon + " " + window.escapeHtml(conf.titel) + "</h2>" +
      '<div class="gen-felder">' + felderHtml + "</div>" +
      '<div class="gen-optionen">' +
        "<div><label>Modell " + infoChip(MODELL_INFO) + "</label>" + modellSelectHtml() + "</div>" +
        '<div class="gen-ziel">Zielordner: <code>' + window.escapeHtml(PROJEKT_BASIS) +
          '/<span id="gen-slug">projekt</span></code> ' + infoChip(ZIEL_INFO) + "</div>" +
        flagsZeileHtml() +
      "</div>" +
      '<div class="modal-aktionen"><span class="modal-fueller"></span>' +
        '<button class="btn" id="gen-abbrechen" type="button">Abbrechen</button>' +
        '<button class="btn btn-primaer" id="gen-starten" type="button">Build starten</button>' +
      "</div></div>"
    );
  }

  function verdrahteModalFelder(hintergrund) {
    const nameEl = hintergrund.querySelector("#gen-feld-projektname");
    const slugEl = hintergrund.querySelector("#gen-slug");
    if (nameEl && slugEl) {
      nameEl.addEventListener("input", function () {
        slugEl.textContent = baueSlug(nameEl.value);
      });
    }
    // Bei Kunden-Auswahl die Branche vorbefuellen, wenn ein Branchen-Feld existiert.
    const kundeEl = hintergrund.querySelector("#gen-feld-kunde");
    const brancheEl = hintergrund.querySelector("#gen-feld-branche");
    if (kundeEl && brancheEl) {
      kundeEl.addEventListener("change", function () {
        const k = kundenListe.find(function (x) { return x.id === kundeEl.value; });
        if (k && k.branche) brancheEl.value = k.branche;
      });
    }
  }

  function modalOeffnen(art) {
    if (!ARTEN[art]) return;
    const vorherFokus = document.activeElement; // Fokus beim Schliessen zurueckgeben
    const hintergrund = document.createElement("div");
    hintergrund.className = "modal-hintergrund";
    hintergrund.innerHTML = modalHtml(art);
    document.body.appendChild(hintergrund);
    const modalEl = hintergrund.querySelector(".modal");

    // Sichtbare, fokussierbare Elemente im Modal (fuer die Fokus-Falle).
    function fokusierbare() {
      const auswahl = 'a[href], button:not([disabled]), input:not([disabled]), ' +
        'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
      return Array.prototype.slice.call(modalEl.querySelectorAll(auswahl))
        .filter(function (el) { return el.offsetParent !== null; });
    }

    function schliessen() {
      document.removeEventListener("keydown", aufTaste);
      hintergrund.remove();
      if (vorherFokus && typeof vorherFokus.focus === "function") vorherFokus.focus();
    }
    function aufTaste(e) {
      if (e.key === "Escape") { schliessen(); return; }
      if (e.key !== "Tab") return;
      // Tab/Shift+Tab innerhalb des Modals halten (Fokus-Falle).
      const liste = fokusierbare();
      if (liste.length === 0) { e.preventDefault(); return; }
      const erster = liste[0];
      const letzter = liste[liste.length - 1];
      const aktiv = document.activeElement;
      if (!modalEl.contains(aktiv)) {
        e.preventDefault();
        erster.focus();
      } else if (e.shiftKey && aktiv === erster) {
        e.preventDefault();
        letzter.focus();
      } else if (!e.shiftKey && aktiv === letzter) {
        e.preventDefault();
        erster.focus();
      }
    }
    document.addEventListener("keydown", aufTaste);

    hintergrund.addEventListener("click", function (e) {
      if (e.target === hintergrund) schliessen();
    });
    hintergrund.querySelector("#gen-abbrechen").addEventListener("click", schliessen);
    hintergrund.querySelector("#gen-starten").addEventListener("click", function () {
      buildStarten(hintergrund, art, schliessen);
    });

    verdrahteModalFelder(hintergrund);
    const erstes = hintergrund.querySelector("#gen-feld-projektname");
    if (erstes) erstes.focus();
  }

  // ---------- Build-Prompt und Start ----------

  function baueBauPrompt(art, antworten, kundeName) {
    const conf = ARTEN[art];
    const zeilen = [conf.einleitung, ""];
    zeilen.push("Projekt: " + antworten.projektname);
    if (kundeName) zeilen.push("Kunde / Firma: " + kundeName);
    zeilen.push("", "Anforderungen:");
    let hatAnforderung = false;
    for (const feld of conf.felder) {
      if (feld.typ === "kunde") continue;
      const wert = (antworten[feld.key] || "").trim();
      if (wert) {
        zeilen.push("- " + feld.label + ": " + wert);
        hatAnforderung = true;
      }
    }
    if (!hatAnforderung) {
      zeilen.push("- Keine weiteren Angaben, bitte sinnvolle Annahmen treffen.");
    }
    zeilen.push("", "Vorgaben:");
    for (const vg of VORGABEN) zeilen.push("- " + vg);
    return zeilen.join("\n");
  }

  function sammleAntworten(hintergrund, felder) {
    const antworten = {};
    let kundeName = "";
    for (const feld of felder) {
      const el = hintergrund.querySelector("#gen-feld-" + feld.key);
      if (!el) continue;
      if (feld.typ === "kunde") {
        const k = kundenListe.find(function (x) { return x.id === el.value; });
        kundeName = k ? k.name : "";
      } else {
        antworten[feld.key] = el.value.trim();
      }
    }
    return { antworten: antworten, kundeName: kundeName };
  }

  // Prueft die Pflichtfelder. Fokussiert das erste leere und meldet es. Gibt true zurueck, wenn alles ok ist.
  function pflichtOk(hintergrund, felder, antworten, kundeName) {
    for (const feld of felder) {
      if (!feld.pflicht) continue;
      const wert = feld.typ === "kunde" ? kundeName : (antworten[feld.key] || "");
      if (!wert) {
        window.toast(feld.label + " ist ein Pflichtfeld", "fehler");
        const el = hintergrund.querySelector("#gen-feld-" + feld.key);
        if (el) el.focus();
        return false;
      }
    }
    return true;
  }

  function ermittleModellId(hintergrund, prompt) {
    const select = hintergrund.querySelector("#gen-modell");
    const wert = select ? select.value : STANDARD_MODELL_ID;
    if (wert) return wert;
    const empf = window.modellEmpfehlung(prompt);
    window.toast("Modell automatisch gewählt: " + empf.name, "ok");
    return empf.modellId;
  }

  async function buildStarten(hintergrund, art, schliessen) {
    const conf = ARTEN[art];
    const felder = [PROJEKT_FELD].concat(conf.felder);
    const { antworten, kundeName } = sammleAntworten(hintergrund, felder);
    if (!pflichtOk(hintergrund, felder, antworten, kundeName)) return;

    // Ohne Permission-Flag wuerde der Build ohne eine einzige Datei als "Fertig"
    // enden. Hart blockieren und auf die Einstellungen verweisen, statt Erfolg
    // vorzutaeuschen.
    if (!hatPermissionFlag()) {
      window.toast(
        "Kein Permission-Flag gesetzt. Trage z.B. --permission-mode acceptEdits " +
        "unter Einstellungen (Zusatz-Flags) ein, sonst erstellt Claude keine Dateien.",
        "fehler"
      );
      return;
    }

    const slug = baueSlug(antworten.projektname);
    const cwd = PROJEKT_BASIS + "/" + slug;
    const prompt = baueBauPrompt(art, antworten, kundeName);
    const modellId = ermittleModellId(hintergrund, prompt);

    const startBtn = hintergrund.querySelector("#gen-starten");
    if (startBtn) {
      startBtn.disabled = true;
      startBtn.textContent = "Startet ...";
    }

    try {
      const job = await window.api.post("/api/jobs", {
        art: art,
        name: antworten.projektname,
        prompt: prompt,
        modellId: modellId,
        cwd: cwd,
        zusatzFlags: aktuelleFlags()
      });
      window.toast("Build gestartet: " + (job.name || job.id), "ok");
      schliessen();
      jobs = [job].concat(jobs);
      buildsRendern();
    } catch (fehler) {
      window.toast("Build konnte nicht gestartet werden: " + fehler.message, "fehler");
      if (startBtn) {
        startBtn.disabled = false;
        startBtn.textContent = "Build starten";
      }
    }
  }

  // ---------- Builds-Liste und Live-Log ----------

  function statusAnzeigeSetzen(jobId, status, exitCode) {
    const ui = jobUi.get(jobId);
    if (!ui) return;
    ui.statusEl.className = "build-status status-" + status;
    ui.statusEl.textContent = STATUS_LABEL[status] || status;
    jobs = jobs.map(function (j) {
      return j.id === jobId ? Object.assign({}, j, { status: status, exitCode: exitCode }) : j;
    });
    if (status !== "laeuft" && ui.stopBtn) ui.stopBtn.hidden = true;
  }

  // Macht aus einer rohen Logzeile Anzeige-Text. JSON-Zeilen laufen durch
  // formatiereClaudeZeile (null = ueberspringen), rohe Zeilen werden direkt gezeigt.
  function verarbeiteLogZeile(roh) {
    const zeile = roh.replace(/\r$/, "");
    if (zeile.trim() === "") return null;
    let obj = null;
    try {
      obj = JSON.parse(zeile);
    } catch (e) {
      obj = null;
    }
    if (obj && typeof obj === "object") {
      const formatiert = window.formatiereClaudeZeile(obj);
      if (formatiert === null || formatiert === undefined) return null;
      return { text: String(formatiert), fehler: false };
    }
    return { text: zeile, fehler: zeile.indexOf("[Fehler]") === 0 };
  }

  function logTextAnhaengen(ui, text) {
    ui.rest += text;
    const zeilen = ui.rest.split("\n");
    ui.rest = zeilen.pop(); // moeglicher unvollstaendiger Rest bis zum naechsten Poll
    for (const roh of zeilen) {
      const aufbereitet = verarbeiteLogZeile(roh);
      if (!aufbereitet) continue;
      const leerEl = ui.logEl.querySelector(".log-leer");
      if (leerEl) leerEl.remove();
      const div = document.createElement("div");
      div.className = "log-zeile" + (aufbereitet.fehler ? " log-fehler" : "");
      div.textContent = aufbereitet.text;
      ui.logEl.appendChild(div);
    }
    ui.logEl.scrollTop = ui.logEl.scrollHeight;
  }

  // Holt neue Log-Bytes ab dem gemerkten Offset und zeigt sie an. Liefert den Status zurueck.
  async function holeUndZeigeLog(jobId) {
    const ui = jobUi.get(jobId);
    if (!ui) return null;
    // Ansicht verlassen: das Log-Element ist nicht mehr im DOM, dann Poll beenden.
    if (ui.logEl && !ui.logEl.isConnected) {
      stoppePoll(jobId);
      return null;
    }
    let antwort;
    try {
      antwort = await window.api.get("/api/jobs/" + jobId + "/log?von=" + ui.offset);
    } catch (fehler) {
      // Voruebergehender Netzfehler waehrend eines laufenden Builds: still weiterpollen.
      return null;
    }
    if (typeof antwort.laenge === "number") ui.offset = antwort.laenge;
    if (antwort.text) logTextAnhaengen(ui, antwort.text);
    statusAnzeigeSetzen(jobId, antwort.status, antwort.exitCode);
    if (ui.logEl.childElementCount === 0 && antwort.status !== "laeuft") {
      const leer = document.createElement("div");
      leer.className = "log-leer";
      leer.textContent = "Keine Ausgabe.";
      ui.logEl.appendChild(leer);
    }
    return antwort.status;
  }

  function starttePoll(jobId) {
    stoppePoll(jobId);
    pollTick(jobId);
    const timer = setInterval(function () { pollTick(jobId); }, POLL_MS);
    polls.set(jobId, timer);
  }

  async function pollTick(jobId) {
    const ui = jobUi.get(jobId);
    if (!ui || ui.inFlight) return; // kein ueberlappendes Nachladen
    ui.inFlight = true;
    try {
      const status = await holeUndZeigeLog(jobId);
      if (status && status !== "laeuft") {
        stoppePoll(jobId);
        meldeBuildEnde(jobId, status);
      }
    } finally {
      ui.inFlight = false;
    }
  }

  function stoppePoll(jobId) {
    const timer = polls.get(jobId);
    if (timer !== undefined) {
      clearInterval(timer);
      polls.delete(jobId);
    }
  }

  function stoppeAllePolls() {
    polls.forEach(function (timer) { clearInterval(timer); });
    polls.clear();
  }

  function meldeBuildEnde(jobId, status) {
    const job = jobs.find(function (j) { return j.id === jobId; });
    const name = job ? (job.name || jobId) : jobId;
    if (status === "fertig") window.toast("Build fertig: " + name, "ok");
    else if (status === "fehler") window.toast("Build fehlgeschlagen: " + name, "fehler");
  }

  async function buildStoppen(jobId) {
    const ui = jobUi.get(jobId);
    if (ui && ui.stopBtn) ui.stopBtn.disabled = true;
    try {
      await window.api.post("/api/jobs/" + jobId + "/stop");
      stoppePoll(jobId);
      statusAnzeigeSetzen(jobId, "abgebrochen", null);
      window.toast("Build gestoppt", "ok");
      holeUndZeigeLog(jobId); // Endstand des Logs nachziehen
    } catch (fehler) {
      window.toast("Stoppen fehlgeschlagen: " + fehler.message, "fehler");
      if (ui && ui.stopBtn) ui.stopBtn.disabled = false;
    }
  }

  function baueBuildKarte(job) {
    const laeuft = job.status === "laeuft";
    const karte = document.createElement("div");
    karte.className = "build-karte";
    karte.dataset.id = job.id;

    const kopf = document.createElement("div");
    kopf.className = "build-kopf";

    const icon = document.createElement("span");
    icon.className = "build-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = (ARTEN[job.art] && ARTEN[job.art].icon) || "🧩";

    const name = document.createElement("span");
    name.className = "build-name";
    name.textContent = job.name || job.id;

    const status = document.createElement("span");
    status.className = "build-status status-" + job.status;

    const fueller = document.createElement("span");
    fueller.className = "build-fueller";

    const zeit = document.createElement("span");
    zeit.className = "build-zeit";
    zeit.textContent = formatiereZeit(job.erstellt);

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "btn";
    toggleBtn.type = "button";
    toggleBtn.textContent = "Log";
    toggleBtn.setAttribute("aria-expanded", String(laeuft));

    const stopBtn = document.createElement("button");
    stopBtn.className = "btn btn-gefahr";
    stopBtn.type = "button";
    stopBtn.textContent = "Stopp";
    stopBtn.hidden = !laeuft;

    kopf.appendChild(icon);
    kopf.appendChild(name);
    kopf.appendChild(status);
    kopf.appendChild(fueller);
    kopf.appendChild(zeit);
    kopf.appendChild(toggleBtn);
    kopf.appendChild(stopBtn);

    const meta = document.createElement("div");
    meta.className = "build-meta";
    meta.textContent = artLabel(job.art) + " · " + job.cwd;

    const logEl = document.createElement("div");
    logEl.className = "build-log";
    logEl.hidden = !laeuft;

    karte.appendChild(kopf);
    karte.appendChild(meta);
    karte.appendChild(logEl);

    const ui = {
      logEl: logEl,
      statusEl: status,
      stopBtn: stopBtn,
      toggleBtn: toggleBtn,
      offset: 0,
      rest: "",
      geladen: false,
      offen: laeuft,
      inFlight: false
    };
    jobUi.set(job.id, ui);
    statusAnzeigeSetzen(job.id, job.status, job.exitCode);

    toggleBtn.addEventListener("click", function () {
      ui.offen = !ui.offen;
      logEl.hidden = !ui.offen;
      toggleBtn.setAttribute("aria-expanded", String(ui.offen));
      // Log fertiger Builds erst beim Aufklappen einmal nachladen (laufende pollen selbst).
      if (ui.offen && !ui.geladen && !polls.has(job.id)) {
        ui.geladen = true;
        holeUndZeigeLog(job.id);
      }
    });
    stopBtn.addEventListener("click", function () { buildStoppen(job.id); });

    return karte;
  }

  function buildsRendern() {
    stoppeAllePolls();
    jobUi.clear();
    const container = document.getElementById("gen-builds");
    if (!container) return;
    container.innerHTML = "";

    if (!jobs || jobs.length === 0) {
      const leer = document.createElement("div");
      leer.className = "leer";
      leer.textContent = "Noch keine Builds. Wähle oben eine Bau-Option.";
      container.appendChild(leer);
      return;
    }

    for (const job of jobs) {
      container.appendChild(baueBuildKarte(job));
    }
    for (const job of jobs) {
      if (job.status === "laeuft") starttePoll(job.id);
    }
  }

  // ---------- View ----------

  async function render(container) {
    cssEinfuegen();
    stoppeAllePolls();

    container.innerHTML =
      '<div class="kopfzeile"><h1>Generator ' + infoChip(GENERATOR_INFO) + "</h1></div>" +
      '<div class="gen-karten">' + ARTEN_REIHENFOLGE.map(karteHtml).join("") + "</div>" +
      '<div class="gen-builds-kopf"><h2>Builds ' + infoChip(BUILDS_INFO) + "</h2></div>" +
      '<div class="gen-builds" id="gen-builds"></div>';

    container.querySelectorAll(".gen-karte").forEach(function (el) {
      el.addEventListener("click", function () { modalOeffnen(el.dataset.art); });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          modalOeffnen(el.dataset.art);
        }
      });
    });

    const bContainer = container.querySelector("#gen-builds");
    bContainer.innerHTML = '<div class="leer">Lade Builds ...</div>';

    try {
      const [kAntwort, jAntwort] = await Promise.all([
        window.api.get("/api/kunden"),
        window.api.get("/api/jobs")
      ]);
      kundenListe = kAntwort.kunden || [];
      jobs = jAntwort.jobs || [];
    } catch (fehler) {
      window.toast("Daten konnten nicht geladen werden: " + fehler.message, "fehler");
      jobs = [];
    }
    buildsRendern();
  }

  window.views = window.views || {};
  window.views.generator = { titel: "Generator", render: render };
})();
