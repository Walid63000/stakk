"use client";

// Toute valeur chiffrée s'anime en count-up à l'apparition (400ms).

import { useEffect, useRef, useState } from "react";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type Props = {
  to: number;
  /** "int" = entier brut, "hm" = minutes rendues en h mm. */
  format?: "int" | "hm";
  duration?: number;
  className?: string;
};

function render(n: number, format: "int" | "hm") {
  if (format === "hm") {
    const h = Math.floor(n / 60);
    const m = Math.round(n % 60);
    return `${h} h ${m.toString().padStart(2, "0")}`;
  }
  return Math.round(n).toString();
}

export function CountUp({ to, format = "int", duration = 400, className }: Props) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>();

  useEffect(() => {
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const t = Math.min((now - start) / duration, 1);
      setDisplay(easeOutCubic(t) * to);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [to, duration]);

  return <span className={className}>{render(display, format)}</span>;
}
