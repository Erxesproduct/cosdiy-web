"use client";

import { useState } from "react";
import { cart, maxQty } from "@/lib/cart";
import { CheckIcon, PlusIcon } from "./icons";

/** Round «+» on a product card: adds one to the cart, shows a tick for a moment. */
export function QuickAdd({ slug, name }: { slug: string; name: string }) {
  const [added, setAdded] = useState(false);
  if (maxQty(slug) <= 0) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        cart.add(slug);
        setAdded(true);
        setTimeout(() => setAdded(false), 1400);
      }}
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1 transition duration-300 ${added ? "bg-azure text-white ring-azure" : "text-ink ring-line hover:bg-ink hover:text-pearl hover:ring-ink"}`}
      aria-label={`${name}: сагсанд нэмэх`}
    >
      {added ? <CheckIcon size={18} /> : <PlusIcon size={18} />}
      <span className="sr-only" aria-live="polite">
        {added ? "Сагсанд нэмэгдлээ" : ""}
      </span>
    </button>
  );
}
