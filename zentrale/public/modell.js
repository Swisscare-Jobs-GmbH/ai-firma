// modell.js: Modell-Katalog, Modell-Empfehlung und Formatierung der claude -p Stream-Zeilen.
// Teil der AIWorks Zentrale (Vanilla JS, kein Build, wird per defer in index.html geladen).

window.modelle = [
  {
    kurz: "haiku",
    id: "claude-haiku-4-5-20251001",
    name: "Haiku 4.5",
    staerke: "Einfache mechanische Aufgaben, Formatierung, kleine Fixes",
    kosten: 1
  },
  {
    kurz: "sonnet",
    id: "claude-sonnet-5",
    name: "Sonnet 5",
    staerke: "Normale Coding-Arbeit, Standard-Aufgaben",
    kosten: 2
  },
  {
    kurz: "opus",
    id: "claude-opus-4-8",
    name: "Opus 4.8",
    staerke: "Bau komplexer Features (Firmen-Regel: Bau = Opus)",
    kosten: 3
  },
  {
    kurz: "fabel",
    id: "claude-fable-5",
    name: "Fabel 5",
    staerke: "Recherche, Planung, Audit, Architektur (Firmen-Regel)",
    kosten: 4
  }
];

// Fallback-Regeln, falls window.einstellungen noch nicht geladen ist oder keine
// modellRegeln enthaelt. Inhaltlich identisch zu den Default-modellRegeln.
const MODELL_FALLBACK_REGELN = [
  {
    muster: ["recherche", "plan", "audit", "architektur", "analyse", "konzept"],
    modellId: "claude-fable-5",
    grund: "Firmen-Regel: Recherche, Planung und Audit laufen auf Fabel 5"
  },
  {
    muster: ["baue", "bau", "implementier", "entwickle", "feature", "refactor"],
    modellId: "claude-opus-4-8",
    grund: "Firmen-Regel: Bau komplexer Features läuft auf Opus 4.8"
  },
  {
    muster: ["formatier", "typo", "tippfehler", "umbenenn", "kleiner fix"],
    modellId: "claude-haiku-4-5-20251001",
    grund: "Einfache mechanische Aufgabe, Haiku 4.5 reicht und spart Kosten"
  }
];

function modellNameZuId(modellId) {
  const eintrag = window.modelle.find(function (modell) {
    return modell.id === modellId;
  });
  return eintrag ? eintrag.name : modellId;
}

// Prueft die Regeln aus den Einstellungen (jedes muster-Wort case-insensitive als
// Teilstring im Text, erste Treffer-Regel gewinnt). Ohne Treffer: Sonnet 5.
window.modellEmpfehlung = function (text) {
  const suchtext = String(text || "").toLowerCase();
  const einstellungen = window.einstellungen;
  const regeln =
    einstellungen && Array.isArray(einstellungen.modellRegeln) && einstellungen.modellRegeln.length > 0
      ? einstellungen.modellRegeln
      : MODELL_FALLBACK_REGELN;

  for (const regel of regeln) {
    const muster = Array.isArray(regel.muster) ? regel.muster : [];
    const hatTreffer = muster.some(function (wort) {
      return wort && suchtext.includes(String(wort).toLowerCase());
    });
    if (hatTreffer && regel.modellId) {
      return {
        modellId: regel.modellId,
        name: modellNameZuId(regel.modellId),
        grund: regel.grund || "Regel-Treffer aus den Einstellungen"
      };
    }
  }

  return {
    modellId: "claude-sonnet-5",
    name: "Sonnet 5",
    grund: "Standard: gute Leistung zu mittleren Kosten"
  };
};

function formatiereAssistantZeile(obj) {
  const bloecke =
    obj.message && Array.isArray(obj.message.content) ? obj.message.content : [];
  const teile = [];
  for (const block of bloecke) {
    if (block && block.type === "text" && block.text) {
      teile.push(block.text);
    } else if (block && block.type === "tool_use") {
      teile.push("[Werkzeug: " + (block.name || "unbekannt") + "]");
    }
  }
  return teile.length > 0 ? teile.join("\n") : null;
}

function formatiereResultZeile(obj) {
  const kosten =
    typeof obj.total_cost_usd === "number"
      ? "$" + obj.total_cost_usd.toFixed(4)
      : "unbekannt";
  let text = "Fertig. Kosten: " + kosten;
  if (obj.result) {
    text += "\n" + obj.result;
  }
  return text;
}

// Macht aus einer stream-json-Zeile von claude -p einen anzeigbaren String.
// Unbekannte Typen liefern null und werden nicht angezeigt.
window.formatiereClaudeZeile = function (obj) {
  if (!obj || typeof obj !== "object") {
    return null;
  }
  if (obj.type === "system" && obj.subtype === "init") {
    return "Gestartet (Modell: " + (obj.model || "unbekannt") + ")";
  }
  if (obj.type === "assistant") {
    return formatiereAssistantZeile(obj);
  }
  if (obj.type === "result") {
    return formatiereResultZeile(obj);
  }
  return null;
};
