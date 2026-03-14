import { getSupabaseClient } from "@/lib/supabase";

export type Topic = {
  id: string;
  title: string;
  created_at: string;
};

export async function createTopic(title: string): Promise<Topic> {
  const supabase = getSupabaseClient();
  const trimmed = title.trim();
  const { data, error } = await supabase
    .from("topics")
    .insert({ title: trimmed })
    .select("id, title, created_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getTopics(): Promise<Topic[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("topics")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getTopicById(id: string): Promise<Topic | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("topics")
    .select("id, title, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
