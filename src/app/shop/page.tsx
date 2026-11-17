import type { Metadata } from "next";
import Link from "next/link";
import { Drops } from "@/components/drops";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { brands, categories, getCategory, products, soldOut, type Product } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Дэлгүүр",
  description: "Cosdiy Mongolia-гийн бүх бүтээгдэхүүн: нунтаг серум, усгүй ролл маск, цэвэрлэгч, тонер, тос, нарны тос, суурь будалт, үс арчилгаа.",
  alternates: { canonical: "/shop" },
};

type Props = { searchParams: Promise<{ c?: string; b?: string; s?: string }> };

const SORTS = [
  { id: "", label: "Ангиллаар" },
  { id: "price-asc", label: "Үнэ ↑" },
  { id: "price-desc", label: "Үнэ ↓" },
  { id: "new", label: "Шинэ" },
] as const;

function sorted(list: Product[], s?: string) {
  const out = [...list];
  if (s === "price-asc") out.sort((a, b) => a.price - b.price);
  else if (s === "price-desc") out.sort((a, b) => b.price - a.price);
  else if (s === "new") out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  // in stock first
  return out.sort((a, b) => Number(soldOut(a)) - Number(soldOut(b)));
}

const href = (q: { c?: string; b?: string; s?: string }) => {
  const sp = new URLSearchParams(Object.entries(q).filter(([, v]) => v) as [string, string][]);
  const str = sp.toString();
  return str ? `/shop?${str}` : "/shop";
};

export default async function Shop({ searchParams }: Props) {
  const { c, b, s } = await searchParams;
  const cat = c ? getCategory(c) : undefined;
  const brand = b && brands.includes(b) ? b : undefined;
  const sort = SORTS.some((x) => x.id === s) ? s : "";
  const list = products.filter((p) => (!cat || p.category === cat.id) && (!brand || p.brand === brand));
  const chapters = !cat && !brand && !sort;

  return (
    <div>
      <section className="relative overflow-hidden bg-[linear-gradient(170deg,var(--color-pearl)_0%,var(--color-mist)_100%)]">
        <Drops count={6} />
        <div className="wrap relative py-14 text-center md:py-20">
          <p className="eyebrow text-azure">{cat?.en ?? (brand ? "Брэнд" : "Shop all")}</p>
          <h1 className="serif rise mt-4 text-5xl leading-tight font-light md:text-7xl">{cat?.name ?? brand ?? "Бүх бүтээгдэхүүн"}</h1>
          <p className="mx-auto mt-4 max-w-xl text-ink-2">{cat?.blurb ?? (brand ? `${brand} брэндийн бүтээгдэхүүнүүд.` : "Цэвэрлэгээнээс нарны тос хүртэл: солонгос арьс арчилгааны бүх алхам.")}</p>
          <p className="tnum mt-6 text-[12px] tracking-[0.2em] text-mute uppercase">{list.length} бүтээгдэхүүн</p>
        </div>
      </section>

      <div className="z-30 border-b border-line bg-porcelain/90 backdrop-blur-md lg:sticky lg:top-[112px]">
        <nav aria-label="Ангилал" className="wrap no-scrollbar flex gap-2 overflow-x-auto py-3 lg:flex-wrap">
          <Pill href={href({ b: brand, s: sort })} active={!cat}>
            Бүгд
          </Pill>
          {categories.map((x) => (
            <Pill key={x.id} href={href({ c: x.id, b: brand, s: sort })} active={cat?.id === x.id}>
              {x.name}
            </Pill>
          ))}
        </nav>
      </div>

      <div className="wrap">
        <div className="flex flex-wrap items-center justify-between gap-4 py-6">
          <div className="no-scrollbar -mx-4 flex items-center gap-x-5 overflow-x-auto px-4 text-[13px] md:mx-0 md:px-0">
            <span className="eyebrow shrink-0 text-[10px] text-mute">Брэнд</span>
            <Link href={href({ c: cat?.id, s: sort })} aria-current={!brand ? "page" : undefined} className={`shrink-0 transition ${!brand ? "font-semibold text-ink underline underline-offset-4" : "text-ink-2 hover:text-ink"}`}>
              Бүгд
            </Link>
            {brands.map((x) => (
              <Link key={x} href={href({ c: cat?.id, b: x, s: sort })} aria-current={brand === x ? "page" : undefined} className={`shrink-0 transition ${brand === x ? "font-semibold text-ink underline underline-offset-4" : "text-ink-2 hover:text-ink"}`}>
                {x}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-1 text-[13px]" role="group" aria-label="Эрэмбэ">
            {SORTS.map((x) => (
              <Link key={x.id} href={href({ c: cat?.id, b: brand, s: x.id })} aria-current={sort === x.id ? "page" : undefined} className={`rounded-full px-3 py-1.5 transition ${sort === x.id ? "bg-ink text-pearl" : "text-ink-2 hover:bg-mist"}`}>
                {x.label}
              </Link>
            ))}
          </div>
        </div>

        {list.length === 0 && (
          <div className="rounded-[28px] bg-pearl py-16 text-center ring-1 ring-line">
            <p className="serif text-3xl">Энэ шүүлтүүрт бараа алга</p>
            <Link href="/shop" className="btn btn-dark mt-6">
              Бүгдийг харах
            </Link>
          </div>
        )}

        {chapters ? (
          <div className="space-y-20 pt-4">
            {categories.map((x, k) => {
              const items = sorted(list.filter((p) => p.category === x.id));
              if (!items.length) return null;
              return (
                <section key={x.id} id={x.id} aria-labelledby={`h-${x.id}`} className="scroll-mt-48">
                  <Reveal className="mb-8 grid gap-3 border-b border-line pb-6 md:grid-cols-[auto_1fr_auto] md:items-end md:gap-8">
                    <span className="serif tnum text-5xl text-champagne italic md:text-6xl">{String(k + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="eyebrow text-[10px] text-mute">{x.en}</p>
                      <h2 id={`h-${x.id}`} className="serif mt-1 text-3xl md:text-4xl">
                        <Link href={href({ c: x.id })} className="transition hover:text-azure">
                          {x.name}
                        </Link>
                      </h2>
                    </div>
                    <p className="max-w-sm text-[14px] text-ink-2">{x.blurb}</p>
                  </Reveal>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
                    {items.map((p, i) => (
                      <Reveal key={p.slug} delay={(i % 4) * 80}>
                        <ProductCard p={p} priority={k === 0 && i < 2} />
                      </Reveal>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 pt-2 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {sorted(list, sort).map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 80}>
                <ProductCard p={p} priority={i < 2} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Pill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition ${active ? "bg-ink text-pearl" : "text-ink-2 ring-1 ring-line hover:bg-pearl hover:text-ink"}`}
    >
      {children}
    </Link>
  );
}
