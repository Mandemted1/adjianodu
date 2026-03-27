"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ChevronLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";

const SIDE_PADDING = "clamp(3rem, 8vw, 10rem)";

export default function BagPage() {
  const { items, removeItem, updateQty, clearCart, subtotal } = useCart();
  const total = subtotal; // shipping calculated at checkout

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="adj-pad" style={{ flex: 1, paddingTop: "8rem", paddingBottom: "6rem", paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING }}>

        {/* Page heading */}
        <div style={{ borderBottom: "1px solid #e5e5e5", paddingBottom: "1.5rem", marginBottom: "3rem" }}>
          <Link
            href="/collections"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font-montserrat)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#888", textDecoration: "none", marginBottom: "1rem" }}
          >
            <ChevronLeft size={12} strokeWidth={1.5} />
            Continue Shopping
          </Link>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <h1 style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 400, color: "#000" }}>
              Your Bag
            </h1>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-montserrat)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#aaa", textDecoration: "underline", textUnderlineOffset: "3px", paddingBottom: "0.5rem" }}
              >
                Remove All
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center" style={{ paddingTop: "6rem", paddingBottom: "6rem", gap: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-inria)", fontSize: "1.3rem", fontWeight: 400, color: "#999" }}>
              Your bag is empty.
            </p>
            <Link
              href="/collections"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#000",
                borderBottom: "1px solid black",
                paddingBottom: "2px",
              }}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex adj-stack" style={{ gap: "4rem", alignItems: "flex-start" }}>

            {/* Items list */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0" }}>
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className="flex"
                  style={{
                    gap: "1.5rem",
                    paddingTop: "1.5rem",
                    paddingBottom: "1.5rem",
                    borderBottom: "1px solid #e5e5e5",
                    borderTop: i === 0 ? "1px solid #e5e5e5" : "none",
                    alignItems: "center",
                  }}
                >
                  {/* Product image */}
                  <div style={{ width: "110px", height: "130px", backgroundColor: "#e8e8e8", position: "relative", flexShrink: 0 }}>
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: "contain", padding: "0.5rem" }} sizes="110px" />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#000" }}>
                      {item.name}
                    </span>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.1em", color: "#888" }}>
                      {item.collection}
                    </span>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 400, color: "#000", marginTop: "0.4rem" }}>
                      GHS {item.price}
                    </span>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center" style={{ gap: "0.75rem", border: "1px solid #e0e0e0", padding: "0.4rem 0.75rem" }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ background: "none", border: "none", cursor: "pointer", color: "#000", display: "flex" }}>
                      <Minus size={12} strokeWidth={1.5} />
                    </button>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 400, minWidth: "1rem", textAlign: "center" }}>
                      {item.quantity}
                    </span>
                    <button onClick={() => updateQty(item.id, 1)} style={{ background: "none", border: "none", cursor: "pointer", color: "#000", display: "flex" }}>
                      <Plus size={12} strokeWidth={1.5} />
                    </button>
                  </div>

                  {/* Line total */}
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 500, color: "#000", minWidth: "80px", textAlign: "right" }}>
                    GHS {item.price * item.quantity}
                  </span>

                  {/* Remove */}
                  <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", display: "flex" }} aria-label="Remove item">
                    <X size={15} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="adj-full-w" style={{ width: "320px", flexShrink: 0, backgroundColor: "#f2f2f2", padding: "2rem" }}>
              <h2 style={{ fontFamily: "var(--font-inria)", fontSize: "1.2rem", fontWeight: 400, color: "#000", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid #ddd" }}>
                Order Summary
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div className="flex justify-between">
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#555" }}>Subtotal</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#000" }}>GHS {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#555" }}>Shipping</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#000" }}>Calculated at checkout</span>
                </div>
                <div className="flex justify-between" style={{ paddingTop: "0.75rem", borderTop: "1px solid #ddd" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "#000" }}>Total</span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 600, color: "#000" }}>GHS {total}</span>
                </div>
              </div>

              {/* Checkout button */}
              <Link
                href="/checkout"
                style={{
                  display: "block",
                  width: "100%",
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "1rem",
                  textAlign: "center",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  marginBottom: "1rem",
                }}
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/collections"
                style={{
                  display: "block",
                  textAlign: "center",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "10px",
                  fontWeight: 400,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#888",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                Continue Shopping
              </Link>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
