import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

function createMockRequest(ip: string): NextRequest {
  return new NextRequest("https://conexetdon.com/api/test", {
    headers: {
      "x-forwarded-for": ip,
    },
  });
}

describe("Rate Limit Lib", () => {
  it("allows requests under the maximum limit", async () => {
    const limiter = rateLimit({
      windowMs: 10000,
      maxRequests: 3,
      keyPrefix: "test-allow",
    });

    const req = createMockRequest("192.168.1.1");

    const res1 = await limiter(req);
    expect(res1).toBeNull();

    const res2 = await limiter(req);
    expect(res2).toBeNull();
  });

  it("blocks requests that exceed the limit with status 429 and rate limit headers", async () => {
    const limiter = rateLimit({
      windowMs: 10000,
      maxRequests: 2,
      keyPrefix: "test-block",
    });

    const req = createMockRequest("10.0.0.1");

    // 1st request
    const res1 = await limiter(req);
    expect(res1).toBeNull();

    // 2nd request (at limit)
    const res2 = await limiter(req);
    expect(res2).toBeNull();

    // 3rd request (exceeds limit)
    const res3 = await limiter(req);
    expect(res3).not.toBeNull();
    expect(res3?.status).toBe(429);

    const headers = res3?.headers;
    expect(headers?.get("X-RateLimit-Limit")).toBe("2");
    expect(headers?.get("X-RateLimit-Remaining")).toBe("0");
    expect(headers?.get("Retry-After")).toBeDefined();
  });

  it("isolates rate limits by IP address", async () => {
    const limiter = rateLimit({
      windowMs: 10000,
      maxRequests: 1,
      keyPrefix: "test-ip-isolation",
    });

    const reqA = createMockRequest("172.16.0.1");
    const reqB = createMockRequest("172.16.0.2");

    // User A uses up their quota
    expect(await limiter(reqA)).toBeNull();
    expect((await limiter(reqA))?.status).toBe(429);

    // User B still has their quota
    expect(await limiter(reqB)).toBeNull();
  });
});
