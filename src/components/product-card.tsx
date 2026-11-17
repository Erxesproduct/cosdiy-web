import Image from "next/image";
import Link from "next/link";
import { getCategory, lowStock, soldOut, type Product } from "@/lib/catalog";
import { Price } from "./price";
import { QuickAdd } from "./quick-add";

/** Packshot on a pearl-to-mist field; the second photo fades in on hover. */
export function ProductCard({ p, priority }: { p: Product; priority?: boolean }) {
  const [a, b] = p.images;
  const label = p.brand ?? getCategory(p.category)?.name;
  return (
    <article className="group relative flex h-full flex-col">
      <Link href={`/p/${p.slug}`} className="field sheen relative block aspect-[4/5] overflow-hidden rounded-[22px] ring-1 ring-line/70 transition duration-500 group-hover:shadow-[0_30px_60px_-30px_rgb(20_28_51/0.35)]">
        <Image src={a.thumb.src} alt={p.name} fill priority={priority} sizes="(min-width: 1024px) 23vw, (min-width: 640px) 31vw, 46vw" className={`object-contain p-[9%] mix-blend-multiply transition duration-700 group-hover:scale-[1.04] ${b ? "group-hover:opacity-0" : ""}`} />
        {b && <Image src={b.thumb.src} alt="" fill sizes="(min-width: 1024px) 23vw, (min-width: 640px) 31vw, 46vw" className="scale-[1.04] object-cover opacity-0 transition duration-700 group-hover:scale-100 group-hover:opacity-100" />}
        <span className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {p.featured && <span className="eyebrow rounded-full bg-pearl/90 px-2.5 py-1 text-[9px] text-azure shadow-sm">Онцлох</span>}
          {soldOut(p) && <span className="eyebrow rounded-full bg-ink px-2.5 py-1 text-[9px] text-pearl">Дууссан</span>}
          {lowStock(p) && <span className="eyebrow rounded-full bg-blush px-2.5 py-1 text-[9px] text-ink">{p.stock} үлдсэн</span>}
        </span>
      </Link>
      <div className="flex flex-1 flex-col px-1 pt-4">
        {label && <span className="eyebrow truncate text-[9.5px] text-mute">{label}</span>}
        <Link href={`/p/${p.slug}`} className="serif mt-1 text-[1.3rem] leading-[1.15] transition hover:text-azure">
          {p.name}
        </Link>
        {p.subtitle && <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-ink-2">{p.subtitle}</p>}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <Price p={p} />
          <QuickAdd slug={p.slug} name={p.name} />
        </div>
      </div>
    </article>
  );
}
