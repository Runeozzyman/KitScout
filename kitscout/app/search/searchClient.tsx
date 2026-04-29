"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/authProvider";
import { fetchWishlistedIDs } from "@/lib/supabase/wishlist";

import SkeletonResult from "../../components/skeletonResults";
import Header from "../../components/header";
import SearchFilter from "@/components/filters";
import ResultList from "@/components/resultList";
import FindNearbyStores from "@/components/nearbyStores";
import Pagination from "@/components/pagination";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "Gundams";
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";
  const sort = searchParams.get("sort") || "";
  const grades = searchParams.get("grades") || "";

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const { data: wishlist, isLoading: isWishlistLoading } = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: () => fetchWishlistedIDs(user!.id),
    enabled: !!user,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query, type, min, max, sort, grades],
    queryFn: async () => {
      const params = new URLSearchParams({
        q: query,
        type,
        ...(min && { min }),
        ...(max && { max }),
        ...(sort && { sort }),
        ...(grades && { grades }),
      });

      const res = await fetch(`/api/search?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Failed to fetch");
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

  const results = data || [];

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedResults = results.slice(start, end);

  // reset pagination when filters change
  const filterKey = `${query}|${type}|${min}|${max}|${sort}|${grades}`;
    useEffect(() => {
      setPage(1);
    }, [filterKey]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="w-full border-b bg-gray-50">
        <SearchFilter
          query={query}
          min={min}
          max={max}
          sort={sort}
          type={type}
          grades={grades}
        />
      </div>

      <div className="flex flex-col items-center px-4 py-6 w-full">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">
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
            <ResultList
              data={paginatedResults}
              wishlistSet={wishlistSet}
              isWishlistLoading={isWishlistLoading}
              hideWishlistBadge={false}
            />

            <Pagination
              page={page}
              totalItems={results.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setPage}
            />
          </>
        )}

        {!isLoading && results.length === 0 && (
          <div>No results found</div>
        )}
      </div>

      <FindNearbyStores />
    </div>
  );
}