"use client";

// Onboarding — 3 écrans, 20 secondes, jamais skippable.
// 1. La marque et la promesse. 2. Permissions HealthKit (démo :
// accord simulé). 3. Le rituel du matin. Slide + fade 300ms entre
// les étapes, 3 points de progression discrets.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { DiscStack } from "@/components/DiscStack";
import { Wordmark } from "@/components/Wordmark";
import { tapHaptic, impactHaptic } from "@/lib/haptics";

const icon = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function VitalRow({
  label,
  children,
  pileValue,
}: {
  label: string;
  children: React.ReactNode;
  pileValue: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-card border border-line bg-raise px-5 py-4">
      <div className="flex items-center gap-3.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-raise2 text-paper">
          {children}
        </span>
        <span className="text-[15px] font-medium text-paper">{label}</span>
      </div>
      {/* Piles décoratives — neutres, le rouge reste au logo */}
      <DiscStack size={18} value={pileValue} color="#F5F3EE" />
    </div>
  );
}

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [health, setHealth] = useState<"idle" | "asking" | "granted">("idle");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [notifTime, setNotifTime] = useState("07:30");

  function next() {
    tapHaptic();
    setStep((s) => Math.min(2, s + 1));
  }

  function connectHealth() {
    if (health !== "idle") return;
    tapHaptic();
    setHealth("asking");
    // Mode démo : simule la demande de permission native puis l'accord.
    setTimeout(() => {
      setHealth("granted");
      impactHaptic();
      setTimeout(() => setStep(2), 650);
    }, 900);
  }

  function start() {
    tapHaptic();
    try {
      const prev = JSON.parse(localStorage.getItem("stakk-prefs") ?? "{}");
      localStorage.setItem(
        "stakk-prefs",
        JSON.stringify({ ...prev, notifTime }),
      );
      localStorage.setItem("stakk-onboarded", "1");
    } catch {
      /* stockage indisponible */
    }
    router.push("/");
  }

  const primaryBtn =
    "pressable h-14 w-full rounded-pill bg-paper text-[15px] font-semibold text-ink";

  return (
    <div className="flex min-h-[calc(100dvh-9rem)] flex-col">
      <div key={step} className="slide-enter flex flex-1 flex-col">
        {step === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <DiscStack size={64} />
            <div className="mt-6">
              <Wordmark />
            </div>
            <h1 className="mt-10 max-w-[280px] text-[30px] font-semibold leading-tight tracking-tight text-paper">
              {t("welcomeTitle")}
            </h1>
            <p className="mt-3 max-w-[280px] text-[15px] leading-relaxed text-muted">
              {t("welcomeDetail")}
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-1 flex-col justify-center">
            <h1 className="text-[28px] font-semibold tracking-tight text-paper">
              {t("connectTitle")}
            </h1>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">
              {t("connectDetail")}
            </p>
            <div className="mt-8 flex flex-col gap-2.5">
              <VitalRow label={t("sleep")} pileValue={1}>
                <svg viewBox="0 0 24 24" width={18} height={18} {...icon}>
                  <path d="M20.5 14.1A8.5 8.5 0 1 1 9.9 3.5a7 7 0 0 0 10.6 10.6z" />
                </svg>
              </VitalRow>
              <VitalRow label={t("hrv")} pileValue={0.75}>
                <svg viewBox="0 0 24 24" width={18} height={18} {...icon}>
                  <path d="M2.5 12h4l2.5-5.5 4 11 2.5-5.5h6" />
                </svg>
              </VitalRow>
              <VitalRow label={t("rhr")} pileValue={0.5}>
                <svg viewBox="0 0 24 24" width={18} height={18} {...icon}>
                  <path d="M12 20.5s-7.2-4.7-9.4-9.2a5.3 5.3 0 0 1 9.4-4.7 5.3 5.3 0 0 1 9.4 4.7c-2.2 4.5-9.4 9.2-9.4 9.2z" />
                </svg>
              </VitalRow>
            </div>
            <button
              onClick={() => {
                tapHaptic();
                setPrivacyOpen((o) => !o);
              }}
              className="mt-5 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-faint underline underline-offset-4"
            >
              {t("privacyLink")}
            </button>
            {privacyOpen && (
              <p className="slide-enter mt-3 text-center text-[12px] leading-relaxed text-muted">
                {t("privacyDetail")}
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <h1 className="text-[28px] font-semibold tracking-tight text-paper">
              {t("ritualTitle")}
            </h1>
            <input
              type="time"
              value={notifTime}
              onChange={(e) => {
                tapHaptic();
                setNotifTime(e.target.value || "07:30");
              }}
              className="mt-8 rounded-card border border-line bg-raise px-7 py-4 text-center font-mono text-[32px] font-semibold text-paper"
              style={{ colorScheme: "dark" }}
            />
            <p className="mt-6 max-w-[260px] text-[15px] leading-relaxed text-muted">
              {t("ritualDetail")}
            </p>
          </div>
        )}
      </div>

      {/* Pied : progression discrète + un seul bouton */}
      <div className="mt-6">
        <div className="mb-5 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 rounded-pill transition-all duration-300"
              style={{
                width: i === step ? 18 : 6,
                background:
                  i === step ? "#F5F3EE" : "rgba(245,243,238,0.18)",
              }}
            />
          ))}
        </div>
        {step === 0 && (
          <button onClick={next} className={primaryBtn}>
            {t("getStarted")}
          </button>
        )}
        {step === 1 && (
          <button
            onClick={connectHealth}
            disabled={health !== "idle"}
            className={
              health === "granted"
                ? "pressable flex h-14 w-full items-center justify-center gap-2 rounded-pill border border-line bg-raise text-[15px] font-semibold text-paper"
                : `${primaryBtn} disabled:opacity-70`
            }
          >
            {health === "granted" && (
              <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="#1E9E52" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="m4.5 12.5 5 5 10-11" />
              </svg>
            )}
            {health === "idle"
              ? t("connectCta")
              : health === "asking"
                ? t("connecting")
                : t("connected")}
          </button>
        )}
        {step === 2 && (
          <button onClick={start} className={primaryBtn}>
            {t("start")}
          </button>
        )}
      </div>
    </div>
  );
}
