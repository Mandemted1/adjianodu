import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div
        className="flex-1 flex flex-col items-center justify-center adj-pad"
        style={{ paddingTop: "8rem", paddingBottom: "6rem", textAlign: "center" }}
      >
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#bbb", marginBottom: "1.5rem" }}>
          404
        </p>
        <h1 style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(2rem, 6vw, 4rem)", fontWeight: 400, color: "#000", lineHeight: 1.2, marginBottom: "1rem" }}>
          Page not found
        </h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#888", lineHeight: 1.8, letterSpacing: "0.04em", maxWidth: "380px", marginBottom: "3rem" }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href="/"
            style={{ padding: "0.9rem 2rem", backgroundColor: "#000", color: "#fff", fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", textDecoration: "none" }}
          >
            Go Home
          </Link>
          <Link
            href="/collections"
            style={{ padding: "0.9rem 2rem", backgroundColor: "transparent", color: "#000", fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", textDecoration: "none", border: "1px solid #000" }}
          >
            Shop Now
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
