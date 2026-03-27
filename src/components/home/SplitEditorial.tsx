"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const TEXT_LINES = [
  "Adjiano is redefining headwear culture, inspired by",
  "the boldness of identity and the elegance of craft.",
  "The Silk and Velvet Collections are here to bring",
  "a personal, fearless and refined touch to your style.",
];

export default function SplitEditorial() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        minHeight: isMobile ? "auto" : "90vh",
      }}
    >
      {/* Text panel */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#f0f0f0",
          padding: isMobile ? "2.5rem 1.25rem" : "3.5rem 3rem",
          display: "flex",
          alignItems: isMobile ? "center" : "flex-start",
          justifyContent: isMobile ? "center" : "flex-start",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-inria)",
            fontSize: isMobile ? "1rem" : "clamp(0.95rem, 1.4vw, 1.15rem)",
            fontWeight: 400,
            lineHeight: 1.8,
            color: "#000",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          {TEXT_LINES.map((line, i) => (
            <span key={i}>
              {line}
              {i < TEXT_LINES.length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>

      {/* Photo panel */}
      <div
        style={{
          flex: 1,
          position: "relative",
          minHeight: isMobile ? "120vw" : "90vh",
        }}
      >
        <Image
          src="/images/split-editorial.jpg"
          alt="Adjiano editorial"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          sizes="(max-width: 767px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
