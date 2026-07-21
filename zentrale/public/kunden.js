// Kunden-View: Kanban-Board mit drei Status-Spalten und Drag and Drop.
(function () {
  "use strict";

  const SPALTEN = [
    { status: "offen", titel: "Noch nicht angefangen", farbKlasse: "spalte-offen" },
    { status: "in_arbeit", titel: "In Bearbeitung", farbKlasse: "spalte-arbeit" },
    { status: "fertig", titel: "Fertig", farbKlasse: "spalte-fertig" }
  ];

  const KANBAN_INFO =
    "Ziehe eine Karte per Drag and Drop in eine andere Spalte, um den Status zu ändern. " +
    "Ein Klick auf die Karte öffnet die Bearbeitung.";

  let kundenListe = [];
  let boardElement = null;

  function cssEinfuegen() {
    if (document.getElementById("css-kunden")) return;
    const style = document.createElement("style");
    style.id = "css-kunden";
    style.textContent = `
      .kunden-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; align-items: start; }
      .kunden-spalte { background: var(--panel); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px; min-height: 240px; }
      .kunden-spalte.drag-ueber { outline: 2px dashed var(--akzent); outline-offset: -4px; }
      .spalte-kopf { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-weight: 600; }
      .spalte-punkt { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
      .spalte-offen .spalte-punkt { background: var(--rot); }
      .spalte-arbeit .spalte-punkt { background: var(--gelb); }
      .spalte-fertig .spalte-punkt { background: var(--gruen); }
      .spalte-anzahl { color: var(--muted); font-weight: 400; margin-left: auto; }
      .kunden-karte { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 10px 12px; margin-bottom: 8px; cursor: grab; transition: transform 0.15s ease, border-color 0.15s ease; }
      .kunden-karte:hover { border-color: var(--akzent); transform: translateY(-2px); }
      .kunden-karte.wird-gezogen { opacity: 0.5; }
      .karte-name { font-weight: 600; margin-bottom: 2px; }
      .karte-branche { color: var(--muted); font-size: 0.85em; margin-bottom: 4px; }
      .karte-notizen { font-size: 0.85em; color: var(--text); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 4px; }
      .karte-datum { color: var(--muted); font-size: 0.75em; }
      .kunden-modal label { display: block; margin-bottom: 10px; font-size: 0.9em; }
      .kunden-modal .eingabe { width: 100%; margin-top: 4px; }
      .kunden-modal .modal-aktionen { display: flex; gap: 8px; margin-top: 16px; }
      .kunden-modal .modal-fueller { flex: 1; }
      .loeschen-bestaetigung { display: flex; align-items: center; gap: 8px; margin-top: 12px; padding: 10px; border: 1px solid var(--rot); border-radius: var(--radius); }
      .loeschen-bestaetigung[hidden] { display: none; }
    `;
    document.head.appendChild(style);
  }

  async function kundenLaden() {
    const antwort = await window.api.get("/api/kunden");
    kundenListe = antwort.kunden || [];
  }

  function datumFormatieren(iso) {
    if (!iso) return "";
    const datum = new Date(iso);
    if (isNaN(datum.getTime())) return "";
    return datum.toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function karteHtml(kunde) {
    const branche = kunde.branche
      ? '<div class="karte-branche">' + window.escapeHtml(kunde.branche) + "</div>"
      : "";
    const notizen = kunde.notizen
      ? '<div class="karte-notizen">' + window.escapeHtml(kunde.notizen) + "</div>"
      : "";
    return (
      '<div class="kunden-karte" draggable="true" data-id="' + window.escapeHtml(kunde.id) + '">' +
      '<div class="karte-name">' + window.escapeHtml(kunde.name) + "</div>" +
      branche + notizen +
      '<div class="karte-datum">Aktualisiert: ' + datumFormatieren(kunde.aktualisiert) + "</div>" +
      "</div>"
    );
  }

  function spalteHtml(spalte) {
    const karten = kundenListe.filter(function (k) { return k.status === spalte.status; });
    const kartenHtml = karten.map(karteHtml).join("") ||
      '<div class="leer">Keine Kunden</div>';
    return (
      '<div class="kunden-spalte ' + spalte.farbKlasse + '" data-status="' + spalte.status + '">' +
      '<div class="spalte-kopf"><span class="spalte-punkt"></span>' +
      window.escapeHtml(spalte.titel) +
      '<span class="spalte-anzahl">' + karten.length + "</span></div>" +
      kartenHtml +
      "</div>"
    );
  }

  function boardRendern() {
    if (!boardElement) return;
    boardElement.innerHTML = SPALTEN.map(spalteHtml).join("");
    kartenEreignisseVerbinden();
    spaltenEreignisseVerbinden();
  }

  function kartenEreignisseVerbinden() {
    boardElement.querySelectorAll(".kunden-karte").forEach(function (karte) {
      karte.addEventListener("dragstart", function (ereignis) {
        ereignis.dataTransfer.setData("text/plain", karte.dataset.id);
        ereignis.dataTransfer.effectAllowed = "move";
        karte.classList.add("wird-gezogen");
      });
      karte.addEventListener("dragend", function () {
        karte.classList.remove("wird-gezogen");
      });
      karte.addEventListener("click", function () {
        const kunde = kundenListe.find(function (k) { return k.id === karte.dataset.id; });
        if (kunde) modalOeffnen(kunde);
      });
    });
  }

  function spaltenEreignisseVerbinden() {
    boardElement.querySelectorAll(".kunden-spalte").forEach(function (spalte) {
      spalte.addEventListener("dragover", function (ereignis) {
        ereignis.preventDefault();
        ereignis.dataTransfer.dropEffect = "move";
        spalte.classList.add("drag-ueber");
      });
      spalte.addEventListener("dragleave", function () {
        spalte.classList.remove("drag-ueber");
      });
      spalte.addEventListener("drop", function (ereignis) {
        ereignis.preventDefault();
        spalte.classList.remove("drag-ueber");
        const id = ereignis.dataTransfer.getData("text/plain");
        statusAendern(id, spalte.dataset.status);
      });
    });
  }

  async function statusAendern(id, neuerStatus) {
    const kunde = kundenListe.find(function (k) { return k.id === id; });
    if (!kunde || kunde.status === neuerStatus) return;
    kundenListe = kundenListe.map(function (k) {
      return k.id === id ? Object.assign({}, k, { status: neuerStatus }) : k;
    });
    boardRendern();
    try {
      const gespeichert = await window.api.put("/api/kunden/" + id, { status: neuerStatus });
      kundenListe = kundenListe.map(function (k) {
        return k.id === id ? gespeichert : k;
      });
      boardRendern();
    } catch (fehler) {
      window.toast("Status konnte nicht gespeichert werden: " + fehler.message, "fehler");
      await kundenLaden();
      boardRendern();
    }
  }

  function modalHtml(istNeu, daten) {
    const statusOptionen = SPALTEN.map(function (s) {
      const ausgewaehlt = s.status === daten.status ? " selected" : "";
      return '<option value="' + s.status + '"' + ausgewaehlt + ">" + window.escapeHtml(s.titel) + "</option>";
    }).join("");
    const loeschenBtn = istNeu ? "" :
      '<button class="btn btn-gefahr" id="kunde-loeschen">Löschen</button>';
    return (
      '<div class="modal kunden-modal">' +
      "<h2>" + (istNeu ? "Neuer Kunde" : "Kunde bearbeiten") + "</h2>" +
      '<label>Name (Pflicht)<input class="eingabe" id="kunde-name" value="' + window.escapeHtml(daten.name) + '"></label>' +
      '<label>Branche<input class="eingabe" id="kunde-branche" value="' + window.escapeHtml(daten.branche || "") + '"></label>' +
      '<label>Status<select class="eingabe" id="kunde-status">' + statusOptionen + "</select></label>" +
      '<label>Notizen<textarea class="eingabe" id="kunde-notizen" rows="4">' + window.escapeHtml(daten.notizen || "") + "</textarea></label>" +
      '<div class="loeschen-bestaetigung" id="loeschen-bestaetigung" hidden>' +
      "<span>Diesen Kunden wirklich löschen?</span>" +
      '<button class="btn btn-gefahr" id="loeschen-ja">Ja, löschen</button>' +
      '<button class="btn" id="loeschen-nein">Nein</button></div>' +
      '<div class="modal-aktionen">' + loeschenBtn +
      '<span class="modal-fueller"></span>' +
      '<button class="btn" id="kunde-abbrechen">Abbrechen</button>' +
      '<button class="btn btn-primaer" id="kunde-speichern">Speichern</button>' +
      "</div></div>"
    );
  }

  function modalOeffnen(kunde) {
    const istNeu = !kunde;
    const daten = kunde || { name: "", branche: "", status: "offen", notizen: "" };
    const hintergrund = document.createElement("div");
    hintergrund.className = "modal-hintergrund";
    hintergrund.innerHTML = modalHtml(istNeu, daten);
    document.body.appendChild(hintergrund);

    function schliessen() { hintergrund.remove(); }

    hintergrund.addEventListener("click", function (ereignis) {
      if (ereignis.target === hintergrund) schliessen();
    });
    hintergrund.querySelector("#kunde-abbrechen").addEventListener("click", schliessen);
    hintergrund.querySelector("#kunde-speichern").addEventListener("click", function () {
      kundeSpeichern(hintergrund, istNeu, daten, schliessen);
    });
    if (!istNeu) loeschenVerbinden(hintergrund, daten, schliessen);
    hintergrund.querySelector("#kunde-name").focus();
  }

  function loeschenVerbinden(hintergrund, daten, schliessen) {
    const bestaetigung = hintergrund.querySelector("#loeschen-bestaetigung");
    hintergrund.querySelector("#kunde-loeschen").addEventListener("click", function () {
      bestaetigung.hidden = false;
    });
    hintergrund.querySelector("#loeschen-nein").addEventListener("click", function () {
      bestaetigung.hidden = true;
    });
    hintergrund.querySelector("#loeschen-ja").addEventListener("click", async function () {
      try {
        await window.api.del("/api/kunden/" + daten.id);
        window.toast("Kunde gelöscht", "ok");
        schliessen();
        await kundenLaden();
        boardRendern();
      } catch (fehler) {
        window.toast("Löschen fehlgeschlagen: " + fehler.message, "fehler");
      }
    });
  }

  async function kundeSpeichern(hintergrund, istNeu, daten, schliessen) {
    const name = hintergrund.querySelector("#kunde-name").value.trim();
    if (!name) {
      window.toast("Name ist ein Pflichtfeld", "fehler");
      return;
    }
    const felder = {
      name: name,
      branche: hintergrund.querySelector("#kunde-branche").value.trim(),
      status: hintergrund.querySelector("#kunde-status").value,
      notizen: hintergrund.querySelector("#kunde-notizen").value.trim()
    };
    try {
      if (istNeu) {
        await window.api.post("/api/kunden", felder);
        window.toast("Kunde angelegt", "ok");
      } else {
        await window.api.put("/api/kunden/" + daten.id, felder);
        window.toast("Kunde gespeichert", "ok");
      }
      schliessen();
      await kundenLaden();
      boardRendern();
    } catch (fehler) {
      window.toast("Speichern fehlgeschlagen: " + fehler.message, "fehler");
    }
  }

  window.views.kunden = {
    titel: "Kunden",
    render: async function (container) {
      cssEinfuegen();
      container.innerHTML =
        '<div class="kopfzeile"><h1>Kunden ' + window.infoIcon(KANBAN_INFO) + "</h1>" +
        '<button class="btn btn-primaer" id="kunde-neu">Neuer Kunde</button></div>' +
        '<div class="kunden-board" id="kunden-board"></div>';
      boardElement = container.querySelector("#kunden-board");
      container.querySelector("#kunde-neu").addEventListener("click", function () {
        modalOeffnen(null);
      });
      try {
        await kundenLaden();
        boardRendern();
      } catch (fehler) {
        window.toast("Kunden konnten nicht geladen werden: " + fehler.message, "fehler");
        boardElement.innerHTML = '<div class="leer">Fehler beim Laden der Kunden</div>';
      }
    }
  };
})();
