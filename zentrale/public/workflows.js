// workflows.js
// Visueller Node-Editor fuer Workflows (Stil: n8n), komplett lokal gebaut.
// Registriert sich als window.views.workflows. Keine externen Skripte, kein Framework.
// Voll nutzbar: Bedingungen verzweigen echt (ja/nein), Aktionen fuehren echt aus,
// Claude-Ergebnisse fliessen ueber Variablen ({{name}}) in nachfolgende Nodes.
(function () {
  "use strict";

  const CANVAS_BREITE = 2400;
  const CANVAS_HOEHE = 1400;
  const NODE_BREITE = 170;
  const MAX_SCHRITTE = 500;

  const NODE_TYPEN = {
    start: { icon: "▶", label: "Start" },
    claude: { icon: "✨", label: "Claude-Aufgabe" },
    bedingung: { icon: "⑂", label: "Bedingung" },
    aktion: { icon: "⚙", label: "Aktion" },
    notiz: { icon: "📝", label: "Notiz" }
  };

  const OPERATOREN = [
    ["enthaelt", "enthält"],
    ["enthaelt_nicht", "enthält nicht"],
    ["gleich", "ist gleich"],
    ["ungleich", "ist ungleich"],
    ["nicht_leer", "ist nicht leer"],
    ["leer", "ist leer"],
    ["groesser", "Zahl grösser als"],
    ["kleiner", "Zahl kleiner als"]
  ];

  const STATUS_OPTIONEN = [
    ["offen", "Noch nicht angefangen"],
    ["in_arbeit", "In Bearbeitung"],
    ["fertig", "Fertig"]
  ];

  const AKTIONS_TYPEN = [
    ["meldung", "Meldung ins Log schreiben"],
    ["variable_setzen", "Variable setzen"],
    ["kunde_anlegen", "Kunde anlegen"],
    ["kunde_status", "Kunde Status ändern"],
    ["kunde_notiz", "Notiz an Kunde anhängen"]
  ];

  let nodeZaehler = 0;
  let aktiverTastenHandler = null;

  const editorState = {
    workflows: [],
    aktuelle: null,
    istNeu: false,
    ausgewaehlterNode: null,
    ausgewaehlteVerbindung: null,
    lauf: null,
    kundenCache: [],
    dom: {}
  };

  function esc(s) { return window.escapeHtml(s); }

  function slug(s) {
    return String(s || "").toLowerCase()
      .replace(/[^\w]+/g, "_").replace(/^_+|_+$/g, "") || "ergebnis";
  }

  // ---------- CSS ----------

  function injiziereCss() {
    if (document.getElementById("css-workflows")) return;
    const style = document.createElement("style");
    style.id = "css-workflows";
    style.textContent = `
#wf-wurzel{display:flex;flex-direction:column;gap:12px;height:calc(100vh - 140px);min-height:520px}
.wf-aktionen{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
#wf-neu-wrap{display:none;gap:6px;align-items:center}
#wf-neu-wrap.offen{display:inline-flex}
#wf-editor{display:flex;gap:12px;flex:1;min-height:0}
#wf-palette{width:172px;flex-shrink:0;display:flex;flex-direction:column;gap:8px}
.wf-palette-kachel{cursor:grab;background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);padding:9px 11px;display:flex;gap:8px;align-items:center;user-select:none;font-size:13px;font-weight:600}
.wf-palette-kachel:active{cursor:grabbing}
.wf-palette-hilfe{font-size:11px;color:var(--muted);line-height:1.4;margin-top:4px}
#wf-canvas-scroll{flex:1;overflow:auto;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg);min-width:0}
#wf-canvas{position:relative;width:${CANVAS_BREITE}px;height:${CANVAS_HOEHE}px;background-image:radial-gradient(circle, var(--border) 1px, transparent 1px);background-size:24px 24px}
#wf-svg{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}
#wf-svg path{pointer-events:stroke}
.wf-kurve{fill:none;stroke:var(--muted);stroke-width:2.5}
.wf-kurve-ja{stroke:var(--gruen)}
.wf-kurve-nein{stroke:var(--rot)}
.wf-kurve.ausgewaehlt{stroke:var(--akzent);stroke-width:4}
.wf-kurve-hit{fill:none;stroke:transparent;stroke-width:14;cursor:pointer}
.wf-kurve-label{font-size:10px;font-weight:700;fill:var(--muted);pointer-events:none;user-select:none}
.wf-gummiband{fill:none;stroke:var(--akzent);stroke-width:2;stroke-dasharray:6 4;pointer-events:none}
.wf-node{position:absolute;width:${NODE_BREITE}px;background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);z-index:1;user-select:none}
.wf-node.ausgewaehlt{border-color:var(--akzent);box-shadow:0 0 0 2px var(--akzent)}
.wf-node-kopf{display:flex;align-items:center;gap:6px;padding:8px 10px;cursor:move;touch-action:none}
.wf-node-titel{flex:1;font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wf-node-loeschen{border:none;background:none;color:var(--muted);cursor:pointer;font-size:14px;padding:0 2px;line-height:1}
.wf-node-loeschen:hover{color:var(--rot)}
.wf-node-typ{padding:0 10px 8px;font-size:11px;color:var(--muted)}
.wf-port{position:absolute;width:12px;height:12px;border-radius:50%;background:var(--panel);border:2px solid var(--akzent);top:50%;transform:translateY(-50%);z-index:2;touch-action:none}
.wf-port-ein{left:-7px}
.wf-port-aus{right:-7px;cursor:crosshair}
.wf-port-ja{top:34%;border-color:var(--gruen)}
.wf-port-nein{top:66%;border-color:var(--rot)}
.wf-port-label{position:absolute;right:8px;font-size:9px;font-weight:700}
.wf-port-label-ja{top:calc(34% - 6px);color:var(--gruen)}
.wf-port-label-nein{top:calc(66% - 6px);color:var(--rot)}
#wf-detail{width:290px;flex-shrink:0;overflow-y:auto;padding:12px}
.wf-detail-feld{display:flex;flex-direction:column;gap:4px;margin-bottom:12px}
.wf-detail-feld label{font-size:12px;color:var(--muted)}
.wf-detail-feld textarea{min-height:80px;resize:vertical}
#wf-empfehlung{font-size:12px;color:var(--muted);margin-top:4px}
.wf-detail-tipp{font-size:11px;color:var(--muted);margin-top:10px}
.wf-detail-hilfe{font-size:11px;color:var(--muted);margin-top:8px;line-height:1.5}
.wf-detail-hilfe code{background:var(--panel-2);padding:1px 5px;border-radius:5px;font-size:11px}
#wf-log-panel{border:1px solid var(--border);border-radius:var(--radius);background:var(--panel);flex-shrink:0}
#wf-log-kopf{display:flex;align-items:center;gap:8px;padding:8px 12px;cursor:pointer;user-select:none}
#wf-log-inhalt{display:none;max-height:220px;overflow-y:auto;padding:8px 12px;font-family:ui-monospace,Consolas,monospace;font-size:12px;border-top:1px solid var(--border)}
#wf-log-panel.offen #wf-log-inhalt{display:block}
.wf-log-zeile{white-space:pre-wrap;margin:2px 0;color:var(--text)}
.wf-log-zeile.fehler{color:var(--rot)}
.wf-log-zeile.hinweis{color:var(--muted)}
.wf-log-zeile.aktion{color:var(--akzent-hell)}
`;
    document.head.appendChild(style);
  }

  // ---------- Grundgeruest ----------

  function baueGrundgeruest() {
    const kacheln = Object.keys(NODE_TYPEN).map(function (typ) {
      const def = NODE_TYPEN[typ];
      return '<div class="wf-palette-kachel" draggable="true" data-typ="' + typ + '">' +
        '<span>' + def.icon + '</span><span>' + def.label + '</span></div>';
    }).join("");
    return '' +
      '<div id="wf-wurzel">' +
      '  <div class="kopfzeile">' +
      '    <h2>Workflows</h2>' +
      '    <div class="wf-aktionen">' +
      '      <select id="wf-auswahl" class="eingabe"></select>' +
      '      <span id="wf-neu-wrap">' +
      '        <input id="wf-neu-name" class="eingabe" placeholder="Name des Workflows">' +
      '        <button id="wf-neu-ok" class="btn btn-primaer">Anlegen</button>' +
      '        <button id="wf-neu-abbruch" class="btn">Abbrechen</button>' +
      '      </span>' +
      '      <button id="wf-neu" class="btn">Neu</button>' +
      '      <button id="wf-speichern" class="btn btn-primaer">Speichern</button>' +
      '      <button id="wf-loeschen" class="btn btn-gefahr">Löschen</button>' +
      '      <button id="wf-ausfuehren" class="btn">Ausführen</button>' +
      '    </div>' +
      '  </div>' +
      '  <div id="wf-editor">' +
      '    <aside id="wf-palette">' + kacheln +
      '      <div class="wf-palette-hilfe">Ziehe Bausteine auf die Fläche. Vom rechten Punkt eine Linie zum nächsten Baustein ziehen legt die Reihenfolge fest. Bedingungen haben einen grünen (ja) und einen roten (nein) Ausgang.</div>' +
      '    </aside>' +
      '    <div id="wf-canvas-scroll"><div id="wf-canvas">' +
      '      <svg id="wf-svg" xmlns="http://www.w3.org/2000/svg"></svg>' +
      '    </div></div>' +
      '    <aside id="wf-detail" class="karte"></aside>' +
      '  </div>' +
      '  <div id="wf-log-panel">' +
      '    <div id="wf-log-kopf">' +
      '      <strong>Ausführungs-Log</strong><span id="wf-log-pfeil">▸</span>' +
      '      <button id="wf-lauf-abbrechen" class="btn btn-gefahr" style="display:none;margin-left:auto">Lauf abbrechen</button>' +
      '    </div>' +
      '    <div id="wf-log-inhalt"></div>' +
      '  </div>' +
      '</div>';
  }

  function sammleDomReferenzen(container) {
    const d = editorState.dom;
    d.container = container;
    d.auswahl = container.querySelector("#wf-auswahl");
    d.canvas = container.querySelector("#wf-canvas");
    d.svg = container.querySelector("#wf-svg");
    d.detail = container.querySelector("#wf-detail");
    d.logPanel = container.querySelector("#wf-log-panel");
    d.logInhalt = container.querySelector("#wf-log-inhalt");
    d.logPfeil = container.querySelector("#wf-log-pfeil");
    d.laufAbbrechen = container.querySelector("#wf-lauf-abbrechen");
    d.ausfuehren = container.querySelector("#wf-ausfuehren");
  }

  // ---------- Hilfen ----------

  function findeNode(id) {
    if (!editorState.aktuelle || !id) return null;
    return editorState.aktuelle.nodes.find(function (n) { return n.id === id; }) || null;
  }

  function nodeTitel(id) {
    const node = findeNode(id);
    return node ? (node.titel || NODE_TYPEN[node.typ].label) : "?";
  }

  function standardConfig(typ) {
    if (typ === "claude") return { prompt: "", modellId: "", ergebnisVar: "" };
    if (typ === "bedingung") return { quelle: "{{letztes}}", operator: "enthaelt", vergleich: "" };
    if (typ === "aktion") return {
      aktionsTyp: "meldung", text: "", varName: "", wert: "",
      kName: "", kBranche: "", kStatus: "offen", kNotizen: "", kundeId: ""
    };
    if (typ === "notiz") return { text: "" };
    return {};
  }

  function begrenze(wert, min, max) {
    return Math.max(min, Math.min(max, wert));
  }

  function verfuegbareVariablen() {
    const namen = ["letztes", "kunde_id"];
    const nodes = editorState.aktuelle ? editorState.aktuelle.nodes : [];
    nodes.forEach(function (n) {
      if (n.typ === "claude") {
        namen.push(((n.config && n.config.ergebnisVar) || "").trim() || slug(n.titel));
      }
      if (n.typ === "aktion" && n.config && n.config.aktionsTyp === "variable_setzen" && n.config.varName) {
        namen.push(n.config.varName.trim());
      }
    });
    return Array.from(new Set(namen.filter(Boolean)));
  }

  // ---------- Laden und Auswahl ----------

  async function ladeKunden() {
    try {
      const antwort = await window.api.get("/api/kunden");
      editorState.kundenCache = antwort.kunden || [];
    } catch (fehler) {
      editorState.kundenCache = [];
    }
  }

  async function ladeWorkflows(auswahlId) {
    try {
      const antwort = await window.api.get("/api/workflows");
      editorState.workflows = antwort.workflows || [];
    } catch (fehler) {
      editorState.workflows = [];
      window.toast("Workflows laden fehlgeschlagen: " + fehler.message, "fehler");
    }
    fuelleAuswahl(auswahlId);
    const ziel = editorState.workflows.find(function (w) { return w.id === auswahlId; }) ||
      editorState.workflows[0] || null;
    if (ziel) waehleWorkflow(ziel.id);
    else zeigeOhneWorkflow();
  }

  function fuelleAuswahl(auswahlId) {
    const auswahl = editorState.dom.auswahl;
    auswahl.innerHTML = editorState.workflows.map(function (w) {
      return '<option value="' + esc(w.id) + '">' + esc(w.name) + '</option>';
    }).join("");
    if (auswahlId) auswahl.value = auswahlId;
  }

  function waehleWorkflow(id) {
    const wf = editorState.workflows.find(function (w) { return w.id === id; });
    if (!wf) return;
    editorState.aktuelle = JSON.parse(JSON.stringify(wf));
    editorState.istNeu = false;
    editorState.dom.auswahl.value = id;
    hebeAuswahlAuf();
    zeichneAlles();
  }

  function zeigeOhneWorkflow() {
    editorState.aktuelle = null;
    editorState.istNeu = false;
    hebeAuswahlAuf();
    zeichneAlles();
  }

  function legeNeuenWorkflowAn(name) {
    editorState.aktuelle = { id: null, name: name, nodes: [], verbindungen: [] };
    editorState.istNeu = true;
    const auswahl = editorState.dom.auswahl;
    const option = document.createElement("option");
    option.value = "_neu";
    option.textContent = name + " (neu)";
    auswahl.appendChild(option);
    auswahl.value = "_neu";
    hebeAuswahlAuf();
    zeichneAlles();
    window.toast("Neuer Workflow angelegt, bitte speichern nicht vergessen", "ok");
  }

  // ---------- Speichern und Loeschen ----------

  async function speichereWorkflow() {
    const wf = editorState.aktuelle;
    if (!wf) { window.toast("Kein Workflow ausgewählt", "fehler"); return; }
    const daten = { name: wf.name, nodes: wf.nodes, verbindungen: wf.verbindungen };
    try {
      const gespeichert = editorState.istNeu
        ? await window.api.post("/api/workflows", daten)
        : await window.api.put("/api/workflows/" + wf.id, daten);
      editorState.istNeu = false;
      editorState.aktuelle.id = gespeichert.id;
      await ladeWorkflows(gespeichert.id);
      window.toast("Workflow gespeichert", "ok");
    } catch (fehler) {
      window.toast("Speichern fehlgeschlagen: " + fehler.message, "fehler");
    }
  }

  async function loescheWorkflow() {
    const wf = editorState.aktuelle;
    if (!wf) { window.toast("Kein Workflow ausgewählt", "fehler"); return; }
    if (editorState.istNeu) {
      await ladeWorkflows();
      window.toast("Neuer Workflow verworfen", "ok");
      return;
    }
    try {
      await window.api.del("/api/workflows/" + wf.id);
      await ladeWorkflows();
      window.toast("Workflow gelöscht", "ok");
    } catch (fehler) {
      window.toast("Löschen fehlgeschlagen: " + fehler.message, "fehler");
    }
  }

  // ---------- Zeichnen ----------

  function zeichneAlles() {
    zeichneNodes();
    zeichneVerbindungen();
    zeigeDetail();
  }

  function zeichneNodes() {
    const canvas = editorState.dom.canvas;
    canvas.querySelectorAll(".wf-node").forEach(function (el) { el.remove(); });
    if (!editorState.aktuelle) return;
    editorState.aktuelle.nodes.forEach(function (node) {
      canvas.appendChild(erstelleNodeElement(node));
    });
  }

  function baueAusPorts(node) {
    if (node.typ === "bedingung") {
      return '<span class="wf-port wf-port-aus wf-port-ja" data-node="' + esc(node.id) + '" data-zweig="ja" title="ja"></span>' +
        '<span class="wf-port-label wf-port-label-ja">ja</span>' +
        '<span class="wf-port wf-port-aus wf-port-nein" data-node="' + esc(node.id) + '" data-zweig="nein" title="nein"></span>' +
        '<span class="wf-port-label wf-port-label-nein">nein</span>';
    }
    return '<span class="wf-port wf-port-aus" data-node="' + esc(node.id) + '" data-zweig=""></span>';
  }

  function erstelleNodeElement(node) {
    const def = NODE_TYPEN[node.typ] || { icon: "?", label: node.typ };
    const el = document.createElement("div");
    el.className = "wf-node" + (node.id === editorState.ausgewaehlterNode ? " ausgewaehlt" : "");
    el.dataset.id = node.id;
    el.style.left = node.x + "px";
    el.style.top = node.y + "px";
    el.innerHTML =
      '<div class="wf-node-kopf"><span>' + def.icon + '</span>' +
      '<span class="wf-node-titel">' + esc(node.titel || def.label) + '</span>' +
      '<button class="wf-node-loeschen" title="Node löschen">×</button></div>' +
      '<div class="wf-node-typ">' + esc(def.label) + '</div>' +
      (node.typ !== "start" ? '<span class="wf-port wf-port-ein" data-node="' + esc(node.id) + '"></span>' : '') +
      baueAusPorts(node);
    verdrahteNodeElement(el, node);
    return el;
  }

  function verdrahteNodeElement(el, node) {
    el.addEventListener("click", function (e) {
      e.stopPropagation();
      waehleNode(node.id);
    });
    el.querySelector(".wf-node-loeschen").addEventListener("click", function (e) {
      e.stopPropagation();
      loescheNode(node.id);
    });
    el.querySelector(".wf-node-kopf").addEventListener("pointerdown", function (e) {
      if (e.target.closest(".wf-node-loeschen")) return;
      starteNodeVerschieben(e, node, el);
    });
    el.querySelectorAll(".wf-port-aus").forEach(function (port) {
      port.addEventListener("pointerdown", function (e) {
        starteVerbindungZiehen(e, node, port.dataset.zweig || "");
      });
    });
  }

  function starteNodeVerschieben(e, node, el) {
    if (e.button !== 0) return;
    e.preventDefault();
    const start = { x: e.clientX, y: e.clientY, nx: node.x, ny: node.y };
    function beiBewegung(ev) {
      node.x = Math.round(begrenze(start.nx + ev.clientX - start.x, 0, CANVAS_BREITE - NODE_BREITE));
      node.y = Math.round(begrenze(start.ny + ev.clientY - start.y, 0, CANVAS_HOEHE - 60));
      el.style.left = node.x + "px";
      el.style.top = node.y + "px";
      zeichneVerbindungen();
    }
    function beiEnde() {
      document.removeEventListener("pointermove", beiBewegung);
      document.removeEventListener("pointerup", beiEnde);
      document.removeEventListener("pointercancel", beiEnde);
    }
    document.addEventListener("pointermove", beiBewegung);
    document.addEventListener("pointerup", beiEnde);
    document.addEventListener("pointercancel", beiEnde);
  }

  // ---------- Verbindungen ----------

  function portKoordinaten(nodeId, seite, zweig) {
    const canvas = editorState.dom.canvas;
    let selektor;
    if (seite === "aus") {
      selektor = '.wf-node[data-id="' + CSS.escape(nodeId) + '"] .wf-port-aus' +
        (zweig ? '[data-zweig="' + zweig + '"]' : "");
    } else {
      selektor = '.wf-node[data-id="' + CSS.escape(nodeId) + '"] .wf-port-ein';
    }
    let port = canvas.querySelector(selektor);
    if (!port && seite === "aus") {
      port = canvas.querySelector('.wf-node[data-id="' + CSS.escape(nodeId) + '"] .wf-port-aus');
    }
    if (!port) return null;
    const r = port.getBoundingClientRect();
    const c = canvas.getBoundingClientRect();
    return { x: r.left + r.width / 2 - c.left, y: r.top + r.height / 2 - c.top };
  }

  function bezierPfad(von, zu) {
    const abstand = Math.max(40, Math.abs(zu.x - von.x) / 2);
    return "M " + von.x + " " + von.y +
      " C " + (von.x + abstand) + " " + von.y + ", " +
      (zu.x - abstand) + " " + zu.y + ", " + zu.x + " " + zu.y;
  }

  function pfadElement(d, klasse) {
    const pfad = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pfad.setAttribute("d", d);
    pfad.setAttribute("class", klasse);
    return pfad;
  }

  function textElement(x, y, text) {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("x", x);
    t.setAttribute("y", y);
    t.setAttribute("class", "wf-kurve-label");
    t.textContent = text;
    return t;
  }

  function zeichneVerbindungen() {
    const svg = editorState.dom.svg;
    svg.innerHTML = "";
    if (!editorState.aktuelle) return;
    editorState.aktuelle.verbindungen.forEach(function (verbindung, index) {
      const von = portKoordinaten(verbindung.von, "aus", verbindung.zweig || "");
      const zu = portKoordinaten(verbindung.zu, "ein");
      if (!von || !zu) return;
      const d = bezierPfad(von, zu);
      let klasse = "wf-kurve";
      if (verbindung.zweig === "ja") klasse += " wf-kurve-ja";
      else if (verbindung.zweig === "nein") klasse += " wf-kurve-nein";
      if (index === editorState.ausgewaehlteVerbindung) klasse += " ausgewaehlt";
      const sichtbar = pfadElement(d, klasse);
      const treffer = pfadElement(d, "wf-kurve-hit");
      treffer.addEventListener("click", function (e) {
        e.stopPropagation();
        waehleVerbindung(index);
      });
      svg.appendChild(sichtbar);
      svg.appendChild(treffer);
      if (verbindung.zweig) svg.appendChild(textElement(von.x + 14, von.y - 6, verbindung.zweig));
    });
  }

  function starteVerbindungZiehen(e, vonNode, zweig) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const svg = editorState.dom.svg;
    const canvas = editorState.dom.canvas;
    const gummiband = pfadElement("", "wf-gummiband");
    svg.appendChild(gummiband);
    const start = portKoordinaten(vonNode.id, "aus", zweig);
    function beiBewegung(ev) {
      const rect = canvas.getBoundingClientRect();
      const maus = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
      gummiband.setAttribute("d", bezierPfad(start, maus));
    }
    function beiEnde(ev) {
      document.removeEventListener("pointermove", beiBewegung);
      document.removeEventListener("pointerup", beiEnde);
      document.removeEventListener("pointercancel", beiEnde);
      gummiband.remove();
      if (ev.type === "pointercancel") return;
      const ziel = document.elementFromPoint(ev.clientX, ev.clientY);
      const port = ziel ? ziel.closest(".wf-port-ein") : null;
      if (port) verbinde(vonNode.id, port.dataset.node, zweig);
    }
    document.addEventListener("pointermove", beiBewegung);
    document.addEventListener("pointerup", beiEnde);
    document.addEventListener("pointercancel", beiEnde);
  }

  function verbinde(von, zu, zweig) {
    if (von === zu) { window.toast("Selbstbezug ist nicht erlaubt", "fehler"); return; }
    const existiert = editorState.aktuelle.verbindungen.some(function (v) {
      return v.von === von && v.zu === zu && (v.zweig || "") === (zweig || "");
    });
    if (existiert) { window.toast("Verbindung existiert bereits", "fehler"); return; }
    editorState.aktuelle.verbindungen.push({ von: von, zu: zu, zweig: zweig || "" });
    zeichneVerbindungen();
  }

  function waehleVerbindung(index) {
    editorState.ausgewaehlteVerbindung = index;
    editorState.ausgewaehlterNode = null;
    zeichneNodes();
    zeichneVerbindungen();
    zeigeDetail();
  }

  function loescheVerbindung(index) {
    editorState.aktuelle.verbindungen.splice(index, 1);
    editorState.ausgewaehlteVerbindung = null;
    zeichneVerbindungen();
    zeigeDetail();
  }

  // ---------- Auswahl und Loeschen von Nodes ----------

  function waehleNode(id) {
    editorState.ausgewaehlterNode = id;
    editorState.ausgewaehlteVerbindung = null;
    editorState.dom.canvas.querySelectorAll(".wf-node").forEach(function (el) {
      el.classList.toggle("ausgewaehlt", el.dataset.id === id);
    });
    zeichneVerbindungen();
    zeigeDetail();
  }

  function hebeAuswahlAuf() {
    editorState.ausgewaehlterNode = null;
    editorState.ausgewaehlteVerbindung = null;
    editorState.dom.canvas.querySelectorAll(".wf-node.ausgewaehlt").forEach(function (el) {
      el.classList.remove("ausgewaehlt");
    });
    zeichneVerbindungen();
    zeigeDetail();
  }

  function loescheNode(id) {
    const wf = editorState.aktuelle;
    wf.nodes = wf.nodes.filter(function (n) { return n.id !== id; });
    wf.verbindungen = wf.verbindungen.filter(function (v) {
      return v.von !== id && v.zu !== id;
    });
    if (editorState.ausgewaehlterNode === id) editorState.ausgewaehlterNode = null;
    editorState.ausgewaehlteVerbindung = null;
    zeichneAlles();
  }

  function legeNodeAn(typ, x, y) {
    const def = NODE_TYPEN[typ];
    nodeZaehler += 1;
    const node = {
      id: "n_" + Date.now() + "_" + nodeZaehler,
      typ: typ,
      titel: def.label,
      x: Math.round(begrenze(x, 0, CANVAS_BREITE - NODE_BREITE)),
      y: Math.round(begrenze(y, 0, CANVAS_HOEHE - 60)),
      config: standardConfig(typ)
    };
    editorState.aktuelle.nodes.push(node);
    zeichneNodes();
    zeichneVerbindungen();
    waehleNode(node.id);
  }

  // ---------- Detail-Panel ----------

  function feld(beschriftung, inhaltHtml) {
    return '<div class="wf-detail-feld"><label>' + beschriftung + '</label>' + inhaltHtml + '</div>';
  }

  function statusSelect(id, wert) {
    return '<select id="' + id + '" class="eingabe">' + STATUS_OPTIONEN.map(function (s) {
      return '<option value="' + s[0] + '"' + (wert === s[0] ? " selected" : "") + '>' + s[1] + '</option>';
    }).join("") + '</select>';
  }

  function kundeSelect(id, wert) {
    const opts = ['<option value="">Kunde wählen</option>'].concat(
      (editorState.kundenCache || []).map(function (k) {
        return '<option value="' + esc(k.id) + '"' + (wert === k.id ? " selected" : "") + '>' + esc(k.name) + '</option>';
      })
    );
    return '<select id="' + id + '" class="eingabe">' + opts.join("") + '</select>';
  }

  function variablenHilfe() {
    const vars = verfuegbareVariablen();
    return '<div class="wf-detail-hilfe">Variablen einsetzen mit <code>{{name}}</code>. Verfügbar: ' +
      vars.map(function (v) { return '<code>{{' + esc(v) + '}}</code>'; }).join(" ") +
      '. <code>{{letztes}}</code> ist immer das letzte Claude-Ergebnis.</div>';
  }

  function zeigeDetail() {
    const panel = editorState.dom.detail;
    const node = findeNode(editorState.ausgewaehlterNode);
    if (node) { zeigeNodeDetail(panel, node); return; }
    if (editorState.ausgewaehlteVerbindung !== null) { zeigeVerbindungDetail(panel); return; }
    panel.innerHTML = '<div class="leer">Kein Element ausgewählt</div>';
  }

  function zeigeNodeDetail(panel, node) {
    const cfg = node.config || (node.config = standardConfig(node.typ));
    let html = feld("Titel",
      '<input id="wf-f-titel" class="eingabe" value="' + esc(node.titel || "") + '">');
    if (node.typ === "claude") html += baueClaudeFelder(cfg) + variablenHilfe();
    else if (node.typ === "bedingung") html += baueBedingungFelder(cfg) + variablenHilfe();
    else if (node.typ === "aktion") html += baueAktionFelder(cfg) + variablenHilfe();
    else if (node.typ === "notiz") html += feld("Text",
      '<textarea id="wf-f-text" class="eingabe">' + esc(cfg.text || "") + '</textarea>');
    panel.innerHTML = html;
    verdrahteNodeDetail(node);
  }

  function baueClaudeFelder(cfg) {
    const optionen = ['<option value="">Auto (Empfehlung)</option>'].concat(
      window.modelle.map(function (m) {
        const gewaehlt = m.id === cfg.modellId ? " selected" : "";
        return '<option value="' + esc(m.id) + '"' + gewaehlt + '>' + esc(m.name) + '</option>';
      })
    ).join("");
    return feld("Prompt (Variablen mit {{name}})",
      '<textarea id="wf-f-prompt" class="eingabe">' + esc(cfg.prompt || "") + '</textarea>') +
      feld("Modell",
        '<select id="wf-f-modell" class="eingabe">' + optionen + '</select><div id="wf-empfehlung"></div>') +
      feld("Ergebnis speichern als",
        '<input id="wf-f-ergebnisvar" class="eingabe" placeholder="automatisch aus Titel" value="' + esc(cfg.ergebnisVar || "") + '">');
  }

  function baueBedingungFelder(cfg) {
    const opOptionen = OPERATOREN.map(function (o) {
      return '<option value="' + o[0] + '"' + (cfg.operator === o[0] ? " selected" : "") + '>' + o[1] + '</option>';
    }).join("");
    return feld("Quelle (Text oder {{variable}})",
      '<input id="wf-f-quelle" class="eingabe" value="' + esc(cfg.quelle || "") + '">') +
      feld("Vergleich",
        '<select id="wf-f-operator" class="eingabe">' + opOptionen + '</select>') +
      feld("Vergleichswert",
        '<input id="wf-f-vergleich" class="eingabe" value="' + esc(cfg.vergleich || "") + '">') +
      '<p class="wf-detail-tipp">Grüner Ausgang (ja) wird genommen wenn die Bedingung erfüllt ist, sonst der rote (nein).</p>';
  }

  function baueAktionFelder(cfg) {
    const typSelect = '<select id="wf-f-aktionstyp" class="eingabe">' + AKTIONS_TYPEN.map(function (t) {
      return '<option value="' + t[0] + '"' + (cfg.aktionsTyp === t[0] ? " selected" : "") + '>' + t[1] + '</option>';
    }).join("") + '</select>';
    let felder = "";
    const t = cfg.aktionsTyp || "meldung";
    if (t === "meldung") {
      felder = feld("Text", '<textarea id="wf-f-text" class="eingabe">' + esc(cfg.text || "") + '</textarea>');
    } else if (t === "variable_setzen") {
      felder = feld("Variablenname", '<input id="wf-f-varname" class="eingabe" value="' + esc(cfg.varName || "") + '">') +
        feld("Wert", '<textarea id="wf-f-wert" class="eingabe">' + esc(cfg.wert || "") + '</textarea>');
    } else if (t === "kunde_anlegen") {
      felder = feld("Name", '<input id="wf-f-kname" class="eingabe" value="' + esc(cfg.kName || "") + '">') +
        feld("Branche", '<input id="wf-f-kbranche" class="eingabe" value="' + esc(cfg.kBranche || "") + '">') +
        feld("Status", statusSelect("wf-f-kstatus", cfg.kStatus)) +
        feld("Notizen", '<textarea id="wf-f-knotizen" class="eingabe">' + esc(cfg.kNotizen || "") + '</textarea>');
    } else if (t === "kunde_status") {
      felder = feld("Kunde", kundeSelect("wf-f-kundeid", cfg.kundeId)) +
        feld("Neuer Status", statusSelect("wf-f-kstatus", cfg.kStatus));
    } else if (t === "kunde_notiz") {
      felder = feld("Kunde", kundeSelect("wf-f-kundeid", cfg.kundeId)) +
        feld("Text anhängen", '<textarea id="wf-f-text" class="eingabe">' + esc(cfg.text || "") + '</textarea>');
    }
    return feld("Aktionstyp", typSelect) + felder;
  }

  function bindeEingabe(panel, selektor, cfg, schluessel) {
    const el = panel.querySelector(selektor);
    if (!el) return;
    const ereignis = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(ereignis, function () { cfg[schluessel] = el.value; });
  }

  function verdrahteNodeDetail(node) {
    const panel = editorState.dom.detail;
    const titelFeld = panel.querySelector("#wf-f-titel");
    if (titelFeld) titelFeld.addEventListener("input", function () {
      node.titel = titelFeld.value;
      const canvasTitel = editorState.dom.canvas.querySelector(
        '.wf-node[data-id="' + CSS.escape(node.id) + '"] .wf-node-titel');
      if (canvasTitel) canvasTitel.textContent = node.titel || NODE_TYPEN[node.typ].label;
    });
    if (node.typ === "claude") verdrahteClaudeDetail(panel, node);
    else if (node.typ === "bedingung") {
      bindeEingabe(panel, "#wf-f-quelle", node.config, "quelle");
      bindeEingabe(panel, "#wf-f-operator", node.config, "operator");
      bindeEingabe(panel, "#wf-f-vergleich", node.config, "vergleich");
    } else if (node.typ === "aktion") verdrahteAktionDetail(panel, node);
    else bindeEingabe(panel, "#wf-f-text", node.config, "text");
  }

  function verdrahteAktionDetail(panel, node) {
    const cfg = node.config;
    const typSel = panel.querySelector("#wf-f-aktionstyp");
    if (typSel) typSel.addEventListener("change", function () {
      cfg.aktionsTyp = typSel.value;
      zeigeNodeDetail(panel, node);
    });
    bindeEingabe(panel, "#wf-f-text", cfg, "text");
    bindeEingabe(panel, "#wf-f-varname", cfg, "varName");
    bindeEingabe(panel, "#wf-f-wert", cfg, "wert");
    bindeEingabe(panel, "#wf-f-kname", cfg, "kName");
    bindeEingabe(panel, "#wf-f-kbranche", cfg, "kBranche");
    bindeEingabe(panel, "#wf-f-knotizen", cfg, "kNotizen");
    bindeEingabe(panel, "#wf-f-kstatus", cfg, "kStatus");
    bindeEingabe(panel, "#wf-f-kundeid", cfg, "kundeId");
  }

  function verdrahteClaudeDetail(panel, node) {
    const promptFeld = panel.querySelector("#wf-f-prompt");
    const modellFeld = panel.querySelector("#wf-f-modell");
    const ergebnisFeld = panel.querySelector("#wf-f-ergebnisvar");
    if (promptFeld) promptFeld.addEventListener("input", function () {
      node.config.prompt = promptFeld.value;
      aktualisiereEmpfehlung(node);
    });
    if (modellFeld) modellFeld.addEventListener("change", function () {
      node.config.modellId = modellFeld.value;
      aktualisiereEmpfehlung(node);
    });
    if (ergebnisFeld) ergebnisFeld.addEventListener("input", function () {
      node.config.ergebnisVar = ergebnisFeld.value;
    });
    aktualisiereEmpfehlung(node);
  }

  function aktualisiereEmpfehlung(node) {
    const anzeige = document.getElementById("wf-empfehlung");
    if (!anzeige) return;
    if (node.config.modellId) { anzeige.textContent = ""; return; }
    const empfehlung = window.modellEmpfehlung(node.config.prompt || "");
    anzeige.textContent = "Auto wählt: " + empfehlung.name + ". Grund: " + empfehlung.grund;
  }

  function zeigeVerbindungDetail(panel) {
    const index = editorState.ausgewaehlteVerbindung;
    const verbindung = editorState.aktuelle.verbindungen[index];
    if (!verbindung) { panel.innerHTML = '<div class="leer">Keine Verbindung</div>'; return; }
    const zweigText = verbindung.zweig ? " [" + verbindung.zweig + "]" : "";
    panel.innerHTML =
      feld("Verbindung", '<div>' + esc(nodeTitel(verbindung.von)) + esc(zweigText) +
        ' → ' + esc(nodeTitel(verbindung.zu)) + '</div>') +
      '<button id="wf-verbindung-loeschen" class="btn btn-gefahr">Verbindung löschen</button>' +
      '<p class="wf-detail-tipp">Tipp: Die Entf-Taste löscht die ausgewählte Verbindung.</p>';
    panel.querySelector("#wf-verbindung-loeschen").addEventListener("click", function () {
      loescheVerbindung(index);
    });
  }

  // ---------- Log-Panel ----------

  function oeffneLogPanel() {
    editorState.dom.logPanel.classList.add("offen");
    editorState.dom.logPfeil.textContent = "▾";
  }

  function logZeile(text, art) {
    const zeile = document.createElement("div");
    zeile.className = "wf-log-zeile" + (art ? " " + art : "");
    zeile.textContent = text;
    editorState.dom.logInhalt.appendChild(zeile);
    editorState.dom.logInhalt.scrollTop = editorState.dom.logInhalt.scrollHeight;
  }

  // ---------- Ausfuehrung ----------

  function fuelleVorlage(text) {
    const v = (editorState.lauf && editorState.lauf.variablen) || {};
    return String(text || "").replace(/\{\{\s*([\w-]+)\s*\}\}/g, function (_, name) {
      return (v[name] !== undefined && v[name] !== null) ? String(v[name]) : "";
    });
  }

  function werteBedingungAus(cfg) {
    const links = fuelleVorlage(cfg.quelle).trim();
    const rechts = fuelleVorlage(cfg.vergleich).trim();
    const l = links.toLowerCase();
    const r = rechts.toLowerCase();
    switch (cfg.operator || "enthaelt") {
      case "enthaelt": return l.indexOf(r) >= 0;
      case "enthaelt_nicht": return l.indexOf(r) < 0;
      case "gleich": return l === r;
      case "ungleich": return l !== r;
      case "leer": return links === "";
      case "nicht_leer": return links !== "";
      case "groesser": return parseFloat(links) > parseFloat(rechts);
      case "kleiner": return parseFloat(links) < parseFloat(rechts);
      default: return false;
    }
  }

  async function fuehreWorkflowAus() {
    if (!editorState.aktuelle) { window.toast("Kein Workflow ausgewählt", "fehler"); return; }
    if (editorState.lauf) { window.toast("Es läuft bereits eine Ausführung", "fehler"); return; }
    const wf = editorState.aktuelle;
    const starts = wf.nodes.filter(function (n) { return n.typ === "start"; });
    if (!starts.length) { window.toast("Kein Start-Node vorhanden", "fehler"); return; }

    oeffneLogPanel();
    logZeile("Lauf gestartet: " + wf.name, "hinweis");
    editorState.lauf = { abgebrochen: false, stream: null, aufloesen: null, variablen: {} };
    setzeLaufUi(true);
    try {
      const besucht = new Set();
      const warteschlange = starts.map(function (n) { return n.id; });
      let schritte = 0;
      while (warteschlange.length) {
        if (editorState.lauf.abgebrochen) break;
        if (++schritte > MAX_SCHRITTE) { logZeile("Abbruch: zu viele Schritte (Schleife?)", "fehler"); break; }
        const id = warteschlange.shift();
        if (besucht.has(id)) continue;
        besucht.add(id);
        const node = findeNode(id);
        if (!node) continue;
        const ergebnis = await fuehreNodeAus(node);
        if (editorState.lauf.abgebrochen) break;
        let folge = wf.verbindungen.filter(function (v) { return v.von === id; });
        if (node.typ === "bedingung") {
          const zweig = (ergebnis && ergebnis.zweig) || "ja";
          folge = folge.filter(function (v) { return (v.zweig || "ja") === zweig; });
        }
        folge.forEach(function (v) { if (!besucht.has(v.zu)) warteschlange.push(v.zu); });
      }
      logZeile(editorState.lauf.abgebrochen ? "Lauf abgebrochen." : "Lauf beendet.", "hinweis");
    } catch (fehler) {
      logZeile("Lauf-Fehler: " + fehler.message, "fehler");
    } finally {
      editorState.lauf = null;
      setzeLaufUi(false);
      ladeKunden();
    }
  }

  async function fuehreNodeAus(node) {
    const titel = node.titel || NODE_TYPEN[node.typ].label;
    const cfg = node.config || {};
    if (node.typ === "start") { logZeile("[" + titel + "] Start"); return; }
    if (node.typ === "claude") { await fuehreClaudeNodeAus(node, titel); return; }
    if (node.typ === "bedingung") {
      const wahr = werteBedingungAus(cfg);
      logZeile("[" + titel + "] Bedingung " + (wahr ? "erfüllt, gehe ja" : "nicht erfüllt, gehe nein"));
      return { zweig: wahr ? "ja" : "nein" };
    }
    if (node.typ === "aktion") { await fuehreAktionAus(node, titel); return; }
    if (node.typ === "notiz") { logZeile("[" + titel + "] Notiz: " + (cfg.text || "")); return; }
    logZeile("[" + titel + "] Unbekannter Typ", "fehler");
  }

  async function fuehreAktionAus(node, titel) {
    const cfg = node.config || {};
    const typ = cfg.aktionsTyp || "meldung";
    try {
      if (typ === "meldung") {
        logZeile("[" + titel + "] " + fuelleVorlage(cfg.text || ""), "aktion");
      } else if (typ === "variable_setzen") {
        const name = (cfg.varName || "").trim();
        if (!name) { logZeile("[" + titel + "] Fehler: Variablenname fehlt", "fehler"); return; }
        editorState.lauf.variablen[name] = fuelleVorlage(cfg.wert || "");
        logZeile("[" + titel + "] Variable {{" + name + "}} gesetzt", "aktion");
      } else if (typ === "kunde_anlegen") {
        const daten = {
          name: fuelleVorlage(cfg.kName || "").trim(),
          branche: fuelleVorlage(cfg.kBranche || ""),
          status: cfg.kStatus || "offen",
          notizen: fuelleVorlage(cfg.kNotizen || "")
        };
        if (!daten.name) { logZeile("[" + titel + "] Fehler: Kundenname fehlt", "fehler"); return; }
        const neu = await window.api.post("/api/kunden", daten);
        editorState.lauf.variablen.kunde_id = neu.id;
        logZeile("[" + titel + "] Kunde angelegt: " + neu.name + " (id in {{kunde_id}})", "aktion");
      } else if (typ === "kunde_status") {
        if (!cfg.kundeId) { logZeile("[" + titel + "] Fehler: kein Kunde gewählt", "fehler"); return; }
        const neu = await window.api.put("/api/kunden/" + cfg.kundeId, { status: cfg.kStatus || "offen" });
        logZeile("[" + titel + "] Status von " + neu.name + " auf " + neu.status + " gesetzt", "aktion");
      } else if (typ === "kunde_notiz") {
        if (!cfg.kundeId) { logZeile("[" + titel + "] Fehler: kein Kunde gewählt", "fehler"); return; }
        const liste = (await window.api.get("/api/kunden")).kunden || [];
        const k = liste.find(function (x) { return x.id === cfg.kundeId; });
        if (!k) { logZeile("[" + titel + "] Fehler: Kunde nicht gefunden", "fehler"); return; }
        const angehaengt = fuelleVorlage(cfg.text || "");
        const neueNotiz = (k.notizen ? k.notizen + "\n" : "") + angehaengt;
        const neu = await window.api.put("/api/kunden/" + cfg.kundeId, { notizen: neueNotiz });
        logZeile("[" + titel + "] Notiz an " + neu.name + " angehängt", "aktion");
      }
    } catch (fehler) {
      logZeile("[" + titel + "] Fehler: " + fehler.message, "fehler");
    }
  }

  function fuehreClaudeNodeAus(node, titel) {
    return new Promise(function (aufloesen) {
      const cfg = node.config || {};
      let modellId = cfg.modellId || "";
      if (!modellId) {
        const empfehlung = window.modellEmpfehlung(cfg.prompt || "");
        modellId = empfehlung.modellId;
        logZeile("[" + titel + "] Auto-Modell: " + empfehlung.name + " (" + empfehlung.grund + ")", "hinweis");
      }
      const ergebnisVar = (cfg.ergebnisVar || "").trim() || slug(titel);
      const prompt = fuelleVorlage(cfg.prompt || "");
      logZeile("[" + titel + "] Claude startet");
      let gesammelt = "";
      let resultText = null;
      editorState.lauf.aufloesen = aufloesen;
      editorState.lauf.stream = window.claudeStream({
        prompt: prompt,
        modellId: modellId,
        cwd: (window.einstellungen && window.einstellungen.standardCwd) || "",
        zusatzFlags: (window.einstellungen && window.einstellungen.zusatzFlags) || "",
        onZeile: function (zeile) {
          if (zeile && typeof zeile === "object") {
            if (zeile.type === "assistant" && zeile.message && Array.isArray(zeile.message.content)) {
              zeile.message.content.forEach(function (b) {
                if (b && b.type === "text" && b.text) gesammelt += b.text;
              });
            }
            if (zeile.type === "result" && typeof zeile.result === "string") resultText = zeile.result;
          }
          const text = formatiereLaufZeile(zeile);
          if (text) logZeile("[" + titel + "] " + text);
        },
        onFehler: function (text) {
          logZeile("[" + titel + "] Fehler: " + text, "fehler");
        },
        onEnde: function (code) {
          const ergebnis = (resultText !== null ? resultText : gesammelt).trim();
          if (editorState.lauf) {
            editorState.lauf.variablen[ergebnisVar] = ergebnis;
            editorState.lauf.variablen.letztes = ergebnis;
          }
          logZeile("[" + titel + "] Beendet (Exit " + code + "), Ergebnis in {{" + ergebnisVar + "}}", "hinweis");
          aufloesen();
        }
      });
    });
  }

  function formatiereLaufZeile(zeile) {
    if (zeile && typeof zeile === "object") return window.formatiereClaudeZeile(zeile);
    if (typeof zeile === "string" && zeile.trim()) return zeile;
    return null;
  }

  function brichLaufAb() {
    const lauf = editorState.lauf;
    if (!lauf) return;
    lauf.abgebrochen = true;
    if (lauf.stream && typeof lauf.stream.abbrechen === "function") lauf.stream.abbrechen();
    if (typeof lauf.aufloesen === "function") lauf.aufloesen();
  }

  function setzeLaufUi(laeuft) {
    editorState.dom.ausfuehren.disabled = laeuft;
    editorState.dom.laufAbbrechen.style.display = laeuft ? "" : "none";
  }

  // ---------- Verdrahtung ----------

  function verdrahteKopfzeile(container) {
    const neuWrap = container.querySelector("#wf-neu-wrap");
    const neuName = container.querySelector("#wf-neu-name");
    container.querySelector("#wf-neu").addEventListener("click", function () {
      neuWrap.classList.add("offen");
      neuName.value = "";
      neuName.focus();
    });
    container.querySelector("#wf-neu-abbruch").addEventListener("click", function () {
      neuWrap.classList.remove("offen");
    });
    container.querySelector("#wf-neu-ok").addEventListener("click", function () {
      const name = neuName.value.trim();
      if (!name) { window.toast("Bitte einen Namen eingeben", "fehler"); return; }
      neuWrap.classList.remove("offen");
      legeNeuenWorkflowAn(name);
    });
    neuName.addEventListener("keydown", function (e) {
      if (e.key === "Enter") container.querySelector("#wf-neu-ok").click();
    });
    editorState.dom.auswahl.addEventListener("change", function () {
      const wert = editorState.dom.auswahl.value;
      if (wert !== "_neu") waehleWorkflow(wert);
    });
    container.querySelector("#wf-speichern").addEventListener("click", speichereWorkflow);
    container.querySelector("#wf-loeschen").addEventListener("click", loescheWorkflow);
    editorState.dom.ausfuehren.addEventListener("click", fuehreWorkflowAus);
  }

  function verdrahteCanvas() {
    const canvas = editorState.dom.canvas;
    canvas.addEventListener("dragover", function (e) { e.preventDefault(); });
    canvas.addEventListener("drop", function (e) {
      e.preventDefault();
      const typ = e.dataTransfer.getData("text/plain");
      if (!NODE_TYPEN[typ]) return;
      if (!editorState.aktuelle) {
        window.toast("Bitte zuerst einen Workflow anlegen oder auswählen", "fehler");
        return;
      }
      const rect = canvas.getBoundingClientRect();
      legeNodeAn(typ, e.clientX - rect.left - NODE_BREITE / 2, e.clientY - rect.top - 20);
    });
    canvas.addEventListener("click", function (e) {
      if (e.target === canvas || e.target === editorState.dom.svg) hebeAuswahlAuf();
    });
  }

  function verdrahtePalette(container) {
    container.querySelectorAll(".wf-palette-kachel").forEach(function (kachel) {
      kachel.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/plain", kachel.dataset.typ);
      });
    });
  }

  function verdrahteLogPanel(container) {
    container.querySelector("#wf-log-kopf").addEventListener("click", function (e) {
      if (e.target.closest("#wf-lauf-abbrechen")) return;
      const panel = editorState.dom.logPanel;
      panel.classList.toggle("offen");
      editorState.dom.logPfeil.textContent =
        panel.classList.contains("offen") ? "▾" : "▸";
    });
    editorState.dom.laufAbbrechen.addEventListener("click", function (e) {
      e.stopPropagation();
      brichLaufAb();
    });
  }

  function verdrahteTastatur() {
    if (aktiverTastenHandler) document.removeEventListener("keydown", aktiverTastenHandler);
    aktiverTastenHandler = function (e) {
      if (e.key !== "Delete") return;
      if (!editorState.dom.canvas || !editorState.dom.canvas.isConnected) return;
      const ziel = e.target;
      if (ziel && ["INPUT", "TEXTAREA", "SELECT"].indexOf(ziel.tagName) >= 0) return;
      if (editorState.ausgewaehlteVerbindung !== null) {
        loescheVerbindung(editorState.ausgewaehlteVerbindung);
      }
    };
    document.addEventListener("keydown", aktiverTastenHandler);
  }

  // ---------- View-Registrierung ----------

  window.views = window.views || {};
  window.views.workflows = {
    titel: "Workflows",
    render: async function (container) {
      injiziereCss();
      container.innerHTML = baueGrundgeruest();
      sammleDomReferenzen(container);
      verdrahteKopfzeile(container);
      verdrahteCanvas();
      verdrahtePalette(container);
      verdrahteLogPanel(container);
      verdrahteTastatur();
      await ladeKunden();
      await ladeWorkflows();
    }
  };
})();
