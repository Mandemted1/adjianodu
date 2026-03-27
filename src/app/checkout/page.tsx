"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Pencil, CreditCard, Smartphone } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase/client";

const SIDE_PADDING = "clamp(2rem, 6vw, 8rem)";

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#fff",
  border: "1px solid #e0e0e0",
  padding: "0.85rem 1rem",
  fontFamily: "var(--font-montserrat)",
  fontSize: "11px",
  fontWeight: 400,
  letterSpacing: "0.1em",
  color: "#000",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "9px",
  fontWeight: 500,
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  color: "#888",
  marginBottom: "0.4rem",
  display: "block",
};

export default function CheckoutPage() {
  const { items, subtotal } = useCart();

  const [userId, setUserId]     = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [form, setForm] = useState({
    email: "", phone: "", firstName: "", lastName: "",
    address: "", city: "", region: "", country: "Ghana", postal: "",
    shippingMethod: "standard",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) return;
      setUserId(user.id);
      setIsLoggedIn(true);
      setForm((f) => ({ ...f, email: user.email ?? "" }));
    });
  }, []);

  const [editingAddress, setEditingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "momo">("card");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const shippingCost = form.shippingMethod === "express" ? 50 : 20;
  const total = subtotal + shippingCost;

  const handlePay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPayError("");
    setPaying(true);

    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          amount: total,
          metadata: {
            subtotal,
            shipping: shippingCost,
            payment_method: paymentMethod,
            user_id: userId,
            shipping_address: {
              name: `${form.firstName} ${form.lastName}`,
              address: form.address,
              city: form.city,
              region: form.region,
              country: form.country,
            },
            items: items.map((i) => ({
              id: i.id,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
              image: i.image,
            })),
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPayError(data.error ?? "Payment failed. Please try again.");
        return;
      }

      // Redirect to Paystack hosted payment page
      window.location.href = data.authorization_url;
    } catch {
      setPayError("Something went wrong. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
        <Navbar />
        <p style={{ fontFamily: "var(--font-inria)", fontSize: "1.3rem", color: "#999" }}>Your bag is empty.</p>
        <Link href="/collections" style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", borderBottom: "1px solid black", paddingBottom: "2px" }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="adj-pad" style={{ flex: 1, paddingTop: "7rem", paddingBottom: "6rem", paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "3rem", alignItems: "center" }}>
          <Link href="/bag" style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", textDecoration: "underline" }}>Bag</Link>
          <span style={{ color: "#ccc" }}>›</span>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#000" }}>Checkout</span>
        </div>

        <div className="flex adj-stack" style={{ gap: "5rem", alignItems: "flex-start" }}>

          {/* LEFT — Order summary (desktop only) */}
          <div className="adj-full-w adj-desktop-only" style={{ width: "360px", flexShrink: 0 }}>
            <h2 style={{ fontFamily: "var(--font-inria)", fontSize: "1.3rem", fontWeight: 400, color: "#000", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid #e5e5e5" }}>
              Order Summary
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
              {items.map((item) => (
                <div key={item.id} className="flex" style={{ gap: "1rem", alignItems: "center" }}>
                  <div style={{ width: "70px", height: "80px", backgroundColor: "#e8e8e8", position: "relative", flexShrink: 0 }}>
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: "contain", padding: "0.4rem" }} sizes="70px" />
                    <span style={{ position: "absolute", top: "-8px", right: "-8px", backgroundColor: "#555", color: "#fff", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontFamily: "var(--font-montserrat)" }}>
                      {item.quantity}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#000" }}>{item.name}</div>
                    <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "2px" }}>{item.collection}</div>
                  </div>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#000" }}>GHS {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid #e5e5e5", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <div className="flex justify-between">
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#888" }}>Subtotal</span>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#000" }}>GHS {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#888" }}>Shipping</span>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#000" }}>GHS {shippingCost}</span>
              </div>
              <div className="flex justify-between" style={{ paddingTop: "0.6rem", borderTop: "1px solid #e5e5e5" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "#000" }}>Total</span>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 600, color: "#000" }}>GHS {total}</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Form */}
          <form onSubmit={handlePay} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2.5rem" }}>

            {/* Guest prompt — sign in to track orders */}
            {!isLoggedIn && (
              <div style={{ backgroundColor: "#f7f7f7", border: "1px solid #e5e5e5", padding: "1.2rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", color: "#000" }}>
                    Want to track your order?
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#888", letterSpacing: "0.06em", marginTop: "3px" }}>
                    Sign in or create a free account to track all your orders anytime.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
                  <Link href={`/account?redirect=/checkout`} style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "#000", border: "1px solid #000", padding: "0.5rem 1rem", textDecoration: "none" }}>
                    Sign In
                  </Link>
                  <Link href={`/account/register?redirect=/checkout`} style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "#fff", backgroundColor: "#000", padding: "0.5rem 1rem", textDecoration: "none" }}>
                    Create Account
                  </Link>
                </div>
              </div>
            )}

            {/* Logged-in note */}
            {isLoggedIn && (
              <div style={{ backgroundColor: "#f7f7f7", border: "1px solid #e5e5e5", padding: "1rem 1.5rem" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#555", letterSpacing: "0.08em" }}>
                  Your order will be saved to your account. You can track it anytime from{" "}
                  <Link href="/account/orders" style={{ color: "#000", textDecoration: "underline", textUnderlineOffset: "3px" }}>My Orders</Link>.
                </p>
              </div>
            )}

            {/* Contact — read-only if logged in */}
            <div>
              <h2 style={{ fontFamily: "var(--font-inria)", fontSize: "1.3rem", fontWeight: 400, color: "#000", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid #e5e5e5" }}>
                Contact
              </h2>
              {isLoggedIn ? (
                <div style={{ backgroundColor: "#f7f7f7", padding: "1rem", border: "1px solid #e0e0e0" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#000", letterSpacing: "0.05em" }}>{form.email}</p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#888", letterSpacing: "0.05em", marginTop: "4px" }}>{form.phone}</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div><label style={labelStyle}>Email</label><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="your@email.com" required style={inputStyle} /></div>
                  <div><label style={labelStyle}>Phone</label><input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+233 XX XXX XXXX" required style={inputStyle} /></div>
                </div>
              )}
            </div>

            {/* Shipping address */}
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid #e5e5e5" }}>
                <h2 style={{ fontFamily: "var(--font-inria)", fontSize: "1.3rem", fontWeight: 400, color: "#000" }}>
                  Shipping Address
                </h2>
                {isLoggedIn && (
                  <button type="button" onClick={() => setEditingAddress(!editingAddress)}
                    style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", color: "#555" }}>
                    <Pencil size={12} strokeWidth={1.5} />
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                      {editingAddress ? "Done" : "Edit"}
                    </span>
                  </button>
                )}
              </div>

              {/* Show saved address when not editing */}
              {isLoggedIn && !editingAddress ? (
                <div style={{ backgroundColor: "#f7f7f7", padding: "1rem", border: "1px solid #e0e0e0", display: "flex", flexDirection: "column", gap: "3px" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#000", letterSpacing: "0.05em" }}>{form.firstName} {form.lastName}</p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#888", letterSpacing: "0.05em" }}>{form.address}</p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#888", letterSpacing: "0.05em" }}>{form.city}, {form.region}</p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#888", letterSpacing: "0.05em" }}>{form.country}</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div className="adj-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div><label style={labelStyle}>First Name</label><input type="text" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required style={inputStyle} /></div>
                    <div><label style={labelStyle}>Last Name</label><input type="text" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required style={inputStyle} /></div>
                  </div>
                  <div><label style={labelStyle}>Address</label><input type="text" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Street address" required style={inputStyle} /></div>
                  <div className="adj-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div><label style={labelStyle}>City</label><input type="text" value={form.city} onChange={(e) => update("city", e.target.value)} required style={inputStyle} /></div>
                    <div><label style={labelStyle}>Region</label><input type="text" value={form.region} onChange={(e) => update("region", e.target.value)} required style={inputStyle} /></div>
                  </div>
                  <div className="adj-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <label style={labelStyle}>Country</label>
                      <div style={{ position: "relative" }}>
                        <select value={form.country} onChange={(e) => update("country", e.target.value)} style={{ ...inputStyle, appearance: "none", paddingRight: "2rem", cursor: "pointer" }}>
                          <option>Ghana</option><option>Nigeria</option><option>United Kingdom</option>
                          <option>United States</option><option>Canada</option><option>France</option><option>Other</option>
                        </select>
                        <ChevronDown size={13} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#888" }} />
                      </div>
                    </div>
                    <div><label style={labelStyle}>Postal Code</label><input type="text" value={form.postal} onChange={(e) => update("postal", e.target.value)} style={inputStyle} /></div>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping method */}
            <div>
              <h2 style={{ fontFamily: "var(--font-inria)", fontSize: "1.3rem", fontWeight: 400, color: "#000", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid #e5e5e5" }}>
                Shipping Method
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { value: "standard", label: "Standard Delivery", sub: "3–5 business days", price: "GHS 20" },
                  { value: "express",  label: "Express Delivery",  sub: "1–2 business days", price: "GHS 50" },
                ].map((opt) => (
                  <label key={opt.value} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", border: `1px solid ${form.shippingMethod === opt.value ? "#000" : "#e0e0e0"}`, cursor: "pointer", backgroundColor: form.shippingMethod === opt.value ? "#fafafa" : "#fff" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <input type="radio" name="shipping" value={opt.value} checked={form.shippingMethod === opt.value} onChange={() => update("shippingMethod", opt.value)} style={{ accentColor: "#000" }} />
                      <div>
                        <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", color: "#000" }}>{opt.label}</div>
                        <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", color: "#888", letterSpacing: "0.08em", marginTop: "2px" }}>{opt.sub}</div>
                      </div>
                    </div>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#000" }}>{opt.price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order summary — mobile only, shown before payment */}
            <div className="adj-mobile-only" style={{ flexDirection: "column", borderTop: "1px solid #e5e5e5", paddingTop: "1.5rem" }}>
              <h2 style={{ fontFamily: "var(--font-inria)", fontSize: "1.3rem", fontWeight: 400, color: "#000", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid #e5e5e5" }}>
                Order Summary
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div style={{ width: "60px", height: "70px", backgroundColor: "#e8e8e8", position: "relative", flexShrink: 0 }}>
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: "contain", padding: "0.4rem" }} sizes="60px" />
                      <span style={{ position: "absolute", top: "-8px", right: "-8px", backgroundColor: "#555", color: "#fff", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontFamily: "var(--font-montserrat)" }}>
                        {item.quantity}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#000" }}>{item.name}</div>
                      <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "2px" }}>{item.collection}</div>
                    </div>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#000" }}>GHS {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid #e5e5e5", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#888" }}>Subtotal</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#000" }}>GHS {subtotal}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#888" }}>Shipping</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#000" }}>GHS {shippingCost}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.6rem", borderTop: "1px solid #e5e5e5" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "#000" }}>Total</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 600, color: "#000" }}>GHS {total}</span>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div>
              <h2 style={{ fontFamily: "var(--font-inria)", fontSize: "1.3rem", fontWeight: 400, color: "#000", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid #e5e5e5" }}>
                Payment Method
              </h2>
              <div className="adj-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {[
                  { value: "card", label: "Pay by Card", icon: <CreditCard size={18} strokeWidth={1.5} /> },
                  { value: "momo", label: "Mobile Money", icon: <Smartphone size={18} strokeWidth={1.5} /> },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPaymentMethod(opt.value as "card" | "momo")}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "1.25rem",
                      border: `1px solid ${paymentMethod === opt.value ? "#000" : "#e0e0e0"}`,
                      backgroundColor: paymentMethod === opt.value ? "#fafafa" : "#fff",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ color: paymentMethod === opt.value ? "#000" : "#888" }}>{opt.icon}</span>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: paymentMethod === opt.value ? "#000" : "#888" }}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pay now button */}
            {payError && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#c00", letterSpacing: "0.06em", textAlign: "center" }}>
                {payError}
              </p>
            )}
            <button
              type="submit"
              disabled={paying}
              style={{
                width: "100%",
                backgroundColor: paying ? "#555" : "#000",
                color: "#fff",
                padding: "1.1rem",
                fontFamily: "var(--font-montserrat)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                border: "none",
                cursor: paying ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
              }}
            >
              {paying ? "Redirecting to Paystack..." : `Pay Now — GHS ${total}`}
            </button>

            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", color: "#aaa", letterSpacing: "0.08em", textAlign: "center", marginTop: "-1rem" }}>
              Secured by Paystack
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}
