const CACHE_NAME = "grow-habit-cache-v1";
const urlsToCache = ["/index.html", "/offline.html"];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
            .then((cache) => {
                console.log("Cache populated successfully", cache);
                return cache.addAll(urlsToCache);
            })
            .catch((err) => {
                console.log("Error populating cache:", err);
            })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return fetch(event.request).catch((err) => {
                return caches.match("/offline.html");
            });
        })
    );
});

self.addEventListener("activate", (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
