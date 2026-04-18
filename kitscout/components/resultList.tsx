"use client";

import { KitResultWithCAD } from "@/types/kitWithCAD";
import ResultCard from "./resultCard";
import { getKitId } from "@/utils/kitHelper";

type Props = {
  data: KitResultWithCAD[];
  wishlistSet: Set<string>;
  isWishlistLoading?: boolean;
  hideWishlistBadge?: boolean;
  onRemove?: (item: KitResultWithCAD) => void;
};

export default function ResultList({
  data,
  wishlistSet,
  isWishlistLoading,
  hideWishlistBadge,
  onRemove,
}: Props) {
  return (
    <div className="w-full max-w-5xl grid gap-4">
      {data.map((item) => (
        <ResultCard
          key={item.link}
          item={item}
          isWishlisted={wishlistSet.has(getKitId(item.link))}
          isLoading={isWishlistLoading}
          hideWishlistBadge={hideWishlistBadge}
          onRemove={onRemove ? () => onRemove(item) : undefined}
        />
      ))}
    </div>
  );
}