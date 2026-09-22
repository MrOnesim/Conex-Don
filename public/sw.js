const KILLER_VERSION = "kill-v2-cleanup";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(cleanup());
});

async function cleanup() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((name) => caches.delete(name)));

  try {
    await self.registration.unregister();
  } catch {
  }

  if ("clients" in self) {
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type: "window" });
    await Promise.all(
      clients.map((client) =>
        client.navigate(client.url).catch(() => {})
      ),
    );
  }
}