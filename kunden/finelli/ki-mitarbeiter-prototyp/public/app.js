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
  renderPack();
  renderLadenScan();
  renderHandyScan();
  renderLogistik();
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

// ---------- Groessen-Farb-Legende ----------
function farbeVon(g) { return (stand.snapshot.groessen_farben || {})[g] || "#9a92b4"; }
function groesseChip(g) { return '<span class="gr-chip" style="background:' + farbeVon(g) + '">' + esc(g) + "</span>"; }
function legende() {
  const gf = stand.snapshot.groessen_farben || {};
  let h = '<div class="legende">Groessen-Farben: ';
  for (const g of Object.keys(gf)) h += groesseChip(g);
  return h + "</div>";
}

// ---------- Packstation ----------
let aktiverAuftrag = null;
let packStart = null;

function renderPack() {
  const pack = stand.snapshot.pack;
  const auftraege = pack.auftraege;
  let links = '<div class="pack-spalte"><h3>Offene Pakete (' + auftraege.length + ")</h3>";
  if (auftraege.length === 0) links += '<div class="leer">Keine offenen Pakete.</div>';
  for (const a of auftraege) {
    const aktiv = a.id === aktiverAuftrag;
    links += '<div class="auftrag' + (aktiv ? " aktiv" : "") + '" data-id="' + esc(a.id) + '">' +
      "<strong>" + esc(a.id) + "</strong> <span style='color:var(--text-schwach)'>(" + esc(a.quelle) + ")</span><br/>" +
      a.positionen.map((p) => p.menge + "x " + esc(p.name) + " " + esc(p.groesse)).join(", ") + "</div>";
  }
  const s = pack.statistik;
  links += '<div class="pack-stat">Gepackt: <strong>' + s.anzahl_gepackt + "</strong>" +
    (s.dauer_avg_s !== null ? " · Ø " + s.dauer_avg_s + " s/Paket" : "") + "</div>";
  if (s.letzte.length) links += '<div class="pack-stat-klein">Letzte: ' + s.letzte.map((l) => l.dauer_s + "s").join(" · ") + "</div>";
  links += "</div>";

  // Pickliste + Timer fuer aktiven Auftrag
  let pick = "";
  const aktiv = auftraege.find((a) => a.id === aktiverAuftrag);
  if (aktiv) {
    pick = '<div class="pick"><h3>Pickliste ' + esc(aktiv.id) + "</h3>";
    for (const p of aktiv.positionen) {
      pick += '<div class="pick-zeile">' + groesseChip(p.groesse) +
        " <strong style='font-size:17px'>" + esc(p.groesse) + "</strong> " + esc(p.name) + " " + esc(p.farbe) +
        ' <span class="fach-chip">Fach ' + esc(p.fach) + "</span></div>";
    }
    pick += '<div class="zeilen-knopf">' +
      (packStart ? '<button class="btn btn-primaer" id="btn-fertig">Paket fertig</button><span class="status-text" id="pack-timer">laeuft...</span>'
                 : '<button class="btn btn-primaer" id="btn-start">Packen starten</button>') +
      "</div></div>";
  } else {
    pick = '<div class="pick leer">Links ein Paket waehlen — dann Karte + Pickliste.</div>';
  }

  // 2D-Karte Embrach (Faecher nach Zone), aktive Faecher leuchten.
  const aktiveFaecher = new Set(aktiv ? aktiv.positionen.map((p) => p.fach) : []);
  const zonen = { P: [], S: [], W: [], L: [] };
  for (const art of stand.snapshot.artikel) {
    const f = art.faecher.embrach;
    (zonen[f[0]] = zonen[f[0]] || []).push({ fach: f, name: art.name, count: art.bestand_detail.embrach });
  }
  const zonenNamen = { P: "Packzone (Top-Seller)", S: "Standard", W: "Saison", L: "Langsamdreher" };
  let karte = '<div class="pack-spalte breit"><h3>Lager Embrach — 2D-Karte</h3>' + legende() +
    '<div class="packplatz-zeile"><span class="packplatz">PACKPLATZ</span> kurze Wege = Packzone daneben</div>';
  for (const z of ["P", "S", "W", "L"]) {
    const faecher = (zonen[z] || []).sort((a, b) => a.fach.localeCompare(b.fach));
    if (!faecher.length) continue;
    karte += '<div class="zone"><div class="zone-titel">' + zonenNamen[z] + '</div><div class="fach-grid">';
    for (const f of faecher) {
      karte += '<div class="fach zone-' + z + (aktiveFaecher.has(f.fach) ? " leucht" : "") + '">' +
        '<div class="fach-code">' + esc(f.fach) + "</div><div class='fach-name'>" + esc(f.name) + "</div><div class='fach-count'>" + f.count + " St.</div></div>";
    }
    karte += "</div></div>";
  }
  karte += "</div>";

  el("packstation").innerHTML = '<div class="pack-layout">' + links + pick + karte + "</div>";

  // Interaktionen
  el("packstation").querySelectorAll(".auftrag").forEach((n) => {
    n.onclick = () => { aktiverAuftrag = n.dataset.id; packStart = null; renderPack(); };
  });
  const bStart = el("btn-start");
  if (bStart) bStart.onclick = () => { packStart = Date.now(); renderPack(); };
  const bFertig = el("btn-fertig");
  if (bFertig) bFertig.onclick = async () => {
    const dauer = Math.max(1, Math.round((Date.now() - packStart) / 1000));
    await fetch("/api/pack/fertig", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ auftrag_id: aktiverAuftrag, dauer_s: dauer }) });
    aktiverAuftrag = null; packStart = null;
    await laden(true);
    wechsel("packstation");
  };
  // Live-Timer
  if (packStart) {
    const t = el("pack-timer");
    if (t) { const upd = () => { if (packStart && el("pack-timer")) el("pack-timer").textContent = Math.round((Date.now() - packStart) / 1000) + " s"; }; upd(); }
  }
}

// ---------- Laden-Scan ----------
function renderLadenScan() {
  el("ladenscan").innerHTML =
    '<div class="daten-hinweis">Artikel scannen (SKU wie <code>HOOD-01-M-BLK</code> oder Modell wie <code>HOOD-01</code>) — sofort sehen, wo welche Groesse liegt. Ist die Groesse nicht im Haus: Online-Order fuer den Kunden aufnehmen.</div>' +
    '<div class="zeilen-knopf"><input id="scan-feld" class="scan-input" placeholder="Scannen oder tippen + Enter" autofocus /><button class="btn btn-primaer" id="btn-scan">Suchen</button></div>' +
    legende() + '<div id="scan-ergebnis"></div>';
  const feld = el("scan-feld");
  const tun = () => scanne(feld.value.trim());
  el("btn-scan").onclick = tun;
  feld.onkeydown = (e) => { if (e.key === "Enter") tun(); };
}

function scanne(text) {
  const ziel = el("scan-ergebnis");
  if (!text) { ziel.innerHTML = ""; return; }
  const t = text.toUpperCase();
  const art = stand.snapshot.artikel.find((a) => a.modell_id === t) ||
    stand.snapshot.artikel.find((a) => a.varianten.some((v) => v.sku === t));
  if (!art) { ziel.innerHTML = '<div class="karte rot">Nicht gefunden: ' + esc(text) + "</div>"; return; }
  const gescannteSku = art.varianten.find((v) => v.sku === t);
  let h = '<div class="karte"><h3>' + esc(art.name) + " <span class='klasse klasse-" + art.abc + "'>" + art.abc + "</span></h3>";
  h += '<div class="ort-chips">' +
    ortChip("Front", art.faecher.front, art.bestand_detail.front) +
    ortChip("Reserve", art.faecher.reserve, art.bestand_detail.reserve) +
    ortChip("Untergeschoss", art.faecher.untergeschoss, art.bestand_detail.untergeschoss) +
    ortChip("Embrach", art.faecher.embrach, art.bestand_detail.embrach) + "</div>";
  if (art.bestand_detail.front === 0 && (art.bestand_detail.reserve + art.bestand_detail.untergeschoss) > 0)
    h += '<div class="hinweis-check">Nicht in der Front, aber im Haus: Reserve/UG pruefen.</div>';
  h += '<table style="margin-top:12px"><thead><tr><th>Groesse/Farbe</th><th class="zahl">Front</th><th class="zahl">Reserve</th><th class="zahl">UG</th><th class="zahl">Embrach</th></tr></thead><tbody>';
  for (const v of art.varianten) {
    const her = gescannteSku && gescannteSku.sku === v.sku;
    h += "<tr" + (her ? ' style="background:var(--panel-2)"' : "") + ">" +
      "<td>" + groesseChip(v.groesse) + " " + esc(v.groesse) + " / " + esc(v.farbe) + "</td>" +
      '<td class="zahl">' + v.bestand_front + '</td><td class="zahl">' + v.bestand_reserve + '</td><td class="zahl">' + v.bestand_untergeschoss + '</td><td class="zahl">' + v.bestand_embrach + "</td></tr>";
  }
  h += "</tbody></table>";
  // "Grosse nicht im Laden da?" -> auf Varianten-Ebene pruefen (Kunde will genau diese Groesse).
  let orderSku = null, orderText = "";
  if (gescannteSku) {
    const vLaden = gescannteSku.bestand_front + gescannteSku.bestand_reserve + gescannteSku.bestand_untergeschoss;
    if (vLaden === 0) {
      orderSku = gescannteSku.sku;
      orderText = "Groesse " + esc(gescannteSku.groesse) + "/" + esc(gescannteSku.farbe) + " ist NICHT im Laden" +
        (gescannteSku.bestand_embrach > 0 ? " (aber " + gescannteSku.bestand_embrach + " in Embrach)" : "") + " — Order fuer den Kunden aufnehmen, statt ihn zu verlieren.";
    }
  } else if ((art.bestand_detail.front + art.bestand_detail.reserve + art.bestand_detail.untergeschoss) === 0) {
    orderSku = art.varianten[0].sku;
    orderText = "Nichts im Laden — Order fuer den Kunden aufnehmen.";
  }
  if (orderSku) {
    h += '<div class="hinweis-check">' + orderText + '</div>' +
      '<div class="zeilen-knopf"><button class="btn btn-primaer" id="btn-order" data-sku="' + esc(orderSku) + '">Online-Order fuer Kunden aufnehmen</button><span class="status-text" id="order-status"></span></div>';
  }
  h += "</div>";
  ziel.innerHTML = h;
  const bo = el("btn-order");
  if (bo) bo.onclick = async () => {
    const res = await fetch("/api/pack/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sku: bo.dataset.sku, menge: 1 }) });
    const j = await res.json();
    el("order-status").textContent = res.ok ? "Order aufgenommen: " + j.auftrag.id + " (Packstation)" : "Fehler: " + j.fehler;
    el("order-status").className = "status-text " + (res.ok ? "ok" : "fehler");
  };
}
function ortChip(name, fach, count) {
  return '<span class="ort-chip"><strong>' + esc(name) + "</strong> Fach " + esc(fach) + " · <strong>" + count + "</strong> St.</span>";
}

// ---------- Logistik ----------
function renderLogistik() {
  const hinweise = stand.snapshot.logistik_hinweise;
  const typNamen = { laden_holen: "Online-Renner in den Laden holen", letzte_stuecke: "Letzte Stuecke zum Abverkauf praesentieren", slotting: "Slotting: Top-Seller naeher an Packplatz", umlagerung: "Umlagern Embrach -> Laden", nachbestellen: "Nachbestellen" };
  const gruppen = {};
  for (const h of hinweise) (gruppen[h.typ] = gruppen[h.typ] || []).push(h);

  let html = "";
  // Nachbestellen aus den Alarmen verlinken
  if (stand.berichte.alarme.length) {
    html += '<div class="karte"><h3>' + typNamen.nachbestellen + " (" + stand.berichte.alarme.length + ")</h3>" +
      stand.berichte.alarme.map((a) => '<div class="block-zeile">' + esc(a.titel) + " (Details im Tab Bestell-Alarme)</div>").join("") + "</div>";
  }
  for (const typ of ["laden_holen", "letzte_stuecke", "umlagerung", "slotting"]) {
    if (!gruppen[typ]) continue;
    html += '<div class="karte"><h3>' + esc(typNamen[typ]) + " (" + gruppen[typ].length + ")</h3>" +
      gruppen[typ].map((h) => '<div class="block-zeile">' + esc(h.text) + "</div>").join("") + "</div>";
  }

  // Lager-Landkarte: 4 Orte mit Stueck + Wert
  const orte = { front: 0, reserve: 0, untergeschoss: 0, embrach: 0 };
  let wert = 0;
  for (const a of stand.snapshot.artikel) {
    orte.front += a.bestand_detail.front; orte.reserve += a.bestand_detail.reserve;
    orte.untergeschoss += a.bestand_detail.untergeschoss; orte.embrach += a.bestand_detail.embrach;
    wert += (a.bestand_detail.front + a.bestand_detail.reserve + a.bestand_detail.untergeschoss + a.bestand_detail.embrach) * a.ek;
  }
  html += '<div class="karte"><h3>Lager-Landkarte (4 Orte)</h3><div class="kachel-reihe">' +
    ortKachel("Laden-Front", orte.front) + ortKachel("Laden-Reserve", orte.reserve) +
    ortKachel("Untergeschoss", orte.untergeschoss) + ortKachel("Embrach", orte.embrach) +
    '</div><div class="zusatz">Gesamt-Warenwert (EK): ' + chf(wert) + "</div>";
  const kommend = stand.snapshot.artikel.filter((a) => a.faecher && a.faecher.geplant_ab);
  if (kommend.length) html += '<div class="hinweis-check" style="margin-top:10px">Kommende Kollektion: ' + kommend.map((a) => esc(a.name) + " ab " + esc(a.faecher.geplant_ab) + " (Fach " + esc(a.faecher.untergeschoss) + ")").join(" · ") + "</div>";
  html += "</div>";

  el("logistik").innerHTML = html || '<div class="leer">Keine Logistik-Hinweise.</div>';
}
function ortKachel(name, stueck) {
  return '<div class="kachel"><div class="titel">' + esc(name) + '</div><div class="wert">' + stueck + '</div><div class="zusatz">Stueck</div></div>';
}

// ---------- Handy-Scan (Kamera-App, Demo) ----------
function renderHandyScan() {
  // Schnell-Scan-Buttons: erster Artikel, ein Online-Renner, eine Groesse die NICHT im Laden ist.
  const arts = stand.snapshot.artikel;
  const chips = [];
  const benutzt = new Set();
  if (arts[0]) { chips.push(arts[0].varianten[0].sku); benutzt.add(arts[0].modell_id); }
  // Online-Renner (hoechster Online-Anteil, anderes Modell)
  const online = arts.filter((a) => a.online_anteil_t30 >= 60 && !benutzt.has(a.modell_id))
    .sort((a, b) => b.online_anteil_t30 - a.online_anteil_t30)[0];
  if (online) { chips.push(online.varianten[Math.min(1, online.varianten.length - 1)].sku); benutzt.add(online.modell_id); }
  // Eine Groesse, die NICHT im Laden ist (drittes Modell) -> zeigt die Order-Aufnahme
  for (const a of arts) {
    if (benutzt.has(a.modell_id)) continue;
    const v = a.varianten.find((v) => (v.bestand_front + v.bestand_reserve + v.bestand_untergeschoss) === 0 && v.bestand_embrach > 0);
    if (v) { chips.push(v.sku); break; }
  }
  const uniq = [...new Set(chips)];

  el("handyscan").innerHTML =
    '<div class="daten-hinweis">So sieht der Mitarbeiter es auf dem Handy: Artikel mit der Kamera scannen, sofort steht da, wo die Groesse liegt. (Demo: Code tippen oder unten antippen — die echte App scannt den Barcode.)</div>' +
    '<div class="handy-wrap"><div class="handy">' +
      '<div class="handy-kamera"><div class="scanlinie"></div><span class="kamera-text">Kamera — Barcode scannen</span></div>' +
      '<div class="handy-screen">' +
        '<input id="handy-feld" class="handy-input" placeholder="Code tippen + Enter" />' +
        '<div class="handy-quick">' + uniq.map((s) => '<button class="quick-chip" data-sku="' + esc(s) + '">' + esc(s) + "</button>").join("") + "</div>" +
        '<div id="handy-ergebnis"></div>' +
      "</div></div></div>";

  const feld = el("handy-feld");
  feld.onkeydown = (e) => { if (e.key === "Enter") handyScanne(feld.value.trim()); };
  el("handyscan").querySelectorAll(".quick-chip").forEach((b) => {
    b.onclick = () => { feld.value = b.dataset.sku; handyScanne(b.dataset.sku); };
  });
}

function handyScanne(text) {
  const ziel = el("handy-ergebnis");
  if (!text) { ziel.innerHTML = ""; return; }
  const t = text.toUpperCase();
  const art = stand.snapshot.artikel.find((a) => a.modell_id === t) ||
    stand.snapshot.artikel.find((a) => a.varianten.some((v) => v.sku === t));
  if (!art) { ziel.innerHTML = '<div class="ht-fehler">Nicht gefunden: ' + esc(text) + "</div>"; return; }
  const v = art.varianten.find((x) => x.sku === t) || null;
  const orte = v
    ? [["Laden-Front", art.faecher.front, v.bestand_front], ["Reserve", art.faecher.reserve, v.bestand_reserve], ["Untergeschoss", art.faecher.untergeschoss, v.bestand_untergeschoss], ["Embrach", art.faecher.embrach, v.bestand_embrach]]
    : [["Laden-Front", art.faecher.front, art.bestand_detail.front], ["Reserve", art.faecher.reserve, art.bestand_detail.reserve], ["Untergeschoss", art.faecher.untergeschoss, art.bestand_detail.untergeschoss], ["Embrach", art.faecher.embrach, art.bestand_detail.embrach]];
  const naechste = orte.find((o) => o[2] > 0);

  let h = '<div class="handy-treffer"><div class="ht-name">' + esc(art.name) + (v ? " " + groesseChip(v.groesse) + " " + esc(v.groesse) + "/" + esc(v.farbe) : "") + "</div>";
  if (naechste) {
    h += '<div class="ht-ziel">Geh zu <span class="fach-chip">' + esc(naechste[1]) + "</span> " + esc(naechste[0]) + " · <strong>" + naechste[2] + "</strong> St.</div>";
  } else {
    h += '<div class="ht-ziel warn">Nirgends auf Lager.</div>';
  }
  h += '<div class="ht-orte">' + orte.map((o) => '<div class="ht-ort' + (o[2] > 0 ? "" : " leer") + '">' + esc(o[0]) + " <span class='fach-mini'>" + esc(o[1]) + "</span> <strong>" + o[2] + "</strong></div>").join("") + "</div>";
  const imLaden = v ? (v.bestand_front + v.bestand_reserve + v.bestand_untergeschoss) : (art.bestand_detail.front + art.bestand_detail.reserve + art.bestand_detail.untergeschoss);
  if (imLaden === 0) {
    const sku = v ? v.sku : art.varianten[0].sku;
    h += '<div class="ht-warn">Nicht im Laden — Order fuer den Kunden aufnehmen.</div>' +
      '<button class="btn btn-primaer" id="btn-order-h" data-sku="' + esc(sku) + '" style="width:100%;margin-top:8px">Online-Order aufnehmen</button><div class="status-text" id="order-h-status"></div>';
  }
  h += "</div>";
  ziel.innerHTML = h;
  const bo = el("btn-order-h");
  if (bo) bo.onclick = async () => {
    const res = await fetch("/api/pack/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sku: bo.dataset.sku, menge: 1 }) });
    const j = await res.json();
    el("order-h-status").textContent = res.ok ? "Order aufgenommen: " + j.auftrag.id : "Fehler: " + j.fehler;
    el("order-h-status").className = "status-text " + (res.ok ? "ok" : "fehler");
  };
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
