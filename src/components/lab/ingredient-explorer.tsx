"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { IngredientTag, Motif, SkinId } from "@/content/ingredients";
import { formatPrice } from "@/lib/format";
import { IngredientArt } from "../ingredient-art";
import { CloseIcon, SparkleIcon } from "../icons";
import { QuickAdd } from "../quick-add";

export type IngProduct = { slug: string; name: string; brand: string | null; price: number; thumb: string; quote: string | null };
export type IngCard = {
  id: string;
  name: string;
  en: string;
  tags: IngredientTag[];
  skin: SkinId[];
  what: string;
  for: string;
  motif: Motif;
  tint: [string, string];
  products: IngProduct[];
};

type Props = { items: IngCard[]; tags: Record<IngredientTag, string>; skins: Record<SkinId, string> };

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

export function IngredientExplorer({ items, tags, skins }: Props) {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<IngredientTag | null>(null);
  const [skin, setSkin] = useState<SkinId | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  // deep link: /lab/ingredients#collagen
  useEffect(() => {
    const read = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      setOpen(items.some((i) => i.id === id) ? id : null);
    };
    read();
    addEventListener("hashchange", read);
    return () => removeEventListener("hashchange", read);
  }, [items]);

  const show = (id: string | null) => {
    setOpen(id);
    history.replaceState(null, "", id ? `#${id}` : location.pathname);
  };

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(null);
      history.replaceState(null, "", location.pathname);
    };
    addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open]);

  const list = useMemo(() => {
    const n = norm(q);
    return items.filter(
      (i) =>
        (!tag || i.tags.includes(tag)) &&
        (!skin || i.skin.includes(skin)) &&
        (!n || norm(`${i.name} ${i.en} ${i.what} ${i.for} ${i.products.map((p) => p.name).join(" ")}`).includes(n)),
    );
  }, [items, q, tag, skin]);

  const cur = items.find((i) => i.id === open) ?? null;

  return (
    <div>
      {/* search + filters */}
      <div className="rounded-[26px] bg-pearl p-4 ring-1 ring-line md:p-5">
        <label className="relative block">
          <span className="sr-only">Найрлага хайх</span>
          <svg className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-mute" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Коллаген, алоэ, niacinamide… эсвэл бүтээгдэхүүний нэр"
            className="h-12 w-full rounded-full bg-porcelain pr-4 pl-11 text-[15px] ring-1 ring-line outline-none placeholder:text-mute focus:ring-2 focus:ring-azure"
          />
        </label>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-1 text-[10px] text-mute">Үйлчилгээ</span>
          {(Object.keys(tags) as IngredientTag[]).map((t) => (
            <button key={t} type="button" aria-pressed={tag === t} onClick={() => setTag(tag === t ? null : t)} className="rounded-full px-3.5 py-1.5 text-[13px] font-medium ring-1 ring-line transition hover:ring-ink aria-pressed:bg-ink aria-pressed:text-pearl aria-pressed:ring-ink">
              {tags[t]}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-1 text-[10px] text-mute">Арьс</span>
          {(Object.keys(skins) as SkinId[]).map((s) => (
            <button key={s} type="button" aria-pressed={skin === s} onClick={() => setSkin(skin === s ? null : s)} className="rounded-full px-3.5 py-1.5 text-[13px] font-medium ring-1 ring-line transition hover:ring-azure aria-pressed:bg-azure aria-pressed:text-pearl aria-pressed:ring-azure">
              {skins[s]}
            </button>
          ))}
          {(tag || skin || q) && (
            <button type="button" onClick={() => (setTag(null), setSkin(null), setQ(""))} className="ml-auto text-[12.5px] font-semibold text-azure underline-offset-2 hover:underline">
              Цэвэрлэх
            </button>
          )}
        </div>
      </div>

      <p className="tnum mt-6 text-[13px] text-mute" aria-live="polite">
        {list.length} найрлага
      </p>

      {list.length ? (
        <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
          {list.map((i) => (
            <li key={i.id}>
              <button type="button" onClick={() => show(i.id)} className="group flex h-full w-full flex-col rounded-[26px] bg-pearl p-3 text-left ring-1 ring-line transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-36px_rgb(20_28_51/0.45)] md:p-4">
                <span className="relative block aspect-square overflow-hidden rounded-[20px]" style={{ background: `linear-gradient(160deg, ${i.tint[0]}, #fff)` }}>
                  <IngredientArt motif={i.motif} tint={i.tint} className="absolute inset-[9%] transition duration-700 group-hover:scale-105 group-hover:rotate-3" />
                  <span className="tnum absolute top-2.5 right-2.5 rounded-full bg-white/85 px-2 py-0.5 text-[10.5px] font-semibold text-ink-2 backdrop-blur">{i.products.length} бараа</span>
                </span>
                <span className="eyebrow mt-3 block text-[9.5px] text-azure">{i.en}</span>
                <span className="serif mt-0.5 block text-2xl leading-tight">{i.name}</span>
                <span className="mt-1 line-clamp-2 text-[13px] leading-snug text-ink-2">{i.what}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-[22px] bg-pearl p-8 text-center text-ink-2 ring-1 ring-line">Илэрц олдсонгүй. Өөр үгээр хайгаад үзээрэй.</p>
      )}

      {/* detail */}
      {cur && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-labelledby="ing-title">
          <button type="button" aria-label="Хаах" onClick={() => show(null)} className="absolute inset-0 bg-night/55 backdrop-blur-sm" />
          <div className="rise relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-[30px] bg-porcelain md:rounded-[30px]">
            <button type="button" onClick={() => show(null)} aria-label="Хаах" className="absolute top-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-pearl ring-1 ring-line hover:ring-ink">
              <CloseIcon size={18} />
            </button>
            <div className="grid gap-6 p-5 md:grid-cols-[220px_1fr] md:p-8" style={{ background: `linear-gradient(160deg, ${cur.tint[0]}, var(--color-porcelain) 70%)` }}>
              <IngredientArt motif={cur.motif} tint={cur.tint} className="mx-auto w-40 md:w-full" />
              <div className="min-w-0">
                <p className="eyebrow text-[10px] text-azure">{cur.en}</p>
                <h2 id="ing-title" className="serif mt-1 text-5xl leading-none font-light">
                  {cur.name}
                </h2>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {cur.tags.map((t) => (
                    <span key={t} className="rounded-full bg-white/80 px-2.5 py-1 text-[11.5px] font-medium text-ink-2 ring-1 ring-line">
                      {tags[t]}
                    </span>
                  ))}
                </div>
                <dl className="mt-5 space-y-4 text-[15px] leading-relaxed">
                  <div>
                    <dt className="eyebrow text-[10px] text-mute">Юу хийдэг вэ</dt>
                    <dd className="mt-1 text-ink">{cur.what}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-[10px] text-mute">Юунд хэрэгтэй вэ</dt>
                    <dd className="mt-1 text-ink">{cur.for}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-[10px] text-mute">Ямар арьсанд</dt>
                    <dd className="mt-1.5 flex flex-wrap gap-1.5">
                      {(Object.keys(skins) as SkinId[]).map((s) => (
                        <span key={s} className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${cur.skin.includes(s) ? "bg-azure text-pearl" : "text-mute line-through decoration-mute/40 ring-1 ring-line"}`}>
                          {skins[s]}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="p-5 md:p-8">
              <p className="flex items-center gap-2">
                <SparkleIcon size={16} className="text-champagne-2" />
                <span className="serif text-2xl">{cur.name} агуулсан CosDIY бүтээгдэхүүн</span>
              </p>
              <ul className="mt-4 space-y-3">
                {cur.products.map((p) => (
                  <li key={p.slug} className="flex items-center gap-3 rounded-[20px] bg-pearl p-3 ring-1 ring-line md:gap-4">
                    <Link href={`/p/${p.slug}`} className="field relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                      <Image src={p.thumb} alt="" fill sizes="80px" className="object-contain p-1.5 mix-blend-multiply" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      {p.brand && <span className="eyebrow block text-[9.5px] text-mute">{p.brand}</span>}
                      <Link href={`/p/${p.slug}`} className="serif block text-lg leading-tight hover:text-azure">
                        {p.name}
                      </Link>
                      {p.quote && <span className="mt-1 line-clamp-2 block text-[12.5px] leading-snug text-ink-2 italic">“{p.quote}”</span>}
                      <span className="tnum mt-1 block text-[13.5px] font-semibold">{formatPrice(p.price)}</span>
                    </div>
                    <QuickAdd slug={p.slug} name={p.name} />
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[12px] leading-relaxed text-mute">Ишлэл нь бүтээгдэхүүний тайлбараас шууд авсан. Тайлбар нь гоо сайхны ерөнхий мэдээлэл бөгөөд эмчилгээний зөвлөгөө биш.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
