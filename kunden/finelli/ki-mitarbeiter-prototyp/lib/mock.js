// Mock-Generator (Daten-Fundament E0). Erzeugt Finelli-realistische Uebungs-Daten
// DETERMINISTISCH aus dem Kalendertag (Bauplan G8): Verkaeufe eines Tages haengen nur
// vom Ordinal DIESES Tages ab -> die Historie bleibt ueber Neustarts + Mitternacht
// stabil, nur "heute" kommt dazu. So friert nichts ein (Demo-Killer-Lesson).
//
// Der Katalog deckt bewusst alle Pflicht-Szenarien ab: ROT-Alarm (A/B), Umlagerung
// Embrach->Laden, MOQ groesser als Bedarf, Ladenhueter (D), Saisonartikel ausserhalb
// der Saison. Diese Daten sind die "einfuetter"-Grenze: nach dem Ja durch echte
// Logistik-Stammdaten + echte Verkaufshistorie ersetzen, gleicher Code rechnet weiter.

const { ordinal, ausOrdinal, imSaisonFenster } = require("./datum");

// ---------- deterministischer Zufall ----------

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rngFor(sku, ord) {
  return mulberry32((hashStr(sku) ^ Math.imul(ord, 2654435761)) >>> 0);
}

// ---------- Katalog ----------

const FARBCODE = { Schwarz: "BLK", Grau: "GRY", Weiss: "WHT", Oliv: "OLV", Navy: "NVY", Sand: "SND", Beige: "BEI", Rot: "RED", Creme: "CRM" };
const SIZE_W = { XS: 0.5, S: 0.9, M: 1.3, L: 1.3, XL: 0.9, XXL: 0.5, One: 1, "40": 0.6, "41": 1, "42": 1.2, "43": 1.1, "44": 0.8, "45": 0.5 };
const APPAREL = ["S", "M", "L", "XL"];
const APPAREL_XXL = ["S", "M", "L", "XL", "XXL"];
const SNKR = ["40", "41", "42", "43", "44", "45"];

// scenario: alarm | normal | moq | umlagerung | ladenhueter | saison
const KATALOG = [
  { id: "HOOD-01", name: "Heavy Hoodie", kat: "Hoodies", her: "Lisboa Knit", wbz: [18, 28, 42], tr: 2, moq: 50, ek: 22, vk: 89, groessen: APPAREL_XXL, farben: ["Schwarz", "Grau"], rate: 0.35, szen: "alarm" },
  { id: "HOOD-02", name: "Zip Hoodie", kat: "Hoodies", her: "Lisboa Knit", wbz: [18, 28, 42], tr: 2, moq: 120, ek: 24, vk: 95, groessen: APPAREL, farben: ["Schwarz", "Oliv"], rate: 0.10, szen: "moq" },
  { id: "TEE-01", name: "Boxy Tee", kat: "T-Shirts", her: "Porto Tees", wbz: [14, 21, 30], tr: 2, moq: 100, ek: 8, vk: 39, groessen: APPAREL_XXL, farben: ["Weiss", "Schwarz"], rate: 0.35, szen: "alarm" },
  { id: "TEE-02", name: "Logo Tee", kat: "T-Shirts", her: "Porto Tees", wbz: [14, 21, 30], tr: 2, moq: 100, ek: 9, vk: 42, groessen: APPAREL, farben: ["Weiss", "Schwarz"], rate: 0.13, szen: "normal" },
  { id: "TEE-03", name: "Pocket Tee", kat: "T-Shirts", her: "Porto Tees", wbz: [14, 21, 30], tr: 2, moq: 100, ek: 9, vk: 42, groessen: APPAREL, farben: ["Sand", "Schwarz"], rate: 0.16, szen: "umlagerung" },
  { id: "CAP-01", name: "6-Panel Cap", kat: "Caps", her: "Basel Headwear", wbz: [20, 30, 45], tr: 2, moq: 48, ek: 6, vk: 34, groessen: ["One"], farben: ["Schwarz", "Beige"], rate: 0.22, szen: "normal" },
  { id: "CARGO-01", name: "Cargo Pant", kat: "Cargo-Hosen", her: "Zurich Denim", wbz: [25, 40, 60], tr: 3, moq: 40, ek: 28, vk: 119, groessen: APPAREL, farben: ["Schwarz", "Oliv"], rate: 0.14, szen: "normal" },
  { id: "CARGO-02", name: "Wide Cargo", kat: "Cargo-Hosen", her: "Zurich Denim", wbz: [25, 40, 60], tr: 3, moq: 40, ek: 30, vk: 125, groessen: APPAREL, farben: ["Schwarz", "Sand"], rate: 0, szen: "ladenhueter" },
  { id: "JACK-01", name: "Puffer Jacket", kat: "Jacken", her: "Alpen Outerwear", wbz: [30, 45, 70], tr: 3, moq: 30, ek: 55, vk: 219, groessen: APPAREL, farben: ["Schwarz", "Navy"], rate: 0.30, szen: "saison", saison: { von: "09-01", bis: "02-28" } },
  { id: "JACK-02", name: "Coach Jacket", kat: "Jacken", her: "Alpen Outerwear", wbz: [30, 45, 70], tr: 3, moq: 30, ek: 38, vk: 149, groessen: APPAREL, farben: ["Schwarz", "Oliv"], rate: 0.11, szen: "normal" },
  { id: "SNKR-01", name: "Court Sneaker", kat: "Sneaker", her: "Ticino Footwear", wbz: [30, 45, 60], tr: 3, moq: 60, ek: 42, vk: 149, groessen: SNKR, farben: ["Weiss", "Schwarz"], rate: 0.28, szen: "alarm" },
  { id: "SHORT-01", name: "Sweat Short", kat: "Shorts", her: "Porto Tees", wbz: [14, 21, 30], tr: 2, moq: 80, ek: 12, vk: 49, groessen: APPAREL, farben: ["Schwarz", "Grau"], rate: 0.18, szen: "saison", saison: { von: "04-01", bis: "08-31" } },
  { id: "CREW-01", name: "Crewneck", kat: "Sweater", her: "Lisboa Knit", wbz: [18, 28, 42], tr: 2, moq: 50, ek: 20, vk: 85, groessen: APPAREL, farben: ["Grau", "Creme"], rate: 0.12, szen: "normal" },
  { id: "PANT-01", name: "Track Pant", kat: "Hosen", her: "Zurich Denim", wbz: [25, 40, 60], tr: 3, moq: 40, ek: 24, vk: 99, groessen: APPAREL, farben: ["Schwarz", "Navy"], rate: 0.10, szen: "normal" },
  { id: "TEE-04", name: "Longsleeve", kat: "T-Shirts", her: "Porto Tees", wbz: [14, 21, 30], tr: 2, moq: 100, ek: 11, vk: 45, groessen: APPAREL, farben: ["Weiss", "Schwarz"], rate: 0.09, szen: "normal" },
  { id: "CAP-02", name: "Trucker Cap", kat: "Caps", her: "Basel Headwear", wbz: [20, 30, 45], tr: 2, moq: 48, ek: 6, vk: 32, groessen: ["One"], farben: ["Schwarz", "Rot"], rate: 0.14, szen: "normal" },
];

function baueVarianten(m) {
  const out = [];
  for (const g of m.groessen) {
    for (const f of m.farben) {
      out.push({ sku: m.id + "-" + g + "-" + (FARBCODE[f] || f.slice(0, 3).toUpperCase()), groesse: g, farbe: f });
    }
  }
  return out;
}

function tagesMenge(rate, r) {
  if (rate <= 0) return 0;
  const basis = rate * (0.3 + 1.4 * r());
  let m = Math.floor(basis);
  if (r() < basis - m) m++;
  return m;
}

// ---------- Generierung ----------

function generiere(heuteIso) {
  const ordHeute = ordinal(heuteIso);
  const modelle = [];
  const verkaeufe = [];
  const wareneingaenge = [];
  const positionen = [];
  const last30 = new Map();
  const total365 = new Map();

  for (const m of KATALOG) {
    const varianten = baueVarianten(m);
    modelle.push({
      modell_id: m.id, name: m.name, kategorie: m.kat, hersteller: m.her,
      lieferzeit_min_tage: m.wbz[0], lieferzeit_typisch_tage: m.wbz[1], lieferzeit_max_tage: m.wbz[2],
      transferzeit_tage: m.tr, moq: m.moq, ek: m.ek, vk: m.vk,
      nos: m.szen !== "saison", saison_fenster: m.saison || null, varianten,
    });

    for (const v of varianten) {
      const gw = SIZE_W[v.groesse] || 1;
      let sum30 = 0, sum365 = 0;
      for (let d = 0; d < 365; d++) {
        const ord = ordHeute - d;
        const datum = ausOrdinal(ord);
        // Ladenhueter: seit >200 Tagen kein Verkauf mehr.
        if (m.szen === "ladenhueter" && d < 220) continue;
        // Saison: nur in der Saison des jeweiligen Tages verkaufen.
        if (m.saison && !imSaisonFenster(datum, m.saison)) continue;
        const r = rngFor(v.sku, ord);
        const menge = tagesMenge(m.rate * gw, r);
        if (menge <= 0) continue;
        const online = r() < 0.55;
        verkaeufe.push({
          sku: v.sku, datum, menge,
          kanal: online ? "online" : "laden",
          standort: online ? "embrach" : "laden",
        });
        sum365 += menge;
        if (d < 30) sum30 += menge;
      }
      last30.set(v.sku, sum30);
      total365.set(v.sku, sum365);

      // Wareneingang: ein Batch, damit Sell-Through ~80% ergibt (erhalten = verkauft*1.25).
      const erhalten = m.szen === "ladenhueter" ? 20 : Math.max(4, Math.round(sum365 * 1.25));
      wareneingaenge.push({ sku: v.sku, datum: ausOrdinal(ordHeute - 200), menge: erhalten });
    }
  }

  // ---------- Bestand (aktuell) je Szenario ----------
  for (const m of modelle) {
    const tmpl = KATALOG.find((k) => k.id === m.modell_id);
    m.varianten.forEach((v, i) => {
      const ta = (last30.get(v.sku) || 0) / 30;
      let laden = 0, embrach = 0, kundenorders = 0, stockout = 0;

      if (tmpl.szen === "alarm") {
        const stock = Math.max(1, Math.round(ta * 8)); // Reichweite ~8 Tage -> ROT
        laden = Math.round(stock * 0.45); embrach = stock - laden;
        if (i === 1) { kundenorders = 2; stockout = 4; } // zeigt IP-Abzug + Stockout
      } else if (tmpl.szen === "moq") {
        const stock = Math.max(1, Math.round(ta * 12)); // knapp -> ROT, aber Bedarf < MOQ
        laden = Math.round(stock * 0.45); embrach = stock - laden;
      } else if (tmpl.szen === "umlagerung") {
        if (i === 0) { laden = 0; embrach = Math.max(8, Math.round(ta * 40)); } // Laden leer, Embrach voll
        else { const s = Math.max(2, Math.round(ta * 55)); laden = Math.round(s * 0.5); embrach = s - laden; }
      } else if (tmpl.szen === "ladenhueter") {
        laden = 3; embrach = 12; // liegt, dreht nicht -> D
      } else if (tmpl.szen === "saison") {
        const s = 18; laden = Math.round(s * 0.4); embrach = s - laden; // ruht ausserhalb Saison
      } else {
        const s = Math.max(3, Math.round(ta * 70)); // Reichweite ~10 Wochen -> GRUEN
        laden = Math.round(s * 0.4); embrach = s - laden;
      }
      positionen.push({ sku: v.sku, laden, embrach, offene_kundenorders: kundenorders, stockout_tage_t30: stockout });
    });
  }

  const offeneBestellungen = [
    { modell_id: "CARGO-01", menge: 40, erwartet_am: ausOrdinal(ordHeute + 12) },
  ];

  return {
    stammdaten: { modelle },
    verkaeufe: { eintraege: verkaeufe },
    wareneingaenge: { eintraege: wareneingaenge },
    bestand: { stand_datum: heuteIso, positionen, offene_bestellungen: offeneBestellungen },
    config: { sauber_seit: ausOrdinal(ordHeute - 40), erzeugt: heuteIso, quelle: "mock" },
    dossier: baueMockDossier(heuteIso),
  };
}

// ---------- Mock-Trend-Dossier (Mitarbeiter 1) ----------
// Quellen-NAMEN von der echten Whitelist, aber als MOCK markiert (keine Live-Abrufe).

function baueMockDossier(heuteIso) {
  return {
    modus: "MOCK",
    hinweis: "Uebungs-Dossier. Im Echtbetrieb schreibt Fabel 5 dies woechentlich live aus der Quellen-Whitelist.",
    stand: heuteIso,
    eintraege: [
      { id: "T-01", kategorie: "Hoodies", richtung: "kommt", bezug: "Schwere Oversized-Hoodies bleiben stark nachgefragt", quelle: "State of Fashion 2026 (McKinsey x BoF)", url: "https://www.mckinsey.com/industries/retail/our-insights/state-of-fashion", tier: "A", abrufdatum: heuteIso, konfidenz: "mittel" },
      { id: "T-02", kategorie: "Sneaker", richtung: "kommt", bezug: "Retro-Court-Silhouetten mit Momentum (Resale-Preise stabil)", quelle: "Lyst Index Q2 2026 / StockX", url: "https://www.lyst.com/data/the-lyst-index/", tier: "B", abrufdatum: heuteIso, konfidenz: "mittel" },
      { id: "T-03", kategorie: "Cargo-Hosen", richtung: "geht", bezug: "Weite Cargo-Silhouette flacht nach 2 starken Saisons ab", quelle: "TextilWirtschaft Data & Markets", url: "https://www.textilwirtschaft.de/", tier: "A", abrufdatum: heuteIso, konfidenz: "niedrig" },
      { id: "T-04", kategorie: "Caps", richtung: "stabil", bezug: "Basecaps als Ganzjahres-Zusatzverkauf konstant", quelle: "FashionNetwork DE", url: "https://de.fashionnetwork.com/", tier: "B", abrufdatum: heuteIso, konfidenz: "mittel" },
      { id: "T-05", kategorie: "T-Shirts", richtung: "kommt", bezug: "Boxy-Fit-Tees loesen klassische Schnitte weiter ab", quelle: "Highsnobiety (Hinweis: Zalando-Mehrheit, ggf. befangen)", url: "https://www.highsnobiety.com/", tier: "B", abrufdatum: heuteIso, konfidenz: "mittel" },
    ],
  };
}

module.exports = { generiere };
