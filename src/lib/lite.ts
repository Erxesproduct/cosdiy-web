import data from "@/data/lite.json";

/** Slim product record for client components (see scripts/build-lite.mjs). c = category label, q = search key. */
export type Lite = { s: string; n: string; c: string; p: number; o: number | null; k: number | null; t: string; q: string };

export const liteProducts = data as Lite[];
const bySlug = new Map(liteProducts.map((p) => [p.s, p]));

export function resolveLine(slug: string) {
  const product = bySlug.get(slug);
  return product ? { product, price: product.p, stock: product.k } : null;
}
