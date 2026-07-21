// Finelli KI-Mitarbeiter — Frontend (Vanilla JS, kein Build). Holt den Tageslauf vom
// Server und zeigt Uebersicht, Bestell-Alarme und die 3 Berichte. Zahlen kommen alle
// aus dem Rechenkern (der Server macht den Vor-Versand-Check).

let stand = null;

function el(id) { return document.getElementById(id); }
function chf(n) { return "CHF " + Math.round(n).toLocaleString("de-CH"); }
function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function punkt(a) { return '<span class="punkt ' + a + '"></span>'; }

async function holeStand(post) {
  const res = post
    ? await fetch("/api/lauf", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })
    : await fetch("/api/stand");
  return res.json();
}

async function laden(post) {
  stand = await holeStand(post);
  renderKopf();
  renderUebersicht();
  renderAlarme();
  renderBericht("woche", stand.berichte.woche);
  renderBericht("monat", stand.berichte.monat);
  renderResearch();
  await renderDaten();
}

function checkFuer(typ, titel) {
  const c = (stand.checks || []).find((x) => x.titel === titel) || (stand.checks || []).find((x) => x.typ === typ);
  if (!c) return "";
  return c.ergebnis.ok
    ? '<div class="hinweis-check ok">&#10003; Vor-Versand-Check bestanden — jede Zahl steht im Rechenkern.</div>'
    : '<div class="hinweis-check fehler">&#10007; Vor-Versand-Check BLOCKIERT: ' + esc(c.ergebnis.probleme.join("; ")) + "</div>";
}

// ---------- Kopf ----------
function renderKopf() {
  el("lauf-datum").textContent = stand.lauf.datum;
  el("modus").textContent = stand.lauf.modus;
  const v = el("versand-status");
  if (stand.lauf.versand_freigegeben) { v.textContent = "Versand freigegeben"; v.className = "versand ok"; }
  else { v.textContent = "Versand blockiert (Check)"; v.className = "versand blockiert"; }
  const az = stand.berichte.alarme.length;
  el("alarm-zahl").textContent = az > 0 ? az : "";
  el("alarm-zahl").style.display = az > 0 ? "" : "none";
}

// ---------- Uebersicht ----------
function renderUebersicht() {
  const s = stand.snapshot;
  const a = s.aggregate;
  const kacheln = [
    { t: "Umsatz 7 Tage", w: chf(a.umsatz.t7_gesamt), z: "Online " + chf(a.umsatz.t7_online) + " · Laden " + chf(a.umsatz.t7_laden), ampel: s.ampeln.umsatz, extra: (a.umsatz.vs_vorwoche_pct >= 0 ? "+" : "") + a.umsatz.vs_vorwoche_pct + "% vs. Vorwoche" },
    { t: "Lager-Gesundheit", w: a.ladenhueter_anteil_pct + "%", z: "Ladenhueter-Anteil", ampel: s.ampeln.lager_gesundheit },
    { t: "Ausverkaufs-Risiken", w: stand.berichte.alarme.length, z: "A/B-Artikel unter Meldebestand", ampel: s.ampeln.ausverkauf },
    { t: "Lagerwert (EK)", w: chf(a.lagerwert_ek.laden + a.lagerwert_ek.embrach), z: "Laden " + chf(a.lagerwert_ek.laden) + " · Embrach " + chf(a.lagerwert_ek.embrach), ampel: null },
    { t: "Verpasste Verkaufstage", w: a.stockout.t30_tage, z: "geschaetzt ~" + chf(a.stockout.t30_chf_geschaetzt) + " (30 T)", ampel: null },
  ];
  let html = '<div class="kachel-reihe">';
  for (const k of kacheln) {
    html += '<div class="kachel ' + (k.ampel ? "ampel-" + k.ampel : "") + '">' +
      '<div class="titel">' + (k.ampel ? punkt(k.ampel) : "") + esc(k.t) + "</div>" +
      '<div class="wert">' + esc(String(k.w)) + "</div>" +
      '<div class="zusatz">' + esc(k.z) + (k.extra ? " · " + esc(k.extra) : "") + "</div></div>";
  }
  html += "</div>";

  html += '<div class="panel"><table><thead><tr>' +
    "<th>Modell</th><th>Kategorie</th><th>Klasse</th>" +
    '<th class="zahl">7T</th><th class="zahl">30T</th><th class="zahl">90T</th><th class="zahl">365T</th>' +
    '<th class="zahl">Reichweite</th><th class="zahl">Bestand L/E</th><th class="zahl">Meldeb.</th><th>Trigger</th><th>Status</th>' +
    "</tr></thead><tbody>";
  for (const art of s.artikel) {
    const l = art.varianten.reduce((x, v) => x + v.bestand_laden, 0);
    const e = art.varianten.reduce((x, v) => x + v.bestand_embrach, 0);
    const trig = art.trigger === "hersteller_nachbestellung" ? "Nachbestellen" : (art.trigger === "umlagerung" ? "Umlagern" : "—");
    html += "<tr>" +
      "<td><strong>" + esc(art.name) + "</strong><br/><span style='color:var(--text-schwach);font-size:11px'>" + esc(art.modell_id) + "</span></td>" +
      "<td>" + esc(art.kategorie) + "</td>" +
      '<td><span class="klasse klasse-' + art.abc + '">' + art.abc + "</span></td>" +
      '<td class="zahl">' + art.absatz.t7 + "</td>" +
      '<td class="zahl">' + art.absatz.t30 + "</td>" +
      '<td class="zahl">' + art.absatz.t90 + "</td>" +
      '<td class="zahl">' + art.absatz.t365 + "</td>" +
      '<td class="zahl">' + (art.reichweite_tage === null ? "—" : art.reichweite_tage + " T") + "</td>" +
      '<td class="zahl">' + l + " / " + e + "</td>" +
      '<td class="zahl">' + art.meldebestand + "</td>" +
      "<td>" + trig + "</td>" +
      "<td>" + punkt(art.ampel) + "</td>" +
      "</tr>";
  }
  html += "</tbody></table></div>";
  el("uebersicht").innerHTML = html;
}

// ---------- Bestell-Alarme ----------
function renderAlarme() {
  const alarme = stand.berichte.alarme;
  let html = "";
  if (alarme.length === 0) {
    html = '<div class="leer">Keine dringenden Nachbestell-Alarme heute. (Nur A/B-Artikel unter Meldebestand loesen sofort aus.)</div>';
  }
  for (const b of alarme) {
    html += renderKarte(b, true);
  }
  if (stand.berichte.sammel) html += renderKarte(stand.berichte.sammel, false);
  el("alarme").innerHTML = html;
}

function renderKarte(b, rot) {
  let html = '<div class="karte' + (rot ? " rot" : "") + '"><h3>' + esc(b.titel) + "</h3>";
  for (const blk of b.bloecke) {
    html += '<div class="block"><div class="block-titel">' + esc(blk.ueberschrift) + "</div>";
    for (const z of blk.zeilen) html += '<div class="block-zeile">' + esc(z) + "</div>";
    html += "</div>";
  }
  html += checkFuer(b.typ, b.titel) + "</div>";
  return html;
}

// ---------- Wochen-/Monatsbericht ----------
function renderBericht(ziel, b) {
  let html = '<div class="karte"><h3>' + esc(b.titel) + "</h3>";
  for (const blk of b.bloecke) {
    html += '<div class="block"><div class="block-titel">' + esc(blk.ueberschrift) + "</div>";
    for (const z of blk.zeilen) html += '<div class="block-zeile">' + esc(z) + "</div>";
    html += "</div>";
  }
  html += checkFuer(b.typ, b.titel) + "</div>";
  el(ziel).innerHTML = html;
}

// ---------- Research ----------
function renderResearch() {
  const d = stand.dossier;
  let html = '<div class="dossier-hinweis"><strong>Uebungs-Dossier (MOCK).</strong> ' +
    esc(d.hinweis || "") + " Im Echtbetrieb zieht Mitarbeiter 1 woechentlich live aus der gepruefteten Quellen-Whitelist (Tier A/B/C), jede Aussage mit URL + Abrufdatum.</div>";
  for (const e of d.eintraege) {
    html += '<div class="karte"><h3><span class="tier tier-' + e.tier + '">Tier ' + e.tier + "</span>" +
      esc(e.kategorie) + " — <span class='richtung " + e.richtung + "'>" + esc(e.richtung.toUpperCase()) + "</span></h3>" +
      '<div class="block-zeile">' + esc(e.bezug) + "</div>" +
      '<div class="dossier-quelle">Quelle: ' + esc(e.quelle) + ' &middot; <a href="' + esc(e.url) + '" target="_blank" rel="noopener" style="color:var(--violett-hell)">' + esc(e.url) + "</a> &middot; Stand " + esc(e.abrufdatum) + " &middot; Konfidenz: " + esc(e.konfidenz) + " &middot; ID " + esc(e.id) + "</div></div>";
  }
  el("research").innerHTML = html;
}

// ---------- Daten fuettern ----------
async function renderDaten() {
  const html =
    '<div class="daten-hinweis">Hier kommen <strong>Logistik-Stammdaten</strong> (Hersteller, Lieferzeiten, MOQ, EK/VK) und die <strong>alten Verkaufsdaten</strong> rein. ' +
    "Der gleiche Rechenkern arbeitet mit Mock- ODER echten Daten — einfach ersetzen und Tageslauf starten. " +
    "Aktuell laufen Uebungs-Daten (MOCK).</div>" +

    '<div class="daten-block"><h3>1. Alte Verkaeufe als CSV importieren</h3>' +
    "<div class=\"daten-hinweis\">Spalten: <code>datum, sku, menge, kanal, standort</code> (Kopfzeile Pflicht, Komma oder Semikolon). Z.B. Shopify-Export.</div>" +
    '<textarea id="csv-feld" placeholder="datum,sku,menge,kanal,standort&#10;2026-03-14,HOOD-01-M-BLK,2,online,embrach"></textarea>' +
    '<div class="zeilen-knopf"><button class="btn btn-primaer" id="btn-csv">CSV importieren</button><span class="status-text" id="csv-status"></span></div></div>' +

    '<div class="daten-block"><h3>2. Logistik-Stammdaten (Hersteller &amp; Lieferzeiten)</h3>' +
    '<textarea id="stamm-feld"></textarea>' +
    '<div class="zeilen-knopf"><button class="btn btn-primaer" id="btn-stamm">Stammdaten speichern</button><span class="status-text" id="stamm-status"></span></div></div>' +

    '<div class="daten-block"><h3>3. Uebungs-Daten neu erzeugen</h3>' +
    '<div class="daten-hinweis">Setzt alle Daten auf frischen Mock zurueck (fuer die Demo).</div>' +
    '<div class="zeilen-knopf"><button class="btn btn-neben" id="btn-mock2">Mock neu wuerfeln</button></div></div>';
  el("daten").innerHTML = html;

  // Stammdaten laden.
  const stamm = await (await fetch("/api/daten/stammdaten")).json();
  el("stamm-feld").value = JSON.stringify(stamm, null, 2);

  el("btn-csv").onclick = async () => {
    const txt = el("csv-feld").value.trim();
    const st = el("csv-status");
    if (!txt) { st.textContent = "Bitte CSV einfuegen."; st.className = "status-text fehler"; return; }
    const res = await fetch("/api/import/verkaeufe-csv", { method: "POST", headers: { "Content-Type": "text/csv" }, body: txt });
    const j = await res.json();
    if (res.ok) { st.textContent = j.anzahl + " Verkaufszeilen importiert. Starte Tageslauf..."; st.className = "status-text ok"; await laden(true); wechsel("uebersicht"); }
    else { st.textContent = "Fehler: " + j.fehler; st.className = "status-text fehler"; }
  };
  el("btn-stamm").onclick = async () => {
    const st = el("stamm-status");
    let obj;
    try { obj = JSON.parse(el("stamm-feld").value); } catch (e) { st.textContent = "Kein gueltiges JSON."; st.className = "status-text fehler"; return; }
    const res = await fetch("/api/daten/stammdaten", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) });
    if (res.ok) { st.textContent = "Gespeichert. Starte Tageslauf..."; st.className = "status-text ok"; await laden(true); }
    else { const j = await res.json(); st.textContent = "Fehler: " + j.fehler; st.className = "status-text fehler"; }
  };
  el("btn-mock2").onclick = async () => { await fetch("/api/mock-neu", { method: "POST" }); await laden(true); wechsel("uebersicht"); };
}

// ---------- Tabs + Knoepfe ----------
function wechsel(ziel) {
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("aktiv", t.dataset.ziel === ziel));
  document.querySelectorAll(".seite").forEach((s) => s.classList.toggle("aktiv", s.id === ziel));
}
el("tabs").addEventListener("click", (e) => { if (e.target.dataset.ziel) wechsel(e.target.dataset.ziel); });
el("btn-lauf").onclick = () => laden(true);
el("btn-mock").onclick = async () => { await fetch("/api/mock-neu", { method: "POST" }); await laden(true); };

laden(false);
