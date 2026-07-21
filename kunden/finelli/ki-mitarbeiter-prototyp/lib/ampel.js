// Ampel-Logik (fuer die Berichte, Mitarbeiter 3). Schwellen sind dokumentierte
// Startwerte aus Bauplan Abschnitt 7 — mit dem Co-Founder zu kalibrieren.
// Regel: Ampel NIE ohne dokumentierte Schwelle.

// Artikel-Bestand / Trigger-Ampel.
function artikelAmpel(reichweiteTage, wbzTage, inventoryPosition, meldebestand) {
  if (inventoryPosition <= meldebestand) return "rot";
  if (reichweiteTage !== null && reichweiteTage < 1.5 * wbzTage) return "gelb";
  return "gruen";
}

// Umsatz vs. Vorwoche (Prozent).
function umsatzAmpel(vsVorwochePct) {
  if (vsVorwochePct < -20) return "rot";
  if (vsVorwochePct < -5) return "gelb";
  return "gruen";
}

// Lager-Gesundheit ueber Ladenhueter-Anteil (Prozent).
function lagerGesundheitAmpel(ladenhueterAnteilPct) {
  if (ladenhueterAnteilPct > 20) return "rot";
  if (ladenhueterAnteilPct >= 10) return "gelb";
  return "gruen";
}

// Ausverkaufs-Risiken: Anzahl A/B-Artikel auf Gelb oder Rot.
function ausverkaufAmpel(anzahlAbGelb) {
  if (anzahlAbGelb >= 3) return "rot";
  if (anzahlAbGelb >= 1) return "gelb";
  return "gruen";
}

// Datenqualitaet: genug saubere Tage UND wenig Schaetzanteil?
function datenqualitaetAmpel(saubereTage, schaetzanteilPct) {
  if (saubereTage < 30 || schaetzanteilPct > 30) return "rot";
  if (saubereTage >= 60 && schaetzanteilPct < 10) return "gruen";
  return "gelb";
}

// Trendpfeil aus Vergleich zweier Werte.
function pfeil(aktuell, vorher) {
  if (vorher === null || vorher === undefined) return "=";
  if (aktuell > vorher) return "hoch";
  if (aktuell < vorher) return "runter";
  return "=";
}

module.exports = {
  artikelAmpel,
  umsatzAmpel,
  lagerGesundheitAmpel,
  ausverkaufAmpel,
  datenqualitaetAmpel,
  pfeil,
};
