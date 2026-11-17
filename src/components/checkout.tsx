"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { business, deliveryFee, type DeliveryId } from "@/content/business";
import { cart, cartSubtotal, maxQty, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { resolveLine } from "@/lib/lite";
import type { OrderErrors, PaymentMethod } from "@/lib/orders/schema";
import { CheckIcon, DropIcon, MinusIcon, PhoneIcon, PlusIcon, TrashIcon } from "./icons";

type Done = { payment: PaymentMethod; reference: string; total: number; deliveryFee: number; lines: { name: string; qty: number; total: number }[] };

const field =
  "mt-1.5 w-full rounded-2xl border border-line bg-porcelain px-4 py-3 text-[15.5px] outline-none transition focus:border-azure focus:bg-white aria-invalid:border-azure aria-invalid:bg-blush";

export function Checkout() {
  const items = useCart();
  const [delivery, setDelivery] = useState<DeliveryId>("city");
  const [payment, setPayment] = useState<PaymentMethod>("qpay");
  const [receiptType, setReceiptType] = useState<"person" | "company">("person");
  const [errors, setErrors] = useState<OrderErrors>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  const lines = items.flatMap((i) => {
    const l = resolveLine(i.slug);
    return l ? [{ ...i, line: l }] : [];
  });
  const subtotal = cartSubtotal(items);
  const fee = deliveryFee(delivery);
  const total = subtotal + fee;

  if (done) return <Receipt done={done} />;

  if (!lines.length)
    return (
      <div className="mx-auto max-w-lg rounded-[28px] bg-pearl px-8 py-14 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mist text-azure">
          <DropIcon size={28} />
        </span>
        <p className="serif mt-4 text-3xl">Сагс хоосон байна</p>
        <p className="mt-2 text-ink-2">Арьсандаа тохирохоо сонгоод «Сагсанд хийх» товчийг дарна уу.</p>
        <Link href="/shop" className="btn btn-dark mt-7">
          Дэлгүүр үзэх
        </Link>
      </div>
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setNotice(null);
    setErrors({});
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          phone: f.get("phone"),
          email: f.get("email"),
          delivery,
          address: f.get("address") ?? "",
          payment,
          receiptType,
          regNo: f.get("regNo") ?? "",
          note: f.get("note"),
          website: f.get("website"),
          items: items.map(({ slug, qty }) => ({ slug, qty })),
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        setDone({ payment, reference: json.reference, total: json.total ?? total, deliveryFee: json.deliveryFee ?? fee, lines: lines.map((l) => ({ name: l.line.product.n, qty: l.qty, total: l.line.price * l.qty })) });
        cart.clear();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (res.status === 422 && json?.errors) {
        setErrors(json.errors);
        setNotice("Мэдээллээ шалгаад дахин оролдоно уу.");
      } else if (json?.error === "not_configured") {
        setNotice(`Онлайн захиалгын систем тохируулагдаж байна. Захиалгаа ${business.phone.display} дугаарт утсаар өгнө үү (лавлах код ${json.reference}, нийт ${formatPrice(json.total ?? total)}).`);
      } else {
        setNotice(`Захиалга илгээхэд алдаа гарлаа. Дахин оролдох эсвэл ${business.phone.display} дугаарт залгана уу.`);
      }
    } catch {
      setNotice("Интернэт холболтоо шалгаад дахин оролдоно уу.");
    } finally {
      setBusy(false);
    }
  }

  const err = (k: keyof OrderErrors) => errors[k] && <p className="mt-1.5 text-[13.5px] font-semibold text-azure">{errors[k]}</p>;
  const box = "rounded-[24px] bg-pearl ring-1 ring-line p-5 md:p-7";
  const step = (n: number, t: string) => (
    <h2 className="flex items-center gap-3">
      <span className="serif grid h-8 w-8 place-items-center rounded-full bg-porcelain text-azure ring-1 ring-line">{n}</span>
      <span className="serif text-2xl">{t}</span>
    </h2>
  );

  return (
    <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      <div className="space-y-5">
        <section className="rounded-[24px] ring-1 ring-line">
          <ul className="divide-y divide-line">
            {lines.map(({ slug, qty, line }) => (
              <li key={slug} className="flex gap-4 p-4 md:p-5">
                <Link href={`/p/${slug}`} className="field relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl ring-1 ring-line">
                  <Image src={line.product.t} alt="" fill sizes="80px" className="object-contain p-1.5 mix-blend-multiply" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="eyebrow truncate text-[10px] text-mute">{line.product.c}</span>
                  <Link href={`/p/${slug}`} className="serif text-lg leading-snug hover:text-azure">
                    {line.product.n}
                  </Link>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center rounded-full ring-1 ring-line">
                      <button type="button" onClick={() => cart.setQty(slug, qty - 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-mist" aria-label="Цөөлөх">
                        <MinusIcon size={16} />
                      </button>
                      <span className="tnum w-7 text-center text-sm font-semibold">{qty}</span>
                      <button type="button" onClick={() => cart.setQty(slug, qty + 1)} disabled={qty >= maxQty(slug)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-mist disabled:opacity-35" aria-label="Нэмэх">
                        <PlusIcon size={16} />
                      </button>
                    </div>
                    <span className="tnum font-semibold">{formatPrice(line.price * qty)}</span>
                    <button type="button" onClick={() => cart.setQty(slug, 0)} className="grid h-9 w-9 place-items-center rounded-full text-mute hover:bg-mist hover:text-azure" aria-label={`${line.product.n}: хасах`}>
                      <TrashIcon size={17} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={box}>
          {step(1, "Захиалагч")}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-[14px] font-semibold">
              Нэр
              <input name="name" autoComplete="name" required aria-invalid={!!errors.name} className={field} />
              {err("name")}
            </label>
            <label className="text-[14px] font-semibold">
              Утас
              <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="99112233" required aria-invalid={!!errors.phone} className={field} />
              {err("phone")}
            </label>
            <label className="text-[14px] font-semibold sm:col-span-2">
              Имэйл <span className="font-normal text-mute">(заавал биш)</span>
              <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className={field} />
              {err("email")}
            </label>
          </div>
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        </section>

        <section className={box}>
          {step(2, "Хүргэлт")}
          <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Хүргэлт">
            {business.delivery.map((d) => (
              <button
                key={d.id}
                type="button"
                role="radio"
                aria-checked={delivery === d.id}
                onClick={() => setDelivery(d.id)}
                className="rounded-2xl bg-porcelain p-4 text-left ring-1 ring-line transition hover:ring-ink aria-checked:ring-2 aria-checked:ring-azure"
              >
                <span className="flex items-center justify-between gap-2 font-semibold">
                  {d.name}
                  <span className="tnum text-[14px] text-azure">{formatPrice(d.fee)}</span>
                </span>
                <span className="mt-1 block text-[13px] leading-snug text-mute">{d.note}</span>
              </button>
            ))}
          </div>
          {err("delivery")}
          <label className="mt-4 block text-[14px] font-semibold">
            Хаяг
            <textarea
              name="address"
              rows={2}
              required
              aria-invalid={!!errors.address}
              placeholder="Дүүрэг, хороо, байр, орц, давхар, тоот"
              className={field}
            />
            {err("address")}
          </label>
        </section>

        <section className={box}>
          {step(3, "И-баримт, тайлбар")}
          <div className="mt-5 flex gap-2" role="radiogroup" aria-label="И-баримтын төрөл">
            {(
              [
                ["person", "Хувь хүн"],
                ["company", "Байгууллага"],
              ] as const
            ).map(([id, label]) => (
              <button key={id} type="button" role="radio" aria-checked={receiptType === id} onClick={() => setReceiptType(id)} className="rounded-full bg-porcelain px-5 py-2 text-[14.5px] font-semibold ring-1 ring-line aria-checked:bg-ink aria-checked:text-pearl aria-checked:ring-ink">
                {label}
              </button>
            ))}
          </div>
          {receiptType === "company" ? (
            <label className="mt-4 block text-[14px] font-semibold">
              Байгууллагын регистр
              <input name="regNo" inputMode="numeric" maxLength={7} placeholder="1234567" aria-invalid={!!errors.regNo} className={field} />
              {err("regNo")}
            </label>
          ) : (
            <p className="mt-3 text-[13.5px] text-mute">И-баримтыг таны утасны дугаараар бүртгэнэ.</p>
          )}
          <label className="mt-5 block text-[14px] font-semibold">
            Нэмэлт тайлбар <span className="font-normal text-mute">(бэлгийн мэндчилгээ, хүргэх цаг гэх мэт)</span>
            <textarea name="note" rows={2} className={field} />
          </label>
        </section>
      </div>

      <aside className="lg:sticky lg:top-32 lg:self-start">
        <div className="relative overflow-hidden rounded-[28px] bg-night p-6 text-pearl md:p-8">
          <div className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgb(59_91_169/0.5),transparent)]" aria-hidden />
          <h2 className="serif relative text-3xl">Төлөх дүн</h2>
          <dl className="tnum relative mt-5 space-y-2.5 text-[15.5px]">
            <div className="flex justify-between">
              <dt className="text-pearl/65">Барааны дүн</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-pearl/65">Хүргэлт</dt>
              <dd>{formatPrice(fee)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-white/12 pt-3">
              <dt className="font-semibold">Нийт</dt>
              <dd className="serif text-3xl text-mist-2">{formatPrice(total)}</dd>
            </div>
          </dl>
          <fieldset className="relative mt-6">
            <legend className="eyebrow text-[10px] text-pearl/60">Төлбөр</legend>
            <div className="mt-3 space-y-2" role="radiogroup" aria-label="Төлбөрийн хэлбэр">
              {business.payments.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={payment === m.id}
                  onClick={() => setPayment(m.id)}
                  className="flex w-full items-center gap-3 rounded-2xl bg-white/6 p-3 text-left ring-1 ring-white/10 transition hover:bg-white/10 aria-checked:bg-white/12 aria-checked:ring-mist-2"
                >
                  <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full ring-1 ${payment === m.id ? "ring-mist-2" : "ring-white/40"}`}>
                    {payment === m.id && <span className="h-2 w-2 rounded-full bg-mist-2" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold">{m.name}</span>
                    <span className="block text-[12px] leading-snug text-pearl/60">{m.note}</span>
                  </span>
                </button>
              ))}
            </div>
            {errors.payment && <p className="mt-2 text-[13px] font-semibold text-mist-2">{errors.payment}</p>}
          </fieldset>
          {notice && (
            <p role="alert" className="relative mt-4 rounded-2xl bg-mist px-4 py-3 text-[14px] font-medium text-ink">
              {notice}
            </p>
          )}
          {errors.items && <p className="relative mt-3 text-[14px] font-semibold text-mist-2">{errors.items}</p>}
          <button type="submit" disabled={busy} className="btn btn-light relative mt-6 h-14 w-full text-[16px] disabled:cursor-wait disabled:opacity-60">
            {busy ? "Илгээж байна…" : "Захиалга өгөх"}
          </button>
          <a href={`tel:${business.phone.tel}`} className="relative mt-4 flex items-center gap-2 text-[14px] font-semibold text-pearl/75 hover:text-mist-2">
            <PhoneIcon size={16} /> Асуух зүйл байвал: {business.phone.display}
          </a>
        </div>
      </aside>
    </form>
  );
}

function Receipt({ done }: { done: Done }) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="rise rounded-[28px] bg-pearl p-8">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-azure text-white">
          <CheckIcon size={28} />
        </span>
        <h2 className="serif mt-5 text-4xl">Захиалга хүлээн авлаа</h2>
        <p className="mt-2 text-ink-2">
          Захиалгын код: <b className="tnum text-ink">{done.reference}</b>
        </p>
        <ul className="tnum mt-6 space-y-2 text-[15px]">
          {done.lines.map((l) => (
            <li key={l.name} className="flex justify-between gap-4">
              <span className="text-ink-2">
                {l.name} × {l.qty}
              </span>
              <span>{formatPrice(l.total)}</span>
            </li>
          ))}
          <li className="flex justify-between gap-4">
            <span className="text-ink-2">Хүргэлт</span>
            <span>{formatPrice(done.deliveryFee)}</span>
          </li>
          <li className="flex justify-between gap-4 border-t border-line pt-3 text-lg font-semibold">
            <span>Нийт</span>
            <span>{formatPrice(done.total)}</span>
          </li>
        </ul>
        <p className="mt-6 text-[14.5px] leading-relaxed text-ink-2">
          {done.payment === "qpay" ? "QPay нэхэмжлэлийг таны утсанд илгээнэ." : done.payment === "bank" ? "Дансны мэдээллийг таны утсанд илгээнэ." : "Зээлийн аппаар төлөх зааврыг бид утсаар хэлж өгнө."} Төлбөр төлөгдсөний дараа 24–48 цагийн дотор хүргэнэ. {business.rules.ebarimt}
        </p>
        <Link href="/shop" className="btn btn-dark mt-7">
          Үргэлжлүүлэн үзэх
        </Link>
      </div>
    </div>
  );
}
