import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { business } from "@/content/business";
import { getLook } from "@/lib/catalog";
import { siteUrl } from "@/lib/site-url";
import { sans, serif } from "./fonts";
import "./globals.css";

const description = "Солонгос арьс арчилгаа: 100% нунтаг серум, дусал ч усгүй ролл маск, Cosdiy-6 иж бүрдэл. Улаанбаатарт 24–48 цагт хүргэнэ; QPay, данс, Lend.mn, StorePay-ээр төлнө.";
const og = getLook("roll-mask").image;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${business.name}: ${business.tagline}`, template: `%s · ${business.name}` },
  description,
  openGraph: { type: "website", locale: "mn_MN", siteName: business.name, description, images: [{ url: og.src, width: og.w, height: og.h }] },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#fdfcfa" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn" className={`${serif.variable} ${sans.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-pearl">
          Үндсэн агуулга руу
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
