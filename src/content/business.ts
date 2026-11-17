/**
 * Business facts from cosdiy.mn (Zochil shop 29918: shop settings, payment and delivery rules, delivery options)
 * and the Facebook page «Cosdiy Mongolia», read on 2026-11-17. Nothing here is invented; open questions
 * (the two delivery prices, countryside, store pickup and hours) are listed in docs/erxes/MANUAL-STEPS.md.
 */
export const business = {
  name: "Cosdiy Mongolia",
  /** The two lines printed on the logo. */
  tagline: "Korean healthy skin care",
  motto: "Cosmetics D.I.Y",
  description:
    "Солонгос арьс арчилгаа: 100% нунтаг серум, дусал ч усгүй ролл маск, Cosdiy-6 иж бүрдэл. Encanto Centro Mall, 3 давхар, Улаанбаатар.",
  phone: { display: "9403-9003", tel: "+97694039003" },
  email: "cosdiymongolia@gmail.com",
  store: {
    name: "Encanto Centro Mall",
    floor: "3 давхар",
    address: "Сүхбаатар дүүрэг, 3-р хороо, Нарны зам дагуу, Encanto Centro Mall 3 давхар",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Encanto Centro Mall, Ulaanbaatar"),
  },
  facebook: "https://www.facebook.com/cosdiyy",
  instagram: "https://www.instagram.com/cosdiy_mongolia/",
  youtube: "https://www.youtube.com/watch?v=rWovLfURQ5s",
  /** Zochil payment rule: «Дансаар / Зээлийн аппликейшүүд Lend.mn, Pocket zero, Store pay, Omni way», plus QPay. */
  payments: [
    { id: "qpay", name: "QPay", note: "Аль ч банкны аппаар QR уншуулж төлнө" },
    { id: "bank", name: "Дансаар", note: "Дансны мэдээллийг захиалга бүртгэгдэхэд илгээнэ" },
    { id: "loan", name: "Зээлийн апп", note: "Lend.mn, Pocket Zero, StorePay, OmniWay" },
  ],
  /**
   * The shop's delivery rule: «24–48 цагтаа Хотын А бүсэд 6000, Холын бүс бол 10000 төгрөг». The Zochil delivery
   * options charge 10,000₮ for both zones, free over 1,000,000₮; the rule text is used here and the conflict is
   * listed in MANUAL-STEPS.
   */
  delivery: [
    { id: "city", name: "Хотын А бүс", fee: 6000, note: "Оффицер–5 шар, Дарь эх–Яармаг · 24–48 цагт" },
    { id: "outer", name: "Холын бүс", fee: 10000, note: "Баруун салаа, Зүүн салаа, 7 буудал, Амгалан, Нисэх · 24–48 цагт" },
  ],
  rules: {
    delivery: "Захиалга өгснөөс хойш 24–48 цагийн дотор хүргэнэ. Хотын А бүсэд 6,000₮, холын бүсэд 10,000₮.",
    payment: "QPay, дансаар эсвэл Lend.mn, Pocket Zero, StorePay, OmniWay зээлийн аппаар төлж болно.",
    ebarimt: "Бүх захиалгад и-баримт олгоно. Байгууллагаар авах бол 7 оронтой регистрийн дугаараа бичнэ үү.",
  },
} as const;

export type DeliveryId = (typeof business.delivery)[number]["id"];
export const deliveryOption = (id: DeliveryId) => business.delivery.find((d) => d.id === id)!;

/** Delivery fee by zone (no free-delivery threshold in the shop's rule). */
export const deliveryFee = (id: DeliveryId) => deliveryOption(id).fee;
