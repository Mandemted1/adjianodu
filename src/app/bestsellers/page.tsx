export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/collections/ProductCard";
import EditorialModelSection from "@/components/collections/EditorialModelSection";
import FilterPanel from "@/components/collections/FilterPanel";
import { LayoutGrid } from "lucide-react";
import { getBestsellers } from "@/lib/products";
import { getCategoryTree } from "@/lib/categories";

const SIDE_PADDING = "clamp(3rem, 8vw, 10rem)";

export default async function BestsellersPage({
  searchParams,
}: {
  searchParams: Promise<{ colors?: string; minPrice?: string; maxPrice?: string }>;
}) {
  const { colors: colorsParam, minPrice: minParam, maxPrice: maxParam } = await searchParams;
  const [allProducts, tree] = await Promise.all([getBestsellers(), getCategoryTree()]);

  // Compute available colors (first word of each product name)
  const allColors = [...new Set(allProducts.map((p) => p.name.split(" ")[0]))].sort();

  // Compute global price bounds
  const prices = allProducts.map((p) => p.price);
  const globalMin = prices.length ? Math.floor(Math.min(...prices) / 10) * 10 : 0;
  const globalMax = prices.length ? Math.ceil(Math.max(...prices) / 10) * 10 : 1000;

  // Parse active filters
  const selectedColors = colorsParam?.split(",").filter(Boolean) ?? [];
  const activeMin = minParam ? Number(minParam) : globalMin;
  const activeMax = maxParam ? Number(maxParam) : globalMax;

  // Apply filters
  let filtered = allProducts;
  if (selectedColors.length > 0) {
    filtered = filtered.filter((p) => selectedColors.includes(p.name.split(" ")[0]));
  }
  filtered = filtered.filter((p) => p.price >= activeMin && p.price <= activeMax);

  const first4 = filtered.slice(0, 4);
  const next4  = filtered.slice(4, 8);
  const rest   = filtered.slice(8);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
      <Navbar />

      <div className="adj-pad" style={{ paddingTop: "8rem", paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING, paddingBottom: "2rem", borderBottom: "1px solid #e5e5e5" }}>
        <h1 style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 400, color: "#000", lineHeight: 1.1 }}>
          Bestsellers
        </h1>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between" style={{ paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING, paddingTop: "0.85rem", paddingBottom: "0.85rem", borderBottom: "1px solid #e5e5e5" }}>
        <Suspense fallback={null}>
          <FilterPanel tree={[]} colors={allColors} priceMin={globalMin} priceMax={globalMax} />
        </Suspense>
        <div className="flex items-center" style={{ gap: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.16em", color: "#000" }}>
            {filtered.length} Products
          </span>
          <LayoutGrid size={13} strokeWidth={1.5} color="#000" />
        </div>
      </div>

      {filtered.length === 0 && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#bbb", letterSpacing: "0.1em" }}>No products match the selected filters.</p>
        </div>
      )}

      {first4.length > 0 && (
        <div className="adj-pad" style={{ paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING, paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
          <div className="grid adj-grid-2" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {first4.map((p) => <ProductCard key={p.id} id={p.id} name={p.name} collection={p.collection} price={p.price} image={p.images[0] ?? ""} />)}
          </div>
        </div>
      )}

      {next4.length > 0 && (
        <EditorialModelSection
          imageSrc="/images/bestsellers/editorial-model.png"
          imageAlt="Bestsellers Editorial"
          rightPadding={SIDE_PADDING}
          gridChildren={
            <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
              {next4.map((p) => <ProductCard key={p.id} id={p.id} name={p.name} collection={p.collection} price={p.price} image={p.images[0] ?? ""} />)}
            </div>
          }
        />
      )}

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
