"use client";

import SearchBar from "@/components/search";
import HomeBackground from "@/components/background";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function Home() {
  return (
    <div className="relative h-screen w-full flex flex-col overflow-hidden">
      <Header />
      <HomeBackground />
      <SearchBar />
      <Footer />
    </div>
  );
}