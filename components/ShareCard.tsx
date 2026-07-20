import { DiscStack } from "@/components/DiscStack";
import { verdictFor } from "@/lib/score";

// La carte de partage : format portrait 4/5, pensée pour Instagram/X.
// Pile de disques + score + verdict + wordmark — rien d'autre.

type Props = {
  score: number;
  dateLabel: string;
  streakDays: number;
  tonnageKg: number;
};

export function ShareCard({ score, dateLabel, streakDays, tonnageKg }: Props) {
  const verdict = verdictFor(score);

  return (
    <div
      id="share-card"
      className="relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden rounded-[28px] border border-line bg-raise p-7"
      style={{
        background:
          "radial-gradient(120% 80% at 50% -10%, #1E2026 0%, #17181D 45%, #101114 100%)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-bold uppercase tracking-[0.2em] text-paper">
          Stakk
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {dateLabel}
        </span>
      </div>

      <div className="flex flex-col items-center">
        <DiscStack size={64} value={score / 100} />
        <p className="mt-7 font-display text-[96px] leading-none text-paper">
          {score}
        </p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-ember">
          Stakk Score
        </p>
        <p className="mt-4 text-center text-[15px] font-semibold text-paper">
          {verdict.line}
        </p>
      </div>

      <div className="flex items-center justify-center gap-6 font-mono text-[12px] text-muted">
        <span>
          <span className="font-semibold text-paper">{streakDays} j</span> de
          série
        </span>
        <span className="h-3 w-px bg-line" />
        <span>
          <span className="font-semibold text-paper">
            {(tonnageKg / 1000).toLocaleString("fr-FR", {
              maximumFractionDigits: 1,
            })}{" "}
            t
          </span>{" "}
          soulevées
        </span>
      </div>
    </div>
  );
}
