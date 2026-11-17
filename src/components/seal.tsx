/** Round seal with the logo's two lines running around a droplet, turning slowly. */
export function Seal({ className = "" }: { className?: string }) {
  const text = "KOREAN HEALTHY SKIN CARE · COSMETICS D.I.Y · ";
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden>
      <defs>
        <path id="seal-ring" d="M80 80m-62 0a62 62 0 1 1 124 0a62 62 0 1 1-124 0" />
      </defs>
      <g className="spin-slow" style={{ transformOrigin: "80px 80px" }}>
        <text fontSize="10.4" letterSpacing="3.1" fill="currentColor" fontFamily="var(--font-sans)" fontWeight="600">
          <textPath href="#seal-ring">{text}</textPath>
        </text>
      </g>
      <circle cx="80" cy="80" r="44" fill="none" stroke="currentColor" strokeOpacity=".35" />
      <path d="M80 54c8 10.5 15 18.6 15 27a15 15 0 0 1-30 0c0-8.4 7-16.5 15-27Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M73 86a7.5 7.5 0 0 0 6 6.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
