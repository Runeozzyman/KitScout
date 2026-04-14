"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

import SkeletonResult from "../../components/skeletonResults";
import Header from "../../components/header";
import SearchFilter from "@/components/filters";
import ResultList from "@/components/resultList";
import FindNearbyStores from "@/components/nearbyStores";
import Pagination from "@/components/pagination";

export default function Search() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "Gundams";
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";
  const sort = searchParams.get("sort") || "";

  const [searchInput, setSearchInput] = useState(query);
  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);
  const [sortState, setSortState] = useState(sort);
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 15;

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query, type, min, max, sort],
    queryFn: async () => {
      const params = new URLSearchParams({
        q: query,
        type,
        ...(min && { min }),
        ...(max && { max }),
        ...(sort && { sort }),
      });

      const res = await fetch(`/api/search?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  const results = data || [];

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  const paginatedResults = results.slice(start, end);

  useEffect(() => {
    setPage(1);
  }, [query, type, min, max, sort]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [page]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="w-full border-b bg-gray-50">
        <SearchFilter 
          query={searchInput}
          min={minPrice}
          max={maxPrice}
          sort={sortState}
        />
      </div>

      <div className="flex flex-col items-center px-4 py-6 w-full">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center break-words">
          Results for: {query}
        </h1>

        {isLoading && (
          <div className="w-full max-w-5xl grid gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonResult key={i} />
            ))}
          </div>
        )}
        
        {error && <div>Something went wrong</div>}

        {!isLoading && results.length > 0 && (
          <>
            <ResultList data={paginatedResults} />

            <Pagination
              page={page}
              totalItems={results.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setPage}
            />
          </>
        )}

        {!isLoading && results.length === 0 && (
          <div className="mt-4 animate-fade-in">No results found</div>
        )}
      </div>

      <FindNearbyStores />
    </div>
  );
}