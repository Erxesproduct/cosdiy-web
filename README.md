# Cosdiy Mongolia storefront

Website for **Cosdiy Mongolia** (Улаанбаатар, Encanto Centro Mall 3 давхар): Korean skin care, 100% powder serums,
water-free roll masks and the Cosdiy-6 set. It replaces the Zochil shop at cosdiy.mn (shop 29918).

Next.js 16 (App Router) + Tailwind CSS 4. Static catalog in `src/data/catalog.json`; orders go to erxes 3.0.

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint && npm run typecheck && npm run build
npm run test:order -- http://localhost:3000   # order API checks (add --send for one real erxes order)
npm run sync:erxes   # refresh prices from erxes (needs ERXES_API_URL + ERXES_APP_TOKEN)
```

| Path | What |
| --- | --- |
| `/` | Home: self-running portrait slider, categories, Cosdiy-6 in six steps, the powder + ampoule + cream mix, featured, masks, brands |
| `/shop?c=<category>&b=<brand>&s=<sort>` | Catalog by category and brand, sorted by category, price or newest |
| `/p/<slug>` | Product: gallery, price, stock, what it does, set contents / set step, full description and how-to |
| `/info` | About, delivery and payment, FAQ, store and contact |
| `/cart` | Cart + checkout (QPay / bank / loan apps, eBarimt person or company, A zone / outer zone) |
| `POST /api/orders` | Validates on the server (prices, stock, fee) and sends the order to erxes |

Business rules live in `src/content/business.ts`. Old Zochil URLs (`/products/...`, `/about`, `/faq`, `/shopping-cart`)
redirect to the new pages. erxes setup and open questions: `docs/erxes/MANUAL-STEPS.md`.

Environment variables: see `.env.example` (never commit values).
