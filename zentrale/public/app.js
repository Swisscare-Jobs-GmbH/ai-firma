/* SEA (Software. Efficient. Automation.), Kern: API-Wrapper, Toast, Router, Claude-Stream,
   Seitenleiste, globale Tooltips, infoIcon, Dashboard-View. */

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

/* ---------- Layout-CSS (Seitenleiste, Tooltip, Info-Chip) ---------- */

function injiziereLayoutCss() {
  if (document.getElementById("css-layout")) return;
  const style = document.createElement("style");
  style.id = "css-layout";
  style.textContent = `
    #app { position: relative; padding-left: 64px; transition: padding-left 0.18s ease; }
    #app.sidebar-gepinnt { padding-left: 224px; }

    #seitenleiste {
      position: fixed; top: 0; left: 0; bottom: 0;
      width: 64px;
      overflow: hidden;
      z-index: 60;
      transition: width 0.18s ease, box-shadow 0.18s ease;
    }
    #seitenleiste.ist-gepinnt,
    #seitenleiste:not(.ist-gepinnt):hover { width: 224px; }
    #seitenleiste:not(.ist-gepinnt):hover { box-shadow: 0 14px 48px rgba(0, 0, 0, 0.5); }

    #seitenleiste-kopf {
      display: flex; align-items: center; justify-content: space-between;
      gap: 8px; margin-bottom: 6px;
    }

    .logo-mono { display: none; }
    .logo-voll { display: flex; flex-direction: column; line-height: 1.15; }
    .logo-wort { font-size: 18px; }
    .logo-claim {
      font-size: 9px; font-weight: 600; letter-spacing: 0.4px;
      text-transform: none; color: var(--muted);
      -webkit-text-fill-color: var(--muted);
    }

    .pin-btn {
      flex-shrink: 0;
      background: transparent; border: none; cursor: pointer;
      font-size: 15px; line-height: 1; padding: 5px 7px;
      border-radius: 9px; color: var(--muted);
      transition: background 0.15s, color 0.15s;
    }
    .pin-btn:hover { background: var(--akzent-weich); color: var(--text); }
    .pin-btn.aktiv { color: var(--akzent-hell); }
    .pin-btn:focus-visible { outline: 2px solid var(--akzent); outline-offset: 2px; }

    /* Eingeklappter Rail-Zustand: nur Icons, Beschriftungen und Voll-Logo aus */
    #seitenleiste:not(.ist-gepinnt):not(:hover) .nav-label,
    #seitenleiste:not(.ist-gepinnt):not(:hover) .logo-voll,
    #seitenleiste:not(.ist-gepinnt):not(:hover) .pin-btn { display: none; }
    #seitenleiste:not(.ist-gepinnt):not(:hover) .logo-mono {
      display: inline-flex; align-items: center; justify-content: center; width: 100%;
    }
    #seitenleiste:not(.ist-gepinnt):not(:hover) .nav-btn {
      text-align: center; padding-left: 0; padding-right: 0;
    }
    #seitenleiste:not(.ist-gepinnt):not(:hover) .nav-btn .nav-icon { font-size: 20px; }

    .nav-btn { white-space: nowrap; }
    .nav-icon { display: inline-flex; align-items: center; justify-content: center; width: 22px; }
    .svg-icon { display: block; flex-shrink: 0; }
    .pin-btn { display: inline-flex; align-items: center; justify-content: center; }
    .nav-btn .nav-label { margin-left: 8px; }
    .nav-btn:focus-visible { outline: 2px solid var(--akzent); outline-offset: 2px; }

    /* Sync-Knopf am Fuss der Seitenleiste */
    #seitenleiste-fuss { margin-top: auto; }
    .sync-btn { color: var(--akzent-hell); }
    .sync-btn.laeuft { opacity: 0.85; }
    .sync-btn.laeuft .nav-icon { animation: sea-spin 0.9s linear infinite; }
    @keyframes sea-spin { to { transform: rotate(360deg); } }

    /* Info-Chip (i) */
    .info-chip {
      display: inline-flex; align-items: center; justify-content: center;
      width: 16px; height: 16px; margin-left: 6px;
      border: 1px solid var(--akzent); border-radius: 50%;
      background: var(--akzent-weich); color: var(--akzent-hell);
      font-size: 11px; font-weight: 700; font-style: normal; line-height: 1;
      cursor: help; vertical-align: middle; user-select: none;
      transition: background 0.15s, color 0.15s;
    }
    .info-chip:hover, .info-chip:focus-visible {
      background: var(--akzent); color: #ffffff; outline: none;
    }

    /* Globaler Tooltip (ein wiederverwendetes Element) */
    #sea-tooltip {
      position: fixed; top: 0; left: 0; z-index: 500;
      max-width: 260px; padding: 9px 12px;
      background: var(--panel-2); border: 1px solid var(--border);
      border-radius: 10px; color: var(--text);
      font-size: 13px; line-height: 1.45;
      box-shadow: 0 12px 34px rgba(0, 0, 0, 0.5);
      pointer-events: none; opacity: 0;
      transform: translateY(4px);
      transition: opacity 0.14s ease, transform 0.14s ease;
    }
    #sea-tooltip.sichtbar { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);
}

/* ---------- Info-Chip (window.infoIcon) ---------- */

window.infoIcon = function (text) {
  const sicher = window.escapeHtml(text);
  return '<span class="info-chip" tabindex="0" role="img" data-info="' + sicher
    + '" aria-label="Info: ' + sicher + '">i</span>';
};

/* ---------- Globale Tooltips ---------- */

function seitenleisteIstOffen() {
  const leiste = document.getElementById("seitenleiste");
  if (!leiste) return false;
  return leiste.classList.contains("ist-gepinnt") || leiste.matches(":hover");
}

function tooltipTextFuer(el) {
  if (el.hasAttribute("data-info")) return el.getAttribute("data-info");
  // data-tooltip: bei Nav-Buttons nur zeigen, wenn die Leiste eingeklappt ist
  if (el.classList.contains("nav-btn") && seitenleisteIstOffen()) return null;
  return el.getAttribute("data-tooltip");
}

function initTooltips() {
  let tip = document.getElementById("sea-tooltip");
  if (!tip) {
    tip = document.createElement("div");
    tip.id = "sea-tooltip";
    tip.setAttribute("role", "tooltip");
    document.body.appendChild(tip);
  }
  let aktuellesZiel = null;

  function verstecke() {
    tip.classList.remove("sichtbar");
    aktuellesZiel = null;
  }

  function positioniere(el) {
    const rechteck = el.getBoundingClientRect();
    const tRechteck = tip.getBoundingClientRect();
    const rand = 8;
    const imLeiste = !!(el.closest && el.closest("#seitenleiste"));
    let oben, links;
    if (imLeiste) {
      links = rechteck.right + 10;
      oben = rechteck.top + rechteck.height / 2 - tRechteck.height / 2;
    } else {
      oben = rechteck.bottom + 8;
      links = rechteck.left + rechteck.width / 2 - tRechteck.width / 2;
    }
    links = Math.max(rand, Math.min(links, window.innerWidth - tRechteck.width - rand));
    oben = Math.max(rand, Math.min(oben, window.innerHeight - tRechteck.height - rand));
    tip.style.left = links + "px";
    tip.style.top = oben + "px";
  }

  function zeigeFuer(el) {
    if (el === aktuellesZiel && tip.classList.contains("sichtbar")) return;
    const text = tooltipTextFuer(el);
    if (!text) { verstecke(); return; }
    tip.textContent = text;
    positioniere(el);
    tip.classList.add("sichtbar");
    aktuellesZiel = el;
  }

  function quelleAus(ereignis) {
    const ziel = ereignis.target;
    return ziel && ziel.closest ? ziel.closest("[data-info],[data-tooltip]") : null;
  }

  document.addEventListener("mouseover", function (ereignis) {
    const el = quelleAus(ereignis);
    if (el) zeigeFuer(el);
  });
  document.addEventListener("mouseout", function (ereignis) {
    const el = quelleAus(ereignis);
    if (el && (!ereignis.relatedTarget || !el.contains(ereignis.relatedTarget))) verstecke();
  });
  document.addEventListener("focusin", function (ereignis) {
    const el = quelleAus(ereignis);
    if (el) zeigeFuer(el);
  });
  document.addEventListener("focusout", verstecke);
  window.addEventListener("scroll", verstecke, true);
  window.addEventListener("resize", verstecke);
}

/* ---------- Seitenleiste (einklappbar, Pin) ---------- */

function initSeitenleiste() {
  const leiste = document.getElementById("seitenleiste");
  const app = document.getElementById("app");
  const pinKnopf = document.getElementById("pin-btn");
  if (!leiste || !app || !pinKnopf) return;

  const SPEICHER_SCHLUESSEL = "sea_sidebar_pinned";

  function setzeGepinnt(gepinnt) {
    leiste.classList.toggle("ist-gepinnt", gepinnt);
    app.classList.toggle("sidebar-gepinnt", gepinnt);
    pinKnopf.classList.toggle("aktiv", gepinnt);
    pinKnopf.setAttribute("aria-pressed", gepinnt ? "true" : "false");
    const beschriftung = gepinnt ? "Seitenleiste loesen" : "Seitenleiste anheften";
    pinKnopf.setAttribute("aria-label", beschriftung);
    pinKnopf.setAttribute("data-tooltip", beschriftung);
  }

  let gepinnt = false;
  try {
    gepinnt = localStorage.getItem(SPEICHER_SCHLUESSEL) === "true";
  } catch (fehler) {
    gepinnt = false;
  }
  setzeGepinnt(gepinnt);

  pinKnopf.addEventListener("click", function () {
    gepinnt = !gepinnt;
    try {
      localStorage.setItem(SPEICHER_SCHLUESSEL, gepinnt ? "true" : "false");
    } catch (fehler) {
      window.toast("Pin-Zustand konnte nicht gespeichert werden.", "fehler");
    }
    setzeGepinnt(gepinnt);
  });
}

injiziereLayoutCss();

/* ---------- Sync-Knopf (committen, pullen, pushen) ---------- */

let syncLaeuftUi = false;

async function fuehreSyncAus() {
  if (syncLaeuftUi) return;
  const knopf = document.getElementById("sync-btn");
  syncLaeuftUi = true;
  if (knopf) { knopf.classList.add("laeuft"); knopf.disabled = true; }
  window.toast("Sync laeuft: committen, pullen, pushen.", "ok");
  try {
    const ergebnis = await window.api.post("/api/sync", {});
    const zusatz = ergebnis.head ? " (" + ergebnis.head + ")" : "";
    window.toast((ergebnis.meldung || "Sync abgeschlossen.") + zusatz, ergebnis.ok ? "ok" : "fehler");
  } catch (fehler) {
    window.toast("Sync fehlgeschlagen: " + fehler.message, "fehler");
  } finally {
    syncLaeuftUi = false;
    if (knopf) { knopf.classList.remove("laeuft"); knopf.disabled = false; }
  }
}

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
    .dash-kacheln { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 16px; margin-bottom: 24px; }
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

  let laufendeBuilds = null;
  try {
    const jobAntwort = await window.api.get("/api/jobs");
    const jobs = (jobAntwort && jobAntwort.jobs) || [];
    laufendeBuilds = jobs.filter(function (job) { return job.status === "laeuft"; }).length;
  } catch (fehler) {
    laufendeBuilds = null;
  }

  const anzahl = function (status) {
    return kunden.filter(function (k) { return k.status === status; }).length;
  };

  let kachelnHtml = ''
    + baueDashboardKachel(anzahl("offen"), "zahl-rot", "Kunden offen", "kunden")
    + baueDashboardKachel(anzahl("in_arbeit"), "zahl-gelb", "Kunden in Bearbeitung", "kunden")
    + baueDashboardKachel(anzahl("fertig"), "zahl-gruen", "Kunden fertig", "kunden")
    + baueDashboardKachel(workflows.length, "zahl-akzent", "Workflows", "workflows");
  if (laufendeBuilds !== null) {
    kachelnHtml += baueDashboardKachel(laufendeBuilds, "zahl-akzent", "Builds laufen", "generator");
  }

  const wegweiserInfo = window.infoIcon(
    "Firmen-Regel zum Token-Sparen: Recherche, Planung und Audit laufen auf Fabel 5, "
    + "der Bau von Features auf Opus 4.8. Generator und Claude-Chat waehlen danach automatisch."
  );

  container.innerHTML = ''
    + '<div class="kopfzeile"><h1>Dashboard</h1></div>'
    + '<div class="dash-kacheln">' + kachelnHtml + "</div>"
    + '<div class="karte dash-wegweiser">'
    + "<h2>Modell-Wegweiser " + wegweiserInfo + "</h2>"
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

  // Statische Icons (Seitenleiste, Pin, Sync) mit den professionellen SVGs fuellen.
  if (window.iconsAnwenden) window.iconsAnwenden(document);

  initSeitenleiste();
  initTooltips();

  document.querySelectorAll(".nav-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!btn.dataset.view) return;
      location.hash = "#" + btn.dataset.view;
    });
  });

  const syncKnopf = document.getElementById("sync-btn");
  if (syncKnopf) syncKnopf.addEventListener("click", fuehreSyncAus);

  window.addEventListener("hashchange", rendereAktuelleView);

  // Login-Gate: bei jedem Start fragen, wer arbeitet. Der Server laedt dann das
  // persoenliche Brain des gewaehlten Nutzers fuer alle Claude-Aufraufe.
  await starteMitLogin();
  rendereAktuelleView();
});

// Zeigt das Login-Overlay, setzt den aktiven Nutzer und den Seitenleisten-Chip.
async function starteMitLogin() {
  let nutzerListe = null;
  try {
    const status = await window.api.get("/api/nutzer/status");
    nutzerListe = status && status.nutzer;
  } catch (fehler) {
    // Ohne Status zeigt das Overlay die fest hinterlegten zwei Nutzer.
  }
  let user = null;
  if (window.loginAnzeigen) {
    user = await window.loginAnzeigen(nutzerListe);
  }
  window.aktiverNutzer = user;
  if (user && window.nutzerChipSetzen) window.nutzerChipSetzen(user);
}
