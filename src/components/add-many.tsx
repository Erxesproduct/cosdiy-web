"use client";

import Link from "next/link";
import { useState } from "react";
import { cart, maxQty } from "@/lib/cart";
import { ArrowIcon, BagIcon, CheckIcon } from "./icons";

/** Adds several products to the cart in one press; then offers the way to the cart. */
export function AddMany({ slugs, label, className = "btn btn-dark", light }: { slugs: string[]; label: string; className?: string; light?: boolean }) {
  const [done, setDone] = useState(false);
  const ok = slugs.filter((s) => maxQty(s) > 0);
  if (done)
    return (
      <Link href="/cart" className={`${className} rise`}>
        <CheckIcon size={17} /> Сагсанд нэмэгдлээ · Сагс <ArrowIcon size={16} />
      </Link>
    );
  return (
    <button
      type="button"
      disabled={!ok.length}
      onClick={() => {
        ok.forEach((s) => cart.add(s));
        setDone(true);
        setTimeout(() => setDone(false), 6000);
      }}
      className={`${className} disabled:opacity-40`}
    >
      <BagIcon size={17} className={light ? "" : "opacity-80"} /> {label}
    </button>
  );
}
