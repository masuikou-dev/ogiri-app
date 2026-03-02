import { NextResponse } from "next/server";
import { answers } from "../../../../lib/data";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log("Like request for answer id:", id);
  console.log("Available answer ids:", answers.map((a) => a.id));
  
  const idx = answers.findIndex((a) => a.id === id);
  if (idx === -1) {
    return NextResponse.json({ 
      error: "not found",
      requestedId: id,
      availableIds: answers.map((a) => a.id)
    }, { status: 404 });
  }

  const a = answers[idx];
  a.likeCount = (a.likeCount ?? 0) + 1;
  answers[idx] = a;

  return NextResponse.json(a);
}
