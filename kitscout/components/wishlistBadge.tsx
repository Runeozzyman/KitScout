"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/authProvider";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { KitResultWithCAD } from "@/types/kitWithCAD";
import { toggleWishlistItem } from "@/lib/supabase/wishlist";
import { useRouter } from "next/navigation";

type Props = {
  item: KitResultWithCAD;
  isWishlisted: boolean;
  isLoading?: boolean;
};

export default function WishlistBadge({ item, isWishlisted, isLoading }: Props) {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [localState, setLocalState] = useState(isWishlisted);

  useEffect(() => {
    setLocalState(isWishlisted);
  }, [isWishlisted]);

  const handleClick = async () => {
    if (!isLoggedIn || !user) {
      router.push("/login");
      return;
    }

    if (loading) return;

    const prev = localState;
    setLocalState(!prev);
    setLoading(true);

    try {
      await toggleWishlistItem({
        item,
        userId: user.id,
      });
    } catch (err) {
      console.error(err);
      setLocalState(prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <span
      onClick={handleClick}
      className={`flex flex-row rounded p-2 w-max cursor-pointer transition 
        ${localState ? "bg-yellow-400" : "bg-yellow-300 hover:bg-yellow-400"}
      `}
    >
      {localState ? (
        <FaStar size={18} />
      ) : (
        <CiStar size={18} />
      )}
    </span>
  );
}