import { getPrompts, updatePrompt } from "@/app/lib/data";

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  try {
    const prompts = getPrompts();
    const prompt = prompts.find((p) => p.id === id);

    if (!prompt) {
      return Response.json({ error: "Prompt not found" }, { status: 404 });
    }

    // increment like count
    prompt.likeCount = (prompt.likeCount || 0) + 1;
    updatePrompt(prompt);

    return Response.json(prompt);
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
