import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

// Simple in-memory rate limit: max 10 attempts per IP per 60 seconds.
// Not perfect across multiple serverless instances but adds meaningful friction.
const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > 10;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const { code } = await req.json();

  // Basic input validation — codes are short uppercase alphanumeric strings
  if (!code || typeof code !== "string" || code.length > 24 || !/^[A-Z0-9_-]+$/i.test(code)) {
    return NextResponse.json({ error: "Invalid code." }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("discount_codes")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .eq("active", true)
    .single();

  // Use a fixed-time delay to slow down automated attempts and
  // return the same generic message for all failure modes.
  await new Promise((r) => setTimeout(r, 200));

  if (error || !data) {
    return NextResponse.json({ error: "Invalid or expired code." }, { status: 404 });
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
  }

  if (data.max_uses !== null && data.uses_count >= data.max_uses) {
    return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
  }

  return NextResponse.json({ percentage: data.percentage, code: data.code });
}
