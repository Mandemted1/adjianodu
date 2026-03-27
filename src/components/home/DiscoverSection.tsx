import Image from "next/image";
import Link from "next/link";

export default function DiscoverSection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "90vh", minHeight: "500px" }}>
      {/* Editorial image — drop your photo as /public/images/discover.jpg */}
      <Image
        src="/images/discover.jpg"
        alt="Adjiano — Discover the collection"
        fill
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* DISCOVER button — centered near bottom */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center">
        <Link
          href="/collections"
          className="inline-flex items-center justify-center border border-white text-white uppercase hover:bg-white hover:text-black transition-all duration-300"
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "11px",
            fontWeight: 400,
            letterSpacing: "0.35em",
            width: "340px",
            height: "56px",
          }}
        >
          Discover
        </Link>
      </div>
    </section>
  );
}
