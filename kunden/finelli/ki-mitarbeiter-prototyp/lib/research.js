// Research-Spaeher (Mitarbeiter 1). Liefert das Trend-Dossier: was kommt / was geht
// in der Branche, je mit Quelle + Abrufdatum + Tier + Konfidenz.
//
// IM PROTOTYP: liest ein festes Mock-Dossier (daten/trend-dossier.json), klar als
// MOCK markiert. IM ECHTBETRIEB: hier laeuft woechentlich ein Fabel-5-Agent, der NUR
// von der gepruefteten Quellen-Whitelist (Bauplan Abschnitt 5) zieht und jede Zahl mit
// URL + Abrufdatum belegt (Fakten-Live-Regel). Die Anbindung an die Claude-API ist der
// spaeter aktivierbare Platzhalter `holeDossierLive` unten.

function ladeDossier(daten) {
  return daten.dossier || { modus: "MOCK", eintraege: [] };
}

// Eintrag, der zu einer Sortiments-Kategorie passt (fuer Einschaetzung + Markt-Blick).
function fuerKategorie(dossier, kategorie) {
  return dossier.eintraege.find((e) => e.kategorie === kategorie) || null;
}

// Nur handlungsrelevante Eintraege, deren Kategorie im Sortiment vorkommt.
function relevanteEintraege(dossier, vorhandeneKategorien) {
  const set = new Set(vorhandeneKategorien);
  return dossier.eintraege.filter((e) => set.has(e.kategorie));
}

// Platzhalter fuer den Echtbetrieb (nicht im Prototyp aktiv): ruft die Claude-API mit
// WebSearch auf, erlaubte Domains = Whitelist-Konfig. Bis dahin bewusst NICHT verdrahtet,
// damit die Demo ohne Zugaenge laeuft.
async function holeDossierLive() {
  throw new Error(
    "Live-Research ist im Prototyp bewusst deaktiviert. Aktivierung nach dem Finelli-Ja: " +
    "Fabel-5-Agent + WebSearch mit Domain-Whitelist (Bauplan Abschnitt 5/9)."
  );
}

module.exports = { ladeDossier, fuerKategorie, relevanteEintraege, holeDossierLive };
