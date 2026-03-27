import Image from "next/image";
import Link from "next/link";

// 3 lines — update each line to your own brand description
const BRAND_LINES = [
  "Adjiano is unveiling a new era of headwear, inspired by culture, confidence and craft.",
  "The Silk Collection, The Velvet Collection and Modern Essentials are here to bring",
  "a refined, bold and personal touch to every look.",
];

// Drop your 4 editorial photos into /public/images/editorial/
// Name them editorial-1.jpg through editorial-4.jpg
const editorialImages = [
  { id: 1, alt: "Silver Velvet Durag" },
  { id: 2, alt: "Green Velvet Durag" },
  { id: 3, alt: "Red Velvet Durag" },
  { id: 4, alt: "Gold Velvet Durag" },
];

export default function EditorialSection() {
  return (
    <section className="bg-white">
      {/* Text block */}
      <div
        className="flex flex-col items-center text-center adj-editorial-pad"
        style={{ padding: "6rem 2rem 4rem" }}
      >
        <div
          className="text-black text-center"
          style={{
            fontFamily: "var(--font-inria)",
            fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)",
            fontWeight: 400,
            maxWidth: "860px",
            lineHeight: 1.8,
          }}
        >
          {BRAND_LINES.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {/* OUR DURAGS link */}
        <Link
          href="/collections"
          className="text-black uppercase hover:opacity-50 transition-opacity"
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.2em",
            borderBottom: "1px solid black",
            paddingBottom: "2px",
            marginTop: "3rem",
          }}
        >
          Our Durags
        </Link>
      </div>

      {/* 4-column editorial photo grid (2-col on mobile) */}
      <div className="grid grid-cols-4 adj-grid-2 adj-editorial-grid" style={{ gap: "4px", paddingBottom: "5rem" }}>
        {editorialImages.map((img) => (
          <div
            key={img.id}
            className="relative"
            style={{ aspectRatio: "3/4", backgroundColor: "#e0e0e0" }}
          >
            <Image
              src={`/images/editorial/editorial-${img.id}.jpg`}
              alt={img.alt}
              fill
              className="object-cover object-center"
              sizes="25vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
