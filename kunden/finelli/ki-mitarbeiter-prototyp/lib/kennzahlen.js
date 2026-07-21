// KPI-Rechenkern (Mitarbeiter 2). REINE Funktionen, deterministisch, getestet.
// Grundsatz (Bauplan G3): Zahlen rechnet Code, nie das Sprachmodell.
// Formeln adversarial verifiziert (Bauplan Abschnitt 6, je 2+ unabhaengige Quellen).

const { imFenster, imSaisonFenster } = require("./datum");

// ---------- Indizes (einmal bauen, oft nutzen) ----------

function baueStammIndex(stammListe) {
  const proModell = new Map();
  const proSku = new Map();
  for (const m of stammListe) {
    proModell.set(m.modell_id, m);
    for (const v of m.varianten) {
      proSku.set(v.sku, { modell: m, variante: v });
    }
  }
  return { proModell, proSku };
}

// ---------- Absatz (Stueck) in einem Fenster ----------

function absatzSku(verkaeufe, sku, heute, tage) {
  let summe = 0;
  for (const vk of verkaeufe) {
    if (vk.sku === sku && imFenster(vk.datum, heute, tage)) summe += vk.menge;
  }
  return summe;
}

function absatzModell(verkaeufe, modell, heute, tage) {
  const skus = new Set(modell.varianten.map((v) => v.sku));
  let summe = 0;
  for (const vk of verkaeufe) {
    if (skus.has(vk.sku) && imFenster(vk.datum, heute, tage)) summe += vk.menge;
  }
  return summe;
}

// Durchschnittlicher Tagesabsatz. Referenzfenster 30 Tage; Fallback 90 Tage,
// wenn im 30-Tage-Fenster weniger als 5 Verkaeufe (Rauschen bei kleinen Zahlen glaetten).
function tagesabsatzModell(verkaeufe, modell, heute) {
  const a30 = absatzModell(verkaeufe, modell, heute, 30);
  if (a30 >= 5) return { wert: a30 / 30, fenster: 30 };
  const a90 = absatzModell(verkaeufe, modell, heute, 90);
  return { wert: a90 / 90, fenster: 90 };
}

function tagesabsatzSku(verkaeufe, sku, heute) {
  const a30 = absatzSku(verkaeufe, sku, heute, 30);
  if (a30 >= 5) return a30 / 30;
  return absatzSku(verkaeufe, sku, heute, 90) / 90;
}

// ---------- Abverkaufsquote (Sell-Through) ----------
// STR = verkaufte Stueck / erhaltene Stueck * 100, kumuliert seit erstem Wareneingang.
// Nie im 7/30-Tage-Fenster (Nenner meist 0). null, wenn keine Eingaenge bekannt.

function sellThroughModell(verkaeufe, wareneingaenge, modell) {
  const skus = new Set(modell.varianten.map((v) => v.sku));
  let erhalten = 0;
  for (const we of wareneingaenge) if (skus.has(we.sku)) erhalten += we.menge;
  if (erhalten === 0) return null; // nicht rechenbar -> ehrlich weglassen
  let verkauft = 0;
  for (const vk of verkaeufe) if (skus.has(vk.sku)) verkauft += vk.menge;
  return Math.round((verkauft / erhalten) * 1000) / 10; // 1 Nachkommastelle
}

// ---------- Reichweite (Tage) ----------

function reichweiteTage(bestandGesamt, tagesabsatz) {
  if (tagesabsatz <= 0) return null; // dreht nicht -> keine sinnvolle Reichweite
  return Math.round((bestandGesamt / tagesabsatz) * 10) / 10;
}

// ---------- Sicherheitsbestand + Meldebestand (Reorder Point) ----------
// Start verbindlich: Sicherheitsbestand = 2 Wochen Reichweite (pauschal, offen ausgewiesen).
// Z-Formel erst bei sauberer Datenlage (Bauplan Abschnitt 6).

function sicherheitsbestand(tagesabsatz) {
  return Math.ceil(tagesabsatz * 14);
}

// ROP = Tagesabsatz * Wiederbeschaffungszeit + Sicherheitsbestand.
function meldebestand(tagesabsatz, wbzTage) {
  return Math.ceil(tagesabsatz * wbzTage + sicherheitsbestand(tagesabsatz));
}

// ---------- Lagerumschlag + GMROI (rollierend, annualisiert) ----------
// Naeherung fuers Prototyp: COGS_90 aus 90-Tage-Absatz * EK, Ø-Bestand = aktueller
// Bestandswert (nur Momentaufnahme vorhanden). Annualisiert *365/90. Als Naeherung
// gekennzeichnet, bis genug Snapshot-Tage vorliegen.

function umschlagAnnualisiert(absatz90, ek, bestandStueckGesamt) {
  const cogs90 = absatz90 * ek;
  const oBestandWert = bestandStueckGesamt * ek;
  if (oBestandWert <= 0) return null;
  return Math.round((cogs90 / oBestandWert) * (365 / 90) * 10) / 10;
}

function gmroiAnnualisiert(absatz90, ek, vk, bestandStueckGesamt) {
  const rohertrag90 = absatz90 * (vk - ek);
  const oBestandWertEk = bestandStueckGesamt * ek;
  if (oBestandWertEk <= 0) return null;
  return Math.round((rohertrag90 * (365 / 90)) / oBestandWertEk * 100) / 100;
}

// ---------- Ladenhueter-Erkennung (Klasse D) ----------
// D = 0 Verkaeufe in 90 Tagen INNERHALB der relevanten Saison (Saison-Fairness:
// Winterjacke im Juli ist kein Ladenhueter).

function istLadenhueter(verkaeufe, modell, heute) {
  if (modell.saison_fenster && !imSaisonFenster(heute, modell.saison_fenster)) {
    return false; // ausserhalb Saison -> nicht bewerten
  }
  return absatzModell(verkaeufe, modell, heute, 90) === 0;
}

module.exports = {
  baueStammIndex,
  absatzSku,
  absatzModell,
  tagesabsatzModell,
  tagesabsatzSku,
  sellThroughModell,
  reichweiteTage,
  sicherheitsbestand,
  meldebestand,
  umschlagAnnualisiert,
  gmroiAnnualisiert,
  istLadenhueter,
};
