"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/lib/catalog";

export function Gallery({ images, name }: { images: Photo[]; name: string }) {
  const [i, setI] = useState(0);
  const img = images[i];
  return (
    <div className="min-w-0 md:sticky md:top-32 md:self-start">
      <div className="field relative aspect-square overflow-hidden rounded-[28px] ring-1 ring-line md:rounded-[36px]">
        <Image key={img.src} src={img.src} alt={i ? `${name}, зураг ${i + 1}` : name} fill priority sizes="(min-width: 768px) 52vw, 100vw" className={`rise ${i === 0 ? "object-contain p-[8%] mix-blend-multiply" : "object-cover"}`} />
        {images.length > 1 && (
          <span className="tnum absolute right-4 bottom-4 rounded-full bg-pearl/85 px-3 py-1 text-[12px] text-ink-2 backdrop-blur">
            {i + 1} / {images.length}
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Зургууд">
          {images.map((m, k) => (
            <button
              key={m.src}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={`Зураг ${k + 1}`}
              onClick={() => setI(k)}
              className="field relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl opacity-55 ring-1 ring-line transition hover:opacity-100 aria-selected:opacity-100 aria-selected:ring-2 aria-selected:ring-ink"
            >
              <Image src={m.thumb.src} alt="" fill sizes="72px" className={k === 0 ? "object-contain p-1.5 mix-blend-multiply" : "object-cover"} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
