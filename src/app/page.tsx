import Image from "next/image";
import Link from "next/link";
import { Drops } from "@/components/drops";
import { HeroSlider, type Slide } from "@/components/hero-slider";
import { ArrowIcon, DropIcon, PinIcon, ShieldIcon, SparkleIcon, TruckIcon } from "@/components/icons";
import { Price } from "@/components/price";
import { ProductCard } from "@/components/product-card";
import { QuickAdd } from "@/components/quick-add";
import { Reveal } from "@/components/reveal";
import { business } from "@/content/business";
import { brands, categories, getLook, getProduct, inCategory, products, RITUAL } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site-url";

const card = (slug: string) => {
  const p = getProduct(slug)!;
  return { slug: p.slug, name: p.name, thumb: p.images[0].thumb.src, price: p.price, brand: p.brand ?? "Cosdiy" };
};

// the shop's own model portraits (slider banners and category covers), each with the product it shows
const SLIDES: Slide[] = [
  { id: "roll-mask", label: "Дусал ч усгүй маск", focus: "70% center", product: null },
  { id: "d-cream", label: "D+ Cream", focus: "62% center", product: card("d-plus-cream") },
  { id: "cleanse", label: "Цэвэр, тайван арьс", product: card("soothely-cleansing-powder") },
  { id: "sun", label: "Өдөр бүрийн хамгаалалт", product: card("solarcare-50-plus-ultra") },
  { id: "lash", label: "Elecderma", product: card("elecderma-roll-mask") },
  { id: "hair", label: "Үс, хуйхны тэжээл", product: card("collagen-15-shampoo-powder") },
].map(({ id, ...s }) => ({ ...s, src: getLook(id).image.src, alt: "Cosdiy-ийн бүтээгдэхүүнтэй загвар өмсөгч" }));

const CLAIMS = ["100% нунтаг серум", "Дусал ч усгүй ролл маск", "Korean healthy skin care", "Cosmetics D.I.Y", "Хүргэлт 24–48 цагт", "Lend.mn · StorePay · Pocket Zero · OmniWay"];

export default function Home() {
  const set = getProduct("cosdiy-6-set")!;
  const apart = RITUAL.reduce((s, r) => s + r.product.price, 0);
  const powders = inCategory("powder");
  const masks = inCategory("mask");
  const ampoule = getProduct("milk-shot-ampoule")!;
  const featured = [...products.filter((p) => p.featured), ...products.filter((p) => !p.featured && p.stock !== 0 && p.category !== "set")].slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: business.name,
    url: absoluteUrl("/"),
    telephone: business.phone.tel,
    email: business.email,
    address: { "@type": "PostalAddress", streetAddress: business.store.address, addressLocality: "Улаанбаатар", addressCountry: "MN" },
    sameAs: [business.facebook, business.instagram],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* hero: porcelain to powder blue, pearly drops, the shop's portraits cross-fading by themselves */}
      <section className="relative overflow-hidden bg-[linear-gradient(160deg,var(--color-pearl)_0%,var(--color-porcelain)_45%,var(--color-mist)_100%)]">
        <Drops count={8} />
        <div className="wrap relative grid items-center gap-12 py-12 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="rise">
            <p className="eyebrow flex items-center gap-3 text-azure">
              <span className="h-px w-10 bg-azure" aria-hidden />
              {business.tagline}
            </p>
            <h1 className="serif mt-6 text-[3.1rem] leading-[0.98] font-light sm:text-7xl lg:text-[5.6rem]">
              Нунтаг. Ампул. Тос.
              <span className="mt-2 block italic text-azure">Таны хольц.</span>
            </h1>
            <p className="mt-7 max-w-md text-[16.5px] leading-relaxed text-ink-2">
              Ус нэмээгүй 100% нунтаг серумыг ампул, тостойгоо хольж арьсандаа хэрэгтэй тэжээлийг өөрөө бүтээнэ. Cosmetics D.I.Y гэдэг нь энэ.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-dark">
                Дэлгүүр үзэх <ArrowIcon size={17} />
              </Link>
              <Link href={`/p/${set.slug}`} className="btn btn-line text-ink">
                Cosdiy-6 Set
              </Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                [String(products.length), "бүтээгдэхүүн"],
                [String(brands.length), "брэнд"],
                ["24–48", "цагт хүргэнэ"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="serif tnum text-4xl font-light">{v}</dd>
                  <dd className="mt-1 text-[12px] tracking-wide text-mute uppercase">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroSlider slides={SLIDES} />
        </div>
      </section>

      {/* running line */}
      <div className="overflow-hidden border-y border-line bg-pearl py-4" aria-hidden>
        <div className="marquee">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0">
              {CLAIMS.map((c) => (
                <span key={c} className="serif flex items-center gap-8 pr-8 text-2xl whitespace-nowrap text-ink-2 italic">
                  {c}
                  <SparkleIcon size={16} className="text-champagne" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* categories: tall rounded cards, scroll sideways on phones */}
      <section className="wrap pt-20 md:pt-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-azure">Ангилал</p>
            <h2 className="serif mt-3 text-4xl md:text-5xl">Арьсандаа хэрэгтэйгээ сонго</h2>
          </div>
          <Link href="/shop" className="group inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.14em] uppercase">
            Бүгдийг үзэх <ArrowIcon size={16} className="transition group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <div className="no-scrollbar -mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-6">
          {categories
            .filter((c) => c.id !== "set")
            .slice(0, 6)
            .map((c, k) => (
              <Reveal key={c.id} delay={k * 80} className="w-[46vw] shrink-0 snap-start sm:w-[30vw] md:w-auto">
                <Link href={`/shop?c=${c.id}`} className="group block">
                  <span className="field relative block aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-[20px] ring-1 ring-line">
                    <Image src={c.cover.src} alt="" fill sizes="(min-width: 1024px) 16vw, (min-width: 768px) 24vw, 46vw" className="object-cover transition duration-[1.2s] group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-night/55 via-transparent to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-4 text-pearl">
                      <span className="eyebrow block text-[9px] text-pearl/80">{c.en}</span>
                      <span className="serif mt-1 block text-xl leading-tight">{c.name}</span>
                    </span>
                  </span>
                  <span className="mt-2 block text-center text-[12px] text-mute">{c.count} бүтээгдэхүүн</span>
                </Link>
              </Reveal>
            ))}
        </div>
      </section>

      {/* the ritual: Cosdiy-6 step by step */}
      <section className="relative mt-24 overflow-hidden bg-pearl py-20 md:mt-32 md:py-28">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="relative">
              <div className="field relative aspect-square overflow-hidden rounded-[32px] ring-1 ring-line">
                <Image src={getLook("set").image.src} alt="Cosdiy-6 Set иж бүрдэл" fill sizes="(min-width: 1024px) 45vw, 92vw" className="object-cover" />
              </div>
              <div className="absolute -right-2 -bottom-8 rounded-[24px] bg-ink p-6 text-pearl shadow-2xl md:-right-8">
                <p className="eyebrow text-[9.5px] text-champagne">Иж бүрдлээр</p>
                <p className="serif tnum mt-1 text-4xl">{formatPrice(set.price)}</p>
                <p className="tnum mt-1 text-[13px] text-pearl/60">
                  Тус тусад нь <s>{formatPrice(apart)}</s>
                </p>
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="eyebrow text-azure">Cosdiy-6 Set</p>
              <h2 className="serif mt-3 text-4xl leading-tight md:text-6xl">
                Зургаан алхам. <em className="text-azure">Нэг хайрцаг.</em>
              </h2>
              <p className="mt-4 max-w-lg text-ink-2">{set.details.find((b) => b.t === "p")?.text}</p>
            </Reveal>
            <ol className="mt-9 divide-y divide-line border-y border-line">
              {RITUAL.map((r, k) => (
                <Reveal as="li" key={r.slug} delay={k * 70}>
                  <Link href={`/p/${r.slug}`} className="group flex items-center gap-4 py-3.5 md:gap-6">
                    <span className="serif tnum w-8 text-2xl text-champagne italic">{String(k + 1).padStart(2, "0")}</span>
                    <span className="field relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-line">
                      <Image src={r.product.images[0].thumb.src} alt="" fill sizes="56px" className="object-contain p-1.5 mix-blend-multiply transition duration-500 group-hover:scale-110" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="eyebrow block text-[9.5px] text-mute">
                        {r.en} · {r.step}
                      </span>
                      <span className="serif block truncate text-xl transition group-hover:text-azure">{r.product.name}</span>
                    </span>
                    <span className="tnum hidden text-[14px] text-ink-2 sm:block">{formatPrice(r.product.price)}</span>
                    <ArrowIcon size={17} className="text-mute transition group-hover:translate-x-1 group-hover:text-azure" />
                  </Link>
                </Reveal>
              ))}
            </ol>
            <Reveal className="mt-8 flex flex-wrap items-center gap-4">
              <Link href={`/p/${set.slug}`} className="btn btn-dark">
                Иж бүрдлийг үзэх <ArrowIcon size={17} />
              </Link>
              <span className="text-[14px] text-ink-2">
                Тус тусад нь авахаас <b className="tnum text-ink">{formatPrice(apart - set.price)}</b> хямд
              </span>
            </Reveal>
          </div>
        </div>
      </section>

      {/* D.I.Y.: powder + ampoule + cream, mixed by the customer */}
      <section className="relative overflow-hidden bg-mist py-20 md:py-28">
        <Drops count={10} />
        <div className="wrap relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="relative mx-auto aspect-square w-full max-w-[420px]">
              <div className="absolute inset-0 rounded-full border border-dashed border-azure/30 spin-slow" aria-hidden />
              <div className="mix-a absolute top-[4%] left-[4%] grid aspect-square w-[42%] place-items-center rounded-full bg-pearl/80 text-center shadow-[0_30px_60px_-30px_rgb(20_28_51/0.4)] backdrop-blur" style={{ "--mx": "7%", "--my": "6%" } as React.CSSProperties}>
                <span>
                  <span className="serif block text-2xl">Нунтаг</span>
                  <span className="eyebrow text-[8.5px] text-mute">Powder serum</span>
                </span>
              </div>
              <div className="mix-b absolute top-[4%] right-[4%] grid aspect-square w-[42%] place-items-center rounded-full bg-white/70 text-center shadow-[0_30px_60px_-30px_rgb(20_28_51/0.4)] backdrop-blur" style={{ "--mx": "-7%", "--my": "6%" } as React.CSSProperties}>
                <span>
                  <span className="serif block text-2xl">Ампул</span>
                  <span className="eyebrow text-[8.5px] text-mute">Milk shot</span>
                </span>
              </div>
              <div className="mix-c absolute bottom-[2%] left-1/2 grid aspect-square w-[42%] -translate-x-1/2 place-items-center rounded-full bg-blush/80 text-center shadow-[0_30px_60px_-30px_rgb(20_28_51/0.4)] backdrop-blur" style={{ "--my": "-8%" } as React.CSSProperties}>
                <span>
                  <span className="serif block text-2xl">Тос</span>
                  <span className="eyebrow text-[8.5px] text-mute">Cream</span>
                </span>
              </div>
              <div className="absolute top-1/2 left-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink text-pearl shadow-xl">
                <DropIcon size={26} />
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="eyebrow text-azure">Cosmetics D.I.Y</p>
              <h2 className="serif mt-3 text-4xl leading-tight md:text-6xl">
                Ус нэмээгүй. <em className="text-azure">100% идэвхтэй.</em>
              </h2>
              <p className="mt-5 max-w-lg text-ink-2">
                Нунтаг серум бүр ганц удаагийн ууттай. Нэг уутыг Milk Shot Ampoule болон тостойгоо хольж нүүрэндээ жигд түрхэнэ. Оройн арчилгаанд хэрэглэхийг зөвлөдөг.
              </p>
            </Reveal>
            <ul className="mt-9 grid gap-3 sm:grid-cols-2">
              {[...powders, ampoule].map((p, k) => (
                <Reveal as="li" key={p.slug} delay={k * 70}>
                  <Link href={`/p/${p.slug}`} className="group flex items-center gap-3 rounded-2xl bg-pearl/75 p-3 pr-4 ring-1 ring-white backdrop-blur transition hover:bg-pearl hover:shadow-lg">
                    <span className="field relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                      <Image src={p.images[0].thumb.src} alt="" fill sizes="56px" className="object-contain p-1 mix-blend-multiply" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="serif block truncate text-lg leading-tight group-hover:text-azure">{p.name}</span>
                      <span className="block truncate text-[12px] text-mute">{p.subtitle}</span>
                    </span>
                    <span className="tnum text-[13.5px] font-semibold">{formatPrice(p.price)}</span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* featured */}
      <section className="wrap pt-20 md:pt-28">
        <Reveal className="text-center">
          <p className="eyebrow text-azure">Онцлох</p>
          <h2 className="serif mt-3 text-4xl md:text-5xl">Хамгийн их сонгогддог</h2>
          <div className="rule mx-auto mt-6 max-w-xs text-[10px]" aria-hidden>
            ◆
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
          {featured.map((p, k) => (
            <Reveal key={p.slug} delay={(k % 4) * 90}>
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* masks: midnight band */}
      <section className="relative mt-24 overflow-hidden bg-night text-pearl md:mt-32">
        <div className="pointer-events-none absolute -right-40 -bottom-40 h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgb(59_91_169/0.45),transparent)]" aria-hidden />
        <div className="wrap relative grid gap-12 py-20 md:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-tr-[140px] rounded-bl-[140px]">
              <Image src={getLook("roll-mask").image.src} alt="Усгүй ролл маскнууд" fill sizes="(min-width: 1024px) 42vw, 92vw" className="object-cover" style={{ objectPosition: "70% center" }} />
            </div>
          </Reveal>
          <div className="min-w-0">
            <Reveal>
              <p className="eyebrow text-champagne">Roll mask</p>
              <h2 className="serif mt-3 text-4xl leading-tight md:text-6xl">
                Дусал ч <em className="text-mist-2">усгүй.</em>
              </h2>
              <p className="mt-5 max-w-lg text-pearl/70">Ус нэмээгүй тул найрлага нь илүү баялаг, өтгөн. Ролл хэлбэртэй тул нүүрэнд жигд наалдаж, хэрэглэхэд хялбар.</p>
            </Reveal>
            <div className="no-scrollbar -mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
              {masks.map((p) => (
                <Link key={p.slug} href={`/p/${p.slug}`} className="group w-44 shrink-0 snap-start">
                  <span className="relative block aspect-[4/5] overflow-hidden rounded-[20px] bg-[radial-gradient(circle_at_50%_30%,#ffffff,#dfe6f1)]">
                    <Image src={p.images[0].thumb.src} alt={p.name} fill sizes="176px" className="object-contain p-4 mix-blend-multiply transition duration-700 group-hover:scale-105" />
                  </span>
                  <span className="serif mt-3 block text-lg leading-tight group-hover:text-mist-2">{p.name}</span>
                  <span className="tnum text-[13px] text-pearl/60">{formatPrice(p.price)}</span>
                </Link>
              ))}
            </div>
            <Link href="/shop?c=mask" className="btn btn-light mt-9">
              Бүх маск <ArrowIcon size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* climate note, from the Milk Shot Ampoule text */}
      <section className="wrap grid gap-12 pt-20 md:pt-28 lg:grid-cols-2 lg:items-center">
        <Reveal className="order-2 lg:order-1">
          <p className="eyebrow text-azure">Монголын уур амьсгалд</p>
          <h2 className="serif mt-3 text-4xl leading-tight md:text-5xl">Хүйтэн, хуурай өвөлд арьс юу хүсдэг вэ?</h2>
          <p className="mt-5 text-ink-2">Манай орны өвөл эрс тэс, хуурай агаартай, агаарын бохирдол өндөр. Ийм үед арьс чийгээ алдаж хуурайшиж, сэвх толбо үүсэх, батга гарах магадлал нэмэгддэг.</p>
          <ul className="mt-7 space-y-4">
            {[
              ["Чийгшүүлэх", "Ампулын 1 дусал нь 7 литр усны чийгшилтэй тэнцэх өндөр концентрацитай."],
              ["Түгжих", "Ампулын дараа заавал тос түрхэж чийгийг түгжинэ."],
              ["Хамгаалах", "Өдөр бүр нарны тос: матт бүтэцтэй 50+ эсвэл гелэн бүтэцтэй 90."],
            ].map(([t, d], k) => (
              <li key={t} className="flex gap-4">
                <span className="serif tnum text-2xl text-champagne italic">{String(k + 1).padStart(2, "0")}</span>
                <span>
                  <span className="serif block text-xl">{t}</span>
                  <span className="text-[14.5px] text-ink-2">{d}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 inline-flex items-center gap-4 rounded-full bg-pearl py-2 pr-2 pl-2 ring-1 ring-line transition hover:ring-ink">
            <Link href={`/p/${ampoule.slug}`} className="group flex items-center gap-4">
              <span className="field relative h-12 w-12 overflow-hidden rounded-full">
                <Image src={ampoule.images[0].thumb.src} alt="" fill sizes="48px" className="object-contain p-1 mix-blend-multiply" />
              </span>
              <span>
                <span className="serif block leading-tight group-hover:text-azure">{ampoule.name}</span>
                <Price p={ampoule} />
              </span>
            </Link>
            <QuickAdd slug={ampoule.slug} name={ampoule.name} />
          </div>
        </Reveal>
        <Reveal className="order-1 lg:order-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-tl-[160px] rounded-br-[160px] bg-mist md:aspect-[5/6]">
            <Image src={getLook("d-cream").image.src} alt="D+ Cream" fill sizes="(min-width: 1024px) 46vw, 92vw" className="object-cover" style={{ objectPosition: "62% center" }} />
          </div>
        </Reveal>
      </section>

      {/* brands */}
      <section className="wrap pt-20 md:pt-28">
        <Reveal className="rounded-[32px] border border-line bg-pearl px-6 py-12 text-center md:px-12">
          <p className="eyebrow text-azure">Брэндүүд</p>
          <ul className="mt-6 flex flex-wrap items-baseline justify-center gap-x-8 gap-y-3 md:gap-x-12">
            {brands.map((b) => (
              <li key={b}>
                <Link href={`/shop?b=${encodeURIComponent(b)}`} className="serif text-3xl text-ink-2 transition hover:text-azure md:text-4xl">
                  {b}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* visit + service */}
      <section className="wrap pt-20 md:pt-28">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: <PinIcon size={22} />, t: business.store.name, d: `${business.store.floor} · Нарны зам дагуу, Сүхбаатар дүүрэг`, href: business.store.mapUrl },
            { icon: <TruckIcon size={22} />, t: "Хүргэлт 24–48 цагт", d: "Хотын А бүсэд 6,000₮, холын бүсэд 10,000₮", href: "/info#delivery" },
            { icon: <ShieldIcon size={22} />, t: "Хуваан төлөх", d: "Lend.mn, Pocket Zero, StorePay, OmniWay", href: "/info#delivery" },
          ].map((x, k) => (
            <Reveal key={x.t} delay={k * 90}>
              <a href={x.href} className="group flex h-full items-start gap-4 rounded-[24px] bg-pearl p-6 ring-1 ring-line transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgb(20_28_51/0.3)]">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-mist text-azure">{x.icon}</span>
                <span>
                  <span className="serif block text-2xl leading-tight">{x.t}</span>
                  <span className="mt-1 block text-[14px] text-ink-2">{x.d}</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
