"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";

interface Props {
  products: Product[];
}

const ITEM_WIDTH = 220;
const ITEM_GAP   = 24;
const ITEM_TOTAL = ITEM_WIDTH + ITEM_GAP;

export default function Bestsellers({ products }: Props) {
  const [paused, setPaused]           = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (products.length === 0) return null;

  const SET_WIDTH = products.length * ITEM_TOTAL;
  const items     = [...products, ...products, ...products];

  return (
    <section className="bg-white overflow-hidden" style={{ paddingBottom: "4rem" }}>
      <div
        className="w-full overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => { setPaused(false); setHoveredIndex(null); }}
      >
        <div
          className="flex"
          style={{
            width: "max-content",
            animation: `marquee ${products.length * 6}s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
            willChange: "transform",
          }}
        >
          {items.map((product, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <Link
                key={index}
                href={`/collections/${product.id}`}
                className="flex-shrink-0 flex flex-col items-center"
                style={{ width: `${ITEM_WIDTH}px`, marginRight: `${ITEM_GAP}px`, textDecoration: "none" }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative w-full" style={{ height: "240px" }}>
                  {product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain object-bottom"
                      sizes={`${ITEM_WIDTH}px`}
                    />
                  )}
                </div>

                <div
                  className="flex flex-col items-center text-center transition-opacity duration-200"
                  style={{ opacity: isHovered ? 1 : 0, marginTop: "12px" }}
                >
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 400, letterSpacing: "0.12em", color: "#111", textTransform: "uppercase" }}>
                    {product.name}
                  </span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 300, letterSpacing: "0.08em", color: "#555", marginTop: "8px" }}>
                    GHS {product.price}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center" style={{ marginTop: "3rem" }}>
        <Link href="/bestsellers" className="text-black uppercase" style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.18em", borderBottom: "1px solid black", paddingBottom: "2px", textDecoration: "none" }}>
          Bestsellers
        </Link>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0px); }
          100% { transform: translateX(-${SET_WIDTH}px); }
        }
      `}</style>
    </section>
  );
}
