import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get Clerk user data to save name
    const clerkUser = await currentUser();
    const updateFields: Record<string, string> = {};
    if (clerkUser?.firstName) updateFields.firstName = clerkUser.firstName;
    if (clerkUser?.lastName) updateFields.lastName = clerkUser.lastName;
    if (clerkUser?.emailAddresses?.[0]?.emailAddress)
      updateFields.email = clerkUser.emailAddresses[0].emailAddress;

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: { clerkId: userId, ...updateFields } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return NextResponse.json({
      plan: user.plan,
      buildsUsed: user.buildsUsed,
      maxBuilds: user.maxBuilds,
      firstName: user.firstName,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { plan } = body;

    if (!plan || !["free", "pro"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        plan,
        maxBuilds: plan === "pro" ? 999 : 1,
      },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      plan: user.plan,
      buildsUsed: user.buildsUsed,
      maxBuilds: user.maxBuilds,
    });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}
