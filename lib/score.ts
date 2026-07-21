// Score de récupération : calcul, zones et couleurs associées.
// Les textes (mot d'état, verdicts) vivent dans messages/*.json.

export type SignalKey = "sleep" | "hrv" | "restingHr";
export type Signals = Partial<Record<SignalKey, number | null>>;
export type Precision = "full" | "reduced";
export type ComputedScore = {
  score: number;
  precision: Precision;
  missing: SignalKey[];
};

const KEYS: SignalKey[] = ["sleep", "hrv", "restingHr"];

// Pondérations nominales quand les trois signaux sont là.
const FULL: Record<SignalKey, number> = {
  sleep: 0.4,
  hrv: 0.35,
  restingHr: 0.25,
};
// HRV absente (montres qui ne la partagent pas) : sommeil 55% + FC 45%.
const NO_HRV: Partial<Record<SignalKey, number>> = {
  sleep: 0.55,
  restingHr: 0.45,
};
// Sommeil absent : HRV 55% + FC 45%.
const NO_SLEEP: Partial<Record<SignalKey, number>> = {
  hrv: 0.55,
  restingHr: 0.45,
};

/**
 * Calcule le score à partir des signaux disponibles (chacun 0..100).
 * Jamais d'écran vide : un signal manquant dégrade la précision,
 * il ne supprime pas le score.
 */
export function computeScore(signals: Signals): ComputedScore {
  const has = (k: SignalKey) => typeof signals[k] === "number";
  const available = KEYS.filter(has);
  const missing = KEYS.filter((k) => !has(k));

  const weighted = (weights: Partial<Record<SignalKey, number>>) =>
    Math.round(
      (Object.entries(weights) as [SignalKey, number][]).reduce(
        (sum, [k, w]) => sum + (signals[k] as number) * w,
        0,
      ),
    );

  if (missing.length === 0)
    return { score: weighted(FULL), precision: "full", missing };
  if (missing.length === 1 && missing[0] === "hrv")
    return { score: weighted(NO_HRV), precision: "reduced", missing };
  if (missing.length === 1 && missing[0] === "sleep")
    return { score: weighted(NO_SLEEP), precision: "reduced", missing };
  if (available.length > 0) {
    // Cas restants (FC seule absente, un seul signal…) : on renormalise
    // les pondérations nominales sur ce qui est disponible.
    const total = available.reduce((s, k) => s + FULL[k], 0);
    const weights = Object.fromEntries(
      available.map((k) => [k, FULL[k] / total]),
    ) as Partial<Record<SignalKey, number>>;
    return { score: weighted(weights), precision: "reduced", missing };
  }
  // Aucun signal : score neutre plutôt qu'un écran vide.
  return { score: 50, precision: "reduced", missing };
}

export type ZoneName = "green" | "yellow" | "red";

export type Zone = {
  name: ZoneName;
  /** Couleur pleine de la zone (anneau, barre de verdict). */
  color: string;
  /** Fin du dégradé de l'anneau, dans le sens de progression. */
  color2: string;
  /** Ombre portée colorée — blur 30px, opacité 25%. */
  glow: string;
};

export function zoneFor(score: number): Zone {
  if (score >= 67)
    return {
      name: "green",
      color: "#1E9E52",
      color2: "#27C264",
      glow: "rgba(30,158,82,0.25)",
    };
  if (score >= 34)
    return {
      name: "yellow",
      color: "#F2B90D",
      color2: "#FFD23F",
      glow: "rgba(242,185,13,0.25)",
    };
  return {
    name: "red",
    color: "#D6362B",
    color2: "#F0564A",
    glow: "rgba(214,54,43,0.25)",
  };
}
