import { NextResponse } from "next/server";
import { prompts } from "../../lib/data";

export async function GET() {
  return NextResponse.json(prompts);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, theme } = body as { text?: string; theme?: string };

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const newPrompt = {
      id: String(Date.now()),
      text: text.trim(),
      theme: theme ?? "一般",
      createdAt: new Date().toISOString(),
    } as const;

    prompts.unshift(newPrompt as any);

    return NextResponse.json(newPrompt, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
}
