"use client";

import { useState, useEffect, ReactNode } from "react";

interface Props {
  imageSrc: string;
  imageAlt: string;
  gridChildren: ReactNode;
  rightPadding: string;
}

export default function EditorialModelSection({ imageSrc, imageAlt, gridChildren, rightPadding }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "flex-start" }}>

      {/* Editorial photo */}
      <div style={
        isMobile
          ? { width: "100%", overflow: "hidden" }
          : { width: "50%", position: "sticky", top: 0, height: "100vh", overflow: "hidden", flexShrink: 0, backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }
      }>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={imageAlt}
          style={
            isMobile
              ? { width: "100%", height: "auto", display: "block" }
              : { width: "100%", height: "100%", objectFit: "contain", objectPosition: "center top", display: "block" }
          }
        />
      </div>

      {/* Products grid */}
      <div style={
        isMobile
          ? { width: "100%", padding: "1.5rem 1.25rem" }
          : { width: "50%", paddingLeft: "2rem", paddingRight: rightPadding, paddingTop: "2.5rem", paddingBottom: "2.5rem" }
      }>
        {gridChildren}
      </div>

    </div>
  );
}
