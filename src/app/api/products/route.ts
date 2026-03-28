import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.toLowerCase() ?? "";

  const db = getSupabaseAdmin();
  let query = db.from("products").select("*");

  if (q) {
    query = query.or(`name.ilike.%${q}%,collection.ilike.%${q}%`);
  }

  const { data, error } = await query.order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data ?? []);
}
