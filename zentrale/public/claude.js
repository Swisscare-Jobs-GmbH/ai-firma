// claude.js: Claude-Ansicht als vollwertiges Chat-Fenster (wie das Original).
// Persistente Gespraeche mit Gedaechtnis (Backend /api/chats/*), Sidebar mit
// gespeicherten Chats, Markdown- und Code-Rendering, Live-Streaming.
// Nutzt window.api, window.toast, window.escapeHtml, window.infoIcon,
// window.modelle sowie die Vendor-Libs marked, DOMPurify und hljs.

(function () {
  "use strict";

  const ORDNER_OPTIONEN = [
    "C:/Projects/AIWorks",
    "C:/Projects/AIWorks/ai-firma",
    "C:/Projects/AIWorks/finelli-lagerverwaltung",
    "C:/Projects/AIWorks/ai-firma/zentrale"
  ];

  // Kurzer Erklaertext hinter dem (i)-Chip im Kopf.
  const KONTO_HINWEIS =
    "Läuft über das aktive Claude-Konto (im Konten-Tab wechselbar, gilt PC-weit). " +
    "Jeder Chat merkt sich seinen Verlauf und wird gespeichert. \"Bauen erlauben\" " +
    "schaltet Datei-Änderungen frei (sonst nur lesen und antworten).";

  // ---- Modul-Zustand ----
  let chats = [];          // Metadaten aller Chats
  let aktiverChatId = null;
  let aktiverChat = null;  // volle Daten des offenen Chats
  let aktiverLauf = null;  // { handle, segmente, inhaltEl }
  let sucheText = "";

  // ---------- CSS ----------

  function cssEinfuegen() {
    if (document.getElementById("css-claude")) {
      return;
    }
    const style = document.createElement("style");
    style.id = "css-claude";
    style.textContent = [
      ".claude-view { display: flex; height: calc(100vh - 32px); gap: 0; }",
      // Sidebar
      ".chat-sidebar { width: 260px; flex-shrink: 0; display: flex; flex-direction: column;",
      "  border-right: 1px solid var(--border); padding-right: 12px; gap: 10px; }",
      ".chat-sidebar-kopf { display: flex; flex-direction: column; gap: 8px; }",
      ".chat-neu-btn { width: 100%; justify-content: center; }",
      ".chat-suche { width: 100%; }",
      ".chat-liste { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; }",
      ".chat-gruppe-titel { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;",
      "  color: var(--muted); margin: 12px 4px 4px; }",
      ".chat-eintrag { display: flex; align-items: center; gap: 6px; padding: 8px 10px; border-radius: var(--radius);",
      "  cursor: pointer; color: var(--text); font-size: 13px; border: 1px solid transparent; }",
      ".chat-eintrag:hover { background: var(--panel-2); }",
      ".chat-eintrag.aktiv { background: var(--akzent-weich); border-color: var(--akzent); }",
      ".chat-eintrag-titel { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }",
      ".chat-eintrag-loeschen { opacity: 0; border: none; background: transparent; color: var(--muted);",
      "  cursor: pointer; font-size: 14px; padding: 2px 4px; border-radius: 6px; flex-shrink: 0; }",
      ".chat-eintrag:hover .chat-eintrag-loeschen { opacity: 1; }",
      ".chat-eintrag-loeschen:hover { background: var(--rot); color: #fff; }",
      // Hauptbereich
      ".chat-haupt { flex: 1; display: flex; flex-direction: column; min-width: 0; padding-left: 16px; }",
      ".chat-kopf { display: flex; align-items: center; gap: 10px; flex-wrap: wrap;",
      "  padding-bottom: 10px; border-bottom: 1px solid var(--border); }",
      ".chat-kopf-titel { flex: 1; min-width: 120px; font-size: 16px; font-weight: 600; color: var(--text);",
      "  background: transparent; border: 1px solid transparent; border-radius: 8px; padding: 4px 8px; }",
      ".chat-kopf-titel:hover { border-color: var(--border); }",
      ".chat-kopf-titel:focus { border-color: var(--akzent); outline: none; background: var(--panel); }",
      ".chat-bauen { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted);",
      "  cursor: pointer; user-select: none; white-space: nowrap; }",
      ".chat-bauen input { accent-color: var(--akzent); }",
      ".chat-cwd { font-size: 11px; color: var(--muted); }",
      // Nachrichten
      ".chat-nachrichten { flex: 1; overflow-y: auto; display: flex; flex-direction: column;",
      "  gap: 20px; padding: 20px 4px; }",
      ".chat-nachrichten-innen { width: 100%; max-width: 760px; margin: 0 auto; display: flex;",
      "  flex-direction: column; gap: 20px; }",
      ".msg { display: flex; gap: 12px; }",
      ".msg-avatar { width: 26px; height: 26px; border-radius: 7px; flex-shrink: 0; display: flex;",
      "  align-items: center; justify-content: center; font-size: 13px; font-weight: 700; }",
      ".msg-user .msg-avatar { background: var(--akzent); color: #fff; }",
      ".msg-claude .msg-avatar { background: var(--panel-2); border: 1px solid var(--border); }",
      ".msg-inhalt { flex: 1; min-width: 0; line-height: 1.6; color: var(--text); }",
      ".msg-user .msg-inhalt { white-space: pre-wrap; word-break: break-word; }",
      ".msg-rolle { font-size: 12px; font-weight: 700; color: var(--muted); margin-bottom: 2px; }",
      ".msg-werkzeug { font-size: 12px; color: var(--muted); background: var(--panel-2);",
      "  border: 1px solid var(--border); border-radius: 8px; padding: 4px 10px; margin: 6px 0; display: inline-block; }",
      ".msg-fehler { color: var(--rot); font-size: 13px; margin-top: 4px; }",
      ".msg-denkt { color: var(--muted); font-style: italic; }",
      ".msg-meta { font-size: 11px; color: var(--muted); margin-top: 6px; }",
      // Markdown-Inhalt
      ".md p { margin: 0 0 10px; }", ".md p:last-child { margin-bottom: 0; }",
      ".md ul, .md ol { margin: 0 0 10px; padding-left: 22px; }",
      ".md li { margin: 2px 0; }",
      ".md h1, .md h2, .md h3 { margin: 16px 0 8px; line-height: 1.3; }",
      ".md h1 { font-size: 20px; } .md h2 { font-size: 17px; } .md h3 { font-size: 15px; }",
      ".md a { color: var(--akzent-hell); }",
      ".md code { background: var(--panel-2); border: 1px solid var(--border); border-radius: 5px;",
      "  padding: 1px 5px; font-size: 12.5px; font-family: 'Cascadia Code', Consolas, monospace; }",
      ".md pre { position: relative; margin: 0 0 12px; }",
      ".md pre code { display: block; padding: 12px 14px; border-radius: 10px; overflow-x: auto;",
      "  border: 1px solid var(--border); font-size: 12.5px; line-height: 1.5; }",
      ".md blockquote { border-left: 3px solid var(--border); margin: 0 0 10px; padding: 2px 0 2px 12px; color: var(--muted); }",
      ".md table { border-collapse: collapse; margin: 0 0 12px; font-size: 13px; }",
      ".md th, .md td { border: 1px solid var(--border); padding: 5px 9px; }",
      ".code-copy { position: absolute; top: 8px; right: 8px; font-size: 11px; padding: 3px 8px;",
      "  border: 1px solid var(--border); background: var(--panel); color: var(--muted);",
      "  border-radius: 6px; cursor: pointer; opacity: 0; transition: opacity 0.15s; }",
      ".md pre:hover .code-copy { opacity: 1; }",
      ".code-copy:hover { color: var(--text); border-color: var(--akzent); }",
      // Eingabe
      ".chat-eingabe { padding: 12px 0 4px; }",
      ".chat-eingabe-innen { max-width: 760px; margin: 0 auto; display: flex; gap: 8px; align-items: flex-end;",
      "  background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 8px 8px 8px 14px; }",
      ".chat-eingabe-innen:focus-within { border-color: var(--akzent); }",
      ".chat-eingabe textarea { flex: 1; resize: none; min-height: 24px; max-height: 200px; border: none;",
      "  background: transparent; color: var(--text); font-size: 14px; line-height: 1.5; padding: 4px 0; outline: none; }",
      ".chat-senden-btn { flex-shrink: 0; border-radius: 10px; }",
      // Konto-Chip
      ".konto-chip { font-size: 12px; color: var(--muted); background: var(--panel-2);",
      "  border: 1px solid var(--border); border-radius: 999px; padding: 3px 10px; cursor: pointer; white-space: nowrap; }",
      ".konto-chip:hover, .konto-chip:focus-visible { border-color: var(--akzent); color: var(--text); outline: none; }",
      // Leerzustand
      ".chat-willkommen { flex: 1; display: flex; flex-direction: column; align-items: center;",
      "  justify-content: center; gap: 8px; color: var(--muted); text-align: center; }",
      ".chat-willkommen h2 { color: var(--text); font-size: 22px; margin: 0; }",
      // Sidebar-Fuss + Memory
      ".chat-sidebar-fuss { border-top: 1px solid var(--border); padding-top: 8px; }",
      ".chat-memory-btn { width: 100%; justify-content: center; }",
      // Modal
      ".sea-modal-hg { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200;",
      "  display: flex; align-items: center; justify-content: center; padding: 20px; }",
      ".sea-modal { background: var(--panel); border: 1px solid var(--border); border-radius: 14px;",
      "  width: 100%; max-width: 640px; max-height: 80vh; display: flex; flex-direction: column; gap: 12px; padding: 20px; }",
      ".sea-modal h2 { margin: 0; font-size: 18px; }",
      ".sea-modal-hinweis { font-size: 12px; color: var(--muted); }",
      ".sea-modal textarea { width: 100%; min-height: 260px; resize: vertical; font-family: 'Cascadia Code', Consolas, monospace;",
      "  font-size: 13px; line-height: 1.5; }",
      ".sea-modal-aktionen { display: flex; justify-content: flex-end; gap: 8px; }"
    ].join("\n");
    document.head.appendChild(style);
  }

  // ---------- Hilfen ----------

  function knopf(text, klassen, handler) {
    const btn = document.createElement("button");
    btn.className = klassen;
    btn.textContent = text;
    btn.addEventListener("click", handler);
    return btn;
  }

  function el(tag, klasse, text) {
    const e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  // ---------- Markdown ----------

  // Wandelt Markdown-Text in sicheres HTML (marked → DOMPurify).
  function markdownZuHtml(text) {
    const roh = String(text || "");
    if (!window.marked) {
      return window.escapeHtml(roh);
    }
    let html;
    try {
      html = window.marked.parse(roh, { breaks: true, gfm: true });
    } catch (fehler) {
      return window.escapeHtml(roh);
    }
    return window.DOMPurify ? window.DOMPurify.sanitize(html) : html;
  }

  // Code-Bloecke einfaerben und einen Kopier-Knopf anhaengen.
  function verschoeneCode(container) {
    const bloecke = container.querySelectorAll("pre code");
    for (const block of bloecke) {
      if (window.hljs) {
        try { window.hljs.highlightElement(block); } catch (fehler) { /* egal */ }
      }
      const pre = block.parentElement;
      if (pre && !pre.querySelector(".code-copy")) {
        const btn = el("button", "code-copy", "Kopieren");
        btn.type = "button";
        btn.addEventListener("click", function () {
          const text = block.textContent || "";
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
              btn.textContent = "Kopiert";
              setTimeout(function () { btn.textContent = "Kopieren"; }, 1500);
            }).catch(function () { btn.textContent = "Fehler"; });
          }
        });
        pre.appendChild(btn);
      }
    }
  }

  // Setzt gerenderten Markdown in ein Element (mit Code-Verschoenerung).
  function setzeMarkdown(elm, text) {
    elm.innerHTML = markdownZuHtml(text);
    verschoeneCode(elm);
  }

  // ---------- Konto-Chip ----------

  async function ladeKontoChip(chip) {
    try {
      const daten = await window.api.get("/api/konten/status");
      const aktiv = daten && daten.active;
      if (!aktiv) {
        if (chip.isConnected) chip.textContent = "Konto: unbekannt";
        return;
      }
      let text = "Konto: " + (aktiv.alias || aktiv.email || ("Nr. " + aktiv.number));
      const usage = aktiv.usage;
      if (usage && usage.fiveHour && usage.sevenDay
          && typeof usage.fiveHour.pct === "number" && typeof usage.sevenDay.pct === "number") {
        text += " · 5h " + usage.fiveHour.pct + "% · 7d " + usage.sevenDay.pct + "%";
      }
      if (chip.isConnected) chip.textContent = text;
    } catch (fehler) {
      if (chip.isConnected) chip.textContent = "Konto: unbekannt";
    }
  }

  function baueKontoChip() {
    const chip = el("span", "konto-chip", "Konto: …");
    chip.id = "claude-konto-chip";
    chip.setAttribute("data-tooltip", "Zu den Konten wechseln");
    chip.setAttribute("tabindex", "0");
    chip.setAttribute("role", "button");
    function zuKonten() { location.hash = "#konten"; }
    chip.addEventListener("click", zuKonten);
    chip.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); zuKonten(); }
    });
    ladeKontoChip(chip);
    return chip;
  }

  // ---------- Sidebar / Chat-Liste ----------

  // Ordnet Chats nach Aktualisierungs-Datum in Gruppen (Heute/Gestern/Aelter).
  function gruppiereChats(liste) {
    const heute = new Date();
    const tag = function (d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); };
    const heuteTag = tag(heute);
    const gesternTag = heuteTag - 86400000;
    const gruppen = { "Heute": [], "Gestern": [], "Älter": [] };
    for (const c of liste) {
      const d = c.aktualisiert ? new Date(c.aktualisiert) : null;
      const t = d && !isNaN(d.getTime()) ? tag(d) : 0;
      if (t === heuteTag) gruppen["Heute"].push(c);
      else if (t === gesternTag) gruppen["Gestern"].push(c);
      else gruppen["Älter"].push(c);
    }
    return gruppen;
  }

  function chatEintragEl(c) {
    const eintrag = el("div", "chat-eintrag" + (c.id === aktiverChatId ? " aktiv" : ""));
    eintrag.appendChild(el("span", "chat-eintrag-titel", c.titel || "Neuer Chat"));
    const loeschen = el("button", "chat-eintrag-loeschen", "×");
    loeschen.type = "button";
    loeschen.title = "Chat löschen";
    loeschen.addEventListener("click", function (ereignis) {
      ereignis.stopPropagation();
      loescheChat(c.id, c.titel);
    });
    eintrag.appendChild(loeschen);
    eintrag.addEventListener("click", function () { oeffneChat(c.id); });
    return eintrag;
  }

  function rendereListe() {
    const listeEl = document.getElementById("chat-liste");
    if (!listeEl) return;
    listeEl.innerHTML = "";
    const gefiltert = sucheText
      ? chats.filter(function (c) { return (c.titel || "").toLowerCase().includes(sucheText); })
      : chats;
    if (gefiltert.length === 0) {
      listeEl.appendChild(el("div", "chat-gruppe-titel", sucheText ? "Nichts gefunden" : "Noch keine Chats"));
      return;
    }
    const gruppen = gruppiereChats(gefiltert);
    for (const name of ["Heute", "Gestern", "Älter"]) {
      if (gruppen[name].length === 0) continue;
      listeEl.appendChild(el("div", "chat-gruppe-titel", name));
      for (const c of gruppen[name]) {
        listeEl.appendChild(chatEintragEl(c));
      }
    }
  }

  async function ladeListe() {
    try {
      const daten = await window.api.get("/api/chats");
      chats = Array.isArray(daten.chats) ? daten.chats : [];
    } catch (fehler) {
      window.toast("Chats konnten nicht geladen werden: " + fehler.message, "fehler");
      chats = [];
    }
    rendereListe();
  }

  // ---------- Nachrichten anzeigen ----------

  function avatarEl(rolle) {
    const a = el("div", "msg-avatar", rolle === "user" ? "Du" : "C");
    return a;
  }

  // Baut die Blase einer gespeicherten Nachricht.
  function nachrichtEl(nachricht) {
    const rolle = nachricht.rolle === "user" ? "user" : "claude";
    const msg = el("div", "msg msg-" + rolle);
    msg.appendChild(avatarEl(rolle));
    const inhalt = el("div", "msg-inhalt");
    if (rolle === "user") {
      inhalt.textContent = nachricht.text || "";
    } else {
      if (nachricht.text && nachricht.text.trim() !== "") {
        const md = el("div", "md");
        setzeMarkdown(md, nachricht.text);
        inhalt.appendChild(md);
      } else {
        inhalt.appendChild(el("div", "msg-fehler", "(keine Antwort)"));
      }
      if (typeof nachricht.exitCode === "number" && nachricht.exitCode !== 0) {
        inhalt.appendChild(el("div", "msg-fehler", "Beendet mit Exit-Code " + nachricht.exitCode));
      }
    }
    msg.appendChild(inhalt);
    return msg;
  }

  function scrolleAnsEnde() {
    const box = document.getElementById("chat-nachrichten");
    if (box) box.scrollTop = box.scrollHeight;
  }

  function rendereNachrichten() {
    const box = document.getElementById("chat-nachrichten");
    if (!box) return;
    box.innerHTML = "";
    const innen = el("div", "chat-nachrichten-innen");
    innen.id = "chat-nachrichten-innen";
    box.appendChild(innen);
    const nachrichten = (aktiverChat && Array.isArray(aktiverChat.nachrichten)) ? aktiverChat.nachrichten : [];
    if (nachrichten.length === 0) {
      innen.appendChild(el("div", "msg-denkt", "Noch keine Nachrichten. Stelle unten deine erste Frage."));
    }
    for (const n of nachrichten) {
      innen.appendChild(nachrichtEl(n));
    }
    scrolleAnsEnde();
  }

  // ---------- Streaming einer Antwort ----------

  // Rendert die laufende Antwort aus ihren Segmenten (Text + Werkzeug-Chips).
  function rendereLauf() {
    if (!aktiverLauf || !aktiverLauf.inhaltEl) return;
    const inhalt = aktiverLauf.inhaltEl;
    inhalt.innerHTML = "";
    let hatInhalt = false;
    for (const seg of aktiverLauf.segmente) {
      if (seg.art === "text" && seg.text.trim() !== "") {
        const md = el("div", "md");
        setzeMarkdown(md, seg.text);
        inhalt.appendChild(md);
        hatInhalt = true;
      } else if (seg.art === "werkzeug") {
        inhalt.appendChild(el("div", "msg-werkzeug", "🔧 " + seg.text));
        hatInhalt = true;
      } else if (seg.art === "fehler") {
        inhalt.appendChild(el("div", "msg-fehler", seg.text));
        hatInhalt = true;
      }
    }
    if (!hatInhalt) {
      inhalt.appendChild(el("div", "msg-denkt", "Claude denkt …"));
    }
    scrolleAnsEnde();
  }

  function laufSegmentText(text) {
    const segs = aktiverLauf.segmente;
    const letzte = segs[segs.length - 1];
    if (letzte && letzte.art === "text") {
      letzte.text += (letzte.text ? "\n" : "") + text;
    } else {
      segs.push({ art: "text", text: text });
    }
  }

  // Verarbeitet eine stream-json-Zeile der laufenden Antwort.
  function verarbeiteStreamObjekt(obj) {
    if (!obj || typeof obj !== "object" || !aktiverLauf) return;
    if (obj.type === "assistant" && obj.message && Array.isArray(obj.message.content)) {
      for (const block of obj.message.content) {
        if (block && block.type === "text" && typeof block.text === "string" && block.text !== "") {
          laufSegmentText(block.text);
        } else if (block && block.type === "tool_use") {
          aktiverLauf.segmente.push({ art: "werkzeug", text: block.name || "Werkzeug" });
        }
      }
      rendereLauf();
    }
    // system/init und result brauchen keine eigene Anzeige (Text steckt oben).
  }

  function setzeSendeZustand(laeuft) {
    const btn = document.getElementById("chat-senden");
    const textarea = document.getElementById("chat-prompt");
    if (btn) {
      btn.textContent = laeuft ? "Stopp" : "Senden";
      btn.classList.toggle("btn-gefahr", laeuft);
      btn.classList.toggle("btn-primaer", !laeuft);
    }
    if (textarea) textarea.disabled = false;
  }

  // Kleiner SSE-Leser fuer den Chat-Endpunkt.
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
      try { wert = JSON.parse(daten); } catch (e) { /* roher String */ }
      if (callbacks.onZeile) callbacks.onZeile(wert);
    }
  }

  function starteChatStream(chatId, prompt, callbacks) {
    const controller = new AbortController();
    (async function () {
      let antwort;
      try {
        antwort = await fetch("/api/chats/" + chatId + "/nachricht", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: prompt }),
          signal: controller.signal
        });
      } catch (netzFehler) {
        if (netzFehler.name !== "AbortError" && callbacks.onFehler) {
          callbacks.onFehler("Verbindung fehlgeschlagen: " + netzFehler.message);
        }
        if (callbacks.onEnde) callbacks.onEnde(1);
        return;
      }
      if (!antwort.ok) {
        let text = "Fehler " + antwort.status;
        try { const d = await antwort.json(); if (d && d.fehler) text = d.fehler; } catch (e) { /* Status reicht */ }
        if (callbacks.onFehler) callbacks.onFehler(text);
        if (callbacks.onEnde) callbacks.onEnde(antwort.status);
        return;
      }
      const leser = antwort.body.getReader();
      const dekodierer = new TextDecoder();
      let puffer = "";
      try {
        while (true) {
          const teil = await leser.read();
          if (teil.done) break;
          puffer += dekodierer.decode(teil.value, { stream: true });
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
    return { abbrechen: function () { controller.abort(); } };
  }

  function beendeLauf() {
    aktiverLauf = null;
    setzeSendeZustand(false);
  }

  function stoppeLauf() {
    if (!aktiverLauf) return;
    if (aktiverLauf.handle && typeof aktiverLauf.handle.abbrechen === "function") {
      aktiverLauf.handle.abbrechen();
    }
    aktiverLauf.segmente.push({ art: "fehler", text: "Vom Benutzer gestoppt." });
    rendereLauf();
    beendeLauf();
    // Der Server speichert den Verlauf beim Verbindungsabbruch; Liste nachziehen.
    ladeListe();
  }

  async function sendeNachricht() {
    if (aktiverLauf) { stoppeLauf(); return; }
    const textarea = document.getElementById("chat-prompt");
    const prompt = textarea ? textarea.value.trim() : "";
    if (prompt === "") return;

    // Ohne offenen Chat zuerst einen anlegen und den Kopf/Nachrichtenbereich
    // frisch aufbauen (der Willkommens-Zustand hat keinen Nachrichten-Container).
    if (!aktiverChatId) {
      const angelegt = await erstelleChat();
      if (!angelegt) return;
      rendereHaupt();
    }
    const chatId = aktiverChatId;
    const eingabe = document.getElementById("chat-prompt");
    if (eingabe) { eingabe.value = ""; autoHoehe(eingabe); }

    // Nachrichten-Container sicherstellen (bei frischem Chat neu bauen).
    let innen = document.getElementById("chat-nachrichten-innen");
    if (!innen) {
      rendereNachrichten();
      innen = document.getElementById("chat-nachrichten-innen");
    }
    // User-Blase sofort zeigen.
    if (innen) {
      const denktHinweis = innen.querySelector(".msg-denkt");
      if (denktHinweis) denktHinweis.remove();
      innen.appendChild(nachrichtEl({ rolle: "user", text: prompt }));
    }
    // Claude-Blase fuer die laufende Antwort.
    const msg = el("div", "msg msg-claude");
    msg.appendChild(avatarEl("claude"));
    const inhalt = el("div", "msg-inhalt");
    msg.appendChild(inhalt);
    if (innen) innen.appendChild(msg);
    aktiverLauf = { handle: null, segmente: [], inhaltEl: inhalt };
    rendereLauf();
    setzeSendeZustand(true);
    scrolleAnsEnde();

    aktiverLauf.handle = starteChatStream(chatId, prompt, {
      onZeile: verarbeiteStreamObjekt,
      onFehler: function (text) {
        if (aktiverLauf) { aktiverLauf.segmente.push({ art: "fehler", text: text }); rendereLauf(); }
      },
      onEnde: function (code) {
        if (aktiverLauf && String(code) !== "0") {
          aktiverLauf.segmente.push({ art: "fehler", text: "Beendet mit Exit-Code " + code });
          rendereLauf();
        }
        beendeLauf();
        // Verlauf + Titel serverseitig aktualisiert: Chat und Liste neu laden.
        nachladenNachLauf(chatId);
      }
    });
  }

  // Nach einem Lauf: vollen Chat neu laden (fuer sauberes Markdown) und Liste.
  async function nachladenNachLauf(chatId) {
    if (chatId === aktiverChatId) {
      try {
        aktiverChat = await window.api.get("/api/chats/" + chatId);
        rendereNachrichten();
        aktualisiereKopf();
      } catch (fehler) { /* Anzeige bleibt wie sie ist */ }
    }
    ladeListe();
  }

  // ---------- Chat-Aktionen ----------

  // Legt einen neuen Chat mit den aktuellen Kopf-Einstellungen an, oeffnet ihn.
  async function erstelleChat() {
    const modellId = leseModellWahl();
    const cwd = leseOrdnerWahl();
    const bauen = leseBauenWahl();
    try {
      const chat = await window.api.post("/api/chats", {
        modellId: modellId, cwd: cwd, bauenErlaubt: bauen
      });
      aktiverChat = chat;
      aktiverChatId = chat.id;
      await ladeListe();
      return chat;
    } catch (fehler) {
      window.toast("Chat konnte nicht angelegt werden: " + fehler.message, "fehler");
      return null;
    }
  }

  async function neuerChat() {
    if (aktiverLauf) stoppeLauf();
    aktiverChat = null;
    aktiverChatId = null;
    rendereHaupt();
    rendereListe();
    const textarea = document.getElementById("chat-prompt");
    if (textarea) textarea.focus();
  }

  async function oeffneChat(id) {
    if (aktiverLauf) stoppeLauf();
    try {
      aktiverChat = await window.api.get("/api/chats/" + id);
      aktiverChatId = id;
    } catch (fehler) {
      window.toast("Chat konnte nicht geöffnet werden: " + fehler.message, "fehler");
      return;
    }
    rendereHaupt();
    rendereListe();
  }

  async function loescheChat(id, titel) {
    const sicher = confirm("Chat \"" + (titel || "Neuer Chat") + "\" wirklich löschen?");
    if (!sicher) return;
    try {
      await window.api.del("/api/chats/" + id);
    } catch (fehler) {
      window.toast("Chat konnte nicht gelöscht werden: " + fehler.message, "fehler");
      return;
    }
    if (id === aktiverChatId) {
      aktiverChat = null;
      aktiverChatId = null;
      rendereHaupt();
    }
    await ladeListe();
    window.toast("Chat gelöscht.", "ok");
  }

  // Aendert ein Metadaten-Feld des aktiven Chats (Titel, Modell, Bauen, cwd).
  async function aendereChat(aenderung) {
    if (!aktiverChatId) return;
    try {
      await window.api.put("/api/chats/" + aktiverChatId, aenderung);
      if (aktiverChat) Object.assign(aktiverChat, aenderung);
      ladeListe();
    } catch (fehler) {
      window.toast("Änderung fehlgeschlagen: " + fehler.message, "fehler");
    }
  }

  // ---------- Kopf-Steuerelemente ----------

  function leseModellWahl() {
    const sel = document.getElementById("chat-modell");
    return sel ? sel.value : "";
  }
  function leseOrdnerWahl() {
    const sel = document.getElementById("chat-ordner");
    if (sel && sel.value) return sel.value;
    return (window.einstellungen && window.einstellungen.standardCwd) || ORDNER_OPTIONEN[0];
  }
  function leseBauenWahl() {
    const box = document.getElementById("chat-bauen");
    return box ? box.checked : false;
  }

  function baueModellSelect() {
    const select = el("select", "eingabe");
    select.id = "chat-modell";
    select.title = "Modell";
    const standard = el("option", null, "Standard (Konto)");
    standard.value = "";
    select.appendChild(standard);
    for (const modell of (window.modelle || [])) {
      const option = el("option", null, modell.name);
      option.value = modell.id;
      select.appendChild(option);
    }
    if (aktiverChat && aktiverChat.modellId) select.value = aktiverChat.modellId;
    select.addEventListener("change", function () {
      if (aktiverChatId) aendereChat({ modellId: select.value });
    });
    return select;
  }

  function baueOrdnerSelect() {
    const select = el("select", "eingabe");
    select.id = "chat-ordner";
    select.title = "Arbeitsordner (nach der ersten Nachricht fest)";
    const standardCwd = (aktiverChat && aktiverChat.cwd)
      || (window.einstellungen && window.einstellungen.standardCwd) || ORDNER_OPTIONEN[0];
    const optionen = ORDNER_OPTIONEN.slice();
    if (!optionen.includes(standardCwd)) optionen.unshift(standardCwd);
    for (const pfad of optionen) {
      const option = el("option", null, pfad);
      option.value = pfad;
      select.appendChild(option);
    }
    select.value = standardCwd;
    // Nach der ersten Nachricht ist der Ordner an die Session gebunden.
    const fest = aktiverChat && (aktiverChat.sessionGestartet
      || (Array.isArray(aktiverChat.nachrichten) && aktiverChat.nachrichten.length > 0));
    select.disabled = !!fest;
    select.addEventListener("change", function () {
      if (aktiverChatId && !fest) aendereChat({ cwd: select.value });
    });
    return select;
  }

  function baueBauenSchalter() {
    const label = el("label", "chat-bauen");
    const box = document.createElement("input");
    box.type = "checkbox";
    box.id = "chat-bauen";
    box.checked = !!(aktiverChat && aktiverChat.bauenErlaubt);
    box.addEventListener("change", function () {
      if (aktiverChatId) aendereChat({ bauenErlaubt: box.checked });
    });
    label.appendChild(box);
    label.appendChild(document.createTextNode("Bauen erlauben"));
    label.title = "Erlaubt Claude, Dateien zu ändern und Werkzeuge zu nutzen (sonst nur lesen).";
    return label;
  }

  function baueChatKopf() {
    const kopf = el("div", "chat-kopf");

    const titel = document.createElement("input");
    titel.className = "chat-kopf-titel";
    titel.id = "chat-titel";
    titel.type = "text";
    titel.placeholder = "Neuer Chat";
    titel.value = aktiverChat ? (aktiverChat.titel || "") : "";
    titel.disabled = !aktiverChatId;
    titel.addEventListener("change", function () {
      const neu = titel.value.trim();
      if (aktiverChatId && neu !== "") aendereChat({ titel: neu });
    });
    kopf.appendChild(titel);

    kopf.appendChild(baueModellSelect());
    kopf.appendChild(baueOrdnerSelect());
    kopf.appendChild(baueBauenSchalter());
    kopf.appendChild(baueKontoChip());
    if (typeof window.infoIcon === "function") {
      kopf.insertAdjacentHTML("beforeend", window.infoIcon(KONTO_HINWEIS));
    }
    return kopf;
  }

  function aktualisiereKopf() {
    // Ordner-Sperre und Titel nach dem ersten Lauf nachziehen.
    const ordner = document.getElementById("chat-ordner");
    if (ordner && aktiverChat) {
      const fest = aktiverChat.sessionGestartet
        || (Array.isArray(aktiverChat.nachrichten) && aktiverChat.nachrichten.length > 0);
      ordner.disabled = !!fest;
    }
    const titel = document.getElementById("chat-titel");
    if (titel && aktiverChat && document.activeElement !== titel) {
      titel.value = aktiverChat.titel || "";
    }
  }

  // ---------- Eingabe ----------

  function autoHoehe(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
  }

  function baueEingabe() {
    const bereich = el("div", "chat-eingabe");
    const innen = el("div", "chat-eingabe-innen");
    const textarea = document.createElement("textarea");
    textarea.id = "chat-prompt";
    textarea.rows = 1;
    textarea.placeholder = "Nachricht an Claude (Enter sendet, Shift+Enter neue Zeile)";
    textarea.addEventListener("input", function () { autoHoehe(textarea); });
    textarea.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendeNachricht();
      }
    });
    const btn = el("button", "btn btn-primaer chat-senden-btn", "Senden");
    btn.id = "chat-senden";
    btn.addEventListener("click", sendeNachricht);
    innen.appendChild(textarea);
    innen.appendChild(btn);
    bereich.appendChild(innen);
    return bereich;
  }

  // ---------- Hauptbereich rendern ----------

  function rendereHaupt() {
    const haupt = document.getElementById("chat-haupt");
    if (!haupt) return;
    haupt.innerHTML = "";
    haupt.appendChild(baueChatKopf());

    const box = el("div", "chat-nachrichten");
    box.id = "chat-nachrichten";
    haupt.appendChild(box);
    haupt.appendChild(baueEingabe());

    if (aktiverChatId) {
      rendereNachrichten();
    } else {
      box.innerHTML = "";
      const willk = el("div", "chat-willkommen");
      willk.appendChild(el("h2", null, "Neuer Chat"));
      willk.appendChild(el("div", null, "Stelle unten deine Frage. Der Chat merkt sich den Verlauf und wird gespeichert."));
      box.appendChild(willk);
    }
    const textarea = document.getElementById("chat-prompt");
    if (textarea) textarea.focus();
  }

  // ---------- Memory (globale Dauer-Instruktionen) ----------

  const MEMORY_HINWEIS =
    "Diese Instruktionen werden jedem Chat als System-Prompt mitgegeben (wie die " +
    "Projekt-Anweisungen im Original). Gut für: wer du bist, wie geantwortet werden " +
    "soll, wiederkehrende Regeln. Leer lassen schaltet es ab.";

  function schliesseModal() {
    const hg = document.getElementById("sea-modal-hg");
    if (hg) hg.remove();
  }

  async function oeffneMemory() {
    let text = "";
    try {
      const daten = await window.api.get("/api/memory");
      text = (daten && daten.text) || "";
    } catch (fehler) {
      window.toast("Memory konnte nicht geladen werden: " + fehler.message, "fehler");
      return;
    }
    const hg = el("div", "sea-modal-hg");
    hg.id = "sea-modal-hg";
    hg.addEventListener("click", function (ereignis) {
      if (ereignis.target === hg) schliesseModal();
    });
    const modal = el("div", "sea-modal");
    modal.appendChild(el("h2", null, "Memory"));
    modal.appendChild(el("div", "sea-modal-hinweis", MEMORY_HINWEIS));
    const textarea = document.createElement("textarea");
    textarea.className = "eingabe";
    textarea.value = text;
    textarea.placeholder = "z.B. Antworte immer auf Deutsch, kurz und mit Fazit oben.";
    modal.appendChild(textarea);
    const aktionen = el("div", "sea-modal-aktionen");
    aktionen.appendChild(knopf("Abbrechen", "btn", schliesseModal));
    aktionen.appendChild(knopf("Speichern", "btn btn-primaer", function () {
      speichereMemory(textarea.value);
    }));
    modal.appendChild(aktionen);
    hg.appendChild(modal);
    document.body.appendChild(hg);
    textarea.focus();
  }

  async function speichereMemory(text) {
    try {
      await window.api.put("/api/memory", { text: text });
      window.toast("Memory gespeichert.", "ok");
      schliesseModal();
    } catch (fehler) {
      window.toast("Memory konnte nicht gespeichert werden: " + fehler.message, "fehler");
    }
  }

  // ---------- Einstieg ----------

  async function renderClaude(container) {
    cssEinfuegen();
    container.innerHTML = "";

    const view = el("div", "claude-view");

    // Sidebar
    const sidebar = el("div", "chat-sidebar");
    const sidebarKopf = el("div", "chat-sidebar-kopf");
    sidebarKopf.appendChild(knopf("+ Neuer Chat", "btn btn-primaer chat-neu-btn", neuerChat));
    const suche = document.createElement("input");
    suche.className = "eingabe chat-suche";
    suche.type = "text";
    suche.placeholder = "Chats durchsuchen …";
    suche.value = sucheText;
    suche.addEventListener("input", function () {
      sucheText = suche.value.trim().toLowerCase();
      rendereListe();
    });
    sidebarKopf.appendChild(suche);
    sidebar.appendChild(sidebarKopf);
    const liste = el("div", "chat-liste");
    liste.id = "chat-liste";
    sidebar.appendChild(liste);
    const fuss = el("div", "chat-sidebar-fuss");
    fuss.appendChild(knopf("⚙ Memory", "btn chat-memory-btn", oeffneMemory));
    sidebar.appendChild(fuss);
    view.appendChild(sidebar);

    // Hauptbereich
    const haupt = el("div", "chat-haupt");
    haupt.id = "chat-haupt";
    view.appendChild(haupt);

    container.appendChild(view);

    await ladeListe();
    // Zuletzt genutzten Chat oeffnen, sonst leerer Neu-Zustand.
    if (aktiverChatId && chats.some(function (c) { return c.id === aktiverChatId; })) {
      await oeffneChat(aktiverChatId);
    } else if (chats.length > 0) {
      await oeffneChat(chats[0].id);
    } else {
      rendereHaupt();
    }
  }

  // Chip im Kopf mitziehen, wenn im Konten-Tab gewechselt wurde.
  window.addEventListener("konto-gewechselt", function () {
    const chip = document.getElementById("claude-konto-chip");
    if (chip && chip.isConnected) ladeKontoChip(chip);
  });

  window.views = window.views || {};
  window.views.claude = { titel: "Claude", render: renderClaude };
})();
