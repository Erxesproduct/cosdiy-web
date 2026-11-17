import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { CartLink } from "./cart-link";

const NAV = [
  { href: "/shop", label: "Бүх бараа" },
  { href: "/shop?c=powder", label: "Нунтаг серум" },
  { href: "/shop?c=mask", label: "Маск" },
  { href: "/p/cosdiy-6-set", label: "Cosdiy-6 Set" },
  { href: "/info", label: "Бидний тухай" },
];

const LAB_MENU = [
  { href: "/lab/routine", label: "Build My Routine", hint: "Арчилгааны дарааллаа бүтээ" },
  { href: "/lab/ingredients", label: "Ingredient Story", hint: "Гол найрлага, юунд тустай" },
  { href: "/lab/masks", label: "Mask Finder", hint: "Маск сонгох, харьцуулах" },
  { href: "/videos", label: "Видео", hint: "Хэрхэн хэрэглэх вэ" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-pearl/85 backdrop-blur-xl">
      <div className="bg-night text-pearl/80">
        <div className="no-scrollbar overflow-hidden">
          <p className="wrap flex h-8 items-center justify-center gap-3 text-[11px] tracking-[0.18em] whitespace-nowrap uppercase">
            <span className="hidden sm:inline">{business.tagline}</span>
            <span className="hidden text-champagne sm:inline" aria-hidden>
              ◆
            </span>
            <span>Хүргэлт 24–48 цагт</span>
            <span className="text-champagne" aria-hidden>
              ◆
            </span>
            <a href={`tel:${business.phone.tel}`} className="font-semibold text-pearl hover:text-mist-2">
              {business.phone.display}
            </a>
          </p>
        </div>
      </div>
      <div className="wrap grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-20">
        <nav aria-label="Үндсэн цэс" className="hidden items-center gap-7 lg:flex">
          {NAV.slice(0, 3).map((n) => (
            <Link key={n.href} href={n.href} className="relative text-[12.5px] font-semibold tracking-[0.16em] text-ink-2 uppercase transition after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-ink after:transition-all hover:text-ink hover:after:w-full">
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="col-start-1 justify-self-start lg:col-start-2 lg:justify-self-center" aria-label={`${business.name}, нүүр хуудас`}>
          <Image src="/brand/logo.png" alt={business.name} width={603} height={220} priority className="h-11 w-auto md:h-14" />
        </Link>
        <div className="col-start-3 flex items-center justify-end gap-7">
          <nav aria-label="Нэмэлт цэс" className="hidden items-center gap-7 lg:flex">
            <div className="group relative">
              <Link href="/lab" className="relative flex items-center gap-1.5 text-[12.5px] font-semibold tracking-[0.16em] text-azure uppercase transition hover:text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-champagne" aria-hidden />
                Beauty Lab
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden className="transition group-focus-within:rotate-180 group-hover:rotate-180">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Link>
              <div className="invisible absolute top-full left-1/2 z-50 w-72 -translate-x-1/2 pt-4 opacity-0 transition duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <ul className="rounded-[22px] bg-pearl p-2 shadow-[0_30px_70px_-30px_rgb(20_28_51/0.45)] ring-1 ring-line">
                  {LAB_MENU.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="block rounded-2xl px-4 py-3 transition hover:bg-mist">
                        <span className="serif block text-lg leading-tight text-ink">{l.label}</span>
                        <span className="block text-[12px] text-mute">{l.hint}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {NAV.slice(3).map((n) => (
              <Link key={n.href} href={n.href} className="relative text-[12.5px] font-semibold tracking-[0.16em] text-ink-2 uppercase transition after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-ink after:transition-all hover:text-ink hover:after:w-full">
                {n.label}
              </Link>
            ))}
          </nav>
          <CartLink />
        </div>
      </div>
      <nav aria-label="Үндсэн цэс" className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2.5 lg:hidden">
        <Link href="/lab" className="shrink-0 rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.08em] text-pearl uppercase">
          Beauty Lab
        </Link>
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.08em] text-ink-2 uppercase ring-1 ring-line">
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
