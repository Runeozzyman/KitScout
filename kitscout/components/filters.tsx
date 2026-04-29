"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type FilterProps = {
  query?: string;
  min?: string;
  max?: string;
  sort?: string;
  type?: string;
  grades?: string;
};

const GRADE_OPTIONS = ["HG", "RG", "MG", "PG", "SD", "EG", "FM", "MGSD"];

export default function SearchFilter({
  query = "",
  min = "",
  max = "",
  sort = "",
  type = "",
  grades = "",
}: FilterProps) {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState(query);
  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);
  const [sortState, setSortState] = useState(sort);
  const [searchType, setSearchType] = useState(type);

  const [selectedGrades, setSelectedGrades] = useState<string[]>(
    grades ? grades.split(",") : []
  );

  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setSearchInput(query);
    setMinPrice(min);
    setMaxPrice(max);
    setSortState(sort);
    setSearchType(type);
    setSelectedGrades(grades ? grades.split(",") : []);
  }, [query, min, max, sort, type, grades]);

  const toggleGrade = (grade: string) => {
    setSelectedGrades((prev) =>
      prev.includes(grade)
        ? prev.filter((g) => g !== grade)
        : [...prev, grade]
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const params = new URLSearchParams({
          q: searchInput,
          ...(searchType && { type: searchType }),
          ...(minPrice && { min: minPrice }),
          ...(maxPrice && { max: maxPrice }),
          ...(sortState && { sort: sortState }),
          ...(selectedGrades.length && {
            grades: selectedGrades.join(","),
          }),
        });

        router.push(`/search?${params.toString()}`);
      }}
      className="max-w-5xl mx-auto flex flex-col gap-4 p-4"
    >

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for a kit..."
          className="border border-gray-300 rounded-lg p-2 w-full sm:flex-1 bg-white"
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full sm:w-auto">
          Search
        </button>
      </div>

      <button
        type="button"
        onClick={() => setFiltersOpen((prev) => !prev)}
        className="w-full flex items-center justify-center gap-2 py-2 border-t border-b border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
      >
        <span>Filters</span>

        <span
          className={`transition-transform duration-200 ${
            filtersOpen ? "rotate-180" : ""
          }`}
        >
          ↓
        </span>
      </button>

      {filtersOpen && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              placeholder="Min $"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full bg-white"
            />

            <input
              type="number"
              placeholder="Max $"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full bg-white"
            />

            <select
              value={sortState}
              onChange={(e) => setSortState(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full bg-white"
            >
              <option value="">Sort By</option>
              <option value="asc">Price Asc.</option>
              <option value="desc">Price Desc.</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {GRADE_OPTIONS.map((grade) => {
              const selected = selectedGrades.includes(grade);

              return (
                <button
                  key={grade}
                  type="button"
                  onClick={() => toggleGrade(grade)}
                  className={`px-3 py-1 rounded-full border text-sm transition ${
                    selected
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {selected ? `✓ ${grade}` : grade}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </form>
  );
}