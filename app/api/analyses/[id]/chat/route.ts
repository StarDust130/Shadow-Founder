import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Groq } from "groq-sdk";
import { connectDB } from "@/lib/mongodb";
import { Analysis } from "@/lib/models/Analysis";

const groq = new Groq({ apiKey: process.env.QROQ_API_KEY });

export async function POST(
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
    const { message } = body;

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const analysis = await Analysis.findOne({ _id: id, userId });
    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 },
      );
    }

    // Build conversation history for context
    const conversationHistory = (analysis.followUpMessages || []).map(
      (msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }),
    );

    const systemPrompt = `You are Shadow Founder AI — a startup advisor continuing a conversation about a startup idea.

Here's the original analysis context:
- Idea: ${analysis.idea}
- Target: ${analysis.target}
- Problem: ${analysis.problem}
- Score: ${analysis.score}/100 (${analysis.verdict})
- Summary: ${analysis.summary}
- Strengths: ${analysis.strengths.join(", ")}
- Weaknesses: ${analysis.weaknesses.join(", ")}
- Recommendations: ${analysis.recommendations.join(", ")}

Provide thoughtful, actionable advice. If asked about pivots, suggest specific alternative approaches with reasoning. If asked about competitors, provide real market insights. Be concise but thorough. Use bullet points for clarity when appropriate.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_completion_tokens: 1024,
    });

    const aiResponse =
      completion.choices[0]?.message?.content ||
      "I couldn't generate a response. Please try again.";

    // Save both messages to the analysis
    analysis.followUpMessages.push(
      { role: "user", content: message, timestamp: new Date() },
      { role: "assistant", content: aiResponse, timestamp: new Date() },
    );
    await analysis.save();

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message. Please try again." },
      { status: 500 },
    );
  }
}
