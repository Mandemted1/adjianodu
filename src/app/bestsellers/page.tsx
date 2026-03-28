export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/collections/ProductCard";
import EditorialModelSection from "@/components/collections/EditorialModelSection";
import FilterPanel from "@/components/collections/FilterPanel";
import GridToggle from "@/components/collections/GridToggle";
import { getBestsellers } from "@/lib/products";
import { getEditorials } from "@/lib/editorials";
import type { Product } from "@/lib/types";

const SIDE_PADDING = "clamp(3rem, 8vw, 10rem)";

export default async function BestsellersPage({
  searchParams,
}: {
  searchParams: Promise<{ colors?: string; minPrice?: string; maxPrice?: string; view?: string }>;
}) {
  const { colors: colorsParam, minPrice: minParam, maxPrice: maxParam, view } = await searchParams;
  const isListView = view === "list";

  const [allProducts, editorials] = await Promise.all([
    getBestsellers(),
    getEditorials("bestsellers"),
  ]);

  // Compute available colors (first word of each product name)
  const allColors = [...new Set(allProducts.map((p) => p.name.split(" ")[0]))].sort();

  // Compute global price bounds
  const prices = allProducts.map((p) => p.price);
  const globalMin = prices.length ? Math.floor(Math.min(...prices) / 10) * 10 : 0;
  const globalMax = prices.length ? Math.ceil(Math.max(...prices) / 10) * 10 : 1000;

  // Apply filters
  const selectedColors = colorsParam?.split(",").filter(Boolean) ?? [];
  const activeMin = minParam ? Number(minParam) : globalMin;
  const activeMax = maxParam ? Number(maxParam) : globalMax;

  let filtered = allProducts;
  if (selectedColors.length > 0) {
    filtered = filtered.filter((p) => selectedColors.includes(p.name.split(" ")[0]));
  }
  filtered = filtered.filter((p) => p.price >= activeMin && p.price <= activeMax);

  // Build editorial sections
  type EditorialSection = { before: Product[]; beside: Product[]; imageUrl: string; altText: string; position: "after_4" | "after_2" };
  const editorialSections: EditorialSection[] = [];
  let remaining = [...filtered];

  for (const ed of editorials) {
    const beforeCount = ed.position === "after_2" ? 2 : 4;
    if (remaining.length < beforeCount + 4) break;
    editorialSections.push({
      before:   remaining.slice(0, beforeCount),
      beside:   remaining.slice(beforeCount, beforeCount + 4),
      imageUrl: ed.image_url,
      altText:  ed.alt_text,
      position: ed.position,
    });
    remaining = remaining.slice(beforeCount + 4);
  }

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
        <div className="flex items-center" style={{ gap: "0.75rem" }}>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.16em", color: "#000" }}>
            {filtered.length} Products
          </span>
          <Suspense fallback={null}>
            <GridToggle />
          </Suspense>
        </div>
        <Suspense fallback={null}>
          <FilterPanel tree={[]} colors={allColors} priceMin={globalMin} priceMax={globalMax} />
        </Suspense>
      </div>

      {filtered.length === 0 && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#bbb", letterSpacing: "0.1em" }}>No products match the selected filters.</p>
        </div>
      )}

      {isListView ? (
        filtered.length > 0 && (
          <div className="adj-pad" style={{ paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING, paddingTop: "2.5rem", paddingBottom: "4rem" }}>
            <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
              {filtered.map((p) => <ProductCard key={p.id} id={p.id} name={p.name} collection={p.collection} price={p.price} image={p.images[0] ?? ""} />)}
            </div>
          </div>
        )
      ) : (
        <>
          {editorialSections.map((section, i) => (
            <div key={i}>
              <div className="adj-pad" style={{ paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING, paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
                {section.position === "after_4" ? (
                  <div className="grid adj-grid-2" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
                    {section.before.map((p) => <ProductCard key={p.id} id={p.id} name={p.name} collection={p.collection} price={p.price} image={p.images[0] ?? ""} />)}
                  </div>
                ) : (
                  <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
                    {section.before.map((p) => <ProductCard key={p.id} id={p.id} name={p.name} collection={p.collection} price={p.price} image={p.images[0] ?? ""} />)}
                  </div>
                )}
              </div>

              <EditorialModelSection
                imageSrc={section.imageUrl}
                imageAlt={section.altText}
                rightPadding={SIDE_PADDING}
                gridChildren={
                  <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
                    {section.beside.map((p) => <ProductCard key={p.id} id={p.id} name={p.name} collection={p.collection} price={p.price} image={p.images[0] ?? ""} />)}
                  </div>
                }
              />
            </div>
          ))}

          {remaining.length > 0 && (
            <div className="adj-pad" style={{ paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING, paddingTop: "2.5rem", paddingBottom: "4rem" }}>
              <div className="grid adj-grid-2" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
                {remaining.map((p) => <ProductCard key={p.id} id={p.id} name={p.name} collection={p.collection} price={p.price} image={p.images[0] ?? ""} />)}
              </div>
            </div>
          )}

          {editorialSections.length === 0 && filtered.length > 0 && (
            <div className="adj-pad" style={{ paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING, paddingTop: "2.5rem", paddingBottom: "4rem" }}>
              <div className="grid adj-grid-2" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
                {filtered.map((p) => <ProductCard key={p.id} id={p.id} name={p.name} collection={p.collection} price={p.price} image={p.images[0] ?? ""} />)}
              </div>
            </div>
          )}
        </>
      )}

      <Footer />
    </div>
  );
}
