// Données de démonstration en attendant le backend.

export const today = {
  score: 82,
  streakDays: 5,
  tonnageKg: 8420,
  dateLabel: "Dim. 20 juil.",
};

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
