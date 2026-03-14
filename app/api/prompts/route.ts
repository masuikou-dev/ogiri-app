import { NextResponse } from "next/server";
import { createTopic, getTopics } from "@/services/topics";
import { createAnswer } from "@/services/answers";

export async function GET() {
  try {
    const prompts = await getTopics();
    return NextResponse.json(prompts);
  } catch (error) {
    console.error("supabase topics fetch failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "failed to fetch topics" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, answer } = body as { text?: string; answer?: string };

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }
    // answer is optional; only check type if provided
    if (answer !== undefined && typeof answer !== "string") {
      return NextResponse.json({ error: "answer must be a string" }, { status: 400 });
    }

    const newPrompt = await createTopic(text);

    // if answer text provided, store it
    if (answer && answer.trim()) {
      await createAnswer(newPrompt.id, answer.trim());
    }

    // return prompt (client doesn't need answer object yet)
    return NextResponse.json(newPrompt, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "invalid json";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
