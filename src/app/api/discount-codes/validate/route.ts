import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("discount_codes")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .eq("active", true)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Invalid or expired code." }, { status: 404 });
  }

  // Check expiry
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ error: "This code has expired." }, { status: 400 });
  }

  // Check usage limit
  if (data.max_uses !== null && data.uses_count >= data.max_uses) {
    return NextResponse.json({ error: "This code has reached its usage limit." }, { status: 400 });
  }

  return NextResponse.json({ percentage: data.percentage, code: data.code });
}
