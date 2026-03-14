import { NextResponse } from "next/server";
import { getTopicById } from "@/services/topics";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let topic = null;
  try {
    topic = await getTopicById(id);
  } catch (error) {
    console.error("supabase topic fetch failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "failed to fetch topic" },
      { status: 500 }
    );
  }

  const prompt = topic
    ? {
        id: topic.id,
        text: topic.text,
        createdAt: topic.createdAt,
        likeCount: topic.likeCount ?? 0,
      }
    : null;

  if (!prompt) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(prompt);
}
