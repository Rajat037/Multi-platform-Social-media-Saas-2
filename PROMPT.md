# Multi-Platform Social Media Analytics Dashboard — Full-Stack Build Prompt

## Role

You are a Full-Stack Developer. Build a production-ready, multi-platform Social Media Analytics Dashboard that unifies data from YouTube, Instagram, TikTok, LinkedIn, and X/Twitter into a single, cohesive interface. The product eliminates platform-switching, surfaces AI-driven insights, and ships with billing and team workspaces on day one.

---

## Objective

Deliver a full-stack SaaS dashboard that:

1. Connects to five social platforms via OAuth 2.0 and their official APIs
2. Normalises platform-specific data into one shared schema
3. Runs ML models to forecast post performance and follower growth
4. Renders a fast, accessible, fully responsive UI with real-time data updates
5. Operates a working subscription and billing system from launch

---

## UI & Animation

Use **Framer Motion** throughout. Every interaction must feel intentional.

**Micro-interactions & transitions:**
- Page-level transitions between all six views (Landing/Auth, Onboarding, Dashboard Overview, Per-Platform Deep Dive, Content Analyzer, Settings/Billing)
- Charts animate on load; metric cards stagger their entrance; skeleton loaders cover data-fetch gaps
- Data refreshes inline — no full-page reloads, no visible flicker

**Animation constraints (non-negotiable):**
- No layout thrashing
- Animate only GPU-friendly properties: `transform` and `opacity`
- Automatically reduce motion on lower-capability devices

---

## Layout

### Global chrome
- **Header:** workspace switcher, notification bell, avatar dropdown
- **Sidebar:** collapsible, does not consume layout space when closed

### Dashboard Overview (KPI-first)
| Panel | Content |
|---|---|
| KPI Cards | Total reach, total followers, avg engagement rate, best-performing platform |
| Growth Analytics | Multi-line chart, platform toggles, date-range picker |
| Best Posting Times Heatmap | Hour × day-of-week grid; colour intensity = engagement |
| Engagement Trends | Rolling 7-, 30-, 90-day rates with anomaly callouts |
| Top Performing Content | Cards ranked by engagement rate — thumbnail, platform badge, AI score |
| AI Recommendations | Actionable output: when to post, which format, which hashtags |
| Competitor Benchmarking *(Pro)* | Metrics set against real industry averages |
| Settings | Platform connections, notifications, billing, team roster |

### Responsive & accessible
- Functional on mobile, tablet, and desktop without degradation
- Full ARIA labelling, semantic HTML, keyboard navigation
- Panels load lazily to keep initial render fast

---

## Platform Connection System

**OAuth flow:**
- Opens in a popup or new tab; no messy redirects
- Tokens are encrypted (AES-256) and persisted immediately on handshake success
- Token refresh runs in the background — users never interact with it
- Per-platform rate limits are respected with proper back-off
- Disconnecting a platform **archives** data — nothing is deleted

**Supported platforms and their data:**

| Platform | API | Key Metrics |
|---|---|---|
| YouTube | Data API v3 | Views, watch time, subscribers, CTR |
| Instagram | Graph API | Reach, impressions, saves, follower growth |
| TikTok | Research API | Views, shares, completion rate, followers |
| LinkedIn | Marketing API | Impressions, clicks, follower demographics |
| X/Twitter | API v2 | Impressions, retweets, link clicks, follower delta |

**Token validation:**
- Malformed or incomplete OAuth responses are rejected at the boundary
- Expiry and revocation cut off data access immediately
- Errors are specific: `INSTAGRAM_TOKEN_EXPIRED` with a reconnect prompt — never a bare `401`

---

## Backend

**Framework:** Node.js + Express or Next.js API Routes, versioned at `/api/v1/`

**Endpoints:**

```
Auth         POST   /auth/register | /auth/login | /auth/refresh
Platforms    GET | POST | DELETE   /platforms | /platforms/connect/:platform
Analytics    GET   /analytics/overview | /growth | /engagement | /best-times | /top-content
AI           GET   /recommendations | /forecast/:platform
Reports      GET   /reports/export?format=json|csv|pdf
             POST  /reports/schedule
Workspaces   GET | POST | DELETE   /workspace | /workspace/invite | /workspace/member/:id
Billing      GET | POST   /billing/plans | /billing/subscribe | /billing/cancel
```

**Background sync worker (scheduled):**
- Platform data synced every 6 hours, incremental only
- ML models retrained weekly on new data
- Weekly digest reports generated and emailed automatically
- Expired OAuth tokens purged proactively

**Automated emails (Nodemailer + SendGrid or Resend; credentials in env vars only):**
- Account registration and email verification
- Platform connected / disconnected
- Weekly performance digest
- Subscription changes: new, upgraded, cancelled
- Team invitations

---

## Billing (Stripe)

| Tier | Platforms | Workspaces | Members | AI |
|---|---|---|---|---|
| Free | 2 | 1 | 1 | Basic |
| Pro | 5 | 3 | 5 | Full |
| Agency | 5 | Unlimited | Unlimited | Full + white-label |

- Use Stripe webhooks for the full subscription lifecycle — no polling
- Premium features are gated at the middleware level — no client-side trust

---

## Security

- JWT auth with access and refresh token rotation; both expire on schedule
- OAuth tokens encrypted at rest with AES-256; no plaintext tokens anywhere
- Rate limiting on every endpoint via `express-rate-limit`
- CORS locked to known origins; HTTPS enforced without negotiation
- All inputs sanitised against XSS and injection before touching the database

---

## Data Processing

**Normalised post schema:**

```
post_id | platform | content_type | published_at | caption | hashtags |
views | likes | comments | shares | saves | reach | impressions |
engagement_rate | followers_at_post_time
```

**Data quality rules:**
- Deleted posts are handled; missing metrics are caught; pagination gaps are filled
- Missing values imputed using median per content type per platform — not global averages

**Engineered features (pre-model):**
- `engagement_rate = (likes + comments + shares) / reach`
- Hour, day-of-week, week-of-year extracted from `published_at`
- Rolling 7-day and 30-day engagement averages per platform
- Content type one-hot encoded
- Caption sentiment score from NLP
- Hashtag diversity index and average hashtag reach
- Follower growth velocity and its rate of change

---

## Storage

| Layer | Purpose | Details |
|---|---|---|
| PostgreSQL | Primary data store | Time-series optimised; indexed on `platform`, `published_at`, `workspace_id`, `user_id` |
| Redis | Caching & rate limiting | Overview cache: 5-min TTL; posting-time cache: 24-hr TTL; rate-limit counters per platform per user |
| S3 / Cloudflare R2 | File storage | Exported reports and media thumbnails |

**Full table set:** `users`, `workspaces`, `workspace_members`, `platform_connections`, `posts`, `daily_metrics`, `follower_snapshots`, `recommendations`, `reports`, `subscriptions`, `audit_logs`

---

## ML Models

**Engagement classifier (XGBoost or LightGBM):**
- Predicts above-median engagement within 48 hours
- Logistic Regression as baseline for comparison
- Evaluated on ROC-AUC, precision, recall, F1
- Output: 0–100% confidence score per content card

**Follower growth forecaster (Prophet or ARIMA):**
- 30-day forecast per platform with confidence bands
- Evaluated on MAE and MAPE

**Best posting times:**
- Historical engagement aggregated by hour × day-of-week, normalised by follower count at post time
- Top 3 posting windows surfaced per platform per week

**AI recommendations:**
- Top 20% of posts by engagement rate analysed for patterns
- Fed into a GPT-4o or Claude prompt; output is plain-English recommendations
- Refreshed weekly automatically

**All API responses follow a consistent JSON structure — for both success and error states.**

---

## Error Handling

**Frontend:** Catch and display form validation errors before they reach the API.

**Backend:** Handle validation errors and platform API failures without crashing. Every error response follows this shape:

```json
{
  "success": false,
  "error": "PLATFORM_TOKEN_EXPIRED",
  "message": "Reconnect your Instagram account."
}
```

**Logging:** Winston or Pino logs every backend failure with a full stack trace.

**User feedback:** Every action produces a confirmation. Every failure produces a clear, specific error message. Silent failures are not acceptable.

---

## Performance & Scalability

- Dynamic imports and route-level code splitting keep the bundle lean
- Dashboard panels and heavy chart components load lazily
- Cursor-based pagination on all list endpoints (offset pagination does not scale)
- Ingestion pipeline designed for 10,000+ accounts without degradation
- BullMQ queues handle all async work: syncs, exports, report generation
- Stateless JWT enables horizontal API scaling
- ML models use fixed random seeds and versioned artifacts for reproducibility
- User input debounced to prevent API hammering
- Accessibility and SEO are treated as first-class requirements

---

## Developer Documentation

Deliver documentation covering:

1. Folder structure walkthrough
2. Local setup instructions
3. `.env.example` with every variable explained
4. Database migration and seed steps
5. Deployment guide for Vercel, Railway, or Docker
6. API reference with real request/response examples — not just endpoint names

---

## Technology Stack

**Frontend:** Next.js 14 (App Router), React, Framer Motion, Tailwind CSS + shadcn/ui, Zustand or TanStack Query, Recharts or Nivo

**Backend:** Node.js + Express or Next.js API Routes, Nodemailer + SendGrid or Resend, Stripe, BullMQ + Redis, Winston or Pino, dotenv, JWT + bcrypt

**Data & Storage:** PostgreSQL, Redis, Prisma ORM, AWS S3 or Cloudflare R2

**AI & ML:** Python microservice — scikit-learn, XGBoost, LightGBM, Prophet; OpenAI API (GPT-4o)
