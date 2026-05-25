# Prompt

**Context and Role**

You're a Full-Stack Developer building something that actually matters — a Multi-Platform Social Media Analytics Dashboard that ties together YouTube, Instagram, TikTok, LinkedIn, and X/Twitter into one place. No more jumping between tabs. No more exporting CSVs from five different platforms.

We built this workspace to stop you from constantly switching tabs. It brings your social media data into one clean page where growth patterns make sense and strategy is backed by real numbers. It's got secure account connections, clear pricing, and shared team workspaces where nobody accidentally breaks someone else's reports.

---

**Objective**

Build a full-stack Social Media SaaS Dashboard that:

* Hooks into 5 platforms via OAuth and their official APIs  
* Takes messy, inconsistent platform data and normalises it into one clean schema  
* Runs AI models to forecast post performance and follower growth  
* Renders a fast, responsive UI where data visualisations update in real time  
* Ships with a working subscription and billing system from day one

---

**UI and Animation Requirements**

Every interaction should feel considered. Framer Motion handles the heavy lifting here:

* Page transitions and micro-interactions that make the product feel polished, not bolted together  
* Charts animate in on load. Metric cards stagger their appearance. Skeleton loaders cover the gap while data arrives  
* When data refreshes, it updates inline — no full reloads, no flicker

Navigation between these pages should feel continuous, not jarring:

* Landing / Auth Page  
* Onboarding Flow (platform connections)  
* Main Dashboard Overview  
* Per-Platform Deep Dive Pages  
* Content Analyzer Page  
* Settings and Billing Page

Animations follow three rules:

* No layout thrashing — ever  
* Only GPU-friendly properties: `transform`, `opacity`  
* Scale back automatically on weaker devices

---

**Layout Requirements**

Every panel on this dashboard needs to justify its existence:

* Header carrying a workspace switcher, notification bell, and avatar dropdown  
* Sidebar that collapses cleanly without eating screen real estate  
* Overview Page built around KPI cards — total reach, total followers, avg engagement rate, best-performing platform  
* Growth Analytics Panel — multi-line chart, platform toggles, date-range picker  
* Best Posting Times Heatmap — `hour × day-of-week`, colour intensity mapped to engagement  
* Engagement Trends Panel — rolling 7, 30, and 90-day engagement rates with anomaly callouts  
* Top Performing Content — cards ranked by engagement rate with thumbnail, platform badge, and AI-predicted score  
* AI Recommendations Panel — specific, actionable output: when to post, what format to prioritise, which hashtags are working  
* Competitor Benchmarking Panel (Pro tier) — real context against industry averages, not just internal numbers  
* Settings Page — platform connections, notification toggles, billing details, team roster

Non-negotiables:

* Works on mobile, tablet, and desktop without compromise  
* Fully accessible — ARIA labels, semantic markup, keyboard navigation throughout  
* Panels load lazily so the initial render stays fast

---

**Platform Connection System**

When someone clicks "Connect Platform" the experience needs to be seamless:

* OAuth flow opens in a popup or new tab — clean, no redirect mess  
* Tokens land encrypted in the database the moment the handshake succeeds  
* Refresh happens in the background — users never see it, never deal with it  
* Rate limits are respected per platform, with proper back-off built in  
* Disconnecting a platform archives the data — nothing gets wiped

**Supported Platforms**

Each platform connects via OAuth 2.0 and exposes different data through its respective API:

* **YouTube** (Data API v3) — views, watch time, subscribers, CTR  
* **Instagram** (Graph API) — reach, impressions, saves, follower growth  
* **TikTok** (Research API) — views, shares, completion rate, followers  
* **LinkedIn** (Marketing API) — impressions, clicks, follower demographics  
* **X/Twitter** (API v2) — impressions, retweets, link clicks, follower delta

**Token Validation**

OAuth token responses get validated before anything hits the database — malformed or incomplete responses are rejected at the boundary. Token expiry and revocation cut off platform data access immediately, and error messages are specific by design: `INSTAGRAM_TOKEN_EXPIRED` with a reconnect prompt, not a bare 401\.

---

**Backend Requirements**

RESTful API, versioned at `/api/v1/`, built on Node.js \+ Express or Next.js API Routes.

```
Auth         POST   /auth/register | /auth/login | /auth/refresh
Platforms    GET/POST/DELETE   /platforms | /platforms/connect/:platform
Analytics    GET   /analytics/overview | /growth | /engagement | /best-times | /top-content
AI           GET   /recommendations | /forecast/:platform
Reports      GET   /reports/export?format=json|csv|pdf  |  POST /reports/schedule
Workspaces   GET/POST/DELETE   /workspace | /workspace/invite | /workspace/member/:id
Billing      GET/POST   /billing/plans | /billing/subscribe | /billing/cancel
```

A background sync worker runs on a schedule and handles the critical stuff:

* Platform syncs every 6 hours, incremental only  
* ML models retrain weekly on whatever new data came in  
* Weekly digest reports get generated and sent automatically  
* Expired OAuth tokens get cleaned out before they cause issues

Automated emails cover:

* New account registration and verification  
* Platform connected or disconnected  
* Weekly performance digest  
* Subscription changes — new, upgraded, cancelled  
* Team invites

Use Nodemailer with SMTP or SendGrid / Resend. Credentials live in environment variables — nowhere else.

**Billing — Stripe, three tiers:**

| Tier | Platforms | Workspaces | Members | AI |
| ----- | ----- | ----- | ----- | ----- |
| Free | 2 | 1 | 1 | Basic |
| Pro | 5 | 3 | 5 | Full |
| Agency | 5 | Unlimited | Unlimited | Full \+ white-label |

Stripe webhooks handle the full subscription lifecycle — don't poll, listen. Premium features are gated at the middleware level — no client-side trust.

**Security non-negotiables:**

* JWT auth with access and refresh token rotation. Tokens expire. Refresh tokens rotate  
* OAuth tokens encrypted at rest with AES-256. No plaintext tokens anywhere  
* Rate limiting on every endpoint via `express-rate-limit`  
* CORS locked to known origins. HTTPS enforced. No negotiation on either

---

**Data Processing**

Every platform's data gets normalised into one schema the frontend can rely on:

```
post_id | platform | content_type | published_at | caption |
hashtags | views | likes | comments | shares | saves |
reach | impressions | engagement_rate | followers_at_post_time
```

Incoming data gets cleaned properly — deleted posts handled, missing metrics caught, pagination gaps filled. Missing values get imputed using median values per content type per platform — not global averages.

Features engineered before anything hits the models:

* `engagement_rate = (likes + comments + shares) / reach`  
* Hour, day-of-week, week-of-year extracted from `published_at`  
* Rolling 7-day and 30-day engagement averages per platform  
* Content type as one-hot encoded columns  
* Caption sentiment score from an NLP pass  
* Hashtag diversity index and average hashtag reach  
* Follower growth velocity and its rate of change

**Storage:**

* PostgreSQL — time-series optimised, indexed on `platform`, `published_at`, `workspace_id`, `user_id`  
* Full table set: `users`, `workspaces`, `workspace_members`, `platform_connections`, `posts`, `daily_metrics`, `follower_snapshots`, `recommendations`, `reports`, `subscriptions`, `audit_logs`  
* Redis — dashboard overview cached at 5-minute TTL, posting-time calculations at 24-hour TTL, rate limit counters per platform per user  
* S3 or Cloudflare R2 — exported reports and media thumbnails

**ML Models:**

* XGBoost or LightGBM predicts above-median engagement within 48 hours. Logistic Regression as baseline. Evaluated on ROC-AUC, precision, recall, F1. Output: 0–100% confidence score per content card  
* Prophet or ARIMA forecasts follower growth 30 days out per platform, with confidence bands. Evaluated on MAE and MAPE  
* Historical engagement aggregated by `hour × day-of-week`, normalised by follower count at posting time. Top 3 windows surfaced per platform per week  
* Top 20% of posts by engagement analysed for patterns, fed into a GPT-4o or Claude prompt. Output: natural language recommendations, refreshed weekly

All inputs sanitised against XSS and injection before touching the database. Every API response is structured JSON — success or error, always consistent.

---

**Output Requirements**

* Animated, responsive dashboard that feels like a premium product  
* Cross-platform analytics in one view, with metrics that make sense together  
* AI predictions on content performance with honest confidence scores attached  
* Heatmaps that actually tell you when to post, not just show colour  
* Content ranked by engagement rate, not raw likes  
* Weekly AI recommendations in plain English, automatically refreshed  
* Reports in JSON, CSV, or PDF — ready to send to a client without extra work  
* Weekly digest email that arrives without the user doing anything  
* Billing that works, upgrades that are frictionless, plans that make sense  
* Confirmation on every action. Clear errors when something breaks. No silent failures

---

**Error Handling and Documentation**

* Catch form errors on the frontend before they become API errors  
* Handle backend validation failures and platform API problems without crashing  
* Every error returns in this shape:

json

```json
{
  "success": false,
  "error": "PLATFORM_TOKEN_EXPIRED",
  "message": "Reconnect your Instagram account."
}
```

* Winston or Pino logs every backend failure with a full stack trace

Developer documentation covers:

* Folder structure walkthrough  
* Local setup instructions  
* `.env.example` with every variable explained  
* Database migration and seed steps  
* Deployment guide for Vercel, Railway, or Docker  
* API reference with actual request and response examples — not just endpoint names

---

**Performance and Scalability**

* Dynamic imports and route-level code splitting keep the bundle lean  
* Every dashboard panel and heavy chart component loads lazily  
* Cursor-based pagination on all list endpoints — offset pagination falls apart at scale  
* Ingestion pipeline designed to handle 10,000+ accounts without degrading  
* BullMQ queues handle all async work — syncs, exports, report generation  
* Stateless JWT keeps horizontal API scaling simple  
* ML models use fixed random seeds and versioned artifacts — results stay reproducible  
* User interactions are debounced so rapid input doesn't hammer the API  
* Accessibility and SEO treated as first-class requirements, not an afterthought

---

**Technology Stack**

Frontend:

* Next.js 14 (App Router) / React  
* Framer Motion  
* Tailwind CSS \+ shadcn/ui  
* Zustand or TanStack Query  
* Recharts or Nivo

Backend:

* Node.js \+ Express or Next.js API Routes  
* Nodemailer \+ SendGrid or Resend  
* Stripe  
* BullMQ \+ Redis  
* Winston or Pino  
* dotenv  
* JWT \+ bcrypt

Data and Storage:

* PostgreSQL  
* Redis  
* Prisma  
* AWS S3 or Cloudflare R2

AI and ML:

* Python microservice — scikit-learn, XGBoost, LightGBM, Prophet  
* OpenAI GPT-4o or Anthropic Claude API

Optional:

* Docker  
* Vercel \+ Railway or Render

