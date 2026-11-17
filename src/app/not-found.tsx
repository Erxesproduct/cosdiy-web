import Link from "next/link";
import { DropIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="wrap py-28 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mist text-azure">
        <DropIcon size={28} />
      </span>
      <h1 className="serif mt-6 text-5xl">Хуудас олдсонгүй</h1>
      <p className="mt-3 text-ink-2">Хаяг өөрчлөгдсөн байж магадгүй. Дэлгүүрээс хайгаад үзээрэй.</p>
      <Link href="/shop" className="btn btn-dark mt-8">
        Дэлгүүр
      </Link>
    </div>
  );
}
