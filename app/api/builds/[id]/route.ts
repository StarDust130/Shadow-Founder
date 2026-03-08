import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Build } from "@/lib/models/Build";

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

    const build = await Build.findOne({ _id: id, userId }).lean();
    if (!build) {
      return NextResponse.json({ error: "Build not found" }, { status: 404 });
    }

    return NextResponse.json(build);
  } catch (error) {
    console.error("Build fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch build" },
      { status: 500 },
    );
  }
}
