"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/client";
import type { Order } from "@/lib/types";

const statusColor: Record<string, string> = {
  delivered: "#2e7d32",
  in_transit: "#1565c0",
  processing: "#e65100",
  cancelled: "#c62828",
};

const statusLabel: Record<string, string> = {
  delivered: "Delivered",
  in_transit: "In Transit",
  processing: "Processing",
  cancelled: "Cancelled",
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.replace("/account?redirect=/account/orders"); return; }
      const { data: rows } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false });
      setOrders(rows ?? []);
      setLoading(false);
    });
  }, [router]);

  if (loading) return null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="adj-pad" style={{ flex: 1, paddingTop: "8rem", paddingBottom: "6rem", paddingLeft: "clamp(3rem, 8vw, 10rem)", paddingRight: "clamp(3rem, 8vw, 10rem)" }}>

        {/* Header */}
        <div style={{ borderBottom: "1px solid #e5e5e5", paddingBottom: "1.5rem", marginBottom: "3rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 400, color: "#000" }}>
            My Orders
          </h1>
          <Link
            href="/account"
            style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#888", textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            My Account
          </Link>
        </div>

        {orders.length === 0 ? (
          /* Empty state */
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "6rem", gap: "1.5rem" }}>
            <Package size={40} strokeWidth={1} color="#ccc" />
            <p style={{ fontFamily: "var(--font-inria)", fontSize: "1.2rem", color: "#999" }}>You have no orders yet.</p>
            <Link href="/collections" style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", borderBottom: "1px solid black", paddingBottom: "2px" }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {orders.map((order) => (
              <div key={order.id} style={{ border: "1px solid #e5e5e5", padding: "1.5rem 2rem" }}>
                {/* Order header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", paddingBottom: "1rem", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", color: "#000" }}>
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#888", letterSpacing: "0.08em" }}>
                      Placed on {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: statusColor[order.status] ?? "#555", backgroundColor: `${statusColor[order.status] ?? "#555"}15`, padding: "4px 10px" }}>
                      {statusLabel[order.status] ?? order.status}
                    </span>
                    <Link href={`/account/orders/${order.id}`} style={{ display: "flex", alignItems: "center", gap: "4px", fontFamily: "var(--font-montserrat)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#000", textDecoration: "none" }}>
                      View <ChevronRight size={12} strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>

                {/* Items list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {(order.order_items ?? []).map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "#000" }}>
                          {item.name}
                        </span>
                        {item.quantity > 1 && (
                          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#aaa" }}>× {item.quantity}</span>
                        )}
                      </div>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#000" }}>
                        GHS {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order total */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid #f0f0f0" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", color: "#000" }}>
                    Total: GHS {order.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
