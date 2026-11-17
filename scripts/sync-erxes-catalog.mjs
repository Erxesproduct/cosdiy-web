/**
 * Refreshes prices in src/data/catalog.json from erxes.
 *
 *   ERXES_API_URL=https://<subdomain>.next.erxes.io/gateway \
 *   ERXES_APP_TOKEN=<client portal token> \
 *   npm run sync:erxes
 *
 * Matching: erxes product `code` = `CD-<zochil id>`, the codes in docs/erxes/cosdiy-products.csv.
 * Names, photos and descriptions stay as they are; only the selling price is taken from erxes
 * (a higher old price stays as the struck-through price). Query name follows erxes client-portal
 * conventions (`cpProducts`): verify on the tenant.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "src", "data", "catalog.json");
const API = process.env.ERXES_API_URL?.replace(/\/$/, "");
const TOKEN = process.env.ERXES_APP_TOKEN;

if (!API || !TOKEN) {
  console.error("Set ERXES_API_URL and ERXES_APP_TOKEN first (see .env.example).");
  process.exit(1);
}

const res = await fetch(`${API}/graphql`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-app-token": TOKEN },
  body: JSON.stringify({ query: `query SiteProducts($perPage: Int) { cpProducts(perPage: $perPage) { _id code name unitPrice } }`, variables: { perPage: 2000 } }),
});
const json = await res.json();
if (json.errors?.length) {
  console.error("erxes:", json.errors.map((e) => e.message).join("; "));
  process.exit(1);
}

const byCode = new Map((json.data?.cpProducts ?? []).map((p) => [p.code, p]));
const priceOf = (code) => {
  const e = byCode.get(code);
  return e && typeof e.unitPrice === "number" && e.unitPrice > 0 ? e.unitPrice : null;
};
const catalog = JSON.parse(await readFile(file, "utf8"));
let matched = 0;
const missing = [];
for (const p of catalog.products) {
  const price = priceOf(`CD-${p.id}`);
  if (price == null) missing.push(`CD-${p.id} ${p.name}`);
  else {
    matched++;
    p.price = price;
  }
  if (p.compareAt != null && p.compareAt <= p.price) p.compareAt = null;
}
catalog.source = "erxes";
catalog.updatedAt = new Date().toISOString().slice(0, 10);
await writeFile(file, JSON.stringify(catalog, null, 1) + "\n");
console.log(`✓ ${matched} prices updated from erxes`);
if (missing.length) console.log(`Not found in erxes (kept as is): ${missing.length}\n  ` + missing.slice(0, 50).join("\n  "));
