import Image from "next/image";
import Link from "next/link";

// Drop your velvet durag images into /public/images/velvet/
// Name them velvet-1.png through velvet-5.png (transparent background recommended)
const durags = [
  { id: 1, alt: "Blue Velvet Durag" },
  { id: 2, alt: "Grey Velvet Durag" },
  { id: 3, alt: "Gold Velvet Durag" },
  { id: 4, alt: "Brown Velvet Durag" },
  { id: 5, alt: "Green Velvet Durag" },
];

export default function VelvetCollection() {
  return (
    <section className="bg-white" style={{ paddingTop: "5rem", paddingBottom: "5rem", overflow: "hidden" }}>

      {/* Title */}
      <div className="flex justify-center" style={{ marginBottom: "4rem" }}>
        <Link
          href="/collections/velvet"
          className="text-black uppercase hover:opacity-50 transition-opacity"
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.2em",
            borderBottom: "1px solid black",
            paddingBottom: "2px",
          }}
        >
          Discover Our Velvet Collection
        </Link>
      </div>

      {/* 5 durags — horizontal scroll on mobile, full-width spread on desktop */}
      <div
        className="flex items-center justify-between adj-scroll-x"
        style={{ paddingLeft: "0", paddingRight: "0" }}
      >
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

    </section>
  );
}
