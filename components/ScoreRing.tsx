"use client";

// Hero de l'écran Home : le score de récup dans un anneau épais.
// Remplissage à l'ouverture : 800ms, courbe spring avec léger overshoot,
// trait en dégradé de zone, glow discret, haptic léger quand l'anneau
// se pose. Sous le chiffre : le mot d'état de la zone.

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { tapHaptic } from "@/lib/haptics";
import type { Zone } from "@/lib/score";

const SIZE = 330;
const STROKE = 12;
const R = (SIZE - STROKE) / 2 - 6;
const C = 2 * Math.PI * R;
const DURATION = 800;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function ScoreRing({ score, zone }: { score: number; zone: Zone }) {
  const t = useTranslations("home");
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
        <defs>
          {/* Dégradé subtil dans le sens de progression de l'arc */}
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={zone.color} />
            <stop offset="100%" stopColor={zone.color2} />
          </linearGradient>
        </defs>
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
          stroke="url(#ring-grad)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          style={{
            // Spring léger : petit overshoot au-delà de la cible, puis retour.
            transition: `stroke-dashoffset ${DURATION}ms cubic-bezier(0.3, 1.18, 0.4, 1)`,
            filter: `drop-shadow(0 0 30px ${zone.glow})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
          {t("recovery")}
        </span>
        <span className="font-display text-[150px] leading-none tracking-[-0.02em] text-paper">
          {display}
        </span>
        <span
          className="ml-[0.3em] mt-2 font-display text-[20px] leading-none tracking-[0.3em]"
          style={{ color: zone.color }}
        >
          {t(`word.${zone.name}`)}
        </span>
      </div>
    </div>
  );
}
