/* AIWorks Zentrale, Kern: API-Wrapper, Toast, Router, Claude-Stream, Dashboard-View. */

window.views = {};
window.einstellungen = {};

/* ---------- Hilfsfunktionen ---------- */

window.escapeHtml = function (s) {
  if (s === null || s === undefined) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

window.toast = function (text, art) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const el = document.createElement("div");
  el.className = "toast" + (art === "ok" ? " ok" : art === "fehler" ? " fehler" : "");
  el.textContent = text;
  container.appendChild(el);
  setTimeout(function () {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.3s";
    setTimeout(function () { el.remove(); }, 300);
  }, 4000);
};

/* ---------- API-Wrapper ---------- */

async function apiAnfrage(methode, pfad, body) {
  let antwort;
  try {
    antwort = await fetch(pfad, {
      method: methode,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch (netzFehler) {
    throw new Error("Server nicht erreichbar: " + netzFehler.message);
  }
  let daten = null;
  try {
    daten = await antwort.json();
  } catch (parseFehler) {
    daten = null;
  }
  if (!antwort.ok) {
    const text = daten && daten.fehler ? daten.fehler : "Fehler " + antwort.status;
    throw new Error(text);
  }
  return daten;
}

window.api = {
  get: function (pfad) { return apiAnfrage("GET", pfad); },
  post: function (pfad, body) { return apiAnfrage("POST", pfad, body); },
  put: function (pfad, body) { return apiAnfrage("PUT", pfad, body); },
  del: function (pfad) { return apiAnfrage("DELETE", pfad); }
};

/* ---------- Claude-Stream (SSE ueber fetch) ---------- */

function verarbeiteSseBlock(block, callbacks) {
  let eventName = "";
  const datenZeilen = [];
  for (const zeile of block.split(/\r?\n/)) {
    if (zeile.startsWith("event:")) eventName = zeile.slice(6).trim();
    else if (zeile.startsWith("data:")) datenZeilen.push(zeile.slice(5).replace(/^ /, ""));
  }
  if (datenZeilen.length === 0) return;
  const daten = datenZeilen.join("\n");
  if (eventName === "fehler") {
    if (callbacks.onFehler) callbacks.onFehler(daten);
  } else if (eventName === "ende") {
    if (callbacks.onEnde) callbacks.onEnde(parseInt(daten, 10));
  } else {
    let wert = daten;
    try { wert = JSON.parse(daten); } catch (e) { /* roher String bleibt */ }
    if (callbacks.onZeile) callbacks.onZeile(wert);
  }
}

window.claudeStream = function (optionen) {
  const controller = new AbortController();
  const callbacks = {
    onZeile: optionen.onZeile,
    onEnde: optionen.onEnde,
    onFehler: optionen.onFehler
  };

  (async function () {
    let antwort;
    try {
      antwort = await fetch("/api/claude/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: optionen.prompt,
          modellId: optionen.modellId,
          cwd: optionen.cwd,
          zusatzFlags: optionen.zusatzFlags
        }),
        signal: controller.signal
      });
    } catch (netzFehler) {
      if (netzFehler.name !== "AbortError" && callbacks.onFehler) {
        callbacks.onFehler("Verbindung fehlgeschlagen: " + netzFehler.message);
      }
      return;
    }
    if (!antwort.ok) {
      let text = "Fehler " + antwort.status;
      try {
        const daten = await antwort.json();
        if (daten && daten.fehler) text = daten.fehler;
      } catch (e) { /* Status-Text reicht */ }
      if (callbacks.onFehler) callbacks.onFehler(text);
      return;
    }

    const leser = antwort.body.getReader();
    const dekodierer = new TextDecoder();
    let puffer = "";
    try {
      while (true) {
        const { done, value } = await leser.read();
        if (done) break;
        puffer += dekodierer.decode(value, { stream: true });
        const bloecke = puffer.split(/\r?\n\r?\n/);
        puffer = bloecke.pop();
        for (const block of bloecke) {
          if (block.trim()) verarbeiteSseBlock(block, callbacks);
        }
      }
      if (puffer.trim()) verarbeiteSseBlock(puffer, callbacks);
    } catch (leseFehler) {
      if (leseFehler.name !== "AbortError" && callbacks.onFehler) {
        callbacks.onFehler("Stream abgebrochen: " + leseFehler.message);
      }
    }
  })();

  return {
    abbrechen: function () { controller.abort(); }
  };
};

/* ---------- Router ---------- */

function aktuelleViewAusHash() {
  const name = location.hash.replace(/^#/, "");
  return window.views[name] ? name : "dashboard";
}

async function rendereAktuelleView() {
  const name = aktuelleViewAusHash();
  const view = window.views[name];
  const container = document.getElementById("ansicht");
  if (!view || !container) return;

  document.querySelectorAll(".nav-btn").forEach(function (btn) {
    btn.classList.toggle("aktiv", btn.dataset.view === name);
  });

  container.innerHTML = "";
  try {
    await view.render(container);
  } catch (fehler) {
    console.error("View-Fehler (" + name + "):", fehler);
    container.innerHTML = '<div class="leer">Fehler beim Laden der Ansicht: '
      + window.escapeHtml(fehler.message) + "</div>";
  }
}

/* ---------- Dashboard-View ---------- */

function injiziereDashboardCss() {
  if (document.getElementById("css-dashboard")) return;
  const style = document.createElement("style");
  style.id = "css-dashboard";
  style.textContent = `
    .dash-kacheln { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .dash-kachel { cursor: pointer; transition: border-color 0.15s, transform 0.1s; }
    .dash-kachel:hover { border-color: var(--akzent); transform: translateY(-2px); }
    .dash-kachel .zahl { font-size: 34px; font-weight: 700; line-height: 1.2; }
    .dash-kachel .beschriftung { color: var(--muted); font-size: 13px; margin-top: 2px; }
    .zahl-gruen { color: var(--gruen); }
    .zahl-gelb { color: var(--gelb); }
    .zahl-rot { color: var(--rot); }
    .zahl-akzent { color: var(--akzent); }
    .dash-wegweiser { margin-bottom: 24px; }
    .dash-wegweiser h2 { margin: 0 0 12px; font-size: 16px; }
    .dash-schnell { display: flex; gap: 10px; flex-wrap: wrap; }
    .kosten-spalte { white-space: nowrap; color: var(--gelb); font-weight: 600; }
  `;
  document.head.appendChild(style);
}

function baueDashboardKachel(zahl, farbe, beschriftung, zielView) {
  return '<div class="karte dash-kachel" data-ziel="' + zielView + '">'
    + '<div class="zahl ' + farbe + '">' + zahl + "</div>"
    + '<div class="beschriftung">' + window.escapeHtml(beschriftung) + "</div>"
    + "</div>";
}

function baueModellTabelle() {
  const modelle = window.modelle || [];
  const zeilen = modelle.map(function (m) {
    return "<tr><td>" + window.escapeHtml(m.name) + "</td>"
      + "<td>" + window.escapeHtml(m.staerke) + "</td>"
      + '<td class="kosten-spalte">' + "$".repeat(m.kosten) + "</td></tr>";
  }).join("");
  return "<table><thead><tr><th>Modell</th><th>Stärke</th><th>Kosten</th></tr></thead>"
    + "<tbody>" + zeilen + "</tbody></table>";
}

async function rendereDashboard(container) {
  injiziereDashboardCss();

  let kunden = [];
  let workflows = [];
  try {
    const [kundenAntwort, workflowAntwort] = await Promise.all([
      window.api.get("/api/kunden"),
      window.api.get("/api/workflows")
    ]);
    kunden = kundenAntwort.kunden || [];
    workflows = workflowAntwort.workflows || [];
  } catch (fehler) {
    window.toast("Daten konnten nicht geladen werden: " + fehler.message, "fehler");
  }

  const anzahl = function (status) {
    return kunden.filter(function (k) { return k.status === status; }).length;
  };

  container.innerHTML = ''
    + '<div class="kopfzeile"><h1>Dashboard</h1></div>'
    + '<div class="dash-kacheln">'
    + baueDashboardKachel(anzahl("offen"), "zahl-rot", "Kunden offen", "kunden")
    + baueDashboardKachel(anzahl("in_arbeit"), "zahl-gelb", "Kunden in Bearbeitung", "kunden")
    + baueDashboardKachel(anzahl("fertig"), "zahl-gruen", "Kunden fertig", "kunden")
    + baueDashboardKachel(workflows.length, "zahl-akzent", "Workflows", "workflows")
    + "</div>"
    + '<div class="karte dash-wegweiser">'
    + "<h2>Modell-Wegweiser zum Token-Sparen</h2>"
    + baueModellTabelle()
    + "</div>"
    + '<div class="dash-schnell">'
    + '<button class="btn" data-ziel="kunden">Zu den Kunden</button>'
    + '<button class="btn" data-ziel="workflows">Zu den Workflows</button>'
    + '<button class="btn" data-ziel="claude">Claude starten</button>'
    + '<button class="btn" data-ziel="einstellungen">Einstellungen</button>'
    + "</div>";

  container.querySelectorAll("[data-ziel]").forEach(function (el) {
    el.addEventListener("click", function () {
      location.hash = "#" + el.dataset.ziel;
    });
  });
}

window.views.dashboard = {
  titel: "Dashboard",
  render: rendereDashboard
};

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", async function () {
  try {
    window.einstellungen = await window.api.get("/api/einstellungen");
  } catch (fehler) {
    window.einstellungen = {};
    window.toast("Einstellungen konnten nicht geladen werden: " + fehler.message, "fehler");
  }
  document.documentElement.dataset.theme = window.einstellungen.theme || "dunkel";

  document.querySelectorAll(".nav-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      location.hash = "#" + btn.dataset.view;
    });
  });

  window.addEventListener("hashchange", rendereAktuelleView);
  rendereAktuelleView();
});
