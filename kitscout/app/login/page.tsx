"use client";

import HomeBackground from "@/components/background";
import Header from "@/components/header";
import LoginBox from "@/components/login";

import { useAuth } from "@/lib/auth/authProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const { isLoggedIn, loading } = useAuth();

  return (
    <div className="relative min-h-screen">
      <Header />
      <HomeBackground />

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <LoginBox />
      </div>
    </div>
  );
}