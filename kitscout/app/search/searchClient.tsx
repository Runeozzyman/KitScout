"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/authProvider";
import { fetchWishlistedIDs } from "@/lib/supabase/wishlist";
import { GunplaGrade } from "@/types/grades";
import { KitResultWithCAD } from "@/types/kitWithCAD";
import { filterResults, isGrade } from "@/utils/filterResults";

import SkeletonResult from "../../components/skeletonResults";
import Header from "../../components/header";
import SearchFilter from "@/components/filters";
import ResultList from "@/components/resultList";
import FindNearbyStores from "@/components/nearbyStores";
import Pagination from "@/components/pagination";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const query = searchParams.get("q") || "";

  const [trackedQuery, setTrackedQuery] = useState(query);
  const [min, setMin] = useState(searchParams.get("min") || "");
  const [max, setMax] = useState(searchParams.get("max") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [grades, setGrades] = useState<GunplaGrade[]>(() =>
    parseGrades(searchParams.get("grades"))
  );
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  if (query !== trackedQuery) {
    setTrackedQuery(query);
    setMin("");
    setMax("");
    setSort("");
    setGrades([]);
    setPage(1);
  }

  const { data: wishlist, isLoading: isWishlistLoading } = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: () => fetchWishlistedIDs(user!.id),
    enabled: !!user,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query],
    queryFn: async (): Promise<KitResultWithCAD[]> => {
      const params = new URLSearchParams({ q: query });
      const res = await fetch(`/api/search?${params.toString()}`);

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
          body && typeof body.error === "string"
            ? body.error
            : "Search failed";

        throw new Error(message);
      }

      return res.json();
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  const wishlistSet = new Set(
    wishlist?.map((w) => String(w.kit_id)) ?? []
  );

  const results = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data]
  );
  const filteredResults = useMemo(
    () => filterResults(results, { min, max, sort, grades }),
    [results, min, max, sort, grades]
  );

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedResults = filteredResults.slice(start, end);
  const filtersActive =
    min !== "" || max !== "" || sort !== "" || grades.length > 0;

  useEffect(() => {
    setPage(1);
  }, [min, max, sort, grades]);

  useEffect(() => {
    const currentGrades = searchParams.get("grades") || "";
    const sameQuery =
      (searchParams.get("q") || "") === query &&
      (searchParams.get("min") || "") === min &&
      (searchParams.get("max") || "") === max &&
      (searchParams.get("sort") || "") === sort &&
      currentGrades === grades.join(",");

    if (sameQuery) return;

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (min) params.set("min", min);
    if (max) params.set("max", max);
    if (sort) params.set("sort", sort);
    if (grades.length) params.set("grades", grades.join(","));

    router.replace(`/search?${params.toString()}`, { scroll: false });
  }, [query, min, max, sort, grades, router, searchParams]);

  const toggleGrade = (grade: GunplaGrade) => {
    setGrades((current) =>
      current.includes(grade)
        ? current.filter((item) => item !== grade)
        : [...current, grade]
    );
  };

  const clearFilters = () => {
    setMin("");
    setMax("");
    setSort("");
    setGrades([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />

      <div className="w-full border-b bg-gray-50">
        <SearchFilter
          query={query}
          min={min}
          max={max}
          sort={sort}
          grades={grades}
          onMinChange={setMin}
          onMaxChange={setMax}
          onSortChange={setSort}
          onToggleGrade={toggleGrade}
          onClear={clearFilters}
        />
      </div>

      <div className="flex flex-col items-center px-4 py-6 w-full">
        <h1 className="text-xl sm:text-2xl font-bold mb-1 text-center">
          Results for: {query}
        </h1>
        {!isLoading && !error && results.length > 0 && (
          <p className="mb-4 text-sm text-gray-500">
            {filtersActive
              ? `Showing ${filteredResults.length} of ${results.length}`
              : `${results.length} kits`}
          </p>
        )}

        {isLoading && (
          <div className="w-full max-w-5xl grid gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonResult key={i} />
            ))}
          </div>
        )}

        {error && <div>{error.message}</div>}

        {!isLoading && filteredResults.length > 0 && (
          <>
            <ResultList
              data={paginatedResults}
              wishlistSet={wishlistSet}
              isWishlistLoading={isWishlistLoading}
              hideWishlistBadge={false}
            />

            <Pagination
              page={page}
              totalItems={filteredResults.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setPage}
            />
          </>
        )}

        {!isLoading && !error && results.length === 0 && (
          <div>No results found</div>
        )}

        {!isLoading && !error && results.length > 0 && filteredResults.length === 0 && (
          <div className="text-center">
            <p>No kits match these filters.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <FindNearbyStores />
    </div>
  );
}

function parseGrades(value: string | null): GunplaGrade[] {
  if (!value) return [];

  return value.split(",").filter(isGrade);
}
