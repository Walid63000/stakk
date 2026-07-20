import Link from "next/link";
import { DiscStack } from "@/components/DiscStack";
import { ScoreRing } from "@/components/ScoreRing";
import { today, sessions } from "@/lib/mock";
import { verdictFor } from "@/lib/score";

export default function HomePage() {
  const verdict = verdictFor(today.score);
  const last = sessions[0];

  return (
    <div className="stagger">
      <header className="rise flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <DiscStack size={20} />
          <span className="text-[15px] font-bold uppercase tracking-[0.18em] text-paper">
            Stakk
          </span>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {today.dateLabel}
        </span>
      </header>

      {/* Hero : le score, rien d'autre ne doit lui voler la vedette */}
      <section className="rise mt-12 flex flex-col items-center">
        <ScoreRing score={today.score} />
        <h1 className="mt-8 text-center text-[22px] font-semibold tracking-tight text-paper">
          {verdict.line}
        </h1>
        <p className="mt-1.5 max-w-[280px] text-center text-[14px] leading-relaxed text-muted">
          {verdict.detail}
        </p>
      </section>

      {/* Le reste, discret */}
      <section className="rise mt-12 grid grid-cols-3 gap-3">
        <div className="rounded-card border border-line bg-raise p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Série
          </p>
          <p className="mt-2 font-mono text-[17px] font-semibold text-paper">
            {today.streakDays} j
          </p>
        </div>
        <div className="rounded-card border border-line bg-raise p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Tonnage
          </p>
          <p className="mt-2 font-mono text-[17px] font-semibold text-paper">
            {(today.tonnageKg / 1000).toLocaleString("fr-FR", {
              maximumFractionDigits: 1,
            })}
            <span className="text-[12px] text-muted"> t</span>
          </p>
        </div>
        <Link
          href="/records"
          className="pressable rounded-card border border-ember/30 bg-ember-glow p-4"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ember">
            Record
          </p>
          <p className="mt-2 font-mono text-[17px] font-semibold text-paper">
            110<span className="text-[12px] text-muted"> kg</span>
          </p>
        </Link>
      </section>

      <Link
        href="/seances"
        className="rise pressable mt-4 flex items-center justify-between rounded-card border border-line bg-raise p-5"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Dernière séance
          </p>
          <p className="mt-1.5 text-[16px] font-semibold text-paper">
            {last.name}
            <span className="ml-2.5 font-mono text-[12px] font-normal text-muted">
              {last.when} · {last.durationMin} min
            </span>
          </p>
        </div>
        <DiscStack size={26} value={last.intensity} />
      </Link>
    </div>
  );
}
