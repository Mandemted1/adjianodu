import type { Metadata } from "next";
import { Inria_Serif, Montserrat, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inriaSerif = Inria_Serif({
  variable: "--font-inria",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "ADJIANO",
  description: "Never Blend In. Premium durags and headwear.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inriaSerif.variable} ${montserrat.variable} ${bodoniModa.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-black antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
