import { getSupabaseClient } from "@/lib/supabase";

export type DbAnswer = {
  id: string;
  topic_id: string | null;
  promptId: string | null;
  text: string;
  createdAt: string;
  likeCount: number | null;
  user_id?: string | null;
};

export type AppAnswer = {
  id: string;
  promptId: string;
  text: string;
  createdAt: string;
  likeCount: number;
};

function toAppAnswer(row: DbAnswer): AppAnswer {
  return {
    id: row.id,
    promptId: row.promptId ?? row.topic_id ?? "",
    text: row.text,
    createdAt: row.createdAt,
    likeCount: row.likeCount ?? 0,
  };
}

export async function getAnswersByTopicId(topicId: string): Promise<AppAnswer[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("answers")
    .select("id, topic_id, promptId, text, createdAt, likeCount, user_id")
    .or(`topic_id.eq.${topicId},promptId.eq.${topicId}`)
    .order("createdAt", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(toAppAnswer);
}

export async function createAnswer(topicId: string, text: string): Promise<AppAnswer> {
  const supabase = getSupabaseClient();
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("text is required");
  }

  const { data, error } = await supabase
    .from("answers")
    .insert({
      topic_id: topicId,
      promptId: topicId,
      text: trimmed,
      createdAt: new Date().toISOString(),
      likeCount: 0,
    })
    .select("id, topic_id, promptId, text, createdAt, likeCount, user_id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toAppAnswer(data);
}

export async function incrementAnswerLike(answerId: string): Promise<AppAnswer | null> {
  const supabase = getSupabaseClient();

  const { data: current, error: fetchError } = await supabase
    .from("answers")
    .select("id, topic_id, promptId, text, createdAt, likeCount, user_id")
    .eq("id", answerId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (!current) {
    return null;
  }

  const nextLikeCount = (current.likeCount ?? 0) + 1;
  const { data, error } = await supabase
    .from("answers")
    .update({ likeCount: nextLikeCount })
    .eq("id", answerId)
    .select("id, topic_id, promptId, text, createdAt, likeCount, user_id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toAppAnswer(data);
}
