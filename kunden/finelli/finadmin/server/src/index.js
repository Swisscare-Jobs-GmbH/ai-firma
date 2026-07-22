/**
 * SEA Lager. Verbindet Shopify mit der Handy-App.
 *
 * Shopify fuehrt nur den Gesamtbestand an einem Standort. Die Aufteilung auf
 * Zuerich und Embrach ist eine reine Innensicht fuer die Mitarbeiter und lebt
 * nur hier. Beim Verkauf wird darum zuerst von Zuerich abgezogen, erst wenn
 * Zuerich leer ist von Embrach. Der Verkaufsort ist Zuerich.
 */

const KOPF = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, X-Sea-Key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
};

const antwort = (daten, status = 200) =>
  new Response(JSON.stringify(daten), {status, headers: KOPF});

export default {
  async fetch(anfrage, env) {
    const pfad = new URL(anfrage.url).pathname;
    if (anfrage.method === "OPTIONS") return new Response(null, {status: 204, headers: KOPF});
    try {
      if (pfad === "/")                 return antwort({dienst: "sea-lager", stand: "bereit"});
      if (pfad === "/webhooks/orders")  return await webhookBestellung(anfrage, env);
      if (pfad === "/webhooks/refunds") return await webhookRetoure(anfrage, env);
      if (pfad === "/api/bestand")      return await apiBestand(anfrage, env);
      if (pfad === "/api/buchung")      return await apiBuchung(anfrage, env);
      if (pfad === "/api/abgleich")     return await apiAbgleich(anfrage, env);
      return antwort({fehler: "unbekannter Pfad"}, 404);
    } catch (e) {
      return antwort({fehler: String(e && e.message ? e.message : e)}, 500);
    }
  }
};

/* Signatur der Shopify-Webhooks pruefen */
async function signaturStimmt(anfrage, roh, env) {
  const kopf = anfrage.headers.get("X-Shopify-Hmac-Sha256");
  if (!kopf || !env.SHOPIFY_WEBHOOK_SECRET) return false;
  const schluessel = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(env.SHOPIFY_WEBHOOK_SECRET),
    {name: "HMAC", hash: "SHA-256"}, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", schluessel, new TextEncoder().encode(roh));
  const eigen = btoa(String.fromCharCode.apply(null, new Uint8Array(sig)));
  if (eigen.length !== kopf.length) return false;
  let ungleich = 0;
  for (let i = 0; i < eigen.length; i++) ungleich |= eigen.charCodeAt(i) ^ kopf.charCodeAt(i);
  return ungleich === 0;
}

function normal(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9äöüéèà ]+/g, " ")
    .replace(/\s+/g, " ").trim();
}
function normGroesse(g) {
  const t = String(g || "").trim().toUpperCase();
  if (/^(ONE ?SIZE|OS|UNI|TU|DEFAULT TITLE)$/.test(t)) return "ONE SIZE";
  if (/^\d{2}$/.test(t)) return t;
  const kurz = {SMALL: "S", MEDIUM: "M", LARGE: "L", XLARGE: "XL", "X-LARGE": "XL",
                XXLARGE: "XXL", "2XL": "XXL", XSMALL: "XS", "X-SMALL": "XS"};
  return kurz[t] || t;
}

async function findeZeile(env, pos) {
  const gid = pos.admin_graphql_api_id ||
    (pos.variant_id ? "gid://shopify/ProductVariant/" + pos.variant_id : null);
  if (gid) {
    const t = await env.DB.prepare("SELECT * FROM bestand WHERE variant_gid = ?").bind(gid).first();
    if (t) return t;
  }
  if (pos.sku) {
    const t = await env.DB.prepare("SELECT * FROM bestand WHERE sku = ?").bind(pos.sku).first();
    if (t) return t;
  }
  const titel = String(pos.title || pos.name || "").split(" - ")[0];
  const groesse = normGroesse(pos.variant_title || "");
  if (titel && groesse) {
    const t = await env.DB.prepare("SELECT * FROM bestand WHERE artikel = ? AND groesse = ?")
      .bind(normal(titel), groesse).first();
    if (t) return t;
  }
  return null;
}

/* Abziehen nach Regel: erst Zuerich, dann Embrach */
async function abziehen(env, zeile, anzahl, grund, quelle, schluessel) {
  const reihe = String(env.ABZUG_REIHENFOLGE || "zh,emb").split(",");
  let offen = anzahl;
  const schritte = [];
  for (const ort of reihe) {
    if (offen <= 0) break;
    const nimm = Math.min(zeile[ort] || 0, offen);
    if (nimm > 0) { schritte.push([ort, nimm]); offen -= nimm; }
  }
  if (offen > 0) schritte.push([reihe[0], offen]);

  for (const paar of schritte) {
    const ort = paar[0], n = paar[1];
    const s = schluessel ? schluessel + ":" + ort : null;
    if (s) {
      const schon = await env.DB.prepare("SELECT id FROM bewegung WHERE schluessel = ?").bind(s).first();
      if (schon) continue;
    }
    await env.DB.prepare(
      "UPDATE bestand SET " + ort + " = MAX(0, " + ort + " - ?) WHERE artikel = ? AND groesse = ?"
    ).bind(n, zeile.artikel, zeile.groesse).run();
    await env.DB.prepare(
      "INSERT INTO bewegung (artikel, groesse, ort, delta, grund, quelle, schluessel) VALUES (?,?,?,?,?,?,?)"
    ).bind(zeile.artikel, zeile.groesse, ort, -n, grund, quelle || null, s).run();
  }
  return schritte;
}

async function webhookBestellung(anfrage, env) {
  const roh = await anfrage.text();
  if (!(await signaturStimmt(anfrage, roh, env))) return antwort({fehler: "Signatur falsch"}, 401);
  const daten = JSON.parse(roh);
  const nr = String(daten.name || daten.id || "");
  const ergebnis = [];
  for (const pos of (daten.line_items || [])) {
    const zeile = await findeZeile(env, pos);
    if (!zeile) { ergebnis.push({pos: pos.title, stand: "unbekannt"}); continue; }
    const schritte = await abziehen(env, zeile, pos.quantity || 1, "Verkauf", nr,
                                    "order:" + daten.id + ":" + pos.id);
    ergebnis.push({pos: zeile.titel, groesse: zeile.groesse, schritte: schritte});
  }
  return antwort({ok: true, bestellung: nr, positionen: ergebnis});
}

async function webhookRetoure(anfrage, env) {
  const roh = await anfrage.text();
  if (!(await signaturStimmt(anfrage, roh, env))) return antwort({fehler: "Signatur falsch"}, 401);
  const daten = JSON.parse(roh);
  for (const r of (daten.refund_line_items || [])) {
    const zeile = await findeZeile(env, r.line_item || {});
    if (!zeile) continue;
    const s = "refund:" + daten.id + ":" + r.id;
    const schon = await env.DB.prepare("SELECT id FROM bewegung WHERE schluessel = ?").bind(s).first();
    if (schon) continue;
    const n = r.quantity || 1;
    await env.DB.prepare("UPDATE bestand SET zh = zh + ? WHERE artikel = ? AND groesse = ?")
      .bind(n, zeile.artikel, zeile.groesse).run();
    await env.DB.prepare(
      "INSERT INTO bewegung (artikel, groesse, ort, delta, grund, quelle, schluessel) VALUES (?,?,?,?,?,?,?)"
    ).bind(zeile.artikel, zeile.groesse, "zh", n, "Retoure", String(daten.order_id || ""), s).run();
  }
  return antwort({ok: true});
}

async function apiBestand(anfrage, env) {
  if (!schluesselStimmt(anfrage, env)) return antwort({fehler: "Kein Zugriff"}, 401);
  const erg = await env.DB.prepare(
    "SELECT artikel, groesse, titel, fach, zh, emb, ean FROM bestand ORDER BY titel, groesse"
  ).all();
  return antwort({stand: new Date().toISOString(), zeilen: erg.results || []});
}

async function apiBuchung(anfrage, env) {
  if (!schluesselStimmt(anfrage, env)) return antwort({fehler: "Kein Zugriff"}, 401);
  const b = await anfrage.json();
  const artikel = normal(b.artikel || b.titel || "");
  const groesse = normGroesse(b.groesse || "");
  if (!artikel || !groesse) return antwort({fehler: "Artikel oder Groesse fehlt"}, 400);

  const da = await env.DB.prepare("SELECT * FROM bestand WHERE artikel = ? AND groesse = ?")
    .bind(artikel, groesse).first();
  if (!da) {
    await env.DB.prepare(
      "INSERT INTO bestand (artikel, groesse, titel, fach, zh, emb) VALUES (?,?,?,?,0,0)"
    ).bind(artikel, groesse, b.titel || artikel, b.fach || null).run();
  }

  const schritte = Array.isArray(b.schritte) ? b.schritte : [{ort: b.ort, delta: b.delta}];
  for (const s of schritte) {
    const ort = s.ort === "emb" ? "emb" : "zh";
    const delta = parseInt(s.delta, 10) || 0;
    if (!delta) continue;
    const sch = b.schluessel ? b.schluessel + ":" + ort : null;
    if (sch) {
      const schon = await env.DB.prepare("SELECT id FROM bewegung WHERE schluessel = ?").bind(sch).first();
      if (schon) continue;
    }
    await env.DB.prepare(
      "UPDATE bestand SET " + ort + " = MAX(0, " + ort + " + ?) WHERE artikel = ? AND groesse = ?"
    ).bind(delta, artikel, groesse).run();
    await env.DB.prepare(
      "INSERT INTO bewegung (artikel, groesse, ort, delta, grund, quelle, schluessel) VALUES (?,?,?,?,?,?,?)"
    ).bind(artikel, groesse, ort, delta, b.grund || "Korrektur", b.geraet || null, sch).run();
  }

  const neu = await env.DB.prepare("SELECT zh, emb FROM bestand WHERE artikel = ? AND groesse = ?")
    .bind(artikel, groesse).first();
  let shopify = null;
  if (b.nach_shopify !== false && env.SHOPIFY_TOKEN && env.SHOPIFY_SHOP) {
    shopify = await shopifySetzen(env, artikel, groesse, (neu.zh || 0) + (neu.emb || 0));
  }
  return antwort({ok: true, zh: neu.zh, emb: neu.emb,
                  gesamt: (neu.zh || 0) + (neu.emb || 0), shopify: shopify});
}

async function shopifySetzen(env, artikel, groesse, gesamt) {
  const zeile = await env.DB.prepare(
    "SELECT variant_gid FROM bestand WHERE artikel = ? AND groesse = ?"
  ).bind(artikel, groesse).first();
  if (!zeile || !zeile.variant_gid) return {stand: "keine Variante hinterlegt"};

  const v = await shopifyGraphQL(env,
    "query($id: ID!) { productVariant(id: $id) { inventoryItem { id } } }", {id: zeile.variant_gid});
  const item = v && v.data && v.data.productVariant && v.data.productVariant.inventoryItem;
  if (!item) return {stand: "Variante nicht gefunden"};

  const orte = await shopifyGraphQL(env, "{ locations(first: 1) { nodes { id } } }", {});
  const ort = orte && orte.data && orte.data.locations && orte.data.locations.nodes[0];
  if (!ort) return {stand: "kein Standort"};

  const erg = await shopifyGraphQL(env,
    "mutation($eingabe: InventorySetQuantitiesInput!) { inventorySetQuantities(input: $eingabe) { userErrors { field message } } }",
    {eingabe: {name: "available", reason: "correction", ignoreCompareQuantity: true,
               quantities: [{inventoryItemId: item.id, locationId: ort.id, quantity: gesamt}]}});
  const fehler = erg && erg.data && erg.data.inventorySetQuantities &&
                 erg.data.inventorySetQuantities.userErrors;
  return {stand: fehler && fehler.length ? "Fehler" : "gesetzt", gesamt: gesamt, fehler: fehler || []};
}

async function shopifyGraphQL(env, frage, variablen) {
  const r = await fetch("https://" + env.SHOPIFY_SHOP + "/admin/api/2026-07/graphql.json", {
    method: "POST",
    headers: {"Content-Type": "application/json", "X-Shopify-Access-Token": env.SHOPIFY_TOKEN},
    body: JSON.stringify({query: frage, variables: variablen})
  });
  return await r.json();
}

async function apiAbgleich(anfrage, env) {
  if (!schluesselStimmt(anfrage, env)) return antwort({fehler: "Kein Zugriff"}, 401);
  if (!env.SHOPIFY_TOKEN || !env.SHOPIFY_SHOP) return antwort({fehler: "Shopify nicht eingerichtet"}, 400);

  const frage = "query($nach: String) { productVariants(first: 250, after: $nach) { " +
    "pageInfo { hasNextPage endCursor } nodes { id sku barcode title product { title } } } }";
  let nach = null, gezaehlt = 0;
  for (let runde = 0; runde < 20; runde++) {
    const erg = await shopifyGraphQL(env, frage, {nach: nach});
    const daten = erg && erg.data && erg.data.productVariants;
    if (!daten) break;
    for (const v of daten.nodes) {
      const artikel = normal(v.product ? v.product.title : "");
      const groesse = normGroesse(v.title);
      if (!artikel || !groesse) continue;
      await env.DB.prepare(
        "INSERT INTO bestand (artikel, groesse, titel, variant_gid, sku, ean, zh, emb) " +
        "VALUES (?,?,?,?,?,?,0,0) ON CONFLICT(artikel, groesse) DO UPDATE SET " +
        "variant_gid = excluded.variant_gid, sku = excluded.sku, " +
        "ean = COALESCE(NULLIF(excluded.ean, ''), bestand.ean)"
      ).bind(artikel, groesse, v.product ? v.product.title : artikel,
             v.id, v.sku || null, v.barcode || null).run();
      gezaehlt++;
    }
    if (!daten.pageInfo.hasNextPage) break;
    nach = daten.pageInfo.endCursor;
  }
  return antwort({ok: true, varianten: gezaehlt});
}

function schluesselStimmt(anfrage, env) {
  if (!env.APP_KEY) return true;
  return anfrage.headers.get("X-Sea-Key") === env.APP_KEY;
}
