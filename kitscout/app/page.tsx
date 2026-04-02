"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const [query, setQuery] = useState("");
  const [type, setType] = useState("Gundams");

  const router = useRouter();

  return (
  <div className="flex flex-col items-center justify-center min-h-screen relative">
  <div
    className="absolute inset-0 bg-[length:40%] bg-[center_20%] bg-[position:10%_center] -z-10 bg-no-repeat"
    style={{ backgroundImage: "url('/bg2.png')" }}
  ></div>

  <h1 className="text-4xl font-bold mb-4">KitScout</h1>

  <form
    onSubmit={(e) => {
      e.preventDefault();
      router.push(`/search?q=${encodeURIComponent(query)}&type=${type}`);
    }}
    className="flex flex-row gap-2"
  >
    <select
      value={type}
      onChange={(e) => setType(e.target.value)}
      className="border border-gray-400 rounded-lg p-2 bg-white"
    >
      <option value="Gundams">Gundams</option>
      <option value="Models">Models</option>
      <option value="Warhammer">Warhammer</option>
    </select>

    <input
      className="border border-gray-400 rounded-lg p-2 text-center bg-white"
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
