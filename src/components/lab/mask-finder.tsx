"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { GoalId, MaskType } from "@/lib/lab";
import { CheckIcon, CloseIcon } from "../icons";
import { QuickAdd } from "../quick-add";
import { AddMany } from "../add-many";

export type MaskCard = {
  slug: string;
  name: string;
  brand: string | null;
  subtitle: string | null;
  price: number;
  thumb: string;
  type: MaskType;
  size: { n: number; unit: string } | null;
  goals: Record<GoalId, number>;
  ing: { id: string; name: string }[];
  purpose: string[];
  usage: string[];
};

type Props = { masks: MaskCard[]; goals: Record<GoalId, { name: string; hint: string }>; types: Record<MaskType, string> };

const perUnit = (m: MaskCard) => (m.size && m.size.unit === "ш" && m.size.n > 1 ? Math.round(m.price / m.size.n) : null);

export function MaskFinder({ masks, goals: GOAL_NAMES, types: TYPES }: Props) {
  const [need, setNeed] = useState<GoalId | null>(null);
  const [type, setType] = useState<MaskType | null>(null);
  const [cmp, setCmp] = useState<string[]>([]);

  // shareable comparison: /lab/masks?compare=slug-a,slug-b
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("compare");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from the URL after hydration
    if (q) setCmp(q.split(",").filter((s) => masks.some((m) => m.slug === s)).slice(0, 2));
  }, [masks]);
  useEffect(() => {
    const u = new URL(location.href);
    if (cmp.length) u.searchParams.set("compare", cmp.join(","));
    else u.searchParams.delete("compare");
    history.replaceState(null, "", u);
  }, [cmp]);

  const list = useMemo(
    () =>
      masks
        .filter((m) => (!type || m.type === type) && (!need || m.goals[need] > 0))
        .sort((a, b) => (need ? b.goals[need] - a.goals[need] : 0) || a.price - b.price),
    [masks, need, type],
  );
  const types = (Object.keys(TYPES) as MaskType[]).filter((t) => masks.some((m) => m.type === t));
  const pair = cmp.map((s) => masks.find((m) => m.slug === s)!).filter(Boolean);
  const toggle = (slug: string) => setCmp((c) => (c.includes(slug) ? c.filter((x) => x !== slug) : [...c, slug].slice(-2)));
  const top = Math.max(1, ...masks.flatMap((m) => Object.values(m.goals)));

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        <fieldset className="rounded-[26px] bg-pearl p-5 ring-1 ring-line md:p-6">
          <legend className="sr-only">Арьсны хэрэгцээ</legend>
          <p className="serif text-2xl">Арьсанд юу хэрэгтэй вэ?</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill on={!need} onClick={() => setNeed(null)}>
              Бүгд
            </Pill>
            {(Object.keys(GOAL_NAMES) as GoalId[]).map((g) => (
              <Pill key={g} on={need === g} onClick={() => setNeed(need === g ? null : g)} title={GOAL_NAMES[g].hint}>
                {GOAL_NAMES[g].name}
              </Pill>
            ))}
          </div>
        </fieldset>
        <fieldset className="rounded-[26px] bg-pearl p-5 ring-1 ring-line md:p-6">
          <legend className="sr-only">Маскны төрөл</legend>
          <p className="serif text-2xl">Ямар маск?</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill on={!type} onClick={() => setType(null)} blue>
              Бүгд
            </Pill>
            {types.map((t) => (
              <Pill key={t} on={type === t} onClick={() => setType(type === t ? null : t)} blue>
                {TYPES[t]}
              </Pill>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-2">
        <p className="tnum text-[13px] text-mute" aria-live="polite">
          {list.length} маск{need && ` · «${GOAL_NAMES[need].name}» гэж бичигдсэнээрээ эрэмбэлсэн`}
        </p>
        <p className="text-[13px] text-ink-2">Хоёр маскийг сонгоод харьцуулаарай.</p>
      </div>

      {list.length ? (
        <ul className="mt-4 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {list.map((m) => {
            const unit = perUnit(m);
            const sel = cmp.includes(m.slug);
            return (
              <li key={m.slug} className={`flex flex-col rounded-[24px] bg-pearl p-3 ring-1 transition md:p-4 ${sel ? "ring-2 ring-azure" : "ring-line"}`}>
                <Link href={`/p/${m.slug}`} className="field group relative block aspect-square overflow-hidden rounded-[18px]">
                  <Image src={m.thumb} alt={m.name} fill sizes="(min-width:1024px) 22vw, 45vw" className="object-contain p-3 mix-blend-multiply transition duration-700 group-hover:scale-105" />
                  <span className="absolute top-2 left-2 rounded-full bg-white/85 px-2 py-0.5 text-[10.5px] font-semibold text-ink-2 backdrop-blur">{TYPES[m.type]}</span>
                </Link>
                {m.brand && <span className="eyebrow mt-3 block text-[9.5px] text-mute">{m.brand}</span>}
                <Link href={`/p/${m.slug}`} className="serif mt-0.5 line-clamp-2 text-lg leading-tight hover:text-azure">
                  {m.name}
                </Link>
                {m.ing.length > 0 && (
                  <span className="mt-1.5 flex flex-wrap gap-1">
                    {m.ing.slice(0, 3).map((i) => (
                      <Link key={i.id} href={`/lab/ingredients#${i.id}`} className="rounded-full bg-mist px-2 py-0.5 text-[10.5px] text-azure hover:bg-mist-2">
                        {i.name}
                      </Link>
                    ))}
                  </span>
                )}
                <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                  <span>
                    <span className="tnum block font-semibold">{formatPrice(m.price)}</span>
                    {unit && <span className="tnum block text-[11.5px] text-mute">1 ш ≈ {formatPrice(unit)}</span>}
                  </span>
                  <QuickAdd slug={m.slug} name={m.name} />
                </div>
                <label className="mt-3 flex cursor-pointer items-center gap-2 border-t border-line pt-3 text-[12.5px] font-medium text-ink-2">
                  <input type="checkbox" checked={sel} onChange={() => toggle(m.slug)} className="h-4 w-4 accent-[var(--color-azure)]" />
                  Харьцуулах
                </label>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 rounded-[22px] bg-pearl p-8 text-center text-ink-2 ring-1 ring-line">Энэ хослолд тохирох маск алга. «Бүгд» сонгоод үзээрэй.</p>
      )}

      {/* compare */}
      <section aria-labelledby="cmp" className="mt-12">
        <h2 id="cmp" className="serif text-3xl md:text-4xl">
          Харьцуулалт
        </h2>
        {pair.length < 2 ? (
          <p className="mt-3 rounded-[22px] border border-dashed border-line p-6 text-center text-[14px] text-ink-2">{pair.length ? `«${pair[0].name}» сонгогдлоо. Дахиад нэг маск сонгоорой.` : "Дээрх жагсаалтаас хоёр маскийг «Харьцуулах» гэж тэмдэглэ."}</p>
        ) : (
          <div className="rise mt-5 overflow-hidden rounded-[26px] bg-pearl ring-1 ring-line">
            <div className="grid grid-cols-[64px_minmax(0,1fr)_minmax(0,1fr)] md:grid-cols-[170px_minmax(0,1fr)_minmax(0,1fr)]">
              <div className="bg-porcelain" />
              {pair.map((m) => (
                <div key={m.slug} className="relative border-l border-line p-3 md:p-5">
                  <button type="button" onClick={() => toggle(m.slug)} aria-label={`${m.name}: харьцуулалтаас хасах`} className="absolute top-2 right-2 grid h-8 w-8 place-items-center rounded-full text-mute hover:bg-mist hover:text-ink">
                    <CloseIcon size={15} />
                  </button>
                  <span className="field relative mx-auto block aspect-square w-20 overflow-hidden rounded-2xl md:w-28">
                    <Image src={m.thumb} alt="" fill sizes="112px" className="object-contain p-2 mix-blend-multiply" />
                  </span>
                  <Link href={`/p/${m.slug}`} className="serif mt-2 line-clamp-2 block text-center leading-tight hover:text-azure md:text-xl">
                    {m.name}
                  </Link>
                </div>
              ))}
              <Row label="Үнэ">{pair.map((m) => <span key={m.slug} className="tnum text-lg font-semibold">{formatPrice(m.price)}</span>)}</Row>
              <Row label="Хэмжээ">
                {pair.map((m) => (
                  <span key={m.slug} className="tnum">
                    {m.size ? `${m.size.n} ${m.size.unit}` : "—"}
                    {perUnit(m) && <span className="block text-[12px] text-mute">1 ш ≈ {formatPrice(perUnit(m)!)}</span>}
                  </span>
                ))}
              </Row>
              <Row label="Төрөл">{pair.map((m) => <span key={m.slug}>{TYPES[m.type]}</span>)}</Row>
              <Row label="Найрлага">
                {pair.map((m) => (
                  <span key={m.slug} className="flex flex-wrap gap-1">
                    {m.ing.length
                      ? m.ing.map((i) => (
                          <Link key={i.id} href={`/lab/ingredients#${i.id}`} className={`rounded-full px-2 py-0.5 text-[11.5px] ${pair.every((o) => o.ing.some((x) => x.id === i.id)) ? "bg-champagne/30 text-ink" : "bg-mist text-azure"}`}>
                            {i.name}
                          </Link>
                        ))
                      : "—"}
                  </span>
                ))}
              </Row>
              <Row label="Зориулалт">
                {pair.map((m) => (
                  <span key={m.slug} className="block w-full space-y-1.5">
                    {(Object.keys(GOAL_NAMES) as GoalId[]).map((g) => (
                      <span key={g} className="flex items-center gap-2 text-[11.5px]">
                        <span className="w-14 shrink-0 truncate text-ink-2 md:w-24">{GOAL_NAMES[g].name}</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-mist">
                          <span className="block h-full rounded-full bg-azure" style={{ width: `${Math.min(100, (m.goals[g] / Math.min(top, 6)) * 100)}%` }} />
                        </span>
                      </span>
                    ))}
                    {m.purpose.length > 0 && (
                      <ul className="mt-2 space-y-1 text-[12.5px] leading-snug text-ink-2">
                        {m.purpose.map((p) => (
                          <li key={p} className="flex gap-1.5">
                            <CheckIcon size={12} className="mt-1 shrink-0 text-azure" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </span>
                ))}
              </Row>
              <Row label="Хэрэглэх">
                {pair.map((m) =>
                  m.usage.length ? (
                    <ol key={m.slug} className="list-decimal space-y-1 pl-4 text-[12.5px] leading-snug text-ink-2">
                      {m.usage.map((u) => (
                        <li key={u}>{u}</li>
                      ))}
                    </ol>
                  ) : (
                    <span key={m.slug} className="text-[12.5px] text-mute">
                      Заавар бичигдээгүй.{" "}
                      <Link href={`/p/${m.slug}`} className="underline">
                        Бүтээгдэхүүний хуудас
                      </Link>
                    </span>
                  ),
                )}
              </Row>
              <div className="border-t border-line bg-porcelain" />
              {pair.map((m) => (
                <div key={m.slug} className="border-t border-l border-line p-3 md:p-5">
                  <AddMany slugs={[m.slug]} label="Сагслах" className="btn btn-dark h-11 w-full px-3 text-[12px]" />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Pill({ on, onClick, children, title, blue }: { on: boolean; onClick: () => void; children: React.ReactNode; title?: string; blue?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      title={title}
      className={`rounded-full px-4 py-2 text-[14px] font-medium ring-1 ring-line transition ${blue ? "hover:ring-azure aria-pressed:bg-azure aria-pressed:ring-azure" : "hover:ring-ink aria-pressed:bg-ink aria-pressed:ring-ink"} aria-pressed:text-pearl`}
    >
      {children}
    </button>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode[] }) {
  return (
    <>
      <div className="eyebrow border-t border-line bg-porcelain px-2 py-3 text-[8.5px] break-words max-md:tracking-[0.06em] text-mute md:p-5 md:text-[10.5px]">{label}</div>
      {children.map((c, k) => (
        <div key={k} className="flex min-w-0 items-start border-t border-l border-line p-2.5 text-[13px] break-words md:text-[14px] md:p-5">
          {c}
        </div>
      ))}
    </>
  );
}
