import { GRADE_OPTIONS, GunplaGrade } from "@/types/grades";
import { KitResultWithCAD } from "@/types/kitWithCAD";

export type ResultFilters = {
  min?: string;
  max?: string;
  sort?: string;
  grades?: string[];
};

export function filterResults(
  results: KitResultWithCAD[],
  filters: ResultFilters
): KitResultWithCAD[] {
  const min = parsePrice(filters.min);
  const max = parsePrice(filters.max);
  const grades = new Set(filters.grades ?? []);

  const filtered = results.filter((item) => {
    if (min !== undefined && item.priceCAD < min) return false;
    if (max !== undefined && item.priceCAD > max) return false;
    if (grades.size > 0 && (!item.grade || !grades.has(item.grade))) return false;
    return true;
  });

  if (filters.sort === "asc") {
    return filtered.sort((a, b) => a.priceCAD - b.priceCAD);
  }

  if (filters.sort === "desc") {
    return filtered.sort((a, b) => b.priceCAD - a.priceCAD);
  }

  return filtered;
}

function parsePrice(value?: string): number | undefined {
  if (!value?.trim()) return undefined;

  const price = Number(value);
  return Number.isFinite(price) ? price : undefined;
}

export function isGrade(value: string): value is GunplaGrade {
  return (GRADE_OPTIONS as readonly string[]).includes(value);
}
