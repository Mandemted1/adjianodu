import Link from "next/link";
import type { Category } from "@/lib/categories";

export default function CollectionsMenu({ tree }: { tree: Category[] }) {
  // Show only top-level categories that have a homepage_label set, up to 3
  const items = tree.filter((c) => c.homepage_label).slice(0, 3);

  // Fallback: if no labels set yet, show first 3 categories by name
  const display = items.length > 0 ? items : tree.slice(0, 3);

  if (display.length === 0) return null;

  return (
    <section className="bg-white flex flex-col items-center justify-center" style={{ paddingTop: "clamp(3rem, 13.3vw, 12rem)", paddingBottom: "clamp(3rem, 13.3vw, 12rem)", gap: "clamp(1rem, 3.9vw, 3.5rem)" }}>
      {display.map((parent) => (
        <div key={parent.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(0.3rem, 1vw, 0.75rem)" }}>
          <Link
            href={`/collections?cat=${parent.id}`}
            className="text-black text-center leading-none"
            style={{ fontFamily: "var(--font-bodoni)", fontSize: "clamp(1.5rem, 7vw, 5.5rem)", fontWeight: 400, letterSpacing: "0.01em", textDecoration: "none" }}
          >
            {(parent.homepage_label ?? parent.name).toUpperCase()}
          </Link>
          {(parent.children ?? []).length > 0 && (
            <div style={{ display: "flex", gap: "clamp(0.75rem, 2vw, 2rem)" }}>
              {(parent.children ?? []).map((child) => (
                <Link
                  key={child.id}
                  href={`/collections?cat=${child.id}`}
                  style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(8px, 1vw, 11px)", letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", textDecoration: "none" }}
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
