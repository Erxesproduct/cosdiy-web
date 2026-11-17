/**
 * The shop's product videos (cosdiy.mn/videos, Zochil `storefront/product-videos/list`), all by the Korean maker
 * CO KIT Cosmetics, plus the YouTube link in the shop settings. Titles from YouTube.
 */
export type Video = { id: string; title: string; caption: string; slug: string | null; by: string };

export const VIDEOS: Video[] = [
  { id: "EVyQylkEJ04", title: "Elastin Low Molecular Collagen Powder 95", caption: "Коллагентай нунтаг серум", slug: "collagen-powder-serum", by: "CO KIT Cosmetics" },
  { id: "PTzFGVMItWI", title: "Brightening Powder 99", caption: "Глутатионтой нунтаг серум", slug: "glutathione-powder-serum", by: "CO KIT Cosmetics" },
  { id: "RBldM20T7zg", title: "Detox Jus Toner", caption: "Хоргүйжүүлэх, чийгшүүлэх тонер", slug: "detox-jus-toner", by: "CO KIT Cosmetics" },
  { id: "59ZwjoutwpU", title: "D+ Cream", caption: "Алоэтэй тайвшруулах тос", slug: "d-plus-cream", by: "CO KIT Cosmetics" },
  { id: "rWovLfURQ5s", title: "UNIZAAR Elastin Collagen Powder 95", caption: "UNIZAAR коллаген нунтаг", slug: "collagen-powder-serum", by: "gobizkorea" },
];

export const videoFor = (slug: string) => VIDEOS.find((v) => v.slug === slug) ?? null;
