// Signature visuelle Stakk : la pile de disques.
// 4 barres arrondies empilées, la plus courte en rouge au sommet.
// Sert de logo (variant="logo"), de jauge (value 0..1) et d'élément
// central de la carte de partage.

const BARS = [
  { w: 34, ember: true }, // sommet — rouge
  { w: 54, ember: false },
  { w: 76, ember: false },
  { w: 100, ember: false }, // base
];

const BAR_H = 12;
const GAP = 7;
const VIEW_W = 100;
const VIEW_H = BARS.length * BAR_H + (BARS.length - 1) * GAP;

type Props = {
  /** Hauteur en px du composant rendu. */
  size?: number;
  /**
   * Mode jauge : proportion 0..1. Les barres s'allument depuis la base.
   * Sans valeur, rendu logo (toutes les barres pleines).
   */
  value?: number;
  /**
   * Couleur des barres allumées en mode jauge — typiquement la couleur
   * de zone de la métrique. La jauge devient information, pas icône.
   */
  color?: string;
  className?: string;
};

export function DiscStack({ size = 28, value, color, className }: Props) {
  const lit = value === undefined ? BARS.length : Math.round(value * BARS.length);
  const width = (size * VIEW_W) / VIEW_H;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width={width}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {BARS.map((bar, i) => {
        // i = 0 est le sommet ; on allume depuis la base.
        // En mode jauge, le rouge reste rare : le sommet ne s'embrase
        // qu'à pleine pile (valeur maximale). En logo, il est toujours rouge.
        const on = BARS.length - i <= lit;
        const emberAllowed = value === undefined || value >= 0.995;
        const fill = !on
          ? "rgba(245,243,238,0.10)"
          : color !== undefined
            ? color
            : bar.ember && emberAllowed
              ? "#D6362B"
              : "#F5F3EE";
        return (
          <rect
            key={i}
            x={(VIEW_W - bar.w) / 2}
            y={i * (BAR_H + GAP)}
            width={bar.w}
            height={BAR_H}
            rx={BAR_H / 2}
            fill={fill}
            style={{ transition: "fill 0.3s cubic-bezier(0.22,1,0.36,1)" }}
          />
        );
      })}
    </svg>
  );
}
