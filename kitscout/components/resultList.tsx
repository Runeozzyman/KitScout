import { KitResultWithCAD } from "@/types/kitWithCAD";
import ResultCard from "./resultCard";
import { getKitId } from "@/utils/kitHelper";

type Props = {
  data: KitResultWithCAD[];
  wishlistSet: Set<string>;
  isWishlistLoading?: boolean;
};

export default function ResultList({ data, wishlistSet, isWishlistLoading }: Props) {
  return (
    <div className="w-full max-w-5xl grid gap-4">
      {data.map((item) => (
        <ResultCard
          key={item.link}
          item={item}
          isWishlisted={wishlistSet.has(getKitId(item.link))}
          isLoading={isWishlistLoading}
        />
      ))}
    </div>
  );
}