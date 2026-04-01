"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const [query, setQuery] = useState("");
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">

      <h1 className="text-3xl font-bold mb-4">KitScout</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/search?q=${query}`);
        }}
        className="flex gap-2"
      >
      <input
        className="border border-gray-400 rounded-lg p-2 text-center"
        id="kit-search-bar"
        type="text"
        placeholder="Search for a kit here!"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Search
      </button>

      </form>

    </div>
  );
}
