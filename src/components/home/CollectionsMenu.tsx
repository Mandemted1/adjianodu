const collections = [
  "THE SILK COLLECTION",
  "THE VELVET COLLECTION",
  "MODERN ESSENTIALS",
];

export default function CollectionsMenu() {
  return (
    <section className="bg-white flex flex-col items-center justify-center" style={{ paddingTop: "clamp(3rem, 13.3vw, 12rem)", paddingBottom: "clamp(3rem, 13.3vw, 12rem)", gap: "clamp(1rem, 3.9vw, 3.5rem)" }}>
      {collections.map((label) => (
        <p
          key={label}
          className="text-black text-center leading-none"
          style={{
            fontFamily: "var(--font-bodoni)",
            fontSize: "clamp(1.5rem, 7vw, 5.5rem)",
            fontWeight: 400,
            letterSpacing: "0.01em",
          }}
        >
          {label}
        </p>
      ))}
    </section>
  );
}
