"use client";

import Link from "next/link";
import { useState } from "react";
import { cart, maxQty, useCart } from "@/lib/cart";
import { ArrowIcon, CheckIcon, MinusIcon, PlusIcon } from "./icons";

export function BuyBox({ slug }: { slug: string }) {
  const cap = maxQty(slug);
  const inCart = useCart().find((i) => i.slug === slug)?.qty ?? 0;
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (cap <= 0)
    return (
      <div className="rounded-2xl bg-pearl p-4 text-[15px] text-ink-2">
        Одоогоор дууссан. Дахин ирэх эсэхийг утсаар лавлана уу.
      </div>
    );

  const room = Math.max(0, cap - inCart);
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <div className="flex h-12 items-center rounded-full ring-1 ring-line">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-12 w-12 place-items-center rounded-full hover:bg-mist" aria-label="Цөөлөх">
            <MinusIcon size={18} />
          </button>
          <span className="tnum w-8 text-center font-semibold" aria-live="polite">
            {qty}
          </span>
          <button type="button" onClick={() => setQty(Math.min(Math.max(1, room), qty + 1))} disabled={qty >= room} className="grid h-12 w-12 place-items-center rounded-full hover:bg-mist disabled:opacity-35" aria-label="Нэмэх">
            <PlusIcon size={18} />
          </button>
        </div>
        <button
          type="button"
          disabled={room === 0}
          onClick={() => {
            cart.add(slug, qty);
            setAdded(true);
            setQty(1);
            setTimeout(() => setAdded(false), 2000);
          }}
          className="btn btn-dark flex-1 disabled:opacity-50"
        >
          {added ? (
            <>
              <CheckIcon size={18} /> Сагсанд нэмэгдлээ
            </>
          ) : room === 0 ? (
            "Үлдэгдэл бүгд сагсанд байна"
          ) : (
            "Сагсанд хийх"
          )}
        </button>
      </div>
      {inCart > 0 && (
        <Link href="/cart" className="mt-3 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-azure hover:underline">
          Сагсанд {inCart} ширхэг байна: захиалах <ArrowIcon size={16} />
        </Link>
      )}
    </div>
  );
}
