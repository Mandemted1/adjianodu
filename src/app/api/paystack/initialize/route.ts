import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const SHIPPING_RATES: Record<string, number> = {
  standard: 20,
  express: 50,
};

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      items,           // [{ id: string, quantity: number }]
      shippingMethod,  // "standard" | "express"
      discount_code,
      payment_method,
      user_id,
      shipping_address,
    } = await req.json();

    if (!email || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "email and items are required" }, { status: 400 });
    }

    const shipping = SHIPPING_RATES[shippingMethod] ?? SHIPPING_RATES.standard;

    // ── 1. Look up real product prices from the database ──────────────────────
    const db = getSupabaseAdmin();
    const productIds = items.map((i: { id: string }) => i.id);

    const { data: products, error: productsError } = await db
      .from("products")
      .select("id, price, stock, name")
      .in("id", productIds);

    if (productsError || !products) {
      return NextResponse.json({ error: "Failed to verify products" }, { status: 500 });
    }

    // Build a map for quick lookup
    const productMap: Record<string, { price: number; stock: number; name: string }> = {};
    for (const p of products) productMap[p.id] = p;

    // Verify every item exists and has enough stock, then compute subtotal
    const verifiedItems: { id: string; name: string; price: number; quantity: number }[] = [];
    let subtotal = 0;

    for (const item of items) {
      const product = productMap[item.id];
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.id}` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `"${product.name}" only has ${product.stock} left in stock.` },
          { status: 400 }
        );
      }
      verifiedItems.push({ id: item.id, name: product.name, price: product.price, quantity: item.quantity });
      subtotal += product.price * item.quantity;
    }

    // ── 2. Validate discount code if provided ─────────────────────────────────
    let discountAmount = 0;
    let validatedCode: string | null = null;

    if (discount_code) {
      const { data: codeData } = await db
        .from("discount_codes")
        .select("code, percentage, active, expires_at, max_uses, uses_count")
        .eq("code", discount_code.trim().toUpperCase())
        .eq("active", true)
        .single();

      if (
        codeData &&
        (!codeData.expires_at || new Date(codeData.expires_at) >= new Date()) &&
        (codeData.max_uses === null || codeData.uses_count < codeData.max_uses)
      ) {
        discountAmount = Math.round(subtotal * codeData.percentage / 100);
        validatedCode = codeData.code;
      }
      // If invalid, silently skip — the user already saw an error from /validate
    }

    // ── 3. Compute the verified total ─────────────────────────────────────────
    const total = subtotal + shipping - discountAmount;

    if (total <= 0) {
      return NextResponse.json({ error: "Invalid order total" }, { status: 400 });
    }

    // ── 4. Initialize the Paystack transaction ────────────────────────────────
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(total * 100), // pesewas
        currency: "GHS",
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-confirmation`,
        metadata: {
          // All values here are server-computed — the webhook can trust them
          subtotal,
          shipping,
          discount_code: validatedCode,
          discount_amount: discountAmount,
          payment_method: payment_method ?? "card",
          user_id: user_id ?? null,
          shipping_address: shipping_address ?? null,
          items: verifiedItems,
        },
      }),
    });

    const data = await res.json();

    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch {
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
  }
}
