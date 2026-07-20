import { ShareCard } from "@/components/ShareCard";
import { ShareButton } from "@/components/ShareButton";
import { today } from "@/lib/mock";

export default function PartagePage() {
  return (
    <div className="stagger">
      <header className="rise pt-2">
        <h1 className="text-[28px] font-semibold tracking-tight text-paper">
          Partage
        </h1>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          Ta journée, en une carte
        </p>
      </header>

      <section className="rise mt-8">
        <ShareCard
          score={today.score}
          dateLabel={today.dateLabel}
          streakDays={today.streakDays}
          tonnageKg={today.tonnageKg}
        />
      </section>

      <section className="rise mt-6">
        <ShareButton />
        <p className="mt-3 text-center font-mono text-[11px] text-faint">
          La carte s&apos;exporte au format image, prête pour tes stories.
        </p>
      </section>
    </div>
  );
}
