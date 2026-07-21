// workflows.js
// Visueller Node-Editor fuer Workflows (Stil: n8n), komplett lokal gebaut.
// Registriert sich als window.views.workflows. Keine externen Skripte, kein Framework.
(function () {
  "use strict";

  const CANVAS_BREITE = 2400;
  const CANVAS_HOEHE = 1400;
  const NODE_BREITE = 160;

  const NODE_TYPEN = {
    start: { icon: "▶", label: "Start" },
    claude: { icon: "✨", label: "Claude-Aufgabe" },
    bedingung: { icon: "⑂", label: "Bedingung" },
    aktion: { icon: "⚙", label: "Aktion" },
    notiz: { icon: "📝", label: "Notiz" }
  };

  let nodeZaehler = 0;
  let aktiverTastenHandler = null;

  const editorState = {
    workflows: [],
    aktuelle: null,
    istNeu: false,
    ausgewaehlterNode: null,
    ausgewaehlteVerbindung: null,
    lauf: null,
    dom: {}
  };

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
#wf-palette{width:170px;flex-shrink:0;display:flex;flex-direction:column;gap:8px}
.wf-palette-kachel{cursor:grab;background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);padding:8px 10px;display:flex;gap:8px;align-items:center;user-select:none;font-size:13px}
.wf-palette-kachel:active{cursor:grabbing}
#wf-canvas-scroll{flex:1;overflow:auto;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg);min-width:0}
#wf-canvas{position:relative;width:${CANVAS_BREITE}px;height:${CANVAS_HOEHE}px;background-image:radial-gradient(circle, var(--border) 1px, transparent 1px);background-size:24px 24px}
#wf-svg{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}
#wf-svg path{pointer-events:stroke}
.wf-kurve{fill:none;stroke:var(--muted);stroke-width:2.5}
.wf-kurve.ausgewaehlt{stroke:var(--akzent);stroke-width:4}
.wf-kurve-hit{fill:none;stroke:transparent;stroke-width:14;cursor:pointer}
.wf-gummiband{fill:none;stroke:var(--akzent);stroke-width:2;stroke-dasharray:6 4;pointer-events:none}
.wf-node{position:absolute;width:${NODE_BREITE}px;background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);z-index:1;user-select:none}
.wf-node.ausgewaehlt{border-color:var(--akzent);box-shadow:0 0 0 2px var(--akzent)}
.wf-node-kopf{display:flex;align-items:center;gap:6px;padding:8px 10px;cursor:move;touch-action:none}
.wf-node-titel{flex:1;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wf-node-loeschen{border:none;background:none;color:var(--muted);cursor:pointer;font-size:14px;padding:0 2px;line-height:1}
.wf-node-loeschen:hover{color:var(--rot)}
.wf-node-typ{padding:0 10px 8px;font-size:11px;color:var(--muted)}
.wf-port{position:absolute;width:12px;height:12px;border-radius:50%;background:var(--panel);border:2px solid var(--akzent);top:50%;transform:translateY(-50%);z-index:2;touch-action:none}
.wf-port-ein{left:-7px}
.wf-port-aus{right:-7px;cursor:crosshair}
#wf-detail{width:280px;flex-shrink:0;overflow-y:auto;padding:12px}
.wf-detail-feld{display:flex;flex-direction:column;gap:4px;margin-bottom:12px}
.wf-detail-feld label{font-size:12px;color:var(--muted)}
.wf-detail-feld textarea{min-height:90px;resize:vertical}
#wf-empfehlung{font-size:12px;color:var(--muted);margin-top:4px}
.wf-detail-tipp{font-size:11px;color:var(--muted);margin-top:10px}
#wf-log-panel{border:1px solid var(--border);border-radius:var(--radius);background:var(--panel);flex-shrink:0}
#wf-log-kopf{display:flex;align-items:center;gap:8px;padding:8px 12px;cursor:pointer;user-select:none}
#wf-log-inhalt{display:none;max-height:220px;overflow-y:auto;padding:8px 12px;font-family:ui-monospace,Consolas,monospace;font-size:12px;border-top:1px solid var(--border)}
#wf-log-panel.offen #wf-log-inhalt{display:block}
.wf-log-zeile{white-space:pre-wrap;margin:2px 0;color:var(--text)}
.wf-log-zeile.fehler{color:var(--rot)}
.wf-log-zeile.hinweis{color:var(--muted)}
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
      '    <aside id="wf-palette">' + kacheln + '</aside>' +
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
    if (typ === "claude") return { prompt: "", modellId: "" };
    if (typ === "bedingung" || typ === "aktion") return { beschreibung: "" };
    if (typ === "notiz") return { text: "" };
    return {};
  }

  function begrenze(wert, min, max) {
    return Math.max(min, Math.min(max, wert));
  }

  // ---------- Laden und Auswahl ----------

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
      return '<option value="' + window.escapeHtml(w.id) + '">' + window.escapeHtml(w.name) + '</option>';
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

  function erstelleNodeElement(node) {
    const def = NODE_TYPEN[node.typ] || { icon: "?", label: node.typ };
    const el = document.createElement("div");
    el.className = "wf-node" + (node.id === editorState.ausgewaehlterNode ? " ausgewaehlt" : "");
    el.dataset.id = node.id;
    el.style.left = node.x + "px";
    el.style.top = node.y + "px";
    el.innerHTML =
      '<div class="wf-node-kopf"><span>' + def.icon + '</span>' +
      '<span class="wf-node-titel">' + window.escapeHtml(node.titel || def.label) + '</span>' +
      '<button class="wf-node-loeschen" title="Node löschen">×</button></div>' +
      '<div class="wf-node-typ">' + window.escapeHtml(def.label) + '</div>' +
      (node.typ !== "start" ? '<span class="wf-port wf-port-ein" data-node="' + window.escapeHtml(node.id) + '"></span>' : '') +
      '<span class="wf-port wf-port-aus" data-node="' + window.escapeHtml(node.id) + '"></span>';
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
    el.querySelector(".wf-port-aus").addEventListener("pointerdown", function (e) {
      starteVerbindungZiehen(e, node);
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
    }
    document.addEventListener("pointermove", beiBewegung);
    document.addEventListener("pointerup", beiEnde);
  }

  // ---------- Verbindungen ----------

  function portKoordinaten(nodeId, seite) {
    const node = findeNode(nodeId);
    const el = editorState.dom.canvas.querySelector('.wf-node[data-id="' + CSS.escape(nodeId) + '"]');
    if (!node || !el) return null;
    const y = node.y + el.offsetHeight / 2;
    if (seite === "aus") return { x: node.x + el.offsetWidth, y: y };
    return { x: node.x, y: y };
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

  function zeichneVerbindungen() {
    const svg = editorState.dom.svg;
    svg.innerHTML = "";
    if (!editorState.aktuelle) return;
    editorState.aktuelle.verbindungen.forEach(function (verbindung, index) {
      const von = portKoordinaten(verbindung.von, "aus");
      const zu = portKoordinaten(verbindung.zu, "ein");
      if (!von || !zu) return;
      const d = bezierPfad(von, zu);
      const sichtbar = pfadElement(d, "wf-kurve" +
        (index === editorState.ausgewaehlteVerbindung ? " ausgewaehlt" : ""));
      const treffer = pfadElement(d, "wf-kurve-hit");
      treffer.addEventListener("click", function (e) {
        e.stopPropagation();
        waehleVerbindung(index);
      });
      svg.appendChild(sichtbar);
      svg.appendChild(treffer);
    });
  }

  function starteVerbindungZiehen(e, vonNode) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const svg = editorState.dom.svg;
    const canvas = editorState.dom.canvas;
    const gummiband = pfadElement("", "wf-gummiband");
    svg.appendChild(gummiband);
    const start = portKoordinaten(vonNode.id, "aus");
    function beiBewegung(ev) {
      const rect = canvas.getBoundingClientRect();
      const maus = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
      gummiband.setAttribute("d", bezierPfad(start, maus));
    }
    function beiEnde(ev) {
      document.removeEventListener("pointermove", beiBewegung);
      document.removeEventListener("pointerup", beiEnde);
      gummiband.remove();
      const ziel = document.elementFromPoint(ev.clientX, ev.clientY);
      const port = ziel ? ziel.closest(".wf-port-ein") : null;
      if (port) verbinde(vonNode.id, port.dataset.node);
    }
    document.addEventListener("pointermove", beiBewegung);
    document.addEventListener("pointerup", beiEnde);
  }

  function verbinde(von, zu) {
    if (von === zu) { window.toast("Selbstbezug ist nicht erlaubt", "fehler"); return; }
    const existiert = editorState.aktuelle.verbindungen.some(function (v) {
      return v.von === von && v.zu === zu;
    });
    if (existiert) { window.toast("Verbindung existiert bereits", "fehler"); return; }
    editorState.aktuelle.verbindungen.push({ von: von, zu: zu });
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
      '<input id="wf-f-titel" class="eingabe" value="' + window.escapeHtml(node.titel || "") + '">');
    if (node.typ === "claude") html += baueClaudeFelder(cfg);
    else if (node.typ === "bedingung" || node.typ === "aktion") {
      html += feld("Beschreibung",
        '<textarea id="wf-f-beschreibung" class="eingabe">' +
        window.escapeHtml(cfg.beschreibung || "") + '</textarea>');
    } else if (node.typ === "notiz") {
      html += feld("Text",
        '<textarea id="wf-f-text" class="eingabe">' + window.escapeHtml(cfg.text || "") + '</textarea>');
    }
    panel.innerHTML = html;
    verdrahteNodeDetail(node);
  }

  function baueClaudeFelder(cfg) {
    const optionen = ['<option value="">Auto (Empfehlung)</option>'].concat(
      window.modelle.map(function (m) {
        const gewaehlt = m.id === cfg.modellId ? " selected" : "";
        return '<option value="' + window.escapeHtml(m.id) + '"' + gewaehlt + '>' +
          window.escapeHtml(m.name) + '</option>';
      })
    ).join("");
    return feld("Prompt",
      '<textarea id="wf-f-prompt" class="eingabe">' + window.escapeHtml(cfg.prompt || "") + '</textarea>') +
      feld("Modell",
        '<select id="wf-f-modell" class="eingabe">' + optionen + '</select>' +
        '<div id="wf-empfehlung"></div>');
  }

  function verdrahteNodeDetail(node) {
    const panel = editorState.dom.detail;
    const titelFeld = panel.querySelector("#wf-f-titel");
    titelFeld.addEventListener("input", function () {
      node.titel = titelFeld.value;
      const canvasTitel = editorState.dom.canvas.querySelector(
        '.wf-node[data-id="' + node.id + '"] .wf-node-titel');
      if (canvasTitel) canvasTitel.textContent = node.titel || NODE_TYPEN[node.typ].label;
    });
    verdrahteConfigFeld(panel, "#wf-f-beschreibung", node, "beschreibung");
    verdrahteConfigFeld(panel, "#wf-f-text", node, "text");
    verdrahteClaudeDetail(panel, node);
  }

  function verdrahteConfigFeld(panel, selektor, node, schluessel) {
    const eingabe = panel.querySelector(selektor);
    if (!eingabe) return;
    eingabe.addEventListener("input", function () {
      node.config[schluessel] = eingabe.value;
    });
  }

  function verdrahteClaudeDetail(panel, node) {
    const promptFeld = panel.querySelector("#wf-f-prompt");
    const modellFeld = panel.querySelector("#wf-f-modell");
    if (!promptFeld || !modellFeld) return;
    promptFeld.addEventListener("input", function () {
      node.config.prompt = promptFeld.value;
      aktualisiereEmpfehlung(node);
    });
    modellFeld.addEventListener("change", function () {
      node.config.modellId = modellFeld.value;
      aktualisiereEmpfehlung(node);
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
    panel.innerHTML =
      feld("Verbindung", '<div>' + window.escapeHtml(nodeTitel(verbindung.von)) +
        ' → ' + window.escapeHtml(nodeTitel(verbindung.zu)) + '</div>') +
      '<button id="wf-verbindung-loeschen" class="btn btn-gefahr">Verbindung löschen</button>' +
      '<p class="wf-detail-tipp">Tipp: Die Entf-Taste löscht die ausgewählte Verbindung.</p>';
    panel.querySelector("#wf-verbindung-loeschen").addEventListener("click", function () {
      loescheVerbindung(index);
    });
  }

  // ---------- Log-Panel und Ausfuehrung ----------

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

  function berechneReihenfolge() {
    const wf = editorState.aktuelle;
    const warteschlange = wf.nodes
      .filter(function (n) { return n.typ === "start"; })
      .map(function (n) { return n.id; });
    const besucht = new Set();
    const reihenfolge = [];
    while (warteschlange.length) {
      const id = warteschlange.shift();
      if (besucht.has(id)) continue;
      besucht.add(id);
      const node = findeNode(id);
      if (!node) continue;
      reihenfolge.push(node);
      wf.verbindungen.forEach(function (v) {
        if (v.von === id) warteschlange.push(v.zu);
      });
    }
    return reihenfolge;
  }

  async function fuehreWorkflowAus() {
    if (!editorState.aktuelle) { window.toast("Kein Workflow ausgewählt", "fehler"); return; }
    if (editorState.lauf) { window.toast("Es läuft bereits eine Ausführung", "fehler"); return; }
    const reihenfolge = berechneReihenfolge();
    if (!reihenfolge.length) {
      window.toast("Kein Start-Node vorhanden", "fehler");
      return;
    }
    oeffneLogPanel();
    logZeile("Lauf gestartet: " + editorState.aktuelle.name, "hinweis");
    editorState.lauf = { abgebrochen: false, stream: null, aufloesen: null };
    setzeLaufUi(true);
    try {
      for (const node of reihenfolge) {
        if (editorState.lauf.abgebrochen) break;
        await fuehreNodeAus(node);
      }
      logZeile(editorState.lauf.abgebrochen ? "Lauf abgebrochen." : "Lauf beendet.", "hinweis");
    } finally {
      editorState.lauf = null;
      setzeLaufUi(false);
    }
  }

  async function fuehreNodeAus(node) {
    const titel = node.titel || NODE_TYPEN[node.typ].label;
    const cfg = node.config || {};
    if (node.typ === "start") { logZeile("[" + titel + "] Start"); return; }
    if (node.typ === "claude") { await fuehreClaudeNodeAus(node, titel); return; }
    if (node.typ === "bedingung") {
      logZeile("[" + titel + "] Bedingung: " + (cfg.beschreibung || "ohne Beschreibung"));
      return;
    }
    if (node.typ === "aktion") {
      logZeile("[" + titel + "] Aktion: " + (cfg.beschreibung || "ohne Beschreibung"));
      return;
    }
    if (node.typ === "notiz") {
      logZeile("[" + titel + "] Notiz: " + (cfg.text || ""));
      return;
    }
    logZeile("[" + titel + "] Unbekannter Typ: " + node.typ, "fehler");
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
      logZeile("[" + titel + "] Claude startet");
      editorState.lauf.aufloesen = aufloesen;
      editorState.lauf.stream = window.claudeStream({
        prompt: cfg.prompt || "",
        modellId: modellId,
        cwd: (window.einstellungen && window.einstellungen.standardCwd) || "",
        zusatzFlags: (window.einstellungen && window.einstellungen.zusatzFlags) || "",
        onZeile: function (zeile) {
          const text = formatiereLaufZeile(zeile);
          if (text) logZeile("[" + titel + "] " + text);
        },
        onFehler: function (text) {
          logZeile("[" + titel + "] Fehler: " + text, "fehler");
        },
        onEnde: function (code) {
          logZeile("[" + titel + "] Beendet (Exit " + code + ")", "hinweis");
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
      await ladeWorkflows();
    }
  };
})();
