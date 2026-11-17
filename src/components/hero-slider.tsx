"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";

export type Slide = {
  src: string;
  alt: string;
  /** Label over the photo. */
  label: string;
  /** Where the photo's crop should focus (CSS object-position). */
  focus?: string;
  product: { slug: string; name: string; thumb: string; price: number; brand: string } | null;
};

/** Each portrait stays 7 s, then cross-fades for 2.2 s with a slow zoom. It runs by itself; no controls. */
const EVERY = 7000;

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((n) => (n + 1) % slides.length), EVERY);
    return () => clearTimeout(t);
  }, [i, slides.length]);

  const card = slides[i].product;

  return (
    <div className="relative mx-auto w-full max-w-[540px] pt-4 pr-4 md:pt-6 md:pr-6">
      {/* champagne outline frame offset behind the photo */}
      <div className="absolute inset-0 top-0 right-0 bottom-4 left-4 rounded-tl-[160px] rounded-br-[160px] border border-champagne/70 md:bottom-6 md:left-6" aria-hidden />
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-tl-[160px] rounded-br-[160px] bg-mist shadow-[0_50px_100px_-40px_rgb(20_28_51/0.45)]"
        role="region"
        aria-roledescription="carousel"
        aria-label="Cosdiy зургууд"
      >
        {slides.map((s, k) => (
          <div key={s.src} className={`absolute inset-0 transition-opacity duration-[2200ms] ease-in-out ${k === i ? "opacity-100" : "opacity-0"}`} aria-hidden={k !== i}>
            <Image src={s.src} alt={s.alt} fill priority={k === 0} sizes="(min-width: 768px) 520px, 92vw" className={`object-cover ${k === i ? "kenburns" : ""}`} style={{ objectPosition: s.focus ?? "center" }} />
          </div>
        ))}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/45 to-transparent" />
        <p key={slides[i].label} className="serif rise absolute bottom-7 left-8 max-w-[60%] text-2xl leading-tight text-pearl italic drop-shadow">
          {slides[i].label}
        </p>
      </div>

      {/* vertical counter with a line that fills until the next photo */}
      <div className="absolute top-1/2 -right-1 hidden -translate-y-1/2 flex-col items-center gap-3 md:-right-6 md:flex" aria-hidden>
        <span className="tnum serif text-sm text-ink">{String(i + 1).padStart(2, "0")}</span>
        <span className="relative h-24 w-px overflow-hidden bg-line">
          <span key={i} className="slide-progress-y absolute inset-x-0 top-0 h-full bg-azure" style={{ "--dur": `${EVERY}ms` } as React.CSSProperties} />
        </span>
        <span className="tnum serif text-sm text-mute">{String(slides.length).padStart(2, "0")}</span>
      </div>
      <div className="mx-auto mt-6 flex max-w-[200px] items-center gap-3 md:hidden" aria-hidden>
        <span className="tnum serif text-sm">{String(i + 1).padStart(2, "0")}</span>
        <span className="relative h-px flex-1 overflow-hidden bg-line">
          <span key={i} className="slide-progress absolute inset-0 bg-azure" style={{ "--dur": `${EVERY}ms` } as React.CSSProperties} />
        </span>
        <span className="tnum serif text-sm text-mute">{String(slides.length).padStart(2, "0")}</span>
      </div>

      {card && (
        <Link
          key={card.slug}
          href={`/p/${card.slug}`}
          className="rise absolute bottom-16 -left-2 flex max-w-[80%] items-center gap-3 rounded-2xl bg-pearl/90 p-2.5 pr-5 shadow-[0_24px_50px_-24px_rgb(20_28_51/0.5)] ring-1 ring-white backdrop-blur-md md:-left-12"
        >
          <span className="field relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
            <Image src={card.thumb} alt="" fill sizes="56px" className="object-contain p-1" />
          </span>
          <span className="min-w-0">
            <span className="eyebrow block truncate text-[9.5px] text-mute">{card.brand}</span>
            <span className="serif block truncate text-[17px] leading-tight">{card.name}</span>
            <span className="tnum text-[13px] font-semibold text-azure">{formatPrice(card.price)}</span>
          </span>
        </Link>
      )}
    </div>
  );
}
