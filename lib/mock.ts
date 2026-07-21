// Données de démonstration en attendant le backend.
// Aucun texte de langue ici : uniquement des clés i18n et des valeurs.

export const today = {
  score: 82,
  streakDays: 5,
};

// Les trois composantes du score de récupération.
export type VitalEntry = {
  id: string;
  /** Clé du label dans messages/*.json (home.vitals.*). */
  labelKey: "sleep" | "hrv" | "restingHr";
  /** Valeur brute à compter en count-up. */
  value: number;
  /** Format d'affichage de la valeur. */
  format: "hm" | "int";
  unit: string;
  /** Qualité 0..1 — pilote la mini-jauge pile de disques et sa couleur. */
  pct: number;
  /** Tendance vs hier — delta neutre, le "vs hier" vient des messages. */
  trend: { dir: "up" | "down"; delta: string };
};

export type Scenario = {
  score: number;
  sleepPerf: number; // % — performance de la nuit
  strainYesterday: number; // effort d'hier, échelle 0..100
  vitals: VitalEntry[];
};

// Trois scénarios de démonstration, un par zone, pour valider que le
// système de couleurs tient dans les trois états.
export function scenarioFor(score: number): Scenario {
  if (score >= 67)
    return {
      score,
      sleepPerf: 88,
      strainYesterday: 62,
      vitals: [
        { id: "sleep", labelKey: "sleep", value: 442, format: "hm", unit: "", pct: 0.88, trend: { dir: "up", delta: "+18 min" } },
        { id: "hrv", labelKey: "hrv", value: 62, format: "int", unit: "ms", pct: 0.74, trend: { dir: "up", delta: "+6 ms" } },
        { id: "fc", labelKey: "restingHr", value: 52, format: "int", unit: "bpm", pct: 0.81, trend: { dir: "down", delta: "−2 bpm" } },
      ],
    };
  if (score >= 34)
    return {
      score,
      sleepPerf: 64,
      strainYesterday: 78,
      vitals: [
        { id: "sleep", labelKey: "sleep", value: 365, format: "hm", unit: "", pct: 0.58, trend: { dir: "down", delta: "−54 min" } },
        { id: "hrv", labelKey: "hrv", value: 48, format: "int", unit: "ms", pct: 0.46, trend: { dir: "down", delta: "−9 ms" } },
        { id: "fc", labelKey: "restingHr", value: 58, format: "int", unit: "bpm", pct: 0.52, trend: { dir: "up", delta: "+4 bpm" } },
      ],
    };
  return {
    score,
    sleepPerf: 42,
    strainYesterday: 91,
    vitals: [
      { id: "sleep", labelKey: "sleep", value: 287, format: "hm", unit: "", pct: 0.28, trend: { dir: "down", delta: "−2 h 10" } },
      { id: "hrv", labelKey: "hrv", value: 31, format: "int", unit: "ms", pct: 0.2, trend: { dir: "down", delta: "−18 ms" } },
      { id: "fc", labelKey: "restingHr", value: 66, format: "int", unit: "bpm", pct: 0.16, trend: { dir: "up", delta: "+9 bpm" } },
    ],
  };
}
