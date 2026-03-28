"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface Props {
  id: string;
  name: string;
  collection: string;
  price: number;
  image: string;
}

export default function ProductActions({ id, name, collection, price, image }: Props) {
  const { addItem } = useCart();
  const item = { id, name, collection, price, image };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "420px", width: "100%" }}>
      <button
        onClick={() => addItem(item)}
        style={{ width: "100%", backgroundColor: "#000", color: "#fff", padding: "1.1rem", fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", border: "none", cursor: "pointer" }}
      >
        Add to Bag
      </button>
      <Link
        href="/bag"
        onClick={() => addItem(item)}
        style={{ display: "block", width: "100%", backgroundColor: "#fff", color: "#000", padding: "1.1rem", fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", border: "1px solid #000", cursor: "pointer", textDecoration: "none", textAlign: "center" }}
      >
        Buy Now
      </Link>
    </div>
  );
}
