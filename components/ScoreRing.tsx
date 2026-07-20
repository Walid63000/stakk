"use client";

// Hero de l'écran Home : le score dans un anneau de progression.
// Remplissage fluide à l'ouverture (600ms), chiffre en Anton qui compte
// en synchronisation avec l'anneau, haptic au moment où le score se pose.

import { useEffect, useRef, useState } from "react";
import { impactHaptic } from "@/lib/haptics";

const SIZE = 300;
const STROKE = 16;
const R = (SIZE - STROKE) / 2 - 4;
const C = 2 * Math.PI * R;
const DURATION = 600;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function ScoreRing({ score }: { score: number }) {
  const [filled, setFilled] = useState(false);
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>();

  useEffect(() => {
    // Déclenche le remplissage une frame après le mount pour que la
    // transition CSS parte bien de zéro.
    const id = requestAnimationFrame(() => setFilled(true));

    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const t = Math.min((now - start) / DURATION, 1);
      setDisplay(Math.round(easeOutCubic(t) * score));
      if (t < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        impactHaptic();
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
          stroke="rgba(245,243,238,0.07)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="#D6362B"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          style={{
            transition: `stroke-dashoffset ${DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            filter: "drop-shadow(0 0 14px rgba(214,54,43,0.35))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          Score du jour
        </span>
        <span className="mt-1 font-display text-[104px] leading-none text-paper">
          {display}
        </span>
        <span className="mt-2 font-mono text-[12px] text-faint">/ 100</span>
      </div>
    </div>
  );
}
