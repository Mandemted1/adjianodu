import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Hero image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero-main.jpg"
          alt="ADJIANO - Never Blend In"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
      </div>

      {/* NEVER BLEND IN — sits higher up */}
      <div className="absolute bottom-36 md:bottom-44 left-0 right-0 flex justify-center">
        <h1
          className="text-white font-light leading-none"
          style={{
            fontSize: "clamp(2.5rem, 6.5vw, 6rem)",
            fontFamily: "var(--font-inria)",
            fontStyle: "italic",
            fontWeight: 300,
            letterSpacing: "0.02em",
          }}
        >
          NEVER BLEND IN
        </h1>
      </div>

      {/* SHOP button — sits lower */}
      <div className="absolute bottom-20 md:bottom-24 left-0 right-0 flex justify-center">
        <Link
          href="/collections"
          className="inline-flex items-center justify-center border border-white text-white uppercase font-light tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-300"
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "11px",
            width: "340px",
            height: "56px",
          }}
        >
          Shop
        </Link>
      </div>
    </section>
  );
}
