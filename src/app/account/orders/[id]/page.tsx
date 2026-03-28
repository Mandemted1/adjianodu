"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/client";

import type { Order, OrderStatus } from "@/lib/types";

const statusColor: Record<OrderStatus, string> = {
  processing:  "#e65100",
  in_transit:  "#1565c0",
  delivered:   "#2e7d32",
  cancelled:   "#c62828",
};

const statusLabel: Record<OrderStatus, string> = {
  processing:  "Processing",
  in_transit:  "In Transit",
  delivered:   "Delivered",
  cancelled:   "Cancelled",
};

const steps: OrderStatus[] = ["processing", "in_transit", "delivered"];

const SIDE = "clamp(3rem, 8vw, 10rem)";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router  = useRouter();

  const [order, setOrder]     = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace(`/account?redirect=/account/orders/${id}`); return; }

      const res = await fetch(`/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) { setNotFound(true); setLoading(false); return; }
      const data: Order = await res.json();
      setOrder(data);
      setLoading(false);
    })();
  }, [id, router]);

  if (loading) return null;

  if (notFound) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "8rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#888", letterSpacing: "0.1em" }}>Order not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const stepIndex = order ? steps.indexOf(order.status) : -1;
  const subtotal  = order ? order.total - order.shipping : 0;
  const addr      = order?.shipping_address;
  const shortId   = `#${order!.id.slice(0, 8).toUpperCase()}`;
  const dateStr   = new Date(order!.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="adj-pad" style={{ flex: 1, paddingTop: "8rem", paddingBottom: "6rem", paddingLeft: SIDE, paddingRight: SIDE }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "2.5rem" }}>
          <Link href="/account/orders" style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#888", textDecoration: "none" }}>
            My Orders
          </Link>
          <ChevronRight size={10} color="#bbb" strokeWidth={1.5} />
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#000" }}>
            {shortId}
          </span>
        </div>

        {/* Heading + status */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "3rem", paddingBottom: "1.5rem", borderBottom: "1px solid #e5e5e5", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 400, color: "#000", marginBottom: "0.4rem" }}>
              Order {shortId}
            </h1>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#888", letterSpacing: "0.08em" }}>
              Placed on {dateStr}
            </p>
          </div>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: statusColor[order!.status], backgroundColor: `${statusColor[order!.status]}15`, padding: "6px 14px" }}>
            {statusLabel[order!.status]}
          </span>
        </div>

        {/* Progress tracker */}
        {order!.status !== "cancelled" && (
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              {steps.map((step, i) => {
                const done   = i <= stepIndex;
                const isLast = i === steps.length - 1;
                return (
                  <div key={step} style={{ display: "flex", alignItems: "center", flex: isLast ? 0 : 1 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: done ? "#000" : "#e0e0e0", border: "2px solid", borderColor: done ? "#000" : "#e0e0e0" }} />
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: done ? "#000" : "#bbb", whiteSpace: "nowrap" }}>
                        {statusLabel[step]}
                      </span>
                    </div>
                    {!isLast && (
                      <div style={{ flex: 1, height: 1, backgroundColor: i < stepIndex ? "#000" : "#e0e0e0", margin: "0 0.5rem", marginBottom: "1.3rem" }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex adj-stack" style={{ gap: "4rem", alignItems: "flex-start" }}>

          {/* Left: items */}
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", marginBottom: "1.25rem" }}>
              Items
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {(order!.order_items ?? []).map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#000" }}>
                      {item.name}{item.quantity > 1 ? ` × ${item.quantity}` : ""}
                    </span>
                  </div>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#000" }}>
                    GHS {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: summary + address */}
          <div className="adj-full-w" style={{ width: "320px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "2rem" }}>

            {/* Order summary */}
            <div style={{ backgroundColor: "#f7f7f7", padding: "1.5rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", marginBottom: "1rem" }}>
                Order Summary
              </p>
              {[
                { label: "Subtotal", value: `GHS ${subtotal}` },
                { label: "Shipping", value: `GHS ${order!.shipping}` },
                { label: "Payment",  value: order!.payment_method ?? "—" },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#888", letterSpacing: "0.06em" }}>{row.label}</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#000" }}>{row.value}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #e5e5e5", paddingTop: "0.75rem", marginTop: "0.5rem", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#000" }}>Total</span>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 600, color: "#000" }}>GHS {order!.total}</span>
              </div>
            </div>

            {/* Shipping address */}
            {addr && (
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", marginBottom: "0.75rem" }}>
                  Shipping Address
                </p>
                {[addr.name, addr.address, `${addr.city}, ${addr.region}`, addr.country].filter(Boolean).map((line) => (
                  <p key={line} style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#555", lineHeight: 1.8, letterSpacing: "0.04em" }}>{line}</p>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Back link */}
        <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid #e5e5e5" }}>
          <Link href="/account/orders" style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#888", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            ← Back to My Orders
          </Link>
        </div>

      </div>
      <Footer />
    </div>
  );
}
