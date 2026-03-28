"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { VelvetImage } from "@/lib/velvet";

const FALLBACK: VelvetImage[] = [
  { id: "1", image_url: "/images/velvet/velvet-1.png", alt_text: "Blue Velvet Durag",  sort_order: 0 },
  { id: "2", image_url: "/images/velvet/velvet-2.png", alt_text: "Grey Velvet Durag",  sort_order: 1 },
  { id: "3", image_url: "/images/velvet/velvet-3.png", alt_text: "Gold Velvet Durag",  sort_order: 2 },
  { id: "4", image_url: "/images/velvet/velvet-4.png", alt_text: "Brown Velvet Durag", sort_order: 3 },
  { id: "5", image_url: "/images/velvet/velvet-5.png", alt_text: "Green Velvet Durag", sort_order: 4 },
];

export default function VelvetCollection({ images }: { images: VelvetImage[] }) {
  const items = images.length > 0 ? images : FALLBACK;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section className="bg-white" style={{ paddingTop: "5rem", paddingBottom: "5rem", overflow: "hidden" }}>

      {/* Title */}
      <div className="flex justify-center" style={{ marginBottom: "4rem" }}>
        <Link
          href="/collections/velvet"
          className="text-black uppercase hover:opacity-50 transition-opacity"
          style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", borderBottom: "1px solid black", paddingBottom: "2px" }}
        >
          Discover Our Velvet Collection
        </Link>
      </div>

      {isMobile ? (
        /* Mobile — horizontal scroll strip */
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}>
          <style>{`.velvet-scroll::-webkit-scrollbar { display: none; }`}</style>
          <div className="velvet-scroll flex items-center" style={{ gap: "1rem", paddingLeft: "1.25rem", paddingRight: "1.25rem", width: "max-content" }}>
            {items.map((item) => (
              <div key={item.id} className="relative flex-shrink-0" style={{ width: "160px", height: "208px" }}>
                <Image
                  src={item.image_url}
                  alt={item.alt_text}
                  fill
                  className="object-contain object-center"
                  sizes="160px"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Desktop — spread layout */
        <div className="flex items-center justify-between">
          {items.map((item, i) => {
            const isCenter = i === Math.floor(items.length / 2);
            const size = isCenter ? 280 : 200;
            return (
              <div
                key={item.id}
                className="relative flex-shrink-0"
                style={{
                  width: `${size}px`,
                  height: `${size * 1.3}px`,
                  marginLeft: i === 0 ? "-40px" : "0",
                  marginRight: i === items.length - 1 ? "-40px" : "0",
                }}
              >
                <Image
                  src={item.image_url}
                  alt={item.alt_text}
                  fill
                  className="object-contain object-center"
                  sizes={`${size}px`}
                />
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
