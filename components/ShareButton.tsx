"use client";

import { tapHaptic } from "@/lib/haptics";

export function ShareButton() {
  async function share() {
    tapHaptic();
    const data = {
      title: "Stakk",
      text: "Mon Stakk Score du jour.",
      url: typeof window !== "undefined" ? window.location.origin : "",
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(data.url);
      }
    } catch {
      /* partage annulé */
    }
  }

  return (
    <button
      onClick={share}
      className="pressable h-14 w-full rounded-pill bg-paper text-[15px] font-semibold text-ink"
    >
      Partager la carte
    </button>
  );
}
