"use client";

import SearchBar from "@/components/search";
import HomeBackground from "@/components/background";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
  return (
    
  <div className="relative min-h-screen flex flex-col m-auto">
    <HomeBackground />
    <SearchBar />
    <Footer />
  </div>

  );
}
