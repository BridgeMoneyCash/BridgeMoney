import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BRAND } from "@/config/brand";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { WalletUiProvider } from "@/components/wallet/WalletUi";
import { Sidebar, MobileNav } from "@/components/shell/Nav";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: { default: `${BRAND.name} · ${BRAND.slogan}`, template: `%s · ${BRAND.name}` },
  description: BRAND.description,
  openGraph: {
    title: `${BRAND.name} · ${BRAND.slogan}`,
    description: BRAND.description,
    url: BRAND.url,
    siteName: BRAND.name,
    images: [{ url: "/brand/og.webp", width: 1200, height: 630, alt: BRAND.name }],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${BRAND.xHandle}`,
    title: `${BRAND.name} · ${BRAND.slogan}`,
    description: BRAND.description,
    images: ["/brand/og.webp"],
  },
};

export const viewport: Viewport = { themeColor: "#070707", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <WalletProvider>
          <WalletUiProvider>
            <div className="min-h-dvh md:pl-16">
              <Sidebar />
              <MobileNav />
              <Header />
              <main className="mx-auto w-full max-w-7xl px-4 pt-6 pb-24 sm:px-6 md:pb-10">{children}</main>
              <Footer />
            </div>
          </WalletUiProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
