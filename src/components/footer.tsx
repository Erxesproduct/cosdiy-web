import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { categories } from "@/lib/catalog";
import { Drops } from "./drops";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, YoutubeIcon } from "./icons";
import { Seal } from "./seal";

export function Footer() {
  return (
    <footer className="relative mt-28 overflow-hidden bg-night text-pearl/75">
      <Drops count={9} className="opacity-30 mix-blend-screen" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(59_91_169/0.35),transparent)]" aria-hidden />
      <div className="wrap relative pt-16 md:pt-24">
        <div className="flex flex-col items-start justify-between gap-10 border-b border-white/10 pb-14 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-champagne">{business.motto}</p>
            <p className="serif mt-4 max-w-xl text-4xl leading-[1.08] text-pearl md:text-6xl">
              Арьсандаа хэрэгтэйг <em className="text-mist-2">өөрөө</em> хольж бүтээ.
            </p>
          </div>
          <Seal className="h-32 w-32 shrink-0 text-pearl/80 md:h-40 md:w-40" />
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Image src="/brand/logo-white.png" alt={business.name} width={603} height={220} className="h-14 w-auto" />
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-pearl/60">{business.description}</p>
          </div>
          <div>
            <p className="eyebrow text-pearl">Ангилал</p>
            <ul className="mt-5 space-y-2.5 text-[14px]">
              {categories.slice(0, 7).map((c) => (
                <li key={c.id}>
                  <Link href={`/shop?c=${c.id}`} className="transition hover:text-pearl">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-pearl">Мэдээлэл</p>
            <ul className="mt-5 space-y-2.5 text-[14px]">
              <li>
                <Link href="/info#about" className="transition hover:text-pearl">
                  Бидний тухай
                </Link>
              </li>
              <li>
                <Link href="/info#delivery" className="transition hover:text-pearl">
                  Хүргэлт, төлбөр
                </Link>
              </li>
              <li>
                <Link href="/info#faq" className="transition hover:text-pearl">
                  Түгээмэл асуулт
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition hover:text-pearl">
                  Сагс
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-pearl">Холбоо барих</p>
            <ul className="mt-5 space-y-3 text-[14px]">
              <li>
                <a href={`tel:${business.phone.tel}`} className="flex items-center gap-2.5 transition hover:text-pearl">
                  <PhoneIcon size={16} /> {business.phone.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${business.email}`} className="flex items-center gap-2.5 break-all transition hover:text-pearl">
                  <MailIcon size={16} /> {business.email}
                </a>
              </li>
              <li>
                <a href={business.store.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 transition hover:text-pearl">
                  <PinIcon size={16} className="mt-1 shrink-0" /> {business.store.address}
                </a>
              </li>
            </ul>
            <div className="mt-6 flex gap-2">
              {[
                { href: business.facebook, label: "Facebook", icon: <FacebookIcon size={18} /> },
                { href: business.instagram, label: "Instagram", icon: <InstagramIcon size={18} /> },
                { href: business.youtube, label: "YouTube", icon: <YoutubeIcon size={18} /> },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/20 transition hover:bg-pearl hover:text-night">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-7 text-[12.5px] text-pearl/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {business.name}. {business.tagline}.
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            {business.payments.map((p) => (
              <span key={p.id}>{p.id === "loan" ? p.note : p.name}</span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
