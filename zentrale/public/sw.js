/* sw.js: schlanker Service-Worker. Zweck: die App als installierbare PWA (eigenes
   Fenster, Taskbar-Icon) verfuegbar machen und die App-Huelle offline vorhalten.
   API- und Stream-Aufrufe laufen IMMER live ans Netz (nie aus dem Cache). */

const CACHE = "sea-app-v1";
const HUELLE = [
  "/", "/index.html", "/style.css",
  "/icons.js", "/login.js", "/app.js", "/modell.js", "/kunden.js",
  "/workflows.js", "/generator.js", "/claude.js", "/konten.js", "/einstellungen.js",
  "/icon.svg", "/icon-192.png", "/icon-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.allSettled(HUELLE.map(function (u) { return c.add(u); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  const req = e.request;
  const url = new URL(req.url);
  // Nur GET auf gleicher Herkunft cachen; API/Streams nie.
  if (req.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) {
    return;
  }
  e.respondWith(
    fetch(req).then(function (antwort) {
      if (antwort && antwort.ok) {
        const kopie = antwort.clone();
        caches.open(CACHE).then(function (c) { c.put(req, kopie); });
      }
      return antwort;
    }).catch(function () {
      return caches.match(req).then(function (treffer) {
        return treffer || caches.match("/index.html");
      });
    })
  );
});
