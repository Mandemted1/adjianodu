export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/collections/ProductCard";
import EditorialModelSection from "@/components/collections/EditorialModelSection";
import FilterPanel from "@/components/collections/FilterPanel";
import { LayoutGrid } from "lucide-react";
import { getAllProducts } from "@/lib/products";
import { getCategoryTree } from "@/lib/categories";
import Link from "next/link";

const SIDE_PADDING = "clamp(3rem, 8vw, 10rem)";

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; colors?: string; minPrice?: string; maxPrice?: string }>;
}) {
  const { cat, colors: colorsParam, minPrice: minParam, maxPrice: maxParam } = await searchParams;
  const [allProducts, tree] = await Promise.all([getAllProducts(), getCategoryTree()]);

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

  // Apply color filter
  if (selectedColors.length > 0) {
    filtered = filtered.filter((p) => selectedColors.includes(p.name.split(" ")[0]));
  }

  // Apply price filter
  filtered = filtered.filter((p) => p.price >= activeMin && p.price <= activeMax);

  const first4 = filtered.slice(0, 4);
  const next4  = filtered.slice(4, 8);
  const rest   = filtered.slice(8);

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
        <Suspense fallback={null}>
          <FilterPanel tree={tree} colors={allColors} priceMin={globalMin} priceMax={globalMax} />
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
