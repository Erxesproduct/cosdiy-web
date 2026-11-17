import { business, deliveryFee, type DeliveryId } from "@/content/business";
import { resolveLine, type Product } from "@/lib/catalog";

export type PaymentMethod = (typeof business.payments)[number]["id"];
export type OrderLine = { product: Product; qty: number; unitPrice: number; lineTotal: number };

export type Order = {
  name: string;
  phone: string;
  email: string | null;
  delivery: DeliveryId;
  /** Always required: a city address, or the town, bus and receiver for countryside. */
  address: string;
  payment: PaymentMethod;
  /** eBarimt receipt: to a person (by phone) or to an organization (7-digit registry number). */
  receipt: { type: "person" } | { type: "company"; regNo: string };
  note: string | null;
  lines: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  /** Honeypot: real visitors never fill it. */
  website: string;
};

export type OrderField = "name" | "phone" | "email" | "delivery" | "address" | "payment" | "regNo" | "items";
export type OrderErrors = Partial<Record<OrderField, string>>;

export const MAX_QTY = 20;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** 8-digit Mongolian number, optionally prefixed with +976 / 976. Returns the 8 digits or null. */
export function normalizePhone(raw: string) {
  const digits = raw.replace(/[\s\-()]/g, "").replace(/^\+?976/, "");
  return /^[5-9]\d{7}$/.test(digits) ? digits : null;
}

export function validateOrder(body: unknown): { ok: true; order: Order } | { ok: false; errors: OrderErrors } {
  const b = (body ?? {}) as Record<string, unknown>;
  const errors: OrderErrors = {};

  const name = str(b.name, 80);
  if (name.length < 2) errors.name = "Нэрээ оруулна уу.";
  const phone = normalizePhone(str(b.phone, 20));
  if (!phone) errors.phone = "8 оронтой утасны дугаар оруулна уу.";
  const email = str(b.email, 120) || null;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Имэйл хаяг буруу байна.";

  const payment = business.payments.find((p) => p.id === b.payment)?.id;
  if (!payment) errors.payment = "Төлбөрийн хэлбэрээ сонгоно уу.";

  const receiptType = b.receiptType === "company" ? "company" : "person";
  const regNo = str(b.regNo, 20).replace(/\s/g, "");
  if (receiptType === "company" && !/^\d{7}$/.test(regNo)) errors.regNo = "Байгууллагын 7 оронтой регистрийн дугаар оруулна уу.";
  const note = str(b.note, 500) || null;

  // Prices always come from the catalog, never from the browser. Sold-out lines are dropped.
  const rawItems = Array.isArray(b.items) ? b.items.slice(0, 50) : [];
  const lines: OrderLine[] = [];
  let soldOut = false;
  for (const raw of rawItems) {
    const i = (raw ?? {}) as Record<string, unknown>;
    const line = typeof i.slug === "string" ? resolveLine(i.slug) : null;
    const qty = Number(i.qty);
    if (!line || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) continue;
    if (line.stock === 0) {
      soldOut = true;
      continue;
    }
    if (line.stock != null && qty > line.stock) continue;
    lines.push({ product: line.product, qty, unitPrice: line.price, lineTotal: line.price * qty });
  }
  if (!lines.length) errors.items = soldOut ? "Сагсанд байгаа бараа дууссан байна." : "Сагс хоосон байна.";
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);

  const delivery = business.delivery.find((d) => d.id === b.delivery)?.id;
  if (!delivery) errors.delivery = "Хүргэлтээ сонгоно уу.";
  const address = str(b.address, 300);
  if (address.length < 8)
    errors.address = "Хаягаа дэлгэрэнгүй бичнэ үү (дүүрэг, хороо, байр, орц, тоот).";

  if (Object.keys(errors).length) return { ok: false, errors };

  const fee = deliveryFee(delivery!);
  return {
    ok: true,
    order: {
      name,
      phone: phone!,
      email,
      delivery: delivery!,
      address,
      payment: payment!,
      receipt: receiptType === "company" ? { type: "company", regNo } : { type: "person" },
      note,
      lines,
      subtotal,
      deliveryFee: fee,
      total: subtotal + fee,
      website: str(b.website, 100),
    },
  };
}
