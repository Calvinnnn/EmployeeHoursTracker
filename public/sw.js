const CACHE_NAME = "employee-hours-v1";

// The service worker is served from the base path of the app (e.g.
// /EmployeeHoursTracker/sw.js), so its scope is always the app root.
const APP_SHELL = [self.registration.scope];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => Promise.allSettled(
                APP_SHELL.map((url) => cache.add(url).catch(() => {}))
            ))
    );

    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                const networkFetch = fetch(request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
                            const copy = networkResponse.clone();

                            caches.open(CACHE_NAME)
                                .then((cache) => cache.put(request, copy));
                        }

                        return networkResponse;
                    })
                    .catch(() => cachedResponse);

                return cachedResponse || networkFetch;
            })
    );
});
