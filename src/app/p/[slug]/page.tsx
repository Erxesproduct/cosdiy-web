import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/buy-box";
import { Gallery } from "@/components/gallery";
import { IngredientArt } from "@/components/ingredient-art";
import { LiteVideo } from "@/components/lite-video";
import { INGREDIENTS } from "@/content/ingredients";
import { videoFor } from "@/content/videos";
import { ingredientsOf } from "@/lib/lab";
import { CheckIcon, ShieldIcon, SparkleIcon, TruckIcon } from "@/components/icons";
import { Price } from "@/components/price";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { business } from "@/content/business";
import { getCategory, getProduct, inCategory, lowStock, products, RITUAL, soldOut, sku, summary, type Block } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const img = p.images[0];
  return {
    title: p.subtitle ? `${p.name}: ${p.subtitle.split(" · ")[0]}` : p.name,
    description: summary(p) || `${p.name}: ${formatPrice(p.price)}`,
    alternates: { canonical: `/p/${p.slug}` },
    openGraph: { title: p.name, images: [{ url: img.src, width: img.w, height: img.h }] },
  };
}

/** Consecutive bullets / steps grouped into lists. */
function group(blocks: Block[]) {
  const out: (Block | { t: "ul" | "ol"; items: string[] })[] = [];
  for (const b of blocks) {
    const kind = b.t === "li" ? "ul" : b.t === "step" ? "ol" : null;
    const last = out[out.length - 1];
    if (kind && last && "items" in last && last.t === kind) last.items.push(b.text);
    else if (kind) out.push({ t: kind, items: [b.text] });
    else out.push(b);
  }
  return out;
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const c = getCategory(p.category)!;
  const siblings = inCategory(p.category).filter((x) => x.slug !== p.slug && !soldOut(x));
  const more = [...siblings, ...products.filter((x) => x.category !== p.category && x.featured && !soldOut(x))].slice(0, 4);
  const ritualStep = RITUAL.findIndex((r) => r.slug === p.slug);
  const set = getProduct("cosdiy-6-set")!;
  const isSet = p.setItems.length > 0;
  const body = group(p.details);
  const keyIng = ingredientsOf(p).map((id) => INGREDIENTS.find((i) => i.id === id)!);
  const video = videoFor(p.slug);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: sku(p),
    image: p.images.map((m) => absoluteUrl(m.src)),
    description: summary(p),
    brand: { "@type": "Brand", name: p.brand ?? business.name },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "MNT",
      availability: soldOut(p) ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: absoluteUrl(`/p/${p.slug}`),
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="wrap pt-6 md:pt-10">
        <nav aria-label="Зам" className="eyebrow text-[10px] text-mute">
          <Link href="/shop" className="hover:text-ink">
            Дэлгүүр
          </Link>
          <span className="mx-2.5 text-champagne">◆</span>
          <Link href={`/shop?c=${c.id}`} className="hover:text-ink">
            {c.name}
          </Link>
        </nav>

        <div className="mt-6 grid gap-10 md:grid-cols-[1.05fr_1fr] md:gap-14 lg:gap-20">
          <Gallery images={p.images} name={p.name} />

          <div className="min-w-0 md:pt-4">
            {p.brand && (
              <Link href={`/shop?b=${encodeURIComponent(p.brand)}`} className="eyebrow text-azure hover:underline">
                {p.brand}
              </Link>
            )}
            <h1 className="serif mt-3 text-[2.7rem] leading-[1.02] font-light md:text-6xl">{p.name}</h1>
            {p.subtitle && <p className="mt-3 text-[16px] text-ink-2">{p.subtitle}</p>}

            <div className="mt-7 flex flex-wrap items-center gap-4 border-y border-line py-5">
              <Price p={p} large />
              {lowStock(p) && <span className="rounded-full bg-blush px-3 py-1 text-[12.5px] font-semibold">Ердөө {p.stock} үлдсэн</span>}
              {p.stock != null && p.stock > 5 && (
                <span className="flex items-center gap-1.5 text-[13px] text-ink-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden /> Бэлэн байгаа
                </span>
              )}
            </div>

            <div className="mt-6">
              <BuyBox slug={p.slug} />
            </div>

            {p.highlights.length > 0 && (
              <section className="mt-9">
                <h2 className="eyebrow text-[10.5px] text-mute">Үйлчилгээ</h2>
                <ul className="mt-4 space-y-3">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-[15px] leading-snug">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mist text-azure">
                        <CheckIcon size={12} />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {keyIng.length > 0 && (
              <section className="mt-9">
                <h2 className="eyebrow text-[10.5px] text-mute">Гол найрлага</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {keyIng.map((i) => (
                    <li key={i.id}>
                      <Link href={`/lab/ingredients#${i.id}`} className="group flex items-center gap-2 rounded-full bg-pearl py-1 pr-3.5 pl-1 text-[13px] font-medium ring-1 ring-line transition hover:ring-azure">
                        <IngredientArt motif={i.motif} tint={i.tint} className="h-7 w-7" />
                        {i.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {isSet && (
              <section className="mt-9 rounded-[24px] bg-pearl p-5 ring-1 ring-line md:p-6">
                <h2 className="serif text-2xl">Иж бүрдэлд багтсан</h2>
                <ol className="mt-4 space-y-2">
                  {RITUAL.map((r, k) => (
                    <li key={r.slug}>
                      <Link href={`/p/${r.slug}`} className="group flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-mist">
                        <span className="serif tnum w-6 text-lg text-champagne italic">{k + 1}</span>
                        <span className="field relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-line">
                          <Image src={r.product.images[0].thumb.src} alt="" fill sizes="44px" className="object-contain p-1 mix-blend-multiply" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14.5px] font-semibold group-hover:text-azure">{r.product.name}</span>
                          <span className="block text-[12px] text-mute">{[r.step, p.setItems[k]?.match(/\(([^)]+)\)/)?.[1]].filter(Boolean).join(" · ")}</span>
                        </span>
                        <span className="tnum text-[13px] text-ink-2">{formatPrice(r.product.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
                <p className="tnum mt-4 border-t border-line pt-4 text-[14px] text-ink-2">
                  Тус тусад нь {formatPrice(RITUAL.reduce((s, r) => s + r.product.price, 0))}, иж бүрдлээр <b className="text-ink">{formatPrice(p.price)}</b>.
                </p>
              </section>
            )}

            {ritualStep >= 0 && (
              <Link href={`/p/${set.slug}`} className="group mt-9 flex items-center gap-4 rounded-[22px] bg-ink p-4 pr-5 text-pearl transition hover:bg-night-2">
                <span className="serif tnum grid h-12 w-12 shrink-0 place-items-center rounded-full border border-champagne/60 text-xl text-champagne italic">{ritualStep + 1}/6</span>
                <span className="min-w-0 flex-1 text-[14px] leading-snug">
                  Cosdiy-6 Set-ийн {ritualStep + 1}-р алхам: <b>{RITUAL[ritualStep].step.toLowerCase()}</b>. Иж бүрдлээр {formatPrice(set.price)}.
                </span>
                <SparkleIcon size={18} className="shrink-0 text-champagne transition group-hover:rotate-45" />
              </Link>
            )}

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              <div className="flex gap-3 rounded-2xl bg-pearl p-4 ring-1 ring-line">
                <TruckIcon size={20} className="mt-0.5 shrink-0 text-azure" />
                <p className="text-[13px] leading-snug text-ink-2">
                  <b className="block text-ink">24–48 цагт хүргэнэ</b>А бүсэд {formatPrice(business.delivery[0].fee)}, холын бүсэд {formatPrice(business.delivery[1].fee)}
                </p>
              </div>
              <div className="flex gap-3 rounded-2xl bg-pearl p-4 ring-1 ring-line">
                <ShieldIcon size={20} className="mt-0.5 shrink-0 text-azure" />
                <p className="text-[13px] leading-snug text-ink-2">
                  <b className="block text-ink">QPay, данс, зээлийн апп</b>Lend.mn, Pocket Zero, StorePay, OmniWay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {body.length > 0 && (
        <section className="mt-20 bg-pearl py-16 md:mt-28 md:py-24">
          <div className="wrap grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <Reveal>
              <p className="eyebrow text-azure">Дэлгэрэнгүй</p>
              <h2 className="serif mt-3 text-4xl leading-tight md:text-5xl">{p.name}</h2>
              <div className="field relative mt-8 hidden aspect-square overflow-hidden rounded-t-[999px] rounded-b-[24px] ring-1 ring-line md:block">
                <Image src={(p.images[1] ?? p.images[0]).src} alt="" fill sizes="35vw" className="object-cover" />
              </div>
            </Reveal>
            <Reveal className="prose-cd text-[16px] leading-relaxed">
              {body.map((b, i) =>
                b.t === "h" ? (
                  <h3 key={i}>{b.text}</h3>
                ) : b.t === "ul" ? (
                  <ul key={i}>
                    {b.items.map((x) => (
                      <li key={x} className="flex gap-3">
                        <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 bg-champagne" aria-hidden />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                ) : b.t === "ol" ? (
                  <ol key={i}>
                    {b.items.map((x, k) => (
                      <li key={x} className="flex gap-4 rounded-2xl bg-porcelain p-4">
                        <span className="serif tnum text-2xl leading-none text-azure italic">{k + 1}</span>
                        <span>{x}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p key={i}>{"text" in b ? b.text : ""}</p>
                ),
              )}
            </Reveal>
          </div>
        </section>
      )}

      {video && (
        <section className="wrap pt-20 md:pt-24">
          <div className="grid items-center gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
            <div>
              <p className="eyebrow text-azure">Видео</p>
              <h2 className="serif mt-3 text-4xl leading-tight">{video.title}</h2>
              <p className="mt-3 text-[15px] text-ink-2">
                {video.caption}. {video.by}-ийн бичлэг.
              </p>
              <Link href="/videos" className="mt-5 inline-block text-[12.5px] font-semibold tracking-[0.14em] uppercase hover:text-azure">
                Бүх видео
              </Link>
            </div>
            <LiteVideo id={video.id} title={video.title} className="rounded-[28px] ring-1 ring-line" />
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section className="wrap pt-20 md:pt-24">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="serif text-3xl md:text-4xl">{siblings.length ? `${c.name}: бусад` : "Танд таалагдаж магадгүй"}</h2>
            <Link href={`/shop?c=${c.id}`} className="text-[12.5px] font-semibold tracking-[0.14em] uppercase hover:text-azure">
              Бүгдийг үзэх
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
            {more.map((x) => (
              <ProductCard key={x.slug} p={x} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
