"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { GRADE_OPTIONS, GunplaGrade } from "@/types/grades";

const FILTER_GRADES: GunplaGrade[] = [
  "HG",
  "RG",
  "MG",
  "PG",
  "SD",
  "EG",
  "FM",
  "MGSD",
  "RE/100",
].filter((grade): grade is GunplaGrade =>
  (GRADE_OPTIONS as readonly string[]).includes(grade)
);

const SORT_OPTIONS = [
  { value: "", short: "Match", label: "Relevance" },
  { value: "asc", short: "$ ↑", label: "Low to high" },
  { value: "desc", short: "$ ↓", label: "High to low" },
] as const;

type FilterProps = {
  query?: string;
  min: string;
  max: string;
  sort: string;
  grades: GunplaGrade[];
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onToggleGrade: (grade: GunplaGrade) => void;
  onClear: () => void;
};

export default function SearchFilter({
  query = "",
  min,
  max,
  sort,
  grades,
  onMinChange,
  onMaxChange,
  onSortChange,
  onToggleGrade,
  onClear,
}: FilterProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(query);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const activeCount =
    (min ? 1 : 0) + (max ? 1 : 0) + (sort ? 1 : 0) + grades.length;
  const minHigherThanMax =
    min !== "" && max !== "" && Number(min) > Number(max);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const nextQuery = searchInput.trim();
          if (!nextQuery) return;
          router.push(`/search?q=${encodeURIComponent(nextQuery)}`);
        }}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for a kit..."
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:flex-1"
        />

        <button className="rounded-xl bg-blue-500 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-600 sm:w-auto">
          Search
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <button
          type="button"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
        >
          <span className="flex items-center gap-2 font-medium text-gray-800">
            <SlidersHorizontal className="h-4 w-4 text-blue-500" />
            Filters
            {activeCount > 0 && (
              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
                {activeCount}
              </span>
            )}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
              filtersOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {filtersOpen && (
          <div className="flex flex-col gap-5 border-t border-gray-100 px-4 py-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_minmax(240px,0.9fr)]">
              <PriceField
                label="Minimum"
                value={min}
                placeholder="0"
                onChange={onMinChange}
              />
              <PriceField
                label="Maximum"
                value={max}
                placeholder="Any"
                onChange={onMaxChange}
              />

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">Sort</span>
                <div className="grid grid-cols-3 gap-1 rounded-xl bg-gray-100 p-1">
                  {SORT_OPTIONS.map((option) => {
                    const selected = sort === option.value;

                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => onSortChange(option.value)}
                        className={`rounded-lg px-1.5 py-2 text-xs font-medium transition sm:text-sm ${
                          selected
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <span className="sm:hidden">{option.short}</span>
                        <span className="hidden sm:inline">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Grade</p>
              <div className="flex flex-wrap gap-2">
                {FILTER_GRADES.map((grade) => {
                  const selected = grades.includes(grade);

                  return (
                    <button
                      key={grade}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onToggleGrade(grade)}
                      className={`min-h-10 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                        selected
                          ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {grade}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-500">
                {minHigherThanMax
                  ? "Minimum is higher than maximum."
                  : "Prices shown in CAD."}
              </p>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={onClear}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PriceField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="flex items-center rounded-xl border border-gray-200 bg-gray-50 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
        <span className="pl-3 text-gray-400">$</span>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-2 py-2.5 outline-none"
        />
      </span>
    </label>
  );
}
