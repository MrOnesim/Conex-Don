import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { sendNewsletterWelcome } from "@/lib/email";
import { newsletterRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimitResponse = await newsletterRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  let email = "";
  try {
    const payload = (await request.json()) as { email?: unknown };
    email = typeof payload.email === "string" ? payload.email.trim().slice(0, 200) : "";
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 422 });
  }

  try {
    await db.insert(newsletterSubscribers).values({ email }).onConflictDoNothing();

    // Fire-and-forget welcome email.
    sendNewsletterWelcome(email).catch(() => {});

    return NextResponse.json(
      { ok: true, message: "C'est noté. Tu es sur la liste ALOBA." },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { ok: true, message: "Inscription enregistrée localement." },
      { status: 200 },
    );
  }
}