import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { DiscStack } from "@/components/DiscStack";
import { ScoreRing } from "@/components/ScoreRing";
import { MiniRing } from "@/components/MiniRing";
import { CountUp } from "@/components/CountUp";
import { Wordmark } from "@/components/Wordmark";
import { today, scenarioFor } from "@/lib/mock";
import {
  computeScore,
  gaugeColorFor,
  zoneFor,
  type Signals,
} from "@/lib/score";

function TrendArrow({ dir }: { dir: "up" | "down" }) {
  return (
    <svg
      viewBox="0 0 12 12"
      width={11}
      height={11}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={dir === "down" ? { transform: "scaleY(-1)" } : undefined}
    >
      <path d="M2.5 9.5 9.5 2.5" />
      <path d="M4 2.5h5.5V8" />
    </svg>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { score?: string; missing?: string };
}) {
  const t = await getTranslations("home");

  // ?score=55 permet de prévisualiser les zones jaune/rouge.
  const parsed = Number(searchParams?.score);
  const baseScore = Number.isFinite(parsed)
    ? Math.min(100, Math.max(0, Math.round(parsed)))
    : today.score;

  // ?missing=hrv|sleep simule une montre qui ne partage pas le signal :
  // le score se recalcule sur ce qui reste, la précision est dégradée.
  const missing =
    searchParams?.missing === "hrv" || searchParams?.missing === "sleep"
      ? searchParams.missing
      : null;

  const scenario = scenarioFor(baseScore);
  const vitals = scenario.vitals.map((v) =>
    (missing === "hrv" && v.labelKey === "hrv") ||
    (missing === "sleep" && v.labelKey === "sleep")
      ? { ...v, missing: true }
      : { ...v, missing: false },
  );

  const signals: Signals = Object.fromEntries(
    vitals.map((v) => [v.labelKey, v.missing ? null : Math.round(v.pct * 100)]),
  );
  const computed = computeScore(signals);
  const score = missing ? computed.score : baseScore;
  const precision = missing ? computed.precision : "full";

  const zone = zoneFor(score);
  const data = { ...scenario, vitals };

  return (
    <div className="stagger">
      {/* Fond : dégradé radial subtil derrière le score + trame de points
          quasi invisible façon caoutchouc de plateau */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(85% 48% at 50% 26%, #16171B 0%, #0C0D10 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(rgba(245,243,238,0.04) 1px, transparent 1.4px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Header minimal : wordmark au A-pile, streak à droite.
          La flamme et le chiffre en rouge brand — l'accent identitaire. */}
      <header className="rise flex items-center justify-between pt-3">
        <Wordmark />
        <div className="flex items-center gap-1.5 text-ember">
          <svg
            viewBox="0 0 24 24"
            width={16}
            height={16}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
          <span className="font-mono text-[14px] font-semibold">
            <CountUp to={today.streakDays} />
          </span>
        </div>
      </header>

      {/* UN héros : le score de récupération, rien ne lui dispute l'écran */}
      <section className="rise flex min-h-[41dvh] items-center justify-center py-6">
        <ScoreRing score={score} zone={zone} />
      </section>

      {/* Signal manquant : le score reste là, la précision est annoncée */}
      {precision === "reduced" && (
        <section className="rise mb-4 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-raise px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            <svg
              viewBox="0 0 12 12"
              width={11}
              height={11}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.4}
              strokeLinecap="round"
            >
              <circle cx="6" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
              <path d="M3.6 6.4a3.4 3.4 0 0 1 4.8 0" />
              <path d="M1.8 4.4a6 6 0 0 1 4.2-1.7" strokeDasharray="2 2.2" />
              <path d="M10.2 4.4a6 6 0 0 0-1.6-1.1" />
            </svg>
            {t("reducedPrecision")}
          </span>
        </section>
      )}

      {/* Verdict direct, 2 lignes max, barre latérale couleur de zone */}
      <section className="rise mt-1 flex justify-center">
        <div className="flex items-center gap-3.5">
          <span
            className="w-[3px] self-stretch rounded-pill"
            style={{ background: zone.color }}
          />
          <div className="text-left">
            <p className="text-[17px] font-semibold leading-snug text-paper">
              {t(`verdict.${zone.name}.line`)}
            </p>
            <p className="mt-0.5 text-[14px] leading-snug text-muted">
              {t(`verdict.${zone.name}.detail`)}
            </p>
          </div>
        </div>
      </section>

      {/* Rangée secondaire : 2 mini-cercles tapables */}
      <section className="rise mt-8 flex items-start justify-center gap-12">
        <Link
          href="/tendances"
          className="pressable flex flex-col items-center gap-2.5"
        >
          {missing === "sleep" ? (
            <MiniRing value={0} color="#8B8B87" display="—" />
          ) : (
            <MiniRing
              value={data.sleepPerf}
              color={zoneFor(data.sleepPerf).color}
            />
          )}
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
            {t("sleep")}
          </span>
        </Link>
        <Link
          href="/tendances"
          className="pressable flex flex-col items-center gap-2.5"
        >
          <MiniRing value={data.strainYesterday} color="#8B8B87" />
          <span className="max-w-[140px] text-center font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
            {t("yesterdaysStrain")}
          </span>
        </Link>
      </section>

      {/* Les 3 composantes : label en capitales, jauge pile de disques
          dans la couleur de zone de la métrique, valeur mono énorme,
          tendance vs hier */}
      <section className="rise mt-8 flex flex-col gap-2.5">
        {data.vitals.map((v) => (
          <article
            key={v.id}
            className="flex items-center justify-between rounded-card border border-line bg-raise px-5 py-4"
          >
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                {t(`vitals.${v.labelKey}`)}
              </span>
              <DiscStack
                size={18}
                value={v.missing ? 0 : v.pct}
                color={v.missing ? undefined : gaugeColorFor(v.pct * 100)}
              />
            </div>
            {v.missing ? (
              <div className="text-right">
                <p className="font-mono text-[28px] font-semibold leading-none text-faint">
                  —
                </p>
                <p className="mt-1.5 font-mono text-[12px] text-faint">
                  {t("noData")}
                </p>
              </div>
            ) : (
              <div className="text-right">
                <p className="font-mono text-[28px] font-semibold leading-none text-paper">
                  <CountUp to={v.value} format={v.format} />
                  {v.unit && (
                    <span className="ml-1.5 text-[13px] font-normal text-muted">
                      {v.unit}
                    </span>
                  )}
                </p>
                <p className="mt-1.5 flex items-center justify-end gap-1 font-mono text-[12px] text-muted">
                  <TrendArrow dir={v.trend.dir} />
                  {v.trend.delta} {t("vsYesterday")}
                </p>
              </div>
            )}
          </article>
        ))}
      </section>

      {/* Partage : discret, la carte fait le spectacle */}
      <section className="rise mt-7 flex justify-center">
        <Link
          href={missing ? "/share" : `/share?score=${score}`}
          className="pressable flex items-center gap-2 rounded-pill border border-line bg-raise px-5 py-2.5 text-[13px] font-medium text-muted"
        >
          <svg
            viewBox="0 0 24 24"
            width={15}
            height={15}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3.5v10" />
            <path d="m8.5 6.5 3.5-3 3.5 3" />
            <path d="M6.5 11.5v8h11v-8" />
          </svg>
          {t("share")}
        </Link>
      </section>
    </div>
  );
}
