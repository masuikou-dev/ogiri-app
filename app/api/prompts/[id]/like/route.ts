import { incrementTopicLike } from "@/services/topics";

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  try {
    const topic = await incrementTopicLike(id);

    if (!topic) {
      return Response.json({ error: "Prompt not found" }, { status: 404 });
    }

    return Response.json({
      id: topic.id,
      text: topic.text,
      createdAt: topic.createdAt,
      likeCount: topic.likeCount ?? 0,
    });
  } catch (e) {
    console.error("supabase like failed", e);
    return Response.json(
      { error: e instanceof Error ? e.message : "Internal server error" },
      { status: 500 }
    );
  }
}
