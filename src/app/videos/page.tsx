import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LabHero } from "@/components/lab/lab-hero";
import { LabTabs } from "@/components/lab/lab-tabs";
import { LiteVideo } from "@/components/lite-video";
import { VIDEOS } from "@/content/videos";
import { getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Видео",
  description: "Cosdiy-ийн нунтаг серум, тонер, тосны үйлдвэрлэгчийн бичлэгүүд.",
  alternates: { canonical: "/videos" },
};

export default function Videos() {
  return (
    <div>
      <LabTabs />
      <LabHero eyebrow="Videos" title="Хэрхэн" accent="хэрэглэх вэ.">
        Солонгос үйлдвэрлэгч CO KIT Cosmetics-ийн бүтээгдэхүүний бичлэгүүд. Видео дээр дарахад YouTube-ээс тоглоно.
      </LabHero>
      <div className="wrap grid gap-6 py-12 md:grid-cols-2 md:gap-8 md:py-16">
        {VIDEOS.map((v) => {
          const p = v.slug ? getProduct(v.slug) : null;
          return (
            <article key={v.id} className="overflow-hidden rounded-[28px] bg-pearl ring-1 ring-line">
              <LiteVideo id={v.id} title={v.title} />
              <div className="flex items-center gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <p className="eyebrow text-[9.5px] text-mute">{v.by}</p>
                  <h2 className="serif mt-0.5 text-2xl leading-tight">{v.title}</h2>
                  <p className="mt-0.5 text-[13.5px] text-ink-2">{v.caption}</p>
                </div>
                {p && (
                  <Link href={`/p/${p.slug}`} className="group flex shrink-0 items-center gap-2 rounded-2xl p-1.5 pr-3 ring-1 ring-line hover:ring-ink">
                    <span className="field relative h-12 w-12 overflow-hidden rounded-xl">
                      <Image src={p.images[0].thumb.src} alt="" fill sizes="48px" className="object-contain p-1 mix-blend-multiply" />
                    </span>
                    <span className="tnum text-[13px] font-semibold">{formatPrice(p.price)}</span>
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
