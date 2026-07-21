"use client";

// Écran Tendances : récup en points colorés par zone + strain en ligne
// sobre, puis sparklines Sommeil / HRV / FC. Toutes les valeurs en
// IBM Plex Mono. Période 7 ou 30 jours.

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { history, type DayPoint } from "@/lib/mock";
import { zoneFor } from "@/lib/score";
import { tapHaptic } from "@/lib/haptics";

type Period = 7 | 30;

const W = 330;
const H = 170;
const PAD_X = 8;
const PAD_Y = 12;

function x(i: number, n: number) {
  return PAD_X + (i * (W - 2 * PAD_X)) / (n - 1);
}

function y(v: number) {
  return H - PAD_Y - ((v - 0) / 100) * (H - 2 * PAD_Y);
}

function fmtHm(min: number) {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return `${h} h ${m.toString().padStart(2, "0")}`;
}

function dateFor(indexFromEnd: number) {
  const d = new Date();
  d.setDate(d.getDate() - indexFromEnd);
  return d;
}

function RecoveryChart({ points, locale }: { points: DayPoint[]; locale: string }) {
  const n = points.length;
  const line = points
    .map((p, i) => `${x(i, n).toFixed(1)},${y(p.strain).toFixed(1)}`)
    .join(" ");

  // Étiquettes d'axe : tous les jours en 7j, ~hebdo en 30j.
  const ticks =
    n === 7
      ? points.map((_, i) => i)
      : points.map((_, i) => i).filter((i) => i % 7 === 1);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Frontières de zones : repères discrets à 34 et 67 */}
        {[34, 67].map((v) => (
          <line
            key={v}
            x1={PAD_X}
            x2={W - PAD_X}
            y1={y(v)}
            y2={y(v)}
            stroke="rgba(245,243,238,0.07)"
            strokeWidth={1}
            strokeDasharray="3 5"
          />
        ))}
        <polyline
          points={line}
          fill="none"
          stroke="#57554F"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={x(i, n)}
            cy={y(p.recovery)}
            r={n === 7 ? 5 : 3}
            fill={zoneFor(p.recovery).color}
          />
        ))}
      </svg>
      <div className="relative mt-1 h-4">
        {ticks.map((i) => {
          const d = dateFor(n - 1 - i);
          const label =
            n === 7
              ? d
                  .toLocaleDateString(locale, { weekday: "narrow" })
                  .toUpperCase()
              : d.toLocaleDateString(locale, { day: "numeric", month: "numeric" });
          return (
            <span
              key={i}
              className="absolute -translate-x-1/2 font-mono text-[10px] uppercase text-faint"
              style={{ left: `${(x(i, n) / W) * 100}%` }}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const w = 120;
  const h = 44;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const px = (i: number) => (i * (w - 6)) / (values.length - 1) + 3;
  const py = (v: number) => h - 5 - ((v - min) / span) * (h - 10);
  const line = values
    .map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`)
    .join(" ");
  const last = values[values.length - 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
      <polyline
        points={line}
        fill="none"
        stroke="rgba(245,243,238,0.45)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={px(values.length - 1)} cy={py(last)} r={2.5} fill="#F5F3EE" />
    </svg>
  );
}

export function TrendsView() {
  const t = useTranslations("trends");
  const locale = useLocale();
  const [period, setPeriod] = useState<Period>(7);

  const points = history.slice(-period);
  const avg = (vals: number[]) =>
    vals.reduce((s, v) => s + v, 0) / vals.length;

  const metrics = [
    {
      key: "sleep",
      values: points.map((p) => p.sleepMin),
      current: fmtHm(points[points.length - 1].sleepMin),
      unit: "",
      avgLabel: fmtHm(avg(points.map((p) => p.sleepMin))),
    },
    {
      key: "hrv",
      values: points.map((p) => p.hrv),
      current: String(points[points.length - 1].hrv),
      unit: "ms",
      avgLabel: String(Math.round(avg(points.map((p) => p.hrv)))),
    },
    {
      key: "restingHr",
      values: points.map((p) => p.fc),
      current: String(points[points.length - 1].fc),
      unit: "bpm",
      avgLabel: String(Math.round(avg(points.map((p) => p.fc)))),
    },
  ] as const;

  function switchTo(p: Period) {
    if (p === period) return;
    tapHaptic();
    setPeriod(p);
  }

  return (
    <div className="stagger">
      <header className="rise flex items-start justify-between pt-3">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-paper">
            {t("title")}
          </h1>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
            {period === 7 ? t("subtitle7") : t("subtitle30")}
          </p>
        </div>
        <div className="flex gap-1 rounded-pill border border-line bg-ink p-1">
          {([7, 30] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => switchTo(p)}
              className={`pressable rounded-pill px-3 py-1 font-mono text-[12px] font-semibold transition-colors duration-300 ${
                period === p ? "bg-raise2 text-paper" : "text-faint"
              }`}
            >
              {p === 7 ? t("d7") : t("d30")}
            </button>
          ))}
        </div>
      </header>

      {/* Récup × strain */}
      <section className="rise mt-7 rounded-card border border-line bg-raise p-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
            {t("recovery")}
          </span>
          <span className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
            <span className="flex items-center gap-1.5">
              <span className="h-[7px] w-[7px] rounded-pill bg-[#1E9E52]" />
              {t("recovery")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-px w-4 bg-faint" />
              {t("strain")}
            </span>
          </span>
        </div>
        <div className="mt-4">
          <RecoveryChart points={points} locale={locale} />
        </div>
      </section>

      {/* Sommeil / HRV / FC */}
      <section className="rise mt-4 flex flex-col gap-2.5">
        {metrics.map((m) => (
          <article
            key={m.key}
            className="flex items-center justify-between rounded-card border border-line bg-raise px-5 py-4"
          >
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                {t(m.key)}
              </p>
              <p className="mt-2.5 font-mono text-[22px] font-semibold leading-none text-paper">
                {m.current}
                {m.unit && (
                  <span className="ml-1.5 text-[12px] font-normal text-muted">
                    {m.unit}
                  </span>
                )}
              </p>
              <p className="mt-1.5 font-mono text-[11px] text-faint">
                {m.avgLabel}
                {m.unit && ` ${m.unit}`} · {t("avg")}
              </p>
            </div>
            <Sparkline values={[...m.values]} />
          </article>
        ))}
      </section>
    </div>
  );
}
