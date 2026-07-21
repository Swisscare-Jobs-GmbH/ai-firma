// ABC-Kategorisierung (Mitarbeiter 2). Auf MODELL-Ebene (bei ~60 Modellen; die
// Varianten-Ebene zersplittert bei kleinen Zahlen). Nach Pareto ueber Rohertrag:
// A = bis 80% des kumulierten Rohertrags, B = 80-95%, C = Rest (Startpunkt, kein Gesetz).
// Klasse D (Ladenhueter) ueberschreibt und wird separat gesetzt (kennzahlen.istLadenhueter).

const { absatzModell, istLadenhueter } = require("./kennzahlen");

function rohertrag365(verkaeufe, modell, heute) {
  const menge = absatzModell(verkaeufe, modell, heute, 365);
  return menge * (modell.vk - modell.ek);
}

// Liefert Map modell_id -> "A"|"B"|"C"|"D".
function klassifiziere(stammListe, verkaeufe, heute) {
  const mitWert = stammListe.map((m) => ({
    modell: m,
    rohertrag: rohertrag365(verkaeufe, m, heute),
  }));
  const gesamt = mitWert.reduce((s, x) => s + x.rohertrag, 0);
  mitWert.sort((a, b) => b.rohertrag - a.rohertrag);

  const klasse = new Map();
  let kumuliert = 0;
  for (const x of mitWert) {
    // Ladenhueter zuerst: 0 Verkaeufe in Saison -> D, egal welcher Rohertrag-Rang.
    if (istLadenhueter(verkaeufe, x.modell, heute)) {
      klasse.set(x.modell.modell_id, "D");
      continue;
    }
    if (gesamt <= 0) {
      klasse.set(x.modell.modell_id, "C");
      continue;
    }
    // Klasse nach dem Anteil, der von hoeher-rangigen Artikeln bereits abgedeckt ist
    // (Standard-ABC-Variante) — so ist der staerkste Artikel immer A, nie C.
    const vorAnteil = kumuliert / gesamt;
    if (vorAnteil < 0.8) klasse.set(x.modell.modell_id, "A");
    else if (vorAnteil < 0.95) klasse.set(x.modell.modell_id, "B");
    else klasse.set(x.modell.modell_id, "C");
    kumuliert += x.rohertrag;
  }
  return klasse;
}

module.exports = { klassifiziere, rohertrag365 };
