import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { connectDB } from "@/lib/mongodb";
import { Analysis } from "@/lib/models/Analysis";
import { Build } from "@/lib/models/Build";
import { User } from "@/lib/models/User";

const groq = new Groq({ apiKey: process.env.QROQ_API_KEY! });

const SYSTEM_PROMPT = `You are a world-class full-stack developer and award-winning UI/UX designer in 2026. You build breathtaking, modern web applications that look like they belong in a design portfolio.

Given a startup idea and its analysis, generate a STUNNING MVP codebase that would impress any investor or user at first glance.

Generate a working Next.js 14 project with TypeScript and Tailwind CSS. The code must be production-quality, clean, well-structured, and VISUALLY BREATHTAKING.

You MUST respond with ONLY valid JSON (no markdown, no code blocks, no explanations) in this exact format:
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
- Code MUST compile — no syntax errors, no missing imports

UI DESIGN — THIS IS CRITICAL. Make it look like a top-tier 2026 SaaS product:
  * Use a bold, modern color system — NOT boring gray/white. Use vibrant accent colors, rich gradients (mesh gradients, radial gradients, multi-stop linear gradients)
  * Glassmorphism: backdrop-blur-xl, bg-white/10, border-white/20 transparent cards
  * Depth & layering: multi-level box shadows (shadow-xl shadow-2xl), overlapping elements, z-index layers
  * Micro-interactions: hover:scale-105, hover:-translate-y-1, hover:shadow-2xl, group-hover transitions
  * Typography: Large bold hero text (text-5xl md:text-7xl font-black), clean body text, proper hierarchy
  * Spacing: Generous whitespace, consistent padding (p-8, p-12), gap-6 gap-8
  * Modern patterns: Bento grid layouts, floating elements, pill-shaped badges, gradient text (bg-clip-text text-transparent)
  * Animated gradient backgrounds using CSS @keyframes
  * Use decorative SVG blobs or circles as background accents
  * Responsive: mobile-first, looks incredible on all screen sizes
  * Professional button styles: rounded-full/rounded-2xl, px-8 py-4, gradient backgrounds, hover transforms
  * Subtle grid/dot patterns as backgrounds for sections
  * Use emoji or Unicode symbols for icons (💡 🚀 ⚡ 🎯 ✨ 🔥 📊 🛡️)

CRITICAL — LANDING PAGE PREVIEW FILE:
You MUST include a file with the exact path "preview.html". This is the MOST IMPORTANT file. This is shown to the user as a live preview of their startup landing page.

The preview.html MUST be:
- A COMPLETE standalone HTML document with ALL CSS and JS inlined in <style> and <script> tags
- ZERO external dependencies — no CDN links, no imports, no external fonts, no external scripts
- A WORLD-CLASS landing page that looks like it was built by a top design agency
- Must be fully functional and responsive

The preview.html MUST include these sections with STUNNING design:
1. NAVIGATION: Fixed/sticky navbar with logo text, smooth-scroll links, gradient CTA button
2. HERO SECTION: 
   - Massive bold headline (80px+) with gradient text effect
   - Compelling subtitle that sells the product
   - Two CTA buttons (primary gradient + secondary outline)
   - Animated background with CSS gradient animation or floating shapes
   - Optional: Mockup/illustration using pure CSS shapes
3. FEATURES SECTION:
   - 3-6 feature cards in a grid layout
   - Each card: icon (emoji/unicode), title, description
   - Cards with glassmorphism or elevated shadow effect
   - Hover animations (transform, shadow change)
4. SOCIAL PROOF:
   - Stats counters (e.g. "10,000+ Users", "99.9% Uptime", "4.9★ Rating")
   - Optionally: short testimonial quotes
5. PRICING SECTION:
   - 2-3 tier pricing cards
   - Most popular tier highlighted with badge + border + scale
   - Feature lists with checkmarks (✓)
   - CTA buttons on each card
6. CTA / NEWSLETTER:
   - Bold headline asking user to sign up
   - Email input + submit button styled beautifully
   - Background with gradient or pattern
7. FOOTER:
   - Links, branding, copyright
   - Clean minimal design

CSS techniques to use in preview.html:
- @keyframes for animated gradient backgrounds
- CSS custom properties (--primary, --accent, etc.)
- backdrop-filter: blur() for glass effect
- Intersection Observer for scroll-triggered fade-in animations
- CSS Grid and Flexbox for layouts
- @media queries for responsive design
- Smooth scrolling (scroll-behavior: smooth)
- CSS transitions on hover states (transform, box-shadow, opacity)
- Linear-gradient, radial-gradient for backgrounds
- Multiple box-shadows for depth (0 4px 6px rgba(), 0 20px 50px rgba())

The preview.html should make users say "WOW" when they see it. It should look like a real, polished SaaS landing page, NOT a template or homework project.

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

    // Try openai/gpt-oss-120b via Groq first, fall back to llama if it fails
    try {
      const result = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 1,
        max_completion_tokens: 8192,
        top_p: 1,
      });
      rawContent = result.choices[0]?.message?.content || "";
    } catch (primaryError) {
      console.warn("gpt-oss-120b failed, falling back to llama:", primaryError);
      const fallbackResult = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 8000,
      });
      rawContent = fallbackResult.choices[0]?.message?.content || "";
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
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate MVP: ${message}` },
      { status: 500 },
    );
  }
}
