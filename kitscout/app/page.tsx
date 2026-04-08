"use client";

import SearchBar from "@/components/search";

export default function Home() {
  return (

  <div className="relative min-h-screen">

  <div
    className="
      hidden md:block
      absolute inset-0 
      bg-contain md:bg-[length:50%] lg:bg-[length:40%]
      bg-no-repeat 
      bg-[position:10%_center]
      -z-10
    "
    style={{ backgroundImage: "url('/bg2.png')" }}
  >
  </div>

    <SearchBar />
    
  </div>

  

  );
}
