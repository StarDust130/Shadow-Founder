import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Analysis } from "@/lib/models/Analysis";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const analyses = await Analysis.find({ userId })
      .sort({ createdAt: -1 })
      .select("idea category score verdict verdictColor summary createdAt")
      .lean();

    return NextResponse.json(analyses);
  } catch (error) {
    console.error("Analyses fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analyses" },
      { status: 500 },
    );
  }
}
