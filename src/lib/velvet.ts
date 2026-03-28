import { getSupabaseAdmin } from "./supabase/server";

export interface VelvetImage {
  id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
}

export async function getVelvetImages(): Promise<VelvetImage[]> {
  const { data } = await getSupabaseAdmin()
    .from("velvet_images")
    .select("id, image_url, alt_text, sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  return (data ?? []) as VelvetImage[];
}
