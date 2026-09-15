import { NextResponse } from "next/server";

import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionValue, isUnconfigured, matchToken } from "@/lib/auth";

/** Sehr einfaches In-Memory-Rate-Limit gegen Token-Raten. */
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 10;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  if (isUnconfigured()) {
    return NextResponse.json({ error: "Server hat keinen Zugangstoken konfiguriert." }, { status: 503 });
  }

  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Zu viele Versuche. Warte eine Minute." }, { status: 429 });
  }

  let token = "";
  try {
    const body = (await request.json()) as { token?: unknown };
    token = typeof body.token === "string" ? body.token : "";
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const match = matchToken(token);
  if (!match) {
    return NextResponse.json({ error: "Token ungültig." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, label: match.label });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: await createSessionValue(match),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return response;
}
