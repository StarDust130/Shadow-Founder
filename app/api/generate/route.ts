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

function buildFallbackPreview(idea: string, summary: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${idea}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--primary:#6366f1;--accent:#f59e0b;--dark:#0f172a;--light:#f8fafc}
body{font-family:system-ui,-apple-system,sans-serif;color:var(--dark);scroll-behavior:smooth}
nav{position:fixed;top:0;width:100%;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center;backdrop-filter:blur(12px);background:rgba(255,255,255,0.8);border-bottom:1px solid rgba(0,0,0,0.05);z-index:100}
nav .logo{font-size:1.25rem;font-weight:900;background:linear-gradient(135deg,var(--primary),var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
nav .cta{padding:0.5rem 1.5rem;background:var(--primary);color:#fff;border:none;border-radius:999px;font-weight:700;cursor:pointer;transition:transform 0.2s}
nav .cta:hover{transform:scale(1.05)}
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:6rem 2rem 4rem;background:linear-gradient(135deg,#eef2ff,#fef3c7,#ede9fe);position:relative;overflow:hidden}
.hero h1{font-size:clamp(2.5rem,8vw,5rem);font-weight:900;line-height:1.1;max-width:800px;background:linear-gradient(135deg,var(--primary),#8b5cf6,var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{margin-top:1.5rem;font-size:1.25rem;color:#475569;max-width:600px}
.hero .btns{display:flex;gap:1rem;margin-top:2rem;flex-wrap:wrap;justify-content:center}
.hero .btns a{padding:0.875rem 2rem;border-radius:999px;font-weight:700;text-decoration:none;transition:transform 0.2s}
.hero .btns .primary{background:var(--primary);color:#fff}
.hero .btns .secondary{border:2px solid var(--primary);color:var(--primary)}
.hero .btns a:hover{transform:translateY(-2px)}
section{padding:5rem 2rem}
.features{background:#fff}
.features h2{text-align:center;font-size:2.5rem;font-weight:900;margin-bottom:3rem}
.features .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-width:1000px;margin:0 auto}
.features .card{padding:2rem;border-radius:1rem;background:var(--light);border:1px solid rgba(0,0,0,0.06);transition:transform 0.2s,box-shadow 0.2s}
.features .card:hover{transform:translateY(-4px);box-shadow:0 20px 40px rgba(0,0,0,0.08)}
.features .card .icon{font-size:2rem;margin-bottom:1rem}
.features .card h3{font-size:1.25rem;font-weight:800;margin-bottom:0.5rem}
.features .card p{color:#64748b;line-height:1.6}
.stats{background:var(--dark);color:#fff;text-align:center}
.stats h2{font-size:2.5rem;font-weight:900;margin-bottom:3rem}
.stats .row{display:flex;justify-content:center;gap:4rem;flex-wrap:wrap}
.stats .stat .num{font-size:3rem;font-weight:900;background:linear-gradient(135deg,var(--accent),var(--primary));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.stats .stat .label{margin-top:0.5rem;color:#94a3b8;font-weight:600}
.pricing{background:#fff}
.pricing h2{text-align:center;font-size:2.5rem;font-weight:900;margin-bottom:3rem}
.pricing .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;max-width:900px;margin:0 auto}
.pricing .plan{padding:2.5rem;border-radius:1rem;border:2px solid rgba(0,0,0,0.06);text-align:center;transition:transform 0.2s}
.pricing .plan:hover{transform:translateY(-4px)}
.pricing .plan.popular{border-color:var(--primary);position:relative}
.pricing .plan.popular::before{content:"Most Popular";position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;padding:0.25rem 1rem;border-radius:999px;font-size:0.75rem;font-weight:700}
.pricing .plan .price{font-size:3rem;font-weight:900;margin:1rem 0}
.pricing .plan .price span{font-size:1rem;color:#94a3b8}
.pricing .plan ul{list-style:none;margin:1.5rem 0;text-align:left}
.pricing .plan li{padding:0.5rem 0;color:#475569}
.pricing .plan li::before{content:"\\2713 ";color:var(--primary);font-weight:700}
.pricing .plan .btn{display:inline-block;padding:0.75rem 2rem;border-radius:999px;font-weight:700;text-decoration:none;transition:transform 0.2s;background:var(--primary);color:#fff}
.pricing .plan .btn:hover{transform:scale(1.05)}
.cta-section{background:linear-gradient(135deg,var(--primary),#8b5cf6);color:#fff;text-align:center;padding:5rem 2rem}
.cta-section h2{font-size:2.5rem;font-weight:900;margin-bottom:1rem}
.cta-section p{font-size:1.125rem;opacity:0.9;margin-bottom:2rem}
.cta-section form{display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap}
.cta-section input{padding:0.875rem 1.5rem;border-radius:999px;border:none;font-size:1rem;width:300px;max-width:100%}
.cta-section button{padding:0.875rem 2rem;border-radius:999px;background:var(--accent);color:var(--dark);font-weight:700;border:none;cursor:pointer;transition:transform 0.2s}
.cta-section button:hover{transform:scale(1.05)}
footer{background:var(--dark);color:#94a3b8;text-align:center;padding:3rem 2rem;font-size:0.875rem}
footer a{color:var(--accent);text-decoration:none}
.fade-in{opacity:0;transform:translateY(20px);transition:opacity 0.6s,transform 0.6s}
.fade-in.visible{opacity:1;transform:translateY(0)}
</style>
</head>
<body>
<nav><div class="logo">${idea}</div><button class="cta" onclick="document.querySelector('.cta-section').scrollIntoView({behavior:'smooth'})">Get Started</button></nav>
<section class="hero"><h1>${idea}</h1><p>${summary || "The next-generation platform built for the future."}</p><div class="btns"><a href="#features" class="primary">Explore Features</a><a href="#pricing" class="secondary">View Pricing</a></div></section>
<section class="features" id="features"><h2>Why Choose Us</h2><div class="grid"><div class="card fade-in"><div class="icon">⚡</div><h3>Lightning Fast</h3><p>Built for speed and performance from the ground up.</p></div><div class="card fade-in"><div class="icon">🛡️</div><h3>Secure by Default</h3><p>Enterprise-grade security built into every layer.</p></div><div class="card fade-in"><div class="icon">🚀</div><h3>Scale Effortlessly</h3><p>Grows with your business without breaking a sweat.</p></div></div></section>
<section class="stats"><h2>Trusted by Thousands</h2><div class="row"><div class="stat fade-in"><div class="num">10,000+</div><div class="label">Active Users</div></div><div class="stat fade-in"><div class="num">99.9%</div><div class="label">Uptime</div></div><div class="stat fade-in"><div class="num">4.9★</div><div class="label">Rating</div></div></div></section>
<section class="pricing" id="pricing"><h2>Simple Pricing</h2><div class="grid"><div class="plan fade-in"><h3>Starter</h3><div class="price">Free</div><ul><li>Up to 3 projects</li><li>Basic analytics</li><li>Community support</li></ul><a href="#" class="btn">Get Started</a></div><div class="plan popular fade-in"><h3>Pro</h3><div class="price">$29<span>/mo</span></div><ul><li>Unlimited projects</li><li>Advanced analytics</li><li>Priority support</li><li>Custom integrations</li></ul><a href="#" class="btn">Upgrade</a></div><div class="plan fade-in"><h3>Enterprise</h3><div class="price">$99<span>/mo</span></div><ul><li>Everything in Pro</li><li>Dedicated account manager</li><li>SLA guarantee</li><li>Custom deployment</li></ul><a href="#" class="btn">Contact Us</a></div></div></section>
<section class="cta-section"><h2>Ready to Get Started?</h2><p>Join thousands of happy customers today.</p><form onsubmit="event.preventDefault();alert('Thanks for signing up!')"><input type="email" placeholder="Enter your email" required><button type="submit">Sign Up Free</button></form></section>
<footer><p>&copy; 2026 ${idea}. All rights reserved. | <a href="#">Privacy</a> | <a href="#">Terms</a></p></footer>
<script>
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')})},{threshold:0.1});
document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));
</script>
</body>
</html>`;
}

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
      // Ensure preview.html exists — generate a fallback if AI omitted it
      const hasPreview = generatedFiles.some(
        (f: { path: string }) => f.path === "preview.html",
      );
      if (!hasPreview) {
        generatedFiles.push({
          path: "preview.html",
          content: buildFallbackPreview(analysis.idea, analysis.summary),
          lang: "html",
        });
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
        {
          path: "preview.html",
          content: buildFallbackPreview(analysis.idea, analysis.summary),
          lang: "html",
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
