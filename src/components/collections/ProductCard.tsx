"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  collection: string;
  price: number;
  image: string;
}

export default function ProductCard({ id, name, collection, price, image }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const { addItem } = useCart();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "block", textDecoration: "none" }}
    >
      {/* Image container */}
      <Link href={`/collections/${id}`} style={{ textDecoration: "none", display: "block" }}>
        <div
          style={{
            backgroundColor: "#e8e8e8",
            aspectRatio: "3 / 4",
            position: "relative",
            overflow: "hidden",
            width: "100%",
          }}
        >
          {/* Durag image — smaller padding to reduce visual size */}
          <Image
            src={image}
            alt={name}
            fill
            style={{ objectFit: "contain", padding: "2.5rem" }}
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* Add to Cart — slides up on hover */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0,0,0,0.82)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "48px",
              transform: hovered ? "translateY(0)" : "translateY(100%)",
              transition: "transform 0.25s ease",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.preventDefault();
              addItem({ id, name, collection, price, image });
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#fff",
              }}
            >
              Add to Cart
            </span>
          </div>
        </div>
      </Link>

      {/* Text info */}
      <div style={{ marginTop: "0.6rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#000" }}>
          {name}
        </span>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.1em", color: "#888" }}>
          {collection}
        </span>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 400, color: "#000" }}>
          GHS {price}
        </span>
      </div>
    </div>
  );
}
