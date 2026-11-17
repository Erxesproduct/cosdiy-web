import type { Metadata } from "next";
import Link from "next/link";
import { IngredientArt } from "@/components/ingredient-art";
import { ArrowIcon } from "@/components/icons";
import { LabHero } from "@/components/lab/lab-hero";
import { INGREDIENTS } from "@/content/ingredients";
import { VIDEOS } from "@/content/videos";

export const metadata: Metadata = {
  title: "Beauty Lab",
  description: "Арчилгааны дарааллаа бүтээх, гол найрлагын түүх, маск сонгогч, бүтээгдэхүүний видео: Cosdiy Beauty Lab.",
  alternates: { canonical: "/lab" },
};

const ing = (id: string) => INGREDIENTS.find((i) => i.id === id)!;

const LAB_CARDS = [
  { href: "/lab/routine", en: "Build My Routine", t: "Арчилгаагаа бүтээ", d: "Арьсны төрөл, зорилгоо сонгоод цэвэрлэгээнээс маск хүртэлх дараалал, нийт үнийг нэг дор.", art: ing("hyaluronic") },
  { href: "/lab/ingredients", en: "Ingredient Story", t: "Гол найрлага", d: "Коллаген, глутатион, алоэ… юу хийдэг, ямар арьсанд тохирох, аль бүтээгдэхүүнд байдаг.", art: ing("aloe") },
  { href: "/lab/masks", en: "Mask Finder", t: "Маск сонгогч", d: "Хэрэгцээ, төрлөөр шүүж, хоёр маскийг үнэ, найрлага, хэрэглээгээр харьцуул.", art: ing("rose") },
  { href: "/videos", en: "Videos", t: "Видео", d: `Үйлдвэрлэгчийн ${VIDEOS.length} бичлэг: нунтаг серум, тонер, тос яаж хэрэглэх вэ.`, art: ing("gold") },
];

export default function LabHub() {
  return (
    <div>
      <LabHero eyebrow="Cosdiy Beauty Lab" title="Арьсаа таньж," accent="өөрөө бүтээ.">
        Cosmetics D.I.Y гэдэг маань арьсандаа яг хэрэгтэйг өөрөө сонгох. Эдгээр хэрэгсэл бүтээгдэхүүн бүрийн тайлбарт бичсэн найрлага, зориулалт дээр тулгуурлан танд тохирохыг олоход тусална.
      </LabHero>
      <div className="wrap grid gap-4 py-12 sm:grid-cols-2 md:gap-6 md:py-16">
        {LAB_CARDS.map((c) => (
          <Link key={c.href} href={c.href} className="group relative flex min-h-64 items-end overflow-hidden rounded-[30px] bg-pearl p-6 ring-1 ring-line transition duration-500 hover:-translate-y-1 hover:shadow-[0_40px_80px_-46px_rgb(20_28_51/0.5)] md:p-8">
            <IngredientArt motif={c.art.motif} tint={c.art.tint} className="absolute -top-10 -right-10 w-36 opacity-80 transition duration-700 group-hover:scale-110 group-hover:rotate-6 sm:-top-8 sm:-right-8 sm:w-52 sm:opacity-90 md:w-64" />
            <span className="relative max-w-sm pt-14 sm:pt-0">
              <span className="eyebrow block text-[10px] text-azure">{c.en}</span>
              <span className="serif mt-1 block text-4xl leading-tight">{c.t}</span>
              <span className="mt-2 block text-[14.5px] leading-relaxed text-ink-2">{c.d}</span>
              <span className="mt-4 inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.14em] uppercase">
                Нээх <ArrowIcon size={15} className="transition group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
