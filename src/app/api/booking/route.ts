import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";

import { db } from "@/db";
import { bookingRequests } from "@/db/schema";
import { sendBookingNotification } from "@/lib/email";
import { bookingRateLimit } from "@/lib/rate-limit";

type Payload = Record<string, unknown>;

const str = (value: unknown, max = 400): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: NextRequest) {
  const rateLimitResponse = await bookingRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  let payload: Payload;
  try {
    const body: unknown = await request.json();
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }
    payload = body as Payload;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const row = {
    name: str(payload.name, 160),
    organization: str(payload.organization, 200) || null,
    email: str(payload.email, 200),
    phone: str(payload.phone, 80) || null,
    country: str(payload.country, 120) || null,
    city: str(payload.city, 120) || null,
    eventType: str(payload.eventType, 120) || null,
    eventDate: str(payload.eventDate, 60) || null,
    capacity: str(payload.capacity, 60) || null,
    budget: str(payload.budget, 80) || null,
    message: str(payload.message, 4000) || null,
  };

  if (!row.name || !row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(row.email)) {
    return NextResponse.json(
      { error: "Nom et email valides sont obligatoires." },
      { status: 422 },
    );
  }

  try {
    const [inserted] = await db.insert(bookingRequests).values(row).returning({ id: bookingRequests.id });
    const reference = `CD-${String(inserted?.id ?? 0).padStart(5, "0")}`;

    // Fire-and-forget notification; DB insert is the source of truth.
    sendBookingNotification({ reference, ...row }).catch(() => {});

    return NextResponse.json({ ok: true, reference }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Enregistrement impossible. Écrivez à booking.conexetdon@gmail.com." },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const rateLimitResponse = await bookingRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const [row] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(bookingRequests);
    return NextResponse.json({ total: row?.total ?? 0 });
  } catch {
    return NextResponse.json({ total: 0 });
  }
}
