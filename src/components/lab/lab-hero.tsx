import { Drops } from "../drops";

/** Page opening shared by the Beauty Lab tools. */
export function LabHero({ eyebrow, title, accent, children }: { eyebrow: string; title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(165deg,var(--color-pearl),var(--color-mist))]">
      <Drops count={6} />
      <div className="wrap relative py-12 md:py-16">
        <p className="eyebrow rise text-azure">{eyebrow}</p>
        <h1 className="serif rise mt-4 max-w-3xl text-[44px] leading-[1.02] font-light md:text-7xl">
          {title} <em className="text-azure">{accent}</em>
        </h1>
        <div className="rise mt-5 max-w-2xl text-[16.5px] leading-relaxed text-ink-2">{children}</div>
      </div>
    </section>
  );
}
