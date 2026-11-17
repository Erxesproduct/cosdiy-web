/** Pearly droplets drifting slowly in a section's background. Positions are fixed so server and client match. */
export function Drops({ count = 7, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {Array.from({ length: count }, (_, k) => {
        const size = 18 + ((k * 37) % 70);
        return (
          <span
            key={k}
            className="drop"
            style={
              {
                width: size,
                height: size,
                left: `${(k * 41 + 7) % 96}%`,
                top: `${(k * 29 + 13) % 88}%`,
                "--t": `${8 + (k % 4) * 2}s`,
                "--d": `${-(k * 1.7)}s`,
                "--dx": `${((k % 5) - 2) * 9}px`,
                "--dy": `${-14 - (k % 3) * 10}px`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
