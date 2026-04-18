"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/lib/auth/authProvider";
import { fetchFullWishlist } from "@/lib/supabase/wishlist";
import { removeWishlistItem } from "@/lib/supabase/wishlist";
import { getKitId } from "@/utils/kitHelper";
import { useQueryClient } from "@tanstack/react-query";

import SkeletonResult from "../../components/skeletonResults";
import Header from "../../components/header";
import ResultList from "@/components/resultList";
import Pagination from "@/components/pagination";

export default function WishlistPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const {
    data: wishlistData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wishlistFull", user?.id],
    queryFn: () => fetchFullWishlist(user!.id),
    enabled: !!user,
  });

  const results =
    wishlistData?.map((item: any) => ({
      name: item.kit_title,
      price: item.kit_price,
      currency: "CAD",
      priceCAD: item.kit_price_CAD,
      link: item.kit_link,
      image: item.kit_img,
      source: item.kit_source,
    })) ?? [];

  const wishlistSet = new Set(
    wishlistData?.map((item: any) => item.kit_id) ?? []
  );

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedResults = results.slice(start, end);

  const handleRemove = async (item: any) => {
    if (!user) return;

        const kitId = getKitId(item.link);

        try {
            await removeWishlistItem(user.id, kitId);

            queryClient.invalidateQueries({ queryKey: ["wishlistFull"] });

        } catch (err) {
            console.error("Failed to remove item", err);
        }
    };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-col items-center px-4 py-6 w-full">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">
          Your Wishlist
        </h1>

        {isLoading && (
          <div className="w-full max-w-5xl grid gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonResult key={i} />
            ))}
          </div>
        )}

        {error && <div>Something went wrong</div>}

        {!isLoading && results.length > 0 && (
          <>
            <ResultList
                data={paginatedResults}
                wishlistSet={wishlistSet}
                hideWishlistBadge={true}
                onRemove={handleRemove}
            />

            <Pagination
              page={page}
              totalItems={results.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setPage}
            />
          </>
        )}

        {!isLoading && results.length === 0 && (
          <div>No wishlist items yet</div>
        )}
      </div>
    </div>
  );
}