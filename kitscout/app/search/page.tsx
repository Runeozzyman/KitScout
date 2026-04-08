"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import SkeletonResult from "../../components/skeletonResults";
import Header from "../../components/header";
import SearchFilter from "@/components/filters";
import ResultCard from "@/components/resultCard";
import ResultList from "@/components/resultList";

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

        {data && data.length > 0 && (
          <ResultList data={data}/>
        )}

        {!isLoading && data?.length === 0 && (
          <div className="mt-4 animate-fade-in">No results found</div>
        )}
      </div>
    </div>
  );
}