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
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:6rem 2rem 4rem;background:linear-gradient(135deg,#FFFBF5,#FFF0E0,#FFE8CC,#FFFBF5);background-size:400% 400%;animation:heroGradient 8s ease infinite;position:relative;overflow:hidden}
@keyframes heroGradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.hero .shape{position:absolute;border:3px solid var(--primary);opacity:0.07;animation:float 6s ease-in-out infinite}
.hero .shape-1{width:180px;height:180px;border-radius:50%;top:10%;right:8%;animation-delay:0s}
.hero .shape-2{width:100px;height:100px;border-radius:18px;transform:rotate(45deg);bottom:15%;left:6%;animation-delay:1.5s}
.hero .shape-3{width:60px;height:60px;border-radius:50%;top:30%;left:12%;background:var(--primary);opacity:0.04;animation-delay:3s}
.hero .shape-4{width:120px;height:120px;border-radius:24px;transform:rotate(12deg);bottom:20%;right:12%;border-color:var(--dark);opacity:0.04;animation-delay:2s}
.hero .badge{display:inline-flex;align-items:center;gap:0.5rem;padding:0.4rem 1.2rem;border-radius:99px;background:#fff;border:2px solid var(--dark);box-shadow:3px 3px 0 var(--dark);font-size:0.7rem;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1.5rem;color:var(--dark)}
.hero .badge span{color:var(--primary)}
.hero h1{font-size:clamp(2.5rem,6vw,4rem);font-weight:900;line-height:1.05;max-width:700px;text-transform:uppercase;letter-spacing:-0.03em;background:linear-gradient(135deg,var(--dark),var(--primary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;position:relative}
.hero h1::after{content:'';position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);width:60%;height:4px;border-radius:4px;background:linear-gradient(90deg,transparent,var(--primary),transparent)}
.hero .glow{position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(255,104,3,0.12) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;animation:pulseGlow 4s ease-in-out infinite}
@keyframes pulseGlow{0%,100%{opacity:0.6;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.3)}}
.hero .mockup{margin-top:3rem;width:min(90%,500px);background:#fff;border:3px solid var(--dark);border-radius:16px;box-shadow:8px 8px 0 var(--dark);overflow:hidden;animation:floatMockup 4s ease-in-out infinite}
@keyframes floatMockup{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.hero .mockup-bar{display:flex;align-items:center;gap:6px;padding:10px 14px;background:var(--dark);border-bottom:2px solid var(--dark)}
.hero .mockup-bar span{width:10px;height:10px;border-radius:50%;border:1.5px solid #555}
.hero .mockup-bar span:nth-child(1){background:#FF5F57;border-color:#E0443E}
.hero .mockup-bar span:nth-child(2){background:#FEBC2E;border-color:#DEA123}
.hero .mockup-bar span:nth-child(3){background:#28C840;border-color:#1AAB29}
.hero .mockup-body{padding:1.2rem;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.hero .mockup-body .mock-card{background:var(--light);border:2px solid var(--dark);border-radius:10px;padding:12px;text-align:left}
.hero .mockup-body .mock-card .mock-val{font-size:1.1rem;font-weight:900;color:var(--primary)}
.hero .mockup-body .mock-card .mock-label{font-size:0.55rem;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-top:2px}
.hero p{margin-top:1rem;font-size:1.05rem;color:#64748b;max-width:500px;line-height:1.6}
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
.features{background:#fff;border-top:3px solid var(--dark);border-bottom:3px solid var(--dark)}
.features h2,.how-it-works h2,.stats h2,.testimonials h2,.pricing h2,.faq h2{text-align:center;font-size:1.8rem;font-weight:900;margin-bottom:2.5rem;text-transform:uppercase;letter-spacing:-0.02em}
.features .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;max-width:900px;margin:0 auto}
.features .card{padding:2rem;border-radius:18px;background:var(--light);border:2px solid var(--dark);box-shadow:var(--shadow);transition:transform 0.2s,box-shadow 0.2s}
.features .card:hover{transform:translateY(-4px);box-shadow:6px 6px 0 var(--primary)}
.features .card .icon{font-size:1.8rem;margin-bottom:0.75rem}
.features .card h3{font-size:1rem;font-weight:800;margin-bottom:0.5rem;text-transform:uppercase}
.features .card p{color:#64748b;line-height:1.5;font-size:0.875rem}
.how-it-works{background:var(--light)}
.how-it-works .steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem;max-width:900px;margin:0 auto}
.how-it-works .step{text-align:center;padding:2rem 1.5rem;border-radius:18px;background:#fff;border:2px solid var(--dark);box-shadow:var(--shadow);transition:transform 0.2s}
.how-it-works .step:hover{transform:translateY(-4px)}
.how-it-works .step .num{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:12px;background:var(--primary);color:#fff;font-weight:900;font-size:1.1rem;margin-bottom:1rem;border:2px solid var(--dark);box-shadow:2px 2px 0 var(--dark)}
.how-it-works .step h3{font-size:0.95rem;font-weight:800;margin-bottom:0.5rem;text-transform:uppercase}
.how-it-works .step p{color:#64748b;font-size:0.8rem;line-height:1.5}
.stats{background:var(--dark);color:#fff;text-align:center}
.stats .row{display:flex;justify-content:center;gap:3rem;flex-wrap:wrap}
.stats .stat .num{font-size:2.5rem;font-weight:900;color:var(--primary)}
.stats .stat .label{margin-top:0.25rem;color:#94a3b8;font-weight:700;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em}
.testimonials{background:#fff;border-top:3px solid var(--dark)}
.testimonials .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-width:900px;margin:0 auto}
.testimonials .quote{padding:2rem;border-radius:18px;background:var(--light);border:2px solid var(--dark);box-shadow:var(--shadow);position:relative}
.testimonials .quote::before{content:'\\201C';font-size:3rem;color:var(--primary);opacity:0.3;position:absolute;top:10px;left:16px;font-family:Georgia,serif}
.testimonials .quote p{font-size:0.875rem;color:#475569;line-height:1.6;margin-bottom:1rem;padding-top:1rem}
.testimonials .quote .author{font-size:0.8rem;font-weight:800;color:var(--dark);text-transform:uppercase}.testimonials .quote .role{font-size:0.7rem;color:#94a3b8;font-weight:600}
.pricing{background:var(--light)}
.pricing .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem;max-width:850px;margin:0 auto}
.pricing .plan{padding:2rem;border-radius:18px;border:2px solid var(--dark);text-align:center;transition:transform 0.2s;box-shadow:var(--shadow);background:#fff}
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
.faq{background:#fff;border-top:3px solid var(--dark)}
.faq .items{max-width:700px;margin:0 auto}
.faq .item{border:2px solid var(--dark);border-radius:14px;margin-bottom:0.75rem;overflow:hidden;box-shadow:2px 2px 0 var(--dark)}
.faq .item summary{padding:1rem 1.5rem;font-weight:800;font-size:0.9rem;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;background:var(--light);text-transform:uppercase;letter-spacing:0.02em}
.faq .item summary::after{content:'+';font-size:1.2rem;font-weight:900;color:var(--primary);transition:transform 0.2s}
.faq .item[open] summary::after{transform:rotate(45deg)}
.faq .item .answer{padding:0 1.5rem 1rem;font-size:0.85rem;color:#64748b;line-height:1.6}
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
@media(max-width:640px){.hero h1{font-size:2rem}.hero .mockup{width:95%}.hero .mockup-body{grid-template-columns:1fr 1fr}.stats .row{gap:2rem}.pricing .plan.popular{transform:scale(1)}.how-it-works .steps{grid-template-columns:1fr}}
</style>
</head>
<body>
<nav><div class="logo">${appName}</div><button class="cta" onclick="document.querySelector('.cta-section').scrollIntoView({behavior:'smooth'})">Get Started</button></nav>

<section class="hero"><div class="shape shape-1"></div><div class="shape shape-2"></div><div class="shape shape-3"></div><div class="shape shape-4"></div><div class="glow"></div><div class="badge">\u{1F680} <span>#1 Platform</span> in India</div><h1>${appName}</h1><p>Build. Launch. Scale. Faster than ever.</p><div class="btns"><a href="#features" class="primary">Get Started Free</a><a href="#pricing" class="secondary">View Pricing</a></div><div class="trust"><div class="avatars"><span style="background:#FF6803">P</span><span style="background:#6366F1">A</span><span style="background:#22C55E">S</span><span style="background:#1A1A1A">R</span></div>Trusted by 10,000+ founders</div><div class="mockup"><div class="mockup-bar"><span></span><span></span><span></span></div><div class="mockup-body"><div class="mock-card"><div class="mock-val">50K+</div><div class="mock-label">Active Users</div></div><div class="mock-card"><div class="mock-val">99.9%</div><div class="mock-label">Uptime</div></div><div class="mock-card"><div class="mock-val">\u20B92Cr+</div><div class="mock-label">Processed</div></div><div class="mock-card"><div class="mock-val">4.9\u2605</div><div class="mock-label">Rating</div></div></div></div></section>

<section class="features" id="features"><h2>Why Choose ${appName}</h2><div class="grid"><div class="card fade-in"><div class="icon">\u26A1</div><h3>Lightning Fast</h3><p>Built for speed and performance from the ground up.</p></div><div class="card fade-in"><div class="icon">\u{1F6E1}\uFE0F</div><h3>Secure by Default</h3><p>Enterprise-grade security built into every layer.</p></div><div class="card fade-in"><div class="icon">\u{1F680}</div><h3>Scale Effortlessly</h3><p>Grows with your business without breaking a sweat.</p></div><div class="card fade-in"><div class="icon">\u{1F4CA}</div><h3>Smart Analytics</h3><p>Real-time insights and data-driven decisions.</p></div></div></section>

<section class="how-it-works" id="how-it-works"><h2>How It Works</h2><div class="steps"><div class="step fade-in"><div class="num">1</div><h3>Sign Up</h3><p>Create your free account in under 30 seconds.</p></div><div class="step fade-in"><div class="num">2</div><h3>Setup</h3><p>Configure your workspace with our guided onboarding.</p></div><div class="step fade-in"><div class="num">3</div><h3>Launch</h3><p>Go live and start seeing results from day one.</p></div></div></section>

<section class="stats"><h2>Trusted Across India</h2><div class="row"><div class="stat fade-in"><div class="num">50K+</div><div class="label">Users Across India</div></div><div class="stat fade-in"><div class="num">99.9%</div><div class="label">Uptime</div></div><div class="stat fade-in"><div class="num">4.9\u2605</div><div class="label">Rating</div></div></div></section>

<section class="testimonials"><h2>What Our Users Say</h2><div class="grid"><div class="quote fade-in"><p>This platform completely transformed how we operate. We saved over \u20B920L in the first year alone.</p><div class="author">Priya Sharma</div><div class="role">Founder, TechVentures Mumbai</div></div><div class="quote fade-in"><p>The best tool I\u2019ve used for my startup. Clean UI, fast performance, and incredible support.</p><div class="author">Arjun Mehta</div><div class="role">CTO, DataSync Bangalore</div></div><div class="quote fade-in"><p>We went from idea to launch in weeks. Highly recommend for any Indian startup founder.</p><div class="author">Sneha Patel</div><div class="role">CEO, GrowthPilot Delhi</div></div></div></section>

<section class="pricing" id="pricing"><h2>Simple Pricing</h2><div class="grid"><div class="plan fade-in"><h3>Starter</h3><div class="price">\u20B90</div><ul><li>Up to 3 projects</li><li>Basic analytics</li><li>Community support</li></ul><a href="#" class="btn">Get Started</a></div><div class="plan popular fade-in"><h3>Pro</h3><div class="price">\u20B9999<span>/mo</span></div><ul><li>Unlimited projects</li><li>Advanced analytics</li><li>Priority support</li><li>Custom integrations</li></ul><a href="#" class="btn">Upgrade</a></div><div class="plan fade-in"><h3>Enterprise</h3><div class="price">\u20B94,999<span>/mo</span></div><ul><li>Everything in Pro</li><li>Dedicated manager</li><li>SLA guarantee</li><li>Custom deployment</li></ul><a href="#" class="btn">Contact Us</a></div></div></section>

<section class="faq" id="faq"><h2>Got Questions?</h2><div class="items"><details class="item"><summary>How do I get started?</summary><div class="answer">Simply create a free account and follow our guided onboarding. You\u2019ll be up and running in minutes.</div></details><details class="item"><summary>Can I upgrade or downgrade anytime?</summary><div class="answer">Yes! You can switch plans at any time. Changes take effect immediately with prorated billing.</div></details><details class="item"><summary>Is my data secure?</summary><div class="answer">Absolutely. We use bank-grade encryption and comply with all Indian data protection regulations.</div></details><details class="item"><summary>Do you offer refunds?</summary><div class="answer">We offer a 14-day money-back guarantee. No questions asked.</div></details></div></section>

<section class="cta-section"><h2>Ready to Get Started?</h2><p>Join 50,000+ founders building with ${appName}.</p><form onsubmit="event.preventDefault();alert('Thanks for signing up!')"><input type="email" placeholder="Enter your email" required><button type="submit">Sign Up Free</button></form></section>

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

    const appName = analysis.appName || analysis.idea.split(" ").filter((w: string) => w.length > 3).pop() || "LaunchPad";

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
        content: buildFallbackPreview(appName, analysis.idea, analysis.summary),
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
