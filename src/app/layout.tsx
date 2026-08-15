import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Claude Projects Marketplace",
    template: "%s · Claude Projects Marketplace",
  },
  description:
    "Browse finished projects built on Claude, preview each marketing plan, and buy the ones you want to run with.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Claude Projects Marketplace",
    description:
      "Browse finished projects built on Claude, preview each marketing plan, and buy the ones you want to run with.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-paper font-sans antialiased">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
