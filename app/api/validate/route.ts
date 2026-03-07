import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idea, target, problem, revenue, competitors, category } = body;

    if (!idea || !target || !problem) {
      return NextResponse.json(
        { error: "Missing required fields: idea, target, problem" },
        { status: 400 },
      );
    }

    // TODO: Integrate Gemini Pro API for market analysis
    // For now return a structured placeholder
    const analysis = {
      id: crypto.randomUUID(),
      verdict: "PENDING",
      score: 0,
      summary: "Analysis pending — Gemini integration required.",
      input: { idea, target, problem, revenue, competitors, category },
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(analysis, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
