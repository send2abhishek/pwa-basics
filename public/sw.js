var CACHE_STATIC = "static-v4";
var DYNAMIC = "dynamic";

self.addEventListener("install", function (event) {
  console.log("[Service Worker] Installing Service Worker ...", event);

  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      console.log("caching is static files");
      cache.addAll([
        "/",
        "/index.html",
        "/src/js/app.js",
        "/src/js/feed.js",
        "/src/js/promise.js",
        "/src/js/fetch.js",
        "/src/js/material.min.js",
        "/src/css/app.css",
        "/src/css/feed.css",
        "/src/images/main-image.jpg",
        "https://fonts.googleapis.com/css?family=Roboto:400,700",
        "https://fonts.googleapis.com/icon?family=Material+Icons",
        "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css",
      ]);
    })
  );
});

self.addEventListener("activate", function (event) {
  console.log("[Service Worker] Activating Service Worker ....", event);

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_STATIC && key !== DYNAMIC) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  // console.log('[Service Worker] Fetching something ....', event);
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // retreiving from cache
        if (response) {
          return response;
        }
        // if not in cache get network request
        else {
          return fetch(event.request)
            .then((res) => {
              return caches.open(DYNAMIC).then((cache) => {
                cache.put(event.request.url, res.clone());
                return res;
              });
            })
            .catch((err) => {});
        }
      })
      .catch((error) => {
        console.log("cache error ", error);
      })
  );
});
