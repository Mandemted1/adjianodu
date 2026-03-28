export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/collections/ProductCard";
import EditorialModelSection from "@/components/collections/EditorialModelSection";
import FilterPanel from "@/components/collections/FilterPanel";
import GridToggle from "@/components/collections/GridToggle";
import { getAllProducts } from "@/lib/products";
import { getCategoryTree } from "@/lib/categories";
import { getEditorials } from "@/lib/editorials";
import Link from "next/link";
import type { Product } from "@/lib/types";

const SIDE_PADDING = "clamp(3rem, 8vw, 10rem)";

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; colors?: string; minPrice?: string; maxPrice?: string; view?: string }>;
}) {
  const { cat, colors: colorsParam, minPrice: minParam, maxPrice: maxParam, view } = await searchParams;
  const isListView = view === "list";

  const [allProducts, tree, editorials] = await Promise.all([
    getAllProducts(),
    getCategoryTree(),
    getEditorials("collections", cat ?? null),
  ]);

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

  // Resolve which products to show by category
  let filtered = allProducts;
  let pageTitle = "Collections";

  if (cat) {
    const parent = tree.find((p) => p.id === cat);
    if (parent) {
      pageTitle = parent.name;
      const childNames = (parent.children ?? []).map((c) => c.name);
      const matchNames = childNames.length > 0 ? childNames : [parent.name];
      filtered = allProducts.filter((p) => matchNames.includes(p.collection));
    } else {
      const allCats = tree.flatMap((p) => p.children ?? []);
      const child = allCats.find((c) => c.id === cat);
      if (child) {
        pageTitle = child.name;
        filtered = allProducts.filter((p) => p.collection === child.name);
      }
    }
  }

  // Apply color + price filters
  if (selectedColors.length > 0) {
    filtered = filtered.filter((p) => selectedColors.includes(p.name.split(" ")[0]));
  }
  filtered = filtered.filter((p) => p.price >= activeMin && p.price <= activeMax);

  // Build editorial sections: consume products through each editorial in order
  type EditorialSection = { before: Product[]; beside: Product[]; imageUrl: string; altText: string; position: "after_4" | "after_2" };
  const editorialSections: EditorialSection[] = [];
  let remaining = [...filtered];

  for (const ed of editorials) {
    const beforeCount = ed.position === "after_2" ? 2 : 4;
    if (remaining.length < beforeCount + 4) break;
    editorialSections.push({
      before:    remaining.slice(0, beforeCount),
      beside:    remaining.slice(beforeCount, beforeCount + 4),
      imageUrl:  ed.image_url,
      altText:   ed.alt_text,
      position:  ed.position,
    });
    remaining = remaining.slice(beforeCount + 4);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
      <Navbar />

      {/* Page header */}
      <div className="adj-pad" style={{ paddingTop: "8rem", paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING, paddingBottom: "2rem", borderBottom: "1px solid #e5e5e5" }}>
        <h1 style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 400, color: "#000", lineHeight: 1.1 }}>
          {pageTitle}
        </h1>

        {/* Category tabs */}
        {tree.length > 0 && (
          <div style={{ display: "flex", gap: "1.5rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
            <Link href="/collections" style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: !cat ? "#000" : "#bbb", textDecoration: "none", borderBottom: !cat ? "1px solid #000" : "none", paddingBottom: "2px" }}>
              All
            </Link>
            {tree.map((parent) => (
              <div key={parent.id} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <Link
                  href={`/collections?cat=${parent.id}`}
                  style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: cat === parent.id ? "#000" : "#bbb", textDecoration: "none", borderBottom: cat === parent.id ? "1px solid #000" : "none", paddingBottom: "2px" }}
                >
                  {parent.name}
                </Link>
                {(parent.children ?? []).length > 0 && (
                  <div style={{ display: "flex", gap: "1rem" }}>
                    {(parent.children ?? []).map((child) => (
                      <Link
                        key={child.id}
                        href={`/collections?cat=${child.id}`}
                        style={{ fontFamily: "var(--font-montserrat)", fontSize: "8px", letterSpacing: "0.12em", textTransform: "uppercase", color: cat === child.id ? "#000" : "#aaa", textDecoration: "none", borderBottom: cat === child.id ? "1px solid #000" : "none", paddingBottom: "2px" }}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
          <FilterPanel tree={tree} colors={allColors} priceMin={globalMin} priceMax={globalMax} />
        </Suspense>
      </div>

      {filtered.length === 0 && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#bbb", letterSpacing: "0.1em" }}>No products match the selected filters.</p>
        </div>
      )}

      {isListView ? (
        /* List view — 2-col flat grid */
        filtered.length > 0 && (
          <div className="adj-pad" style={{ paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING, paddingTop: "2.5rem", paddingBottom: "4rem" }}>
            <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
              {filtered.map((p) => <ProductCard key={p.id} id={p.id} name={p.name} collection={p.collection} price={p.price} image={p.images[0] ?? ""} />)}
            </div>
          </div>
        )
      ) : (
        /* Grid view — editorial sections then remaining */
        <>
          {editorialSections.map((section, i) => (
            <div key={i}>
              {/* Products before the editorial */}
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

              {/* Editorial image + 4 products beside it */}
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

          {/* Remaining products (also handles the no-editorials case) */}
          {remaining.length > 0 && (
            <div className="adj-pad" style={{ paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING, paddingTop: "2.5rem", paddingBottom: "4rem" }}>
              <div className="grid adj-grid-2" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
                {remaining.map((p) => <ProductCard key={p.id} id={p.id} name={p.name} collection={p.collection} price={p.price} image={p.images[0] ?? ""} />)}
              </div>
            </div>
          )}
        </>
      )}

      <Footer />
    </div>
  );
}
