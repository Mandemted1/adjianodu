"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";

const products = [
  { id: "ash-durag",   name: "Ash Durag",   collection: "Silk Collection",   price: 100,  image: "/images/collections/ash-durag.png",   description: "A refined ash-toned silk durag that combines elegance with everyday wearability. Crafted for a smooth, wave-enhancing compression." },
  { id: "blue-durag",  name: "Blue Durag",  collection: "Velvet Collection", price: 150,  image: "/images/collections/blue-durag.png",   description: "Deep ocean blue velvet. Exceptionally soft to the touch with a premium texture that speaks for itself." },
  { id: "white-durag", name: "White Durag", collection: "Silk Collection",   price: 100,  image: "/images/collections/white-durag.png",  description: "Clean, crisp white silk. A timeless staple that pairs with any look while delivering superior compression." },
  { id: "gold-durag",  name: "Gold Durag",  collection: "Velvet Collection", price: 150,  image: "/images/collections/gold-durag.png",   description: "A statement piece. Gold velvet with a rich sheen that elevates any outfit to a new standard." },
  { id: "black-durag", name: "Black Durag", collection: "Velvet Collection", price: 150,  image: "/images/collections/black-durag.png",  description: "The essential. Black velvet, flawlessly executed — a wardrobe anchor that transcends trends." },
  { id: "grey-durag",  name: "Grey Durag",  collection: "Silk Collection",   price: 100,  image: "/images/collections/grey-durag.png",   description: "Understated grey silk for those who let quality speak louder than colour." },
  { id: "green-durag", name: "Green Durag", collection: "Velvet Collection", price: 150,  image: "/images/collections/green-durag.png",  description: "A bold forest green velvet that commands attention without compromising on comfort." },
  { id: "navy-durag",  name: "Navy Durag",  collection: "Velvet Collection", price: 150,  image: "/images/collections/navy-durag.png",   description: "Deep navy velvet. Versatile enough for daily wear, refined enough for any occasion." },
  { id: "brown-durag", name: "Brown Durag", collection: "Velvet Collection", price: 150,  image: "/images/collections/brown-durag.png",  description: "A warm, earthy brown velvet with a luxurious hand-feel that ages beautifully." },
  { id: "red-durag",   name: "Red Durag",   collection: "Silk Collection",   price: 100,  image: "/images/collections/red-durag.png",    description: "Bold crimson silk. Make a statement — precision cut for a seamless, wrinkle-free fit." },
  { id: "pink-durag",  name: "Pink Durag",  collection: "Velvet Collection", price: 150,  image: "/images/collections/pink-durag.png",   description: "Soft blush pink velvet that balances softness with structure. Effortlessly confident." },
  { id: "olive-durag", name: "Olive Durag", collection: "Velvet Collection", price: 150,  image: "/images/collections/olive-durag.png",  description: "An earthy olive velvet that channels a refined, understated edge." },
];

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

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addItem } = useCart();

  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const details = materialDetails[product.collection];
  const priceLabel = `GHS ${product.price}`;

  // Related: other products in same collection, up to 4
  const related = products.filter((p) => p.collection === product.collection && p.id !== product.id).slice(0, 4);

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
            <Image
              src={product.image}
              alt={product.name}
              fill
              style={{ objectFit: "contain", padding: "3rem" }}
              sizes="(max-width: 768px) 90vw, 42vw"
              priority
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1, paddingTop: "0.5rem" }}>

            {/* Collection tag */}
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", marginBottom: "0.6rem" }}>
              {product.collection}
            </p>

            {/* Name */}
            <h1 style={{ fontFamily: "var(--font-inria)", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 400, color: "#000", lineHeight: 1.1, marginBottom: "1rem" }}>
              {product.name}
            </h1>

            {/* Price */}
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "14px", fontWeight: 500, letterSpacing: "0.08em", color: "#000", marginBottom: "2rem" }}>
              {priceLabel}
            </p>

            {/* Description */}
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 400, lineHeight: 1.9, color: "#555", letterSpacing: "0.04em", maxWidth: "460px", marginBottom: "2.5rem" }}>
              {product.description}
            </p>

            {/* Add to bag */}
            <button
              onClick={() => addItem({ id: product.id, name: product.name, collection: product.collection, price: product.price, image: product.image })}
              style={{ width: "100%", maxWidth: "420px", backgroundColor: "#000", color: "#fff", padding: "1.1rem", fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", border: "none", cursor: "pointer", marginBottom: "0.75rem" }}
            >
              Add to Bag
            </button>

            <Link
              href="/bag"
              onClick={() => addItem({ id: product.id, name: product.name, collection: product.collection, price: product.price, image: product.image })}
              style={{ display: "block", width: "100%", maxWidth: "420px", backgroundColor: "#fff", color: "#000", padding: "1.1rem", fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", border: "1px solid #000", cursor: "pointer", textDecoration: "none", textAlign: "center" }}
            >
              Buy Now
            </Link>

            {/* Material & Care */}
            <div style={{ marginTop: "2.5rem", borderTop: "1px solid #e5e5e5", paddingTop: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", marginBottom: "0.4rem" }}>
                  Material
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#555", letterSpacing: "0.06em" }}>
                  {details.material}
                </p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", marginBottom: "0.5rem" }}>
                  Care
                </p>
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.3rem", listStyle: "none", padding: 0, margin: 0 }}>
                  {details.care.map((c) => (
                    <li key={c} style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#555", letterSpacing: "0.06em" }}>
                      — {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

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
                    <Image src={p.image} alt={p.name} fill style={{ objectFit: "contain", padding: "2rem" }} sizes="25vw" />
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
