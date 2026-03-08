import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Groq } from "groq-sdk";
import { connectDB } from "@/lib/mongodb";
import { Analysis } from "@/lib/models/Analysis";
import { User } from "@/lib/models/User";

const groq = new Groq({ apiKey: process.env.QROQ_API_KEY });

const SYSTEM_PROMPT = `You are Shadow Founder AI — a brutally honest startup analyst with deep expertise in the Indian startup ecosystem and global markets. You evaluate startup ideas like a seasoned VC partner (Sequoia India, Peak XV, Accel) with 20+ years experience. You must be direct, data-driven, and provide actionable insights.

IMPORTANT: Use Indian Rupees (₹) for ALL monetary values. Show both Indian and global market context.

When given a startup idea, analyze it and respond with ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "score": <number 0-100>,
  "appName": "<REQUIRED — invent a short, catchy, memorable product name for this idea. 1-2 words max. Think like a real startup: Notion, Stripe, Figma, Canva, Loom, Arc, Linear, Vercel, Clerk, Zerodha, Razorpay, Cred, Meesho, PhonePe. Be creative and unique. Do NOT just repeat the idea description. If user provides an appName, use that instead.>",
  "verdict": "<one of: VIABLE, CONDITIONAL PASS, RISKY, NOT VIABLE>",
  "verdictColor": "<hex color: #22C55E for VIABLE, #FF8A3D for CONDITIONAL PASS, #FF6803 for RISKY, #EF4444 for NOT VIABLE>",
  "summary": "<2-3 sentence executive summary of the idea's potential with Indian market context>",
  "metrics": [
    {"label": "Market Size (TAM)", "value": "<e.g. ₹35,000 Cr ($4.2B)>", "trend": "<up or down>", "detail": "<1 sentence with India + global size>"},
    {"label": "Competition", "value": "<Low/Medium/High>", "trend": "<up or down>", "detail": "<1 sentence about competitive landscape>"},
    {"label": "Revenue Potential", "value": "<e.g. ₹40L ARR>", "trend": "<up or down>", "detail": "<1 sentence in Indian context>"},
    {"label": "Feasibility", "value": "<Low/Medium/High>", "trend": "<up or down>", "detail": "<1 sentence>"},
    {"label": "India Market Fit", "value": "<Low/Medium/High>", "trend": "<up or down>", "detail": "<1 sentence about India-specific opportunity>"},
    {"label": "Time to MVP", "value": "<e.g. 3-4 months>", "trend": "<up or down>", "detail": "<1 sentence about dev timeline>"}
  ],
  "bigPlayers": [
    {"name": "<competitor name>", "strength": "<what they do well>", "weakness": "<their gap you can exploit>"},
    {"name": "<competitor 2>", "strength": "<...>", "weakness": "<...>"},
    {"name": "<competitor 3>", "strength": "<...>", "weakness": "<...>"}
  ],
  "failureRisks": ["<specific reason this idea could fail #1>", "<reason #2>", "<reason #3>", "<reason #4>"],
  "founderChecklist": ["<thing founder MUST do before building #1>", "<#2>", "<#3>", "<#4>", "<#5>"],
  "monetization": ["<specific monetization strategy #1>", "<strategy #2>", "<strategy #3>"],
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
- bigPlayers, failureRisks, founderChecklist, monetization arrays should have relevant entries about why this is harmful

Be realistic. Most ideas score 40-70. Only truly exceptional ideas get 80+. Be specific with market data and numbers. Always include Indian market perspective with ₹ values.`;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { idea, appName: userAppName, target, problem, revenue, competitors, category } = body;

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
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );

    const userPrompt = `Analyze this startup idea:

**Idea:** ${idea}
${userAppName ? `**Preferred App Name:** ${userAppName}` : ""}
**Target Audience:** ${target}
**Problem it Solves:** ${problem}
${revenue ? `**Revenue Model:** ${revenue}` : ""}
${competitors ? `**Known Competitors:** ${competitors}` : ""}
${category ? `**Category:** ${category}` : ""}

Provide your analysis as JSON. Use Indian Rupees (₹) for monetary values. Include bigPlayers, failureRisks, founderChecklist, and monetization sections.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_completion_tokens: 4096,
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
        appName: userAppName || idea.split(" ").slice(0, 2).join(""),
        verdict: "RISKY",
        verdictColor: "#FF6803",
        summary:
          "Analysis could not be fully parsed. The idea shows some potential but requires further evaluation.",
        metrics: [
          { label: "Market Size (TAM)", value: "Unknown", trend: "up", detail: "Insufficient data for estimation" },
          { label: "Competition", value: "Medium", trend: "down", detail: "Market assessment pending" },
          { label: "Revenue Potential", value: "TBD", trend: "up", detail: "Requires detailed analysis" },
          { label: "Feasibility", value: "Medium", trend: "up", detail: "Technical feasibility undetermined" },
          { label: "India Market Fit", value: "Medium", trend: "up", detail: "Indian market potential unclear" },
          { label: "Time to MVP", value: "3-6 months", trend: "up", detail: "Standard development timeline" },
        ],
        bigPlayers: [
          { name: "Unknown", strength: "Established presence", weakness: "To be researched" },
        ],
        failureRisks: ["Market validation needed", "Competition level unclear", "Revenue model unproven", "Team capability unknown"],
        founderChecklist: ["Conduct customer interviews", "Build a landing page to test demand", "Research competitors deeply", "Define unit economics", "Find a co-founder or advisor"],
        monetization: ["Freemium model", "Subscription tiers", "Transaction-based fees"],
        strengths: ["Addresses a stated problem", "Has a defined target audience", "Feasible concept"],
        weaknesses: ["Needs more market validation", "Competition level unclear", "Revenue model needs refinement"],
        recommendations: ["Conduct deeper market research", "Interview potential customers", "Build a lean prototype"],
      };
    }

    // Normalize verdict: AI may return "PASS" instead of "CONDITIONAL PASS"
    if (analysisData.verdict === "PASS") {
      analysisData.verdict = "CONDITIONAL PASS";
      analysisData.verdictColor = "#FF8A3D";
    }

    // Generate a catchy app name if AI didn't provide one or just repeated the idea
    if (!userAppName) {
      const aiName = (analysisData.appName || "").trim();
      const ideaLower = idea.toLowerCase().trim();
      const aiNameLower = aiName.toLowerCase();
      // Check if AI name is missing, too long, or just the raw idea text
      const isBadName = !aiName || aiName.length > 20 || aiNameLower === ideaLower || aiName.split(" ").length > 3;
      if (isBadName) {
        // Generate a short name: take key words from the idea, capitalize, join
        const stopWords = new Set(["a","an","the","for","to","of","in","on","and","or","is","it","that","with","as","by","this","from","at","app","platform","tool","system","service","website","build","create","make"]);
        const words = idea.split(/\s+/).filter(w => !stopWords.has(w.toLowerCase()) && w.length > 2).slice(0, 2);
        const generated = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
        analysisData.appName = generated || idea.split(" ").slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
      }
    }

    // Sanitize trend values
    const validTrends = ["up", "down"];
    const sanitizedMetrics = (analysisData.metrics || []).map(
      (m: {
        label?: string;
        value?: string;
        trend?: string;
        detail?: string;
      }) => ({
        ...m,
        trend: validTrends.includes(m.trend || "") ? m.trend : "up",
      }),
    );

    const analysis = await Analysis.create({
      userId,
      idea,
      appName: userAppName || analysisData.appName || idea.split(" ").slice(0, 3).join(" "),
      target,
      problem,
      revenue: revenue || "",
      competitors: competitors || "",
      category: category || "Other",
      score: analysisData.score,
      verdict: analysisData.verdict,
      verdictColor: analysisData.verdictColor,
      summary: analysisData.summary,
      metrics: sanitizedMetrics,
      bigPlayers: analysisData.bigPlayers || [],
      failureRisks: analysisData.failureRisks || [],
      founderChecklist: analysisData.founderChecklist || [],
      monetization: analysisData.monetization || [],
      strengths: analysisData.strengths,
      weaknesses: analysisData.weaknesses,
      recommendations: analysisData.recommendations,
      followUpMessages: [],
    });

    return NextResponse.json({
      id: analysis._id.toString(),
      appName: analysis.appName,
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
