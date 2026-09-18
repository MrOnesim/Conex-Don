import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const source = readFileSync(resolve(process.cwd(), "public/sw.js"), "utf8");

type WorkerEvent = {
  request?: Request;
  waitUntil: (promise: Promise<unknown>) => void;
  respondWith: (promise: Promise<Response>) => void;
};

function createWorker() {
  const listeners = new Map<string, (event: WorkerEvent) => void>();
  const cache = {
    match: vi.fn<() => Promise<Response | undefined>>().mockResolvedValue(undefined),
    put: vi.fn().mockResolvedValue(undefined),
    addAll: vi.fn().mockResolvedValue(undefined),
  };
  const caches = {
    open: vi.fn().mockResolvedValue(cache),
    keys: vi.fn().mockResolvedValue([]),
    delete: vi.fn().mockResolvedValue(true),
  };
  const fetch = vi.fn().mockResolvedValue(new Response("network"));
  const self = {
    addEventListener: (type: string, callback: (event: WorkerEvent) => void) => listeners.set(type, callback),
    skipWaiting: vi.fn().mockResolvedValue(undefined),
    clients: { claim: vi.fn().mockResolvedValue(undefined) },
  };
  runInNewContext(source, { self, caches, fetch, URL, Response, location: { origin: "https://example.test" } });

  async function dispatch(type: string, request?: Request) {
    const tasks: Promise<unknown>[] = [];
    let response: Promise<Response> | undefined;
    listeners.get(type)?.({
      request,
      waitUntil: (promise) => { tasks.push(promise); },
      respondWith: (promise) => { response = promise; },
    });
    const result = await response;
    await Promise.all(tasks);
    return result;
  }

  return { cache, caches, fetch, self, dispatch };
}

const request = (path: string, init?: RequestInit) => new Request(`https://example.test${path}`, init);

describe("service worker", () => {
  it("serves a cached public page even when its background refresh fails", async () => {
    const worker = createWorker();
    worker.cache.match.mockResolvedValue(new Response("cached page"));
    worker.fetch.mockRejectedValue(new Error("offline"));
    const response = await worker.dispatch("fetch", request("/musique"));
    expect(await response?.text()).toBe("cached page");
    expect(worker.fetch).toHaveBeenCalledTimes(1);
  });

  it("stores a successful public response on a cache miss", async () => {
    const worker = createWorker();
    const response = await worker.dispatch("fetch", request("/musique"));
    expect(await response?.text()).toBe("network");
    expect(worker.cache.put).toHaveBeenCalledTimes(1);
  });

  it("returns 503 when offline and no cached page exists", async () => {
    const worker = createWorker();
    worker.fetch.mockRejectedValue(new Error("offline"));
    expect((await worker.dispatch("fetch", request("/musique")))?.status).toBe(503);
  });

  it("never reads or writes the cache for API requests", async () => {
    const worker = createWorker();
    const response = await worker.dispatch("fetch", request("/api/booking"));
    expect(await response?.text()).toBe("network");
    expect(worker.caches.open).not.toHaveBeenCalled();
  });

  it("does not return stale API data when offline", async () => {
    const worker = createWorker();
    worker.cache.match.mockResolvedValue(new Response('{"total":42}'));
    worker.fetch.mockRejectedValue(new Error("offline"));
    expect((await worker.dispatch("fetch", request("/api/booking")))?.status).toBe(503);
    expect(worker.caches.open).not.toHaveBeenCalled();
  });

  it("passes POST requests straight to the network", async () => {
    const worker = createWorker();
    const req = request("/api/booking", { method: "POST", body: "{}" });
    await worker.dispatch("fetch", req);
    expect(worker.fetch).toHaveBeenCalledWith(req);
    expect(worker.caches.open).not.toHaveBeenCalled();
  });

  it("passes cross-origin requests straight to the network", async () => {
    const worker = createWorker();
    const req = new Request("https://external.example.test/image.png");
    await worker.dispatch("fetch", req);
    expect(worker.fetch).toHaveBeenCalledWith(req);
    expect(worker.caches.open).not.toHaveBeenCalled();
  });

  it.each(["no-store", "private, max-age=60"])("does not cache responses marked %s", async (cacheControl) => {
    const worker = createWorker();
    worker.fetch.mockResolvedValue(new Response("restricted", { headers: { "Cache-Control": cacheControl } }));
    await worker.dispatch("fetch", request("/musique"));
    expect(worker.cache.put).not.toHaveBeenCalled();
  });

  it("returns the network response even if cache storage is full", async () => {
    const worker = createWorker();
    worker.cache.put.mockRejectedValue(new Error("quota exceeded"));
    const response = await worker.dispatch("fetch", request("/musique"));
    expect(await response?.text()).toBe("network");
  });

  it("removes old project caches without deleting caches belonging to other apps", async () => {
    const worker = createWorker();
    worker.caches.keys.mockResolvedValue(["conex-don-v1", "unrelated-app-v1"]);
    await worker.dispatch("activate");
    expect(worker.caches.delete).toHaveBeenCalledWith("conex-don-v1");
    expect(worker.caches.delete).not.toHaveBeenCalledWith("unrelated-app-v1");
    expect(worker.self.clients.claim).toHaveBeenCalledTimes(1);
  });
});
