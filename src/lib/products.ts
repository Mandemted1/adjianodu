import { getSupabaseAdmin } from "./supabase/server";
import type { Product } from "./types";

export async function getAllProducts(): Promise<Product[]> {
  const { data } = await getSupabaseAdmin()
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getProductsByCollection(collection: string): Promise<Product[]> {
  const { data } = await getSupabaseAdmin()
    .from("products")
    .select("*")
    .eq("collection", collection)
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getBestsellers(): Promise<Product[]> {
  const { data } = await getSupabaseAdmin()
    .from("products")
    .select("*")
    .eq("bestseller", true)
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data } = await getSupabaseAdmin()
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  return data ?? null;
}
