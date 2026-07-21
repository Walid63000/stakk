// Données de démonstration en attendant le backend.

export const today = {
  score: 82,
  streakDays: 5,
  tonnageKg: 8420,
  dateLabel: "Dim. 20 juil.",
};

// Les trois composantes du score de récupération.
export type VitalEntry = {
  id: string;
  label: string;
  /** Valeur brute à compter en count-up. */
  value: number;
  /** Format d'affichage de la valeur. */
  format: "hm" | "int";
  unit: string;
  /** Qualité 0..1 — pilote la mini-jauge pile de disques et sa couleur. */
  pct: number;
  /** Tendance vs hier. */
  trend: { dir: "up" | "down"; label: string };
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
        { id: "sleep", label: "Sommeil", value: 442, format: "hm", unit: "", pct: 0.88, trend: { dir: "up", label: "+18 min vs hier" } },
        { id: "hrv", label: "HRV", value: 62, format: "int", unit: "ms", pct: 0.74, trend: { dir: "up", label: "+6 ms vs hier" } },
        { id: "fc", label: "FC repos", value: 52, format: "int", unit: "bpm", pct: 0.81, trend: { dir: "down", label: "−2 bpm vs hier" } },
      ],
    };
  if (score >= 34)
    return {
      score,
      sleepPerf: 64,
      strainYesterday: 78,
      vitals: [
        { id: "sleep", label: "Sommeil", value: 365, format: "hm", unit: "", pct: 0.58, trend: { dir: "down", label: "−54 min vs hier" } },
        { id: "hrv", label: "HRV", value: 48, format: "int", unit: "ms", pct: 0.46, trend: { dir: "down", label: "−9 ms vs hier" } },
        { id: "fc", label: "FC repos", value: 58, format: "int", unit: "bpm", pct: 0.52, trend: { dir: "up", label: "+4 bpm vs hier" } },
      ],
    };
  return {
    score,
    sleepPerf: 42,
    strainYesterday: 91,
    vitals: [
      { id: "sleep", label: "Sommeil", value: 287, format: "hm", unit: "", pct: 0.28, trend: { dir: "down", label: "−2 h 10 vs hier" } },
      { id: "hrv", label: "HRV", value: 31, format: "int", unit: "ms", pct: 0.2, trend: { dir: "down", label: "−18 ms vs hier" } },
      { id: "fc", label: "FC repos", value: 66, format: "int", unit: "bpm", pct: 0.16, trend: { dir: "up", label: "+9 bpm vs hier" } },
    ],
  };
}

export type SessionEntry = {
  id: string;
  name: string;
  when: string;
  durationMin: number;
  tonnageKg: number;
  intensity: number; // 0..1 — pilote la jauge pile de disques
  hasRecord?: boolean;
};

export const sessions: SessionEntry[] = [
  { id: "s1", name: "Push", when: "Hier", durationMin: 52, tonnageKg: 8420, intensity: 0.9, hasRecord: true },
  { id: "s2", name: "Pull", when: "Vendredi", durationMin: 47, tonnageKg: 7150, intensity: 0.75 },
  { id: "s3", name: "Legs", when: "Mercredi", durationMin: 58, tonnageKg: 10980, intensity: 1 },
  { id: "s4", name: "Push", when: "Lundi", durationMin: 44, tonnageKg: 6870, intensity: 0.5 },
  { id: "s5", name: "Pull", when: "12 juil.", durationMin: 50, tonnageKg: 7420, intensity: 0.75 },
];

export const weekVolume = [
  { day: "L", v: 0.55 },
  { day: "M", v: 0 },
  { day: "M", v: 0.95 },
  { day: "J", v: 0 },
  { day: "V", v: 0.62 },
  { day: "S", v: 0.78 },
  { day: "D", v: 0 },
];

export type RecordEntry = {
  id: string;
  lift: string;
  weightKg: number;
  date: string;
  isNew?: boolean;
};

export const records: RecordEntry[] = [
  { id: "r1", lift: "Développé couché", weightKg: 110, date: "19 juil. 2026", isNew: true },
  { id: "r2", lift: "Squat", weightKg: 150, date: "8 juil. 2026" },
  { id: "r3", lift: "Soulevé de terre", weightKg: 180, date: "27 juin 2026" },
  { id: "r4", lift: "Développé militaire", weightKg: 62, date: "14 juin 2026" },
  { id: "r5", lift: "Rowing barre", weightKg: 92, date: "2 juin 2026" },
];
