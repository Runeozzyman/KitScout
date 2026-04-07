"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import SkeletonResult from "../../components/skeletonResults";

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
      <div className="w-full border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-center p-6">
          <button
            onClick={() => router.push("/")}
            className="text-lg sm:text-xl font-bold tracking-tight hover:cursor-pointer"
          >
            KitScout
          </button>
        </div>
      </div>

      <div className="w-full border-b bg-gray-50">
        <form
          onSubmit={(e) => {
            e.preventDefault();

            const params = new URLSearchParams({
              q: searchInput,
              type,
              ...(minPrice && { min: minPrice }),
              ...(maxPrice && { max: maxPrice }),
              ...(sortState && { sort: sortState }),
            });

            router.push(`/search?${params.toString()}`);
          }}
          className="max-w-5xl mx-auto flex flex-col gap-2 p-4"
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
              <option value="">Sort</option>
              <option value="asc">Price ↑</option>
              <option value="desc">Price ↓</option>
            </select>
          </div>
        </form>
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

        <div className="w-full max-w-5xl grid gap-4">
          {data?.map((item: any) => (
            <a
              key={item.link}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="border p-3 rounded-lg flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center w-full hover:shadow-md hover:bg-gray-50 transition transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name}
                loading="lazy"
                className="w-20 h-20 object-contain bg-white rounded p-1 flex-shrink-0"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/placeholder.jpg";
                }}
              />

              <div className="flex flex-col flex-1 w-full gap-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                  <div className="font-semibold break-words">
                    {item.name}
                  </div>
                  <div className="font-medium whitespace-nowrap sm:text-right">
                    ${item.priceCAD.toFixed(2)} CAD
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  {item.source}
                </div>
              </div>
            </a>
          ))}
        </div>

        {!isLoading && data?.length === 0 && (
          <div className="mt-4">No results found</div>
        )}
      </div>
    </div>
  );
}