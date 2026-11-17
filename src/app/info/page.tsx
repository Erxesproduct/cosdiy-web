import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Drops } from "@/components/drops";
import { ArrowIcon, DropIcon, FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, ShieldIcon, SparkleIcon, TruckIcon, YoutubeIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { Seal } from "@/components/seal";
import { business } from "@/content/business";
import { brands, categories, getLook, products } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Бидний тухай",
  description: "Cosdiy Mongolia: korean healthy skin care, cosmetics D.I.Y. Encanto Centro Mall 3 давхар. Хүргэлт, төлбөр, түгээмэл асуулт.",
  alternates: { canonical: "/info" },
};

const PILLARS = [
  { icon: <DropIcon size={22} />, t: "Ус нэмээгүй", d: "Нунтаг серум, ролл маск нь усны агууламжгүй тул идэвхтэй найрлага нь өтгөн, баялаг." },
  { icon: <SparkleIcon size={22} />, t: "Өөрөө хольно", d: "Нунтаг серумыг ампул, тостойгоо хольж, арьсандаа хэрэгтэйг өөрөө бүтээнэ: cosmetics D.I.Y." },
  { icon: <ShieldIcon size={22} />, t: "Манай уур амьсгалд", d: "Хүйтэн, хуурай өвөл, бохир агаарт чийгшил, хамгаалалт, тэнцвэрийг сэргээхэд зориулсан." },
];

// Answers are the shop's own rules and product instructions, put as questions.
const FAQ = [
  { q: "Хэдэн цагт хүргэх вэ?", a: `Захиалга өгснөөс хойш 24–48 цагийн дотор. Хотын А бүсэд (Оффицер–5 шар, Дарь эх–Яармаг) ${formatPrice(business.delivery[0].fee)}, холын бүсэд (Баруун, Зүүн салаа, 7 буудал, Амгалан, Нисэх) ${formatPrice(business.delivery[1].fee)}.` },
  { q: "Ямар аргаар төлж болох вэ?", a: "QPay, дансаар шилжүүлэх, эсвэл Lend.mn, Pocket Zero, StorePay, OmniWay зээлийн аппаар." },
  { q: "Нунтаг серумыг яаж хэрэглэх вэ?", a: "Нэг уутыг тос болон Milk Shot Ampoule-тай хольж нүүрэндээ жигд түрхэнэ. Оройн арчилгаанд хэрэглэхийг зөвлөдөг: өдөр хэрэглэвэл коллагены тэжээлийн давхаргаас болж будалт бөөгнөрч магадгүй." },
  { q: "Ампулын дараа юу түрхэх вэ?", a: "Заавал тос түрхэж чийгийг «түгжинэ». Тос түрхэхгүй бол арьсны гүнд орсон чийг ууршиж, хуурайшилт, эмзэгшил үүсэх эрсдэлтэй." },
  { q: "Аль бүтээгдэхүүнээс эхлэх вэ?", a: "Cosdiy-6 Set: нунтаг цэвэрлэгч, Detox Jus тонер, хоёр нунтаг серум, Milk Shot Ampoule, D+ Cream. Тус тусад нь авахаас хямд." },
  { q: "Дэлгүүр хаана байдаг вэ?", a: `${business.store.address}. Утас ${business.phone.display}.` },
];

export default function Info() {
  return (
    <div>
      {/* about */}
      <section id="about" className="relative scroll-mt-32 overflow-hidden bg-[linear-gradient(165deg,var(--color-pearl),var(--color-mist))]">
        <Drops count={8} />
        <div className="wrap relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rise">
            <p className="eyebrow text-azure">Бидний тухай</p>
            <h1 className="serif mt-5 text-5xl leading-[1.02] font-light md:text-7xl">
              Korean healthy <em className="text-azure">skin care.</em>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-2">
              Cosdiy Mongolia нь солонгос арьс арчилгааны бүтээгдэхүүнийг Улаанбаатарт хүргэдэг. Манай гол бүтээгдэхүүн бол ус нэмээгүй 100% нунтаг серум, дусал ч усгүй ролл маск, мөн цэвэрлэгээнээс тос хүртэлх зургаан алхмыг нэг хайрцагт багтаасан Cosdiy-6 Set.
            </p>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink-2">
              Логон дээр бичсэн «cosmetics D.I.Y» гэдэг маань: нунтгаа ампул, тостойгоо хольж, арьсандаа яг одоо хэрэгтэйг өөрөө бүтээх.
            </p>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {[
                [String(products.length), "бүтээгдэхүүн"],
                [String(categories.length), "ангилал"],
                [String(brands.length), "брэнд"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-pearl/80 p-4 text-center ring-1 ring-white backdrop-blur">
                  <dt className="sr-only">{l}</dt>
                  <dd className="serif tnum text-4xl font-light text-azure">{v}</dd>
                  <dd className="text-[12px] tracking-wide text-mute uppercase">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative mx-auto w-full max-w-[460px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[32px] shadow-[0_50px_100px_-40px_rgb(20_28_51/0.45)]">
              <Image src={getLook("cleanse").image.src} alt="Cosdiy" fill priority sizes="(min-width: 1024px) 40vw, 92vw" className="kenburns object-cover" />
            </div>
            <Seal className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-pearl p-2 text-ink shadow-xl md:-left-12 md:h-36 md:w-36" />
          </div>
        </div>
      </section>

      {/* three ideas */}
      <section className="wrap pt-20 md:pt-28">
        <div className="grid gap-5 md:grid-cols-3">
          {PILLARS.map((x, k) => (
            <Reveal key={x.t} delay={k * 100}>
              <div className="group h-full rounded-[28px] bg-pearl p-7 ring-1 ring-line transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgb(20_28_51/0.3)]">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-mist text-azure transition duration-500 group-hover:bg-azure group-hover:text-pearl">{x.icon}</span>
                <p className="serif mt-6 text-3xl">{x.t}</p>
                <p className="mt-2 text-[15px] text-ink-2">{x.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* editorial strip of the shop's portraits */}
      <section className="mt-20 overflow-hidden md:mt-28" aria-label="Зургууд">
        <div className="marquee" style={{ animationDuration: "60s" }}>
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 gap-4 pr-4" aria-hidden={k === 1}>
              {["roll-mask", "d-cream", "sun", "hair", "lash", "set", "solarcare"].map((id) => {
                const l = getLook(id);
                return (
                  <Link key={id} href={l.to} className="group relative block h-64 w-52 shrink-0 overflow-hidden rounded-[24px] md:h-80 md:w-64" tabIndex={k === 1 ? -1 : undefined}>
                    <Image src={l.image.src} alt={k === 0 ? l.title : ""} fill sizes="256px" className="object-cover transition duration-700 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent" />
                    <span className="serif absolute bottom-4 left-4 text-xl text-pearl italic">{l.title}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* delivery + payment */}
      <section id="delivery" className="wrap scroll-mt-32 pt-20 md:pt-28">
        <Reveal>
          <p className="eyebrow text-azure">Хүргэлт, төлбөр</p>
          <h2 className="serif mt-3 text-4xl md:text-5xl">24–48 цагийн дотор таны гарт</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Reveal className="rounded-[28px] bg-pearl p-6 ring-1 ring-line md:p-8">
            <p className="flex items-center gap-3 font-semibold">
              <TruckIcon size={22} className="text-azure" /> Хүргэлт
            </p>
            <ul className="mt-6 divide-y divide-line">
              {business.delivery.map((d) => (
                <li key={d.id} className="flex items-start justify-between gap-6 py-4">
                  <span>
                    <span className="serif block text-2xl">{d.name}</span>
                    <span className="text-[14px] text-ink-2">{d.note}</span>
                  </span>
                  <span className="serif tnum text-2xl text-azure">{formatPrice(d.fee)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[13.5px] text-mute">Орон нутгийн хүргэлтийн талаар {business.phone.display} дугаараас лавлана уу.</p>
          </Reveal>
          <Reveal delay={100} className="rounded-[28px] bg-ink p-6 text-pearl md:p-8">
            <p className="flex items-center gap-3 font-semibold">
              <ShieldIcon size={22} className="text-mist-2" /> Төлбөр
            </p>
            <ul className="mt-6 space-y-3">
              {business.payments.map((m) => (
                <li key={m.id} className="rounded-2xl bg-white/6 p-4 ring-1 ring-white/10">
                  <span className="serif block text-2xl">{m.name}</span>
                  <span className="text-[14px] text-pearl/65">{m.note}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13.5px] text-pearl/55">{business.rules.ebarimt}</p>
          </Reveal>
        </div>
      </section>

      {/* faq */}
      <section id="faq" className="wrap scroll-mt-32 pt-20 md:pt-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="eyebrow text-azure">Түгээмэл асуулт</p>
            <h2 className="serif mt-3 text-4xl md:text-5xl">Асуух зүйл байна уу?</h2>
            <p className="mt-4 text-ink-2">Хариулт нь бүтээгдэхүүний заавар, дэлгүүрийн журмаас.</p>
          </Reveal>
          <div className="divide-y divide-line border-y border-line">
            {FAQ.map((f, k) => (
              <Reveal key={f.q} delay={k * 50}>
                <details className="group py-5" open={k === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="serif text-2xl">{f.q}</span>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 ring-line transition duration-300 group-open:rotate-45 group-open:bg-ink group-open:text-pearl">+</span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-ink-2">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* contact */}
      <section id="contact" className="wrap scroll-mt-32 pt-20 md:pt-28">
        <Reveal className="relative overflow-hidden rounded-[36px] bg-mist p-8 md:p-14">
          <Drops count={6} />
          <div className="relative grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div>
              <p className="eyebrow text-azure">Дэлгүүр</p>
              <h2 className="serif mt-3 text-4xl leading-tight md:text-6xl">
                {business.store.name}, <em className="text-azure">{business.store.floor}</em>
              </h2>
              <p className="mt-4 max-w-md text-ink-2">{business.store.address}</p>
              <a href={business.store.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-dark mt-8">
                Газрын зураг <ArrowIcon size={17} />
              </a>
            </div>
            <ul className="space-y-3">
              {[
                { href: `tel:${business.phone.tel}`, icon: <PhoneIcon size={18} />, t: business.phone.display },
                { href: `mailto:${business.email}`, icon: <MailIcon size={18} />, t: business.email },
                { href: business.facebook, icon: <FacebookIcon size={18} />, t: "facebook.com/cosdiyy" },
                { href: business.instagram, icon: <InstagramIcon size={18} />, t: "@cosdiy_mongolia" },
                { href: business.youtube, icon: <YoutubeIcon size={18} />, t: "YouTube" },
                { href: business.store.mapUrl, icon: <PinIcon size={18} />, t: "Encanto Centro Mall" },
              ].map((x) => (
                <li key={x.t}>
                  <a href={x.href} target={x.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl bg-pearl/80 px-4 py-3 text-[15px] ring-1 ring-white backdrop-blur transition hover:bg-pearl hover:text-azure">
                    <span className="text-azure">{x.icon}</span>
                    <span className="break-all">{x.t}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
