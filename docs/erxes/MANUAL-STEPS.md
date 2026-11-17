# Cosdiy Mongolia: erxes manual steps

Owner of every step below: **Terbish**, with Cosdiy Mongolia for credentials and decisions.

These steps happen inside the erxes 3.0 admin, not in code. The website reads the results through the
environment variables in `.env.example`. Never commit their values.

| Task | Status | What to do in erxes (admin path) |
| --- | --- | --- |
| [1.1] Import products, categories, prices | website done · manual import in erxes | Section 1.1 |
| [1.2] Payment setup (QPay, bank, loan apps) | website done · manual, blocked on QPay merchant credentials | Section 1.2 |
| [1.3] eBarimt setup | website done · manual, blocked on PosAPI registration + TIN | Section 1.3 |
| [1.4] Delivery zones, fees, order statuses | website done · manual in erxes | Section 1.4 |
| [1.5] Test order from cart to receipt | validation verified · real order blocked on erxes env vars + 1.2 + 1.3 | Section 1.5 |

There is no erxes instance for Cosdiy Mongolia yet ("erxes 3.0: NOT SET"). Create it first, then add the env vars
under **Vercel → cosdiy-web → Settings → Environment Variables**.

---

## 1.1 Import products, categories and prices

Source: cosdiy.mn (Zochil shop 29918), scraped 2026-11-17, plus the Facebook page «Cosdiy Mongolia | Ulaanbaatar»
(facebook.com/cosdiyy; without a login it only gives the page name and profile photo).

- **38 products** (223 photos), the 6 home slider banners and 7 category photos (model portraits on powder blue),
  the logo («korean healthy skin care / COSDIY / cosmetics D.I.Y»). Zochil has **no blog posts and an empty
  About / FAQ / Terms page**, so the website has no journal; the About page is written from the logo, the product
  texts and the shop settings.
- The Zochil tree had 13 categories, one empty («Бие арчилгаа»). The website keeps **11 categories** in skin-care
  order: «Мист» is merged into «Тонер, мист»; «100% нунтаг серум» and «Серум» stay separate.
- Product texts: the Zochil short description (bullets) becomes «Үйлчилгээ», the long description becomes
  «Дэлгэрэнгүй» (headings, bullet lists, numbered «Хэрэглэх заавар» steps). Emoji bullets and lines the shop broke
  mid-sentence are cleaned up; the wording is the shop's own.
- Name fixes (Zochil cut names off at 32 characters): «TONE-UP Brightening Capsule Seru» → «Tone-Up Brightening
  Capsule Serum», «Cosdiy-6 Set ( Milk shot ampoule» → «Cosdiy-6 Set», «Collagen Powder Serum (Гүн чийгш» →
  «Collagen Powder Serum», «Bubble Lina Mask /Хөөсөн гүн цэв» → «Bubble Lina Mask», «Foundation B3/B2» →
  «Waterism Foundation B3/B2» (name in the text), «D+Cream» → «D+ Cream». Each product got a one-line Mongolian
  subtitle with its size (e.g. «Dual Active 5.1 ампул серум · 50 мл»).
- The Cosdiy-6 Set lists six products that are also sold alone (270,000₮ apart, 250,000₮ as a set); the website
  shows the set as six steps and links each step to its product.

| Code | Name | Products |
| --- | --- | --- |
| `CD-set` | Иж бүрдэл | 1 |
| `CD-cleanse` | Цэвэрлэгээ | 6 |
| `CD-tone` | Тонер, мист | 2 |
| `CD-powder` | 100% нунтаг серум | 4 |
| `CD-serum` | Серум, ампул | 2 |
| `CD-mask` | Усгүй ролл маск | 9 |
| `CD-cream` | Тэжээлийн тос | 3 |
| `CD-sun` | Нарны тос | 2 |
| `CD-eye` | Нүд, сормуус | 4 |
| `CD-base` | Суурь будалт | 3 |
| `CD-hair` | Үс арчилгаа | 2 |

Files:

- `docs/erxes/cosdiy-categories.csv`: the parent `CD` and 11 categories (`CD-<id>`, with the Zochil ids).
- `docs/erxes/cosdiy-products.csv`: **38 rows**, code `CD-<zochilId>`, with brand, price, stock, status,
  subtitle, the full description and photo paths.

Steps:

1. **Products & services → Categories**: import `cosdiy-categories.csv`, or create them by hand.
2. **Settings → Import & Export → Import → Products**: upload `cosdiy-products.csv`.
   - Map `code → Code`, `name → Name`, `categoryCode → Category code`, `unitPrice → Unit price`, `type → Type`,
     `uom → UOM`, `description → Description`.
   - Keep the codes: the website and `npm run sync:erxes` match products on them.
3. **Stock**: Zochil tracks stock on 28 products (1,912 units). Low: Super Serum Powder **3**, Detox Jus Toner
   **4**, Premium Smoothing Cream **8**, Tibena Keeping Serum Mist **10**. The newest 10 products (Cosdiy-6 Set,
   Prime Cleansing Masque, Soothely Cleansing Powder, Real Collagen Serum Powder, Green Tangerine and Rose Hip
   Cica roll masks, both Solarcare, Tri-bio Lash Repair Serum, Rolling Eye Cream) have stock tracking off on
   Zochil (it shows «1»), so the website treats them as untracked and lets them be ordered. Enter real remainders
   in **Inventories → Remainders**; until erxes stock is wired to the site, update `stock` in
   `src/data/catalog.json`.
4. **Brands**: create them in **Products & services → Brands** and set them on the products:
   UNIZAAR 12, Doldori 5, Tibena 4, Feeblin 4, ILOJE 2, Thermoceutical 1, COCONCO 1. No sale prices on Zochil.
5. **Photos** (223 images, WebP) are in `public/images/p`; editorial photos in `public/images/look`. Upload the
   product photos in erxes. (The Zochil subscription runs until 2027-08-31.)
6. Run `npm run sync:erxes` once with a Client Portal token (`cpProducts`) to confirm the codes match.

**Confirm with Cosdiy:**

- Brands read off the package in the shop's photos (not named in the text): UNIZAAR (12 products), Doldori
  (5 roll / gel masks), Tibena Clear Pore Pad, Feeblin foundations, ILOJE Tone-Up serum, Thermoceutical Prime
  Cleansing Masque. Brand unknown, left blank: Real Collagen Serum Powder, Super Serum Powder, Rose Hip Cica,
  White Moisture and Bubble Lina masks, both Solarcare, Tri-bio Lash Repair Serum, BB Cream.
- Real stock of the 10 untracked products.
- Milk Shot Ampoule and D+ Cream / Premium Smoothing Cream say «шинэчлэгдсэн» (renewed as Dual Active 5.1 Serum,
  Ceranol Calming Cream, Butter Barrier Cream). Should the site use the new names?
- The «1 дусал = 7 литр усны чийгшилтэй тэнцэх» line is the shop's own claim (Milk Shot Ampoule text); the home
  page repeats it. Keep it?

## 1.2 Payment setup (QPay, bank transfer, loan apps)

On Zochil, checkout is **disabled** (`checkout_status: disabled`). The shop has a Zochil-issued QPay merchant
(`Z_COSDIY`, not transferable) and a Sono / Khan Bank account. The payment rule: «Дансаар / Зээлийн
аппликейшүүд Lend.mn, Pocket zero, Store pay, Omni way».

1. Get Cosdiy's own QPay merchant credentials: `client_id`, `client_secret`, `invoice_code`.
   Owner: Terbish / Cosdiy.
2. **Settings → Payments → Add → QPay**: enter the credentials. **Settings → Payments → (QPay) → Test**: a 100₮
   test invoice.
3. **Settings → Payments → Add → Bank transfer**: the account staff send to customers (see the question below).
4. Loan apps (Lend.mn, Pocket Zero, StorePay, OmniWay) have no erxes payment method: staff handle them by hand.
   Optional: **Sales → Pipelines → «Вэбсайт» → Properties**: add a «Төлбөрийн хэлбэр» field so cards show it.
5. **Sales → Pipelines → «Вэбсайт» → Settings → Payments**: select QPay and bank transfer.

Website (done): checkout offers **QPay**, **Дансаар** and **Зээлийн апп**; the choice is validated on the server and
written in the order message (`Төлбөр: …`). The receipt tells the customer what comes next for each choice.

**Confirm with Cosdiy:**

- Which bank account to show (Zochil has a Khan Bank account through Sono; the website does not publish it).
- How loan-app orders work (link sent by staff, or the customer pays in-store?).
