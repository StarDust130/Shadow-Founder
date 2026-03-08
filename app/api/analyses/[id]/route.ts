import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Analysis } from "@/lib/models/Analysis";

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
