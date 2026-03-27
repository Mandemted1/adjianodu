"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, EyeOff, Eye } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/client";
import { useCart } from "@/context/CartContext";

function AccountForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/account/orders";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    clearCart();
    router.push(redirect);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Page content */}
      <div
        className="flex flex-col items-center justify-center flex-1"
        style={{ paddingTop: "8rem", paddingBottom: "4rem" }}
      >
        {/* Login card */}
        <div
          className="adj-pad"
          style={{
            backgroundColor: "#f2f2f2",
            width: "100%",
            maxWidth: "680px",
            padding: "3rem 3.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center"
            style={{ gap: "0.6rem", paddingBottom: "1.2rem", borderBottom: "1px solid #ddd", marginBottom: "2rem" }}
          >
            <User size={18} strokeWidth={1.5} color="#000" />
            <h1
              style={{
                fontFamily: "var(--font-inria)",
                fontSize: "1.5rem",
                fontWeight: 400,
                color: "#000",
              }}
            >
              Login
            </h1>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {/* Email */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL"
              required
              style={{
                width: "100%",
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                padding: "1rem 1.2rem",
                fontFamily: "var(--font-montserrat)",
                fontSize: "11px",
                fontWeight: 400,
                letterSpacing: "0.15em",
                color: "#000",
                outline: "none",
              }}
            />

            {/* Password */}
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSWORD"
                required
                style={{
                  width: "100%",
                  backgroundColor: "#fff",
                  border: "1px solid #e0e0e0",
                  padding: "1rem 3rem 1rem 1.2rem",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "11px",
                  fontWeight: 400,
                  letterSpacing: "0.15em",
                  color: "#000",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999" }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <Eye size={16} strokeWidth={1.5} /> : <EyeOff size={16} strokeWidth={1.5} />}
              </button>
            </div>

            {error && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#c00", letterSpacing: "0.06em" }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: loading ? "#555" : "#000",
                color: "#fff",
                padding: "1rem",
                fontFamily: "var(--font-montserrat)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "1.25rem",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Forgot password */}
            <Link
              href="/account/forgot-password"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "9px",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#999",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                marginTop: "0.25rem",
              }}
            >
              Forgot your password?
            </Link>
          </form>
        </div>

        {/* Create account */}
        <div className="flex flex-col items-center" style={{ gap: "0.4rem" }}>
          <span
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "10px",
              fontWeight: 400,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#000",
            }}
          >
            Do not have an account yet?
          </span>
          <Link
            href="/account/register"
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#000",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Create Account
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense>
      <AccountForm />
    </Suspense>
  );
}
