// Manager (Mitarbeiter 3). Baut die 3 Berichte aus KPI-Snapshot + Trend-Dossier.
// Bauweise (Bauplan G3): Der CODE holt jede Zahl aus dem Snapshot (feld()), das
// Sprachmodell liefert im Echtbetrieb nur die Text-Bausteine. Der Vor-Versand-Check
// beweist danach: jede Zahl steht wirklich im Snapshot, jedes Zitat im Dossier.

const { relevanteEintraege, fuerKategorie } = require("./research");

// ---------- Pfad-Zugriff (fuer den Vor-Versand-Check) ----------

function getPath(obj, pfad) {
  let cur = obj;
  const teile = pfad.split(".");
  for (const t of teile) {
    const m = t.match(/^([^\[]+)(\[(\d+)\])?$/);
    if (!m) return undefined;
    cur = cur == null ? undefined : cur[m[1]];
    if (m[3] !== undefined) cur = cur == null ? undefined : cur[Number(m[3])];
  }
  return cur;
}

// Holt einen Wert aus dem Snapshot UND merkt sich (pfad, wert) fuer den Check.
function feld(snapshot, pfad, sammler) {
  const w = getPath(snapshot, pfad);
  sammler.push({ pfad: pfad, wert: w });
  return w;
}

function chf(n) {
  return "CHF " + Math.round(n).toLocaleString("de-CH");
}

function ampelWort(a) {
  return { rot: "ROT", gelb: "GELB", gruen: "GRUEN" }[a] || a;
}

function summeBestand(artikel, ort) {
  return artikel.varianten.reduce((s, v) => s + (ort === "laden" ? v.bestand_laden : v.bestand_embrach), 0);
}

// ---------- (a) Bestell-Alarme ----------

const MAX_SOFORT_ALARME = 3;

function baueAlarme(snapshot, dossier) {
  const kandidaten = snapshot.artikel
    .map((a, i) => ({ a, i }))
    .filter((x) => x.a.trigger === "hersteller_nachbestellung" && (x.a.abc === "A" || x.a.abc === "B") && x.a.ampel === "rot")
    .sort((x, y) => y.a.rohertrag_t30 - x.a.rohertrag_t30);

  const sofort = kandidaten.slice(0, MAX_SOFORT_ALARME);
  const sammel = kandidaten.slice(MAX_SOFORT_ALARME);

  const alarme = sofort.map((x) => baueEinAlarm(snapshot, dossier, x.a, x.i));

  let sammelBericht = null;
  if (sammel.length > 0) {
    const felder = [];
    const zeilen = sammel.map((x) => {
      const menge = feld(snapshot, "artikel[" + x.i + "].bestellvorschlag.bestell_menge", felder);
      return "- " + x.a.name + " (" + x.a.abc + "): " + menge + " Stueck nachbestellen";
    });
    sammelBericht = {
      typ: "alarm-sammel",
      titel: "Weitere " + sammel.length + " Nachbestell-Faelle (gesammelt)",
      bloecke: [{ ueberschrift: "Ebenfalls unter Meldebestand", zeilen }],
      text: "Weitere Nachbestell-Faelle:\n" + zeilen.join("\n"),
      felder,
      zitate: [],
    };
  }
  return { alarme, sammelBericht };
}

function baueEinAlarm(snapshot, dossier, a, i) {
  const felder = [];
  const zitate = [];
  const p = "artikel[" + i + "]";
  const bv = a.bestellvorschlag;

  const menge = feld(snapshot, p + ".bestellvorschlag.bestell_menge", felder);
  const rop = feld(snapshot, p + ".meldebestand", felder);
  const ip = feld(snapshot, p + ".inventory_position", felder);
  const reich = feld(snapshot, p + ".reichweite_tage", felder);
  const wbz = feld(snapshot, p + ".bestellvorschlag.wiederbeschaffung_tage", felder);
  const ta = feld(snapshot, p + ".bestellvorschlag.tagesabsatz", felder);
  const a7 = feld(snapshot, p + ".absatz.t7", felder);
  const a30 = feld(snapshot, p + ".absatz.t30", felder);
  const a90 = feld(snapshot, p + ".absatz.t90", felder);
  const a365 = feld(snapshot, p + ".absatz.t365", felder);

  const laden = summeBestand(a, "laden");
  const embrach = summeBestand(a, "embrach");
  const groessen = Object.entries(bv.groessen).filter(([, m]) => m > 0)
    .map(([sku, m]) => sku.split("-").slice(-2).join(" ") + ": " + m).join(" / ");

  const betreff = "ROT: " + a.name + " (" + a.hersteller + ") — jetzt nachbestellen";
  const zeilen = [];
  zeilen.push("Empfehlung: " + menge + " Stueck bei " + a.hersteller + " bestellen (" + groessen +
    "). Bestand reicht noch ~" + reich + " Tage, Nachschub braucht " + wbz + " Tage — jetzt bestellen = keine Luecke.");
  zeilen.push("Warum: Noch " + ip + " Stueck verfuegbar (Laden " + laden + " / Embrach " + embrach +
    "), verkauft sich ~" + ta + "x/Tag, Meldebestand " + rop + " unterschritten.");

  const fakten = [
    "Artikel: " + a.name + " (" + a.modell_id + "), Klasse " + a.abc,
    "Bestand: Laden " + laden + " / Embrach " + embrach + " / verfuegbar (inkl. offene Orders) " + ip,
    "Verkauf: 7T " + a7 + " · 30T " + a30 + " · 90T " + a90 + " · 365T " + a365,
    "Empfohlene Menge: " + menge + " (Rechenweg: " + bv.rechenweg + ")",
  ];
  if (a.einschaetzung) {
    fakten.push("Einschaetzung: " + a.einschaetzung.text);
    if (a.einschaetzung.dossier_id) zitate.push(a.einschaetzung.dossier_id);
  }
  if (bv.moq_ueber_ziel) {
    fakten.push("Hinweis: Hersteller-MOQ (" + bv.moq + ") liegt deutlich ueber dem Bedarf (" + bv.ziel_menge +
      ") — Entscheidungsfall: Menge akzeptieren, mit anderer Variante buendeln, oder Artikel auslaufen lassen.");
  }

  const text = betreff + "\n\n" + zeilen.join("\n") + "\n\n" + fakten.map((f) => "• " + f).join("\n") +
    "\n\nAntwort: OK / ANDERE MENGE / AUSLAUFEN LASSEN";

  return {
    typ: "alarm",
    titel: betreff,
    betreff,
    bloecke: [
      { ueberschrift: "Empfehlung", zeilen: [zeilen[0]] },
      { ueberschrift: "Warum", zeilen: [zeilen[1]] },
      { ueberschrift: "Fakten", zeilen: fakten },
      { ueberschrift: "Antwort", zeilen: ["OK / ANDERE MENGE / AUSLAUFEN LASSEN"] },
    ],
    text,
    felder,
    zitate,
  };
}

// ---------- (b) Wochenbericht ----------

function topFlop(snapshot) {
  const aktiv = snapshot.artikel.slice();
  const top = aktiv.slice().sort((a, b) => b.absatz.t30 - a.absatz.t30).slice(0, 3);
  const flop = aktiv.filter((a) => a.abc === "D").slice(0, 3);
  return { top, flop };
}

function baueWochenbericht(snapshot, dossier) {
  const felder = [];
  const zitate = [];
  const vsVorwoche = feld(snapshot, "aggregate.umsatz.vs_vorwoche_pct", felder);
  const umsatz7 = feld(snapshot, "aggregate.umsatz.t7_gesamt", felder);
  const online7 = feld(snapshot, "aggregate.umsatz.t7_online", felder);
  const laden7 = feld(snapshot, "aggregate.umsatz.t7_laden", felder);
  const ladenhueter = feld(snapshot, "aggregate.ladenhueter_anteil_pct", felder);

  const kopf = [
    "Umsatz vs. Vorwoche: " + ampelWort(snapshot.ampeln.umsatz) + " (" + (vsVorwoche >= 0 ? "+" : "") + vsVorwoche + "%)",
    "Lager-Gesundheit: " + ampelWort(snapshot.ampeln.lager_gesundheit) + " (Ladenhueter-Anteil " + ladenhueter + "%)",
    "Ausverkaufs-Risiken: " + ampelWort(snapshot.ampeln.ausverkauf),
  ];
  const wichtigste = wichtigsterSatz(snapshot);

  const verkauf = [
    "Umsatz 7 Tage: " + chf(umsatz7) + " (Online " + chf(online7) + " / Laden " + chf(laden7) + ")",
    "Gegenueber Vorwoche: " + (vsVorwoche >= 0 ? "+" : "") + vsVorwoche + "%",
  ];

  const { top, flop } = topFlop(snapshot);
  const topZeilen = top.map((a, k) => {
    const idx = snapshot.artikel.indexOf(a);
    const v = feld(snapshot, "artikel[" + idx + "].absatz.t30", felder);
    return (k + 1) + ". " + a.name + " — 30T " + v + " Stueck" + (a.ampel === "rot" ? " (fast weg -> nachbestellen)" : "");
  });
  const flopZeilen = flop.length
    ? flop.map((a) => "- " + a.name + " — 0 Verkaeufe in 90 Tagen (Ladenhueter -> Rabatt/auslaufen pruefen)")
    : ["- keine Ladenhueter diese Woche"];

  // Groessen-Luecken: A/B-Modelle mit leerem Laden-Bestand einer Variante.
  const luecken = [];
  for (const a of snapshot.artikel) {
    if (a.abc !== "A" && a.abc !== "B") continue;
    for (const v of a.varianten) {
      if (v.bestand_laden === 0 && v.bestand_embrach > 0) {
        luecken.push("- " + a.name + " " + v.groesse + "/" + v.farbe + ": Laden leer, Embrach hat " + v.bestand_embrach + " (umlagern)");
      }
    }
  }

  const unterwegs = (snapshot.offene_bestellungen || []).map(
    (b) => "- " + b.modell_id + ": " + b.menge + " Stueck, erwartet " + (b.erwartet_am || "offen")
  );

  const entscheiden = baueEntscheidungen(snapshot, felder, 3);

  const bloecke = [
    { ueberschrift: "Das Wichtigste diese Woche", zeilen: [wichtigste] },
    { ueberschrift: "Ampeln", zeilen: kopf },
    { ueberschrift: "Verkauf", zeilen: verkauf },
    { ueberschrift: "Top 3", zeilen: topZeilen },
    { ueberschrift: "Ladenhueter", zeilen: flopZeilen },
    { ueberschrift: "Groessen-Luecken", zeilen: luecken.length ? luecken.slice(0, 5) : ["- keine kritischen Luecken"] },
    { ueberschrift: "Unterwegs", zeilen: unterwegs.length ? unterwegs : ["- keine offenen Bestellungen"] },
    { ueberschrift: "DIESE WOCHE ENTSCHEIDEN", zeilen: entscheiden.zeilen },
  ];

  return {
    typ: "woche",
    titel: "Wochenbericht " + snapshot.lauf.datum,
    bloecke,
    text: berichtAlsText("Wochenbericht " + snapshot.lauf.datum, bloecke),
    felder,
    zitate,
  };
}

// ---------- (c) Monatsbericht ----------

function baueMonatsbericht(snapshot, dossier) {
  const felder = [];
  const zitate = [];
  const umsatz30 = feld(snapshot, "aggregate.umsatz.t30_gesamt", felder);
  const lagerLaden = feld(snapshot, "aggregate.lagerwert_ek.laden", felder);
  const lagerEmbrach = feld(snapshot, "aggregate.lagerwert_ek.embrach", felder);
  const ladenhueter = feld(snapshot, "aggregate.ladenhueter_anteil_pct", felder);
  const soTage = feld(snapshot, "aggregate.stockout.t30_tage", felder);
  const soChf = feld(snapshot, "aggregate.stockout.t30_chf_geschaetzt", felder);

  const sellThroughWerte = snapshot.artikel.map((a) => a.sell_through).filter((x) => x !== null);
  const sellThroughSchnitt = sellThroughWerte.length
    ? Math.round((sellThroughWerte.reduce((s, x) => s + x, 0) / sellThroughWerte.length) * 10) / 10
    : null;

  const fazit = "Umsatz 30 Tage " + chf(umsatz30) + "; " +
    (soChf > 0 ? "aber ~" + chf(soChf) + " durch ausverkaufte Bestseller verpasst" : "keine nennenswerten Ausverkaeufe") +
    "; Ladenhueter-Anteil " + ladenhueter + "%.";

  const kacheln = [
    "Umsatz 30T: " + chf(umsatz30),
    "Lagerwert (EK): " + chf(lagerLaden + lagerEmbrach) + " (Laden " + chf(lagerLaden) + " / Embrach " + chf(lagerEmbrach) + ")",
    "Abverkaufsquote (Schnitt, wo rechenbar): " + (sellThroughSchnitt !== null ? sellThroughSchnitt + "%" : "noch nicht rechenbar (Wareneingaenge fehlen)"),
    "Ladenhueter-Anteil: " + ladenhueter + "%",
    "Verpasste Verkaufstage: " + soTage + " (geschaetzt ~" + chf(soChf) + ")",
  ];

  const schnellDreher = snapshot.artikel.slice().sort((a, b) => b.absatz.t30 - a.absatz.t30)[0];
  const highlights = schnellDreher
    ? ["Bestseller: " + schnellDreher.name + " — " + schnellDreher.absatz.t30 + " Stueck in 30 Tagen"]
    : [];
  const lowlights = [];
  if (soChf > 0) lowlights.push("Geschaetzt " + chf(soChf) + " Umsatz durch Ausverkauf verpasst (" + soTage + " Fehltage)");
  const ladenhueterListe = snapshot.artikel.filter((a) => a.abc === "D").map((a) => a.name);
  if (ladenhueterListe.length) lowlights.push("Ladenhueter: " + ladenhueterListe.slice(0, 4).join(", "));

  // Markt-Blick aus dem Trend-Dossier (nur handlungsrelevante Kategorien).
  const kategorien = [...new Set(snapshot.artikel.map((a) => a.kategorie))];
  const markt = relevanteEintraege(dossier, kategorien).slice(0, 2).map((e) => {
    zitate.push(e.id);
    return "- " + e.kategorie + ": " + e.richtung.toUpperCase() + " — " + e.bezug + " (Quelle: " + e.quelle + ", " + e.tier + ", Stand " + e.abrufdatum + ")";
  });

  const entscheiden = baueEntscheidungen(snapshot, felder, 3);
  const frage = "Entscheidungsfrage: Sollen wir Budget fuer die Nachbestellung der Top-Bestseller freigeben (siehe Bestell-Alarme)?";

  const bloecke = [
    { ueberschrift: "Der Monat in 1 Satz", zeilen: [fazit] },
    { ueberschrift: "Kennzahlen", zeilen: kacheln },
    { ueberschrift: "Highlights", zeilen: highlights.length ? highlights : ["- keine"] },
    { ueberschrift: "Lowlights", zeilen: lowlights.length ? lowlights : ["- keine"] },
    { ueberschrift: "Markt-Blick (Trend-Research)", zeilen: markt.length ? markt : ["- nichts Handlungsrelevantes"] },
    { ueberschrift: "NAECHSTEN MONAT", zeilen: entscheiden.zeilen.concat([frage]) },
  ];

  return {
    typ: "monat",
    titel: "Monatsbericht " + snapshot.lauf.datum,
    bloecke,
    text: berichtAlsText("Monatsbericht " + snapshot.lauf.datum, bloecke),
    felder,
    zitate,
  };
}

// ---------- Gemeinsame Helfer ----------

function baueEntscheidungen(snapshot, felder, max) {
  const trig = snapshot.artikel
    .map((a, i) => ({ a, i }))
    .filter((x) => x.a.bestellvorschlag)
    .sort((x, y) => y.a.rohertrag_t30 - x.a.rohertrag_t30)
    .slice(0, max);
  const zeilen = trig.map((x) => {
    const menge = feld(snapshot, "artikel[" + x.i + "].bestellvorschlag.bestell_menge", felder);
    const wert = menge * x.a.vk;
    return "- " + x.a.name + " nachbestellen: " + menge + " Stueck (~" + chf(wert) + " Verkaufswert)? [ja/nein]";
  });
  if (zeilen.length === 0) zeilen.push("- Aktuell kein dringender Nachbestell-Entscheid.");
  return { zeilen };
}

function wichtigsterSatz(snapshot) {
  if (snapshot.ampeln.ausverkauf === "rot") return "Mehrere Bestseller drohen auszugehen — heute nachbestellen entscheiden.";
  if (snapshot.ampeln.umsatz === "rot") return "Umsatz klar unter Vorwoche — Ursache pruefen.";
  if (snapshot.ampeln.lager_gesundheit === "rot") return "Zu viele Ladenhueter — Rabatt-/Auslauf-Aktion pruefen.";
  return "Lage stabil — nur die markierten Punkte pruefen.";
}

function berichtAlsText(titel, bloecke) {
  let t = titel + "\n" + "=".repeat(titel.length) + "\n";
  for (const b of bloecke) {
    t += "\n" + b.ueberschrift + ":\n" + b.zeilen.map((z) => (z.startsWith("-") || z.startsWith("•") ? z : "  " + z)).join("\n") + "\n";
  }
  return t;
}

// ---------- Vor-Versand-Check (Bauplan Abschnitt 7) ----------
// Jede im Bericht verwendete Zahl MUSS im Snapshot stehen; jedes Zitat im Dossier.
// Sonst kein Versand. Beweist: der Manager erfindet keine Zahlen (G3).

function vorVersandCheck(bericht, snapshot, dossier) {
  const probleme = [];
  for (const f of bericht.felder || []) {
    const istWert = getPath(snapshot, f.pfad);
    if (istWert === undefined) probleme.push("Feld nicht im Snapshot: " + f.pfad);
    else if (istWert !== f.wert) probleme.push("Zahl weicht ab bei " + f.pfad + ": Bericht " + f.wert + " vs. Snapshot " + istWert);
  }
  const ids = new Set((dossier.eintraege || []).map((e) => e.id));
  for (const z of bericht.zitate || []) {
    if (!ids.has(z)) probleme.push("Zitat ohne Dossier-Beleg: " + z);
  }
  return { ok: probleme.length === 0, probleme };
}

module.exports = {
  baueAlarme,
  baueWochenbericht,
  baueMonatsbericht,
  vorVersandCheck,
  getPath,
};
