const CACHE_NAME = "conex-don-v2";
const STATIC_ASSETS = [
  "/",
  "/histoire",
  "/musique",
  "/videos",
  "/live",
  "/aloba",
  "/epk",
  "/booking",
  "/press",
  "/manifest.json",
];

async function installServiceWorker() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(STATIC_ASSETS);
  await self.skipWaiting();
}

async function activateServiceWorker() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((name) => name.startsWith("conex-don-") && name !== CACHE_NAME)
      .map((name) => caches.delete(name))
  );
  await self.clients.claim();
}

async function handleFetch(event) {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== location.origin || request.method !== "GET") {
    return fetch(request);
  }

  // API responses may be private or time-sensitive: never persist or replay them.
  if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
    try {
      return await fetch(request);
    } catch {
      return new Response("Offline", { status: 503 });
    }
  }

  const isImageRequest = request.destination === "image";
  const isFontRequest = request.destination === "font";
  const isStaticAsset = STATIC_ASSETS.includes(url.pathname);

  if (isImageRequest || isFontRequest || isStaticAsset) {
    return cacheFirstStrategy(request, event);
  }

  return networkFirstStrategy(request, event);
}

async function storeResponse(request, response, cache) {
  const cacheControl = response.headers.get("Cache-Control") || "";
  if (!response.ok || response.status === 206 || /\b(no-store|private)\b/i.test(cacheControl)) {
    return;
  }
  try {
    await cache.put(request, response);
  } catch {
    // Storage quota or cache failures must not break a successful network request.
  }
}

async function cacheFirstStrategy(request, event) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    event.waitUntil(updateCache(request, cache));
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    event.waitUntil(storeResponse(request, networkResponse.clone(), cache));
    return networkResponse;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirstStrategy(request, event) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const networkResponse = await fetch(request);
    event.waitUntil(storeResponse(request, networkResponse.clone(), cache));
    return networkResponse;
  } catch {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response("Offline", { status: 503 });
  }
}

async function updateCache(request, cache) {
  try {
    const networkResponse = await fetch(request);
    await storeResponse(request, networkResponse, cache);
  } catch {
    // Keep the cached public resource available while offline.
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(installServiceWorker());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(activateServiceWorker());
});

self.addEventListener("fetch", (event) => {
  const response = handleFetch(event);
  event.waitUntil(response.then(() => undefined, () => undefined));
  event.respondWith(response);
});

self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    event.waitUntil(self.skipWaiting());
  }
});
