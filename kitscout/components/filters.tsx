"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { filterProps }  from "@/types/filterProps";

export default function SearchFilter({
  query = "",
  min = "",
  max = "",
  sort = "",
  type = "", //THIS NEEDS TO BE DYNAMIC AND PULLED FROM THE URL
}: filterProps) {

    const searchParams = useSearchParams();

    const [searchInput, setSearchInput] = useState(query);
    const [minPrice, setMinPrice] = useState(min);
    const [maxPrice, setMaxPrice] = useState(max);
    const [sortState, setSortState] = useState(sort);

    const router = useRouter();

    const searchType = searchParams.get("type") || "";

return(
    <form
          onSubmit={(e) => {
            e.preventDefault();

            const params = new URLSearchParams({
              q: searchInput,
              ...(searchType && {type: searchType}),
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
              <option value="asc">Price Asc.</option>
              <option value="desc">Price Desc.</option>
            </select>
          </div>
        </form>
    )
}