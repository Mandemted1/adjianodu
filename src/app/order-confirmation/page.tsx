"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase/client";

import type { Order } from "@/lib/types";

export default function OrderConfirmationPage() {
  const searchParams            = useSearchParams();
  const reference               = searchParams.get("reference") ?? "";
  const { clearCart }           = useCart();
  const cartCleared             = useRef(false);

  const [order, setOrder]       = useState<Order | null>(null);
  const [isGuest, setIsGuest]   = useState(false);
  const [loading, setLoading]   = useState(true);

  // Clear cart once
  useEffect(() => {
    if (!cartCleared.current) {
      clearCart();
      cartCleared.current = true;
    }
  }, [clearCart]);

  // Fetch order by paystack reference
  useEffect(() => {
    if (!reference) { setLoading(false); return; }

    (async () => {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();

      const res = await fetch(`/api/orders/by-reference?reference=${encodeURIComponent(reference)}`);
      if (res.ok) {
        const data: Order = await res.json();
        setOrder(data);
        setIsGuest(!user || data.user_id !== user.id);
      }
      setLoading(false);
    })();
  }, [reference]);

  const SIDE = "clamp(3rem, 8vw, 10rem)";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="adj-pad flex-1 flex flex-col items-center justify-center" style={{ paddingTop: "8rem", paddingBottom: "6rem", paddingLeft: SIDE, paddingRight: SIDE }}>

        <div style={{ maxWidth: "540px", width: "100%", textAlign: "center" }}>

          {/* Icon */}
          <CheckCircle size={48} strokeWidth={1} color="#000" style={{ marginBottom: "2rem" }} />

          {/* Heading */}
          <h1 style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, color: "#000", lineHeight: 1.2, marginBottom: "1rem" }}>
            Order Confirmed
          </h1>

          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#555", lineHeight: 1.9, letterSpacing: "0.04em", marginBottom: "2.5rem" }}>
            Thank you for your order. We&apos;ve received your payment and are getting everything ready for you.
          </p>

          {/* Reference / Order box */}
          {!loading && (
            <div style={{ backgroundColor: "#f2f2f2", padding: "1.5rem 2rem", marginBottom: "2.5rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", marginBottom: "0.5rem" }}>
                Payment Reference
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.12em", color: "#000" }}>
                {reference || "—"}
              </p>
              {order && (
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#555", marginTop: "0.5rem" }}>
                  Total paid: GHS {order.total}
                </p>
              )}
            </div>
          )}

          {/* Guest note */}
          {!loading && isGuest && order?.guest_email && (
            <div style={{ border: "1px solid #e5e5e5", padding: "1.25rem 1.5rem", marginBottom: "2.5rem", textAlign: "left" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#555", lineHeight: 1.8, letterSpacing: "0.04em" }}>
                A confirmation has been sent to <strong style={{ color: "#000" }}>{order.guest_email}</strong>.
                Use your payment reference to track your order at any time.
              </p>
            </div>
          )}

          {/* CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {isGuest ? (
              <Link
                href="/track-order"
                style={{ display: "block", width: "100%", padding: "1rem", backgroundColor: "#000", color: "#fff", fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", textDecoration: "none", textAlign: "center" }}
              >
                Track My Order
              </Link>
            ) : (
              <Link
                href="/account/orders"
                style={{ display: "block", width: "100%", padding: "1rem", backgroundColor: "#000", color: "#fff", fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", textDecoration: "none", textAlign: "center" }}
              >
                View My Orders
              </Link>
            )}
            <Link
              href="/collections"
              style={{ display: "block", width: "100%", padding: "1rem", backgroundColor: "transparent", color: "#000", fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", textDecoration: "none", textAlign: "center", border: "1px solid #000" }}
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
