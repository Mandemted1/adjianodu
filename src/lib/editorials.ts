import { supabaseAdmin } from "./supabase/server";

export interface Editorial {
  id: string;
  image_url: string;
  alt_text: string;
  page: "collections" | "bestsellers";
  category_id: string | null;
  position: "after_4" | "after_2";
  active: boolean;
  sort_order: number;
  created_at: string;
}

export async function getEditorials(
  page: "collections" | "bestsellers",
  categoryId?: string | null
): Promise<Editorial[]> {
  const { data } = await supabaseAdmin
    .from("editorials")
    .select("*")
    .eq("page", page)
    .eq("active", true)
    .or(`category_id.is.null${categoryId ? `,category_id.eq.${categoryId}` : ""}`)
    .order("sort_order", { ascending: true });
  return (data ?? []) as Editorial[];
}
