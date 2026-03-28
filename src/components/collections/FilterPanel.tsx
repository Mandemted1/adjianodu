"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, SlidersHorizontal } from "lucide-react";
import type { Category } from "@/lib/categories";

const colorMap: Record<string, string> = {
  Ash: "#b5b0a6", Blue: "#2563eb", White: "#f5f5f5", Gold: "#c9961a",
  Black: "#111111", Grey: "#888888", Green: "#166534", Navy: "#1e3a5f",
  Brown: "#78350f", Red: "#991b1b", Pink: "#db2777", Olive: "#4d5e1e",
  Purple: "#6b21a8", Orange: "#c2410c", Beige: "#c4a882",
};

interface Props {
  tree: Category[];
  colors: string[];
  priceMin: number;
  priceMax: number;
}

function DualSlider({ globalMin, globalMax, value, onChange }: {
  globalMin: number; globalMax: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [min, max] = value;
  const pct = (v: number) => ((v - globalMin) / (globalMax - globalMin)) * 100;

  return (
    <div>
      <style>{`
        .adj-range { -webkit-appearance:none; width:100%; height:2px; background:transparent; outline:none; position:absolute; top:0; left:0; pointer-events:none; }
        .adj-range::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#000; cursor:pointer; pointer-events:all; border:2px solid #fff; box-shadow:0 0 0 1px #000; }
        .adj-range::-moz-range-thumb { width:14px; height:14px; border-radius:50%; background:#000; cursor:pointer; pointer-events:all; border:2px solid #fff; box-shadow:0 0 0 1px #000; }
      `}</style>
      <div style={{ position: "relative", height: "18px", margin: "8px 4px" }}>
        {/* Track */}
        <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", width: "100%", height: "2px",
          background: `linear-gradient(to right, #e0e0e0 ${pct(min)}%, #000 ${pct(min)}%, #000 ${pct(max)}%, #e0e0e0 ${pct(max)}%)` }} />
        <input type="range" className="adj-range" min={globalMin} max={globalMax} step={10} value={min}
          style={{ zIndex: min > globalMax * 0.9 ? 3 : 1 }}
          onChange={(e) => onChange([Math.min(+e.target.value, max - 10), max])} />
        <input type="range" className="adj-range" min={globalMin} max={globalMax} step={10} value={max}
          style={{ zIndex: 2 }}
          onChange={(e) => onChange([min, Math.max(+e.target.value, min + 10)])} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#555" }}>GHS {min}</span>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#555" }}>GHS {max}</span>
      </div>
    </div>
  );
}

export default function FilterPanel({ tree, colors, priceMin, priceMax }: Props) {
  const router     = useRouter();
  const pathname   = usePathname();
  const params     = useSearchParams();
  const [open, setOpen] = useState(false);

  const currentCat    = params.get("cat") ?? "";
  const currentColors = params.get("colors")?.split(",").filter(Boolean) ?? [];
  const currentMin    = Number(params.get("minPrice") ?? priceMin);
  const currentMax    = Number(params.get("maxPrice") ?? priceMax);

  const [selCat,    setSelCat]    = useState(currentCat);
  const [selColors, setSelColors] = useState<string[]>(currentColors);
  const [price,     setPrice]     = useState<[number, number]>([currentMin, currentMax]);

  // Sync with URL when panel opens
  useEffect(() => {
    if (open) {
      setSelCat(params.get("cat") ?? "");
      setSelColors(params.get("colors")?.split(",").filter(Boolean) ?? []);
      setPrice([Number(params.get("minPrice") ?? priceMin), Number(params.get("maxPrice") ?? priceMax)]);
    }
  }, [open, params, priceMin, priceMax]);

  const toggleColor = (c: string) =>
    setSelColors((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const activeCount =
    (selCat ? 1 : 0) +
    selColors.length +
    (price[0] > priceMin || price[1] < priceMax ? 1 : 0);

  const apply = useCallback(() => {
    const p = new URLSearchParams();
    if (selCat) p.set("cat", selCat);
    if (selColors.length) p.set("colors", selColors.join(","));
    if (price[0] > priceMin) p.set("minPrice", String(price[0]));
    if (price[1] < priceMax) p.set("maxPrice", String(price[1]));
    router.push(`${pathname}${p.toString() ? `?${p}` : ""}`);
    setOpen(false);
  }, [selCat, selColors, price, priceMin, priceMax, pathname, router]);

  const clear = () => {
    setSelCat(""); setSelColors([]); setPrice([priceMin, priceMax]);
  };

  return (
    <>
      {/* Trigger button */}
      <button onClick={() => setOpen(true)}
        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "none", border: "1px solid #000", padding: "0.5rem 1rem", cursor: "pointer", fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
        <SlidersHorizontal size={12} strokeWidth={1.5} />
        Filters{activeCount > 0 ? ` (${activeCount})` : ""}
      </button>

      {/* Backdrop */}
      {open && (
        <div onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 40, backdropFilter: "blur(1px)" }} />
      )}

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 50,
        width: "clamp(300px, 90vw, 420px)",
        backgroundColor: "#fff",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.08)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem", borderBottom: "1px solid #f0f0f0" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>Filters</p>
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#555" }}>
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>

          {/* Category */}
          {tree.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>Category</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0", cursor: "pointer", borderBottom: "1px solid #f5f5f5" }}>
                  <input type="radio" name="cat" checked={selCat === ""} onChange={() => setSelCat("")}
                    style={{ accentColor: "#000", width: "14px", height: "14px" }} />
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", letterSpacing: "0.08em" }}>All</span>
                </label>
                {tree.map((parent) => (
                  <div key={parent.id}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0", cursor: "pointer", borderBottom: "1px solid #f5f5f5" }}>
                      <input type="radio" name="cat" checked={selCat === parent.id} onChange={() => setSelCat(parent.id)}
                        style={{ accentColor: "#000", width: "14px", height: "14px" }} />
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{parent.name}</span>
                    </label>
                    {(parent.children ?? []).map((child) => (
                      <label key={child.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0 0.5rem 1.5rem", cursor: "pointer", borderBottom: "1px solid #f5f5f5" }}>
                        <input type="radio" name="cat" checked={selCat === child.id} onChange={() => setSelCat(child.id)}
                          style={{ accentColor: "#000", width: "14px", height: "14px" }} />
                        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#555", letterSpacing: "0.08em" }}>{child.name}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Colour */}
          {colors.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>Colour</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {colors.map((color) => {
                  const active = selColors.includes(color);
                  const hex    = colorMap[color] ?? "#ccc";
                  return (
                    <button key={color} onClick={() => toggleColor(color)}
                      title={color}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      <div style={{
                        width: "28px", height: "28px", borderRadius: "50%",
                        backgroundColor: hex,
                        border: active ? "2px solid #000" : "2px solid transparent",
                        outline: active ? "1px solid #000" : "1px solid #e0e0e0",
                        outlineOffset: "2px",
                        boxSizing: "border-box",
                      }} />
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "8px", letterSpacing: "0.08em", color: active ? "#000" : "#888", textTransform: "uppercase" }}>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price */}
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.25rem" }}>Price</p>
            <DualSlider globalMin={priceMin} globalMax={priceMax} value={price} onChange={setPrice} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid #f0f0f0", display: "flex", gap: "0.75rem" }}>
          <button onClick={clear}
            style={{ flex: 1, backgroundColor: "transparent", color: "#000", border: "1px solid #e0e0e0", padding: "0.75rem", fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
            Clear All
          </button>
          <button onClick={apply}
            style={{ flex: 2, backgroundColor: "#000", color: "#fff", border: "none", padding: "0.75rem", fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
            Apply
          </button>
        </div>
      </div>
    </>
  );
}
