"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {

  const [query, setQuery] = useState("");
  const [type, setType] = useState("Gunpla");

  const router = useRouter();

  return (
<div className="flex items-center justify-center min-h-screen">

  <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col items-center animate-slide-in">
    
    <img 
      src="/logo.svg" 
      className="h-30 mb-3"
    />
    
    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-800 mb-2 text-center">
      Find the best price on your next kit.
    </h1>

    <p className="text-gray-500 mb-6 text-center">
      Compare prices across multiple stores instantly.
    </p>

    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(query)}&type=${type}`);
      }}
      className="flex flex-col sm:flex-row gap-2 w-full"
    >
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border border-gray-400 rounded-lg p-2 bg-white w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="Gunpla">Gunpla</option>
        <option value="Models">Models</option>
        <option value="Warhammer">Warhammer</option>
      </select>

      <input
        className="border border-gray-300 rounded-lg p-2 text-center bg-white w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        type="text"
        placeholder="Search for a kit here!"
        value={query}
        required
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded-lg w-full sm:w-auto"
      >
        Search
      </button>
    </form>

  </div>
</div>
  );
}
