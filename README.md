# 🧠 AI Resume Analyzer

> **AI-powered resume analysis platform with credit-based monetization**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38BDF8)](https://tailwindcss.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991)](https://openai.com)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748)](https://prisma.io)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Supabase)
- OpenAI API key
- Razorpay account (for payments)

### Installation

```bash
# Navigate to project directory
cd ai-resume-analyzer

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Environment Setup

Copy `.env.local` and fill in all values:

```bash
# Required
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="random-secret-32-chars"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-..."

# OAuth (at least one required)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Payments
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
RAZORPAY_WEBHOOK_SECRET=""

# File Storage
SUPABASE_URL=""
SUPABASE_SERVICE_KEY=""
SUPABASE_ANON_KEY=""
```

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── prisma/
│   └── schema.prisma          # Complete DB schema
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Design system
│   │   ├── (auth)/
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Registration page
│   │   ├── dashboard/
│   │   │   ├── page.tsx       # Dashboard home
│   │   │   ├── upload/        # Resume upload
│   │   │   ├── history/       # Analysis history
│   │   │   └── wallet/        # Credits & payments
│   │   ├── analysis/[id]/     # Analysis results
│   │   └── api/
│   │       ├── auth/          # Auth APIs
│   │       ├── resume/        # Upload APIs
│   │       ├── analysis/      # AI analysis APIs
│   │       ├── payment/       # Razorpay APIs
│   │       └── wallet/        # Wallet APIs
│   ├── lib/
│   │   ├── auth.ts            # NextAuth v5 config
│   │   ├── prisma.ts          # DB client
│   │   ├── openai.ts          # AI analysis engine
│   │   ├── razorpay.ts        # Payment integration
│   │   ├── supabase.ts        # File storage
│   │   ├── pdf-parser.ts      # PDF/DOCX extraction
│   │   └── utils.ts           # Helpers
│   ├── middleware.ts           # Route protection
│   └── types/                 # TypeScript types
├── .env.local                  # Environment variables
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🏗️ Architecture

### Key Technical Decisions

| Area | Approach |
|------|----------|
| **Credit Deduction** | Before AI call → refund on failure |
| **Payment Security** | Server-side HMAC signature verification |
| **Webhook Idempotency** | Check `gateway_payment_id` before processing |
| **File Parsing** | Server-side only (security) |
| **Session** | JWT with 30-day expiry |

### Data Flow
1. User uploads PDF/DOCX → server parses text
2. Credit deducted atomically before AI call
3. GPT-4o analyzes resume → JSON score + suggestions
4. Results saved to DB → shown in analysis view
5. PDF report downloadable anytime

---

## 💳 Credit Packs

| Pack | Credits | Price |
|------|---------|-------|
| Starter | 5 | ₹99 |
| Pro | 25 | ₹399 |
| Enterprise | 100 | ₹1,299 |

> New users get **2 free credits** on signup automatically.

---

## 🔒 Security Features

- JWT sessions with httpOnly cookies
- HMAC SHA256 payment verification
- Server-side file type & size validation
- Parameterized queries via Prisma ORM
- Atomic DB transactions for credit operations
- Webhook idempotency (prevents double-credit)
- Route protection via Next.js middleware

---

## 📊 Database Schema

Key models:
- **User** — Auth + profile
- **Wallet** — Credit balance (1:1 with User)
- **Transaction** — Credit history (debit/credit/bonus)
- **Payment** — Razorpay payment records
- **Resume** — Uploaded files + extracted text
- **Analysis** — AI scores + suggestions + keywords

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

Set all environment variables in Vercel dashboard.

### Database
Run migrations on production:
```bash
npm run db:migrate
```

---

## 📝 TODO / Phase 4

- [ ] PDF report generation with jsPDF
- [ ] Admin panel (user management, analytics)
- [ ] Promo code system
- [ ] Stripe integration (global payments)
- [ ] Redis rate limiting
- [ ] Sentry error tracking

---

## 📄 License

MIT © 2026 ResumeAI
