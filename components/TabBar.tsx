"use client";

// Barre de navigation flottante — pilule sur fond flouté, icônes maison.
// Rien qui rappelle une tab bar Material : pas de ripple, pas d'ombre dure.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tapHaptic } from "@/lib/haptics";

type Tab = {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
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
    label: "Aujourd'hui",
    icon: () => (
      <svg viewBox="0 0 24 24" width={22} height={22} {...stroke}>
        <path d="M9.5 6h5" />
        <path d="M7.5 11h9" />
        <path d="M5.5 16h13" />
      </svg>
    ),
  },
  {
    href: "/seances",
    label: "Séances",
    icon: () => (
      <svg viewBox="0 0 24 24" width={22} height={22} {...stroke}>
        <path d="M7 12h10" />
        <path d="M5 8.5v7" />
        <path d="M19 8.5v7" />
        <path d="M2.5 10v4" />
        <path d="M21.5 10v4" />
      </svg>
    ),
  },
  {
    href: "/records",
    label: "Records",
    icon: () => (
      <svg viewBox="0 0 24 24" width={22} height={22} {...stroke}>
        <circle cx="12" cy="9" r="4.5" />
        <path d="m9.5 12.8-1.5 7.2 4-2 4 2-1.5-7.2" />
      </svg>
    ),
  },
  {
    href: "/partage",
    label: "Partage",
    icon: () => (
      <svg viewBox="0 0 24 24" width={22} height={22} {...stroke}>
        <path d="M12 3.5v10" />
        <path d="m8.5 6.5 3.5-3 3.5 3" />
        <path d="M6.5 11.5v8h11v-8" />
      </svg>
    ),
  },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[430px] px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-4 rounded-pill border border-line bg-raise/85 py-2.5 backdrop-blur-xl">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => tapHaptic()}
              className={`pressable flex flex-col items-center gap-1 transition-colors duration-300 ${
                active ? "text-paper" : "text-faint"
              }`}
            >
              {tab.icon(active)}
              <span className="text-[10px] font-medium tracking-wide">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
