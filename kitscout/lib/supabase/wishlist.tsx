import { supabase } from "./client";
import { KitResultWithCAD } from "@/types/kitWithCAD";

type Props = {
  item: KitResultWithCAD;
  userId: string;
};

export async function toggleWishlistItem({ item, userId }: Props) {
  const kitId = `${item.source}-${item.name}`;

  const { error: insertError } = await supabase
    .from("wishlist_items")
    .insert({
      kit_id: kitId,
      kit_title: item.name,
      kit_price: item.price,
      kit_price_CAD: item.priceCAD,
      kit_source: item.source,
      kit_img: item.image,
      user_id: userId,
    });

  if (!insertError) {
    return { action: "added" };
  }

  if (insertError.code === "23505") {
    const { error: deleteError } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("user_id", userId)
      .eq("kit_id", kitId);

    if (deleteError) throw deleteError;

    return { action: "removed" };
  }

  throw insertError;
}