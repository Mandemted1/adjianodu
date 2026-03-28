import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "Reference is required" }, { status: 400 });
  }

  // Only return the fields the confirmation page actually needs.
  // Shipping address, order items, and payment details are intentionally excluded.
  const { data: order, error } = await getSupabaseAdmin()
    .from("orders")
    .select("id, total, guest_email, user_id, paystack_ref, status")
    .eq("paystack_ref", reference.trim())
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
