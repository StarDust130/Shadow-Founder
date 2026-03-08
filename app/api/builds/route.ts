import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Build } from "@/lib/models/Build";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const builds = await Build.find({ userId, status: "READY" })
      .select("_id ideaTitle techStack status createdAt analysisId")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json(builds);
  } catch (error) {
    console.error("Builds fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch builds" },
      { status: 500 },
    );
  }
}
