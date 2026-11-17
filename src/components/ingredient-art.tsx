import type { Motif } from "@/content/ingredients";

/** A pearly orb in the ingredient's colours with a fine line drawing of what it is. */
export function IngredientArt({ motif, tint, className = "" }: { motif: Motif; tint: [string, string]; className?: string }) {
  const [light, deep] = tint;
  const id = `g-${motif}-${deep.slice(1)}`;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <radialGradient id={id} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".45" stopColor={light} />
          <stop offset="1" stopColor={deep} />
        </radialGradient>
        <radialGradient id={`${id}-s`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="86" fill={`url(#${id})`} />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#fff" strokeOpacity=".7" />
      <ellipse cx="72" cy="58" rx="30" ry="16" fill={`url(#${id}-s)`} transform="rotate(-28 72 58)" />
      <g fill="none" stroke="#141c33" strokeOpacity=".72" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" transform="translate(100 104)">
        {MOTIFS[motif]}
      </g>
      {/* little pearls */}
      <circle cx="158" cy="62" r="5" fill="#fff" fillOpacity=".85" />
      <circle cx="44" cy="146" r="3.5" fill="#fff" fillOpacity=".75" />
    </svg>
  );
}

const MOTIFS: Record<Motif, React.ReactNode> = {
  drop: (
    <>
      <path d="M0-42c16 21 28 35 28 50a28 28 0 0 1-56 0c0-15 12-29 28-50Z" />
      <path d="M-13 12a14 14 0 0 0 11 12" />
      <path d="M36-30c4 6 8 10 8 14a8 8 0 0 1-16 0c0-4 4-8 8-14Z" strokeOpacity=".45" />
    </>
  ),
  leaf: (
    <>
      <path d="M-34 34C-34-4-8-34 36-38c-2 40-28 70-70 72Z" />
      <path d="M-34 34 22-22M-10 10l-14-4M4-4l-6-16M4-4l18 2M-10 10l2 16" />
    </>
  ),
  flower: (
    <>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-22" rx="13" ry="22" transform={`rotate(${a})`} />
      ))}
      <circle r="8" />
    </>
  ),
  citrus: (
    <>
      <circle r="34" />
      <circle r="27" strokeOpacity=".5" />
      {[0, 45, 90, 135].map((a) => (
        <path key={a} d="M0-27V27" transform={`rotate(${a})`} />
      ))}
      <path d="M18-38c6-8 14-10 22-8-2 8-10 12-20 10" />
    </>
  ),
  gold: (
    <>
      <path d="M-30 18 0-36l30 54Z" />
      <path d="M-30 18h60M-15-9h30M0-36v54" strokeOpacity=".5" />
      <path d="M34-30l4-8 4 8-4 8Z M-40-18l3-6 3 6-3 6Z" />
    </>
  ),
  molecule: (
    <>
      <circle cx="-24" cy="-14" r="10" />
      <circle cx="22" cy="-22" r="8" />
      <circle cx="18" cy="24" r="11" />
      <circle cx="-22" cy="26" r="7" />
      <path d="M-15-17l29-3M20-14 18 13M8 26l-23 0M-23 19l-1-23" />
    </>
  ),
  crystal: (
    <>
      <path d="M-22-28h44l16 22L0 38-38-6Z" />
      <path d="M-38-6h76M-22-28-8-6 0 38 8-6l14-22" strokeOpacity=".55" />
    </>
  ),
  honey: (
    <>
      {[
        [0, 0],
        [26, -15],
        [-26, -15],
        [0, -30],
        [26, 15],
        [-26, 15],
        [0, 30],
      ].map(([x, y], k) => (
        <path key={k} d="M0-14 12-7v14L0 14-12 7v-14Z" transform={`translate(${x} ${y}) scale(.95)`} strokeOpacity={k ? 0.5 : 1} />
      ))}
    </>
  ),
  shell: (
    <>
      <path d="M-34 24c0-34 22-56 44-48 18 7 20 34 2 40-14 5-24-6-18-16 4-7 14-5 14 2" />
      <path d="M-34 24h62c6 0 10 4 10 8" />
    </>
  ),
  mushroom: (
    <>
      <path d="M-38 0c0-24 18-38 38-38S38-24 38 0Z" />
      <path d="M-12 0v30c0 6 24 6 24 0V0" />
      <circle cx="-14" cy="-18" r="4" />
      <circle cx="12" cy="-24" r="3" />
      <circle cx="20" cy="-10" r="3.5" />
    </>
  ),
  seed: (
    <>
      <path d="M0-38c24 10 30 50 0 74-30-24-24-64 0-74Z" />
      <path d="M0-30v62" strokeOpacity=".5" />
      <path d="M0 0c-8-6-12-14-12-22M0 14c8-6 12-12 12-20" strokeOpacity=".5" />
    </>
  ),
  shield: (
    <>
      <path d="M0-38 32-26v20c0 26-14 40-32 46-18-6-32-20-32-46v-20Z" />
      <path d="m-12 2 9 9 17-19" />
    </>
  ),
};
