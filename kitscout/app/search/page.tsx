"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      console.log("Fetching from API: ", query);
      const res = await fetch(`/api/search?q=${query}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!query,
    staleTime: 1000*60*2, //2 mins
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col items-center p-4">

      <h1 className="text-2xl font-bold mb-4">
        Results for: {query}
      </h1>

      {isLoading && <div>Loading...</div>}
      {error && <div>Something went wrong</div>}

      <div className="flex flex-col gap-2 w-full max-w-xl">
        {data?.map((item: any) => (
    <div
        key={item.link}
        className="border p-3 rounded-lg flex gap-4 items-center w-full hover:shadow-md transition"
    >
            <img
            src={item.image || "/placeholder.png"}
            alt={item.name}
            loading="lazy"
            className="w-20 h-20 object-contain bg-white rounded p-1"
            onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
            }}
            />

            <div className="flex flex-col flex-1">
            <div className="flex justify-between items-center gap-2">
                <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
                >
                {item.name}
                </a>

                <div className="font-medium whitespace-nowrap">
                ${item.priceCAD.toFixed(2)} CAD
                </div>
            </div>

            <div className="text-sm text-gray-500">
                {item.source}
            </div>
            </div>
        </div>
        ))}
      </div>

      {!isLoading && data?.length === 0 && (
        <div>No results found</div>
      )}
    </div>
  );
}