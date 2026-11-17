"use client";

import { useState } from "react";

/** YouTube thumbnail that turns into the player only when pressed (no YouTube scripts until then). */
export function LiteVideo({ id, title, className = "" }: { id: string; title: string; className?: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className={`relative aspect-video overflow-hidden bg-night ${className}`}>
      {on ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button type="button" onClick={() => setOn(true)} className="group absolute inset-0 h-full w-full" aria-label={`Видео тоглуулах: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100" />
          <span className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-transparent" />
          <span className="absolute top-1/2 left-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-pearl/90 text-ink shadow-xl ring-8 ring-pearl/25 transition duration-500 group-hover:scale-110">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
              <path d="M8 5.5v13l11-6.5Z" fill="currentColor" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
