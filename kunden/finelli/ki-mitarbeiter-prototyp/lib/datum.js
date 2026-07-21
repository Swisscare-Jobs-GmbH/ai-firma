// Datum-Helfer. Alles am KALENDERTAG verankert (Ordinalzahl = Tage seit Epoch),
// nie am Tages-Abstand — so ist der Mock nach jedem Neustart identisch und der
// Mitternachts-Uebergang sauber (Firmen-Regel, Bauplan G8).

function ordinal(datumIso) {
  // datumIso = "JJJJ-MM-TT". Millisekunden seit Epoch / Millisekunden pro Tag.
  const ms = Date.parse(datumIso + "T00:00:00Z");
  if (Number.isNaN(ms)) throw new Error("Ungueltiges Datum: " + datumIso);
  return Math.floor(ms / 86400000);
}

function heuteIso() {
  // Der echte heutige Kalendertag (lokal). Der Server laeuft taeglich real —
  // hier ist new Date() korrekt und gewollt (kein Workflow-Script).
  const d = new Date();
  const jjjj = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const tt = String(d.getDate()).padStart(2, "0");
  return jjjj + "-" + mm + "-" + tt;
}

function ausOrdinal(ord) {
  const d = new Date(ord * 86400000);
  const jjjj = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const tt = String(d.getUTCDate()).padStart(2, "0");
  return jjjj + "-" + mm + "-" + tt;
}

// Liegt datumIso im Fenster der letzten `tage` Tage vor/bis heuteIso (heute eingeschlossen)?
function imFenster(datumIso, heuteIso, tage) {
  const abstand = ordinal(heuteIso) - ordinal(datumIso);
  return abstand >= 0 && abstand < tage;
}

// Monatstag im "MM-TT"-Format liegt innerhalb eines Saison-Fensters {von, bis} (auch ueber
// den Jahreswechsel, z.B. Winter von 09-01 bis 02-28).
function imSaisonFenster(heuteIso, fenster) {
  if (!fenster || !fenster.von || !fenster.bis) return true; // NOS: immer "in Saison"
  const tag = heuteIso.slice(5); // "MM-TT"
  const { von, bis } = fenster;
  if (von <= bis) return tag >= von && tag <= bis;
  return tag >= von || tag <= bis; // ueber Jahreswechsel
}

module.exports = { ordinal, heuteIso, ausOrdinal, imFenster, imSaisonFenster };
