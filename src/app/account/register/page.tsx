"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: `${form.firstName} ${form.lastName}` } },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSuccess(true);
  };

  const inputStyle = {
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
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-1" style={{ paddingTop: "8rem", paddingBottom: "4rem" }}>

        {/* Card */}
        <div className="adj-pad" style={{ backgroundColor: "#f2f2f2", width: "100%", maxWidth: "680px", padding: "3rem 3.5rem", marginBottom: "2.5rem" }}>

          {/* Header */}
          <div className="flex items-center" style={{ gap: "0.6rem", paddingBottom: "1.2rem", borderBottom: "1px solid #ddd", marginBottom: "2rem" }}>
            <User size={18} strokeWidth={1.5} color="#000" />
            <h1 style={{ fontFamily: "var(--font-inria)", fontSize: "1.5rem", fontWeight: 400, color: "#000" }}>
              Create Account
            </h1>
          </div>

          {success ? (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <p style={{ fontFamily: "var(--font-inria)", fontSize: "1.3rem", color: "#000", marginBottom: "0.75rem" }}>Check your inbox</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#888", letterSpacing: "0.06em", lineHeight: 1.8 }}>
                We sent a confirmation link to <strong style={{ color: "#000" }}>{form.email}</strong>.<br />Click it to activate your account.
              </p>
              <Link href="/account" style={{ display: "inline-block", marginTop: "1.5rem", fontFamily: "var(--font-montserrat)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#000", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                Back to Login
              </Link>
            </div>
          ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

            {/* First + Last name row */}
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                placeholder="FIRST NAME"
                required
                style={inputStyle}
              />
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                placeholder="LAST NAME"
                required
                style={inputStyle}
              />
            </div>

            {/* Email */}
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="EMAIL"
              required
              style={inputStyle}
            />

            {/* Password */}
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="PASSWORD"
                required
                style={{ ...inputStyle, paddingRight: "3rem" }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999" }}>
                {showPassword ? <Eye size={16} strokeWidth={1.5} /> : <EyeOff size={16} strokeWidth={1.5} />}
              </button>
            </div>

            {/* Confirm password */}
            <div style={{ position: "relative" }}>
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirm}
                onChange={(e) => update("confirm", e.target.value)}
                placeholder="CONFIRM PASSWORD"
                required
                style={{ ...inputStyle, paddingRight: "3rem" }}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999" }}>
                {showConfirm ? <Eye size={16} strokeWidth={1.5} /> : <EyeOff size={16} strokeWidth={1.5} />}
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          )}
        </div>

        {/* Already have an account */}
        <div className="flex flex-col items-center" style={{ gap: "0.4rem" }}>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.15em", textTransform: "uppercase", color: "#000" }}>
            Already have an account?
          </span>
          <Link
            href="/account"
            style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "#000", textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            Login
          </Link>
        </div>

      </div>
      <Footer />
    </div>
  );
}
