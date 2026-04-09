"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FindNearbyStores() {

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const url = `https://www.google.com/maps/search/hobby+shop+near+me/
               ${location?.lat},
               ${location?.lng},
               14z`;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        window.open(url, "_blank")
        setLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-lg font-semibold text-center">
        Rather pick them up in person?
      </h1>

      <button
        onClick={handleGetLocation}
        className="bg-blue-500 hover:bg-blue-400 transition text-white px-4 py-2 rounded-lg mb-4"
        disabled={loading}
      >
        Find Nearby Stores
      </button>

    </div>
  );
}

