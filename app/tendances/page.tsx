import { getTranslations } from "next-intl/server";
import { DiscStack } from "@/components/DiscStack";

// Écran Tendances — le graphique combiné strain × récup sur 7 jours
// arrive ici après validation de la Home. État d'attente sobre.

export default async function TendancesPage() {
  const t = await getTranslations("trends");

  return (
    <div className="stagger">
      <header className="rise pt-3">
        <h1 className="text-[28px] font-semibold tracking-tight text-paper">
          {t("title")}
        </h1>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
          {t("subtitle")}
        </p>
      </header>

      <section className="rise mt-8 flex flex-col items-center rounded-card border border-line bg-raise px-6 py-14">
        <DiscStack size={34} value={0.5} />
        <p className="mt-6 text-center text-[15px] font-medium text-paper">
          {t("emptyTitle")}
        </p>
        <p className="mt-1.5 max-w-[240px] text-center text-[13px] leading-relaxed text-muted">
          {t("emptyDetail")}
        </p>
      </section>
    </div>
  );
}
