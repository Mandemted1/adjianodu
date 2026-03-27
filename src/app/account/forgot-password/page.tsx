"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-1" style={{ paddingTop: "8rem", paddingBottom: "4rem" }}>
        <div className="adj-pad" style={{ backgroundColor: "#f2f2f2", width: "100%", maxWidth: "520px", padding: "3rem 3.5rem", marginBottom: "2rem" }}>

          {!submitted ? (
            <>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "#888", marginBottom: "1.5rem" }}>
                Reset Password
              </p>
              <h1 style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 400, color: "#000", lineHeight: 1.3, marginBottom: "1rem" }}>
                Forgot your password?
              </h1>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#888", lineHeight: 1.8, letterSpacing: "0.04em", marginBottom: "2rem" }}>
                Enter the email address linked to your account and we&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#555", display: "block", marginBottom: "0.5rem" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #ddd", outline: "none", fontFamily: "var(--font-montserrat)", fontSize: "11px", letterSpacing: "0.05em", color: "#000", backgroundColor: "#fff" }}
                  />
                </div>

                {error && (
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#c00", letterSpacing: "0.06em" }}>
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: "100%", padding: "1rem", backgroundColor: loading ? "#555" : "#000", color: "#fff", fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: "0.5rem" }}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "#2e7d32", marginBottom: "1.5rem" }}>
                Email Sent
              </p>
              <h2 style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 400, color: "#000", lineHeight: 1.3, marginBottom: "1rem" }}>
                Check your inbox
              </h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#888", lineHeight: 1.8, letterSpacing: "0.04em", marginBottom: "2rem" }}>
                We&apos;ve sent a password reset link to <strong style={{ color: "#000" }}>{email}</strong>. Check your inbox and follow the link to create a new password.
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#aaa", lineHeight: 1.8, letterSpacing: "0.04em" }}>
                Didn&apos;t receive it? Check your spam folder or{" "}
                <button onClick={() => setSubmitted(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#000", fontFamily: "var(--font-montserrat)", fontSize: "10px", textDecoration: "underline", textUnderlineOffset: "3px", letterSpacing: "0.04em" }}>
                  try again
                </button>.
              </p>
            </>
          )}

        </div>

        <Link href="/account" style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#888", textDecoration: "underline", textUnderlineOffset: "3px" }}>
          ← Back to Login
        </Link>
      </div>

      <Footer />
    </div>
  );
}
