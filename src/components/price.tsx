import { discount, onSale, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export function Price({ p, large }: { p: Pick<Product, "price" | "compareAt">; large?: boolean }) {
  return (
    <span className={`tnum inline-flex flex-wrap items-baseline gap-x-2 ${large ? "text-[1.7rem]" : "text-[14.5px]"}`}>
      <span className={`${large ? "serif font-medium" : "font-semibold"} ${onSale(p) ? "text-azure" : "text-ink"}`}>{formatPrice(p.price)}</span>
      {onSale(p) && (
        <>
          <s className={`text-mute ${large ? "text-base" : "text-[12.5px]"}`}>{formatPrice(p.compareAt!)}</s>
          {large && <span className="rounded-full bg-azure/10 px-2 py-0.5 text-[12.5px] font-semibold text-azure">−{discount(p)}%</span>}
        </>
      )}
    </span>
  );
}
