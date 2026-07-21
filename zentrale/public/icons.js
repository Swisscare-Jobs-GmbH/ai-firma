/* icons.js: zentrale SVG-Icon-Bibliothek (professionelle Linien-Icons, monochrom,
   currentColor). Ersetzt alle Emojis in der Oberflaeche. window.svgIcon(name)
   liefert ein <svg>-Markup; window.iconsAnwenden(root) fuellt alle [data-icon]. */

(function () {
  "use strict";

  // Innerer Pfad-Inhalt je Icon (24x24 viewBox, Stroke-Stil). Quelle: Feather/Lucide-Stil.
  const PFADE = {
    dashboard:
      '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/>' +
      '<rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    generator:
      '<path d="M12 3l1.6 4.9L18.5 9.5 13.6 11l-1.6 4.9L10.4 11 5.5 9.5l4.9-1.6z"/>' +
      '<path d="M19 4v3M20.5 5.5h-3M5 16v2M6 17H4"/>',
    kunden:
      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>' +
      '<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    workflows:
      '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>' +
      '<path d="M18 9a9 9 0 0 1-9 9"/>',
    claude:
      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    konten:
      '<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3 21 2M16.5 6.5l3 3M18.5 4.5l3 3"/>',
    einstellungen:
      '<circle cx="12" cy="12" r="3"/>' +
      '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    sync:
      '<path d="M23 4v6h-6M1 20v-6h6"/>' +
      '<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
    pin:
      '<path d="M12 17v5"/><path d="M9 10.8a2 2 0 0 1-1.1 1.8l-1.8.9A2 2 0 0 0 5 15.2V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.8a2 2 0 0 0-1.1-1.8l-1.8-.9A2 2 0 0 1 15 10.8V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
    website:
      '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>' +
      '<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    crm:
      '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>' +
      '<path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
    automation:
      '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    custom:
      '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
    note:
      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>' +
      '<path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
    pfeil:
      '<path d="M5 12h14M12 5l7 7-7 7"/>',
    nutzer:
      '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    abmelden:
      '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
    schliessen:
      '<path d="M18 6 6 18M6 6l12 12"/>',
    haken:
      '<path d="M20 6 9 17l-5-5"/>',
    start:
      '<path d="M7 4v16l13-8z"/>',
    bedingung:
      '<path d="M12 2l10 10-10 10L2 12z"/>',
    werkzeug:
      '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'
  };

  window.svgIcon = function (name, groesse) {
    const inhalt = PFADE[name];
    if (!inhalt) return "";
    const s = groesse || 22;
    return '<svg class="svg-icon" viewBox="0 0 24 24" width="' + s + '" height="' + s +
      '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true" focusable="false">' + inhalt + "</svg>";
  };

  // Fuellt alle [data-icon]-Elemente unterhalb von root mit ihrem Icon.
  window.iconsAnwenden = function (root) {
    const bereich = root || document;
    bereich.querySelectorAll("[data-icon]").forEach(function (el) {
      if (el.dataset.iconGesetzt === "1") return;
      const groesse = el.dataset.iconGroesse ? Number(el.dataset.iconGroesse) : undefined;
      const markup = window.svgIcon(el.dataset.icon, groesse);
      if (markup) {
        el.innerHTML = markup;
        el.dataset.iconGesetzt = "1";
      }
    });
  };
})();
