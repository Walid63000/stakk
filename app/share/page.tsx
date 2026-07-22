"use client";

// Preview plein écran de la carte de partage : la carte, un bouton.
// Export : nœud DOM → PNG 1080×1920 (html-to-image) → share sheet
// natif, fallback téléchargement.

import { Suspense, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toPng } from "html-to-image";
import { ShareCard } from "@/components/ShareCard";
import { tapHaptic, impactHaptic } from "@/lib/haptics";
import { today, scenarioFor } from "@/lib/mock";
import { zoneFor } from "@/lib/score";

const EXPORT_WIDTH = 1080;

function fmtCompactHm(min: number) {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return `${h}h${m.toString().padStart(2, "0")}`;
}

function ShareScreen() {
  const t = useTranslations("share");
  const search = useSearchParams();
  const cardWrap = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  // Les previews de la Home (?score=…) restent valables ici.
  const raw = search.get("score");
  const parsed = raw === null ? NaN : Number(raw);
  const score = Number.isFinite(parsed)
    ? Math.min(100, Math.max(0, Math.round(parsed)))
    : today.score;

  const zone = zoneFor(score);
  const data = scenarioFor(score);
  const sleep = data.vitals.find((v) => v.labelKey === "sleep");
  const hrv = data.vitals.find((v) => v.labelKey === "hrv");
  const rhr = data.vitals.find((v) => v.labelKey === "restingHr");

  async function share() {
    const node = cardWrap.current?.querySelector<HTMLElement>("#share-card");
    if (!node || busy) return;
    tapHaptic();
    setBusy(true);
    try {
      const dataUrl = await toPng(node, {
        canvasWidth: EXPORT_WIDTH,
        canvasHeight: (EXPORT_WIDTH * 16) / 9,
        pixelRatio: 1,
        cacheBust: true,
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "stakk-recovery.png", {
        type: "image/png",
      });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "stakk-recovery.png";
        a.click();
      }
      impactHaptic();
    } catch {
      /* partage annulé */
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-3rem)] flex-col">
      {/* Retour discret */}
      <div className="flex justify-start pt-1">
        <Link
          href="/"
          onClick={() => tapHaptic()}
          className="pressable flex h-9 w-9 items-center justify-center rounded-pill border border-line bg-raise text-muted"
          aria-label="Close"
        >
          <svg
            viewBox="0 0 24 24"
            width={16}
            height={16}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </Link>
      </div>

      {/* La carte, plein cadre */}
      <div className="mt-4 flex flex-1 items-center justify-center">
        <div
          ref={cardWrap}
          className="w-full max-w-[min(100%,46dvh)] overflow-hidden rounded-[24px] border border-line"
        >
          <ShareCard
            score={score}
            zone={zone}
            metrics={{
              sleepLabel:
                sleep && sleep.value !== null
                  ? fmtCompactHm(sleep.value)
                  : "—",
              hrvMs: hrv ? hrv.value : null,
              rhrBpm: rhr ? rhr.value : null,
            }}
            streakDays={today.streakDays}
          />
        </div>
      </div>

      {/* Un seul bouton */}
      <div className="mt-6 pb-2">
        <button
          onClick={share}
          disabled={busy}
          className="pressable h-14 w-full rounded-pill bg-paper text-[15px] font-semibold text-ink disabled:opacity-60"
        >
          {t("share")}
        </button>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={null}>
      <ShareScreen />
    </Suspense>
  );
}
