export const dynamic = "force-dynamic";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/collections/ProductCard";
import EditorialModelSection from "@/components/collections/EditorialModelSection";
import { LayoutGrid } from "lucide-react";
import { getAllProducts } from "@/lib/products";

const SIDE_PADDING = "clamp(3rem, 8vw, 10rem)";

export default async function CollectionsPage() {
  const products = await getAllProducts();
  const first4 = products.slice(0, 4);
  const next4  = products.slice(4, 8);
  const rest   = products.slice(8);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
      <Navbar />

      {/* Page header */}
      <div className="adj-pad" style={{ paddingTop: "8rem", paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING, paddingBottom: "2rem", borderBottom: "1px solid #e5e5e5" }}>
        <h1 style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 400, color: "#000", lineHeight: 1.1 }}>
          Collections
        </h1>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-end" style={{ paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING, paddingTop: "0.85rem", paddingBottom: "0.85rem", borderBottom: "1px solid #e5e5e5" }}>
        <div className="flex items-center" style={{ gap: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.16em", color: "#000" }}>
            {products.length} Products
          </span>
          <LayoutGrid size={13} strokeWidth={1.5} color="#000" />
        </div>
      </div>

      {/* Section 1: products 1–4 */}
      {first4.length > 0 && (
        <div className="adj-pad" style={{ paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING, paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
          <div className="grid adj-grid-2" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {first4.map((p) => <ProductCard key={p.id} id={p.id} name={p.name} collection={p.collection} price={p.price} image={p.images[0] ?? ""} />)}
          </div>
        </div>
      )}

      {/* Section 2: editorial + products 5–8 */}
      {next4.length > 0 && (
        <EditorialModelSection
          imageSrc="/images/collections/editorial-model.png"
          imageAlt="Editorial"
          rightPadding={SIDE_PADDING}
          gridChildren={
            <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
              {next4.map((p) => <ProductCard key={p.id} id={p.id} name={p.name} collection={p.collection} price={p.price} image={p.images[0] ?? ""} />)}
            </div>
          }
        />
      )}

      {/* Section 3: all remaining products */}
      {rest.length > 0 && (
        <div className="adj-pad" style={{ paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING, paddingTop: "2.5rem", paddingBottom: "4rem" }}>
          <div className="grid adj-grid-2" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {rest.map((p) => <ProductCard key={p.id} id={p.id} name={p.name} collection={p.collection} price={p.price} image={p.images[0] ?? ""} />)}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
