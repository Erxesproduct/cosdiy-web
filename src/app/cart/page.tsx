import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";

export const metadata: Metadata = { title: "Сагс", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="wrap pt-10 md:pt-14">
      <p className="eyebrow text-azure">Захиалга</p>
      <h1 className="serif mt-3 mb-10 text-5xl md:text-6xl">Таны сагс</h1>
      <Checkout />
    </div>
  );
}
