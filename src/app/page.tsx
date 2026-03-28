export const dynamic = "force-dynamic";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import CollectionsMenu from "@/components/home/CollectionsMenu";
import Bestsellers from "@/components/home/Bestsellers";
import DiscoverSection from "@/components/home/DiscoverSection";
import EditorialSection from "@/components/home/EditorialSection";
import VelvetCollection from "@/components/home/VelvetCollection";
import SplitEditorial from "@/components/home/SplitEditorial";
import Footer from "@/components/layout/Footer";
import { getAllProducts } from "@/lib/products";
import { getCategoryTree } from "@/lib/categories";

export default async function HomePage() {
  const [allProducts, tree] = await Promise.all([getAllProducts(), getCategoryTree()]);
  const featuredProducts = allProducts.filter((p) => p.featured).slice(0, 6);

  return (
    <>
      <Navbar hasHero />
      <main>
        <Hero />
        <CollectionsMenu tree={tree} />
        <Bestsellers products={featuredProducts} />
        <DiscoverSection />
        <EditorialSection />
        <VelvetCollection />
        <SplitEditorial />
      </main>
      <Footer />
    </>
  );
}
