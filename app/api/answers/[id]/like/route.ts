import { NextResponse } from "next/server";
import { getAnswers, updateAnswer } from "../../../../lib/data";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const all = getAnswers();
    const idx = all.findIndex((a) => a.id === id);
    if (idx === -1) {
      return NextResponse.json({ 
        error: "not found",
        requestedId: id,
        availableIds: all.map((a) => a.id)
      }, { status: 404 });
    }

    const a = all[idx];
    
    // note: without user tracking, duplicates are possible
    a.likeCount = (a.likeCount ?? 0) + 1;
    updateAnswer(a);

    return NextResponse.json(a);
  } catch (err) {
    console.error("like route error", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
