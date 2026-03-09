import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { connectDB } from "@/lib/mongodb";
import { Analysis } from "@/lib/models/Analysis";
import { Build } from "@/lib/models/Build";
import { User } from "@/lib/models/User";

const groq = new Groq({ apiKey: process.env.QROQ_API_KEY! });

const SYSTEM_PROMPT = `You are the world's best frontend developer building a startup landing page in 2026.

Given a startup idea, generate a COMPLETE MVP codebase with a STUNNING preview.html landing page.

RESPOND WITH ONLY VALID JSON (no markdown, no code blocks):
{
  "files": [
    { "path": "preview.html", "content": "<full HTML>", "lang": "html" },
    { "path": "package.json", "content": "...", "lang": "json" },
    { "path": "src/app/page.tsx", "content": "...", "lang": "typescript" }
  ]
}

Generate 5-10 files. Include package.json, layout, page, and preview.html.

═══════════════════════════════════════════
  PREVIEW.HTML — THIS IS THE MOST IMPORTANT FILE
═══════════════════════════════════════════

The preview.html must be a COMPLETE standalone HTML file with ALL CSS inlined in <style> tags and ALL JS inlined in <script> tags. ZERO external dependencies. No CDN links.

DESIGN STYLE — NEOBRUTALISM (2026):
- Color palette: Use CSS variables. Primary accent: #FF6803 (orange). Dark: #1A1A1A. Light bg: #FFFBF5.
- Borders: 2-3px solid #1A1A1A on ALL cards, buttons, inputs
- Shadows: box-shadow: 4px 4px 0 #1A1A1A on cards. 6px 6px 0 #FF6803 on hover.
- Typography: system-ui font. Bold (700-900 weight). Uppercase headings with letter-spacing: -0.02em.
- Corners: border-radius: 14-20px
- Hover: translateY(-4px) + shadow grows
- Buttons: bg #FF6803, white text, 2px border #1A1A1A, box-shadow, uppercase, font-weight 800
- Body bg: #FFFBF5 (warm cream). Cards: white bg.

REQUIRED 10 SECTIONS in preview.html:
1. NAV — Fixed top. Logo text (app name, bold uppercase, 1.1rem). "Get Started" button right side. Border-bottom 3px.
2. HERO — MUST BE VISUALLY STUNNING:
   - Full viewport height, centered content
   - Animated gradient background using @keyframes (shifting warm colors)
   - A small pill/badge above headline: "🚀 #1 Platform in India" with border, rounded-full, small text
   - App name as the ONLY headline text — just the brand name, nothing else, max 2 words
   - 1 short subtitle below — MAX 6 WORDS (e.g. "Build. Launch. Scale. Faster.")
   - 2 CTA buttons side by side (primary orange + secondary white, both with thick borders + shadows)
   - Floating geometric shapes (circles, rotated squares) with @keyframes float, low opacity
   - "Trusted by 10,000+ founders" text with small avatar circles
   - DO NOT write long sentences in the hero. Keep it ultra-minimal.
3. FEATURES — 4 feature cards in 2x2 grid. Each: emoji icon + bold title + 1 sentence. White cards, thick borders, shadow.
4. HOW IT WORKS — 3 numbered steps. Each step: number in orange circle + title + 1 sentence. Clean centered layout.
5. STATS — Dark bg (#1A1A1A). 3-4 big stat numbers in orange. Labels below. "50K+ Users" / "99.9% Uptime" / "4.9★ Rating" / "₹2Cr+ Processed".
6. TESTIMONIALS — 3 quote cards. Big quotation mark. Real text. Indian names: Priya Sharma (Mumbai), Arjun Mehta (Bangalore), Sneha Patel (Delhi). Role + company.
7. PRICING — 3 tier cards. FREE (₹0), PRO (₹999/mo, popular/highlighted), ENTERPRISE (₹4,999/mo). Feature checklists. "Popular" badge on Pro. ALL PRICES IN ₹.
8. FAQ — 4 collapsible <details> items. Clean borders. + icon that rotates on open.
9. CTA — Dark bg. Bold headline. Email input + "Sign Up Free" button. "Join 50,000+ founders" text.
10. FOOTER — Dark bg. Copyright 2026. Privacy + Terms links.

TEXT RULES:
- Use the APP NAME (provided in prompt) as brand name everywhere — nav, hero, CTA, footer. NEVER use the raw idea description as display text.
- Hero headline: ONLY the app name. Nothing else. No tagline in the h1.
- Hero subtitle: MAX 6 words. Short. Punchy. e.g. "Build. Launch. Scale." or "Your phone marketplace."
- Section headlines: 3-5 words, punchy, uppercase
- Card descriptions: 1 sentence, max 12 words
- NO lorem ipsum. NO filler. NO "coming soon". Write REAL startup copy.
- KEEP EVERYTHING SHORT. Less text = better design.

CSS RULES (MUST FOLLOW):
- Use :root { --primary: #FF6803; --dark: #1A1A1A; --light: #FFFBF5; --shadow: 4px 4px 0 #1A1A1A; }
- nav: position fixed, top 0, z-index 100, border-bottom 3px solid var(--dark)
- Hero: min-height 100vh, centered, animated gradient background using @keyframes
- All cards: padding 2rem, border-radius 18px, border 2px solid var(--dark), box-shadow var(--shadow)
- .fade-in class with IntersectionObserver for scroll animations
- Responsive: @media (max-width: 640px) adjustments
- Smooth scrolling: scroll-behavior: smooth
- section padding: 5rem 2rem
- max-width containers: 900px for grids, centered with margin auto

DO NOT output anything except the JSON object.`;

interface AnalysisData {
  idea: string;
  appName: string;
  target: string;
  problem: string;
  category: string;
  summary: string;
  strengths: string[];
  recommendations: string[];
  revenue?: string;
}

function buildFallbackPreview(analysis: AnalysisData) {
  const { appName, idea, target, problem, category, summary, strengths, recommendations, revenue } = analysis;

  // Category-specific color themes
  const themes: Record<string, { primary: string; gradient1: string; gradient2: string; gradient3: string; accent: string }> = {
    "SaaS": { primary: "#6366F1", gradient1: "#EEF2FF", gradient2: "#E0E7FF", gradient3: "#C7D2FE", accent: "#4F46E5" },
    "Fintech": { primary: "#059669", gradient1: "#ECFDF5", gradient2: "#D1FAE5", gradient3: "#A7F3D0", accent: "#047857" },
    "Health": { primary: "#0D9488", gradient1: "#F0FDFA", gradient2: "#CCFBF1", gradient3: "#99F6E4", accent: "#0F766E" },
    "EdTech": { primary: "#7C3AED", gradient1: "#F5F3FF", gradient2: "#EDE9FE", gradient3: "#DDD6FE", accent: "#6D28D9" },
    "E-commerce": { primary: "#FF6803", gradient1: "#FFFBF5", gradient2: "#FFF0E0", gradient3: "#FFE8CC", accent: "#EA580C" },
    "Social": { primary: "#EC4899", gradient1: "#FDF2F8", gradient2: "#FCE7F3", gradient3: "#FBCFE8", accent: "#DB2777" },
    "AI/ML": { primary: "#2563EB", gradient1: "#EFF6FF", gradient2: "#DBEAFE", gradient3: "#BFDBFE", accent: "#1D4ED8" },
    "Gaming": { primary: "#DC2626", gradient1: "#FEF2F2", gradient2: "#FEE2E2", gradient3: "#FECACA", accent: "#B91C1C" },
    "Food": { primary: "#D97706", gradient1: "#FFFBEB", gradient2: "#FEF3C7", gradient3: "#FDE68A", accent: "#B45309" },
    "Travel": { primary: "#0EA5E9", gradient1: "#F0F9FF", gradient2: "#E0F2FE", gradient3: "#BAE6FD", accent: "#0284C7" },
    "Other": { primary: "#FF6803", gradient1: "#FFFBF5", gradient2: "#FFF0E0", gradient3: "#FFE8CC", accent: "#EA580C" },
  };

  const theme = themes[category] || themes["Other"];
  const { primary, gradient1, gradient2, gradient3, accent } = theme;

  // Category-specific emojis for features
  const categoryEmojis: Record<string, string[]> = {
    "SaaS": ["\u2601\uFE0F", "\u{1F504}", "\u{1F4CA}", "\u{1F512}"],
    "Fintech": ["\u{1F4B3}", "\u{1F4C8}", "\u{1F6E1}\uFE0F", "\u26A1"],
    "Health": ["\u{1F3E5}", "\u{1F4CA}", "\u{1F48A}", "\u2764\uFE0F"],
    "EdTech": ["\u{1F4DA}", "\u{1F3AF}", "\u{1F9E0}", "\u{1F4F1}"],
    "E-commerce": ["\u{1F6D2}", "\u{1F4E6}", "\u{1F4B0}", "\u{1F680}"],
    "Social": ["\u{1F4AC}", "\u{1F310}", "\u{1F465}", "\u2728"],
    "AI/ML": ["\u{1F916}", "\u{1F9E0}", "\u26A1", "\u{1F52E}"],
    "Gaming": ["\u{1F3AE}", "\u{1F3C6}", "\u{1F525}", "\u{1F680}"],
    "Food": ["\u{1F37D}\uFE0F", "\u{1F4E6}", "\u{1F552}", "\u2B50"],
    "Travel": ["\u2708\uFE0F", "\u{1F5FA}\uFE0F", "\u{1F3D6}\uFE0F", "\u{1F4B3}"],
    "Other": ["\u26A1", "\u{1F6E1}\uFE0F", "\u{1F680}", "\u{1F4CA}"],
  };

  const emojis = categoryEmojis[category] || categoryEmojis["Other"];

  // Generate dynamic feature cards from strengths + idea
  const featureNames: string[] = [];
  const featureDescs: string[] = [];
  const s = strengths || [];
  const r = recommendations || [];
  // Combine strengths and recs for feature inspiration
  const sourceTexts = [...s, ...r].slice(0, 4);
  while (sourceTexts.length < 4) sourceTexts.push(summary);
  for (let i = 0; i < 4; i++) {
    const text = sourceTexts[i];
    // Extract first 3-4 meaningful words as title
    const words = text.split(/\s+/).filter((w: string) => w.length > 2).slice(0, 3);
    featureNames.push(words.join(" "));
    // Truncate desc to ~10 words
    featureDescs.push(text.split(/\s+/).slice(0, 10).join(" ") + (text.split(/\s+/).length > 10 ? "." : ""));
  }

  // Dynamic subtitle based on problem/idea
  const subtitleOptions = [
    `Solving ${problem.split(/\s+/).slice(0, 3).join(" ")}.`,
    `Built for ${target.split(/\s+/).slice(0, 3).join(" ")}.`,
    `${category}. Reimagined. For India.`,
    `The future of ${category.toLowerCase()}.`,
  ];
  const subtitle = subtitleOptions[appName.charCodeAt(0) % subtitleOptions.length];

  // Dynamic badge text
  const badgeOptions = [
    `\u{1F680} <span>#1 ${category} Platform</span>`,
    `\u2B50 <span>Trusted by 10K+</span> founders`,
    `\u{1F525} <span>Fastest Growing</span> in India`,
    `\u{1F4A1} <span>AI-Powered</span> ${category}`,
  ];
  const badge = badgeOptions[appName.length % badgeOptions.length];

  // Dynamic stats
  const statSets: Record<string, { nums: string[]; labels: string[] }> = {
    "SaaS": { nums: ["25K+", "99.9%", "4.8\u2605", "\u20B91.5Cr+"], labels: ["Active Teams", "Uptime SLA", "App Rating", "Revenue Saved"] },
    "Fintech": { nums: ["\u20B950Cr+", "1M+", "0.1s", "4.9\u2605"], labels: ["Transactions", "Users", "Processing", "Trust Score"] },
    "Health": { nums: ["500K+", "50K+", "98%", "24/7"], labels: ["Patients Helped", "Doctors", "Accuracy", "Support"] },
    "EdTech": { nums: ["2M+", "10K+", "4.7\u2605", "95%"], labels: ["Students", "Courses", "Rating", "Completion"] },
    "E-commerce": { nums: ["1M+", "\u20B930Cr+", "4.8\u2605", "30min"], labels: ["Products", "GMV", "Rating", "Delivery"] },
    "Social": { nums: ["5M+", "100M+", "4.6\u2605", "<1s"], labels: ["Users", "Posts", "Rating", "Load Time"] },
    "AI/ML": { nums: ["10M+", "99.5%", "50ms", "4.9\u2605"], labels: ["Predictions", "Accuracy", "Latency", "Rating"] },
    "Gaming": { nums: ["3M+", "500K+", "4.8\u2605", "\u20B910Cr+"], labels: ["Players", "Daily Active", "Rating", "Prizes Won"] },
    "Other": { nums: ["50K+", "99.9%", "4.9\u2605", "\u20B92Cr+"], labels: ["Users", "Uptime", "Rating", "Processed"] },
  };
  const stats = statSets[category] || statSets["Other"];

  // Dynamic testimonials with varying Indian names
  const testimonialSets = [
    [
      { text: `${appName} completely changed how we approach ${category.toLowerCase()}. Saved us months of work and lakhs in cost.`, name: "Priya Sharma", role: "Founder, TechVentures Mumbai" },
      { text: `Best ${category.toLowerCase()} tool I've found. The UX is incredible and the results speak for themselves.`, name: "Arjun Mehta", role: "CTO, DataSync Bangalore" },
      { text: `We went from concept to launch in weeks using ${appName}. Our investors were impressed.`, name: "Sneha Patel", role: "CEO, GrowthPilot Delhi" },
    ],
    [
      { text: `${appName} is exactly what the Indian ${category.toLowerCase()} ecosystem needed. 10x productivity boost.`, name: "Rahul Verma", role: "VP Engineering, NovaTech Pune" },
      { text: `Switched from 3 different tools to just ${appName}. Everything in one place, brilliantly designed.`, name: "Ananya Krishnan", role: "Product Lead, FinFirst Chennai" },
      { text: `The ROI was visible from day one. ${appName} paid for itself within the first month.`, name: "Vikram Singh", role: "Co-founder, ScaleUp Gurugram" },
    ],
    [
      { text: `Our team's efficiency doubled after adopting ${appName}. Can't imagine going back.`, name: "Meera Joshi", role: "Director, CloudNine Hyderabad" },
      { text: `${appName} understands the Indian market like no other. The localization is perfect.`, name: "Karthik Rajan", role: "Head of Growth, PixelCraft Bangalore" },
      { text: `From a skeptic to an evangelist — ${appName} won me over with its simplicity and power.`, name: "Deepika Nair", role: "CTO, BrightMinds Kochi" },
    ],
  ];
  const testimonials = testimonialSets[appName.charCodeAt(0) % testimonialSets.length];

  // Dynamic How It Works
  const howSteps: Record<string, { titles: string[]; descs: string[] }> = {
    "SaaS": { titles: ["Sign Up", "Connect", "Automate"], descs: ["Create your workspace in 30 seconds.", "Integrate with your existing tools seamlessly.", "Set up workflows and watch productivity soar."] },
    "Fintech": { titles: ["Verify", "Link", "Transact"], descs: ["Complete KYC in under 2 minutes.", "Connect your bank accounts securely.", "Start sending and receiving money instantly."] },
    "Health": { titles: ["Register", "Consult", "Track"], descs: ["Create your health profile quickly.", "Connect with certified doctors online.", "Monitor your health metrics in real-time."] },
    "EdTech": { titles: ["Enroll", "Learn", "Certify"], descs: ["Pick from 10,000+ courses.", "Learn at your own pace with AI tutoring.", "Earn industry-recognized certificates."] },
    "E-commerce": { titles: ["Browse", "Order", "Receive"], descs: ["Discover products curated for you.", "Checkout in 2 taps with UPI.", "Get doorstep delivery across India."] },
    "Other": { titles: ["Sign Up", "Setup", "Launch"], descs: ["Create your account in seconds.", "Configure everything with guided onboarding.", "Go live and see results from day one."] },
  };
  const steps = howSteps[category] || howSteps["Other"];

  // Dynamic FAQ
  const faqItems = [
    { q: `What makes ${appName} different?`, a: summary.split(/\s+/).slice(0, 25).join(" ") + "." },
    { q: `Is ${appName} available across India?`, a: `Yes! ${appName} works nationwide with support for UPI, all major banks, and localized experiences for every state.` },
    { q: "Can I upgrade or downgrade anytime?", a: "Absolutely. Switch plans whenever you want. Changes are instant with prorated billing." },
    { q: "Is my data secure?", a: "We use bank-grade encryption, comply with Indian data protection laws, and your data never leaves our secure servers." },
  ];

  // Dynamic pricing names based on category
  const pricingNames: Record<string, string[]> = {
    "SaaS": ["Starter", "Growth", "Enterprise"],
    "Fintech": ["Basic", "Business", "Enterprise"],
    "EdTech": ["Student", "Professional", "Institution"],
    "E-commerce": ["Seller", "Business", "Enterprise"],
    "Other": ["Starter", "Pro", "Enterprise"],
  };
  const plans = pricingNames[category] || pricingNames["Other"];

  // Revenue-aware pricing
  const priceValues = revenue?.toLowerCase().includes("free")
    ? ["\u20B90", "\u20B9499", "\u20B92,499"]
    : ["\u20B90", "\u20B9999", "\u20B94,999"];

  // Unique hero shapes per category (different sizes & positions)
  const shapeVariant = appName.length % 3;

  // Dynamic CTA
  const ctaTexts = [
    `Start building with ${appName} today.`,
    `Join thousands already using ${appName}.`,
    `Your ${category.toLowerCase()} journey starts here.`,
  ];
  const ctaText = ctaTexts[appName.charCodeAt(0) % ctaTexts.length];

  // Avatar colors from theme
  const avatarColors = [primary, accent, "#22C55E", "#1A1A1A"];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${appName}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--primary:${primary};--accent:${accent};--light:${gradient1};--dark:#1A1A1A;--shadow:4px 4px 0 #1A1A1A;--g1:${gradient1};--g2:${gradient2};--g3:${gradient3}}
body{font-family:system-ui,-apple-system,sans-serif;color:var(--dark);scroll-behavior:smooth;background:var(--light)}
nav{position:fixed;top:0;width:100%;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center;background:var(--light);border-bottom:3px solid var(--dark);z-index:100}
nav .logo{font-size:1.1rem;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;color:var(--dark)}
nav .logo span{color:var(--primary)}
nav .cta{padding:0.5rem 1.5rem;background:var(--primary);color:#fff;border:2px solid var(--dark);border-radius:12px;font-weight:800;font-size:0.8rem;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;box-shadow:var(--shadow);text-transform:uppercase;letter-spacing:0.05em}
nav .cta:hover{transform:translateY(-2px);box-shadow:6px 6px 0 var(--dark)}
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:6rem 2rem 4rem;background:linear-gradient(${135 + shapeVariant * 30}deg,var(--g1),var(--g2),var(--g3),var(--g1));background-size:400% 400%;animation:heroGradient ${7 + shapeVariant * 2}s ease infinite;position:relative;overflow:hidden}
@keyframes heroGradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.hero .shape{position:absolute;border:3px solid var(--primary);opacity:0.08;animation:float 6s ease-in-out infinite}
.hero .shape-1{width:${150 + shapeVariant * 40}px;height:${150 + shapeVariant * 40}px;border-radius:50%;top:${8 + shapeVariant * 5}%;right:${6 + shapeVariant * 4}%}
.hero .shape-2{width:${80 + shapeVariant * 30}px;height:${80 + shapeVariant * 30}px;border-radius:18px;transform:rotate(${45 + shapeVariant * 15}deg);bottom:${12 + shapeVariant * 6}%;left:${5 + shapeVariant * 3}%;animation-delay:1.5s}
.hero .shape-3{width:${50 + shapeVariant * 20}px;height:${50 + shapeVariant * 20}px;border-radius:50%;top:${25 + shapeVariant * 8}%;left:${10 + shapeVariant * 5}%;background:var(--primary);opacity:0.05;animation-delay:3s}
.hero .shape-4{width:${100 + shapeVariant * 25}px;height:${100 + shapeVariant * 25}px;border-radius:24px;transform:rotate(${12 + shapeVariant * 10}deg);bottom:${18 + shapeVariant * 4}%;right:${10 + shapeVariant * 5}%;border-color:var(--accent);opacity:0.05;animation-delay:2s}
.hero .badge{display:inline-flex;align-items:center;gap:0.5rem;padding:0.4rem 1.2rem;border-radius:99px;background:#fff;border:2px solid var(--dark);box-shadow:3px 3px 0 var(--dark);font-size:0.7rem;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1.5rem;color:var(--dark)}
.hero .badge span{color:var(--primary)}
.hero h1{font-size:clamp(2.5rem,6vw,4.5rem);font-weight:900;line-height:1.05;max-width:700px;text-transform:uppercase;letter-spacing:-0.03em;background:linear-gradient(135deg,var(--dark) 30%,var(--primary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;position:relative}
.hero h1::after{content:'';position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);width:50%;height:5px;border-radius:5px;background:linear-gradient(90deg,transparent,var(--primary),transparent)}
.hero .glow{position:absolute;width:350px;height:350px;border-radius:50%;background:radial-gradient(circle,${primary}1a 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;animation:pulseGlow 4s ease-in-out infinite}
@keyframes pulseGlow{0%,100%{opacity:0.5;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.4)}}
.hero .mockup{margin-top:2.5rem;width:min(90%,480px);background:#fff;border:3px solid var(--dark);border-radius:16px;box-shadow:8px 8px 0 var(--dark);overflow:hidden;animation:floatMockup 4s ease-in-out infinite}
@keyframes floatMockup{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.hero .mockup-bar{display:flex;align-items:center;gap:6px;padding:10px 14px;background:var(--dark);border-bottom:2px solid var(--dark)}
.hero .mockup-bar span{width:10px;height:10px;border-radius:50%}
.hero .mockup-bar span:nth-child(1){background:#FF5F57}
.hero .mockup-bar span:nth-child(2){background:#FEBC2E}
.hero .mockup-bar span:nth-child(3){background:#28C840}
.hero .mockup-body{padding:1rem;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.hero .mockup-body .mock-card{background:var(--g1);border:2px solid var(--dark);border-radius:10px;padding:12px;text-align:left}
.hero .mockup-body .mock-card .mock-val{font-size:1.1rem;font-weight:900;color:var(--primary)}
.hero .mockup-body .mock-card .mock-label{font-size:0.55rem;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-top:2px}
.hero p{margin-top:1rem;font-size:1rem;color:#64748b;max-width:500px;line-height:1.6}
.hero .btns{display:flex;gap:1rem;margin-top:2rem;flex-wrap:wrap;justify-content:center}
.hero .btns a{padding:0.875rem 2rem;border-radius:14px;font-weight:800;text-decoration:none;transition:transform 0.2s,box-shadow 0.2s;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;border:2px solid var(--dark)}
.hero .btns .primary{background:var(--primary);color:#fff;box-shadow:var(--shadow)}
.hero .btns .secondary{background:#fff;color:var(--dark);box-shadow:var(--shadow)}
.hero .btns a:hover{transform:translateY(-3px);box-shadow:6px 6px 0 var(--dark)}
.hero .trust{margin-top:2rem;display:flex;align-items:center;gap:0.75rem;font-size:0.75rem;color:#94a3b8;font-weight:700}
.hero .trust .avatars{display:flex}
.hero .trust .avatars span{width:28px;height:28px;border-radius:50%;border:2px solid #fff;margin-left:-8px;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:900;color:#fff}
.hero .trust .avatars span:first-child{margin-left:0}
section{padding:5rem 2rem}
.section-tag{display:inline-block;padding:0.3rem 1rem;border-radius:99px;background:${primary}15;color:var(--primary);font-size:0.7rem;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:1rem;border:1.5px solid ${primary}30}
.features{background:#fff;border-top:3px solid var(--dark);border-bottom:3px solid var(--dark)}
.sh2{text-align:center;font-size:1.8rem;font-weight:900;margin-bottom:2.5rem;text-transform:uppercase;letter-spacing:-0.02em}
.features .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;max-width:900px;margin:0 auto}
.features .card{padding:2rem;border-radius:18px;background:var(--light);border:2px solid var(--dark);box-shadow:var(--shadow);transition:transform 0.2s,box-shadow 0.2s}
.features .card:hover{transform:translateY(-4px);box-shadow:6px 6px 0 var(--primary)}
.features .card .icon{font-size:1.8rem;margin-bottom:0.75rem;width:50px;height:50px;display:flex;align-items:center;justify-content:center;border-radius:14px;background:${primary}12;border:2px solid ${primary}25}
.features .card h3{font-size:0.95rem;font-weight:800;margin-bottom:0.5rem;text-transform:uppercase}
.features .card p{color:#64748b;line-height:1.5;font-size:0.85rem}
.how-it-works{background:var(--light)}
.how-it-works .steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem;max-width:900px;margin:0 auto}
.how-it-works .step{text-align:center;padding:2rem 1.5rem;border-radius:18px;background:#fff;border:2px solid var(--dark);box-shadow:var(--shadow);transition:transform 0.2s;position:relative}
.how-it-works .step:hover{transform:translateY(-4px)}
.how-it-works .step .num{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:14px;background:var(--primary);color:#fff;font-weight:900;font-size:1.1rem;margin-bottom:1rem;border:2px solid var(--dark);box-shadow:3px 3px 0 var(--dark)}
.how-it-works .step h3{font-size:0.95rem;font-weight:800;margin-bottom:0.5rem;text-transform:uppercase}
.how-it-works .step p{color:#64748b;font-size:0.8rem;line-height:1.5}
.how-it-works .step:not(:last-child)::after{content:'\\2192';position:absolute;right:-20px;top:50%;transform:translateY(-50%);font-size:1.5rem;color:var(--primary);font-weight:900}
.stats{background:var(--dark);color:#fff;text-align:center}
.stats h2{color:#fff}
.stats .row{display:flex;justify-content:center;gap:3rem;flex-wrap:wrap}
.stats .stat .num{font-size:2.5rem;font-weight:900;color:var(--primary)}
.stats .stat .label{margin-top:0.25rem;color:#94a3b8;font-weight:700;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em}
.testimonials{background:#fff;border-top:3px solid var(--dark)}
.testimonials .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-width:900px;margin:0 auto}
.testimonials .quote{padding:2rem;border-radius:18px;background:var(--light);border:2px solid var(--dark);box-shadow:var(--shadow);position:relative}
.testimonials .quote::before{content:'\\201C';font-size:3rem;color:var(--primary);opacity:0.3;position:absolute;top:10px;left:16px;font-family:Georgia,serif}
.testimonials .quote p{font-size:0.85rem;color:#475569;line-height:1.6;margin-bottom:1rem;padding-top:1rem}
.testimonials .quote .author{font-size:0.8rem;font-weight:800;color:var(--dark);text-transform:uppercase}
.testimonials .quote .role{font-size:0.7rem;color:#94a3b8;font-weight:600}
.testimonials .stars{color:var(--primary);font-size:0.75rem;margin-bottom:0.5rem}
.pricing{background:var(--light)}
.pricing .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem;max-width:850px;margin:0 auto}
.pricing .plan{padding:2rem;border-radius:18px;border:2px solid var(--dark);text-align:center;transition:transform 0.2s;box-shadow:var(--shadow);background:#fff}
.pricing .plan:hover{transform:translateY(-4px)}
.pricing .plan.popular{border-color:var(--primary);box-shadow:6px 6px 0 var(--primary);position:relative;transform:scale(1.03)}
.pricing .plan.popular::before{content:"Popular";position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;padding:0.2rem 1rem;border-radius:99px;font-size:0.7rem;font-weight:800;border:2px solid var(--dark);text-transform:uppercase}
.pricing .plan .price{font-size:2.5rem;font-weight:900;margin:0.75rem 0;color:var(--dark)}
.pricing .plan .price span{font-size:0.85rem;color:#94a3b8}
.pricing .plan ul{list-style:none;margin:1.5rem 0;text-align:left}
.pricing .plan li{padding:0.4rem 0;color:#475569;font-size:0.85rem}
.pricing .plan li::before{content:"\\2713 ";color:var(--primary);font-weight:700}
.pricing .plan .btn{display:inline-block;padding:0.75rem 2rem;border-radius:14px;font-weight:800;text-decoration:none;transition:transform 0.2s;background:var(--primary);color:#fff;border:2px solid var(--dark);box-shadow:3px 3px 0 var(--dark);font-size:0.8rem;text-transform:uppercase}
.pricing .plan .btn:hover{transform:translateY(-2px);box-shadow:5px 5px 0 var(--dark)}
.faq{background:#fff;border-top:3px solid var(--dark)}
.faq .items{max-width:700px;margin:0 auto}
.faq .item{border:2px solid var(--dark);border-radius:14px;margin-bottom:0.75rem;overflow:hidden;box-shadow:2px 2px 0 var(--dark)}
.faq .item summary{padding:1rem 1.5rem;font-weight:800;font-size:0.9rem;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;background:var(--light);text-transform:uppercase;letter-spacing:0.02em}
.faq .item summary::after{content:'+';font-size:1.2rem;font-weight:900;color:var(--primary);transition:transform 0.2s}
.faq .item[open] summary::after{transform:rotate(45deg)}
.faq .item .answer{padding:0 1.5rem 1rem;font-size:0.85rem;color:#64748b;line-height:1.6}
.cta-section{background:var(--dark);color:#fff;text-align:center;padding:5rem 2rem;border-top:3px solid var(--primary)}
.cta-section h2{font-size:1.8rem;font-weight:900;margin-bottom:0.75rem;text-transform:uppercase;color:#fff}
.cta-section p{font-size:0.95rem;opacity:0.7;margin-bottom:2rem}
.cta-section form{display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap}
.cta-section input{padding:0.75rem 1.5rem;border-radius:14px;border:2px solid #333;font-size:0.9rem;width:280px;max-width:100%;background:#222;color:#fff}
.cta-section button{padding:0.75rem 2rem;border-radius:14px;background:var(--primary);color:#fff;font-weight:800;border:2px solid var(--primary);cursor:pointer;transition:transform 0.2s;font-size:0.85rem;text-transform:uppercase}
.cta-section button:hover{transform:scale(1.05)}
footer{background:var(--dark);color:#94a3b8;text-align:center;padding:2.5rem 2rem;font-size:0.8rem;border-top:1px solid #333}
footer a{color:var(--primary);text-decoration:none;font-weight:700}
.fade-in{opacity:0;transform:translateY(20px);transition:opacity 0.6s,transform 0.6s}
.fade-in.visible{opacity:1;transform:translateY(0)}
@keyframes float{0%,100%{transform:translateY(0) rotate(var(--r,0deg))}50%{transform:translateY(-20px) rotate(var(--r,0deg))}}
@media(max-width:768px){.how-it-works .step::after{display:none}}
@media(max-width:640px){.hero h1{font-size:2rem}.hero .mockup{width:95%}.stats .row{gap:2rem}.pricing .plan.popular{transform:scale(1)}.how-it-works .steps{grid-template-columns:1fr}}
</style>
</head>
<body>
<nav><div class="logo"><span>${appName.charAt(0)}</span>${appName.slice(1)}</div><button class="cta" onclick="document.querySelector('.cta-section').scrollIntoView({behavior:'smooth'})">Get Started</button></nav>

<section class="hero"><div class="shape shape-1"></div><div class="shape shape-2"></div><div class="shape shape-3"></div><div class="shape shape-4"></div><div class="glow"></div><div class="badge">${badge}</div><h1>${appName}</h1><p>${subtitle}</p><div class="btns"><a href="#features" class="primary">Get Started Free</a><a href="#pricing" class="secondary">View Pricing</a></div><div class="trust"><div class="avatars"><span style="background:${avatarColors[0]}">P</span><span style="background:${avatarColors[1]}">A</span><span style="background:${avatarColors[2]}">S</span><span style="background:${avatarColors[3]}">R</span></div>Trusted by 10,000+ founders</div><div class="mockup"><div class="mockup-bar"><span></span><span></span><span></span></div><div class="mockup-body"><div class="mock-card"><div class="mock-val">${stats.nums[0]}</div><div class="mock-label">${stats.labels[0]}</div></div><div class="mock-card"><div class="mock-val">${stats.nums[1]}</div><div class="mock-label">${stats.labels[1]}</div></div><div class="mock-card"><div class="mock-val">${stats.nums[2]}</div><div class="mock-label">${stats.labels[2]}</div></div><div class="mock-card"><div class="mock-val">${stats.nums[3]}</div><div class="mock-label">${stats.labels[3]}</div></div></div></div></section>

<section class="features" id="features"><div style="text-align:center"><span class="section-tag">Features</span></div><h2 class="sh2">Why Choose ${appName}</h2><div class="grid"><div class="card fade-in"><div class="icon">${emojis[0]}</div><h3>${featureNames[0]}</h3><p>${featureDescs[0]}</p></div><div class="card fade-in"><div class="icon">${emojis[1]}</div><h3>${featureNames[1]}</h3><p>${featureDescs[1]}</p></div><div class="card fade-in"><div class="icon">${emojis[2]}</div><h3>${featureNames[2]}</h3><p>${featureDescs[2]}</p></div><div class="card fade-in"><div class="icon">${emojis[3]}</div><h3>${featureNames[3]}</h3><p>${featureDescs[3]}</p></div></div></section>

<section class="how-it-works" id="how-it-works"><div style="text-align:center"><span class="section-tag">How It Works</span></div><h2 class="sh2">Three Simple Steps</h2><div class="steps"><div class="step fade-in"><div class="num">1</div><h3>${steps.titles[0]}</h3><p>${steps.descs[0]}</p></div><div class="step fade-in"><div class="num">2</div><h3>${steps.titles[1]}</h3><p>${steps.descs[1]}</p></div><div class="step fade-in"><div class="num">3</div><h3>${steps.titles[2]}</h3><p>${steps.descs[2]}</p></div></div></section>

<section class="stats"><div style="text-align:center"><span class="section-tag" style="background:rgba(255,255,255,0.1);color:var(--primary);border-color:rgba(255,255,255,0.15)">By The Numbers</span></div><h2 class="sh2" style="color:#fff">Trusted Across India</h2><div class="row"><div class="stat fade-in"><div class="num">${stats.nums[0]}</div><div class="label">${stats.labels[0]}</div></div><div class="stat fade-in"><div class="num">${stats.nums[1]}</div><div class="label">${stats.labels[1]}</div></div><div class="stat fade-in"><div class="num">${stats.nums[2]}</div><div class="label">${stats.labels[2]}</div></div></div></section>

<section class="testimonials"><div style="text-align:center"><span class="section-tag">Testimonials</span></div><h2 class="sh2">Loved by Founders</h2><div class="grid"><div class="quote fade-in"><div class="stars">\u2605\u2605\u2605\u2605\u2605</div><p>${testimonials[0].text}</p><div class="author">${testimonials[0].name}</div><div class="role">${testimonials[0].role}</div></div><div class="quote fade-in"><div class="stars">\u2605\u2605\u2605\u2605\u2605</div><p>${testimonials[1].text}</p><div class="author">${testimonials[1].name}</div><div class="role">${testimonials[1].role}</div></div><div class="quote fade-in"><div class="stars">\u2605\u2605\u2605\u2605\u2605</div><p>${testimonials[2].text}</p><div class="author">${testimonials[2].name}</div><div class="role">${testimonials[2].role}</div></div></div></section>

<section class="pricing" id="pricing"><div style="text-align:center"><span class="section-tag">Pricing</span></div><h2 class="sh2">Simple, Transparent Pricing</h2><div class="grid"><div class="plan fade-in"><h3>${plans[0]}</h3><div class="price">${priceValues[0]}</div><ul><li>Up to 3 projects</li><li>Basic analytics</li><li>Community support</li></ul><a href="#" class="btn">Get Started</a></div><div class="plan popular fade-in"><h3>${plans[1]}</h3><div class="price">${priceValues[1]}<span>/mo</span></div><ul><li>Unlimited projects</li><li>Advanced analytics</li><li>Priority support</li><li>Custom integrations</li></ul><a href="#" class="btn">Upgrade</a></div><div class="plan fade-in"><h3>${plans[2]}</h3><div class="price">${priceValues[2]}<span>/mo</span></div><ul><li>Everything in ${plans[1]}</li><li>Dedicated manager</li><li>SLA guarantee</li><li>Custom deployment</li></ul><a href="#" class="btn">Contact Us</a></div></div></section>

<section class="faq" id="faq"><div style="text-align:center"><span class="section-tag">FAQ</span></div><h2 class="sh2">Got Questions?</h2><div class="items"><details class="item"><summary>${faqItems[0].q}</summary><div class="answer">${faqItems[0].a}</div></details><details class="item"><summary>${faqItems[1].q}</summary><div class="answer">${faqItems[1].a}</div></details><details class="item"><summary>${faqItems[2].q}</summary><div class="answer">${faqItems[2].a}</div></details><details class="item"><summary>${faqItems[3].q}</summary><div class="answer">${faqItems[3].a}</div></details></div></section>

<section class="cta-section"><h2>Ready to Get Started?</h2><p>${ctaText}</p><form onsubmit="event.preventDefault()"><input type="email" placeholder="Enter your email" required><button type="submit">Sign Up Free</button></form></section>

<footer><p>&copy; 2026 ${appName}. All rights reserved. | <a href="#">Privacy</a> | <a href="#">Terms</a></p></footer>
<script>
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')})},{threshold:0.1});
document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));
document.addEventListener('click',function(e){var a=e.target.closest('a');if(a){e.preventDefault();var h=a.getAttribute('href');if(h&&h.startsWith('#')&&h.length>1){var el=document.querySelector(h);if(el)el.scrollIntoView({behavior:'smooth'})}}});
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

    // Ensure appName is set and persisted
    if (!analysis.appName) {
      const skip = new Set(["a","an","the","for","to","of","in","on","and","or","is","it","that","with","as","by","this","from","at","my","your","our","just","very","really","also","about","based","using","use","new","get","app","platform","tool","system","service","website","software","build","create","make","like","want","need","can","will","would","should","could","online","digital","smart","ai","store","shop","marketplace","ecommerce","sell","buy","selling","buying","market","help","helps","people","users","manage","simple","easy","best","good","great"]);
      const w = analysis.idea.split(/\s+/).filter((w: string) => !skip.has(w.toLowerCase()) && w.length > 2);
      const suffixes = ["ly","ify","io","Hub","Sync","Flow","Nest","Base","Mint","Wave","Pulse","Spark","Cart","Verse","Stack"];
      if (w.length >= 1) {
        const cw = w[w.length - 1];
        const s = cw.endsWith('s') && cw.length > 3 ? cw.slice(0, -1) : cw;
        const core = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        analysis.appName = core + suffixes[core.charCodeAt(0) % suffixes.length];
      } else {
        analysis.appName = "LaunchPad";
      }
      await Analysis.updateOne({ _id: analysisId }, { $set: { appName: analysis.appName } });
    }
    const appName = analysis.appName;

    const userPrompt = `Build an MVP for this startup:

**App Name (BRAND):** ${appName}
**Idea:** ${analysis.idea}
**Target Audience:** ${analysis.target}
**Problem:** ${analysis.problem}
${analysis.revenue ? `**Revenue Model:** ${analysis.revenue}` : ""}
**Category:** ${analysis.category || "SaaS"}

**AI Analysis Summary:** ${analysis.summary}
**Key Strengths:** ${analysis.strengths.join(", ")}
**Recommendations:** ${analysis.recommendations.join(", ")}

CRITICAL INSTRUCTIONS:
1. The brand name is "${appName}" — use "${appName}" as the product name EVERYWHERE in the preview.html and all files. Do NOT use the raw idea description as text. The hero headline should be "${appName}", the nav logo should say "${appName}", etc.
2. Write ULTRA SHORT copy. Hero subtitle: MAX 6 words. Card descriptions: 1 sentence max. Headlines: 3-5 words. LESS TEXT = BETTER.
3. The preview.html MUST have FULL CSS inlined in <style> tags. It must look beautiful with neobrutalism design, proper colors, proper spacing, hover effects, animations.
4. Include 8-10 sections: Nav, Hero, Features (4 cards), How It Works (3 steps), Stats, Testimonials (Indian names), Pricing (\u20b9 values), FAQ, CTA, Footer.
5. ALL pricing in Indian Rupees (\u20b9). No dollar signs.
6. Make it look like a real 2026 startup landing page — professional, bold, clean.`;

    let rawContent: string;

    // Try openai/gpt-oss-120b via Groq first, fall back to llama if it fails
    try {
      const result = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_completion_tokens: 16384,
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
      // Sanitize file contents — fix double-escaped newlines from AI
      generatedFiles = generatedFiles.map((f: { path: string; content: string; lang: string }) => ({
        ...f,
        content: typeof f.content === 'string'
          ? f.content.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '')
          : f.content,
      }));
      // ALWAYS use our handcrafted preview.html — AI-generated previews are unreliable
      generatedFiles = generatedFiles.filter(
        (f: { path: string }) => f.path !== "preview.html",
      );
      generatedFiles.push({
        path: "preview.html",
        content: buildFallbackPreview({ idea: analysis.idea, appName, target: analysis.target, problem: analysis.problem, category: analysis.category || "Other", summary: analysis.summary, strengths: analysis.strengths || [], recommendations: analysis.recommendations || [], revenue: analysis.revenue }),
        lang: "html",
      });
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
          content: buildFallbackPreview({ idea: analysis.idea, appName, target: analysis.target, problem: analysis.problem, category: analysis.category || "Other", summary: analysis.summary, strengths: analysis.strengths || [], recommendations: analysis.recommendations || [], revenue: analysis.revenue }),
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
