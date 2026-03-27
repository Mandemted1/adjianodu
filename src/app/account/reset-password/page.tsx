"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    router.push("/account/orders");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    padding: "1rem 3rem 1rem 1.2rem",
    fontFamily: "var(--font-montserrat)",
    fontSize: "11px",
    letterSpacing: "0.1em",
    color: "#000",
    outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-1" style={{ paddingTop: "8rem", paddingBottom: "4rem" }}>
        <div className="adj-pad" style={{ backgroundColor: "#f2f2f2", width: "100%", maxWidth: "520px", padding: "3rem 3.5rem" }}>

          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "#888", marginBottom: "1.5rem" }}>
            New Password
          </p>
          <h1 style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 400, color: "#000", marginBottom: "2rem" }}>
            Reset your password
          </h1>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="NEW PASSWORD"
                required
                style={inputStyle}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999" }}>
                {showPw ? <Eye size={16} strokeWidth={1.5} /> : <EyeOff size={16} strokeWidth={1.5} />}
              </button>
            </div>

            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="CONFIRM NEW PASSWORD"
                required
                style={inputStyle}
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
              style={{ width: "100%", padding: "1rem", backgroundColor: loading ? "#555" : "#000", color: "#fff", fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: "0.75rem" }}
            >
              {loading ? "Updating..." : "Set New Password"}
            </button>

          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
