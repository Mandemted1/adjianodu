import { supabaseAdmin } from "./supabase/server";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  children?: Category[];
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await supabaseAdmin
    .from("categories")
    .select("*")
    .order("name");
  return (data ?? []) as Category[];
}

export async function getCategoryTree(): Promise<Category[]> {
  const all = await getCategories();
  const parents = all.filter((c) => !c.parent_id);
  const children = all.filter((c) => c.parent_id);
  return parents.map((p) => ({
    ...p,
    children: children.filter((c) => c.parent_id === p.id),
  }));
}
