export const GRADE_OPTIONS = [
  "MGSD",
  "RE/100",
  "HG",
  "RG",
  "MG",
  "PG",
  "SD",
  "EG",
  "FM",
] as const;

export type GunplaGrade = (typeof GRADE_OPTIONS)[number];