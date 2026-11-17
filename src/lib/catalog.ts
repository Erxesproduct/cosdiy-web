import data from "@/data/catalog.json";

export type Img = { src: string; w: number; h: number };
export type Photo = Img & { thumb: Img };
/** A piece of the shop's product text: heading, paragraph, bullet, numbered step. */
export type Block = { t: "h" | "p" | "li" | "step"; text: string };

export type Product = {
  /** Zochil product id (kept for the erxes product code and old-URL redirects). */
  id: number;
  slug: string;
  name: string;
  /** What it is and how much, in Mongolian. */
  subtitle: string | null;
  brand: string | null;
  category: string;
  /** Selling price (the sale price when discounted). */
  price: number;
  /** Price before the discount, null when not discounted. */
  compareAt: number | null;
  /** Units in stock; null = stock not tracked. 0 = sold out. */
  stock: number | null;
  featured: boolean;
  createdAt: string;
  /** The first run of bullets in the shop's text: what it does. */
  highlights: string[];
  /** What is in a set (Cosdiy-6). */
  setItems: string[];
  details: Block[];
  images: Photo[];
};

export type Category = { id: string; name: string; en: string; blurb: string; zochil: number[]; count: number; cover: Img };
export type Look = { id: string; title: string; to: string; image: Img };

export const categories = data.categories as Category[];
export const products = data.products as Product[];
export const looks = data.looks as Look[];
export const catalogUpdatedAt = data.updatedAt;

const bySlug = new Map(products.map((p) => [p.slug, p]));
export const getProduct = (slug: string) => bySlug.get(slug);
export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const inCategory = (id: string) => products.filter((p) => p.category === id);
export const getLook = (id: string) => looks.find((l) => l.id === id)!;
export const brands = [...new Set(products.flatMap((p) => (p.brand ? [p.brand] : [])))].sort((a, b) => products.filter((p) => p.brand === b).length - products.filter((p) => p.brand === a).length);

export const soldOut = (p: { stock: number | null }) => p.stock === 0;
export const lowStock = (p: { stock: number | null }) => p.stock != null && p.stock > 0 && p.stock <= 5;
export const onSale = (p: Pick<Product, "price" | "compareAt">) => p.compareAt != null && p.compareAt > p.price;
export const discount = (p: Pick<Product, "price" | "compareAt">) => (onSale(p) ? Math.round((1 - p.price / p.compareAt!) * 100) : 0);

/** The product a cart line points at (server side). */
export function resolveLine(slug: string) {
  const product = getProduct(slug);
  return product ? { product, price: product.price, stock: product.stock } : null;
}

/** erxes product code: CD-<zochil id>. */
export const sku = (p: Pick<Product, "id">) => `CD-${p.id}`;

/** First readable sentence for meta descriptions. */
export function summary(p: Product) {
  const first = p.details.find((b) => b.t === "p")?.text;
  const bits = [p.subtitle, p.highlights.slice(0, 2).join(". ") || first];
  return bits.filter(Boolean).join(". ").slice(0, 170);
}

/**
 * The Cosdiy-6 set, step by step: the six products the set lists, in the order it lists them,
 * matched to the products sold on their own.
 */
export const RITUAL = [
  { slug: "fill-collagen-face-wash-powder", step: "Цэвэрлэх", en: "Cleanse" },
  { slug: "detox-jus-toner", step: "Тэнцвэржүүлэх", en: "Tone" },
  { slug: "collagen-powder-serum", step: "Коллаген", en: "Powder I" },
  { slug: "glutathione-powder-serum", step: "Гэрэлтүүлэх", en: "Powder II" },
  { slug: "milk-shot-ampoule", step: "Чийгшүүлэх", en: "Ampoule" },
  { slug: "d-plus-cream", step: "Түгжих", en: "Cream" },
].map((r) => ({ ...r, product: getProduct(r.slug)! }));
