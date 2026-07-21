// KPI-Snapshot bauen (Mitarbeiter 2). Verbindet Rechenkern + Bestell-Logik + ABC
// zu EINEM strukturierten Objekt nach dem Mindest-Schema (Bauplan Abschnitt 6).
// Alle Zahlen kommen aus dem Code — die Berichte (Mitarbeiter 3) lesen NUR hieraus.

const K = require("./kennzahlen");
const B = require("./bestelllogik");
const { klassifiziere } = require("./abc");
const A = require("./ampel");
const { ordinal, imFenster } = require("./datum");

// Umsatz (CHF) je Kanal in einem Fenster.
function umsatzFenster(verkaeufe, stammIndex, heute, tage, kanal) {
  let summe = 0;
  for (const vk of verkaeufe) {
    if (kanal && vk.kanal !== kanal) continue;
    if (!imFenster(vk.datum, heute, tage)) continue;
    const ref = stammIndex.proSku.get(vk.sku);
    if (ref) summe += vk.menge * ref.modell.vk;
  }
  return summe;
}

// Umsatz im Fenster [vonTage, bisTage) vor heute (fuer Vorwochen-Vergleich).
function umsatzVorperiode(verkaeufe, stammIndex, heute, vonTage, bisTage) {
  const ordHeute = ordinal(heute);
  let summe = 0;
  for (const vk of verkaeufe) {
    const abstand = ordHeute - ordinal(vk.datum);
    if (abstand >= vonTage && abstand < bisTage) {
      const ref = stammIndex.proSku.get(vk.sku);
      if (ref) summe += vk.menge * ref.modell.vk;
    }
  }
  return summe;
}

function runde(n, stellen) {
  const f = Math.pow(10, stellen);
  return Math.round(n * f) / f;
}

function baueSnapshot(daten, heute, optionen) {
  const opt = optionen || {};
  const stammListe = daten.stammdaten.modelle;
  const verkaeufe = daten.verkaeufe.eintraege;
  const wareneingaenge = daten.wareneingaenge.eintraege;
  const bestandIndex = new Map(daten.bestand.positionen.map((p) => [p.sku, p]));
  const offeneBestellungen = daten.bestand.offene_bestellungen || [];
  const stammIndex = K.baueStammIndex(stammListe);
  const sauberSeit = daten.config && daten.config.sauber_seit ? daten.config.sauber_seit : null;

  const klassen = klassifiziere(stammListe, verkaeufe, heute);

  // ---------- Artikel ----------
  const artikel = [];
  let ladenhueterZahl = 0;
  let abGelbAB = 0;
  let stockoutTageT30 = 0;
  let stockoutStueckT30 = 0;
  let stockoutChfT30 = 0;

  for (const m of stammListe) {
    const abc = klassen.get(m.modell_id);
    if (abc === "D") ladenhueterZahl++;

    const a7 = K.absatzModell(verkaeufe, m, heute, 7);
    const a30 = K.absatzModell(verkaeufe, m, heute, 30);
    const a90 = K.absatzModell(verkaeufe, m, heute, 90);
    const a365 = K.absatzModell(verkaeufe, m, heute, 365);
    const ta = K.tagesabsatzModell(verkaeufe, m, heute);
    const wbz = m.lieferzeit_typisch_tage;
    const rop = K.meldebestand(ta.wert, wbz);
    const ip = B.inventoryPosition(m, bestandIndex, offeneBestellungen);
    const bestandGesamt = B.bestandGesamtModell(m, bestandIndex);
    const reichweite = K.reichweiteTage(bestandGesamt, ta.wert);

    const herVorschlag = B.herstellerVorschlag(m, verkaeufe, heute, bestandIndex, offeneBestellungen);
    const umlagerungen = B.umlagerungsVorschlaege(m, verkaeufe, heute, bestandIndex);

    const ampel = A.artikelAmpel(reichweite, wbz, ip, rop);
    if ((abc === "A" || abc === "B") && (ampel === "gelb" || ampel === "rot")) abGelbAB++;

    // Varianten inkl. Stockout-Tage (aus Bestandsdaten).
    let modellStockoutTage = 0;
    const varianten = m.varianten.map((v) => {
      const b = B.bestandVariante(bestandIndex, v.sku);
      const so = b.stockout_tage_t30 || 0;
      modellStockoutTage += so;
      return {
        sku: v.sku,
        groesse: v.groesse,
        farbe: v.farbe,
        bestand_laden: b.laden,
        bestand_embrach: b.embrach,
        offene_kundenorders: b.offene_kundenorders || 0,
        stockout_tage_t30: so,
        transfer_trigger: umlagerungen.some((u) => u.sku === v.sku),
      };
    });
    stockoutTageT30 += modellStockoutTage;
    const soStueck = Math.round(modellStockoutTage * ta.wert);
    stockoutStueckT30 += soStueck;
    stockoutChfT30 += soStueck * m.vk;

    // Datenqualitaet: saubere Tage seit sauber_seit; Schaetzanteil = Laden-Anteil * 20%
    // (die 20%-Fehlbuchungs-ANNAHME, ehrlich als Schaetzung; Bauplan Abschnitt 8).
    const saubereTage = sauberSeit ? Math.max(0, ordinal(heute) - ordinal(sauberSeit)) : 0;
    const ladenAbsatz = (function () {
      let s = 0;
      const skus = new Set(m.varianten.map((v) => v.sku));
      for (const vk of verkaeufe) if (skus.has(vk.sku) && vk.kanal === "laden" && imFenster(vk.datum, heute, 365)) s += vk.menge;
      return s;
    })();
    const schaetzanteil = a365 > 0 ? Math.round((ladenAbsatz / a365) * 20) : 0;

    const trigger = herVorschlag ? "hersteller_nachbestellung" : (umlagerungen.length > 0 ? "umlagerung" : null);

    artikel.push({
      modell_id: m.modell_id,
      name: m.name,
      kategorie: m.kategorie,
      hersteller: m.hersteller,
      ek: m.ek,
      vk: m.vk,
      abc: abc,
      nos: m.nos,
      saison_fenster: m.saison_fenster || null,
      absatz: { t7: a7, t30: a30, t90: a90, t365: a365 },
      rohertrag_t30: a30 * (m.vk - m.ek),
      sell_through: K.sellThroughModell(verkaeufe, wareneingaenge, m),
      reichweite_tage: reichweite,
      meldebestand: rop,
      inventory_position: ip,
      bestand_gesamt: bestandGesamt,
      umschlag: K.umschlagAnnualisiert(a90, m.ek, bestandGesamt),
      gmroi: K.gmroiAnnualisiert(a90, m.ek, m.vk, bestandGesamt),
      trigger: trigger,
      bestellvorschlag: herVorschlag,
      umlagerungen: umlagerungen,
      ampel: ampel,
      datenqualitaet: {
        ampel: A.datenqualitaetAmpel(saubereTage, schaetzanteil),
        saubere_tage: saubereTage,
        schaetzanteil_pct: schaetzanteil,
        letzte_zaehlung: sauberSeit,
      },
      einschaetzung: null, // fuellt der Interpretations-Schritt (Fabel 5), s. lauf.js
      varianten: varianten,
    });
  }

  // ---------- Aggregate ----------
  const anzahlModelle = stammListe.length || 1;
  const ladenhueterAnteil = runde((ladenhueterZahl / anzahlModelle) * 100, 1);

  const umsatzT7 = umsatzFenster(verkaeufe, stammIndex, heute, 7, null);
  const umsatzT7Online = umsatzFenster(verkaeufe, stammIndex, heute, 7, "online");
  const umsatzT7Laden = umsatzFenster(verkaeufe, stammIndex, heute, 7, "laden");
  const umsatzVorwoche = umsatzVorperiode(verkaeufe, stammIndex, heute, 7, 14);
  const vsVorwoche = umsatzVorwoche > 0 ? runde(((umsatzT7 - umsatzVorwoche) / umsatzVorwoche) * 100, 1) : 0;

  let lagerwertLaden = 0;
  let lagerwertEmbrach = 0;
  for (const m of stammListe) {
    for (const v of m.varianten) {
      const b = B.bestandVariante(bestandIndex, v.sku);
      lagerwertLaden += b.laden * m.ek;
      lagerwertEmbrach += b.embrach * m.ek;
    }
  }

  const aggregate = {
    umsatz: {
      t7_gesamt: Math.round(umsatzT7),
      t7_online: Math.round(umsatzT7Online),
      t7_laden: Math.round(umsatzT7Laden),
      t30_gesamt: Math.round(umsatzFenster(verkaeufe, stammIndex, heute, 30, null)),
      vs_vorwoche_pct: vsVorwoche,
    },
    lagerwert_ek: { laden: Math.round(lagerwertLaden), embrach: Math.round(lagerwertEmbrach) },
    ladenhueter_anteil_pct: ladenhueterAnteil,
    stockout: {
      t30_tage: stockoutTageT30,
      t30_entgangene_stueck_geschaetzt: stockoutStueckT30,
      t30_chf_geschaetzt: Math.round(stockoutChfT30),
    },
  };

  const ampeln = {
    umsatz: A.umsatzAmpel(vsVorwoche),
    lager_gesundheit: A.lagerGesundheitAmpel(ladenhueterAnteil),
    ausverkauf: A.ausverkaufAmpel(abGelbAB),
  };

  return {
    lauf: {
      datum: heute,
      modus: opt.modus || "MOCK",
      status: opt.status || "ok",
      dritt_ausfall: opt.dritt_ausfall || null,
    },
    aggregate: aggregate,
    ampeln: ampeln,
    offene_bestellungen: offeneBestellungen,
    artikel: artikel,
  };
}

module.exports = { baueSnapshot };
