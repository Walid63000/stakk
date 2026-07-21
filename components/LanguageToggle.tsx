"use client";

// Bascule FR/EN à chaud : cookie + refresh, aucun rechargement complet.

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { tapHaptic } from "@/lib/haptics";

const LOCALES = ["en", "fr"] as const;

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();

  function switchTo(next: (typeof LOCALES)[number]) {
    if (next === locale) return;
    tapHaptic();
    document.cookie = `locale=${next};path=/;max-age=31536000;samesite=lax`;
    router.refresh();
  }

  return (
    <div className="flex gap-1 rounded-pill border border-line bg-ink p-1">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={`pressable rounded-pill px-3 py-1 font-mono text-[12px] font-semibold uppercase transition-colors duration-300 ${
            locale === l ? "bg-raise2 text-paper" : "text-faint"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
