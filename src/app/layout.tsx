import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const viewport: Viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "BudgetWise 0G • Autonomous On-Chain Budgeting & 0G Storage Protocol",
  description: "Decentralized on-chain budget enforcement, verifiable encrypted expense receipts on 0G Storage, and autonomous AI-driven spending optimization on 0G Galileo.",
  keywords: ["0G", "ZeroGravity", "BudgetWise", "Web3 Budget", "0G Storage", "0G AI", "0G Galileo", "Crypto Finance"],
  authors: [{ name: "BudgetWise 0G Team" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "BudgetWise 0G",
    description: "Decentralized On-Chain Budgeting & Verifiable 0G Storage Receipts",
    url: "https://budgetwise-0g.vercel.app",
    siteName: "BudgetWise 0G",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BudgetWise 0G",
    description: "Autonomous On-Chain Budgeting & 0G Storage Protocol",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-[#050508] text-slate-100 min-h-screen selection:bg-purple-500/30 antialiased overflow-x-hidden`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
