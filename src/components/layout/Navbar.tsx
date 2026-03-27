"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, ShoppingBag, X, Menu, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase/client";

interface NavbarProps {
  hasHero?: boolean;
}

export default function Navbar({ hasHero = false }: NavbarProps) {
  const router                    = useRouter();
  const [pastHero, setPastHero]   = useState(!hasHero);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [isMobile, setIsMobile]   = useState(false);
  const [query, setQuery]         = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { count: bagCount, clearCart } = useCart();

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll detection for hero pages
  useEffect(() => {
    if (!hasHero) return;
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasHero]);

  // Lock body scroll when any overlay is open
  useEffect(() => {
    document.body.style.overflow = searchOpen || menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen, menuOpen]);

  // Auth state
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearCart();
    setMenuOpen(false);
    router.push("/");
  };

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  const active     = pastHero || searchOpen || menuOpen;
  const textColor  = active ? "#000" : "#fff";
  const bg         = active ? "rgba(255,255,255,0.95)" : "transparent";
  const linkClass  = `hover:opacity-50 transition-all duration-300`;

  const navLinkStyle = {
    fontFamily: "var(--font-montserrat)",
    fontSize: "10px",
    letterSpacing: "0.22em",
    textTransform: "uppercase" as const,
    fontWeight: 400,
    color: textColor,
    textDecoration: "none",
    whiteSpace: "nowrap" as const,
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: bg,
          backdropFilter: active ? "blur(8px)" : "none",
          borderBottom: active ? "1px solid #e5e5e5" : "none",
        }}
      >
        <div
          style={{
            paddingLeft: "clamp(1.25rem, 8vw, 10rem)",
            paddingRight: "clamp(1.25rem, 8vw, 10rem)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: isMobile ? "56px" : "80px" }}>

            {/* ── LEFT ── */}
            {isMobile ? (
              /* Mobile: hamburger */
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}
              >
                <Menu size={22} strokeWidth={1.5} color={textColor} />
              </button>
            ) : (
              /* Desktop: nav links */
              <div style={{ display: "flex", alignItems: "center", gap: "3.5rem" }}>
                <Link href="/collections" className={linkClass} style={navLinkStyle}>Collections</Link>
                <Link href="/bestsellers" className={linkClass} style={navLinkStyle}>Bestsellers</Link>
              </div>
            )}

            {/* ── CENTER: logo ── */}
            <Link
              href="/"
              className={linkClass}
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "var(--font-montserrat)",
                fontSize: isMobile ? "0.8rem" : "1rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: textColor,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              ADJIANO
            </Link>

            {/* ── RIGHT ── */}
            {isMobile ? (
              /* Mobile: bag only */
              <Link
                href="/bag"
                className={linkClass}
                style={{ position: "relative", display: "flex", alignItems: "center", color: textColor }}
              >
                <ShoppingBag size={22} strokeWidth={1.5} />
                {bagCount > 0 && (
                  <span style={{ position: "absolute", top: "-6px", right: "-6px", backgroundColor: "#000", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontFamily: "var(--font-montserrat)", fontWeight: 600 }}>
                    {bagCount}
                  </span>
                )}
              </Link>
            ) : (
              /* Desktop: search + account + bag */
              <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
                <button
                  onClick={() => setSearchOpen(true)}
                  className={linkClass}
                  style={{ ...navLinkStyle, display: "flex", alignItems: "center", gap: "0.375rem", background: "none", border: "none", cursor: "pointer" }}
                  aria-label="Search"
                >
                  <Search size={12} strokeWidth={1.5} />
                  <span>Search</span>
                </button>
                <Link href={isLoggedIn ? "/account/orders" : "/account"} className={linkClass} style={{ ...navLinkStyle, display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <User size={12} strokeWidth={1.5} />
                  <span>{isLoggedIn ? "My Orders" : "Account"}</span>
                </Link>
                {isLoggedIn && (
                  <button onClick={handleSignOut} className={linkClass} style={{ ...navLinkStyle, display: "flex", alignItems: "center", gap: "0.375rem", background: "none", border: "none", cursor: "pointer" }}>
                    <LogOut size={12} strokeWidth={1.5} />
                    <span>Sign Out</span>
                  </button>
                )}
                <Link href="/bag" className={linkClass} style={{ ...navLinkStyle, display: "flex", alignItems: "center", gap: "0.375rem", position: "relative" }}>
                  <ShoppingBag size={12} strokeWidth={1.5} />
                  <span>Bag</span>
                  {bagCount > 0 && (
                    <span style={{ position: "absolute", top: "-8px", right: "-8px", backgroundColor: "#000", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontFamily: "var(--font-montserrat)", fontWeight: 600 }}>
                      {bagCount}
                    </span>
                  )}
                </Link>
              </div>
            )}

          </div>
        </div>
      </nav>

      {/* ── Mobile full-screen menu ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white" style={{ display: "flex", flexDirection: "column" }}>
          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid #e5e5e5" }}>
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.4em", textTransform: "uppercase", color: "#000", textDecoration: "none" }}
            >
              ADJIANO
            </Link>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={22} strokeWidth={1.5} color="#000" />
            </button>
          </div>

          {/* Links */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "1.5rem 1.25rem" }}>
            {[
              { label: "Collections", href: "/collections" },
              { label: "Bestsellers", href: "/bestsellers" },
              { label: isLoggedIn ? "My Orders" : "Account", href: isLoggedIn ? "/account/orders" : "/account" },
              { label: "Track Order", href: "/track-order" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(1.5rem, 6vw, 2rem)", fontWeight: 400, color: "#000", textDecoration: "none", padding: "0.85rem 0", borderBottom: "1px solid #f0f0f0", display: "block" }}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
              style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(1.5rem, 6vw, 2rem)", fontWeight: 400, color: "#000", padding: "0.85rem 0", borderBottom: "1px solid #f0f0f0", borderTop: "none", borderLeft: "none", borderRight: "none", background: "none", cursor: "pointer", textAlign: "left", width: "100%", display: "block" }}
            >
              Search
            </button>
            {isLoggedIn && (
              <button
                onClick={handleSignOut}
                style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(1.5rem, 6vw, 2rem)", fontWeight: 400, color: "#c00", padding: "0.85rem 0", borderBottom: "1px solid #f0f0f0", borderTop: "none", borderLeft: "none", borderRight: "none", background: "none", cursor: "pointer", textAlign: "left", width: "100%", display: "block" }}
              >
                Sign Out
              </button>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: "1.25rem", borderTop: "1px solid #e5e5e5" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#bbb" }}>©adjiano 2026</p>
          </div>
        </div>
      )}

      {/* ── Search overlay ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-40">
          <div className="bg-white" style={{ paddingTop: "5rem", paddingBottom: "2.5rem", paddingLeft: "clamp(1.25rem, 8vw, 10rem)", paddingRight: "clamp(1.25rem, 8vw, 10rem)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2.5rem" }}>
              <h2 style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", fontWeight: 400, color: "#000" }}>
                Search for specific products
              </h2>
              <button onClick={() => { setSearchOpen(false); setQuery(""); }} style={{ background: "none", border: "none", cursor: "pointer" }} aria-label="Close search">
                <X size={20} strokeWidth={1.5} color="#000" />
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape") setSearchOpen(false); if (e.key === "Enter") handleSearch(); }}
                placeholder="Type to search"
                style={{ flex: 1, background: "transparent", outline: "none", border: "none", fontFamily: "var(--font-montserrat)", fontSize: "13px", letterSpacing: "0.05em", color: "#000" }}
              />
              <button onClick={handleSearch} style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", background: "none", border: "none", cursor: "pointer", color: "#000" }}>
                Search
              </button>
            </div>
          </div>
          <div style={{ height: "100vh", backgroundColor: "rgba(0,0,0,0.35)", cursor: "pointer" }} onClick={() => { setSearchOpen(false); setQuery(""); }} />
        </div>
      )}
    </>
  );
}
