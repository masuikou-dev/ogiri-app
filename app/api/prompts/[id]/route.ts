import { NextResponse } from "next/server";
import { prompts } from "../../../lib/data";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prompt = prompts.find((p) => p.id === id);

  if (!prompt) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(prompt);
}
