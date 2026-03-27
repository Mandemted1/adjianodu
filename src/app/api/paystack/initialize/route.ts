import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, amount, metadata } = await req.json();

    if (!email || !amount) {
      return NextResponse.json({ error: "email and amount are required" }, { status: 400 });
    }

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Paystack expects pesewas (kobo)
        currency: "GHS",
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-confirmation`,
        metadata,
      }),
    });

    const data = await res.json();

    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    return NextResponse.json({ authorization_url: data.data.authorization_url, reference: data.data.reference });
  } catch {
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
  }
}
