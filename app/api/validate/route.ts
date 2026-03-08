import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Groq } from "groq-sdk";
import { connectDB } from "@/lib/mongodb";
import { Analysis } from "@/lib/models/Analysis";
import { User } from "@/lib/models/User";

const groq = new Groq({ apiKey: process.env.QROQ_API_KEY });

const SYSTEM_PROMPT = `You are Shadow Founder AI — a brutally honest startup analyst. You evaluate startup ideas like a seasoned VC partner with 20+ years experience. You must be direct, data-driven, and provide actionable insights.

When given a startup idea, analyze it and respond with ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "score": <number 0-100>,
  "verdict": "<one of: VIABLE, CONDITIONAL PASS, RISKY, NOT VIABLE>",
  "verdictColor": "<hex color: #22C55E for VIABLE, #FF8A3D for CONDITIONAL PASS, #FF6803 for RISKY, #EF4444 for NOT VIABLE>",
  "summary": "<2-3 sentence executive summary of the idea's potential>",
  "metrics": [
    {"label": "Market Size (TAM)", "value": "<e.g. $4.2B>", "trend": "<up or down>", "detail": "<1 sentence explanation>"},
    {"label": "Competition", "value": "<Low/Medium/High>", "trend": "<up or down>", "detail": "<1 sentence>"},
    {"label": "Revenue Potential", "value": "<e.g. $500K ARR>", "trend": "<up or down>", "detail": "<1 sentence>"},
    {"label": "Feasibility", "value": "<Low/Medium/High>", "trend": "<up or down>", "detail": "<1 sentence>"}
  ],
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "recommendations": ["<actionable recommendation 1>", "<recommendation 2>", "<recommendation 3>"]
}

Scoring guide:
- 80-100: VIABLE — Strong market fit, clear differentiation, solid economics
- 60-79: CONDITIONAL PASS — Has potential but needs pivots or better execution
- 40-59: RISKY — Significant challenges, crowded market, or weak economics
- 1-39: NOT VIABLE — Fatal flaws, no market, or impossible economics
- 0: ILLEGAL/UNETHICAL — The idea is illegal, unethical, harmful, promotes fraud, violence, exploitation, drug dealing, scams, weapons, child exploitation, hacking, phishing, or anything that violates law or basic ethics

CRITICAL RULE FOR SCORE 0:
If the idea is illegal, unethical, promotes harm, involves fraud, scams, exploitation, or any harmful/illegal activity:
- Set score to EXACTLY 0
- Set verdict to "NOT VIABLE"
- Set verdictColor to "#EF4444"
- In summary, clearly explain WHY this idea is illegal/unethical/harmful
- Strengths should all say "None — this idea is flagged as harmful"
- Weaknesses should list the legal/ethical issues
- Recommendations should encourage the user to pursue a legitimate, ethical business idea instead

Be realistic. Most ideas score 40-70. Only truly exceptional ideas get 80+. Be specific with market data and numbers.`;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { idea, target, problem, revenue, competitors, category } = body;

    if (!idea || !target || !problem) {
      return NextResponse.json(
        { error: "Missing required fields: idea, target, problem" },
        { status: 400 },
      );
    }

    await connectDB();

    // Ensure user exists in DB with Clerk name
    const clerkUser = await currentUser();
    const updateFields: Record<string, string> = {};
    if (clerkUser?.firstName) updateFields.firstName = clerkUser.firstName;
    if (clerkUser?.lastName) updateFields.lastName = clerkUser.lastName;
    if (clerkUser?.emailAddresses?.[0]?.emailAddress)
      updateFields.email = clerkUser.emailAddresses[0].emailAddress;

    await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: { clerkId: userId, ...updateFields } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const userPrompt = `Analyze this startup idea:

**Idea:** ${idea}
**Target Audience:** ${target}
**Problem it Solves:** ${problem}
${revenue ? `**Revenue Model:** ${revenue}` : ""}
${competitors ? `**Known Competitors:** ${competitors}` : ""}
${category ? `**Category:** ${category}` : ""}

Provide your analysis as JSON.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_completion_tokens: 2048,
    });

    const rawContent = completion.choices[0]?.message?.content || "";

    let analysisData;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      analysisData = JSON.parse(jsonMatch[0]);
    } catch {
      analysisData = {
        score: 50,
        verdict: "RISKY",
        verdictColor: "#FF6803",
        summary:
          "Analysis could not be fully parsed. The idea shows some potential but requires further evaluation.",
        metrics: [
          {
            label: "Market Size (TAM)",
            value: "Unknown",
            trend: "up",
            detail: "Insufficient data for estimation",
          },
          {
            label: "Competition",
            value: "Medium",
            trend: "down",
            detail: "Market assessment pending",
          },
          {
            label: "Revenue Potential",
            value: "TBD",
            trend: "up",
            detail: "Requires detailed analysis",
          },
          {
            label: "Feasibility",
            value: "Medium",
            trend: "up",
            detail: "Technical feasibility undetermined",
          },
        ],
        strengths: [
          "Addresses a stated problem",
          "Has a defined target audience",
          "Feasible concept",
        ],
        weaknesses: [
          "Needs more market validation",
          "Competition level unclear",
          "Revenue model needs refinement",
        ],
        recommendations: [
          "Conduct deeper market research",
          "Interview potential customers",
          "Build a lean prototype",
        ],
      };
    }

    const analysis = await Analysis.create({
      userId,
      idea,
      target,
      problem,
      revenue: revenue || "",
      competitors: competitors || "",
      category: category || "Other",
      score: analysisData.score,
      verdict: analysisData.verdict,
      verdictColor: analysisData.verdictColor,
      summary: analysisData.summary,
      metrics: analysisData.metrics,
      strengths: analysisData.strengths,
      weaknesses: analysisData.weaknesses,
      recommendations: analysisData.recommendations,
      followUpMessages: [],
    });

    return NextResponse.json({
      id: analysis._id.toString(),
      ...analysisData,
    });
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json(
      { error: "Failed to analyze idea. Please try again." },
      { status: 500 },
    );
  }
}
