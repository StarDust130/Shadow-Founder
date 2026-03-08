import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { connectDB } from "@/lib/mongodb";
import { Analysis } from "@/lib/models/Analysis";
import { Build } from "@/lib/models/Build";
import { User } from "@/lib/models/User";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const groq = new Groq({ apiKey: process.env.QROQ_API_KEY! });

const SYSTEM_PROMPT = `You are an elite full-stack developer and UI/UX designer. Given a startup idea and its analysis, generate a complete, visually stunning MVP codebase.

Generate a working Next.js 14 project with TypeScript and Tailwind CSS. The code must be production-quality, clean, well-structured, and visually impressive.

You MUST respond with ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "files": [
    {
      "path": "src/app/page.tsx",
      "content": "<full file content>",
      "lang": "typescript"
    }
  ]
}

Requirements:
- Generate 8-15 files for a realistic MVP
- Include: layout, main page, at least 2-3 feature pages, API routes, components, types, config files
- Use modern React patterns (Server Components, Client Components where needed)
- Include package.json with all dependencies
- Include tailwind.config.ts and tsconfig.json
- Use EXCEPTIONAL UI design with Tailwind CSS:
  * Modern color palette with gradients (not plain gray/white)
  * Smooth hover effects, focus rings, and micro-interactions
  * Beautiful card layouts with shadows and rounded corners
  * Professional typography hierarchy (font sizes, weights, spacing)
  * Responsive design that looks great on mobile and desktop
  * Use backdrop-blur, glass-morphism, or neumorphism where appropriate
  * Include subtle animations with CSS transitions
  * Well-designed buttons with hover/active states
  * Proper spacing system (consistent padding/margins)
- Include proper TypeScript types
- Include at least one API route
- Make it functional and demonstrable

IMPORTANT — LANDING PAGE PREVIEW:
You MUST also include a file with path "preview.html" — a single standalone HTML file (with all CSS and JS inlined) that serves as a stunning, world-class landing page for the startup. This preview.html must:
- Be a complete self-contained HTML document with inline <style> and <script> tags
- NOT use any external CDN links, imports, or dependencies
- Have a VISUALLY STUNNING modern design that looks like a real SaaS landing page:
  * Rich gradient backgrounds (e.g. from-purple-600 via-blue-500 to-cyan-400 style)
  * Floating shapes, subtle SVG patterns, or animated background elements
  * Glass-morphism cards with backdrop-blur effects
  * Smooth CSS animations (fade-in, slide-up on scroll, hover transforms)
  * Professional shadow system (multiple shadow layers for depth)
  * Modern typography with large bold headlines and clean body text
  * Consistent color scheme using CSS custom properties
  * Well-designed CTA buttons with gradient backgrounds and hover effects
- Include these well-designed sections:
  * Navigation bar with logo and smooth-scroll links
  * Hero: bold headline, compelling subtitle, CTA button, optional hero illustration/graphic using CSS shapes
  * Features/Benefits: 3-6 feature cards with icons (use Unicode/emoji icons) and descriptions
  * Social proof: stats counters (e.g. "10K+ users", "99.9% uptime") or testimonial quotes
  * Pricing: at least 2 tiers with highlighted recommended plan, feature comparison
  * CTA section with email signup form
  * Footer with links and branding
- Use CSS smooth scroll, intersection observer for scroll animations, and responsive breakpoints
- Must look like a REAL professional product page, not a template

DO NOT include any text outside the JSON. Only output the JSON object.`;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { analysisId } = body;

    if (!analysisId) {
      return NextResponse.json(
        { error: "Missing required field: analysisId" },
        { status: 400 },
      );
    }

    await connectDB();

    // Check user plan limits
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.plan === "free" && user.buildsUsed >= user.maxBuilds) {
      return NextResponse.json(
        {
          error: "BUILD_LIMIT_REACHED",
          message:
            "Free plan allows only 1 MVP build. Upgrade to Pro for unlimited builds.",
        },
        { status: 403 },
      );
    }

    // Check if build already exists for this analysis
    const existingBuild = await Build.findOne({ analysisId, userId });
    if (existingBuild && existingBuild.status === "READY") {
      return NextResponse.json({
        id: existingBuild._id.toString(),
        files: existingBuild.files,
        status: existingBuild.status,
        techStack: existingBuild.techStack,
        cached: true,
      });
    }

    const analysis = await Analysis.findById(analysisId);
    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 },
      );
    }

    const userPrompt = `Build an MVP for this startup:

**Idea:** ${analysis.idea}
**Target Audience:** ${analysis.target}
**Problem:** ${analysis.problem}
${analysis.revenue ? `**Revenue Model:** ${analysis.revenue}` : ""}
**Category:** ${analysis.category || "SaaS"}

**AI Analysis Summary:** ${analysis.summary}
**Key Strengths:** ${analysis.strengths.join(", ")}
**Recommendations:** ${analysis.recommendations.join(", ")}

Generate a complete Next.js MVP codebase that demonstrates this idea. Focus on the core value proposition. Make it visually impressive with a modern UI.`;

    let rawContent: string;

    // Try Gemini first, fall back to Groq if it fails
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent([SYSTEM_PROMPT, userPrompt]);
      rawContent = result.response.text();
    } catch (geminiError) {
      console.warn("Gemini failed, falling back to Groq:", geminiError);
      const groqResult = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 8000,
      });
      rawContent = groqResult.choices[0]?.message?.content || "";
    }

    let generatedFiles;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      const parsed = JSON.parse(jsonMatch[0]);
      generatedFiles = parsed.files;
      if (!Array.isArray(generatedFiles) || generatedFiles.length === 0) {
        throw new Error("No files generated");
      }
    } catch {
      // Fallback minimal project
      generatedFiles = [
        {
          path: "package.json",
          content: JSON.stringify(
            {
              name: analysis.idea
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .slice(0, 30),
              version: "0.1.0",
              scripts: {
                dev: "next dev",
                build: "next build",
                start: "next start",
              },
              dependencies: {
                next: "14.2.0",
                react: "^18",
                "react-dom": "^18",
                typescript: "^5",
                tailwindcss: "^3.4",
              },
            },
            null,
            2,
          ),
          lang: "json",
        },
        {
          path: "src/app/layout.tsx",
          content: `export default function RootLayout({ children }: { children: React.ReactNode }) {\n  return <html lang="en"><body>{children}</body></html>;\n}`,
          lang: "typescript",
        },
        {
          path: "src/app/page.tsx",
          content: `export default function Home() {\n  return (\n    <main className="min-h-screen flex items-center justify-center bg-gray-50">\n      <div className="text-center">\n        <h1 className="text-4xl font-bold mb-4">${analysis.idea}</h1>\n        <p className="text-gray-600">${analysis.summary}</p>\n      </div>\n    </main>\n  );\n}`,
          lang: "typescript",
        },
      ];
    }

    // Add line counts
    const filesWithLines = generatedFiles.map(
      (f: { path: string; content: string; lang: string }) => ({
        ...f,
        lines: f.content.split("\n").length,
      }),
    );

    const techStack = ["Next.js 14", "TypeScript", "Tailwind CSS", "React 18"];

    const build = await Build.create({
      userId,
      analysisId,
      ideaTitle: analysis.idea,
      techStack,
      files: filesWithLines,
      status: "READY",
    });

    // Increment builds used
    await User.findOneAndUpdate(
      { clerkId: userId },
      { $inc: { buildsUsed: 1 } },
    );

    return NextResponse.json({
      id: build._id.toString(),
      files: filesWithLines,
      status: "READY",
      techStack,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate MVP. Please try again." },
      { status: 500 },
    );
  }
}
