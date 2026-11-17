"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { SkinId } from "@/content/ingredients";
import { formatPrice } from "@/lib/format";
import type { GoalId, LabProduct, Step } from "@/lib/lab";
import { AddMany } from "../add-many";
import { CheckIcon, SparkleIcon } from "../icons";

type Props = {
  products: LabProduct[];
  steps: Step[];
  goals: Record<GoalId, { name: string; hint: string }>;
  skins: Record<SkinId, string>;
};

/** How well a product fits: goals the text speaks to (capped), the chosen skin type, «all skin types». */
function score(p: LabProduct, skin: SkinId, goals: GoalId[]) {
  const g = goals.length ? goals : (["hydrate"] as GoalId[]);
  let s = g.reduce((n, id) => n + Math.min(p.goals[id], 6) * 2, 0);
  if (p.skin.includes(skin)) s += 5;
  if (p.allSkin) s += 3;
  if (skin === "sensitive") s += Math.min(p.goals.calm, 4);
  if (skin === "dry") s += Math.min(p.goals.hydrate, 3);
  if (skin === "oily") s += Math.min(p.goals.clear, 3);
  return s;
}

function reasons(p: LabProduct, skin: SkinId, goals: GoalId[], names: Props["goals"], skins: Props["skins"]) {
  const r = goals.filter((g) => p.goals[g] > 0).map((g) => names[g].name);
  if (p.skin.includes(skin)) r.push(`${skins[skin]} арьс`);
  else if (p.allSkin) r.push("Бүх төрлийн арьс");
  return r;
}

export function RoutineBuilder({ products, steps, goals: GOAL_NAMES, skins: SKINS }: Props) {
  const [skin, setSkin] = useState<SkinId>("normal");
  const [goals, setGoals] = useState<GoalId[]>(["hydrate"]);
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(steps.map((s) => [s.id, s.on])));
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<string | null>(null);
  const bySlug = useMemo(() => new Map(products.map((p) => [p.slug, p])), [products]);

  // options of every step ranked for the current answers
  const ranked = useMemo(
    () =>
      Object.fromEntries(
        steps.map((s) => [
          s.id,
          s.options
            .map((slug) => bySlug.get(slug)!)
            .sort((a, b) => score(b, skin, goals) - score(a, skin, goals) || a.price - b.price),
        ]),
      ) as Record<string, LabProduct[]>,
    [steps, bySlug, skin, goals],
  );

  const chosen = steps.map((s) => ({ step: s, p: (picked[s.id] && bySlug.get(picked[s.id])) || ranked[s.id][0] })).filter((x) => x.p);
  const active = chosen.filter((x) => on[x.step.id]);
  const total = active.reduce((n, x) => n + x.p.price, 0);
  const serum = active.find((x) => x.step.id === "serum")?.p;
  const ampouleMissing = serum?.category === "powder" && !active.some((x) => x.p.slug === "milk-shot-ampoule");

  const toggleGoal = (g: GoalId) => {
    setPicked({});
    setGoals((cur) => (cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g].slice(-3)));
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="min-w-0">
        {/* 1 · 2: the questions */}
        <div className="grid gap-4 md:grid-cols-2">
          <fieldset className="rounded-[26px] bg-pearl p-5 ring-1 ring-line md:p-6">
            <legend className="sr-only">Арьсны төрөл</legend>
            <p className="flex items-center gap-3">
              <span className="serif tnum grid h-8 w-8 place-items-center rounded-full bg-ink text-pearl">1</span>
              <span className="serif text-2xl">Арьсны төрөл</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Арьсны төрөл">
              {(Object.keys(SKINS) as SkinId[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={skin === k}
                  onClick={() => {
                    setSkin(k);
                    setPicked({});
                  }}
                  className="rounded-full px-4 py-2 text-[14px] font-medium ring-1 ring-line transition hover:ring-ink aria-checked:bg-ink aria-checked:text-pearl aria-checked:ring-ink"
                >
                  {SKINS[k]}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="rounded-[26px] bg-pearl p-5 ring-1 ring-line md:p-6">
            <legend className="sr-only">Арчилгааны зорилго</legend>
            <p className="flex items-center gap-3">
              <span className="serif tnum grid h-8 w-8 place-items-center rounded-full bg-ink text-pearl">2</span>
              <span className="serif text-2xl">Зорилго</span>
              <span className="text-[12px] text-mute">3 хүртэл</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.keys(GOAL_NAMES) as GoalId[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  aria-pressed={goals.includes(g)}
                  onClick={() => toggleGoal(g)}
                  title={GOAL_NAMES[g].hint}
                  className="rounded-full px-4 py-2 text-[14px] font-medium ring-1 ring-line transition hover:ring-azure aria-pressed:bg-azure aria-pressed:text-pearl aria-pressed:ring-azure"
                >
                  {GOAL_NAMES[g].name}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {/* 3: the routine, in the order it goes on */}
        <p className="mt-10 flex items-center gap-3">
          <span className="serif tnum grid h-8 w-8 place-items-center rounded-full bg-ink text-pearl">3</span>
          <span className="serif text-2xl">Таны арчилгааны дараалал</span>
        </p>
        <ol className="relative mt-6 space-y-4 before:absolute before:top-4 before:bottom-4 before:left-[19px] before:w-px before:bg-line md:before:left-[23px]">
          {chosen.map(({ step, p }, k) => {
            const isOn = on[step.id];
            const why = reasons(p, skin, goals, GOAL_NAMES, SKINS);
            const alts = ranked[step.id];
            return (
              <li key={step.id} className="relative pl-12 md:pl-16">
                <span className={`serif tnum absolute top-4 left-0 grid h-10 w-10 place-items-center rounded-full text-lg transition md:h-12 md:w-12 ${isOn ? "bg-ink text-pearl" : "bg-pearl text-mute ring-1 ring-line"}`}>{k + 1}</span>
                <div className={`rounded-[24px] bg-pearl p-4 ring-1 transition md:p-5 ${isOn ? "ring-line shadow-[0_24px_50px_-34px_rgb(20_28_51/0.35)]" : "opacity-55 ring-line/60"}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p>
                      <span className="eyebrow text-[10px] text-azure">{step.en}</span>
                      <span className="serif ml-2 text-xl">{step.name}</span>
                      <span className="ml-2 text-[12.5px] text-mute">· {step.when}</span>
                    </p>
                    <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ink-2">
                      <span>{isOn ? "Багтсан" : "Хассан"}</span>
                      <input type="checkbox" checked={isOn} onChange={(e) => setOn({ ...on, [step.id]: e.target.checked })} className="peer sr-only" />
                      <span className="relative h-6 w-11 rounded-full bg-line transition peer-checked:bg-azure peer-focus-visible:ring-2 peer-focus-visible:ring-azure after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
                    </label>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <Link href={`/p/${p.slug}`} className="field relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-1 ring-line">
                      <Image src={p.thumb} alt="" fill sizes="80px" className="object-contain p-1.5 mix-blend-multiply" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      {p.brand && <span className="eyebrow block text-[9.5px] text-mute">{p.brand}</span>}
                      <Link href={`/p/${p.slug}`} className="serif block text-xl leading-tight hover:text-azure">
                        {p.name}
                      </Link>
                      <span className="block truncate text-[12.5px] text-ink-2">{p.subtitle}</span>
                      {why.length > 0 && (
                        <span className="mt-1.5 flex flex-wrap gap-1">
                          {why.map((w) => (
                            <span key={w} className="inline-flex items-center gap-1 rounded-full bg-mist px-2 py-0.5 text-[11px] text-azure">
                              <CheckIcon size={10} /> {w}
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                    <span className="tnum hidden shrink-0 font-semibold sm:block">{formatPrice(p.price)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3">
                    <span className="tnum text-[14px] font-semibold sm:hidden">{formatPrice(p.price)}</span>
                    {alts.length > 1 ? (
                      <button type="button" onClick={() => setOpen(open === step.id ? null : step.id)} aria-expanded={open === step.id} className="ml-auto text-[12.5px] font-semibold tracking-[0.12em] text-ink uppercase hover:text-azure">
                        {open === step.id ? "Хаах" : `Солих · ${alts.length - 1} сонголт`}
                      </button>
                    ) : (
                      <span className="ml-auto text-[12.5px] text-mute">Энэ алхамд ганц бүтээгдэхүүн бий</span>
                    )}
                  </div>
                  {open === step.id && (
                    <div className="no-scrollbar rise -mx-4 mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-1 md:-mx-5 md:px-5">
                      {alts.map((a) => {
                        const sel = a.slug === p.slug;
                        return (
                          <button
                            key={a.slug}
                            type="button"
                            onClick={() => {
                              setPicked({ ...picked, [step.id]: a.slug });
                              setOn({ ...on, [step.id]: true });
                              setOpen(null);
                            }}
                            aria-pressed={sel}
                            className="w-40 shrink-0 snap-start rounded-2xl bg-porcelain p-2.5 text-left ring-1 ring-line transition hover:ring-ink aria-pressed:ring-2 aria-pressed:ring-azure"
                          >
                            <span className="field relative block aspect-square overflow-hidden rounded-xl">
                              <Image src={a.thumb} alt="" fill sizes="160px" className="object-contain p-2 mix-blend-multiply" />
                            </span>
                            <span className="serif mt-2 line-clamp-2 block leading-tight">{a.name}</span>
                            <span className="tnum mt-1 block text-[12.5px] font-semibold">{formatPrice(a.price)}</span>
                            <span className="mt-1 line-clamp-1 block text-[11px] text-azure">{reasons(a, skin, goals, GOAL_NAMES, SKINS).join(" · ") || " "}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* summary */}
      <aside className="lg:sticky lg:top-32">
        <div className="relative overflow-hidden rounded-[28px] bg-ink p-6 text-pearl md:p-7">
          <div className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgb(59_91_169/0.55),transparent)]" aria-hidden />
          <p className="eyebrow relative text-[10px] text-champagne">Таны багц</p>
          <p className="serif relative mt-2 text-3xl leading-tight">
            {SKINS[skin]} арьс · {goals.length ? goals.map((g) => GOAL_NAMES[g].name.toLowerCase()).join(", ") : "ерөнхий арчилгаа"}
          </p>
          <ul className="relative mt-5 space-y-2 text-[14px]">
            {active.map(({ step, p }) => (
              <li key={step.id} className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-pearl/75">
                  <span className="text-pearl/45">{step.name}:</span> {p.name}
                </span>
                <span className="tnum shrink-0">{formatPrice(p.price)}</span>
              </li>
            ))}
          </ul>
          <div className="relative mt-5 flex items-baseline justify-between border-t border-white/12 pt-4">
            <span className="text-pearl/70">{active.length} бүтээгдэхүүн</span>
            <span className="serif tnum text-4xl">{formatPrice(total)}</span>
          </div>
          {ampouleMissing && (
            <p className="relative mt-4 flex gap-2 rounded-2xl bg-white/7 p-3 text-[13px] leading-snug text-pearl/80">
              <SparkleIcon size={16} className="mt-0.5 shrink-0 text-champagne" />
              <span>
                Нунтаг серумыг ампул, тостойгоо хольж хэрэглэдэг.{" "}
                <Link href="/p/milk-shot-ampoule" className="font-semibold text-pearl underline underline-offset-2">
                  Milk Shot Ampoule
                </Link>{" "}
                нэмэх үү?
              </span>
            </p>
          )}
          <AddMany slugs={active.map((x) => x.p.slug)} label="Багцаар сагсанд нэмэх" className="btn btn-light relative mt-6 h-14 w-full" light />
          <p className="relative mt-3 text-center text-[12px] text-pearl/50">Бүтээгдэхүүн бүр сагсанд нэг ширхэгээр орно.</p>
        </div>
        <p className="mt-4 px-2 text-[12.5px] leading-relaxed text-mute">
          Санал нь бүтээгдэхүүн бүрийн тайлбарт бичсэн арьсны төрөл, үйлчилгээн дээр тулгуурласан. Эмзэг, асуудалтай арьстай бол {""}
          <a href="tel:+97694039003" className="underline">
            9403-9003
          </a>{" "}
          дугаараар зөвлөгөө аваарай.
        </p>
      </aside>
    </div>
  );
}
