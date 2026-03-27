"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/collections/ProductCard";
import type { Product } from "@/lib/types";

const SIDE = "clamp(3rem, 8vw, 10rem)";

function SearchResults() {
  const params  = useSearchParams();
  const router  = useRouter();
  const query   = params.get("q") ?? "";

  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    fetch(`/api/products?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((data) => setResults(Array.isArray(data) ? data : []))
      .catch(() => setResults([]));
  }, [query]);

  return (
    <div className="adj-pad" style={{ flex: 1, paddingTop: "8rem", paddingBottom: "6rem", paddingLeft: SIDE, paddingRight: SIDE }}>

      {/* Back */}
      <button
        onClick={() => router.back()}
        style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: "2rem", fontFamily: "var(--font-montserrat)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#888" }}
      >
        <ChevronLeft size={14} strokeWidth={1.5} />
        Back
      </button>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #e5e5e5", paddingBottom: "1.5rem", marginBottom: "3rem" }}>
        {query ? (
          <>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#888", marginBottom: "0.5rem" }}>
              {results.length} result{results.length !== 1 ? "s" : ""} for
            </p>
            <h1 style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 400, color: "#000" }}>
              &ldquo;{params.get("q")}&rdquo;
            </h1>
          </>
        ) : (
          <h1 style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 400, color: "#000" }}>
            Search
          </h1>
        )}
      </div>

      {/* Results grid */}
      {query && results.length > 0 && (
        <div className="grid adj-grid-2" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem 1rem" }}>
          {results.map((p) => <ProductCard key={p.id} id={p.id} name={p.name} collection={p.collection} price={p.price} image={p.images[0] ?? ""} />)}
        </div>
      )}

      {/* No results */}
      {query && results.length === 0 && (
        <div style={{ paddingTop: "4rem", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-inria)", fontSize: "1.2rem", color: "#999", marginBottom: "1rem" }}>
            No results found for &ldquo;{params.get("q")}&rdquo;
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#bbb", letterSpacing: "0.1em" }}>
            Try searching for a colour or collection — e.g. &quot;black&quot;, &quot;velvet&quot;, &quot;silk&quot;
          </p>
        </div>
      )}

      {/* Empty prompt */}
      {!query && (
        <div style={{ paddingTop: "4rem", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#bbb", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Start typing to search for products
          </p>
        </div>
      )}

    </div>
  );
}

export default function SearchPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Suspense fallback={<div style={{ flex: 1 }} />}>
        <SearchResults />
      </Suspense>
      <Footer />
    </div>
  );
}
