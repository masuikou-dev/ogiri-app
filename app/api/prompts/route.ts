import { NextResponse } from "next/server";
import { getPrompts, addPrompt, addAnswer } from "../../lib/data";

export async function GET() {
  return NextResponse.json(getPrompts());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, theme, answer } = body as { text?: string; theme?: string; answer?: string };

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }
    // answer is optional; only check type if provided
    if (answer !== undefined && typeof answer !== "string") {
      return NextResponse.json({ error: "answer must be a string" }, { status: 400 });
    }

    const newPrompt = {
      id: String(Date.now()),
      text: text.trim(),
      theme: theme ?? "一般",
      createdAt: new Date().toISOString(),
      likeCount: 0,
    } as const;

    addPrompt(newPrompt as any);

    // if answer text provided, store it
    if (answer && answer.trim()) {
      const newAnswer = {
        id: String(Date.now()) + "-a",
        promptId: newPrompt.id,
        text: answer.trim(),
        createdAt: new Date().toISOString(),
        likeCount: 0,
      } as const;
      addAnswer(newAnswer as any);
    }

    // return prompt (client doesn't need answer object yet)
    return NextResponse.json(newPrompt, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
}
