import { DiscStack } from "@/components/DiscStack";
import { ScoreRing } from "@/components/ScoreRing";
import { CountUp } from "@/components/CountUp";
import { Wordmark } from "@/components/Wordmark";
import { today, vitals } from "@/lib/mock";
import { verdictFor, zoneFor } from "@/lib/score";

export default function HomePage() {
  const zone = zoneFor(today.score);
  const verdict = verdictFor(today.score);

  return (
    <div className="stagger">
      {/* Fond : dégradé radial subtil centré derrière le score,
          + trame de points quasi invisible façon caoutchouc de plateau */}
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

      {/* Header minimal : wordmark au A-pile, streak à droite */}
      <header className="rise flex items-center justify-between pt-3">
        <Wordmark />
        <div className="flex items-center gap-1.5 text-muted">
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
          <span className="font-mono text-[14px] font-semibold text-paper">
            <CountUp to={today.streakDays} />
          </span>
        </div>
      </header>

      {/* Hero : le score occupe l'essentiel de l'écran */}
      <section className="rise flex min-h-[46dvh] items-center justify-center">
        <ScoreRing score={today.score} zone={zone} />
      </section>

      {/* Verdict avec sa barre latérale couleur de zone — 2 lignes max */}
      <section className="rise mt-2 flex justify-center">
        <div className="flex items-center gap-3.5">
          <span
            className="w-[3px] self-stretch rounded-pill"
            style={{ background: zone.color }}
          />
          <div className="text-left">
            <p className="text-[17px] font-semibold leading-snug text-paper">
              {verdict.line}
            </p>
            <p className="mt-0.5 text-[14px] leading-snug text-muted">
              {verdict.detail}
            </p>
          </div>
        </div>
      </section>

      {/* Les 3 composantes : glassmorphism discret, mini-jauge signature */}
      <section className="rise mt-8 flex flex-col gap-2.5">
        {vitals.map((v) => (
          <article
            key={v.id}
            className="flex items-center justify-between rounded-[16px] border p-4 backdrop-blur-md"
            style={{
              background: "rgba(245,243,238,0.04)",
              borderColor: "rgba(245,243,238,0.08)",
            }}
          >
            <span className="text-[14px] font-medium text-muted">
              {v.label}
            </span>
            <div className="flex items-center gap-5">
              <span className="font-mono text-[18px] font-semibold text-paper">
                <CountUp to={v.value} format={v.format} />
                {v.unit && (
                  <span className="ml-1 text-[12px] font-normal text-muted">
                    {v.unit}
                  </span>
                )}
              </span>
              <DiscStack size={20} value={v.pct} />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
