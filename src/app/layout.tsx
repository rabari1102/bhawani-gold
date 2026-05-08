import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bhawani Jewellers | Premium Gold & Platinum Jewellery in Palghar",
  description: "Bhawani Jewellers - Family-owned jewellery enterprise in Palghar specializing in premium handcrafted gold, platinum, gemstone, and diamond jewellery. Visit our showroom today.",
  keywords: "jewellery, gold jewellery, platinum jewellery, Palghar, Bhawani Jewellers, bridal jewellery, diamond jewellery",
  openGraph: {
    title: "Bhawani Jewellers | Premium Gold & Platinum Jewellery in Palghar",
    description: "Exquisite gold, platinum and gemstone pieces crafted with traditional Indian techniques and modern elegance.",
    type: "website",
    locale: "en_IN",
  },
};

import GlobalClickEffect from "@/components/admin/GlobalClickEffect";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import ScrollToTop from "@/components/public/ScrollToTop";
import AppDownloadBanner from "@/components/public/AppDownloadBanner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <GlobalClickEffect />
        <WhatsAppFloat />
        <ScrollToTop />
        <AppDownloadBanner />
        {children}
      </body>
    </html>
  );
}
