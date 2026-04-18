import { KitResultWithCAD } from "@/types/kitWithCAD";
import WishlistBadge from "./wishlistBadge";

type Props = {
  item: KitResultWithCAD;
  isWishlisted: boolean;
  isLoading?: boolean;
  hideWishlistBadge?: boolean;
};

export default function ResultCard({ item, isWishlisted, isLoading, hideWishlistBadge}: Props) {
  return (
    <div className="relative">
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="border p-3 rounded-lg flex gap-4 hover:shadow-md"
      >
        <img
          src={item.image || "/placeholder.png"}
          alt={item.name}
          className="w-20 h-20 object-contain bg-white rounded"
        />

        <div className="flex flex-col flex-1">
          <div className="flex justify-between">
            <div className="font-semibold">{item.name}</div>
            <div>${item.priceCAD.toFixed(2)} CAD</div>
          </div>
          <div className="text-sm text-gray-500">{item.source}</div>
        </div>
      </a>

      <div
        className="absolute bottom-2 right-2"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >

        { !hideWishlistBadge &&
        <WishlistBadge
          item={item}
          isWishlisted={isWishlisted}
          isLoading={isLoading}
        />
        }
      </div>
    </div>
  );
}