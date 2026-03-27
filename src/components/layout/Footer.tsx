"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const supportLinks = [
  { label: "Track Order",     href: "/track-order" },
  { label: "Shipping & Taxes", href: "#" },
  { label: "Make a Return",   href: "#" },
  { label: "Help & Questions", href: "#" },
];
const legalLinks = [
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy",     href: "#" },
];
const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "YouTube",   href: "#" },
  { label: "Snapchat",  href: "#" },
  { label: "TikTok",    href: "#" },
  { label: "X",         href: "#" },
];

const linkStyle = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "10px",
  fontWeight: 400,
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  color: "#000",
  textDecoration: "none",
};

const headingStyle = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "9px",
  fontWeight: 600,
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: "#aaa",
  marginBottom: "0.9rem",
};

export default function Footer() {
  const [email, setEmail]     = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  const sidePad = "clamp(1.5rem, 5vw, 3rem)";

  return (
    <footer style={{ backgroundColor: "#fff", paddingTop: "6rem" }}>

      {/* Newsletter */}
      <div style={{ padding: `0 ${sidePad} 4rem` }}>
        <h2 style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(1.3rem, 2.5vw, 2rem)", fontWeight: 400, lineHeight: 1.3, marginBottom: "2.5rem", maxWidth: "700px", color: "#000" }}>
          Be the first to discover the latest news, collections, and exclusive launches
        </h2>
        <form onSubmit={handleConfirm}>
          <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR EMAIL"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.18em", color: "#000" }}
            />
            <button
              type="submit"
              style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", paddingBottom: "1px", background: "none", border: "none", borderBottom: "1px solid #000", cursor: "pointer", color: "#000" }}
            >
              Confirm
            </button>
          </div>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1.8, color: "#888" }}>
            By confirming my subscription, I agree to receive the newsletter.{" "}
            For more information, read the{" "}
            <Link href="/privacy-policy" style={{ color: "#888", textDecoration: "underline" }}>Privacy Policy</Link>.
          </p>
        </form>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #e5e5e5", margin: `0 ${sidePad}` }} />

      {/* Links */}
      {isMobile ? (
        /* ── Mobile: 2-column layout with headings ── */
        <div style={{ padding: `2rem ${sidePad}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {/* Left: Support + Legal */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <p style={headingStyle}>Support</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                {supportLinks.map((l) => (
                  <Link key={l.label} href={l.href} style={linkStyle}>{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p style={headingStyle}>Legal</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                {legalLinks.map((l) => (
                  <Link key={l.label} href={l.href} style={linkStyle}>{l.label}</Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Socials */}
          <div>
            <p style={headingStyle}>Follow Us</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              {socialLinks.map((l) => (
                <Link key={l.label} href={l.href} style={linkStyle}>{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── Desktop: 3 columns ── */
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: `3rem ${sidePad}`, gap: "2rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {supportLinks.map((l) => (
              <Link key={l.label} href={l.href} style={linkStyle} className="hover:opacity-50 transition-opacity">{l.label}</Link>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {legalLinks.map((l) => (
              <Link key={l.label} href={l.href} style={linkStyle} className="hover:opacity-50 transition-opacity">{l.label}</Link>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {socialLinks.map((l) => (
              <Link key={l.label} href={l.href} style={linkStyle} className="hover:opacity-50 transition-opacity">{l.label}</Link>
            ))}
          </div>
        </div>
      )}

      {/* Copyright */}
      <div style={{ borderTop: "1px solid #e5e5e5" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", letterSpacing: "0.12em", padding: "1.5rem", textAlign: "center", color: "#aaa" }}>
          ©adjiano 2026
        </p>
      </div>

    </footer>
  );
}
