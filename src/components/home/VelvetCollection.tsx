"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const durags = [
  { id: 1, alt: "Blue Velvet Durag" },
  { id: 2, alt: "Grey Velvet Durag" },
  { id: 3, alt: "Gold Velvet Durag" },
  { id: 4, alt: "Brown Velvet Durag" },
  { id: 5, alt: "Green Velvet Durag" },
];

export default function VelvetCollection() {
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
            {durags.map((durag) => (
              <div key={durag.id} className="relative flex-shrink-0" style={{ width: "160px", height: "208px" }}>
                <Image
                  src={`/images/velvet/velvet-${durag.id}.png`}
                  alt={durag.alt}
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
          {durags.map((durag, i) => {
            const isCenter = i === 2;
            const size = isCenter ? 280 : 200;
            return (
              <div
                key={durag.id}
                className="relative flex-shrink-0"
                style={{
                  width: `${size}px`,
                  height: `${size * 1.3}px`,
                  marginLeft: i === 0 ? "-40px" : "0",
                  marginRight: i === 4 ? "-40px" : "0",
                }}
              >
                <Image
                  src={`/images/velvet/velvet-${durag.id}.png`}
                  alt={durag.alt}
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
