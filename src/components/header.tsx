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
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.08em] text-ink-2 uppercase ring-1 ring-line">
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
