"use client";

import { useRouter } from "next/navigation";
import Sidebar from "./sidebar";

export default function Header() {
  const router = useRouter()

  return (
    <div className="w-full bg-white sticky top-0 z-50 shadow-sm">
      <div className="relative w-full flex items-center p-6">

        {/* LEFT: Hamburger */}
        <div className="flex items-center">
          <Sidebar />
        </div>

        {/* CENTER: Logo */}
        <button
          onClick={() => router.push("/")}
          className="absolute left-1/2 -translate-x-1/2 text-lg sm:text-xl font-bold tracking-tight hover:cursor-pointer"
        >
          <img src="/logo.svg" className="h-15" />
        </button>

        {/* RIGHT: spacer */}
        <div className="w-6" />
      </div>
    </div>
  )
}