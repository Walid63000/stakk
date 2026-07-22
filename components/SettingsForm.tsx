"use client";

// Réglages : notification matinale, objectif de sommeil, unités,
// langue, compte (placeholder Supabase) et suppression des données.
// Persistance locale en attendant le backend.

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LanguageToggle } from "@/components/LanguageToggle";
import { tapHaptic } from "@/lib/haptics";

type Prefs = {
  notifTime: string; // "07:30"
  sleepGoalMin: number; // minutes
  units: "kg" | "lb";
};

const DEFAULTS: Prefs = { notifTime: "07:30", sleepGoalMin: 480, units: "kg" };
const STORE_KEY = "stakk-prefs";

function loadPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORE_KEY) ?? "{}") };
  } catch {
    return DEFAULTS;
  }
}

function fmtGoal(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h} h ${m.toString().padStart(2, "0")}`;
}

function Row({
  label,
  hint,
  children,
  border,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  border?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-5 py-4 ${
        border ? "border-t border-line" : ""
      }`}
    >
      <div>
        <p className="text-[15px] font-medium text-paper">{label}</p>
        {hint && <p className="mt-0.5 text-[12px] text-faint">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rise mt-7">
      <h2 className="px-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
        {title}
      </h2>
      <div className="mt-2.5 overflow-hidden rounded-card border border-line bg-raise">
        {children}
      </div>
    </section>
  );
}

export function SettingsForm() {
  const t = useTranslations("settings");
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPrefs(loadPrefs());
    setLoaded(true);
  }, []);

  function update(patch: Partial<Prefs>) {
    setPrefs((p) => {
      const next = { ...p, ...patch };
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(next));
      } catch {
        /* stockage indisponible */
      }
      return next;
    });
  }

  function stepGoal(delta: number) {
    tapHaptic();
    update({
      sleepGoalMin: Math.min(600, Math.max(300, prefs.sleepGoalMin + delta)),
    });
  }

  const stepBtn =
    "pressable flex h-8 w-8 items-center justify-center rounded-pill border border-line text-[16px] text-paper";

  return (
    <div className="stagger" style={{ opacity: loaded ? 1 : 0.9 }}>
      <Group title={t("groups.daily")}>
        <Row label={t("morningNotif")} hint={t("morningNotifHint")}>
          <input
            type="time"
            value={prefs.notifTime}
            onChange={(e) => {
              tapHaptic();
              update({ notifTime: e.target.value || DEFAULTS.notifTime });
            }}
            className="rounded-pill border border-line bg-raise2 px-3 py-1.5 font-mono text-[13px] font-semibold text-paper"
            style={{ colorScheme: "dark" }}
          />
        </Row>
        <Row label={t("sleepGoal")} hint={t("sleepGoalHint")} border>
          <div className="flex items-center gap-3">
            <button onClick={() => stepGoal(-15)} className={stepBtn} aria-label="−15 min">
              −
            </button>
            <span className="w-[64px] text-center font-mono text-[14px] font-semibold text-paper">
              {fmtGoal(prefs.sleepGoalMin)}
            </span>
            <button onClick={() => stepGoal(15)} className={stepBtn} aria-label="+15 min">
              +
            </button>
          </div>
        </Row>
      </Group>

      <Group title={t("groups.app")}>
        <Row label={t("units")}>
          <div className="flex gap-1 rounded-pill border border-line bg-ink p-1">
            {(["kg", "lb"] as const).map((u) => (
              <button
                key={u}
                onClick={() => {
                  if (u !== prefs.units) {
                    tapHaptic();
                    update({ units: u });
                  }
                }}
                className={`pressable rounded-pill px-3 py-1 font-mono text-[12px] font-semibold transition-colors duration-300 ${
                  prefs.units === u ? "bg-raise2 text-paper" : "text-faint"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </Row>
        <Row label={t("language")} border>
          <LanguageToggle />
        </Row>
      </Group>

      <Group title={t("groups.account")}>
        <Row label={t("signIn")} hint={t("signInHint")}>
          <span className="rounded-pill border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
            {t("soon")}
          </span>
        </Row>
      </Group>

      {/* Visible, sobre — un argument de confiance, pas un piège caché */}
      <section className="rise mt-7">
        <button
          onClick={() => tapHaptic()}
          className="pressable w-full rounded-card border border-ember/30 py-4 text-[14px] font-medium text-ember"
        >
          {t("deleteData")}
        </button>
        <p className="mt-2 text-center font-mono text-[11px] text-faint">
          {t("deleteDataHint")}
        </p>
      </section>

      <p className="rise mt-7 text-center font-mono text-[11px] text-faint">
        {t("version")}
      </p>
    </div>
  );
}
