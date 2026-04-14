import { KitResultWithCAD } from "@/types/kitWithCAD";
import WishlistBadge from "./wishlistBadge";

type Props = {
  item: KitResultWithCAD;
};

export default function ResultCard({ item }: Props) {
  return (
    <div className="relative">
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`border p-3 rounded-lg flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center 
          w-full hover:shadow-md hover:bg-blue-100 transition transform hover:scale-[1.01] active:scale-[0.99] 
          cursor-pointer 
        `}
      >
        <img
          src={item.image || "/placeholder.png"}
          alt={item.name}
          loading="lazy"
          className="w-20 h-20 object-contain bg-white rounded p-1 flex-shrink-0"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/placeholder.jpg";
          }}
        />
        
        <div className="flex flex-col flex-1 w-full gap-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
            
            <div className="flex items-center gap-2">
              <div className="font-semibold break-words">
                {item.name}
              </div>
            </div>

            <div className="font-medium whitespace-nowrap sm:text-right">
              ${item.priceCAD.toFixed(2)} CAD
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {item.source}
          </div>
        </div>
      </a>

      <div
        className="absolute bottom-2 right-2 z-10"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <WishlistBadge />
      </div>
    </div>
  );
}