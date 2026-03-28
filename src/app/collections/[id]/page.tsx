import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductActions from "@/components/collections/ProductActions";
import { getProductById, getProductsByCollection } from "@/lib/products";

const materialDetails: Record<string, { material: string; care: string[] }> = {
  "Silk Collection": {
    material: "100% Premium Silk",
    care: ["Hand wash in cold water", "Do not tumble dry", "Iron on low heat if needed", "Store flat or rolled"],
  },
  "Velvet Collection": {
    material: "100% Premium Velvet",
    care: ["Hand wash in cold water", "Do not wring or twist", "Air dry flat", "Brush gently to restore nap"],
  },
};

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const related = (await getProductsByCollection(product.collection))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const details = materialDetails[product.collection];
  const image = product.images[0] ?? "";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="adj-pad" style={{ flex: 1, paddingTop: "8rem", paddingBottom: "6rem", paddingLeft: "clamp(3rem, 8vw, 10rem)", paddingRight: "clamp(3rem, 8vw, 10rem)" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "2.5rem" }}>
          <Link href="/collections" style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#888", textDecoration: "none" }}>
            Collections
          </Link>
          <ChevronRight size={10} color="#bbb" strokeWidth={1.5} />
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#000" }}>
            {product.name}
          </span>
        </div>

        {/* Main product layout */}
        <div className="flex adj-stack" style={{ gap: "3rem", alignItems: "flex-start" }}>

          {/* Image */}
          <div className="adj-full-w" style={{ flex: "0 0 auto", width: "clamp(280px, 42vw, 560px)", backgroundColor: "#f0f0f0", aspectRatio: "3 / 4", position: "relative" }}>
            {image && (
              <Image src={image} alt={product.name} fill style={{ objectFit: "contain", padding: "3rem" }} sizes="(max-width: 768px) 90vw, 42vw" priority />
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, paddingTop: "0.5rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", marginBottom: "0.6rem" }}>
              {product.collection}
            </p>
            <h1 style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 400, color: "#000", lineHeight: 1.1, marginBottom: "1rem" }}>
              {product.name}
            </h1>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "14px", fontWeight: 500, letterSpacing: "0.08em", color: "#000", marginBottom: "2rem" }}>
              GHS {product.price}
            </p>
            {product.description && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 400, lineHeight: 1.9, color: "#555", letterSpacing: "0.04em", maxWidth: "460px", marginBottom: "2.5rem" }}>
                {product.description}
              </p>
            )}

            <ProductActions id={product.id} name={product.name} collection={product.collection} price={product.price} image={image} />

            {/* Material & Care */}
            {details && (
              <div style={{ marginTop: "2.5rem", borderTop: "1px solid #e5e5e5", paddingTop: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", marginBottom: "0.4rem" }}>Material</p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#555", letterSpacing: "0.06em" }}>{details.material}</p>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", marginBottom: "0.5rem" }}>Care</p>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "0.3rem", listStyle: "none", padding: 0, margin: 0 }}>
                    {details.care.map((c) => (
                      <li key={c} style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#555", letterSpacing: "0.06em" }}>— {c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div style={{ marginTop: "6rem", borderTop: "1px solid #e5e5e5", paddingTop: "3rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "#000", marginBottom: "2rem" }}>
              More from {product.collection}
            </p>
            <div className="grid adj-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
              {related.map((p) => (
                <Link key={p.id} href={`/collections/${p.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ backgroundColor: "#f0f0f0", aspectRatio: "3 / 4", position: "relative", overflow: "hidden", marginBottom: "0.6rem" }}>
                    {p.images[0] && <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: "contain", padding: "2rem" }} sizes="25vw" />}
                  </div>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#000" }}>{p.name}</p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "2px" }}>{p.collection}</p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#000", marginTop: "4px" }}>GHS {p.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
