import { auth } from "@clerk/nextjs/server";
import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { connectDB } from "@/lib/mongodb";
import { Analysis } from "@/lib/models/Analysis";

const groq = createGroq({ apiKey: process.env.QROQ_API_KEY });

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { id } = await params;
    const body = await req.json();
    // useChat v6 sends { messages: [...] } with parts arrays, not content strings
    const messages = body.messages || [];
    const lastUserMessage = messages
      .filter((m: { role: string }) => m.role === "user")
      .pop();
    // AI SDK v6 UIMessage format uses parts array; fall back to content for legacy
    const message =
      lastUserMessage?.parts
        ?.filter((p: { type: string }) => p.type === "text")
        .map((p: { text: string }) => p.text)
        .join("") ||
      lastUserMessage?.content ||
      body.message;

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();

    const analysis = await Analysis.findOne({ _id: id, userId });
    if (!analysis) {
      return new Response(JSON.stringify({ error: "Analysis not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build conversation history for context
    const conversationHistory = (analysis.followUpMessages || []).map(
      (msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }),
    );

    const systemPrompt = `You are Shadow Founder AI — an enthusiastic, knowledgeable startup advisor. You speak like a friendly mentor who genuinely wants to help founders succeed.

Context about this startup:
- Idea: ${analysis.idea}
- Target: ${analysis.target}
- Problem: ${analysis.problem}
- Score: ${analysis.score}/100 (${analysis.verdict})
- Summary: ${analysis.summary}
- Strengths: ${analysis.strengths.join(", ")}
- Weaknesses: ${analysis.weaknesses.join(", ")}
- Recommendations: ${analysis.recommendations.join(", ")}

RESPONSE STYLE RULES:
- Be conversational and encouraging, not robotic
- Use short paragraphs (2-3 sentences max each)
- When listing things, keep each point to 1 sentence
- Use emojis sparingly but naturally (1-2 per response)
- Give specific, actionable advice with real examples
- If asked about competitors, name real companies and explain differences
- If asked about pivots, suggest 2-3 concrete alternatives with reasoning
- Never start with "I wouldn't say" or overly hedging language
- Be direct and confident in your advice
- Keep responses under 200 words unless the question demands more detail
- Format headings with ** bold ** markers, not markdown headers`;

    // Save user message immediately
    analysis.followUpMessages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });
    await analysis.save();

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages: [
        ...conversationHistory,
        { role: "user" as const, content: message },
      ],
      temperature: 0.7,
      async onFinish({ text }) {
        // Save AI response after streaming completes
        await connectDB();
        const doc = await Analysis.findById(id);
        if (doc) {
          doc.followUpMessages.push({
            role: "assistant",
            content: text,
            timestamp: new Date(),
          });
          await doc.save();
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process message. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
