import type { Metadata } from "next";
import { LabHero } from "@/components/lab/lab-hero";
import { type MaskCard, MaskFinder } from "@/components/lab/mask-finder";
import { INGREDIENTS } from "@/content/ingredients";
import { products, soldOut } from "@/lib/catalog";
import { GOALS, MASK_TYPES, maskType, sizeOf, toLab, usageOf, type GoalId } from "@/lib/lab";

export const metadata: Metadata = {
  title: "Mask Finder · Маск сонгогч",
  description: "Арьсны хэрэгцээ, маскны төрлөө сонгоод тохирох Cosdiy маскийг олж, хоёрыг нь үнэ, найрлага, зориулалт, хэрэглээгээр харьцуулаарай.",
  alternates: { canonical: "/lab/masks" },
};

export default function MasksPage() {
  const masks: MaskCard[] = products
    .filter((p) => p.category === "mask" && !soldOut(p))
    .map((p) => {
      const l = toLab(p);
      return {
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        subtitle: p.subtitle,
        price: p.price,
        thumb: l.thumb,
        type: maskType(p),
        size: sizeOf(p),
        goals: l.goals,
        ing: l.ing.map((id) => ({ id, name: INGREDIENTS.find((i) => i.id === id)!.name })),
        purpose: p.highlights.slice(0, 3),
        usage: usageOf(p),
      };
    });
  const goals = Object.fromEntries((Object.keys(GOALS) as GoalId[]).map((g) => [g, { name: GOALS[g].name, hint: GOALS[g].hint }])) as Record<GoalId, { name: string; hint: string }>;
  return (
    <div>
      <LabHero eyebrow="Mask Finder" title="Өнөө орой ямар" accent="маск вэ?">
        Арьсны хэрэгцээ, маскны төрлөө сонгоход тохирох маск шууд гарна. Хоёрыг нь сонгоод үнэ, найрлага, зориулалт, хэрэглэх аргаар нь зэрэгцүүлж хараарай.
      </LabHero>
      <div className="wrap py-12 md:py-16">
        <MaskFinder masks={masks} goals={goals} types={MASK_TYPES} />
      </div>
    </div>
  );
}
