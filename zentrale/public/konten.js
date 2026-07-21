// konten.js: Konten-Ansicht — Claude-Konten (cswap) ansehen, wechseln, pflegen.
// Ein Wechsel tauscht die Credentials sofort fuer Claude Code am ganzen PC.

(function () {
  "use strict";

  const REFRESH_MS = 60000;
  const USAGE_ALT_AB_SEKUNDEN = 300;

  let refreshTimer = null;
  let aktionLaeuft = false;

  const INFO_TEXT =
    "Verwaltet die Claude-Konten über claude-swap. Das aktive Konto gilt sofort " +
    "für Claude Code am ganzen PC. Neues Konto übernehmen: in Claude Code mit dem " +
    "Konto einloggen, dann hier auf \"Konto übernehmen\" klicken.";

  function cssEinfuegen() {
    if (document.getElementById("css-konten")) {
      return;
    }
    const style = document.createElement("style");
    style.id = "css-konten";
    style.textContent = [
      ".konten-titel-zeile { display: flex; align-items: center; gap: 8px; }",
      ".konten-kopf-aktionen { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }",
      ".konten-alias-eingabe { width: 160px; }",
      ".konten-liste { display: flex; flex-direction: column; gap: 14px; }",
      ".konto-kopf { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }",
      ".konto-titel { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }",
      ".konto-titel strong { font-size: 15px; }",
      ".konto-mail { color: var(--muted); font-size: 13px; }",
      ".konto-chip-alias { border: 1px solid var(--akzent); border-radius: 999px; padding: 1px 9px;",
      "  font-size: 12px; color: var(--akzent-hell); background: var(--akzent-weich); }",
      ".konto-badge { border-radius: 999px; padding: 1px 9px; font-size: 12px; font-weight: 600; }",
      ".konto-badge-aktiv { color: var(--gruen); border: 1px solid var(--gruen); }",
      ".konto-badge-pausiert { color: var(--gelb); border: 1px solid var(--gelb); }",
      ".konto-aktionen { display: flex; gap: 6px; flex-wrap: wrap; }",
      ".konto-usage { display: flex; flex-direction: column; gap: 6px; margin-top: 12px; }",
      ".usage-zeile { display: flex; align-items: center; gap: 10px; }",
      ".usage-beschriftung { width: 150px; font-size: 13px; color: var(--muted); flex-shrink: 0; }",
      ".usage-balken { flex: 1; height: 8px; background: var(--panel-2); border: 1px solid var(--border);",
      "  border-radius: 999px; overflow: hidden; }",
      ".usage-fuellung { height: 100%; border-radius: 999px; }",
      ".usage-text { font-size: 12px; color: var(--muted); white-space: nowrap; }",
      ".usage-klein .usage-beschriftung, .usage-klein .usage-text { font-size: 11px; }",
      ".usage-klein .usage-balken { height: 5px; }",
      ".konto-hinweis { margin-top: 10px; font-size: 12px; color: var(--muted); }"
    ].join("\n");
    document.head.appendChild(style);
  }

  function knopf(text, klassen, handler) {
    const btn = document.createElement("button");
    btn.className = klassen;
    btn.textContent = text;
    btn.addEventListener("click", handler);
    return btn;
  }

  function zeigeLeer(listeEl, text) {
    listeEl.innerHTML = "";
    const el = document.createElement("div");
    el.className = "leer";
    el.textContent = text;
    listeEl.appendChild(el);
  }

  // Eine Aktion pro Karte: Knoepfe sperren, Aufruf ausfuehren, Liste neu laden.
  async function fuehreAktionAus(karteEl, aufruf, beiErfolg) {
    if (aktionLaeuft) {
      return;
    }
    aktionLaeuft = true;
    const knoepfe = karteEl ? karteEl.querySelectorAll("button") : [];
    knoepfe.forEach(function (btn) { btn.disabled = true; });
    try {
      const antwort = await aufruf();
      if (beiErfolg) {
        beiErfolg(antwort);
      }
      // Flag bleibt bis nach dem Reload gesetzt, damit der Auto-Refresh und
      // andere Karten nicht parallel dazwischenfunken (finally gibt frei).
      await ladeKonten(false);
    } catch (fehler) {
      window.toast(fehler.message, "fehler");
      knoepfe.forEach(function (btn) { btn.disabled = false; });
    } finally {
      aktionLaeuft = false;
    }
  }

  function usageFarbe(pct) {
    if (pct >= 90) {
      return "var(--rot)";
    }
    if (pct >= 70) {
      return "var(--gelb)";
    }
    return "var(--gruen)";
  }

  // Eine Balkenzeile: Beschriftung, Fuellbalken nach pct, Text mit Reset-Zeit.
  function usageZeile(beschriftung, fenster, klein) {
    const zeile = document.createElement("div");
    zeile.className = "usage-zeile" + (klein ? " usage-klein" : "");

    const label = document.createElement("span");
    label.className = "usage-beschriftung";
    label.textContent = beschriftung;
    zeile.appendChild(label);

    const pct = typeof fenster.pct === "number" ? Math.max(0, Math.min(100, fenster.pct)) : 0;
    const balken = document.createElement("div");
    balken.className = "usage-balken";
    const fuellung = document.createElement("div");
    fuellung.className = "usage-fuellung";
    fuellung.style.width = pct + "%";
    fuellung.style.background = usageFarbe(pct);
    balken.appendChild(fuellung);
    zeile.appendChild(balken);

    const text = document.createElement("span");
    text.className = "usage-text";
    let anzeige = pct + "%";
    if (fenster.clock && fenster.countdown) {
      anzeige += " · Reset " + fenster.clock + " (" + fenster.countdown + ")";
    }
    text.textContent = anzeige;
    zeile.appendChild(text);
    return zeile;
  }

  function usageBereich(konto) {
    const bereich = document.createElement("div");
    bereich.className = "konto-usage";
    const usage = konto.usage;
    if (!usage || (!usage.fiveHour && !usage.sevenDay)) {
      const hinweis = document.createElement("div");
      hinweis.className = "konto-hinweis";
      hinweis.textContent = "Keine Nutzungsdaten";
      bereich.appendChild(hinweis);
      return bereich;
    }
    if (usage.fiveHour) {
      bereich.appendChild(usageZeile("5-Stunden-Fenster", usage.fiveHour, false));
    }
    if (usage.sevenDay) {
      bereich.appendChild(usageZeile("7-Tage-Fenster", usage.sevenDay, false));
    }
    if (Array.isArray(usage.scoped)) {
      for (const eintrag of usage.scoped) {
        bereich.appendChild(usageZeile(String(eintrag.name || "?") + " (Woche)", eintrag, true));
      }
    }
    return bereich;
  }

  function kontoAktionen(konto, karte) {
    const aktionen = document.createElement("div");
    aktionen.className = "konto-aktionen";
    const ziel = String(konto.number);

    if (!konto.active) {
      aktionen.appendChild(knopf("Aktivieren", "btn btn-primaer", function () {
        fuehreAktionAus(karte, function () {
          return window.api.post("/api/konten/wechseln", { ziel: ziel });
        }, function (antwort) {
          window.toast(antwort && antwort.switched === false
            ? "Konto war bereits aktiv."
            : "Aktives Konto gewechselt. Gilt sofort für den ganzen PC.", "ok");
          window.dispatchEvent(new CustomEvent("konto-gewechselt"));
        });
      }));
    }

    aktionen.appendChild(knopf("Alias", "btn", function () {
      const eingabe = prompt(
        "Alias für Konto " + konto.number + " (leer lassen = Alias entfernen):",
        konto.alias || ""
      );
      if (eingabe === null) {
        return;
      }
      const alias = eingabe.trim();
      fuehreAktionAus(karte, function () {
        return window.api.post("/api/konten/alias", { ziel: ziel, alias: alias });
      }, function () {
        window.toast(alias === "" ? "Alias entfernt." : "Alias gespeichert.", "ok");
      });
    }));

    aktionen.appendChild(knopf(konto.disabled ? "Fortsetzen" : "Pausieren", "btn", function () {
      const aktiv = !!konto.disabled;
      fuehreAktionAus(karte, function () {
        return window.api.post("/api/konten/rotation", { ziel: ziel, aktiv: aktiv });
      }, function () {
        window.toast(aktiv ? "Konto fortgesetzt." : "Konto pausiert.", "ok");
      });
    }));

    aktionen.appendChild(knopf("Entfernen", "btn btn-gefahr", function () {
      const sicher = confirm(
        "Konto " + konto.number + " (" + (konto.email || "ohne E-Mail")
        + ") wirklich aus der Verwaltung entfernen?"
      );
      if (!sicher) {
        return;
      }
      fuehreAktionAus(karte, function () {
        return window.api.post("/api/konten/entfernen", { ziel: ziel });
      }, function () {
        // Feste Meldung: cswap druckt seine y/N-Rueckfrage mit in stdout.
        window.toast("Konto entfernt.", "ok");
      });
    }));

    return aktionen;
  }

  // Eine Konto-Karte. E-Mail, Alias, Organisationsname sind Fremd-Daten und
  // gehen darum ausschliesslich ueber textContent ins DOM.
  function kontoKarte(konto) {
    const karte = document.createElement("div");
    karte.className = "karte";

    const kopf = document.createElement("div");
    kopf.className = "konto-kopf";

    const titel = document.createElement("div");
    titel.className = "konto-titel";
    const nummer = document.createElement("strong");
    nummer.textContent = "Konto " + konto.number;
    titel.appendChild(nummer);
    const mail = document.createElement("span");
    mail.className = "konto-mail";
    mail.textContent = konto.email || "";
    titel.appendChild(mail);
    if (konto.alias) {
      const alias = document.createElement("span");
      alias.className = "konto-chip-alias";
      alias.textContent = konto.alias;
      titel.appendChild(alias);
    }
    if (konto.active) {
      const badge = document.createElement("span");
      badge.className = "konto-badge konto-badge-aktiv";
      badge.textContent = "Aktiv";
      titel.appendChild(badge);
    }
    if (konto.disabled) {
      const badge = document.createElement("span");
      badge.className = "konto-badge konto-badge-pausiert";
      badge.textContent = "Pausiert";
      titel.appendChild(badge);
    }
    kopf.appendChild(titel);
    kopf.appendChild(kontoAktionen(konto, karte));
    karte.appendChild(kopf);

    karte.appendChild(usageBereich(konto));

    if (typeof konto.usageAgeSeconds === "number" && konto.usageAgeSeconds > USAGE_ALT_AB_SEKUNDEN) {
      const stand = document.createElement("div");
      stand.className = "konto-hinweis";
      stand.textContent = "Stand vor " + Math.round(konto.usageAgeSeconds / 60) + "m";
      karte.appendChild(stand);
    }
    return karte;
  }

  function zeigeKonten(listeEl, konten) {
    listeEl.innerHTML = "";
    if (konten.length === 0) {
      zeigeLeer(listeEl, "Noch keine Konten. In Claude Code einloggen und oben \"Konto übernehmen\" klicken.");
      return;
    }
    for (const konto of konten) {
      listeEl.appendChild(kontoKarte(konto));
    }
  }

  // leise = Auto-Refresh: bei Fehlern nichts anfassen, kein Toast-Spam.
  async function ladeKonten(leise) {
    const listeEl = document.getElementById("konten-liste");
    if (!listeEl || !listeEl.isConnected) {
      return;
    }
    try {
      const daten = await window.api.get("/api/konten");
      zeigeKonten(listeEl, Array.isArray(daten.accounts) ? daten.accounts : []);
    } catch (fehler) {
      if (leise) {
        return;
      }
      window.toast("Konten konnten nicht geladen werden: " + fehler.message, "fehler");
      zeigeLeer(listeEl, "Konten konnten nicht geladen werden: " + fehler.message);
    }
  }

  function baueKopfzeile() {
    const kopf = document.createElement("div");
    kopf.className = "kopfzeile";

    const titelZeile = document.createElement("div");
    titelZeile.className = "konten-titel-zeile";
    const titel = document.createElement("h1");
    titel.textContent = "Konten";
    titelZeile.appendChild(titel);
    if (typeof window.infoIcon === "function") {
      // INFO_TEXT ist statischer Text (keine Nutzereingabe), innerHTML ist ok.
      titelZeile.insertAdjacentHTML("beforeend", window.infoIcon(INFO_TEXT));
    }
    kopf.appendChild(titelZeile);

    const aktionen = document.createElement("div");
    aktionen.className = "konten-kopf-aktionen";

    aktionen.appendChild(knopf("Aktualisieren", "btn", function () {
      ladeKonten(false);
    }));

    const aliasEingabe = document.createElement("input");
    aliasEingabe.type = "text";
    aliasEingabe.className = "eingabe konten-alias-eingabe";
    aliasEingabe.placeholder = "Alias (optional)";
    aktionen.appendChild(aliasEingabe);

    aktionen.appendChild(knopf("Konto übernehmen", "btn btn-primaer", function () {
      const alias = aliasEingabe.value.trim();
      fuehreAktionAus(null, function () {
        return window.api.post("/api/konten/hinzufuegen", alias === "" ? {} : { alias: alias });
      }, function (antwort) {
        window.toast((antwort && antwort.meldung) || "Konto übernommen.", "ok");
        if (antwort && antwort.warnung) {
          window.toast(antwort.warnung, "fehler");
        }
        aliasEingabe.value = "";
      });
    }));

    kopf.appendChild(aktionen);
    return kopf;
  }

  function renderKonten(container) {
    cssEinfuegen();
    // Altes Interval aufraeumen, damit kein Doppel-Timer entsteht.
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
    container.innerHTML = "";
    container.appendChild(baueKopfzeile());

    const listeEl = document.createElement("div");
    listeEl.id = "konten-liste";
    listeEl.className = "konten-liste";
    zeigeLeer(listeEl, "Lade Konten…");
    container.appendChild(listeEl);

    ladeKonten(false);
    // Auto-Refresh nur solange die Ansicht im DOM haengt.
    refreshTimer = setInterval(function () {
      if (!listeEl.isConnected) {
        clearInterval(refreshTimer);
        refreshTimer = null;
        return;
      }
      if (!aktionLaeuft) {
        ladeKonten(true);
      }
    }, REFRESH_MS);
  }

  window.views = window.views || {};
  window.views.konten = { titel: "Konten", render: renderKonten };
})();
