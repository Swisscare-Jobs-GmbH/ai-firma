// Logik-Test fuer Finadmin. Synthetische Daten, keine echten Finelli-Exporte.
const fs = require("fs");
const pfad = __dirname + "/finadmin.html";
const html = fs.readFileSync(pfad, "utf8");
const js = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// --- minimale Stubs, damit das Skript ausserhalb des Browsers laeuft ---
const speicher = {};
global.localStorage = {
  getItem: k => (k in speicher ? speicher[k] : null),
  setItem: (k, v) => { speicher[k] = String(v); }
};
const stubEl = {
  addEventListener(){}, querySelectorAll(){ return []; },
  classList:{ add(){}, remove(){} }, style:{}, innerHTML:"", textContent:"", value:"",
  getAttribute(){ return ""; }
};
global.document = {
  querySelector: () => stubEl,
  querySelectorAll: () => [],
  addEventListener(){}
};
global.window = {};
global.navigator = {};
global.requestAnimationFrame = () => {};

const api = new Function(js + `
  ;return {csvZerlegen, katalogAusCsv, normGroesse, ebeneFuer, platzFuer, musterFuer,
           PLAETZE, REGALE, ALLE_FAECHER, fachInfo, findeVariante, lerneEan,
           setKatalog: k => { KATALOG = k; }, getEans: () => EANS};`)();

let ok = 0, fehler = 0;
function pruefe(name, ist, soll){
  const gleich = JSON.stringify(ist) === JSON.stringify(soll);
  if(gleich){ ok++; console.log("  OK   " + name); }
  else { fehler++; console.log("  FEHL " + name + "  ist=" + JSON.stringify(ist) + "  soll=" + JSON.stringify(soll)); }
}

console.log("\n=== 1. Groessen normalisieren ===");
pruefe("small -> S", api.normGroesse("Small"), "S");
pruefe("XL bleibt", api.normGroesse("xl"), "XL");
pruefe("2XL -> XXL", api.normGroesse("2XL"), "XXL");
pruefe("One Size", api.normGroesse("one size"), "ONE SIZE");
pruefe("Hosengroesse 32", api.normGroesse("32"), "32");

console.log("\n=== 2. Ebene aus Groesse (4 Ebenen) ===");
pruefe("XS -> Ebene 1", api.ebeneFuer("XS", 4).nr, 1);
pruefe("S  -> Ebene 1", api.ebeneFuer("S", 4).nr, 1);
pruefe("M  -> Ebene 2", api.ebeneFuer("M", 4).nr, 2);
pruefe("L  -> Ebene 3", api.ebeneFuer("L", 4).nr, 3);
pruefe("XL -> Ebene 4", api.ebeneFuer("XL", 4).nr, 4);
pruefe("XXL-> Ebene 4", api.ebeneFuer("XXL", 4).nr, 4);
pruefe("Hose 32 -> Ebene 2", api.ebeneFuer("32", 4).nr, 2);
pruefe("Hose 36 -> Ebene 4", api.ebeneFuer("36", 4).nr, 4);
pruefe("One Size -> keine Ebene", api.ebeneFuer("ONE SIZE", 4), null);

console.log("\n=== 3. Ebene bei der 6-Ebenen-Front ===");
pruefe("XS -> 1", api.ebeneFuer("XS", 6).nr, 1);
pruefe("S  -> 2", api.ebeneFuer("S", 6).nr, 2);
pruefe("M  -> 3", api.ebeneFuer("M", 6).nr, 3);
pruefe("XXL-> 6", api.ebeneFuer("XXL", 6).nr, 6);

console.log("\n=== 4. Pilot-Plaetze ===");
pruefe("Rockstar Tee Black", api.platzFuer("Rockstar Tee Black"), "ZG1-A1");
pruefe("Ornament Tee Green", api.platzFuer("Ornament Tee Green"), "ZG1-A4");
pruefe("Star Shirt", api.platzFuer("Star Shirt"), "ZG1-A5");
pruefe("I'm a Zurich Baby Tee", api.platzFuer("I'm a Zurich Baby Tee"), "ZG1-A6");
pruefe("FINELLI Swiss Baddie Cap", api.platzFuer("FINELLI Swiss Baddie Cap"), "ZG1-F1");
pruefe("FINELLI Pant Chain", api.platzFuer("FINELLI Pant Chain"), "ZG1-F1");
pruefe("Camo Cargo Shorts", api.platzFuer("FINELLI Camo Cargo Shorts"), "RW1-1a");
pruefe("Denim Pants Brown Tint", api.platzFuer("FINELLI Denim Pants Brown Tint"), "RW1-1b");
pruefe("Denim Pants black", api.platzFuer("FINELLI Denim Pants black"), "RW1-1c");
pruefe("Baggy Sweatpants Black", api.platzFuer("Baggy Sweatpants Black"), "RW1-2a");
pruefe("Unbekannter Artikel", api.platzFuer("Irgendein Neuer Hoodie"), null);

console.log("\n=== 5. Shopify-CSV einlesen (synthetisch) ===");
const csv = [
  'Handle,Title,Body (HTML),Vendor,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Variant SKU,Variant Price,Variant Barcode,Image Src',
  'rockstar-tee-black,Rockstar Tee Black,"<p>Zeile eins',
  'Zeile zwei mit Komma, und Anfuehrung ""Zitat""</p>",FINELLI,Groesse,S,Farbe,Schwarz,RS-BLK-S,79.00,7640000000011,https://beispiel/1.jpg',
  'rockstar-tee-black,,,,Groesse,M,Farbe,Schwarz,RS-BLK-M,79.00,7640000000028,',
  'rockstar-tee-black,,,,Groesse,XL,Farbe,Schwarz,RS-BLK-XL,79.00,7640000000035,',
  'camo-cargo-shorts,FINELLI Camo Cargo Shorts,,FINELLI,Groesse,M,,,CAMO-M,75.00,7640000000042,',
  'denim-brown,FINELLI Denim Pants Brown Tint,,FINELLI,Groesse,32,,,DEN-BR-32,129.00,7640000000059,',
  'ohne-barcode,Artikel ohne Barcode,,FINELLI,Groesse,M,,,NOBC-M,49.00,,'
].join("\n");

const erg = api.katalogAusCsv(csv);
pruefe("kein Fehler", erg.fehler, null);
// 6 Datenzeilen, davon eine ueber zwei Textzeilen. Varianten OHNE Barcode werden
// bewusst mitgeladen, damit man ihnen per Scan einen Code anlernen kann.
pruefe("6 Varianten geladen", erg.varianten.length, 6);
pruefe("davon 5 mit Barcode", erg.varianten.filter(v => v.ean).length, 5);
pruefe("Titel wird vererbt", erg.varianten[1].titel, "Rockstar Tee Black");
pruefe("Groesse erkannt", erg.varianten[1].groesse, "M");
pruefe("Farbe erkannt", erg.varianten[0].farbe, "Schwarz");
pruefe("SKU gelesen", erg.varianten[2].sku, "RS-BLK-XL");
pruefe("Hosengroesse 32", erg.varianten[4].groesse, "32");
pruefe("Zeile ohne Barcode bleibt zum Anlernen", erg.varianten.filter(v => v.sku === "NOBC-M").length, 1);
pruefe("Mehrzeiliges Feld bricht CSV nicht", erg.varianten[0].ean, "7640000000011");

console.log("\n=== 6. Kompletter Ablauf: Scan -> Fach -> Ebene ===");
[["7640000000011","Rockstar Tee Black","S","ZG1-A1",1],
 ["7640000000028","Rockstar Tee Black","M","ZG1-A1",2],
 ["7640000000035","Rockstar Tee Black","XL","ZG1-A1",4],
 ["7640000000042","FINELLI Camo Cargo Shorts","M","RW1-1a",2],
 ["7640000000059","FINELLI Denim Pants Brown Tint","32","RW1-1b",2]
].forEach(f => {
  const v = erg.varianten.filter(x => x.ean === f[0])[0];
  const fach = api.platzFuer(v.titel);
  const info = api.fachInfo(fach);
  const eb = api.ebeneFuer(v.groesse, info ? info.ebenen : 4);
  pruefe("Scan " + f[0] + " -> " + f[3] + " Ebene " + f[4],
         [v.titel, v.groesse, fach, eb ? eb.nr : null], [f[1], f[2], f[3], f[4]]);
});

console.log("\n=== 6b. Export OHNE Barcodes: anlernen ===");
const csvOhne = [
  'Handle,Title,Option1 Name,Option1 Value,Variant SKU,Variant Price,Variant Barcode',
  'rockstar-tee-black,Rockstar Tee Black,Groesse,S,RS-BLK-S,79.00,',
  'rockstar-tee-black,,Groesse,M,RS-BLK-M,79.00,',
  'camo-cargo-shorts,FINELLI Camo Cargo Shorts,Groesse,M,CAMO-M,75.00,'
].join("\n");
const ohne = api.katalogAusCsv(csvOhne);
pruefe("laedt auch ohne Barcode", ohne.fehler, null);
pruefe("3 Varianten trotz leerer Barcode-Spalte", ohne.varianten.length, 3);
pruefe("Handle wird vererbt", ohne.varianten[1].handle, "rockstar-tee-black");
pruefe("vid eindeutig je Groesse", ohne.varianten[0].vid !== ohne.varianten[1].vid, true);

api.setKatalog(ohne.varianten);
pruefe("unbekannter Code -> nichts", api.findeVariante("7649999999999"), null);
api.lerneEan("7649999999999", ohne.varianten[1].vid);
const gelernt = api.findeVariante("7649999999999");
pruefe("nach dem Anlernen gefunden", gelernt ? [gelernt.titel, gelernt.groesse] : null, ["Rockstar Tee Black","M"]);
pruefe("angelernter Artikel bekommt Fach", api.platzFuer(gelernt.titel), "ZG1-A1");
pruefe("Ebene fuer M", api.ebeneFuer(gelernt.groesse, 4).nr, 2);
pruefe("EAN gespeichert", Object.keys(api.getEans()).length, 1);

console.log("\n=== 7. Fehlerfaelle ===");
pruefe("Datei ohne Title-Spalte", api.katalogAusCsv("Foo,Bar\nx,Y").fehler !== null, true);
pruefe("leere Datei", api.katalogAusCsv("").fehler !== null, true);
pruefe("Fach-Schema vollstaendig", api.ALLE_FAECHER.length, 48);
pruefe("ZG2-F1 hat 6 Ebenen", api.fachInfo("ZG2-F1").ebenen, 6);
pruefe("ZG1-F1 hat 4 Ebenen", api.fachInfo("ZG1-F1").ebenen, 4);

console.log("\n----------------------------------------");
console.log(ok + " Pruefungen bestanden, " + fehler + " fehlgeschlagen");
process.exit(fehler ? 1 : 0);
