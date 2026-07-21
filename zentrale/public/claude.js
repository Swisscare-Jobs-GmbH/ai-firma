// claude.js: Chat-Ansicht, um Claude Code direkt aus der Plattform zu nutzen.
// Nutzt window.claudeStream, window.modelle, window.modellEmpfehlung und
// window.formatiereClaudeZeile. Der Verlauf lebt nur im Speicher der Session.

(function () {
  "use strict";

  const ORDNER_OPTIONEN = [
    "C:/Projects/AIWorks",
    "C:/Projects/AIWorks/ai-firma",
    "C:/Projects/AIWorks/finelli-lagerverwaltung",
    "C:/Projects/AIWorks/ai-firma/zentrale"
  ];

  // Eintraege: {rolle:"user", text} | {rolle:"info", text} | {rolle:"claude", zeilen:[{art, text}]}
  let verlauf = [];
  let aktiverLauf = null;
  let hinweisGezeigt = false;

  function cssEinfuegen() {
    if (document.getElementById("css-claude")) {
      return;
    }
    const style = document.createElement("style");
    style.id = "css-claude";
    style.textContent = [
      ".claude-view { display: flex; flex-direction: column; height: calc(100vh - 64px); gap: 12px; }",
      ".claude-kopf-aktionen { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }",
      ".claude-hinweis { background: var(--panel); border: 1px solid var(--border); border-radius: var(--radius);",
      "  padding: 10px 14px; color: var(--muted); font-size: 13px; display: flex; justify-content: space-between;",
      "  gap: 12px; align-items: center; }",
      ".claude-chat { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding: 4px; }",
      ".chat-blase { max-width: 75%; padding: 10px 14px; border-radius: var(--radius); white-space: pre-wrap;",
      "  word-break: break-word; line-height: 1.45; }",
      ".chat-user { align-self: flex-end; background: var(--akzent); color: #fff; }",
      ".chat-claude { align-self: flex-start; background: var(--panel); border: 1px solid var(--border); color: var(--text); }",
      ".chat-info { align-self: flex-start; font-size: 12px; color: var(--muted); padding: 0 4px; }",
      ".chat-zeile-werkzeug { font-size: 12px; color: var(--muted); }",
      ".chat-zeile-fehler { color: var(--rot); }",
      ".claude-eingabe { display: flex; gap: 8px; align-items: flex-end; }",
      ".claude-eingabe textarea { flex: 1; resize: vertical; min-height: 56px; }",
      ".claude-ordner-frei { min-width: 220px; }"
    ].join("\n");
    document.head.appendChild(style);
  }

  function scrolleAnsEnde(chatEl) {
    if (chatEl && chatEl.isConnected) {
      chatEl.scrollTop = chatEl.scrollHeight;
    }
  }

  function zeilenElement(zeile) {
    const el = document.createElement("div");
    if (zeile.art === "werkzeug") {
      el.className = "chat-zeile-werkzeug";
    } else if (zeile.art === "fehler") {
      el.className = "chat-zeile-fehler";
    }
    el.textContent = zeile.text;
    return el;
  }

  function eintragElement(eintrag) {
    const el = document.createElement("div");
    if (eintrag.rolle === "info") {
      el.className = "chat-info";
      el.textContent = eintrag.text;
      return el;
    }
    el.className = "chat-blase " + (eintrag.rolle === "user" ? "chat-user" : "chat-claude");
    if (eintrag.rolle === "user") {
      el.textContent = eintrag.text;
    } else {
      for (const zeile of eintrag.zeilen) {
        el.appendChild(zeilenElement(zeile));
      }
    }
    return el;
  }

  function leerElement() {
    const el = document.createElement("div");
    el.className = "leer";
    el.textContent = "Noch keine Nachrichten. Stelle unten deinen Auftrag an Claude.";
    return el;
  }

  function fuegeEintragHinzu(eintrag, chatEl) {
    verlauf.push(eintrag);
    const leerEl = chatEl.querySelector(".leer");
    if (leerEl) {
      leerEl.remove();
    }
    const el = eintragElement(eintrag);
    chatEl.appendChild(el);
    scrolleAnsEnde(chatEl);
    return el;
  }

  // Haengt eine Zeile an die laufende Claude-Antwort an (Daten immer, DOM nur
  // wenn die Ansicht noch offen ist).
  function zeileAnhaengen(art, text) {
    if (!aktiverLauf) {
      return;
    }
    const zeile = { art: art, text: text };
    aktiverLauf.eintrag.zeilen.push(zeile);
    if (aktiverLauf.blaseEl && aktiverLauf.blaseEl.isConnected) {
      aktiverLauf.blaseEl.appendChild(zeilenElement(zeile));
      scrolleAnsEnde(document.getElementById("claude-chat"));
    }
  }

  function verarbeiteStreamZeile(daten) {
    const text = window.formatiereClaudeZeile(daten);
    if (text === null || text === undefined) {
      return;
    }
    for (const zeile of String(text).split("\n")) {
      if (zeile.trim() === "") {
        continue;
      }
      const art = zeile.startsWith("[Werkzeug:") ? "werkzeug" : "text";
      zeileAnhaengen(art, zeile);
    }
  }

  function setzeSendeknopf(laeuft) {
    const btn = document.getElementById("claude-senden");
    if (!btn) {
      return;
    }
    btn.textContent = laeuft ? "Stopp" : "Senden";
    btn.classList.toggle("btn-gefahr", laeuft);
    btn.classList.toggle("btn-primaer", !laeuft);
  }

  function beendeLauf() {
    aktiverLauf = null;
    setzeSendeknopf(false);
  }

  function stoppeLauf() {
    if (!aktiverLauf) {
      return;
    }
    if (aktiverLauf.handle && typeof aktiverLauf.handle.abbrechen === "function") {
      aktiverLauf.handle.abbrechen();
    }
    zeileAnhaengen("fehler", "Vom Benutzer gestoppt.");
    beendeLauf();
  }

  function ermittleCwd() {
    const frei = document.getElementById("claude-ordner-frei");
    const auswahl = document.getElementById("claude-ordner");
    const freiWert = frei ? frei.value.trim() : "";
    if (freiWert) {
      return freiWert;
    }
    if (auswahl && auswahl.value) {
      return auswahl.value;
    }
    return (window.einstellungen && window.einstellungen.standardCwd) || ORDNER_OPTIONEN[0];
  }

  function starteLauf() {
    if (aktiverLauf) {
      return;
    }
    const eingabe = document.getElementById("claude-prompt");
    const chatEl = document.getElementById("claude-chat");
    const prompt = eingabe ? eingabe.value.trim() : "";
    if (!prompt || !chatEl) {
      return;
    }
    eingabe.value = "";
    fuegeEintragHinzu({ rolle: "user", text: prompt }, chatEl);

    const modellSelect = document.getElementById("claude-modell");
    let modellId = modellSelect ? modellSelect.value : "";
    if (!modellId) {
      const empfehlung = window.modellEmpfehlung(prompt);
      modellId = empfehlung.modellId;
      fuegeEintragHinzu(
        { rolle: "info", text: "Modell: " + empfehlung.name + ". " + empfehlung.grund },
        chatEl
      );
    }

    const eintrag = { rolle: "claude", zeilen: [] };
    const blaseEl = fuegeEintragHinzu(eintrag, chatEl);
    aktiverLauf = { eintrag: eintrag, blaseEl: blaseEl, handle: null };
    setzeSendeknopf(true);
    starteStream(prompt, modellId);
  }

  function starteStream(prompt, modellId) {
    try {
      aktiverLauf.handle = window.claudeStream({
        prompt: prompt,
        modellId: modellId,
        cwd: ermittleCwd(),
        zusatzFlags: (window.einstellungen && window.einstellungen.zusatzFlags) || "",
        onZeile: verarbeiteStreamZeile,
        onFehler: function (text) {
          zeileAnhaengen("fehler", text);
        },
        onEnde: function (code) {
          if (String(code) !== "0") {
            zeileAnhaengen("fehler", "Beendet mit Exit-Code " + code);
          }
          beendeLauf();
        }
      });
    } catch (fehler) {
      console.error("claudeStream konnte nicht gestartet werden", fehler);
      zeileAnhaengen("fehler", "Start fehlgeschlagen: " + (fehler.message || fehler));
      beendeLauf();
    }
  }

  function chatLeeren() {
    if (aktiverLauf) {
      stoppeLauf();
    }
    verlauf = [];
    const chatEl = document.getElementById("claude-chat");
    if (chatEl) {
      chatEl.innerHTML = "";
      chatEl.appendChild(leerElement());
    }
  }

  function baueModellSelect() {
    const select = document.createElement("select");
    select.id = "claude-modell";
    select.className = "eingabe";
    select.title = "Modell";
    const auto = document.createElement("option");
    auto.value = "";
    auto.textContent = "Auto (spart Tokens)";
    select.appendChild(auto);
    for (const modell of window.modelle) {
      const option = document.createElement("option");
      option.value = modell.id;
      option.textContent = modell.name + " (" + "$".repeat(modell.kosten) + ")";
      select.appendChild(option);
    }
    return select;
  }

  function baueOrdnerAuswahl() {
    const standardCwd =
      (window.einstellungen && window.einstellungen.standardCwd) || ORDNER_OPTIONEN[0];
    const ordnerSelect = document.createElement("select");
    ordnerSelect.id = "claude-ordner";
    ordnerSelect.className = "eingabe";
    ordnerSelect.title = "Arbeitsordner";
    for (const pfad of ORDNER_OPTIONEN) {
      const option = document.createElement("option");
      option.value = pfad;
      option.textContent = pfad;
      ordnerSelect.appendChild(option);
    }
    const ordnerFrei = document.createElement("input");
    ordnerFrei.id = "claude-ordner-frei";
    ordnerFrei.type = "text";
    ordnerFrei.className = "eingabe claude-ordner-frei";
    ordnerFrei.placeholder = "Eigener Pfad (überschreibt die Auswahl)";
    if (ORDNER_OPTIONEN.includes(standardCwd)) {
      ordnerSelect.value = standardCwd;
    } else {
      ordnerFrei.value = standardCwd;
    }
    ordnerSelect.addEventListener("change", function () {
      ordnerFrei.value = "";
    });
    return { ordnerSelect: ordnerSelect, ordnerFrei: ordnerFrei };
  }

  function baueKopfzeile() {
    const kopf = document.createElement("div");
    kopf.className = "kopfzeile";
    const titel = document.createElement("h1");
    titel.textContent = "Claude";
    kopf.appendChild(titel);

    const aktionen = document.createElement("div");
    aktionen.className = "claude-kopf-aktionen";
    aktionen.appendChild(baueModellSelect());
    const ordner = baueOrdnerAuswahl();
    aktionen.appendChild(ordner.ordnerSelect);
    aktionen.appendChild(ordner.ordnerFrei);

    const leerenBtn = document.createElement("button");
    leerenBtn.className = "btn";
    leerenBtn.textContent = "Chat leeren";
    leerenBtn.addEventListener("click", chatLeeren);
    aktionen.appendChild(leerenBtn);

    kopf.appendChild(aktionen);
    return kopf;
  }

  function baueHinweis() {
    const leiste = document.createElement("div");
    leiste.className = "claude-hinweis";
    const text = document.createElement("span");
    text.textContent =
      "Hinweis: Jeder Auftrag startet eine frische claude -p Sitzung ohne Gedächtnis " +
      "an vorherige Nachrichten. Für Datei-Änderungen die Zusatz-Flags in den Einstellungen setzen.";
    leiste.appendChild(text);
    const schliessenBtn = document.createElement("button");
    schliessenBtn.className = "btn";
    schliessenBtn.textContent = "Verstanden";
    schliessenBtn.addEventListener("click", function () {
      leiste.remove();
    });
    leiste.appendChild(schliessenBtn);
    return leiste;
  }

  function baueEingabe() {
    const bereich = document.createElement("div");
    bereich.className = "claude-eingabe";
    const textarea = document.createElement("textarea");
    textarea.id = "claude-prompt";
    textarea.className = "eingabe";
    textarea.placeholder = "Auftrag an Claude (Enter sendet, Shift+Enter für neue Zeile)";
    textarea.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (!aktiverLauf) {
          starteLauf();
        }
      }
    });
    const btn = document.createElement("button");
    btn.id = "claude-senden";
    btn.className = "btn btn-primaer";
    btn.textContent = "Senden";
    btn.addEventListener("click", function () {
      if (aktiverLauf) {
        stoppeLauf();
      } else {
        starteLauf();
      }
    });
    bereich.appendChild(textarea);
    bereich.appendChild(btn);
    return bereich;
  }

  async function renderClaude(container) {
    cssEinfuegen();
    container.innerHTML = "";

    const view = document.createElement("div");
    view.className = "claude-view";
    view.appendChild(baueKopfzeile());
    if (!hinweisGezeigt) {
      view.appendChild(baueHinweis());
      hinweisGezeigt = true;
    }

    const chatEl = document.createElement("div");
    chatEl.id = "claude-chat";
    chatEl.className = "claude-chat";
    if (verlauf.length === 0) {
      chatEl.appendChild(leerElement());
    }
    for (const eintrag of verlauf) {
      const el = eintragElement(eintrag);
      chatEl.appendChild(el);
      if (aktiverLauf && aktiverLauf.eintrag === eintrag) {
        aktiverLauf.blaseEl = el;
      }
    }
    view.appendChild(chatEl);
    view.appendChild(baueEingabe());
    container.appendChild(view);

    setzeSendeknopf(!!aktiverLauf);
    scrolleAnsEnde(chatEl);
  }

  window.views = window.views || {};
  window.views.claude = { titel: "Claude", render: renderClaude };
})();
