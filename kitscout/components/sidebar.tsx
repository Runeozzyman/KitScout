"use client"

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/authProvider"
import { signOut } from "@/lib/supabase/auth"

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  const router = useRouter();
  const {user, isLoggedIn, loading} = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
      }
    }

    if (open) {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  return (
    <>
      {/* hamburger icon */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 z-50 relative fixed hover:cursor-pointer"
        aria-label="Open menu"
      >
        <Menu strokeWidth={1.5} className="w-6 h-6" />
      </button>

      {/* overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 p-2 hover:cursor-pointer"
          aria-label="Close menu"
        >
          <X strokeWidth={1.5} className="w-5 h-5" />
        </button>

        <div className="flex flex-col gap-4 mt-16 p-4">

  <button
    className="hover:cursor-pointer"
    onClick={() => {
      setOpen(false);
      router.push("/");
    }}
  >
    Home
  </button>

  {!isLoggedIn && (
    <button
      className="hover:cursor-pointer"
      onClick={() => {
        setOpen(false);
        router.push("/login");
      }}
    >
      Login
    </button>
  )}

  {isLoggedIn && (
    <>
      <button
        className="hover:cursor-pointer"
        onClick={() => {
          setOpen(false);
          router.push("/wishlist");
        }}
      >
        Wishlist
      </button>

      <button
        className="hover:cursor-pointer"
        onClick={() => {
          setOpen(false);
          signOut();
        }}
      >
        Sign Out
      </button>
    </>
  )}
</div>
      </div>
    </>
  )
}