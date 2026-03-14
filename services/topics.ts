import { getSupabaseClient } from "@/lib/supabase";

export type Topic = {
  id: string;
  text: string;
  createdAt: string;
  likeCount: number | null;
  user_id?: string | null;
};

export async function createTopic(title: string): Promise<Topic> {
  const supabase = getSupabaseClient();
  const trimmed = title.trim();
  if (!trimmed) {
    throw new Error("title is required");
  }

  const { data, error } = await supabase
    .from("topics")
    .insert({ text: trimmed, createdAt: new Date().toISOString(), likeCount: 0 })
    .select("id, text, createdAt, likeCount, user_id")
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
    .select("id, text, createdAt, likeCount, user_id")
    .order("createdAt", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getTopicById(id: string): Promise<Topic | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("topics")
    .select("id, text, createdAt, likeCount, user_id")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function incrementTopicLike(id: string): Promise<Topic | null> {
  const supabase = getSupabaseClient();

  const current = await getTopicById(id);
  if (!current) return null;

  const nextLikeCount = (current.likeCount ?? 0) + 1;
  const { data, error } = await supabase
    .from("topics")
    .update({ likeCount: nextLikeCount })
    .eq("id", id)
    .select("id, text, createdAt, likeCount, user_id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
