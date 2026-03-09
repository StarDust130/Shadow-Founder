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

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const analyses = await Analysis.find({ userId })
      .sort({ createdAt: -1 })
      .select("idea appName category score verdict verdictColor summary createdAt")
      .lean();

    // Backfill appName for old records — generate and persist to DB
    const toBackfill = analyses.filter((a: Record<string, unknown>) => !a.appName);
    if (toBackfill.length > 0) {
      const ops = toBackfill.map((a: Record<string, unknown>) => ({
        updateOne: {
          filter: { _id: a._id },
          update: { $set: { appName: generateName(a.idea as string) } },
        },
      }));
      await Analysis.bulkWrite(ops);
    }

    const results = analyses.map((a: Record<string, unknown>) => ({
      ...a,
      appName: (a.appName as string) || generateName(a.idea as string),
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Analyses fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analyses" },
      { status: 500 },
    );
  }
}
