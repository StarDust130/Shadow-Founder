<div align="center">

# 🕶️ Shadow Founder

### _Your AI Co-Founder That Doesn't Sugarcoat_

**Validate startup ideas with ruthless AI honesty → Get scored → Build your MVP in seconds**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-shadowfounder.tech-FF6803?style=for-the-badge&labelColor=1A1A1A)](https://shadowfounder.tech/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

<br/>

> 🚀 **Most founders waste months building something nobody wants.**
> Shadow Founder tells you the truth in 30 seconds — then builds your MVP if it's worth it.

<br/>

</div>

---

## 🤔 What is Shadow Founder?

Shadow Founder is an **AI-powered startup validation & MVP generation platform** built for the Indian startup ecosystem. It acts as your brutally honest co-founder that:

1. **🔍 Validates** your startup idea using AI (scores it 0-100)
2. **💬 Coaches** you with follow-up AI chat for strategy refinement
3. **⚡ Builds** a complete MVP codebase with a stunning landing page
4. **📦 Exports** everything as a downloadable ZIP — ready to deploy

No fluff. No "great idea!" fakery. Just raw, data-backed analysis and actionable output.

---

## ✨ Features

### 🎯 AI Startup Validator

- Submit your idea with target audience, problem, revenue model & competitors
- Get a **0-100 viability score** with verdict: `VIABLE` · `CONDITIONAL PASS` · `RISKY` · `NOT VIABLE`
- Deep analysis: TAM, competition level, revenue potential, feasibility, India market fit, MVP time, scalability, user acquisition
- **Strengths**, **weaknesses**, **recommendations**, **failure risks**, **founder checklist**
- Competitor analysis with **big players** breakdown (strengths & weaknesses)
- **Monetization strategies** tailored to your idea
- Illegal/harmful ideas get auto-rejected with a score of 0 🚫

### 💬 AI Strategy Chat

- Follow-up conversation with Shadow Founder AI after validation
- Ask about pivots, GTM strategy, fundraising, tech stack decisions
- Full conversation history persisted to your account
- Streaming responses for real-time feel

### ⚡ MVP Code Generator

- One-click MVP generation from any validated idea
- Generates **complete codebase**: `package.json`, pages, layouts, components, config
- **Stunning landing page** (`preview.html`) with 12 sections:
  - Nav (Glassmorphism) · Hero (Glass + Bauhaus shapes) · Logo Cloud (Bauhaus) · Problem Old vs New (Neumorphism) · Features (Glassmorphism cards) · How It Works (Bauhaus geometric) · Stats (Neumorphism dark) · Showcase (Glass mockup) · Testimonials (Neobrutalism) · Pricing (Glass + Neu mix) · FAQ (Bauhaus accent) · CTA (Glass over dark)
- **10 unique color themes** per category (SaaS, Fintech, Health, EdTech, E-commerce, Social, AI/ML, Gaming, Food, Travel)
- All prices in **₹ (INR)** with Indian names & cities
- Live preview in sandboxed iframe
- 🎉 **Confetti celebration** when your MVP is ready!

### 📁 Assembly (Code Viewer)

- Interactive file tree explorer
- Syntax-highlighted code viewer
- Copy individual files to clipboard
- **Download entire project as ZIP**
- Toggle between **Code** and **Preview** modes
- Edit popup for customization tips

### 👤 Profile & Plans

- **Free Plan**: 1 MVP build
- **Pro Plan**: 10 MVP builds
- **Enterprise Plan**: Unlimited builds
- Build usage tracking
- Coming soon: Dark Mode, API Keys, GitHub/Slack integrations, Team Access

---

## 🏗️ Tech Stack

| Layer             | Technology                              | Why                                            |
| :---------------- | :-------------------------------------- | :--------------------------------------------- |
| 🖥️ **Framework**  | Next.js 16 (App Router)                 | Server components, API routes, streaming       |
| ⚛️ **UI**         | React 19                                | Latest concurrent features                     |
| 🎨 **Styling**    | Tailwind CSS 4                          | Utility-first, rapid prototyping               |
| 🎭 **Animations** | Framer Motion                           | Smooth page transitions & micro-interactions   |
| 🤖 **AI**         | Groq SDK (LLaMA 3.3 70B + GPT-OSS 120B) | Ultra-fast inference for validation & code gen |
| 🗄️ **Database**   | MongoDB Atlas + Mongoose                | Flexible schema for analyses & builds          |
| 🔐 **Auth**       | Clerk                                   | Social login, session management, middleware   |
| 📦 **Export**     | JSZip                                   | Client-side ZIP generation                     |
| 🎉 **Confetti**   | canvas-confetti                         | Celebration effects                            |
| 🎨 **Icons**      | Lucide React                            | Beautiful consistent icons                     |
| 📊 **Analytics**  | Vercel Analytics                        | Production monitoring                          |

---

## 📂 Project Structure

```
shadow-founder/
├── app/
│   ├── page.tsx                    # 🏠 Landing page
│   ├── layout.tsx                  # Root layout (Clerk provider, fonts)
│   ├── globals.css                 # Global styles
│   ├── loading.tsx                 # Root loading spinner
│   │
│   ├── (auth)/                     # 🔐 Auth pages
│   │   ├── sign-in/[[...sign-in]]/ # Sign in
│   │   └── sign-up/[[...sign-up]]/ # Sign up
│   │
│   ├── (dashboard)/                # 📊 Protected dashboard
│   │   ├── layout.tsx              # Dashboard shell (sidebar, nav)
│   │   ├── dashboard/page.tsx      # Hub — all analyses
│   │   ├── validator/page.tsx      # 🎯 Submit ideas for validation
│   │   ├── builder/page.tsx        # ⚡ Build MVP from analyses
│   │   ├── analysis/[id]/page.tsx  # 📋 Deep analysis + AI chat
│   │   ├── assembly/[id]/page.tsx  # 📁 Code viewer + preview
│   │   └── profile/page.tsx        # 👤 User profile & plans
│   │
│   ├── api/
│   │   ├── validate/route.ts       # 🤖 AI validation endpoint
│   │   ├── generate/route.ts       # ⚡ MVP code generation
│   │   ├── analyses/route.ts       # 📋 List all analyses
│   │   ├── analyses/[id]/route.ts  # 📋 Single analysis CRUD
│   │   ├── analyses/[id]/chat/     # 💬 AI chat streaming
│   │   ├── builds/[id]/route.ts    # 📦 Fetch build data
│   │   └── user/route.ts           # 👤 User profile & plan
│   │
│   └── sso-callback/page.tsx       # OAuth callback handler
│
├── lib/
│   ├── mongodb.ts                  # Database connection
│   └── models/
│       ├── Analysis.ts             # Analysis schema
│       ├── Build.ts                # Build schema
│       └── User.ts                 # User schema
│
├── public/                         # Static assets
├── proxy.ts                        # Clerk middleware
├── next.config.ts                  # Next.js config
├── tailwind.config.ts              # Tailwind config
└── package.json                    # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+
- **MongoDB Atlas** account (free tier works)
- **Clerk** account (free tier works)
- **Groq** API key (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/StarDust130/Shadow-Founder.git
cd Shadow-Founder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
# 🗄️ MongoDB
MONGO_DB_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/shadow-founder?retryWrites=true&w=majority

# 🤖 Groq AI
QROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 🔐 Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_xxxxxxxxxxxxxxxx
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start validating ideas! 🎯

---

## 🔌 API Reference

### Validate an Idea

```
POST /api/validate
```

```json
{
  "idea": "AI-powered grocery delivery for tier-2 Indian cities",
  "target": "Busy professionals in smaller cities",
  "problem": "No reliable quick delivery in tier-2 cities",
  "category": "E-commerce",
  "revenue": "Commission + delivery fees",
  "competitors": "Swiggy Instamart, Zepto"
}
```

**Response**: Analysis object with score (0-100), verdict, metrics, strengths, weaknesses, recommendations, failure risks, monetization strategies.

### Generate MVP

```
POST /api/generate
```

```json
{
  "analysisId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

**Response**: Build object with complete file tree (package.json, pages, components, preview.html).

### AI Chat

```
POST /api/analyses/:id/chat
```

```json
{
  "messages": [
    { "role": "user", "content": "How should I approach fundraising for this?" }
  ]
}
```

**Response**: Server-sent event stream with AI strategy advice.

---

## 🎨 Design System

Shadow Founder uses a **Neobrutalism** design language across the dashboard:

| Token          | Value               | Usage                           |
| :------------- | :------------------ | :------------------------------ |
| `Primary`      | `#FF6803`           | Buttons, accents, highlights    |
| `Dark`         | `#1A1A1A`           | Borders, text, dark backgrounds |
| `Background`   | `#FFFBF5`           | Page backgrounds (warm cream)   |
| `Border`       | `2px solid #1A1A1A` | All cards, inputs, buttons      |
| `Shadow`       | `4px 4px 0 #1A1A1A` | Card offset shadows             |
| `Hover Shadow` | `6px 6px 0 #FF6803` | Interactive hover state         |
| `Radius`       | `14-20px`           | Card corners                    |
| `Font Weight`  | `700-900`           | Bold, impactful typography      |

Generated MVP previews mix **Glassmorphism** + **Bauhaus** + **Neumorphism** + **Neobrutalism** for unique, fresh designs every time.

---

## 🤖 AI Models

| Model                     | Provider | Used For                      | Temperature |
| :------------------------ | :------- | :---------------------------- | :---------- |
| `llama-3.3-70b-versatile` | Groq     | Startup validation & analysis | 0.7         |
| `openai/gpt-oss-120b`     | Groq     | MVP code generation           | 0.7         |
| `openai/gpt-oss-120b`     | Groq     | App name generation           | 0.9         |
| `llama-3.3-70b-versatile` | Groq     | Follow-up AI chat             | 0.7         |

---

## 🇮🇳 Built for India

- All pricing in **₹ (INR)** — no dollar conversions
- Indian competitor analysis (Flipkart, Razorpay, Zerodha, BYJU'S, etc.)
- Indian testimonial names & cities (Mumbai, Bangalore, Delhi, Pune, Chennai)
- UPI & Indian banking references
- Tier-1, Tier-2, Tier-3 city market insights
- Indian data protection compliance mentions

---

## 📸 How It Works

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│              │     │              │     │              │     │              │
│  📝 Submit   │────▶│  🤖 AI       │────▶│  📊 Get      │────▶│  ⚡ Build    │
│  Your Idea   │     │  Validates   │     │  Score &     │     │  Your MVP    │
│              │     │  Ruthlessly  │     │  Analysis    │     │  Code        │
│              │     │              │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │              │
                                         │  💬 Chat     │
                                         │  with AI     │
                                         │  for advice  │
                                         │              │
                                         └──────────────┘
```

---

## 🛠️ Scripts

| Command         | Description              |
| :-------------- | :----------------------- |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

### ⭐ Star this repo if Shadow Founder helped you validate your idea!

**Built with 🧡 by [StarDust130](https://github.com/StarDust130)**

[🌐 Live Demo](https://shadowfounder.tech/) · [🐛 Report Bug](https://github.com/StarDust130/Shadow-Founder/issues) · [💡 Request Feature](https://github.com/StarDust130/Shadow-Founder/issues)

</div>
