"use client";

import HomeBackground from "@/components/background";
import Header from "@/components/header";
import LoginBox from "@/components/login";

export default function Login() {
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