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

DESIGN STYLE — MODERN UI MIX (2026):
Randomly mix or use one of these styles:
- Bauhaus: bold colors (red, blue, yellow), stark black lines, geometric shapes.
- Neumorphism: soft shadows, raised/inset elements, low contrast but high elegance.
- Glassmorphism: backdrop-filter blur, translucent frosted glass panels over colorful gradients.
- Neobrutalism: thick borders, solid offsets shadows, vibrant contrasting colors. 
Mix them or use a singular strong aesthetic. The design should look incredibly fresh, unique, and highly professional. Include hover animations, subtle translate transforms, and creative layouts.

Ensure all text is large enough to be legible but not unnecessarily oversized. Use beautiful typography.

REQUIRED 10-12 SECTIONS in preview.html (Create an engaging, long-scrolling landing page):
1. NAV — Fixed top. Logo text. "Get Started" button.
2. HERO — Visually stunning, animated gradient or floating shapes, App name, max 6-word subtitle, 2 CTA buttons.
3. LOGO CLOUD — "Trusted by 10,000+ companies" with mock company text/shapes.
4. PROBLEM — "The old way vs The new way" comparison.
5. FEATURES — 4+ feature cards.
6. HOW IT WORKS — 3-4 steps.
7. STATS — 3-4 big stat numbers.
8. SHOWCASE/PREVIEW — A mockup abstract UI showing the app "in action" using divs and gradients.
9. TESTIMONIALS — 3 quote cards.
10. PRICING — 3 tier cards.
11. FAQ — 4-5 collapsible <details> items.
12. CTA / FOOTER — Final push + links.

FORMATTING RULE: Ensure the HTML code inside the JSON is WELL-FORMATTED with proper indentation, line breaks, and whitespace so it is easily readable when the user inspects the code. Do NOT minify the HTML string in the JSON payload.
\nDO NOT output anything except the JSON object.`;

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
  const {
    appName,
    idea,
    target,
    problem,
    category,
    summary,
    strengths,
    recommendations,
    revenue,
  } = analysis;

  // ── Category Color Themes ──
  const themes: Record<
    string,
    {
      primary: string;
      gradient1: string;
      gradient2: string;
      gradient3: string;
      accent: string;
    }
  > = {
    SaaS: {
      primary: "#6366F1",
      gradient1: "#EEF2FF",
      gradient2: "#E0E7FF",
      gradient3: "#C7D2FE",
      accent: "#4F46E5",
    },
    Fintech: {
      primary: "#059669",
      gradient1: "#ECFDF5",
      gradient2: "#D1FAE5",
      gradient3: "#A7F3D0",
      accent: "#047857",
    },
    Health: {
      primary: "#0D9488",
      gradient1: "#F0FDFA",
      gradient2: "#CCFBF1",
      gradient3: "#99F6E4",
      accent: "#0F766E",
    },
    EdTech: {
      primary: "#7C3AED",
      gradient1: "#F5F3FF",
      gradient2: "#EDE9FE",
      gradient3: "#DDD6FE",
      accent: "#6D28D9",
    },
    "E-commerce": {
      primary: "#FF6803",
      gradient1: "#FFFBF5",
      gradient2: "#FFF0E0",
      gradient3: "#FFE8CC",
      accent: "#EA580C",
    },
    Social: {
      primary: "#EC4899",
      gradient1: "#FDF2F8",
      gradient2: "#FCE7F3",
      gradient3: "#FBCFE8",
      accent: "#DB2777",
    },
    "AI/ML": {
      primary: "#2563EB",
      gradient1: "#EFF6FF",
      gradient2: "#DBEAFE",
      gradient3: "#BFDBFE",
      accent: "#1D4ED8",
    },
    Gaming: {
      primary: "#DC2626",
      gradient1: "#FEF2F2",
      gradient2: "#FEE2E2",
      gradient3: "#FECACA",
      accent: "#B91C1C",
    },
    Food: {
      primary: "#D97706",
      gradient1: "#FFFBEB",
      gradient2: "#FEF3C7",
      gradient3: "#FDE68A",
      accent: "#B45309",
    },
    Travel: {
      primary: "#0EA5E9",
      gradient1: "#F0F9FF",
      gradient2: "#E0F2FE",
      gradient3: "#BAE6FD",
      accent: "#0284C7",
    },
    Other: {
      primary: "#FF6803",
      gradient1: "#FFFBF5",
      gradient2: "#FFF0E0",
      gradient3: "#FFE8CC",
      accent: "#EA580C",
    },
  };

  const theme = themes[category] || themes["Other"];
  const { primary, gradient1, gradient2, gradient3, accent } = theme;

  // ── Category Emojis ──
  const categoryEmojis: Record<string, string[]> = {
    SaaS: ["\u2601\uFE0F", "\u{1F504}", "\u{1F4CA}", "\u{1F512}"],
    Fintech: ["\u{1F4B3}", "\u{1F4C8}", "\u{1F6E1}\uFE0F", "\u26A1"],
    Health: ["\u{1F3E5}", "\u{1F4CA}", "\u{1F48A}", "\u2764\uFE0F"],
    EdTech: ["\u{1F4DA}", "\u{1F3AF}", "\u{1F9E0}", "\u{1F4F1}"],
    "E-commerce": ["\u{1F6D2}", "\u{1F4E6}", "\u{1F4B0}", "\u{1F680}"],
    Social: ["\u{1F4AC}", "\u{1F310}", "\u{1F465}", "\u2728"],
    "AI/ML": ["\u{1F916}", "\u{1F9E0}", "\u26A1", "\u{1F52E}"],
    Gaming: ["\u{1F3AE}", "\u{1F3C6}", "\u{1F525}", "\u{1F680}"],
    Food: ["\u{1F37D}\uFE0F", "\u{1F4E6}", "\u{1F552}", "\u2B50"],
    Travel: ["\u2708\uFE0F", "\u{1F5FA}\uFE0F", "\u{1F3D6}\uFE0F", "\u{1F4B3}"],
    Other: ["\u26A1", "\u{1F6E1}\uFE0F", "\u{1F680}", "\u{1F4CA}"],
  };
  const emojis = categoryEmojis[category] || categoryEmojis["Other"];

  // ── Feature Cards from Strengths ──
  const featureNames: string[] = [];
  const featureDescs: string[] = [];
  const s = strengths || [];
  const r = recommendations || [];
  const sourceTexts = [...s, ...r].slice(0, 4);
  while (sourceTexts.length < 4) sourceTexts.push(summary);
  for (let i = 0; i < 4; i++) {
    const text = sourceTexts[i];
    const words = text
      .split(/\s+/)
      .filter((w: string) => w.length > 2)
      .slice(0, 3);
    featureNames.push(words.join(" "));
    featureDescs.push(
      text.split(/\s+/).slice(0, 10).join(" ") +
        (text.split(/\s+/).length > 10 ? "." : ""),
    );
  }

  // ── Dynamic Subtitle ──
  const subtitleOptions = [
    `Solving ${problem.split(/\s+/).slice(0, 3).join(" ")}.`,
    `Built for ${target.split(/\s+/).slice(0, 3).join(" ")}.`,
    `${category}. Reimagined. For India.`,
    `The future of ${category.toLowerCase()}.`,
  ];
  const subtitle =
    subtitleOptions[appName.charCodeAt(0) % subtitleOptions.length];

  // ── Dynamic Badge ──
  const badgeOptions = [
    `\u{1F680} <span>#1 ${category} Platform</span>`,
    `\u2B50 <span>Trusted by 10K+</span> founders`,
    `\u{1F525} <span>Fastest Growing</span> in India`,
    `\u{1F4A1} <span>AI-Powered</span> ${category}`,
  ];
  const badge = badgeOptions[appName.length % badgeOptions.length];

  // ── Stats Data ──
  const statSets: Record<string, { nums: string[]; labels: string[] }> = {
    SaaS: {
      nums: ["25K+", "99.9%", "4.8\u2605", "\u20B91.5Cr+"],
      labels: ["Active Teams", "Uptime SLA", "App Rating", "Revenue Saved"],
    },
    Fintech: {
      nums: ["\u20B950Cr+", "1M+", "0.1s", "4.9\u2605"],
      labels: ["Transactions", "Users", "Processing", "Trust Score"],
    },
    Health: {
      nums: ["500K+", "50K+", "98%", "24/7"],
      labels: ["Patients Helped", "Doctors", "Accuracy", "Support"],
    },
    EdTech: {
      nums: ["2M+", "10K+", "4.7\u2605", "95%"],
      labels: ["Students", "Courses", "Rating", "Completion"],
    },
    "E-commerce": {
      nums: ["1M+", "\u20B930Cr+", "4.8\u2605", "30min"],
      labels: ["Products", "GMV", "Rating", "Delivery"],
    },
    Social: {
      nums: ["5M+", "100M+", "4.6\u2605", "<1s"],
      labels: ["Users", "Posts", "Rating", "Load Time"],
    },
    "AI/ML": {
      nums: ["10M+", "99.5%", "50ms", "4.9\u2605"],
      labels: ["Predictions", "Accuracy", "Latency", "Rating"],
    },
    Gaming: {
      nums: ["3M+", "500K+", "4.8\u2605", "\u20B910Cr+"],
      labels: ["Players", "Daily Active", "Rating", "Prizes Won"],
    },
    Other: {
      nums: ["50K+", "99.9%", "4.9\u2605", "\u20B92Cr+"],
      labels: ["Users", "Uptime", "Rating", "Processed"],
    },
  };
  const stats = statSets[category] || statSets["Other"];

  // ── Testimonials ──
  const testimonialSets = [
    [
      {
        text: `${appName} completely changed how we approach ${category.toLowerCase()}. Saved us months of work and lakhs in cost.`,
        name: "Priya Sharma",
        role: "Founder, TechVentures Mumbai",
      },
      {
        text: `Best ${category.toLowerCase()} tool I've found. The UX is incredible and the results speak for themselves.`,
        name: "Arjun Mehta",
        role: "CTO, DataSync Bangalore",
      },
      {
        text: `We went from concept to launch in weeks using ${appName}. Our investors were impressed.`,
        name: "Sneha Patel",
        role: "CEO, GrowthPilot Delhi",
      },
    ],
    [
      {
        text: `${appName} is exactly what the Indian ${category.toLowerCase()} ecosystem needed. 10x productivity boost.`,
        name: "Rahul Verma",
        role: "VP Engineering, NovaTech Pune",
      },
      {
        text: `Switched from 3 different tools to just ${appName}. Everything in one place, brilliantly designed.`,
        name: "Ananya Krishnan",
        role: "Product Lead, FinFirst Chennai",
      },
      {
        text: `The ROI was visible from day one. ${appName} paid for itself within the first month.`,
        name: "Vikram Singh",
        role: "Co-founder, ScaleUp Gurugram",
      },
    ],
    [
      {
        text: `Our team's efficiency doubled after adopting ${appName}. Can't imagine going back.`,
        name: "Meera Joshi",
        role: "Director, CloudNine Hyderabad",
      },
      {
        text: `${appName} understands the Indian market like no other. The localization is perfect.`,
        name: "Karthik Rajan",
        role: "Head of Growth, PixelCraft Bangalore",
      },
      {
        text: `From a skeptic to an evangelist — ${appName} won me over with its simplicity and power.`,
        name: "Deepika Nair",
        role: "CTO, BrightMinds Kochi",
      },
    ],
  ];
  const testimonials =
    testimonialSets[appName.charCodeAt(0) % testimonialSets.length];

  // ── How It Works Steps ──
  const howSteps: Record<string, { titles: string[]; descs: string[] }> = {
    SaaS: {
      titles: ["Sign Up", "Connect", "Automate"],
      descs: [
        "Create your workspace in 30 seconds.",
        "Integrate with your existing tools seamlessly.",
        "Set up workflows and watch productivity soar.",
      ],
    },
    Fintech: {
      titles: ["Verify", "Link", "Transact"],
      descs: [
        "Complete KYC in under 2 minutes.",
        "Connect your bank accounts securely.",
        "Start sending and receiving money instantly.",
      ],
    },
    Health: {
      titles: ["Register", "Consult", "Track"],
      descs: [
        "Create your health profile quickly.",
        "Connect with certified doctors online.",
        "Monitor your health metrics in real-time.",
      ],
    },
    EdTech: {
      titles: ["Enroll", "Learn", "Certify"],
      descs: [
        "Pick from 10,000+ courses.",
        "Learn at your own pace with AI tutoring.",
        "Earn industry-recognized certificates.",
      ],
    },
    "E-commerce": {
      titles: ["Browse", "Order", "Receive"],
      descs: [
        "Discover products curated for you.",
        "Checkout in 2 taps with UPI.",
        "Get doorstep delivery across India.",
      ],
    },
    Other: {
      titles: ["Sign Up", "Setup", "Launch"],
      descs: [
        "Create your account in seconds.",
        "Configure everything with guided onboarding.",
        "Go live and see results from day one.",
      ],
    },
  };
  const steps = howSteps[category] || howSteps["Other"];

  // ── FAQ Items ──
  const faqItems = [
    {
      q: `What makes ${appName} different?`,
      a: summary.split(/\s+/).slice(0, 25).join(" ") + ".",
    },
    {
      q: `Is ${appName} available across India?`,
      a: `Yes! ${appName} works nationwide with support for UPI, all major banks, and localized experiences.`,
    },
    {
      q: "Can I upgrade or downgrade anytime?",
      a: "Absolutely. Switch plans whenever you want with instant prorated billing.",
    },
    {
      q: "Is my data secure?",
      a: "Bank-grade encryption, Indian data protection compliance, SOC 2 certified infrastructure.",
    },
    {
      q: `How do I get started with ${appName}?`,
      a: "Sign up free in 30 seconds. No credit card required. Start building immediately.",
    },
  ];

  // ── Pricing ──
  const pricingNames: Record<string, string[]> = {
    SaaS: ["Starter", "Growth", "Enterprise"],
    Fintech: ["Basic", "Business", "Enterprise"],
    EdTech: ["Student", "Professional", "Institution"],
    "E-commerce": ["Seller", "Business", "Enterprise"],
    Other: ["Starter", "Pro", "Enterprise"],
  };
  const plans = pricingNames[category] || pricingNames["Other"];
  const priceValues = revenue?.toLowerCase().includes("free")
    ? ["\u20B90", "\u20B9499", "\u20B92,499"]
    : ["\u20B90", "\u20B9999", "\u20B94,999"];

  // ── Variant Seed ──
  const sv = appName.length % 3;
  const cv = appName.charCodeAt(0) % 3;

  // ── Logo Cloud Brands ──
  const logoBrands: Record<string, string[]> = {
    SaaS: ["Zoho", "Freshworks", "Razorpay", "Swiggy", "Flipkart"],
    Fintech: ["PhonePe", "Paytm", "CRED", "Zerodha", "BharatPe"],
    Health: ["Practo", "PharmEasy", "1mg", "Cult.fit", "MediBuddy"],
    EdTech: ["BYJU'S", "Unacademy", "Vedantu", "upGrad", "Toppr"],
    "E-commerce": ["Myntra", "Meesho", "Nykaa", "BigBasket", "Dunzo"],
    Social: ["ShareChat", "Koo", "Moj", "Chingari", "Josh"],
    "AI/ML": ["Ola", "Fractal", "Mad Street Den", "Haptik", "Yellow.ai"],
    Gaming: ["MPL", "Dream11", "Games24x7", "Nazara", "WinZO"],
    Food: ["Zomato", "Swiggy", "EatFit", "FreshMenu", "Box8"],
    Travel: ["MakeMyTrip", "OYO", "Yatra", "ixigo", "Cleartrip"],
    Other: ["Razorpay", "Freshworks", "Zoho", "Flipkart", "Ola"],
  };
  const logos = logoBrands[category] || logoBrands["Other"];

  // ── Problem Old vs New ──
  const problemPairs: Record<string, { old: string[]; new_: string[] }> = {
    SaaS: {
      old: [
        "Manual spreadsheets",
        "5+ disconnected tools",
        "Hours of meetings",
      ],
      new_: [
        "One-click automation",
        "Single unified platform",
        "AI-powered insights",
      ],
    },
    Fintech: {
      old: ["Paper-based KYC", "3-day settlements", "Hidden charges"],
      new_: ["Instant eKYC", "Real-time transfers", "100% transparent fees"],
    },
    Health: {
      old: ["Long hospital queues", "Lost paper records", "Delayed diagnoses"],
      new_: [
        "Instant video consult",
        "Digital health records",
        "AI-assisted screening",
      ],
    },
    EdTech: {
      old: [
        "One-size-fits-all learning",
        "Expensive coaching",
        "Outdated content",
      ],
      new_: [
        "Personalized AI tutoring",
        "Affordable pricing",
        "Industry-fresh curriculum",
      ],
    },
    "E-commerce": {
      old: ["Limited local reach", "Cash-only payments", "Slow deliveries"],
      new_: [
        "Pan-India visibility",
        "UPI + all payment modes",
        "Same-day delivery",
      ],
    },
    Other: {
      old: [
        "Slow manual processes",
        "Scattered across tools",
        "No real analytics",
      ],
      new_: [
        "Instant automation",
        "All-in-one dashboard",
        "Real-time intelligence",
      ],
    },
  };
  const pp = problemPairs[category] || problemPairs["Other"];

  // ── CTA Text ──
  const ctaTexts = [
    `Start building with ${appName} today.`,
    `Join thousands already using ${appName}.`,
    `Your ${category.toLowerCase()} journey starts here.`,
  ];
  const ctaText = ctaTexts[cv];

  // ── Avatar Colors ──
  const avatarColors = [primary, accent, "#22C55E", "#1A1A1A"];

  // ═══════════════════════════════════════
  //  BUILD THE HTML — Properly Formatted
  // ═══════════════════════════════════════

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appName}</title>
  <style>
    /* ── Reset & Variables ── */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --p: ${primary};
      --ac: ${accent};
      --light: ${gradient1};
      --dark: #1A1A1A;
      --g1: ${gradient1};
      --g2: ${gradient2};
      --g3: ${gradient3};
      --glass: rgba(255, 255, 255, 0.15);
      --glass-border: rgba(255, 255, 255, 0.25);
      --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      --neu-bg: #e8e8e8;
      --neu-light: #ffffff;
      --neu-dark: #bebebe;
      --neu-shadow: 6px 6px 12px var(--neu-dark), -6px -6px 12px var(--neu-light);
      --neu-inset: inset 4px 4px 8px var(--neu-dark), inset -4px -4px 8px var(--neu-light);
      --brutal-shadow: 4px 4px 0 var(--dark);
    }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: var(--dark);
      scroll-behavior: smooth;
      background: var(--light);
      overflow-x: hidden;
    }

    /* ── 1. NAV — Glassmorphism ── */
    nav {
      position: fixed;
      top: 0;
      width: 100%;
      padding: 0.8rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--glass-border);
      z-index: 100;
    }
    nav .logo {
      font-size: 1.1rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.02em;
    }
    nav .logo span { color: var(--p); }
    nav .nav-btn {
      padding: 0.5rem 1.4rem;
      background: var(--p);
      color: #fff;
      border: none;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.3s;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      box-shadow: 0 4px 15px ${primary}40;
    }
    nav .nav-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px ${primary}60; }

    /* ── 2. HERO — Glassmorphism + Bauhaus Shapes ── */
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 7rem 2rem 4rem;
      background: linear-gradient(${135 + sv * 45}deg, var(--g1), var(--g2), var(--g3));
      background-size: 300% 300%;
      animation: grad-shift ${8 + sv * 3}s ease infinite;
      position: relative;
      overflow: hidden;
    }
    @keyframes grad-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    /* Bauhaus geometric shapes */
    .hero .geo {
      position: absolute;
      opacity: 0.07;
      animation: float 8s ease-in-out infinite;
    }
    .hero .geo-1 {
      width: ${120 + sv * 40}px;
      height: ${120 + sv * 40}px;
      background: var(--p);
      border-radius: 50%;
      top: 12%;
      right: 8%;
    }
    .hero .geo-2 {
      width: ${70 + sv * 25}px;
      height: ${70 + sv * 25}px;
      background: ${accent};
      transform: rotate(${45 + sv * 15}deg);
      bottom: 15%;
      left: 6%;
      animation-delay: 2s;
    }
    .hero .geo-3 {
      width: 0;
      height: 0;
      border-left: ${40 + sv * 15}px solid transparent;
      border-right: ${40 + sv * 15}px solid transparent;
      border-bottom: ${70 + sv * 20}px solid var(--p);
      top: 30%;
      left: 12%;
      animation-delay: 4s;
    }
    .hero .geo-4 {
      width: ${90 + sv * 20}px;
      height: ${90 + sv * 20}px;
      border: 4px solid var(--p);
      border-radius: 50%;
      bottom: 20%;
      right: 12%;
      animation-delay: 1s;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
      50% { transform: translateY(-20px) rotate(var(--r, 0deg)); }
    }
    /* Glass badge */
    .hero .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 1.2rem;
      border-radius: 99px;
      background: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(10px);
      border: 1px solid var(--glass-border);
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1.5rem;
      box-shadow: var(--glass-shadow);
    }
    .hero .badge span { color: var(--p); }
    .hero h1 {
      font-size: clamp(2.5rem, 7vw, 5rem);
      font-weight: 900;
      line-height: 1;
      text-transform: uppercase;
      letter-spacing: -0.04em;
      background: linear-gradient(135deg, var(--dark) 40%, var(--p));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero .subtitle {
      margin-top: 1rem;
      font-size: 1.05rem;
      color: #64748b;
      font-weight: 500;
    }
    .hero .hero-btns {
      display: flex;
      gap: 0.75rem;
      margin-top: 2rem;
      flex-wrap: wrap;
      justify-content: center;
    }
    .hero .hero-btns a {
      padding: 0.8rem 1.8rem;
      border-radius: 12px;
      font-weight: 700;
      text-decoration: none;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      transition: all 0.3s;
    }
    .hero .btn-primary {
      background: var(--p);
      color: #fff;
      box-shadow: 0 4px 20px ${primary}35;
    }
    .hero .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 30px ${primary}50; }
    .hero .btn-secondary {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      color: var(--dark);
      border: 1px solid var(--glass-border);
    }
    .hero .btn-secondary:hover { transform: translateY(-3px); background: rgba(255, 255, 255, 0.9); }
    .hero .trust {
      margin-top: 2rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.72rem;
      color: #94a3b8;
      font-weight: 600;
    }
    .hero .avatars { display: flex; }
    .hero .avatars span {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 2px solid #fff;
      margin-left: -7px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.6rem;
      font-weight: 800;
      color: #fff;
    }
    .hero .avatars span:first-child { margin-left: 0; }

    /* ── Shared ── */
    section { padding: 5rem 2rem; }
    .section-tag {
      display: inline-block;
      padding: 0.25rem 0.9rem;
      border-radius: 8px;
      background: ${primary}12;
      color: var(--p);
      font-size: 0.65rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.75rem;
    }
    .sh2 {
      text-align: center;
      font-size: 1.7rem;
      font-weight: 900;
      margin-bottom: 0.5rem;
      letter-spacing: -0.03em;
    }
    .sh-sub {
      text-align: center;
      color: #94a3b8;
      font-size: 0.85rem;
      margin-bottom: 2.5rem;
    }
    .fade-in {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in.visible { opacity: 1; transform: translateY(0); }

    /* ── 3. LOGO CLOUD — Bauhaus Bold ── */
    .logos {
      background: var(--dark);
      padding: 3rem 2rem;
      text-align: center;
    }
    .logos p {
      color: #94a3b8;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      margin-bottom: 1.5rem;
    }
    .logos .logo-row {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2.5rem;
      flex-wrap: wrap;
      max-width: 700px;
      margin: 0 auto;
    }
    .logos .logo-item {
      font-size: 0.85rem;
      font-weight: 900;
      color: #fff;
      opacity: 0.4;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 0.4rem 0;
      border-bottom: 3px solid var(--p);
      transition: opacity 0.3s;
    }
    .logos .logo-item:hover { opacity: 0.8; }

    /* ── 4. PROBLEM — Neumorphism ── */
    .problem {
      background: #e8e8e8;
      padding: 5rem 2rem;
    }
    .problem .compare {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 1.5rem;
      max-width: 800px;
      margin: 0 auto;
      align-items: center;
    }
    .problem .side {
      padding: 2rem;
      border-radius: 20px;
      background: #e8e8e8;
    }
    .problem .old-way {
      box-shadow: inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff;
    }
    .problem .new-way {
      box-shadow: 6px 6px 12px #bebebe, -6px -6px 12px #ffffff;
    }
    .problem .side h3 {
      font-size: 0.85rem;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 1rem;
      letter-spacing: 0.05em;
    }
    .problem .old-way h3 { color: #94a3b8; }
    .problem .new-way h3 { color: var(--p); }
    .problem .side ul { list-style: none; }
    .problem .side li {
      padding: 0.5rem 0;
      font-size: 0.8rem;
      color: #475569;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .problem .old-way li::before { content: "\\2717"; color: #ef4444; font-weight: 700; }
    .problem .new-way li::before { content: "\\2713"; color: var(--p); font-weight: 700; }
    .problem .vs {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--p);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 0.7rem;
      box-shadow: 0 4px 15px ${primary}40;
    }

    /* ── 5. FEATURES — Glassmorphism Cards ── */
    .features {
      background: linear-gradient(135deg, var(--g2) 0%, var(--g3) 100%);
      position: relative;
    }
    .features .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 1.25rem;
      max-width: 900px;
      margin: 0 auto;
    }
    .features .card {
      padding: 1.75rem;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.45);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: var(--glass-shadow);
      transition: all 0.3s;
    }
    .features .card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    }
    .features .card .icon {
      font-size: 1.6rem;
      margin-bottom: 0.75rem;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.8);
    }
    .features .card h3 {
      font-size: 0.85rem;
      font-weight: 800;
      margin-bottom: 0.4rem;
      text-transform: uppercase;
    }
    .features .card p { color: #64748b; font-size: 0.8rem; line-height: 1.5; }

    /* ── 6. HOW IT WORKS — Bauhaus Geometric ── */
    .how-it-works { background: var(--light); }
    .how-it-works .steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      max-width: 850px;
      margin: 0 auto;
      position: relative;
    }
    .how-it-works .step {
      text-align: center;
      padding: 2rem 1.25rem;
      position: relative;
      background: #fff;
      border-radius: 0;
      border: 3px solid var(--dark);
      transition: all 0.3s;
    }
    .how-it-works .step:nth-child(1) { border-radius: 20px 4px 20px 4px; }
    .how-it-works .step:nth-child(2) { border-radius: 4px 20px 4px 20px; }
    .how-it-works .step:nth-child(3) { border-radius: 20px 4px 20px 4px; }
    .how-it-works .step:hover { transform: translateY(-4px); box-shadow: 6px 6px 0 var(--p); }
    .how-it-works .step .num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: var(--p);
      color: #fff;
      font-weight: 900;
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }
    .how-it-works .step:nth-child(1) .num { border-radius: 50%; }
    .how-it-works .step:nth-child(2) .num { border-radius: 4px; }
    .how-it-works .step:nth-child(3) .num { border-radius: 50% 50% 50% 4px; }
    .how-it-works .step h3 {
      font-size: 0.9rem;
      font-weight: 800;
      margin-bottom: 0.4rem;
      text-transform: uppercase;
    }
    .how-it-works .step p { color: #64748b; font-size: 0.78rem; line-height: 1.5; }

    /* ── 7. STATS — Neumorphism Dark ── */
    .stats {
      background: #1e1e2e;
      text-align: center;
      padding: 4.5rem 2rem;
    }
    .stats .row {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
      max-width: 800px;
      margin: 0 auto;
    }
    .stats .stat {
      padding: 1.75rem 2rem;
      border-radius: 18px;
      background: #1e1e2e;
      box-shadow: 6px 6px 14px #151525, -6px -6px 14px #272737;
      min-width: 150px;
      transition: all 0.3s;
    }
    .stats .stat:hover { transform: translateY(-4px); }
    .stats .stat .num {
      font-size: 2.2rem;
      font-weight: 900;
      color: var(--p);
    }
    .stats .stat .label {
      margin-top: 0.3rem;
      color: #94a3b8;
      font-weight: 600;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* ── 8. SHOWCASE — Glass Panel Mockup ── */
    .showcase {
      background: linear-gradient(160deg, var(--g1), var(--g3));
      padding: 5rem 2rem;
      text-align: center;
    }
    .showcase .mockup-wrap {
      max-width: 520px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      animation: slow-float 5s ease-in-out infinite;
    }
    @keyframes slow-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    .showcase .mock-bar {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 14px;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(10px);
    }
    .showcase .mock-bar span {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .showcase .mock-bar span:nth-child(1) { background: #FF5F57; }
    .showcase .mock-bar span:nth-child(2) { background: #FEBC2E; }
    .showcase .mock-bar span:nth-child(3) { background: #28C840; }
    .showcase .mock-body {
      padding: 1.25rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .showcase .mock-card {
      background: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      border-radius: 12px;
      padding: 14px;
      text-align: left;
    }
    .showcase .mock-card .val {
      font-size: 1.15rem;
      font-weight: 900;
      color: var(--p);
    }
    .showcase .mock-card .lbl {
      font-size: 0.55rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      margin-top: 2px;
    }

    /* ── 9. TESTIMONIALS — Neobrutalism ── */
    .testimonials { background: var(--light); }
    .testimonials .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.25rem;
      max-width: 880px;
      margin: 0 auto;
    }
    .testimonials .quote {
      padding: 1.75rem;
      border-radius: 16px;
      background: #fff;
      border: 3px solid var(--dark);
      box-shadow: 5px 5px 0 var(--dark);
      position: relative;
      transition: all 0.2s;
    }
    .testimonials .quote:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 var(--p);
    }
    .testimonials .quote::before {
      content: '\\201C';
      font-size: 2.5rem;
      color: var(--p);
      opacity: 0.25;
      position: absolute;
      top: 8px;
      left: 14px;
      font-family: Georgia, serif;
    }
    .testimonials .stars {
      color: var(--p);
      font-size: 0.7rem;
      margin-bottom: 0.4rem;
    }
    .testimonials .quote p {
      font-size: 0.8rem;
      color: #475569;
      line-height: 1.55;
      margin-bottom: 0.75rem;
      padding-top: 0.5rem;
    }
    .testimonials .author {
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
    }
    .testimonials .role {
      font-size: 0.65rem;
      color: #94a3b8;
      font-weight: 600;
    }

    /* ── 10. PRICING — Glass + Neu Mix ── */
    .pricing { background: linear-gradient(135deg, var(--g1), var(--g2)); }
    .pricing .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .pricing .plan {
      padding: 2rem 1.5rem;
      border-radius: 18px;
      text-align: center;
      transition: all 0.3s;
      background: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow: var(--glass-shadow);
    }
    .pricing .plan:hover { transform: translateY(-5px); box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
    .pricing .plan.pop {
      background: var(--p);
      color: #fff;
      border: 3px solid var(--dark);
      box-shadow: 6px 6px 0 var(--dark);
      transform: scale(1.04);
      position: relative;
    }
    .pricing .plan.pop::before {
      content: "Popular";
      position: absolute;
      top: -11px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--dark);
      color: #fff;
      padding: 0.15rem 0.9rem;
      border-radius: 99px;
      font-size: 0.6rem;
      font-weight: 800;
      text-transform: uppercase;
    }
    .pricing .plan h3 { font-size: 0.9rem; font-weight: 800; text-transform: uppercase; }
    .pricing .plan .price {
      font-size: 2.2rem;
      font-weight: 900;
      margin: 0.5rem 0;
    }
    .pricing .plan .price span { font-size: 0.8rem; opacity: 0.7; }
    .pricing .plan ul { list-style: none; margin: 1.25rem 0; text-align: left; }
    .pricing .plan li { padding: 0.35rem 0; font-size: 0.78rem; }
    .pricing .plan li::before { content: "\\2713 "; color: var(--p); font-weight: 700; }
    .pricing .plan.pop li::before { color: #fff; }
    .pricing .plan.pop .price { color: #fff; }
    .pricing .plan .pbtn {
      display: inline-block;
      padding: 0.65rem 1.6rem;
      border-radius: 10px;
      font-weight: 700;
      text-decoration: none;
      font-size: 0.75rem;
      text-transform: uppercase;
      transition: all 0.3s;
      background: var(--p);
      color: #fff;
      box-shadow: 0 4px 12px ${primary}30;
    }
    .pricing .plan .pbtn:hover { transform: translateY(-2px); }
    .pricing .plan.pop .pbtn { background: #fff; color: var(--dark); box-shadow: var(--brutal-shadow); }

    /* ── 11. FAQ — Bauhaus Accent ── */
    .faq { background: var(--light); }
    .faq .items { max-width: 650px; margin: 0 auto; }
    .faq .item {
      border: 3px solid var(--dark);
      margin-bottom: 0.6rem;
      overflow: hidden;
      transition: all 0.2s;
    }
    .faq .item:nth-child(odd) { border-radius: 14px 4px 14px 4px; }
    .faq .item:nth-child(even) { border-radius: 4px 14px 4px 14px; }
    .faq .item:hover { box-shadow: 4px 4px 0 var(--p); }
    .faq .item summary {
      padding: 0.9rem 1.25rem;
      font-weight: 800;
      font-size: 0.82rem;
      cursor: pointer;
      list-style: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    .faq .item summary::after {
      content: '+';
      font-size: 1.1rem;
      font-weight: 900;
      color: var(--p);
      transition: transform 0.3s;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--p);
      border-radius: 50%;
    }
    .faq .item[open] summary::after { transform: rotate(45deg); }
    .faq .item .answer {
      padding: 0 1.25rem 1rem;
      font-size: 0.8rem;
      color: #64748b;
      line-height: 1.6;
      border-top: 2px dashed ${primary}25;
    }

    /* ── 12. CTA — Glassmorphism over dark ── */
    .cta-section {
      background: linear-gradient(135deg, #0f172a, #1e293b);
      text-align: center;
      padding: 5rem 2rem;
      position: relative;
      overflow: hidden;
    }
    .cta-section::before {
      content: '';
      position: absolute;
      width: 300px;
      height: 300px;
      background: var(--p);
      border-radius: 50%;
      filter: blur(120px);
      opacity: 0.15;
      top: -50px;
      right: -50px;
    }
    .cta-section .cta-glass {
      max-width: 500px;
      margin: 0 auto;
      padding: 2.5rem;
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(16px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .cta-section h2 {
      font-size: 1.6rem;
      font-weight: 900;
      text-transform: uppercase;
      color: #fff;
      margin-bottom: 0.5rem;
    }
    .cta-section .cta-sub { font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.75rem; }
    .cta-section form {
      display: flex;
      gap: 0.6rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .cta-section input {
      padding: 0.7rem 1.25rem;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.15);
      font-size: 0.85rem;
      width: 250px;
      max-width: 100%;
      background: rgba(255,255,255,0.08);
      color: #fff;
      outline: none;
    }
    .cta-section input::placeholder { color: #64748b; }
    .cta-section button {
      padding: 0.7rem 1.8rem;
      border-radius: 10px;
      background: var(--p);
      color: #fff;
      font-weight: 700;
      border: none;
      cursor: pointer;
      font-size: 0.8rem;
      text-transform: uppercase;
      transition: all 0.3s;
      box-shadow: 0 4px 15px ${primary}40;
    }
    .cta-section button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px ${primary}60; }

    /* ── FOOTER ── */
    footer {
      background: #0f172a;
      color: #64748b;
      text-align: center;
      padding: 2rem;
      font-size: 0.75rem;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    footer a { color: var(--p); text-decoration: none; font-weight: 600; }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .problem .compare { grid-template-columns: 1fr; }
      .problem .vs { margin: 0 auto; }
      .how-it-works .steps { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .hero h1 { font-size: 2.2rem; }
      .stats .row { gap: 1rem; }
      .pricing .plan.pop { transform: scale(1); }
    }
  </style>
</head>
<body>

  <!-- 1. NAV — Glassmorphism -->
  <nav>
    <div class="logo"><span>${appName.charAt(0)}</span>${appName.slice(1)}</div>
    <button class="nav-btn" onclick="document.querySelector('.cta-section').scrollIntoView({behavior:'smooth'})">Get Started</button>
  </nav>

  <!-- 2. HERO — Glassmorphism + Bauhaus Shapes -->
  <section class="hero">
    <div class="geo geo-1"></div>
    <div class="geo geo-2"></div>
    <div class="geo geo-3"></div>
    <div class="geo geo-4"></div>
    <div class="badge">${badge}</div>
    <h1>${appName}</h1>
    <p class="subtitle">${subtitle}</p>
    <div class="hero-btns">
      <a href="#features" class="btn-primary">Get Started Free</a>
      <a href="#pricing" class="btn-secondary">View Pricing</a>
    </div>
    <div class="trust">
      <div class="avatars">
        <span style="background:${avatarColors[0]}">P</span>
        <span style="background:${avatarColors[1]}">A</span>
        <span style="background:${avatarColors[2]}">S</span>
        <span style="background:${avatarColors[3]}">R</span>
      </div>
      Trusted by 10,000+ founders
    </div>
  </section>

  <!-- 3. LOGO CLOUD — Bauhaus Bold -->
  <section class="logos">
    <p>Trusted by leading companies across India</p>
    <div class="logo-row">
      <div class="logo-item fade-in">${logos[0]}</div>
      <div class="logo-item fade-in">${logos[1]}</div>
      <div class="logo-item fade-in">${logos[2]}</div>
      <div class="logo-item fade-in">${logos[3]}</div>
      <div class="logo-item fade-in">${logos[4]}</div>
    </div>
  </section>

  <!-- 4. PROBLEM — Neumorphism -->
  <section class="problem">
    <div style="text-align:center">
      <span class="section-tag" style="background:#d4d4d4;color:var(--dark);border:none">The Problem</span>
    </div>
    <h2 class="sh2">Old Way vs ${appName}</h2>
    <p class="sh-sub">Stop struggling. Start scaling.</p>
    <div class="compare">
      <div class="side old-way fade-in">
        <h3>❌ The Old Way</h3>
        <ul>
          <li>${pp.old[0]}</li>
          <li>${pp.old[1]}</li>
          <li>${pp.old[2]}</li>
        </ul>
      </div>
      <div class="vs">VS</div>
      <div class="side new-way fade-in">
        <h3>✅ The ${appName} Way</h3>
        <ul>
          <li>${pp.new_[0]}</li>
          <li>${pp.new_[1]}</li>
          <li>${pp.new_[2]}</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- 5. FEATURES — Glassmorphism Cards -->
  <section class="features" id="features">
    <div style="text-align:center">
      <span class="section-tag">Features</span>
    </div>
    <h2 class="sh2">Why Choose ${appName}</h2>
    <p class="sh-sub">Everything you need, nothing you don't.</p>
    <div class="grid">
      <div class="card fade-in">
        <div class="icon">${emojis[0]}</div>
        <h3>${featureNames[0]}</h3>
        <p>${featureDescs[0]}</p>
      </div>
      <div class="card fade-in">
        <div class="icon">${emojis[1]}</div>
        <h3>${featureNames[1]}</h3>
        <p>${featureDescs[1]}</p>
      </div>
      <div class="card fade-in">
        <div class="icon">${emojis[2]}</div>
        <h3>${featureNames[2]}</h3>
        <p>${featureDescs[2]}</p>
      </div>
      <div class="card fade-in">
        <div class="icon">${emojis[3]}</div>
        <h3>${featureNames[3]}</h3>
        <p>${featureDescs[3]}</p>
      </div>
    </div>
  </section>

  <!-- 6. HOW IT WORKS — Bauhaus Geometric -->
  <section class="how-it-works" id="how-it-works">
    <div style="text-align:center">
      <span class="section-tag">How It Works</span>
    </div>
    <h2 class="sh2">Three Simple Steps</h2>
    <p class="sh-sub">Get started in minutes, not months.</p>
    <div class="steps">
      <div class="step fade-in">
        <div class="num">1</div>
        <h3>${steps.titles[0]}</h3>
        <p>${steps.descs[0]}</p>
      </div>
      <div class="step fade-in">
        <div class="num">2</div>
        <h3>${steps.titles[1]}</h3>
        <p>${steps.descs[1]}</p>
      </div>
      <div class="step fade-in">
        <div class="num">3</div>
        <h3>${steps.titles[2]}</h3>
        <p>${steps.descs[2]}</p>
      </div>
    </div>
  </section>

  <!-- 7. STATS — Neumorphism Dark -->
  <section class="stats">
    <div style="text-align:center">
      <span class="section-tag" style="background:rgba(255,255,255,0.06);color:var(--p)">By The Numbers</span>
    </div>
    <h2 class="sh2" style="color:#fff">Trusted Across India</h2>
    <p class="sh-sub" style="color:#64748b">Numbers that speak for themselves.</p>
    <div class="row">
      <div class="stat fade-in">
        <div class="num">${stats.nums[0]}</div>
        <div class="label">${stats.labels[0]}</div>
      </div>
      <div class="stat fade-in">
        <div class="num">${stats.nums[1]}</div>
        <div class="label">${stats.labels[1]}</div>
      </div>
      <div class="stat fade-in">
        <div class="num">${stats.nums[2]}</div>
        <div class="label">${stats.labels[2]}</div>
      </div>
      <div class="stat fade-in">
        <div class="num">${stats.nums[3]}</div>
        <div class="label">${stats.labels[3]}</div>
      </div>
    </div>
  </section>

  <!-- 8. SHOWCASE — Glassmorphism Mockup -->
  <section class="showcase">
    <div style="text-align:center">
      <span class="section-tag">Preview</span>
    </div>
    <h2 class="sh2">${appName} In Action</h2>
    <p class="sh-sub">Beautiful, intuitive, powerful.</p>
    <div class="mockup-wrap fade-in">
      <div class="mock-bar">
        <span></span><span></span><span></span>
      </div>
      <div class="mock-body">
        <div class="mock-card">
          <div class="val">${stats.nums[0]}</div>
          <div class="lbl">${stats.labels[0]}</div>
        </div>
        <div class="mock-card">
          <div class="val">${stats.nums[1]}</div>
          <div class="lbl">${stats.labels[1]}</div>
        </div>
        <div class="mock-card">
          <div class="val">${stats.nums[2]}</div>
          <div class="lbl">${stats.labels[2]}</div>
        </div>
        <div class="mock-card">
          <div class="val">${stats.nums[3]}</div>
          <div class="lbl">${stats.labels[3]}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- 9. TESTIMONIALS — Neobrutalism -->
  <section class="testimonials">
    <div style="text-align:center">
      <span class="section-tag">Testimonials</span>
    </div>
    <h2 class="sh2">Loved by Founders</h2>
    <p class="sh-sub">Real stories from real builders.</p>
    <div class="grid">
      <div class="quote fade-in">
        <div class="stars">★★★★★</div>
        <p>${testimonials[0].text}</p>
        <div class="author">${testimonials[0].name}</div>
        <div class="role">${testimonials[0].role}</div>
      </div>
      <div class="quote fade-in">
        <div class="stars">★★★★★</div>
        <p>${testimonials[1].text}</p>
        <div class="author">${testimonials[1].name}</div>
        <div class="role">${testimonials[1].role}</div>
      </div>
      <div class="quote fade-in">
        <div class="stars">★★★★★</div>
        <p>${testimonials[2].text}</p>
        <div class="author">${testimonials[2].name}</div>
        <div class="role">${testimonials[2].role}</div>
      </div>
    </div>
  </section>

  <!-- 10. PRICING — Glass + Neu Mix -->
  <section class="pricing" id="pricing">
    <div style="text-align:center">
      <span class="section-tag">Pricing</span>
    </div>
    <h2 class="sh2">Simple, Transparent Pricing</h2>
    <p class="sh-sub">Start free. Scale as you grow.</p>
    <div class="grid">
      <div class="plan fade-in">
        <h3>${plans[0]}</h3>
        <div class="price">${priceValues[0]}</div>
        <ul>
          <li>Up to 3 projects</li>
          <li>Basic analytics</li>
          <li>Community support</li>
        </ul>
        <a href="#" class="pbtn">Get Started</a>
      </div>
      <div class="plan pop fade-in">
        <h3>${plans[1]}</h3>
        <div class="price">${priceValues[1]}<span>/mo</span></div>
        <ul>
          <li>Unlimited projects</li>
          <li>Advanced analytics</li>
          <li>Priority support</li>
          <li>Custom integrations</li>
        </ul>
        <a href="#" class="pbtn">Upgrade</a>
      </div>
      <div class="plan fade-in">
        <h3>${plans[2]}</h3>
        <div class="price">${priceValues[2]}<span>/mo</span></div>
        <ul>
          <li>Everything in ${plans[1]}</li>
          <li>Dedicated manager</li>
          <li>SLA guarantee</li>
          <li>Custom deployment</li>
        </ul>
        <a href="#" class="pbtn">Contact Us</a>
      </div>
    </div>
  </section>

  <!-- 11. FAQ — Bauhaus Accent -->
  <section class="faq" id="faq">
    <div style="text-align:center">
      <span class="section-tag">FAQ</span>
    </div>
    <h2 class="sh2">Got Questions?</h2>
    <p class="sh-sub">Answers to common questions.</p>
    <div class="items">
      <details class="item">
        <summary>${faqItems[0].q}</summary>
        <div class="answer">${faqItems[0].a}</div>
      </details>
      <details class="item">
        <summary>${faqItems[1].q}</summary>
        <div class="answer">${faqItems[1].a}</div>
      </details>
      <details class="item">
        <summary>${faqItems[2].q}</summary>
        <div class="answer">${faqItems[2].a}</div>
      </details>
      <details class="item">
        <summary>${faqItems[3].q}</summary>
        <div class="answer">${faqItems[3].a}</div>
      </details>
      <details class="item">
        <summary>${faqItems[4].q}</summary>
        <div class="answer">${faqItems[4].a}</div>
      </details>
    </div>
  </section>

  <!-- 12. CTA — Glassmorphism over Dark -->
  <section class="cta-section">
    <div class="cta-glass">
      <h2>Ready to Get Started?</h2>
      <p class="cta-sub">${ctaText}</p>
      <form onsubmit="event.preventDefault()">
        <input type="email" placeholder="Enter your email" required>
        <button type="submit">Sign Up Free</button>
      </form>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <p>&copy; 2026 ${appName}. All rights reserved. &nbsp;|&nbsp; <a href="#">Privacy</a> &nbsp;|&nbsp; <a href="#">Terms</a></p>
  </footer>

  <script>
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(function(el) { obs.observe(el); });
    document.addEventListener('click', function(e) {
      var a = e.target.closest('a');
      if (a) {
        e.preventDefault();
        var h = a.getAttribute('href');
        if (h && h.startsWith('#') && h.length > 1) {
          var el = document.querySelector(h);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  </script>
</body>
</html>`;

  return html;
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
      const skip = new Set([
        "a",
        "an",
        "the",
        "for",
        "to",
        "of",
        "in",
        "on",
        "and",
        "or",
        "is",
        "it",
        "that",
        "with",
        "as",
        "by",
        "this",
        "from",
        "at",
        "my",
        "your",
        "our",
        "just",
        "very",
        "really",
        "also",
        "about",
        "based",
        "using",
        "use",
        "new",
        "get",
        "app",
        "platform",
        "tool",
        "system",
        "service",
        "website",
        "software",
        "build",
        "create",
        "make",
        "like",
        "want",
        "need",
        "can",
        "will",
        "would",
        "should",
        "could",
        "online",
        "digital",
        "smart",
        "ai",
        "store",
        "shop",
        "marketplace",
        "ecommerce",
        "sell",
        "buy",
        "selling",
        "buying",
        "market",
        "help",
        "helps",
        "people",
        "users",
        "manage",
        "simple",
        "easy",
        "best",
        "good",
        "great",
      ]);
      const w = analysis.idea
        .split(/\s+/)
        .filter((w: string) => !skip.has(w.toLowerCase()) && w.length > 2);
      const suffixes = [
        "ly",
        "ify",
        "io",
        "Hub",
        "Sync",
        "Flow",
        "Nest",
        "Base",
        "Mint",
        "Wave",
        "Pulse",
        "Spark",
        "Cart",
        "Verse",
        "Stack",
      ];
      if (w.length >= 1) {
        const cw = w[w.length - 1];
        const s = cw.endsWith("s") && cw.length > 3 ? cw.slice(0, -1) : cw;
        const core = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        analysis.appName =
          core + suffixes[core.charCodeAt(0) % suffixes.length];
      } else {
        analysis.appName = "LaunchPad";
      }
      await Analysis.updateOne(
        { _id: analysisId },
        { $set: { appName: analysis.appName } },
      );
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
      generatedFiles = generatedFiles.map(
        (f: { path: string; content: string; lang: string }) => ({
          ...f,
          content:
            typeof f.content === "string"
              ? f.content
                  .replace(/\\n/g, "\n")
                  .replace(/\\t/g, "\t")
                  .replace(/\\r/g, "")
              : f.content,
        }),
      );
      // ALWAYS use our handcrafted preview.html — AI-generated previews are unreliable
      generatedFiles = generatedFiles.filter(
        (f: { path: string }) => f.path !== "preview.html",
      );
      generatedFiles.push({
        path: "preview.html",
        content: buildFallbackPreview({
          idea: analysis.idea,
          appName,
          target: analysis.target,
          problem: analysis.problem,
          category: analysis.category || "Other",
          summary: analysis.summary,
          strengths: analysis.strengths || [],
          recommendations: analysis.recommendations || [],
          revenue: analysis.revenue,
        }),
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
          content: buildFallbackPreview({
            idea: analysis.idea,
            appName,
            target: analysis.target,
            problem: analysis.problem,
            category: analysis.category || "Other",
            summary: analysis.summary,
            strengths: analysis.strengths || [],
            recommendations: analysis.recommendations || [],
            revenue: analysis.revenue,
          }),
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

    const techStack = [
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "React 18",
      "HTML",
      "CSS",
      "JavaScript",
    ];

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
