import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Local Vibes POS | Restaurant Management System",
  description:
    "Local Vibes POS is a complete restaurant management solution featuring point-of-sale billing, order management, table management, reservations, kitchen operations, inventory tracking, expense management, reporting, and business analytics.",
  keywords: [
    "restaurant POS",
    "restaurant management system",
    "point of sale",
    "restaurant billing software",
    "table management",
    "reservation management",
    "kitchen order management",
    "inventory management",
    "restaurant analytics",
    "expense tracking",
    "multi-branch restaurant software",
    "thermal receipt printing",
    "Local Vibes POS",
  ],
  applicationName: "Local Vibes",
  creator: "Local Vibes",
  publisher: "Cornor Tech Pvt. Ltd",
  category: "Business",
  robots: {
    index: true,
    follow: true,
  },
  other: {
    developer: "Gaurav Karki",
    company: "Corner Tech Pvt. Ltd",
    copyright: `© ${new Date().getFullYear()} Corner Tech Pvt. Ltd`,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Local Vibes POS",
    description:
      "Modern restaurant point-of-sale and management platform for billing, orders, tables, reservations, inventory, expenses, and analytics.",
    type: "website",
    siteName: "Local Vibes POS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Local Vibes POS",
    description:
      "Complete restaurant management system with POS, tables, reservations, kitchen operations, reporting, and analytics.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
