import { GRADE_OPTIONS, GunplaGrade } from "@/types/grades";

export function extractGrade(
  title: string
): GunplaGrade | undefined {
  const upperTitle = title.toUpperCase();

  for (const grade of GRADE_OPTIONS) {
    if (upperTitle.includes(grade.toUpperCase())) {
      return grade;
    }
  }

  return undefined;
}