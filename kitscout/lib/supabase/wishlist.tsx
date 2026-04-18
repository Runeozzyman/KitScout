import { getKitId } from "@/utils/kitHelper";
import { supabase } from "./client";
import { KitResultWithCAD } from "@/types/kitWithCAD";

type wishlistProps = {
  item: KitResultWithCAD;
  userId: string;
};

export async function toggleWishlistItem({ item, userId }: wishlistProps) {
  const kitId = getKitId(item.link);

  const { error: insertError } = await supabase
    .from("wishlist_items")
    .insert({
      kit_id: kitId,
      kit_title: item.name,
      kit_price: item.price,
      kit_price_CAD: item.priceCAD,
      kit_source: item.source,
      kit_img: item.image,
      kit_link: item.link,
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

export async function fetchWishlistedIDs(userId: string){

  const {data, error} = await supabase
    .from("wishlist_items")
    .select("kit_id")
    .eq("user_id", userId);

  if(error){
    console.error("Error fetching wishlist", error);
    throw error;
  }

  return data;
}

export async function fetchFullWishlist(userId: string){

  const {data, error} = await supabase
    .from("wishlist_items")
    .select(`
      kit_id,
      kit_title,
      kit_price,
      kit_price_CAD,
      kit_img,
      kit_source,
      kit_link
      `)
    .eq("user_id", userId);

  if(error){
    console.error("Error fetching wishlist", error);
    throw error;
  }

  return data;
}

