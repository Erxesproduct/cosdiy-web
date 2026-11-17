"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const LAB = [
  { href: "/lab", label: "Beauty Lab", short: "Lab" },
  { href: "/lab/routine", label: "Build My Routine", short: "Routine" },
  { href: "/lab/ingredients", label: "Ingredient Story", short: "Найрлага" },
  { href: "/lab/masks", label: "Mask Finder", short: "Маск" },
  { href: "/videos", label: "Видео", short: "Видео" },
];

/** The Beauty Lab's own little menu, under the site header. */
export function LabTabs() {
  const path = usePathname();
  return (
    <nav aria-label="Beauty Lab" className="border-b border-line bg-porcelain/80">
      <div className="wrap no-scrollbar flex gap-1 overflow-x-auto py-2">
        {LAB.map((l) => {
          const on = path === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={on ? "page" : undefined}
              className="shrink-0 rounded-full px-4 py-2 text-[12px] font-semibold tracking-[0.12em] whitespace-nowrap text-ink-2 uppercase transition hover:text-ink aria-[current=page]:bg-ink aria-[current=page]:text-pearl"
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
