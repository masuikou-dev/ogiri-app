import { NextResponse } from "next/server";
import { createAnswer, getAnswersByTopicId } from "@/services/answers";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const list = await getAnswersByTopicId(id);
    return NextResponse.json(list);
  } catch (error) {
    console.error("failed to fetch answers", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "failed to fetch answers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { text } = body as { text?: string };
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const newAnswer = await createAnswer(id, text.trim());

    return NextResponse.json(newAnswer, { status: 201 });
  } catch (e) {
    console.error("POST error:", e);
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
}
