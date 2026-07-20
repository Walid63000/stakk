import { DiscStack } from "@/components/DiscStack";
import { sessions, weekVolume } from "@/lib/mock";

export default function SeancesPage() {
  const done = weekVolume.filter((d) => d.v > 0).length;

  return (
    <div className="stagger">
      <header className="rise pt-2">
        <h1 className="text-[28px] font-semibold tracking-tight text-paper">
          Séances
        </h1>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          Cette semaine · {done} séances
        </p>
      </header>

      {/* Volume de la semaine */}
      <section className="rise mt-8 rounded-card border border-line bg-raise p-5">
        <div className="flex h-[96px] items-end justify-between">
          {weekVolume.map((d, i) => (
            <div key={i} className="flex w-8 flex-col items-center gap-2.5">
              <div
                className="w-[14px] rounded-pill"
                style={{
                  height: d.v > 0 ? `${Math.max(d.v * 72, 10)}px` : "6px",
                  background:
                    d.v > 0 ? "#F5F3EE" : "rgba(245,243,238,0.10)",
                }}
              />
              <span className="font-mono text-[10px] uppercase text-faint">
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Historique */}
      <section className="rise mt-6 flex flex-col gap-3">
        {sessions.map((s) => (
          <article
            key={s.id}
            className="pressable flex items-center justify-between rounded-card border border-line bg-raise p-5"
          >
            <div className="flex items-center gap-4">
              <DiscStack size={26} value={s.intensity} />
              <div>
                <p className="flex items-center gap-2 text-[16px] font-semibold text-paper">
                  {s.name}
                  {s.hasRecord && (
                    <span className="rounded-pill bg-ember px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-paper">
                      PR
                    </span>
                  )}
                </p>
                <p className="mt-0.5 font-mono text-[12px] text-muted">
                  {s.when} · {s.durationMin} min
                </p>
              </div>
            </div>
            <p className="font-mono text-[14px] font-semibold text-paper">
              {s.tonnageKg.toLocaleString("fr-FR")}
              <span className="text-[11px] font-normal text-muted"> kg</span>
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
