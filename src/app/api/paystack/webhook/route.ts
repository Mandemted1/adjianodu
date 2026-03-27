import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    // Verify the webhook is genuinely from Paystack
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const { reference, amount, customer, metadata } = event.data;

      // Avoid duplicate order creation if webhook fires twice
      const { data: existing } = await supabaseAdmin
        .from("orders")
        .select("id")
        .eq("paystack_ref", reference)
        .single();

      if (existing) {
        return NextResponse.json({ received: true });
      }

      const items = metadata?.items ?? [];
      const subtotal = metadata?.subtotal ?? amount / 100;
      const shipping = metadata?.shipping ?? 0;
      const shippingAddress = metadata?.shipping_address ?? null;
      const userId = metadata?.user_id ?? null;
      const guestEmail = customer.email;
      const paymentMethod = metadata?.payment_method ?? "card";
      const discountCode = metadata?.discount_code ?? null;
      const discountAmount = metadata?.discount_amount ?? 0;

      // Create order
      const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
          user_id: userId,
          guest_email: guestEmail,
          status: "processing",
          subtotal,
          shipping,
          total: amount / 100,
          payment_method: paymentMethod,
          paystack_ref: reference,
          shipping_address: shippingAddress,
          discount_code: discountCode,
          discount_amount: discountAmount,
        })
        .select()
        .single();

      if (orderError || !order) {
        console.error("Order creation failed:", orderError);
        return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
      }

      // Increment discount code usage
      if (discountCode) {
        await supabaseAdmin.rpc("increment_discount_uses", { code_value: discountCode });
      }

      // Create order items
      if (items.length > 0) {
        const orderItems = items.map((item: { id: string; name: string; price: number; quantity: number; image?: string }) => ({
          order_id: order.id,
          product_id: item.id ?? null,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image ?? null,
        }));

        await supabaseAdmin.from("order_items").insert(orderItems);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}
