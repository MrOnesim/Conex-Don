import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { POST } from "@/app/api/booking/route";

const mocks = vi.hoisted(() => ({
  insert: vi.fn(), values: vi.fn(), returning: vi.fn(),
  notify: vi.fn(), limit: vi.fn(),
}));
vi.mock("@/db", () => ({ db: { insert: mocks.insert } }));
vi.mock("@/db/schema", () => ({ bookingRequests: { id: "id" } }));
vi.mock("@/lib/email", () => ({ sendBookingNotification: mocks.notify }));
vi.mock("@/lib/rate-limit", () => ({ bookingRateLimit: mocks.limit }));

const request = (body: string) => new NextRequest("https://example.test/api/booking", {
  method: "POST", headers: { "Content-Type": "application/json" }, body,
});

beforeEach(() => {
  vi.resetAllMocks();
  mocks.limit.mockResolvedValue(null);
  mocks.insert.mockReturnValue({ values: mocks.values });
  mocks.values.mockReturnValue({ returning: mocks.returning });
  mocks.returning.mockResolvedValue([{ id: 42 }]);
  mocks.notify.mockResolvedValue(true);
});

describe("POST /api/booking", () => {
  it("preserves successful submissions, trimming and reference format", async () => {
    const response = await POST(request(JSON.stringify({
      name: " Alice ", email: " alice@example.test ", message: "Bonjour",
    })));
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ ok: true, reference: "CD-00042" });
    expect(mocks.values).toHaveBeenCalledWith(expect.objectContaining({
      name: "Alice", email: "alice@example.test", organization: null, message: "Bonjour",
    }));
    expect(mocks.notify).toHaveBeenCalledWith(expect.objectContaining({ reference: "CD-00042" }));
  });

  it.each(["null", "[]", '"text"', "42", "true", "false", "{"])("rejects invalid JSON payload %s without touching the database", async (body) => {
    const response = await POST(request(body));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Requête invalide." });
    expect(mocks.insert).not.toHaveBeenCalled();
    expect(mocks.notify).not.toHaveBeenCalled();
  });

  it.each([{}, { name: "Alice", email: "invalid" }, { name: 42, email: "alice@example.test" }])("keeps 422 for invalid required fields: %j", async (body) => {
    const response = await POST(request(JSON.stringify(body)));
    expect(response.status).toBe(422);
    expect(mocks.insert).not.toHaveBeenCalled();
  });

  it("preserves field length limits", async () => {
    await POST(request(JSON.stringify({ name: "A".repeat(200), email: "a@example.test", message: "B".repeat(5000) })));
    expect(mocks.values).toHaveBeenCalledWith(expect.objectContaining({ name: "A".repeat(160), message: "B".repeat(4000) }));
  });

  it("returns the rate limit response before parsing or writing", async () => {
    mocks.limit.mockResolvedValue(NextResponse.json({ error: "limit" }, { status: 429 }));
    expect((await POST(request("null"))).status).toBe(429);
    expect(mocks.insert).not.toHaveBeenCalled();
  });

  it("does not report success or send email when persistence fails", async () => {
    mocks.returning.mockRejectedValue(new Error("database unavailable"));
    expect((await POST(request(JSON.stringify({ name: "Alice", email: "alice@example.test" })))).status).toBe(500);
    expect(mocks.notify).not.toHaveBeenCalled();
  });

  it("keeps persisted submissions successful if notification fails", async () => {
    mocks.notify.mockRejectedValue(new Error("SMTP unavailable"));
    expect((await POST(request(JSON.stringify({ name: "Alice", email: "alice@example.test" })))).status).toBe(201);
  });
});
