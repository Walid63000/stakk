import { records } from "@/lib/mock";

export default function RecordsPage() {
  const fresh = records.find((r) => r.isNew);
  const rest = records.filter((r) => !r.isNew);

  return (
    <div className="stagger">
      <header className="rise pt-2">
        <h1 className="text-[28px] font-semibold tracking-tight text-paper">
          Records
        </h1>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {records.length} mouvements suivis
        </p>
      </header>

      {/* Le record frais est un moment fort : il a droit au rouge */}
      {fresh && (
        <section className="rise mt-8 animate-pop-in rounded-card border border-ember/40 bg-ember-glow p-6">
          <span className="rounded-pill bg-ember px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-paper">
            Nouveau PR
          </span>
          <p className="mt-5 font-display text-[64px] leading-none text-paper">
            {fresh.weightKg}
            <span className="ml-2 font-mono text-[16px] font-normal text-muted">
              kg
            </span>
          </p>
          <p className="mt-3 text-[16px] font-semibold text-paper">
            {fresh.lift}
          </p>
          <p className="mt-0.5 font-mono text-[12px] text-muted">{fresh.date}</p>
        </section>
      )}

      <section className="rise mt-6 flex flex-col gap-3">
        {rest.map((r) => (
          <article
            key={r.id}
            className="pressable flex items-center justify-between rounded-card border border-line bg-raise p-5"
          >
            <div>
              <p className="text-[16px] font-semibold text-paper">{r.lift}</p>
              <p className="mt-0.5 font-mono text-[12px] text-muted">
                {r.date}
              </p>
            </div>
            <p className="font-display text-[30px] leading-none text-paper">
              {r.weightKg}
              <span className="ml-1.5 font-mono text-[12px] font-normal text-muted">
                kg
              </span>
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
