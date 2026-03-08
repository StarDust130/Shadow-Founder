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

CRITICAL — LANDING PAGE PREVIEW FILE (preview.html):
You MUST include a file at path "preview.html". This is the MOST IMPORTANT file — it's shown as a live preview.

The preview.html MUST be:
- A COMPLETE standalone HTML document with ALL CSS and JS inlined
- ZERO external dependencies — no CDN links, no imports, no external fonts
- Use the startup's APP NAME (provided in the prompt) as the brand name throughout

PREVIEW DESIGN — NEOBRUTALISM + MODERN HYBRID STYLE:
Use a bold, striking Neobrutalism design with modern touches:
- Thick black borders (2-4px solid #1A1A1A) on cards, buttons, sections
- Hard box shadows (4px 4px 0 #1A1A1A, 6px 6px 0 <accent>)
- Bold uppercase typography with tight letter-spacing  
- Vibrant accent colors (pick ONE: #FF6803 orange, #6366F1 indigo, #22C55E green, #8B5CF6 purple)
- White/cream backgrounds with colored accent cards
- Rounded corners (border-radius: 16px-24px) 
- Hover effects: cards lift up (translateY(-4px)) and shadow grows
- Large hero text (clamp(2rem, 5vw, 3.5rem)) — NOT too massive, readable and clean
- Professional body text (14-16px), NOT oversized
- Clean whitespace and good spacing

PREVIEW SECTIONS (7 sections, all well-designed):
1. NAV: Sticky top bar with app name logo (bold uppercase) + "Get Started" CTA button with thick border
2. HERO: Bold headline (not too big — max 3.5rem), subtitle (1 line), 2 CTA buttons, animated gradient background
3. FEATURES: 3-4 cards in grid, each with emoji icon + title + short description, neobrutalism card style
4. SOCIAL PROOF: 3 stat counters in a row (e.g. "10K+ Users", "99.9% Uptime", "4.9★ Rating")
5. PRICING: 2-3 tier cards, popular one highlighted with accent border + scale, checkmark feature lists
6. CTA: Sign-up section with email input + button, bold headline
7. FOOTER: Clean minimal footer with copyright + links

TEXT CONTENT RULES:
- Use the app name (not the raw idea description) as the brand
- Write REAL compelling copy that matches the startup idea
- Headlines should be punchy, 3-7 words max
- Descriptions should be 1-2 short sentences, clear and professional
- NO filler text, NO lorem ipsum, NO "coming soon"
- Pricing should be realistic ($0/Free, $29/mo, $99/mo)

CSS RULES:
- Use CSS custom properties for the color palette
- @keyframes for subtle animated gradient on hero background
- Scroll-triggered fade-in animations via IntersectionObserver
- Responsive @media queries (mobile-first, looks great on all sizes)
- Smooth scrolling (scroll-behavior: smooth)
- Keep text sizes reasonable: hero h1 max 3.5rem, body 0.875-1rem, small text 0.75rem
- Clean typography hierarchy — h1 > h2 > h3 > p

DO NOT include any text outside the JSON. Only output the JSON object.`;

function buildFallbackPreview(appName: string, idea: string, summary: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${appName}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--primary:#FF6803;--accent:#1A1A1A;--light:#FFFBF5;--dark:#1A1A1A;--shadow:4px 4px 0 #1A1A1A}
body{font-family:system-ui,-apple-system,sans-serif;color:var(--dark);scroll-behavior:smooth;background:var(--light)}
nav{position:fixed;top:0;width:100%;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center;background:var(--light);border-bottom:3px solid var(--dark);z-index:100}
nav .logo{font-size:1.1rem;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;color:var(--dark)}
nav .cta{padding:0.5rem 1.5rem;background:var(--primary);color:#fff;border:2px solid var(--dark);border-radius:12px;font-weight:800;font-size:0.8rem;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;box-shadow:var(--shadow);text-transform:uppercase;letter-spacing:0.05em}
nav .cta:hover{transform:translateY(-2px);box-shadow:6px 6px 0 var(--dark)}
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:6rem 2rem 4rem;background:linear-gradient(135deg,#FFFBF5,#FFF0E0,#FFF5EB);position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:20%;right:10%;width:200px;height:200px;border-radius:50%;background:var(--primary);opacity:0.06;animation:float 6s ease-in-out infinite}
.hero h1{font-size:clamp(2rem,5vw,3.5rem);font-weight:900;line-height:1.1;max-width:700px;color:var(--dark);text-transform:uppercase;letter-spacing:-0.03em}
.hero p{margin-top:1rem;font-size:1rem;color:#64748b;max-width:500px;line-height:1.6}
.hero .btns{display:flex;gap:1rem;margin-top:2rem;flex-wrap:wrap;justify-content:center}
.hero .btns a{padding:0.875rem 2rem;border-radius:14px;font-weight:800;text-decoration:none;transition:transform 0.2s,box-shadow 0.2s;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;border:2px solid var(--dark)}
.hero .btns .primary{background:var(--primary);color:#fff;box-shadow:var(--shadow)}
.hero .btns .secondary{background:#fff;color:var(--dark);box-shadow:var(--shadow)}
.hero .btns a:hover{transform:translateY(-3px);box-shadow:6px 6px 0 var(--dark)}
section{padding:5rem 2rem}
.features{background:#fff;border-top:3px solid var(--dark);border-bottom:3px solid var(--dark)}
.features h2{text-align:center;font-size:1.8rem;font-weight:900;margin-bottom:2.5rem;text-transform:uppercase;letter-spacing:-0.02em}
.features .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;max-width:900px;margin:0 auto}
.features .card{padding:2rem;border-radius:18px;background:var(--light);border:2px solid var(--dark);box-shadow:var(--shadow);transition:transform 0.2s,box-shadow 0.2s}
.features .card:hover{transform:translateY(-4px);box-shadow:6px 6px 0 var(--primary)}
.features .card .icon{font-size:1.8rem;margin-bottom:0.75rem}
.features .card h3{font-size:1rem;font-weight:800;margin-bottom:0.5rem;text-transform:uppercase}
.features .card p{color:#64748b;line-height:1.5;font-size:0.875rem}
.stats{background:var(--dark);color:#fff;text-align:center}
.stats h2{font-size:1.8rem;font-weight:900;margin-bottom:2.5rem;text-transform:uppercase}
.stats .row{display:flex;justify-content:center;gap:3rem;flex-wrap:wrap}
.stats .stat .num{font-size:2.5rem;font-weight:900;color:var(--primary)}
.stats .stat .label{margin-top:0.25rem;color:#94a3b8;font-weight:700;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em}
.pricing{background:#fff}
.pricing h2{text-align:center;font-size:1.8rem;font-weight:900;margin-bottom:2.5rem;text-transform:uppercase}
.pricing .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem;max-width:800px;margin:0 auto}
.pricing .plan{padding:2rem;border-radius:18px;border:2px solid var(--dark);text-align:center;transition:transform 0.2s;box-shadow:var(--shadow);background:var(--light)}
.pricing .plan:hover{transform:translateY(-4px)}
.pricing .plan.popular{border-color:var(--primary);box-shadow:6px 6px 0 var(--primary);position:relative;transform:scale(1.03)}
.pricing .plan.popular::before{content:"Popular";position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;padding:0.2rem 1rem;border-radius:99px;font-size:0.7rem;font-weight:800;border:2px solid var(--dark);text-transform:uppercase}
.pricing .plan .price{font-size:2.5rem;font-weight:900;margin:0.75rem 0}
.pricing .plan .price span{font-size:0.85rem;color:#94a3b8}
.pricing .plan ul{list-style:none;margin:1.5rem 0;text-align:left}
.pricing .plan li{padding:0.4rem 0;color:#475569;font-size:0.875rem}
.pricing .plan li::before{content:"\\2713 ";color:var(--primary);font-weight:700}
.pricing .plan .btn{display:inline-block;padding:0.75rem 2rem;border-radius:14px;font-weight:800;text-decoration:none;transition:transform 0.2s;background:var(--primary);color:#fff;border:2px solid var(--dark);box-shadow:3px 3px 0 var(--dark);font-size:0.8rem;text-transform:uppercase}
.pricing .plan .btn:hover{transform:translateY(-2px);box-shadow:5px 5px 0 var(--dark)}
.cta-section{background:var(--dark);color:#fff;text-align:center;padding:5rem 2rem;border-top:3px solid var(--primary)}
.cta-section h2{font-size:1.8rem;font-weight:900;margin-bottom:0.75rem;text-transform:uppercase}
.cta-section p{font-size:0.95rem;opacity:0.7;margin-bottom:2rem}
.cta-section form{display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap}
.cta-section input{padding:0.75rem 1.5rem;border-radius:14px;border:2px solid #333;font-size:0.9rem;width:280px;max-width:100%;background:#222;color:#fff}
.cta-section button{padding:0.75rem 2rem;border-radius:14px;background:var(--primary);color:#fff;font-weight:800;border:2px solid var(--primary);cursor:pointer;transition:transform 0.2s;font-size:0.85rem;text-transform:uppercase}
.cta-section button:hover{transform:scale(1.05)}
footer{background:var(--dark);color:#94a3b8;text-align:center;padding:2.5rem 2rem;font-size:0.8rem;border-top:1px solid #333}
footer a{color:var(--primary);text-decoration:none;font-weight:700}
.fade-in{opacity:0;transform:translateY(20px);transition:opacity 0.6s,transform 0.6s}
.fade-in.visible{opacity:1;transform:translateY(0)}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
@media(max-width:640px){.hero h1{font-size:2rem}.stats .row{gap:2rem}.pricing .plan.popular{transform:scale(1)}}
</style>
</head>
<body>
<nav><div class="logo">${appName}</div><button class="cta" onclick="document.querySelector('.cta-section').scrollIntoView({behavior:'smooth'})">Get Started</button></nav>
<section class="hero"><h1>${appName}</h1><p>${summary || "The next-generation platform built for the future."}</p><div class="btns"><a href="#features" class="primary">Explore Features</a><a href="#pricing" class="secondary">View Pricing</a></div></section>
<section class="features" id="features"><h2>Why Choose ${appName}</h2><div class="grid"><div class="card fade-in"><div class="icon">\u26A1</div><h3>Lightning Fast</h3><p>Built for speed and performance from the ground up.</p></div><div class="card fade-in"><div class="icon">\u{1F6E1}\uFE0F</div><h3>Secure by Default</h3><p>Enterprise-grade security built into every layer.</p></div><div class="card fade-in"><div class="icon">\u{1F680}</div><h3>Scale Effortlessly</h3><p>Grows with your business without breaking a sweat.</p></div></div></section>
<section class="stats"><h2>Trusted by Thousands</h2><div class="row"><div class="stat fade-in"><div class="num">10,000+</div><div class="label">Active Users</div></div><div class="stat fade-in"><div class="num">99.9%</div><div class="label">Uptime</div></div><div class="stat fade-in"><div class="num">4.9\u2605</div><div class="label">Rating</div></div></div></section>
<section class="pricing" id="pricing"><h2>Simple Pricing</h2><div class="grid"><div class="plan fade-in"><h3>Starter</h3><div class="price">Free</div><ul><li>Up to 3 projects</li><li>Basic analytics</li><li>Community support</li></ul><a href="#" class="btn">Get Started</a></div><div class="plan popular fade-in"><h3>Pro</h3><div class="price">$29<span>/mo</span></div><ul><li>Unlimited projects</li><li>Advanced analytics</li><li>Priority support</li><li>Custom integrations</li></ul><a href="#" class="btn">Upgrade</a></div><div class="plan fade-in"><h3>Enterprise</h3><div class="price">$99<span>/mo</span></div><ul><li>Everything in Pro</li><li>Dedicated manager</li><li>SLA guarantee</li><li>Custom deployment</li></ul><a href="#" class="btn">Contact Us</a></div></div></section>
<section class="cta-section"><h2>Ready to Get Started?</h2><p>Join thousands building with ${appName}.</p><form onsubmit="event.preventDefault();alert('Thanks for signing up!')"><input type="email" placeholder="Enter your email" required><button type="submit">Sign Up Free</button></form></section>
<footer><p>&copy; 2026 ${appName}. All rights reserved. | <a href="#">Privacy</a> | <a href="#">Terms</a></p></footer>
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

    const appName = analysis.appName || analysis.idea.split(" ").slice(0, 3).join(" ");

    const userPrompt = `Build an MVP for this startup:

**App Name:** ${appName}
**Idea:** ${analysis.idea}
**Target Audience:** ${analysis.target}
**Problem:** ${analysis.problem}
${analysis.revenue ? `**Revenue Model:** ${analysis.revenue}` : ""}
**Category:** ${analysis.category || "SaaS"}

**AI Analysis Summary:** ${analysis.summary}
**Key Strengths:** ${analysis.strengths.join(", ")}
**Recommendations:** ${analysis.recommendations.join(", ")}

IMPORTANT: Use "${appName}" as the brand/product name throughout the preview.html and all files. Generate a complete Next.js MVP codebase that demonstrates this idea. Focus on the core value proposition. Make it visually impressive.`;

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
          content: buildFallbackPreview(appName, analysis.idea, analysis.summary),
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
          content: buildFallbackPreview(appName, analysis.idea, analysis.summary),
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

    const techStack = ["Next.js 14", "TypeScript", "Tailwind CSS", "React 18", "HTML", "CSS", "JavaScript"];

    const build = await Build.create({
      userId,
      analysisId,
      ideaTitle: analysis.appName || analysis.idea,
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
