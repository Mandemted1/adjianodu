import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { reference, email } = await req.json();

  if (!reference || !email) {
    return NextResponse.json({ error: "Reference and email are required" }, { status: 400 });
  }

  const { data: order, error } = await getSupabaseAdmin()
    .from("orders")
    .select("*, order_items(*)")
    .eq("paystack_ref", reference.trim())
    .eq("guest_email", email.trim().toLowerCase())
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "No order found with that reference and email." }, { status: 404 });
  }

  return NextResponse.json(order);
}
