"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/client";

import type { Order, OrderStatus } from "@/lib/types";

const statusLabel: Record<OrderStatus, string> = {
  processing:  "Processing",
  in_transit:  "In Transit",
  delivered:   "Delivered",
  cancelled:   "Cancelled",
};

const statusColor: Record<OrderStatus, string> = {
  processing:  "#e65100",
  in_transit:  "#1565c0",
  delivered:   "#2e7d32",
  cancelled:   "#c62828",
};

const statusSteps: OrderStatus[] = ["processing", "in_transit", "delivered"];

const stepLabel: Record<string, string> = {
  processing: "Processing",
  in_transit: "In Transit",
  delivered:  "Delivered",
};

export default function TrackOrderPage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setLoggedIn(true);
        router.replace("/account/orders");
      } else {
        setLoggedIn(false);
      }
    });
  }, [router]);

  const [reference, setReference] = useState("");
  const [email, setEmail]         = useState("");
  const [result, setResult]       = useState<Order | null>(null);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [searched, setSearched]   = useState(false);

  if (loggedIn === null || loggedIn === true) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: reference.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No order found with that reference and email. Please check and try again.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = result ? statusSteps.indexOf(result.status) : -1;

  const shippingLine = result?.shipping_address
    ? [result.shipping_address.address, result.shipping_address.city, result.shipping_address.region].filter(Boolean).join(", ")
    : null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="adj-pad" style={{ flex: 1, paddingTop: "8rem", paddingBottom: "6rem", paddingLeft: "clamp(3rem, 8vw, 10rem)", paddingRight: "clamp(3rem, 8vw, 10rem)" }}>

        {/* Header */}
        <div style={{ borderBottom: "1px solid #e5e5e5", paddingBottom: "1.5rem", marginBottom: "3rem" }}>
          <h1 style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 400, color: "#000" }}>
            Track Your Order
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#888", letterSpacing: "0.08em", marginTop: "0.5rem" }}>
            Enter your Paystack payment reference and email address from your confirmation email.
          </p>
        </div>

        {/* Search form */}
        <div style={{ maxWidth: "560px", marginBottom: "3rem" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <label style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#888", marginBottom: "0.4rem", display: "block" }}>
                Payment Reference
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. ADJ_1234567890"
                required
                style={{ width: "100%", backgroundColor: "#fff", border: "1px solid #e0e0e0", padding: "0.85rem 1rem", fontFamily: "var(--font-montserrat)", fontSize: "11px", letterSpacing: "0.1em", color: "#000", outline: "none" }}
              />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#888", marginBottom: "0.4rem", display: "block" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email used at checkout"
                required
                style={{ width: "100%", backgroundColor: "#fff", border: "1px solid #e0e0e0", padding: "0.85rem 1rem", fontFamily: "var(--font-montserrat)", fontSize: "11px", letterSpacing: "0.1em", color: "#000", outline: "none" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", backgroundColor: "#000", color: "#fff", padding: "1rem", fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, marginTop: "0.5rem" }}
            >
              <Search size={13} strokeWidth={1.5} />
              {loading ? "Searching..." : "Track Order"}
            </button>
          </form>
        </div>

        {/* Error */}
        {searched && error && (
          <div style={{ maxWidth: "560px", backgroundColor: "#fff5f5", border: "1px solid #ffcccc", padding: "1rem 1.25rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#c62828", letterSpacing: "0.08em" }}>{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{ maxWidth: "720px", border: "1px solid #e5e5e5", padding: "2rem" }}>

            {/* Order meta */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", paddingBottom: "1.25rem", borderBottom: "1px solid #f0f0f0" }}>
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", color: "#000" }}>
                  Ref: {result.paystack_ref}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#888", letterSpacing: "0.08em", marginTop: "4px" }}>
                  Placed on {new Date(result.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                {shippingLine && (
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#888", letterSpacing: "0.08em", marginTop: "2px" }}>
                    Shipping to: {shippingLine}
                  </p>
                )}
              </div>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: statusColor[result.status], backgroundColor: `${statusColor[result.status]}15`, padding: "4px 12px" }}>
                {statusLabel[result.status]}
              </span>
            </div>

            {/* Progress tracker */}
            {result.status !== "cancelled" && (
              <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {statusSteps.map((step, i) => {
                    const done   = i <= currentStep;
                    const active = i === currentStep;
                    return (
                      <div key={step} style={{ display: "flex", alignItems: "center", flex: i < statusSteps.length - 1 ? 1 : "none" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: done ? "#000" : "#e0e0e0", border: active ? "2px solid #000" : "none", flexShrink: 0 }} />
                          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "8px", letterSpacing: "0.12em", textTransform: "uppercase", color: done ? "#000" : "#bbb", whiteSpace: "nowrap" }}>
                            {stepLabel[step]}
                          </span>
                        </div>
                        {i < statusSteps.length - 1 && (
                          <div style={{ flex: 1, height: "1px", backgroundColor: i < currentStep ? "#000" : "#e0e0e0", margin: "0 8px", marginBottom: "20px" }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Items */}
            {result.order_items && result.order_items.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.25rem" }}>
                {result.order_items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "#000" }}>{item.name}</span>
                      {item.quantity > 1 && <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#aaa" }}>× {item.quantity}</span>}
                    </div>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#000" }}>GHS {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "0.75rem", borderTop: "1px solid #f0f0f0" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", color: "#000" }}>
                Total: GHS {result.total}
              </span>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
