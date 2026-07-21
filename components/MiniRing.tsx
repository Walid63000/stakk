"use client";

// Mini-cercle secondaire (64px) : Sommeil, Strain d'hier.
// Même langage que l'anneau héros, en discret — remplissage animé,
// valeur en IBM Plex Mono au centre.

import { useEffect, useState } from "react";

const SIZE = 64;
const STROKE = 5;
const R = (SIZE - STROKE) / 2 - 1;
const C = 2 * Math.PI * R;

type Props = {
  /** Proportion 0..100. */
  value: number;
  /** Couleur du remplissage — information uniquement. */
  color: string;
  /** Texte affiché au centre (défaut : la valeur). */
  display?: string;
};

export function MiniRing({ value, color, display }: Props) {
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const offset = filled ? C * (1 - value / 100) : C;

  return (
    <div className="relative" style={{ width: SIZE, height: SIZE }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="rgba(245,243,238,0.08)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          style={{
            transition: "stroke-dashoffset 600ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-[15px] font-semibold text-paper">
        {display ?? value}
      </span>
    </div>
  );
}
