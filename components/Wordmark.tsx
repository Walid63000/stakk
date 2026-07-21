// Wordmark STAKK : le A est remplacé par la pile de disques,
// dans une variante étroite aux proportions d'une capitale.

function PileA({ height }: { height: number }) {
  // Proportions lettre : largeur ≈ 0.78 × hauteur de capitale.
  const W = 78;
  const H = 100;
  const barH = 19;
  const gap = 8;
  const widths = [32, 47, 62, 78];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={(height * W) / H}
      height={height}
      aria-hidden="true"
    >
      {widths.map((w, i) => (
        <rect
          key={i}
          x={(W - w) / 2}
          y={i * (barH + gap)}
          width={w}
          height={barH}
          rx={barH / 2}
          fill={i === 0 ? "#D6362B" : "#F5F3EE"}
        />
      ))}
    </svg>
  );
}

export function Wordmark() {
  return (
    <span
      className="flex items-center gap-[2px] text-[17px] font-bold tracking-[0.1em] text-paper"
      aria-label="STAKK"
    >
      <span>ST</span>
      <PileA height={12.5} />
      <span className="pl-[1px]">KK</span>
    </span>
  );
}
