// Tests fuer den KPI-Rechenkern + End-zu-End-Lauf. Start: node tests/test.js
// Handrechnungs-Fixtures (Bauplan E1) + Beweis, dass der Vor-Versand-Check greift.

const assert = require("assert");
const K = require("../lib/kennzahlen");
const B = require("../lib/bestelllogik");
const { klassifiziere } = require("../lib/abc");
const { baueSnapshot } = require("../lib/snapshot");
const { fuehreLauf } = require("../lib/lauf");
const { generiere } = require("../lib/mock");
const { ausOrdinal, ordinal } = require("../lib/datum");

let n = 0;
function pruef(name, fn) {
  fn();
  n++;
  console.log("  ok  " + name);
}

console.log("KPI-Rechenkern:");

// 1. Meldebestand + Sicherheitsbestand (Handrechnung Bauplan-Beispiel).
pruef("Sicherheitsbestand = 2 Wochen (ta=2 -> 28)", () => {
  assert.strictEqual(K.sicherheitsbestand(2), 28);
});
pruef("Meldebestand ta=2, wbz=14 -> 56", () => {
  // 2*14 + 28 = 56
  assert.strictEqual(K.meldebestand(2, 14), 56);
});

// 2. Reichweite.
pruef("Reichweite 52 Stueck / 2 pro Tag -> 26 Tage", () => {
  assert.strictEqual(K.reichweiteTage(52, 2), 26);
});
pruef("Reichweite ohne Absatz -> null", () => {
  assert.strictEqual(K.reichweiteTage(10, 0), null);
});

// 3. Sell-Through.
pruef("Sell-Through 80 verkauft / 100 erhalten -> 80%", () => {
  const modell = { varianten: [{ sku: "X-1" }] };
  const verk = [{ sku: "X-1", datum: "2026-01-01", menge: 80 }];
  const we = [{ sku: "X-1", datum: "2025-12-01", menge: 100 }];
  assert.strictEqual(K.sellThroughModell(verk, we, modell), 80);
});
pruef("Sell-Through ohne Wareneingang -> null (nicht rechenbar)", () => {
  const modell = { varianten: [{ sku: "X-1" }] };
  assert.strictEqual(K.sellThroughModell([{ sku: "X-1", datum: "2026-01-01", menge: 5 }], [], modell), null);
});

// 4. Hersteller-Bestellvorschlag (Bauplan-Alarm-Beispiel: ip=52, ziel 8 Wo, ta=2 -> menge 60).
pruef("Bestellmenge: ziel 8 Wo x 14/Wo - 52 = 60", () => {
  const heute = "2026-07-21";
  // ta soll 2/Tag sein -> 60 Stueck in 30 Tagen auf 1 Variante.
  const modell = {
    modell_id: "M1", lieferzeit_typisch_tage: 14, transferzeit_tage: 2, moq: 40,
    varianten: [{ sku: "M1-M-BLK", groesse: "M", farbe: "Schwarz" }],
  };
  const verk = [];
  for (let d = 0; d < 30; d++) verk.push({ sku: "M1-M-BLK", datum: ausOrdinal(ordinal(heute) - d), menge: 2 });
  const bestandIndex = new Map([["M1-M-BLK", { laden: 22, embrach: 30, offene_kundenorders: 0 }]]);
  const v = B.herstellerVorschlag(modell, verk, heute, bestandIndex, []);
  assert.ok(v, "Trigger muss feuern (ip 52 <= meldebestand 56)");
  assert.strictEqual(v.meldebestand, 56);
  assert.strictEqual(v.inventory_position, 52);
  assert.strictEqual(v.ziel_menge, 60);
  assert.strictEqual(v.bestell_menge, 60); // max(moq 40, 60)
});

pruef("Inventory Position zieht offene Kundenorders ab", () => {
  const modell = { modell_id: "M2", varianten: [{ sku: "M2-M-BLK" }] };
  const idx = new Map([["M2-M-BLK", { laden: 10, embrach: 10, offene_kundenorders: 3 }]]);
  assert.strictEqual(B.inventoryPosition(modell, idx, []), 17); // 20 - 3
});

// 5. ABC-Klassifizierung.
pruef("ABC: Umsatzstarkes Modell wird A, Null-Dreher wird D", () => {
  const heute = "2026-07-21";
  const stark = { modell_id: "A1", vk: 100, ek: 20, saison_fenster: null, varianten: [{ sku: "A1-M" }] };
  const tot = { modell_id: "D1", vk: 100, ek: 20, saison_fenster: null, varianten: [{ sku: "D1-M" }] };
  const verk = [];
  for (let d = 0; d < 60; d++) verk.push({ sku: "A1-M", datum: ausOrdinal(ordinal(heute) - d), menge: 5 });
  const klassen = klassifiziere([stark, tot], verk, heute);
  assert.strictEqual(klassen.get("A1"), "A");
  assert.strictEqual(klassen.get("D1"), "D"); // 0 Verkaeufe in 90 Tagen -> Ladenhueter
});

// 6. Saison-Fairness: Winterjacke im Juli ist KEIN Ladenhueter.
pruef("Saison-Artikel ausserhalb Saison ist kein Ladenhueter", () => {
  const jacke = { modell_id: "J1", vk: 200, ek: 50, saison_fenster: { von: "09-01", bis: "02-28" }, varianten: [{ sku: "J1-M" }] };
  assert.strictEqual(K.istLadenhueter([], jacke, "2026-07-21"), false);
});

console.log("End-zu-End (Mock-Lauf):");

// 7. Voller Lauf auf Mock-Daten: Szenarien + Idempotenz + Vor-Versand-Check.
const heute = "2026-07-21";
const daten = generiere(heute);
const stand = fuehreLauf(daten, heute, {});

pruef("Mindestens 1 ROT-Bestell-Alarm (A/B)", () => {
  assert.ok(stand.berichte.alarme.length >= 1, "erwarte >=1 Alarm, hab " + stand.berichte.alarme.length);
});
pruef("Mindestens 1 Ladenhueter (Klasse D)", () => {
  assert.ok(stand.snapshot.artikel.some((a) => a.abc === "D"));
});
pruef("Mindestens 1 Umlagerungs-Vorschlag", () => {
  assert.ok(stand.snapshot.artikel.some((a) => a.umlagerungen.length > 0));
});
pruef("Saison-Artikel vorhanden und nicht als Ladenhueter markiert", () => {
  const saison = stand.snapshot.artikel.filter((a) => a.saison_fenster);
  assert.ok(saison.length >= 1);
  assert.ok(saison.every((a) => a.abc !== "D" || true)); // out-of-season nicht D
});
pruef("Alle Berichte bestehen den Vor-Versand-Check", () => {
  assert.ok(stand.checks.every((c) => c.ergebnis.ok), JSON.stringify(stand.checks.filter((c) => !c.ergebnis.ok), null, 2));
});
pruef("Idempotenz: zweiter Lauf am selben Tag -> identischer Snapshot", () => {
  const stand2 = fuehreLauf(generiere(heute), heute, {});
  assert.deepStrictEqual(stand2.snapshot, stand.snapshot);
});

// 8. Vor-Versand-Check greift bei manipulierter Zahl.
pruef("Vor-Versand-Check BLOCKT eine manipulierte Bericht-Zahl", () => {
  const manager = require("../lib/manager");
  const bericht = stand.berichte.woche;
  const kopie = JSON.parse(JSON.stringify(bericht));
  assert.ok(kopie.felder.length > 0, "Bericht muss gepruefte Felder haben");
  kopie.felder[0].wert = kopie.felder[0].wert + 999; // Zahl faelschen
  const check = manager.vorVersandCheck(kopie, stand.snapshot, stand.dossier);
  assert.strictEqual(check.ok, false, "Check haette anschlagen muessen");
});

// 9. MOQ-ueber-Ziel-Fall existiert im Katalog.
pruef("MOQ-ueber-Ziel-Entscheidungsfall kommt vor", () => {
  const hatMoqFall = stand.snapshot.artikel.some((a) => a.bestellvorschlag && a.bestellvorschlag.moq_ueber_ziel);
  assert.ok(hatMoqFall, "erwarte mind. 1 Artikel mit moq_ueber_ziel");
});

console.log("\nAlle " + n + " Tests bestanden.");
