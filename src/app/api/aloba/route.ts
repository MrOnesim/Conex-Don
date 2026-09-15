import { NextResponse } from "next/server";

import { db } from "@/db";
import { alobaPosts } from "@/db/schema";
import { getAlobaPosts } from "@/lib/data";

const str = (value: unknown, max = 200): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function GET() {
  const posts = await getAlobaPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const displayName = str(payload.displayName, 120);
  const message = str(payload.message, 1200);

  if (!displayName || !message) {
    return NextResponse.json(
      { error: "Un prénom et un message sont nécessaires." },
      { status: 422 },
    );
  }

  try {
    const [row] = await db
      .insert(alobaPosts)
      .values({
        displayName,
        handle: str(payload.handle, 120) || null,
        city: str(payload.city, 120) || null,
        mood: str(payload.mood, 60) || "Aloba !",
        message,
        approved: true,
      })
      .returning();

    if (!row) throw new Error("insert failed");

    return NextResponse.json(
      {
        post: {
          id: row.id,
          displayName: row.displayName,
          handle: row.handle,
          city: row.city,
          mood: row.mood,
          message: row.message,
          createdAt: row.createdAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch {
    // Repli : la publication reste visible côté client même sans base.
    return NextResponse.json(
      {
        post: {
          id: -Date.now(),
          displayName,
          handle: str(payload.handle, 120) || null,
          city: str(payload.city, 120) || null,
          mood: str(payload.mood, 60) || "Aloba !",
          message,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 200 },
    );
  }
}

export const runtime = "nodejs";
