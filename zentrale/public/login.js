/* login.js: Login-Gate der SEA-App. Bei jedem Start fragt ein Vollbild-Overlay,
   wer arbeitet (Cherry = Shehryaar, Amb = Abdul). Ein Klick genuegt — kein Passwort.
   Danach laedt der Server das persoenliche Brain des gewaehlten Nutzers.
   Stellt window.loginAnzeigen() (Gate, gibt Promise) und window.nutzerChipSetzen(). */

(function () {
  "use strict";

  function css() {
    if (document.getElementById("css-login")) return;
    const style = document.createElement("style");
    style.id = "css-login";
    style.textContent = `
      #login-overlay {
        position: fixed; inset: 0; z-index: 400;
        display: flex; align-items: center; justify-content: center; padding: 24px;
        background:
          radial-gradient(1000px 560px at 12% -12%, rgba(139,61,255,0.30), transparent 60%),
          radial-gradient(820px 520px at 100% 0%, rgba(96,44,205,0.22), transparent 58%),
          var(--bg);
        -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px);
        animation: sea-einblenden 0.2s ease-out;
      }
      .login-box {
        width: 100%; max-width: 560px; text-align: center;
        background: var(--panel); border: 1px solid var(--border);
        border-radius: var(--radius-gross); padding: 40px 36px 34px;
        box-shadow: var(--schatten);
        -webkit-backdrop-filter: var(--glas); backdrop-filter: var(--glas);
        animation: sea-modal-rein 0.24s cubic-bezier(0.2,0.7,0.2,1);
      }
      .login-brand { display: flex; flex-direction: column; align-items: center; gap: 2px; margin-bottom: 26px; }
      .login-wort {
        font-size: 30px; font-weight: 900; letter-spacing: 0.5px;
        background: linear-gradient(105deg, var(--akzent), var(--akzent-hell));
        -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
      }
      .login-claim { font-size: 11px; font-weight: 600; letter-spacing: 0.5px; color: var(--muted); }
      .login-box h1 { margin: 0 0 6px; font-size: 22px; font-weight: 800; letter-spacing: -0.3px; }
      .login-hint { margin: 0 0 26px; color: var(--muted); font-size: 14px; }
      .login-users { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      @media (max-width: 460px) { .login-users { grid-template-columns: 1fr; } }
      .login-user {
        display: flex; flex-direction: column; align-items: center; gap: 12px;
        padding: 26px 18px; cursor: pointer;
        background: var(--panel-2); border: 1px solid var(--border); border-radius: var(--radius);
        color: var(--text); font-family: inherit;
        transition: border-color var(--uebergang), transform 0.12s ease, box-shadow var(--uebergang);
      }
      .login-user:hover { border-color: var(--akzent); transform: translateY(-3px); box-shadow: var(--glow); }
      .login-user:active { transform: translateY(-1px); }
      .login-user:focus-visible { outline: 2px solid var(--akzent-hell); outline-offset: 2px; }
      .login-user:disabled { opacity: 0.55; cursor: progress; transform: none; }
      .login-avatar {
        display: flex; align-items: center; justify-content: center;
        width: 66px; height: 66px; border-radius: 50%;
        font-size: 27px; font-weight: 800; color: #fff;
        background: linear-gradient(135deg, var(--akzent), var(--akzent-hell));
        box-shadow: var(--glow);
      }
      .login-name { font-size: 18px; font-weight: 700; }
      .login-person { font-size: 12.5px; color: var(--muted); margin-top: -6px; }

      /* Nutzer-Chip in der Seitenleiste */
      #nutzer-chip {
        display: flex; align-items: center; gap: 9px; width: 100%;
        padding: 9px 11px; margin-bottom: 6px;
        background: transparent; border: 1px solid var(--border); border-radius: 12px;
        color: var(--muted); font-family: inherit; font-size: 13px; cursor: pointer;
        transition: border-color var(--uebergang), color var(--uebergang), background var(--uebergang);
      }
      #nutzer-chip:hover { border-color: var(--akzent); color: var(--text); background: var(--akzent-weich); }
      #nutzer-chip:focus-visible { outline: 2px solid var(--akzent-hell); outline-offset: 2px; }
      .nutzer-chip-avatar {
        flex-shrink: 0; display: flex; align-items: center; justify-content: center;
        width: 26px; height: 26px; border-radius: 50%; font-size: 12px; font-weight: 800; color: #fff;
        background: linear-gradient(135deg, var(--akzent), var(--akzent-hell));
      }
      .nutzer-chip-text { display: flex; flex-direction: column; line-height: 1.2; text-align: left; min-width: 0; }
      .nutzer-chip-name { font-weight: 700; color: var(--text); }
      .nutzer-chip-aktion { font-size: 11px; }
      .nutzer-chip-icon { flex-shrink: 0; margin-left: auto; display: inline-flex; }
      /* Eingeklappte Seitenleiste: nur Avatar zeigen */
      #seitenleiste:not(.ist-gepinnt):not(:hover) #nutzer-chip { justify-content: center; padding: 9px 0; }
      #seitenleiste:not(.ist-gepinnt):not(:hover) .nutzer-chip-text,
      #seitenleiste:not(.ist-gepinnt):not(:hover) .nutzer-chip-icon { display: none; }
    `;
    document.head.appendChild(style);
  }

  function initiale(name) {
    return (name || "?").trim().charAt(0).toUpperCase();
  }

  // Baut das Overlay und liefert ein Promise, das mit dem gewaehlten Nutzer aufloest.
  window.loginAnzeigen = function (nutzerListe) {
    css();
    const liste = Array.isArray(nutzerListe) && nutzerListe.length
      ? nutzerListe
      : [
          { id: "cherry", name: "Cherry", person: "Shehryaar" },
          { id: "amb", name: "Amb", person: "Abdul" }
        ];

    return new Promise(function (aufloesen) {
      const overlay = document.createElement("div");
      overlay.id = "login-overlay";

      const box = document.createElement("div");
      box.className = "login-box";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-label", "Anmelden");

      const brand = document.createElement("div");
      brand.className = "login-brand";
      brand.innerHTML =
        '<span class="login-wort">SEA</span>' +
        '<span class="login-claim">Software. Efficient. Automation.</span>';
      box.appendChild(brand);

      const titel = document.createElement("h1");
      titel.textContent = "Wer arbeitet gerade?";
      box.appendChild(titel);

      const hinweis = document.createElement("p");
      hinweis.className = "login-hint";
      hinweis.textContent = "Waehle dein Profil — dein persoenliches Brain wird geladen.";
      box.appendChild(hinweis);

      const users = document.createElement("div");
      users.className = "login-users";

      let laeuft = false;
      liste.forEach(function (u) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "login-user";
        btn.setAttribute("aria-label", "Als " + u.name + " anmelden");
        const av = document.createElement("span");
        av.className = "login-avatar";
        av.textContent = initiale(u.name);
        const nm = document.createElement("span");
        nm.className = "login-name";
        nm.textContent = u.name;
        const pe = document.createElement("span");
        pe.className = "login-person";
        pe.textContent = u.person || "";
        btn.appendChild(av);
        btn.appendChild(nm);
        btn.appendChild(pe);

        btn.addEventListener("click", async function () {
          if (laeuft) return;
          laeuft = true;
          users.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
          try {
            const antwort = await window.api.post("/api/nutzer/login", { id: u.id });
            const aktiv = (antwort && antwort.aktiv) || { id: u.id, name: u.name, person: u.person };
            overlay.style.opacity = "0";
            overlay.style.transition = "opacity 0.2s ease";
            setTimeout(function () { overlay.remove(); aufloesen(aktiv); }, 200);
          } catch (fehler) {
            laeuft = false;
            users.querySelectorAll("button").forEach(function (b) { b.disabled = false; });
            window.toast("Login fehlgeschlagen: " + fehler.message, "fehler");
          }
        });
        users.appendChild(btn);
      });

      box.appendChild(users);
      overlay.appendChild(box);
      document.body.appendChild(overlay);
      const ersterKnopf = users.querySelector("button");
      if (ersterKnopf) ersterKnopf.focus();
    });
  };

  // Fuellt den Nutzer-Chip in der Seitenleiste und verdrahtet "Abmelden" (Reload -> Login).
  window.nutzerChipSetzen = function (user) {
    const chip = document.getElementById("nutzer-chip");
    if (!chip || !user) return;
    css();
    chip.innerHTML = "";
    const av = document.createElement("span");
    av.className = "nutzer-chip-avatar";
    av.textContent = initiale(user.name);
    const text = document.createElement("span");
    text.className = "nutzer-chip-text";
    const name = document.createElement("span");
    name.className = "nutzer-chip-name";
    name.textContent = user.name;
    const aktion = document.createElement("span");
    aktion.className = "nutzer-chip-aktion";
    aktion.textContent = "Abmelden / wechseln";
    text.appendChild(name);
    text.appendChild(aktion);
    const icon = document.createElement("span");
    icon.className = "nutzer-chip-icon";
    icon.innerHTML = window.svgIcon ? window.svgIcon("abmelden", 16) : "";

    chip.appendChild(av);
    chip.appendChild(text);
    chip.appendChild(icon);
    chip.setAttribute("data-tooltip", "Abmelden und Nutzer wechseln");
    chip.setAttribute("aria-label", "Angemeldet als " + user.name + ". Abmelden und wechseln.");

    chip.onclick = async function () {
      try { await window.api.post("/api/nutzer/logout", {}); } catch (fehler) { /* Reload zeigt eh Login */ }
      window.location.reload();
    };
  };
})();
