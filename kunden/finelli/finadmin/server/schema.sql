-- SEA Lager. Shopify fuehrt nur den Gesamtbestand.
-- Die Aufteilung Zuerich/Embrach lebt ausschliesslich hier.

DROP TABLE IF EXISTS bestand;
CREATE TABLE bestand (
  artikel     TEXT NOT NULL,
  groesse     TEXT NOT NULL,
  titel       TEXT NOT NULL,
  fach        TEXT,
  zh          INTEGER NOT NULL DEFAULT 0,
  emb         INTEGER NOT NULL DEFAULT 0,
  variant_gid TEXT,
  sku         TEXT,
  ean         TEXT,
  bild        TEXT,
  PRIMARY KEY (artikel, groesse)
);
CREATE INDEX idx_bestand_variant ON bestand (variant_gid);
CREATE INDEX idx_bestand_ean     ON bestand (ean);

DROP TABLE IF EXISTS bewegung;
CREATE TABLE bewegung (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  artikel    TEXT NOT NULL,
  groesse    TEXT NOT NULL,
  ort        TEXT NOT NULL,
  delta      INTEGER NOT NULL,
  grund      TEXT NOT NULL,
  quelle     TEXT,
  schluessel TEXT,
  erstellt   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX idx_bewegung_schluessel ON bewegung (schluessel) WHERE schluessel IS NOT NULL;

-- Packzeiten je Bestellung, damit die Prozesse spaeter mit KI ausgewertet werden koennen.
DROP TABLE IF EXISTS kommission;
CREATE TABLE kommission (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id   TEXT,
  name       TEXT,
  start      INTEGER,
  ende       INTEGER,
  dauer      INTEGER,
  positionen INTEGER,
  stueck     INTEGER,
  erstellt   TEXT NOT NULL DEFAULT (datetime('now'))
);
