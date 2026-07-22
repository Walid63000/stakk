"use client";

// Navigation : 3 onglets seulement — la simplicité comme luxe.
// Pilule flottante sur fond flouté, icônes maison, aucun code Material.

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { tapHaptic } from "@/lib/haptics";
import { today } from "@/lib/mock";
import { zoneFor } from "@/lib/score";

type Tab = {
  href: string;
  labelKey: "today" | "trends" | "settings";
  icon: React.ReactNode;
};

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const TABS: Tab[] = [
  {
    href: "/",
    labelKey: "today",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} {...stroke}>
        <path d="M9.5 6h5" />
        <path d="M7.5 11h9" />
        <path d="M5.5 16h13" />
      </svg>
    ),
  },
  {
    href: "/tendances",
    labelKey: "trends",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} {...stroke}>
        <path d="M4 17.5 9.5 12l3.5 3 6.5-7" />
        <path d="M15.5 8H19.5v4" />
      </svg>
    ),
  },
  {
    href: "/reglages",
    labelKey: "settings",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} {...stroke}>
        <path d="M4 8h9" />
        <circle cx="16.5" cy="8" r="2.5" />
        <path d="M20 16h-9" />
        <circle cx="7.5" cy="16" r="2.5" />
      </svg>
    ),
  },
];

export function TabBar() {
  const t = useTranslations("tabs");
  const pathname = usePathname();
  const search = useSearchParams();

  // La preview de partage est plein écran : pas de nav.
  if (pathname === "/share") return null;

  // L'onglet actif prend la couleur de zone du jour — détail vivant.
  // ?score=… (previews) est respecté pour rester cohérent à l'écran.
  const raw = search.get("score");
  const parsed = raw === null ? NaN : Number(raw);
  const score = Number.isFinite(parsed)
    ? Math.min(100, Math.max(0, Math.round(parsed)))
    : today.score;
  const zone = zoneFor(score);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[430px] px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-3 rounded-pill border border-line bg-raise/85 py-2.5 backdrop-blur-xl">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => tapHaptic()}
              className={`pressable flex flex-col items-center gap-1 transition-colors duration-300 ${
                active ? "" : "text-faint"
              }`}
              style={active ? { color: zone.color } : undefined}
            >
              {tab.icon}
              <span className="text-[10px] font-medium tracking-wide">
                {t(tab.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
