import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Analysis } from "@/lib/models/Analysis";

function generateName(idea: string): string {
  const skip = new Set(["a","an","the","for","to","of","in","on","and","or","is","it","that","with","as","by","this","from","at","my","your","our","just","very","really","also","about","based","using","use","new","get","app","platform","tool","system","service","website","software","build","create","make","like","want","need","can","will","would","should","could","online","digital","smart","ai","store","shop","marketplace","ecommerce","sell","buy","selling","buying","market","help","helps","people","users","manage","simple","easy","best","good","great"]);
  const words = idea.split(/\s+/).filter(w => !skip.has(w.toLowerCase()) && w.length > 2);
  const suffixes = ["ly","ify","io","Hub","Sync","Flow","Nest","Base","Mint","Wave","Pulse","Spark","Cart","Verse","Stack"];
  if (words.length >= 1) {
    const cw = words[words.length - 1];
    const s = cw.endsWith('s') && cw.length > 3 ? cw.slice(0, -1) : cw;
    const core = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    return core + suffixes[core.charCodeAt(0) % suffixes.length];
  }
  return "LaunchPad";
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const analysis = await Analysis.findOne({ _id: id, userId }).lean();
    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 },
      );
    }

    // Backfill appName if missing — generate and persist to DB
    if (!analysis.appName) {
      const generatedName = generateName(analysis.idea);
      await Analysis.updateOne({ _id: id }, { $set: { appName: generatedName } });
      analysis.appName = generatedName;
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analysis" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { appName } = body;

    if (!appName || typeof appName !== "string" || appName.trim().length === 0) {
      return NextResponse.json(
        { error: "App name is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const analysis = await Analysis.findOneAndUpdate(
      { _id: id, userId },
      { appName: appName.trim().slice(0, 50) },
      { new: true },
    );

    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ appName: analysis.appName });
  } catch (error) {
    console.error("Analysis update error:", error);
    return NextResponse.json(
      { error: "Failed to update analysis" },
      { status: 500 },
    );
  }
}
