import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
}

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitInfo>();

function getKey(request: NextRequest, prefix: string): string {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  return `${prefix}:${ip}`;
}

function cleanup(): void {
  const now = Date.now();
  for (const [key, info] of store.entries()) {
    if (info.resetTime < now) {
      store.delete(key);
    }
  }
}

const cleanupTimer = setInterval(cleanup, 60000);
if (cleanupTimer && typeof cleanupTimer.unref === "function") {
  cleanupTimer.unref();
}

export function rateLimit(config: RateLimitConfig) {
  const { windowMs, maxRequests, keyPrefix = "api" } = config;

  return async function rateLimitMiddleware(request: NextRequest): Promise<NextResponse | null> {
    const key = getKey(request, keyPrefix);
    const now = Date.now();
    const windowStart = now - windowMs;

    let info = store.get(key);

    if (!info || info.resetTime < now) {
      info = { count: 0, resetTime: now + windowMs };
      store.set(key, info);
    }

    info.count++;

    const remaining = Math.max(0, maxRequests - info.count);
    const resetTime = Math.ceil((info.resetTime - now) / 1000);

    const headers = {
      "X-RateLimit-Limit": String(maxRequests),
      "X-RateLimit-Remaining": String(remaining),
      "X-RateLimit-Reset": String(resetTime),
      "Retry-After": String(resetTime),
    };

    if (info.count > maxRequests) {
      return NextResponse.json(
        { error: "Trop de requêtes. Réessayez plus tard." },
        { status: 429, headers }
      );
    }

    return null;
  };
}

export const bookingRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  maxRequests: 10,
  keyPrefix: "booking",
});

export const newsletterRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  maxRequests: 30,
  keyPrefix: "newsletter",
});

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  maxRequests: 60,
  keyPrefix: "api",
});