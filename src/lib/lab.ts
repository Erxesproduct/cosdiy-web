import { INGREDIENTS, type Ingredient, type SkinId } from "@/content/ingredients";
import { products, soldOut, type Product } from "./catalog";

export { SKIN, type SkinId } from "@/content/ingredients";

/**
 * Beauty Lab data, read from each product's own text (name, subtitle, highlights, description):
 * which skin types and goals it mentions, and which key ingredients it names.
 */

export type GoalId = "hydrate" | "bright" | "clear" | "firm" | "calm";
export const GOALS: Record<GoalId, { name: string; hint: string; re: RegExp }> = {
  hydrate: { name: "Чийгшүүлэх", hint: "Хуурайшилт, таталдалт", re: /чийг/ },
  bright: { name: "Гэрэлтүүлэх", hint: "Сэвх, толбо, бүдэг өнгө", re: /цайруул|сэвх|толбо|гэрэлт|тунгалаг|өнгө.{0,12}жигд|жигд.{0,12}өнгө/ },
  clear: { name: "Нүх сүв, батга", hint: "Тослог, бохирдол", re: /батга|нүх|тослог|бохирдол/ },
  firm: { name: "Үрчлээ, чангалах", hint: "Уян хатан чанар", re: /үрчлээ|чангал|уян хатан|хөгшрөлт|нягтрал|өргө/ },
  calm: { name: "Тайвшруулах", hint: "Улайлт, эмзэгшил", re: /тайвшруул|улайлт|үрэвсэл|цочрол|цочроо|эмзэгш/ },
};

const SKIN_RE: Record<SkinId, RegExp> = {
  dry: /хуурай/,
  oily: /тослог|батга|нүх/,
  combo: /холимог/,
  sensitive: /эмзэг|мэдрэмтгий|цочроо/,
  normal: /хэвийн/,
};
const ALL_SKIN = /бүх төрлийн арьс|бүх төрөл|бүх арьс/;

export const textOf = (p: Product) => [p.name, p.subtitle, ...p.highlights, ...p.setItems, ...p.details.map((b) => b.text)].join("\n");

export type LabProduct = {
  slug: string;
  name: string;
  brand: string | null;
  subtitle: string | null;
  category: string;
  price: number;
  thumb: string;
  skin: SkinId[];
  allSkin: boolean;
  /** goal → how many times the text speaks to it (0 = not at all) */
  goals: Record<GoalId, number>;
  /** ingredient ids named in the text */
  ing: string[];
  highlights: string[];
};

export function ingredientsOf(p: Product) {
  const t = textOf(p);
  return INGREDIENTS.filter((i) => i.match.test(t)).map((i) => i.id);
}

export function toLab(p: Product): LabProduct {
  const t = textOf(p).toLowerCase();
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    subtitle: p.subtitle,
    category: p.category,
    price: p.price,
    thumb: p.images[0].thumb.src,
    skin: (Object.keys(SKIN_RE) as SkinId[]).filter((k) => SKIN_RE[k].test(t)),
    allSkin: ALL_SKIN.test(t),
    goals: Object.fromEntries((Object.keys(GOALS) as GoalId[]).map((g) => [g, (t.match(new RegExp(GOALS[g].re.source, "g")) ?? []).length])) as Record<GoalId, number>,
    ing: ingredientsOf(p),
    highlights: p.highlights.slice(0, 3),
  };
}

export const labProducts = products.filter((p) => !soldOut(p)).map(toLab);

/** The sentence of a product's text that names the ingredient (shown as proof under the product). */
export function mention(p: Product, ing: Ingredient) {
  const parts = textOf(p)
    .split(/\n|(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const hit = parts.find((s) => ing.match.test(s) && s.length > 12 && s !== p.name) ?? parts.find((s) => ing.match.test(s));
  return hit ? (hit.length > 180 ? hit.slice(0, 177) + "…" : hit) : null;
}

/** Routine steps, in the order they go on the face. */
export const STEPS = [
  { id: "cleanse", name: "Цэвэрлэх", en: "Cleanse", when: "Өглөө, орой", cats: ["cleanse"], on: true },
  { id: "tone", name: "Тонер", en: "Tone", when: "Өглөө, орой", cats: ["tone"], on: true },
  { id: "serum", name: "Серум", en: "Serum", when: "Нунтаг серум оройд", cats: ["powder", "serum"], on: true },
  { id: "eye", name: "Нүд, сормуус", en: "Eye", when: "Орой", slugs: ["rolling-eye-cream", "tri-bio-lash-repair-serum"], on: false },
  { id: "cream", name: "Тос", en: "Moisturise", when: "Өглөө, орой", cats: ["cream"], on: true },
  { id: "sun", name: "Нарны тос", en: "Protect", when: "Өглөө", cats: ["sun"], on: true },
  { id: "mask", name: "Маск", en: "Mask", when: "7 хоногт 2–3 удаа", cats: ["mask"], on: true },
] as const;

export type Step = { id: string; name: string; en: string; when: string; on: boolean; options: string[] };

export const routineSteps: Step[] = STEPS.map((s) => ({
  id: s.id,
  name: s.name,
  en: s.en,
  when: s.when,
  on: s.on,
  options: labProducts.filter((p) => ("slugs" in s ? (s.slugs as readonly string[]).includes(p.slug) : (s.cats as readonly string[]).includes(p.category))).map((p) => p.slug),
}));

/** Mask finder: format of each mask, read from its name and text. */
export type MaskType = "roll" | "gel" | "peel" | "bubble";
export const MASK_TYPES: Record<MaskType, string> = { roll: "Ролл маск", gel: "Гель маск", peel: "Хуулдаг маск", bubble: "Хөөсөн маск" };

export function maskType(p: Product): MaskType {
  const t = textOf(p).toLowerCase();
  if (/хөөс|bubble/.test(t)) return "bubble";
  if (/хуулдаг|хуулж авна|хуулаад/.test(t) && !/roll/.test(p.name.toLowerCase())) return "peel";
  if (/gel mask|гель маск|гелэн бүтэц/.test(t) && !/roll/.test(p.name.toLowerCase())) return "gel";
  return "roll";
}

/** How the shop says to use it: the «Хэрэглэх заавар» part of the text, else nothing (not invented). */
export function usageOf(p: Product) {
  const i = p.details.findIndex((b) => b.t === "h" && /хэрэглэх|хэрэглээ/i.test(b.text));
  const lines = i >= 0 ? p.details.slice(i + 1).filter((b) => b.t !== "h").map((b) => b.text) : [];
  const extra = p.details.filter((b) => /7-?\s?хоногт|минут|цаг байлга|зайлж угаа|иллэг хийж/i.test(b.text)).map((b) => b.text);
  const all = [...new Set([...lines, ...extra])];
  return all.slice(0, 3);
}

/** «8 ш», «70 г» from the subtitle → count of sheets when it is pieces. */
export function sizeOf(p: Product) {
  const m = p.subtitle?.match(/·\s*([\d.,]+)\s*(ш|г|мл)\s*$/);
  return m ? { n: Number(m[1].replace(",", ".")), unit: m[2] } : null;
}
