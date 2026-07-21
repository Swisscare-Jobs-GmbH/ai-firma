// Bestell- und Umlagerungs-Logik (Mitarbeiter 2). Zwei getrennte Trigger gegen die
// Zwei-Standort-Falle (leerer Laden bei vollem Embrach). Bauplan Abschnitt 6.
// KEINE KI bucht Bestand — hier entstehen nur Vorschlaege (Bauplan G2).

const {
  tagesabsatzModell,
  tagesabsatzSku,
  absatzSku,
  meldebestand,
  sicherheitsbestand,
} = require("./kennzahlen");

const ZIEL_REICHWEITE_WOCHEN = 8; // mit Co-Founder final festzulegen (Bauplan Abschnitt 12)

// ---------- Bestands-Helfer ----------

function bestandVariante(bestandIndex, sku) {
  const p = bestandIndex.get(sku);
  if (!p) return { laden: 0, front: 0, reserve: 0, untergeschoss: 0, embrach: 0, offene_kundenorders: 0, stockout_tage_t30: 0 };
  // Laden = Front + Reserve + Untergeschoss (neues Modell) ODER direktes laden-Feld (alt/echt).
  const front = p.front || 0, reserve = p.reserve || 0, untergeschoss = p.untergeschoss || 0;
  const laden = p.front !== undefined ? front + reserve + untergeschoss : (p.laden || 0);
  return {
    laden, front, reserve, untergeschoss, embrach: p.embrach || 0,
    offene_kundenorders: p.offene_kundenorders || 0, stockout_tage_t30: p.stockout_tage_t30 || 0,
  };
}

function offeneBestellungModell(offeneBestellungen, modellId) {
  let summe = 0;
  for (const b of offeneBestellungen) if (b.modell_id === modellId) summe += b.menge;
  return summe;
}

// Verfuegbarer Bestand (Inventory Position) auf Modell-Ebene:
// Laden + Embrach + offene Hersteller-Bestellungen - bereits verkaufte, noch nicht
// versandte Kundenbestellungen. Ohne den Abzug zaehlt man Ware doppelt.
function inventoryPosition(modell, bestandIndex, offeneBestellungen) {
  let ladenEmbrach = 0;
  let kundenorders = 0;
  for (const v of modell.varianten) {
    const b = bestandVariante(bestandIndex, v.sku);
    ladenEmbrach += b.laden + b.embrach;
    kundenorders += b.offene_kundenorders || 0;
  }
  return ladenEmbrach + offeneBestellungModell(offeneBestellungen, modell.modell_id) - kundenorders;
}

function bestandGesamtModell(modell, bestandIndex) {
  let summe = 0;
  for (const v of modell.varianten) {
    const b = bestandVariante(bestandIndex, v.sku);
    summe += b.laden + b.embrach;
  }
  return summe;
}

// ---------- Size Curve: Mengen ueber Groessen/Farben verteilen ----------
// Anteil je Variante am Modell-Absatz (letzte 90 Tage). Fallback: Gleichverteilung.

function verteileNachSizeCurve(modell, verkaeufe, heute, gesamtMenge) {
  const anteile = modell.varianten.map((v) => absatzSku(verkaeufe, v.sku, heute, 90));
  const summe = anteile.reduce((s, x) => s + x, 0);
  const verteilung = {};
  let vergeben = 0;
  modell.varianten.forEach((v, i) => {
    const anteil = summe > 0 ? anteile[i] / summe : 1 / modell.varianten.length;
    const menge = Math.round(gesamtMenge * anteil);
    verteilung[v.sku] = menge;
    vergeben += menge;
  });
  // Rundungsrest der groessten Variante zuschlagen, damit die Summe stimmt.
  const rest = gesamtMenge - vergeben;
  if (rest !== 0 && modell.varianten.length > 0) {
    let groesste = modell.varianten[0].sku;
    let max = -1;
    modell.varianten.forEach((v, i) => {
      if (anteile[i] > max) { max = anteile[i]; groesste = v.sku; }
    });
    verteilung[groesste] += rest;
  }
  return verteilung;
}

// ---------- Trigger a: Hersteller-Nachbestellung (Modell-Ebene) ----------

function herstellerVorschlag(modell, verkaeufe, heute, bestandIndex, offeneBestellungen) {
  const ta = tagesabsatzModell(verkaeufe, modell, heute);
  const wbz = modell.lieferzeit_typisch_tage; // komplette Kette, von Finelli gepflegt
  const rop = meldebestand(ta.wert, wbz);
  const ip = inventoryPosition(modell, bestandIndex, offeneBestellungen);
  if (ip > rop) return null; // kein Trigger

  const wochenabsatz = ta.wert * 7;
  const zielMenge = Math.max(0, Math.round(ZIEL_REICHWEITE_WOCHEN * wochenabsatz - ip));
  const moq = modell.moq || 0;
  const bestellMenge = Math.max(moq, zielMenge);
  const moqUeberZiel = moq > zielMenge * 1.5 && moq > zielMenge; // Entscheidungsfall, kein Automatismus

  return {
    modell_id: modell.modell_id,
    tagesabsatz: Math.round(ta.wert * 100) / 100,
    fenster_tage: ta.fenster,
    wiederbeschaffung_tage: wbz,
    sicherheitsbestand: sicherheitsbestand(ta.wert),
    meldebestand: rop,
    inventory_position: ip,
    ziel_reichweite_wochen: ZIEL_REICHWEITE_WOCHEN,
    ziel_menge: zielMenge,
    moq: moq,
    bestell_menge: bestellMenge,
    moq_ueber_ziel: moqUeberZiel,
    groessen: verteileNachSizeCurve(modell, verkaeufe, heute, bestellMenge),
    rechenweg:
      "Ziel " + ZIEL_REICHWEITE_WOCHEN + " Wo x " + (Math.round(wochenabsatz * 10) / 10) +
      "/Wo = " + Math.round(ZIEL_REICHWEITE_WOCHEN * wochenabsatz) + " - " + ip +
      " verfuegbar = " + zielMenge + (bestellMenge !== zielMenge ? "; auf MOQ " + moq + " angehoben" : ""),
  };
}

// ---------- Trigger b: Umlagerung Embrach -> Laden (Varianten-Ebene) ----------

function umlagerungsVorschlaege(modell, verkaeufe, heute, bestandIndex) {
  const transfer = modell.transferzeit_tage || 2;
  const vorschlaege = [];
  for (const v of modell.varianten) {
    const b = bestandVariante(bestandIndex, v.sku);
    if (b.embrach <= 0) continue; // nichts zum Umlagern
    const ta = tagesabsatzSku(verkaeufe, v.sku, heute);
    if (ta <= 0) continue;
    // Transfer-Meldebestand: Absatz waehrend Transferzeit + kleiner Puffer (3 Tage).
    const transferRop = Math.ceil(ta * (transfer + 3));
    if (b.laden < transferRop) {
      const wunsch = Math.ceil(ta * 14); // Laden auf ~2 Wochen auffuellen
      const menge = Math.min(wunsch, b.embrach);
      if (menge > 0) {
        vorschlaege.push({
          sku: v.sku,
          laden_bestand: b.laden,
          embrach_bestand: b.embrach,
          transfer_meldebestand: transferRop,
          menge: menge,
        });
      }
    }
  }
  return vorschlaege;
}

module.exports = {
  ZIEL_REICHWEITE_WOCHEN,
  bestandVariante,
  inventoryPosition,
  bestandGesamtModell,
  herstellerVorschlag,
  umlagerungsVorschlaege,
  verteileNachSizeCurve,
};
