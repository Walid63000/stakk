"use client";

// Navigation : 3 onglets seulement — la simplicité comme luxe.
// Pilule flottante sur fond flouté, icônes maison, aucun code Material.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tapHaptic } from "@/lib/haptics";

type Tab = {
  href: string;
  label: string;
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
    label: "Aujourd'hui",
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
    label: "Tendances",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} {...stroke}>
        <path d="M4 17.5 9.5 12l3.5 3 6.5-7" />
        <path d="M15.5 8H19.5v4" />
      </svg>
    ),
  },
  {
    href: "/reglages",
    label: "Réglages",
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
  const pathname = usePathname();

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
                active ? "text-paper" : "text-faint"
              }`}
            >
              {tab.icon}
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
