// Einstellungen-View: Allgemein, Modell-Regeln, Speichern und Modell-Katalog.
(function () {
  "use strict";

  let regeln = [];
  let wurzel = null;

  const FLAGS_INFO =
    "Claude läuft über dein eingeloggtes Claude-Konto (MAX), ein API-Schlüssel ist nicht nötig. " +
    "Für echte Datei-Änderungen und Builds braucht Claude ein Zusatz-Flag, " +
    "empfohlen: --permission-mode acceptEdits. Ohne das Flag fragt Claude bei jeder Änderung nach.";

  const REGEL_INFO =
    "Regeln werden von oben nach unten geprüft, der erste Treffer gewinnt. " +
    "Trifft keine Regel, wird Sonnet 5 genutzt.";

  function cssEinfuegen() {
    if (document.getElementById("css-einstellungen")) return;
    const style = document.createElement("style");
    style.id = "css-einstellungen";
    style.textContent = `
      .einst-karte { margin-bottom: 16px; }
      .einst-karte h2 { margin-bottom: 12px; font-size: 1.1em; }
      .einst-feld { display: block; margin-bottom: 12px; font-size: 0.9em; }
      .einst-feld .eingabe { width: 100%; max-width: 480px; margin-top: 4px; display: block; }
      .einst-hinweis { color: var(--muted); font-size: 0.8em; margin-top: 4px; }
      .regel-zeile { display: grid; grid-template-columns: 2fr 1fr 2fr auto; gap: 8px; margin-bottom: 8px; align-items: center; }
      .regel-btns { display: flex; gap: 4px; }
      .regel-btns .btn { padding: 4px 8px; }
      .katalog-tabelle { width: 100%; border-collapse: collapse; }
      .katalog-tabelle th, .katalog-tabelle td { text-align: left; padding: 6px 10px; border-bottom: 1px solid var(--border); font-size: 0.9em; }
      .katalog-tabelle th { color: var(--muted); font-weight: 600; }
      .katalog-id { color: var(--muted); font-family: monospace; font-size: 0.85em; }
      .einst-speichern-zeile { margin-top: 8px; }
    `;
    document.head.appendChild(style);
  }

  function regelZeileHtml(regel, index, anzahl) {
    const optionen = window.modelle.map(function (m) {
      const ausgewaehlt = m.id === regel.modellId ? " selected" : "";
      return '<option value="' + m.id + '"' + ausgewaehlt + ">" + window.escapeHtml(m.name) + "</option>";
    }).join("");
    const musterText = (regel.muster || []).join(", ");
    return (
      '<div class="regel-zeile" data-index="' + index + '">' +
      '<input class="eingabe regel-muster" placeholder="Muster, kommagetrennt" value="' + window.escapeHtml(musterText) + '">' +
      '<select class="eingabe regel-modell">' + optionen + "</select>" +
      '<input class="eingabe regel-grund" placeholder="Grund" value="' + window.escapeHtml(regel.grund || "") + '">' +
      '<div class="regel-btns">' +
      '<button class="btn regel-hoch" title="Nach oben"' + (index === 0 ? " disabled" : "") + ">&#8593;</button>" +
      '<button class="btn regel-runter" title="Nach unten"' + (index === anzahl - 1 ? " disabled" : "") + ">&#8595;</button>" +
      '<button class="btn btn-gefahr regel-entfernen" title="Zeile löschen">&#10005;</button>' +
      "</div></div>"
    );
  }

  function regelnAusDomLesen() {
    const zeilen = wurzel.querySelectorAll(".regel-zeile");
    regeln = Array.from(zeilen).map(function (zeile) {
      const muster = zeile.querySelector(".regel-muster").value
        .split(",")
        .map(function (wort) { return wort.trim(); })
        .filter(function (wort) { return wort.length > 0; });
      return {
        muster: muster,
        modellId: zeile.querySelector(".regel-modell").value,
        grund: zeile.querySelector(".regel-grund").value.trim()
      };
    });
  }

  function regelnRendern() {
    const liste = wurzel.querySelector("#regel-liste");
    if (regeln.length === 0) {
      liste.innerHTML = '<div class="leer">Keine Regeln definiert.</div>';
    } else {
      liste.innerHTML = regeln.map(function (regel, index) {
        return regelZeileHtml(regel, index, regeln.length);
      }).join("");
    }
    regelEreignisseVerbinden();
  }

  function regelEreignisseVerbinden() {
    wurzel.querySelectorAll(".regel-zeile").forEach(function (zeile) {
      const index = parseInt(zeile.dataset.index, 10);
      zeile.querySelector(".regel-entfernen").addEventListener("click", function () {
        regelnAusDomLesen();
        regeln = regeln.filter(function (_, i) { return i !== index; });
        regelnRendern();
      });
      zeile.querySelector(".regel-hoch").addEventListener("click", function () {
        regelVerschieben(index, -1);
      });
      zeile.querySelector(".regel-runter").addEventListener("click", function () {
        regelVerschieben(index, 1);
      });
    });
  }

  function regelVerschieben(index, richtung) {
    regelnAusDomLesen();
    const ziel = index + richtung;
    if (ziel < 0 || ziel >= regeln.length) return;
    const kopie = regeln.slice();
    const element = kopie[index];
    kopie[index] = kopie[ziel];
    kopie[ziel] = element;
    regeln = kopie;
    regelnRendern();
  }

  function katalogHtml() {
    const zeilen = window.modelle.map(function (m) {
      return (
        "<tr><td>" + window.escapeHtml(m.name) + "</td>" +
        '<td class="katalog-id">' + window.escapeHtml(m.id) + "</td>" +
        "<td>" + window.escapeHtml(m.staerke) + "</td>" +
        "<td>" + "$".repeat(m.kosten) + "</td></tr>"
      );
    }).join("");
    return (
      '<table class="katalog-tabelle"><thead><tr>' +
      "<th>Name</th><th>Modell-Id</th><th>Stärke</th><th>Kosten</th>" +
      "</tr></thead><tbody>" + zeilen + "</tbody></table>"
    );
  }

  function formularHtml(einst) {
    return (
      '<div class="kopfzeile"><h1>Einstellungen</h1></div>' +
      '<div class="karte einst-karte"><h2>Allgemein</h2>' +
      '<label class="einst-feld">Theme' +
      '<select class="eingabe" id="einst-theme">' +
      '<option value="dunkel"' + (einst.theme === "hell" ? "" : " selected") + ">Dunkel</option>" +
      '<option value="hell"' + (einst.theme === "hell" ? " selected" : "") + ">Hell</option>" +
      "</select></label>" +
      '<label class="einst-feld">Standard-Arbeitsordner' +
      '<input class="eingabe" id="einst-cwd" value="' + window.escapeHtml(einst.standardCwd || "") + '"></label>' +
      '<label class="einst-feld">Zusatz-Flags für Claude ' + window.infoIcon(FLAGS_INFO) +
      '<input class="eingabe" id="einst-flags" value="' + window.escapeHtml(einst.zusatzFlags || "") + '">' +
      "</label></div>" +
      '<div class="karte einst-karte"><h2>Modell-Regeln zum Token-Sparen ' + window.infoIcon(REGEL_INFO) + "</h2>" +
      '<div id="regel-liste"></div>' +
      '<button class="btn" id="regel-hinzufuegen">Zeile hinzufügen</button></div>' +
      '<div class="karte einst-karte"><h2>Modell-Katalog</h2>' + katalogHtml() + "</div>" +
      '<div class="einst-speichern-zeile">' +
      '<button class="btn btn-primaer" id="einst-speichern">Speichern</button></div>'
    );
  }

  async function speichern() {
    regelnAusDomLesen();
    const neu = Object.assign({}, window.einstellungen, {
      theme: wurzel.querySelector("#einst-theme").value,
      standardCwd: wurzel.querySelector("#einst-cwd").value.trim(),
      zusatzFlags: wurzel.querySelector("#einst-flags").value.trim(),
      standardModell: (window.einstellungen && window.einstellungen.standardModell) || "auto",
      modellRegeln: regeln
    });
    try {
      const gespeichert = await window.api.put("/api/einstellungen", neu);
      window.einstellungen = gespeichert;
      document.documentElement.dataset.theme = gespeichert.theme;
      window.toast("Gespeichert", "ok");
    } catch (fehler) {
      window.toast("Speichern fehlgeschlagen: " + fehler.message, "fehler");
    }
  }

  window.views.einstellungen = {
    titel: "Einstellungen",
    render: async function (container) {
      cssEinfuegen();
      wurzel = container;
      const einst = window.einstellungen || {};
      regeln = (einst.modellRegeln || []).map(function (regel) {
        return {
          muster: (regel.muster || []).slice(),
          modellId: regel.modellId || "",
          grund: regel.grund || ""
        };
      });
      container.innerHTML = formularHtml(einst);
      regelnRendern();
      container.querySelector("#einst-theme").addEventListener("change", function (ereignis) {
        document.documentElement.dataset.theme = ereignis.target.value;
      });
      container.querySelector("#regel-hinzufuegen").addEventListener("click", function () {
        regelnAusDomLesen();
        regeln = regeln.concat([{ muster: [], modellId: window.modelle[1].id, grund: "" }]);
        regelnRendern();
      });
      container.querySelector("#einst-speichern").addEventListener("click", speichern);
    }
  };
})();
