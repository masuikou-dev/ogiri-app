import { NextResponse } from "next/server";
import { answers } from "../../../../lib/data";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const list = answers.filter((a) => a.promptId === id);
  return NextResponse.json(list);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { text } = body as { text?: string };
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const newAnswer = {
      id: String(Date.now()),
      promptId: id,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      likeCount: 0,
    };

    console.log("Adding answer:", newAnswer);
    answers.unshift(newAnswer as any);
    console.log("Total answers now:", answers.length, "ids:", answers.map((a) => a.id));

    return NextResponse.json(newAnswer, { status: 201 });
  } catch (e) {
    console.error("POST error:", e);
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
}
