const CACHE_NAME = "conex-don-v1";
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

const CACHE_STRATEGIES = {
  static: "cache-first",
  api: "network-first",
  images: "cache-first",
  fonts: "cache-first",
};

async function installServiceWorker() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(STATIC_ASSETS);
  self.skipWaiting();
}

async function activateServiceWorker() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((name) => name !== CACHE_NAME)
      .map((name) => caches.delete(name))
  );
  self.clients.claim();
}

async function handleFetch(event) {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== location.origin) {
    return fetch(request);
  }

  if (request.method !== "GET") {
    return fetch(request);
  }

  const isApiRequest = url.pathname.startsWith("/api/");
  const isImageRequest = request.destination === "image";
  const isFontRequest = request.destination === "font";
  const isStaticAsset = STATIC_ASSETS.some((asset) => url.pathname === asset);

  if (isApiRequest) {
    return networkFirstStrategy(request);
  }

  if (isImageRequest || isFontRequest || isStaticAsset) {
    return cacheFirstStrategy(request);
  }

  return networkFirstStrategy(request);
}

async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    event.waitUntil(updateCache(request, cache));
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
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
    if (networkResponse.ok) {
      await cache.put(request, networkResponse);
    }
  } catch {
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(installServiceWorker());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(activateServiceWorker());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(handleFetch(event));
});

self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});