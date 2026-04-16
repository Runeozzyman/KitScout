"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/authProvider";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { KitResultWithCAD } from "@/types/kitWithCAD";
import { toggleWishlistItem } from "@/lib/supabase/wishlist";

type Props = {
  item: KitResultWithCAD;
  initialWishlisted?: boolean; // optional if you already know from DB
};

export default function WishlistBadge({ item, initialWishlisted = false }: Props) {
  const { user, isLoggedIn } = useAuth();

  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);

  const handleClick = async () => {
    if (!isLoggedIn || !user) return;
    if (loading) return;

    // 1. optimistic UI update
    const prev = isWishlisted;
    setIsWishlisted(!prev);
    setLoading(true);

    try {
      const result = await toggleWishlistItem({
        item,
        userId: user.id,
      });

      console.log(result); // "added" | "removed"
    } catch (err) {
      console.error(err);

      // 2. revert if failed
      setIsWishlisted(prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <span
      onClick={handleClick}
      className={`flex flex-row rounded p-2 w-max cursor-pointer transition 
        ${isWishlisted ? "bg-yellow-400" : "bg-yellow-300 hover:bg-yellow-400"}
      `}
    >
      {isWishlisted ? (
        <FaStar size={18} />
      ) : (
        <CiStar size={18} />
      )}
    </span>
  );
}