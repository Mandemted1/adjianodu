"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LayoutGrid, LayoutList } from "lucide-react";

export default function GridToggle() {
  const router     = useRouter();
  const pathname   = usePathname();
  const params     = useSearchParams();
  const view       = params.get("view") ?? "grid";

  const toggle = () => {
    const p = new URLSearchParams(params.toString());
    p.set("view", view === "grid" ? "list" : "grid");
    router.push(`${pathname}?${p.toString()}`);
  };

  return (
    <button
      onClick={toggle}
      title={view === "grid" ? "Switch to list view" : "Switch to grid view"}
      style={{ background: "none", border: "none", cursor: "pointer", color: "#000", display: "flex", alignItems: "center", padding: 0 }}
    >
      {view === "grid"
        ? <LayoutList size={15} strokeWidth={1.5} />
        : <LayoutGrid size={15} strokeWidth={1.5} />
      }
    </button>
  );
}
