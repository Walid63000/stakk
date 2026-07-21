"use client";

// Hero de l'écran Home : le score de récup dans un anneau épais.
// Remplissage à l'ouverture : 800ms, courbe spring avec léger overshoot,
// glow subtil de la couleur de zone, haptic léger quand l'anneau se pose.

import { useEffect, useRef, useState } from "react";
import { tapHaptic } from "@/lib/haptics";
import type { Zone } from "@/lib/score";

const SIZE = 330;
const STROKE = 12;
const R = (SIZE - STROKE) / 2 - 6;
const C = 2 * Math.PI * R;
const DURATION = 800;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function ScoreRing({ score, zone }: { score: number; zone: Zone }) {
  const [filled, setFilled] = useState(false);
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>();

  useEffect(() => {
    const id = requestAnimationFrame(() => setFilled(true));

    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const t = Math.min((now - start) / DURATION, 1);
      setDisplay(Math.round(easeOutCubic(t) * score));
      if (t < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        tapHaptic();
      }
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(id);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [score]);

  const offset = filled ? C * (1 - score / 100) : C;

  return (
    <div className="relative" style={{ width: SIZE, height: SIZE }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="rgba(245,243,238,0.06)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={zone.color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          style={{
            // Spring léger : petit overshoot au-delà de la cible, puis retour.
            transition: `stroke-dashoffset ${DURATION}ms cubic-bezier(0.3, 1.18, 0.4, 1)`,
            filter: `drop-shadow(0 0 24px ${zone.glow})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
          Récupération
        </span>
        <span className="font-display text-[132px] leading-none text-paper">
          {display}
        </span>
        <span className="font-mono text-[12px] text-faint">/ 100</span>
      </div>
    </div>
  );
}
