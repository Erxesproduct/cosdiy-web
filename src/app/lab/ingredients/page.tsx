import type { Metadata } from "next";
import { type IngCard, IngredientExplorer } from "@/components/lab/ingredient-explorer";
import { LabHero } from "@/components/lab/lab-hero";
import { INGREDIENT_TAGS, INGREDIENTS, SKIN } from "@/content/ingredients";
import { products, soldOut } from "@/lib/catalog";
import { mention, textOf } from "@/lib/lab";

export const metadata: Metadata = {
  title: "Ingredient Story · Гол найрлага",
  description: "Коллаген, глутатион, алоэ, церамид… Cosdiy-ийн бүтээгдэхүүнд орсон гол найрлага юу хийдэг, ямар арьсанд тохирох, аль бүтээгдэхүүнд байдгийг үзээрэй.",
  alternates: { canonical: "/lab/ingredients" },
};

export default function IngredientsPage() {
  const live = products.filter((p) => !soldOut(p));
  // RegExp stays on the server: the client gets plain data with the matching products already found.
  const items: IngCard[] = INGREDIENTS.map(({ match, ...i }) => ({
    ...i,
    products: live
      .filter((p) => match.test(textOf(p)))
      .map((p) => ({ slug: p.slug, name: p.name, brand: p.brand, price: p.price, thumb: p.images[0].thumb.src, quote: mention(p, { ...i, match }) })),
  }))
    .filter((i) => i.products.length)
    .sort((a, b) => b.products.length - a.products.length);

  return (
    <div>
      <LabHero eyebrow="Ingredient Story" title="Найрлага бүр" accent="өөрийн түүхтэй.">
        Cosdiy-ийн бүтээгдэхүүний тайлбарт дурдагдсан {items.length} гол найрлага. Аль нэг дээр дарж юу хийдэг, юунд хэрэгтэй, ямар арьсанд тохирохыг үзээд, тэр найрлагатай бүтээгдэхүүнээс сонгоорой.
      </LabHero>
      <div className="wrap py-12 md:py-16">
        <IngredientExplorer items={items} tags={INGREDIENT_TAGS} skins={SKIN} />
      </div>
    </div>
  );
}
