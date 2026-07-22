"use client";

// La carte de partage — format story 9:16, le plus bel écran du produit.
// Composée pour l'export 1080×1920 : tout est dimensionné sur une base
// de 360×640 et exporté avec un pixelRatio de 3.
//
// De haut en bas : wordmark + date mono, le score dans son anneau de
// zone (dégradé + glow), le mot d'état, la pile de disques en jauge
// horizontale géante, trois mini-métriques mono, streak + stakk.app.

import { useLocale, useTranslations } from "next-intl";
import { Wordmark } from "@/components/Wordmark";
import { gaugeColorFor, type Zone } from "@/lib/score";

const RING = 264;
const STROKE = 11;
const R = (RING - STROKE) / 2 - 5;
const C = 2 * Math.PI * R;

type Metrics = {
  sleepLabel: string; // ex : "7h22"
  hrvMs: number | null;
  rhrBpm: number | null;
};

type Props = {
  score: number;
  zone: Zone;
  metrics: Metrics;
  streakDays: number;
};

function dateLabel(locale: string) {
  const d = new Date();
  const weekday = d
    .toLocaleDateString(locale, { weekday: "short" })
    .replace(".", "")
    .toUpperCase();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return locale === "fr" ? `${weekday} ${dd}.${mm}` : `${weekday} ${mm}.${dd}`;
}

/** La signature en jauge horizontale géante, remplie selon le score.
    Couleur : l'échelle fine des jauges — une pile, une couleur. */
function GiantStack({ score }: { score: number }) {
  const widths = [34, 56, 78, 100]; // % — sommet en premier
  const lit = Math.round((score / 100) * widths.length);
  const color = gaugeColorFor(score);
  return (
    <div className="flex w-full flex-col items-center gap-[9px]">
      {widths.map((w, i) => {
        // i = 0 est le sommet ; la jauge s'allume depuis la base.
        const on = widths.length - i <= lit;
        return (
          <div
            key={i}
            className="h-[15px] rounded-pill"
            style={{
              width: `${w}%`,
              background: on ? color : "rgba(245,243,238,0.10)",
            }}
          />
        );
      })}
    </div>
  );
}

export function ShareCard({ score, zone, metrics, streakDays }: Props) {
  const t = useTranslations("share");
  const tHome = useTranslations("home");
  const locale = useLocale();

  const offset = C * (1 - score / 100);

  const parts = [
    { label: t("sleep"), value: metrics.sleepLabel },
    {
      label: t("hrv"),
      value: metrics.hrvMs === null ? "—" : `${metrics.hrvMs}ms`,
    },
    {
      label: t("rhr"),
      value: metrics.rhrBpm === null ? "—" : `${metrics.rhrBpm}bpm`,
    },
  ];

  return (
    <div
      id="share-card"
      className="relative flex aspect-[9/16] w-full flex-col justify-between overflow-hidden px-7 py-8"
      style={{ background: "#0C0D10" }}
    >
      {/* Fond : le même langage que la Home — halo radial + trame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(95% 46% at 50% 30%, #16171B 0%, #0C0D10 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(245,243,238,0.04) 1px, transparent 1.4px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* 1 — Header */}
      <div className="relative flex items-center justify-between">
        <Wordmark />
        <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-muted">
          {dateLabel(locale)}
        </span>
      </div>

      {/* 2+3 — Le héros : score dans l'anneau, mot d'état dessous */}
      <div className="relative flex justify-center">
        <div className="relative" style={{ width: RING, height: RING }}>
          <svg viewBox={`0 0 ${RING} ${RING}`} width={RING} height={RING}>
            <defs>
              <linearGradient id="share-ring-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={zone.color} />
                <stop offset="100%" stopColor={zone.color2} />
              </linearGradient>
            </defs>
            <circle
              cx={RING / 2}
              cy={RING / 2}
              r={R}
              fill="none"
              stroke="rgba(245,243,238,0.06)"
              strokeWidth={STROKE}
            />
            <circle
              cx={RING / 2}
              cy={RING / 2}
              r={R}
              fill="none"
              stroke="url(#share-ring-grad)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
              style={{ filter: `drop-shadow(0 0 24px ${zone.glow})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
              {tHome("recovery")}
            </span>
            <span className="font-display text-[118px] leading-none tracking-[-0.02em] text-paper">
              {score}
            </span>
            <span
              className="ml-[0.3em] mt-1.5 font-display text-[17px] leading-none tracking-[0.3em]"
              style={{ color: zone.color }}
            >
              {tHome(`word.${zone.name}`)}
            </span>
          </div>
        </div>
      </div>

      {/* 4 — La signature en jauge géante */}
      <div className="relative">
        <GiantStack score={score} />
      </div>

      {/* 5 — Mini-métriques */}
      <div className="relative flex items-center justify-center gap-3 font-mono text-[12px] tracking-[0.06em]">
        {parts.map((p, i) => (
          <span key={p.label} className="flex items-center gap-3">
            {i > 0 && <span className="text-faint">·</span>}
            <span>
              <span className="text-muted">{p.label} </span>
              <span className="font-semibold text-paper">{p.value}</span>
            </span>
          </span>
        ))}
      </div>

      {/* 6 — Footer : streak + stakk.app */}
      <div className="relative flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-ember">
          <svg
            viewBox="0 0 24 24"
            width={15}
            height={15}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
          <span className="font-mono text-[12px] font-semibold">
            {streakDays} {t("days")}
          </span>
        </span>
        <span className="font-mono text-[12px] text-muted">stakk.app</span>
      </div>
    </div>
  );
}
