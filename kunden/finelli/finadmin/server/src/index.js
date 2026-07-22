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
      if (pfad === "/")                 return await startseite(env);
      if (pfad === "/oauth/start")      return oauthStart(anfrage, env);
      if (pfad === "/oauth/callback")   return await oauthRueckkehr(anfrage, env);
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

/* ---------- Installation ueber OAuth ----------
   Der Zugriffstoken wird nie von Hand kopiert. Shopify schickt beim Installieren
   einen Code an /oauth/callback, der Worker tauscht ihn gegen den Token und legt
   ihn in der Datenbank ab. */

async function tokenHolen(env) {
  if (env.SHOPIFY_TOKEN) return {shop: env.SHOPIFY_SHOP, token: env.SHOPIFY_TOKEN};
  try {
    const z = await env.DB.prepare("SELECT shop, token FROM laden ORDER BY erstellt DESC LIMIT 1").first();
    return z || null;
  } catch (e) { return null; }
}

async function startseite(env) {
  const l = await tokenHolen(env);
  let zeilen = 0;
  try {
    const z = await env.DB.prepare("SELECT COUNT(*) AS n FROM bestand").first();
    zeilen = z ? z.n : 0;
  } catch (e) {}
  return antwort({
    dienst: "sea-lager",
    shopify: l ? "verbunden mit " + l.shop : "noch nicht installiert",
    bestandszeilen: zeilen
  });
}

function oauthStart(anfrage, env) {
  const url = new URL(anfrage.url);
  const shop = url.searchParams.get("shop");
  if (!shop || !/^[a-z0-9-]+\.myshopify\.com$/i.test(shop)) {
    return antwort({fehler: "shop fehlt, Beispiel: /oauth/start?shop=deinladen.myshopify.com"}, 400);
  }
  if (!env.SHOPIFY_CLIENT_ID) return antwort({fehler: "SHOPIFY_CLIENT_ID fehlt"}, 500);
  const ziel = "https://" + shop + "/admin/oauth/authorize" +
    "?client_id=" + encodeURIComponent(env.SHOPIFY_CLIENT_ID) +
    "&scope=" + encodeURIComponent("read_products,read_inventory,write_inventory,read_orders") +
    "&redirect_uri=" + encodeURIComponent(url.origin + "/oauth/callback");
  return Response.redirect(ziel, 302);
}

async function oauthRueckkehr(anfrage, env) {
  const url = new URL(anfrage.url);
  const shop = url.searchParams.get("shop");
  const code = url.searchParams.get("code");
  if (!shop || !code) return antwort({fehler: "shop oder code fehlt"}, 400);
  if (!env.SHOPIFY_CLIENT_ID || !env.SHOPIFY_CLIENT_SECRET) {
    return antwort({fehler: "SHOPIFY_CLIENT_ID oder SHOPIFY_CLIENT_SECRET fehlt"}, 500);
  }

  const r = await fetch("https://" + shop + "/admin/oauth/access_token", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      client_id: env.SHOPIFY_CLIENT_ID,
      client_secret: env.SHOPIFY_CLIENT_SECRET,
      code: code
    })
  });
  const daten = await r.json();
  if (!daten.access_token) return antwort({fehler: "kein Token erhalten", antwort: daten}, 500);

  await env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS laden (shop TEXT PRIMARY KEY, token TEXT NOT NULL, " +
    "erstellt TEXT NOT NULL DEFAULT (datetime('now')))"
  ).run();
  await env.DB.prepare(
    "INSERT INTO laden (shop, token) VALUES (?,?) ON CONFLICT(shop) DO UPDATE SET token = excluded.token"
  ).bind(shop, daten.access_token).run();

  const abos = await webhooksAnlegen(env, shop, daten.access_token, url.origin);
  return new Response(
    "<!doctype html><meta charset=utf-8><title>SEA Lager</title>" +
    "<body style=\"font:17px/1.5 system-ui;padding:40px;max-width:520px\">" +
    "<h1 style=\"font-family:Georgia,serif\">Verbunden</h1>" +
    "<p>" + shop + "</p><p>Webhooks: " + abos.join(", ") + "</p>" +
    "<p>Du kannst dieses Fenster schliessen.</p></body>",
    {status: 200, headers: {"Content-Type": "text/html; charset=utf-8"}}
  );
}

async function webhooksAnlegen(env, shop, token, basis) {
  const wunsch = [
    ["ORDERS_CREATE", basis + "/webhooks/orders"],
    ["REFUNDS_CREATE", basis + "/webhooks/refunds"]
  ];
  const stand = [];
  for (const [thema, ziel] of wunsch) {
    const frage = "mutation($thema: WebhookSubscriptionTopic!, $eingabe: WebhookSubscriptionInput!) {" +
      " webhookSubscriptionCreate(topic: $thema, webhookSubscription: $eingabe) {" +
      " userErrors { message } webhookSubscription { id } } }";
    const r = await fetch("https://" + shop + "/admin/api/2026-07/graphql.json", {
      method: "POST",
      headers: {"Content-Type": "application/json", "X-Shopify-Access-Token": token},
      body: JSON.stringify({query: frage, variables: {thema: thema, eingabe: {callbackUrl: ziel, format: "JSON"}}})
    });
    const e = await r.json();
    const w = e && e.data && e.data.webhookSubscriptionCreate;
    stand.push(thema + (w && w.webhookSubscription ? " ok" : " " +
      (w && w.userErrors && w.userErrors.length ? w.userErrors[0].message : "Fehler")));
  }
  return stand;
}

/* Signatur der Shopify-Webhooks pruefen */
async function signaturStimmt(anfrage, roh, env) {
  const kopf = anfrage.headers.get("X-Shopify-Hmac-Sha256");
  // Bei OAuth-Apps ist das Client-Secret zugleich der Webhook-Schluessel.
  const geheim = env.SHOPIFY_WEBHOOK_SECRET || env.SHOPIFY_CLIENT_SECRET;
  if (!kopf || !geheim) return false;
  const schluessel = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(geheim),
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
  if (b.nach_shopify !== false) {
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
  const l = await tokenHolen(env);
  if (!l || !l.token || !l.shop) return {fehler: "Shopify nicht verbunden"};
  const r = await fetch("https://" + l.shop + "/admin/api/2026-07/graphql.json", {
    method: "POST",
    headers: {"Content-Type": "application/json", "X-Shopify-Access-Token": l.token},
    body: JSON.stringify({query: frage, variables: variablen})
  });
  return await r.json();
}

async function apiAbgleich(anfrage, env) {
  if (!schluesselStimmt(anfrage, env)) return antwort({fehler: "Kein Zugriff"}, 401);
  

  const frage = "query($nach: String) { productVariants(first: 250, after: $nach) { " +
    "pageInfo { hasNextPage endCursor } nodes { id sku barcode title product { title } } } }";
  // Cloudflare deckelt die Zahl der Einzelaufrufe je Worker-Lauf. Die Schreibvorgaenge
  // gehen darum gebuendelt raus, und der Lauf ist ueber ?nach= fortsetzbar.
  const url = new URL(anfrage.url);
  let nach = url.searchParams.get("nach") || null;
  let gezaehlt = 0, weiter = null;

  for (let runde = 0; runde < 4; runde++) {
    const erg = await shopifyGraphQL(env, frage, {nach: nach});
    const daten = erg && erg.data && erg.data.productVariants;
    if (!daten) return antwort({fehler: "Shopify antwortet nicht wie erwartet", roh: erg}, 502);

    const stapel = [];
    for (const v of daten.nodes) {
      const artikel = normal(v.product ? v.product.title : "");
      const groesse = normGroesse(v.title);
      if (!artikel || !groesse) continue;
      stapel.push(env.DB.prepare(
        "INSERT INTO bestand (artikel, groesse, titel, variant_gid, sku, ean, zh, emb) " +
        "VALUES (?,?,?,?,?,?,0,0) ON CONFLICT(artikel, groesse) DO UPDATE SET " +
        "variant_gid = excluded.variant_gid, sku = excluded.sku, " +
        "ean = COALESCE(NULLIF(excluded.ean, ''), bestand.ean)"
      ).bind(artikel, groesse, v.product ? v.product.title : artikel,
             v.id, v.sku || null, v.barcode || null));
    }
    if (stapel.length) await env.DB.batch(stapel);
    gezaehlt += stapel.length;

    if (!daten.pageInfo.hasNextPage) { weiter = null; break; }
    nach = daten.pageInfo.endCursor;
    weiter = nach;
  }
  return antwort({ok: true, varianten: gezaehlt, weiter: weiter});
}

function schluesselStimmt(anfrage, env) {
  if (!env.APP_KEY) return true;
  return anfrage.headers.get("X-Sea-Key") === env.APP_KEY;
}
