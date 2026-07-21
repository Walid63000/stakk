import { getTranslations } from "next-intl/server";
import { LanguageToggle } from "@/components/LanguageToggle";

// Écran Réglages — liste sobre, sera étoffé écran par écran.

const GROUPS: { titleKey: "you" | "app" | "account"; rows: string[] }[] = [
  { titleKey: "you", rows: ["profile", "goals", "zones"] },
  { titleKey: "app", rows: ["notifications", "units", "health"] },
  { titleKey: "account", rows: ["subscription", "privacy", "logout"] },
];

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9.5 6 6 6-6 6" />
    </svg>
  );
}

export default async function ReglagesPage() {
  const t = await getTranslations("settings");

  return (
    <div className="stagger">
      <header className="rise flex items-center justify-between pt-3">
        <h1 className="text-[28px] font-semibold tracking-tight text-paper">
          {t("title")}
        </h1>
        <LanguageToggle />
      </header>

      {GROUPS.map((group) => (
        <section key={group.titleKey} className="rise mt-7">
          <h2 className="px-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
            {t(`groups.${group.titleKey}`)}
          </h2>
          <div className="mt-2.5 overflow-hidden rounded-card border border-line bg-raise">
            {group.rows.map((row, i) => (
              <button
                key={row}
                className={`flex w-full items-center justify-between px-5 py-4 text-left text-[15px] font-medium text-paper ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                {t(`rows.${row}`)}
                <span className="text-faint">
                  <Chevron />
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}

      <p className="rise mt-7 text-center font-mono text-[11px] text-faint">
        {t("version")}
      </p>
    </div>
  );
}
