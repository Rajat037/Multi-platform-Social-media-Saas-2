# Multi-Platform Social Media Analytics Dashboard — Full-Stack Build Prompt

## Role & Definition of Done

As a Full-Stack Developer build a Multi-Platform Social Media Analytics Dashboard that holds together YouTube, Instagram, TikTok, LinkedIn, and X/Twitter in one place.

We built this workspace to stop you from constantly switching tabs. It brings your social media data into one clean page where growth patterns make sense and strategy is backed by real numbers. It's got secure account connections, clear pricing, and shared team workspaces where nobody accidentally breaks someone else's reports.

---

# Objective

Develop a dashboard that:

* Connects to five social media platforms through OAuth 2.0 and their official APIs, with encrypted token storage and background refresh
* Normalises platform-specific data into one shared schema so every panel works from a single source of truth
* Runs ML models to forecast post performance and follower growth, with honest confidence scores surfaced in the UI
* Renders a fully responsive, accessible interface where data updates inline — no full-page reloads
* Ships a working Stripe subscription system from day one, with all premium features gated at the middleware level

---

# UI & Animation

Using Framer Motion implement all transitions and micro-interactions. The motion system must follow three hard constraints:

* No layout thrashing
* Animate only transform and opacity
* Automatically reduce motion on lower-capability devices via the `prefers-reduced-motion` media query

## Required Transitions Across All Six Views

* Landing/Auth
* Onboarding
* Dashboard Overview
* Per-Platform Deep Dive
* Content Analyzer
* Settings/Billing

### Required Behaviours

* Page-level route transitions that do not flash or jump
* Charts animate in on load; metric cards stagger their entrance with a sequential delay
* Skeleton loaders fill the gap while data fetches; replaced inline when data arrives, with no layout shift

---

# Layout

## Global Chrome

Present on every authenticated view:

### Header

* Workspace switcher
* Notification bell
* Avatar dropdown

### Sidebar

* Collapsible
* Uses `transform: translateX`
* Does not reflow the main content area when toggled

---

# Dashboard Overview Panels

Render in this order, load lazily after the KPI row:

| Panel                      | Description                                                                                                                                                                                                                        |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| KPI Cards                  | Snapshot of total reach, followers, average engagement rate, and best-performing platform                                                                                                                                          |
| Best Posting Times Heatmap | Maps hour against day-of-week; cell colour intensity reflects engagement rate normalised by follower count                                                                                                                         |
| Engagement Trends          | Plots rolling 7, 30, and 90-day rates on one chart; automatically flags unusual spikes or dips                                                                                                                                     |
| Top Performing Content     | Ranks posts by engagement rate; each card shows a thumbnail, platform badge, and AI confidence score                                                                                                                               |
| AI Recommendations         | Four insights: engagement prediction (0–100% confidence score), 30-day follower growth forecast with confidence bands, top 3 posting windows per platform (weekly), and weekly plain-English recommendations from top 20% of posts |

---

# Settings Page Sections

* Platform connections with OAuth status
* Notification toggles
* Billing details
* Team roster with role badges

---

# Responsive & Accessible Requirements

* Fully functional on 375px mobile, 768px tablet, and 1280px+ desktop — no horizontal scroll, no clipped content
* Every interactive element has an ARIA label
* All panels use semantic HTML landmarks
* Full keyboard navigation with visible focus rings
* Panels below the KPI row use `IntersectionObserver`-based lazy loading so the initial render only fetches KPI data

---

# Platform Connection System

When a user clicks `"Connect Platform"`, the OAuth flow opens in a popup.

On successful handshake:

* The access token and refresh token are encrypted with AES-256
* Written to the database before the popup closes
* The user never sees a token or a redirect loop

---

# Token Lifecycle Rules

* Background refresh runs on a schedule — the user is never prompted to re-authenticate unless a token is fully revoked
* Per-platform rate limits are respected using exponential back-off
* The app never surfaces a rate-limit error to the user unless data is more than 12 hours stale
* Disconnecting a platform archives all its data under the workspace
* Reconnecting the same platform resumes from the archived state
* Malformed or incomplete OAuth responses are rejected at the boundary before any database write
* Token expiry and revocation immediately halt data fetches and trigger a specific error:

```txt
INSTAGRAM_TOKEN_EXPIRED
```

with a reconnect prompt, never a bare `401`

---

# Supported Platforms, APIs & Ingested Metrics

| Platform  | API           | Ingested Metrics                                   |
| --------- | ------------- | -------------------------------------------------- |
| YouTube   | Data API v3   | Views, watch time, subscribers, CTR                |
| Instagram | Graph API     | Reach, impressions, saves, follower growth         |
| TikTok    | Research API  | Views, shares, completion rate, followers          |
| LinkedIn  | Marketing API | Impressions, clicks, follower demographics         |
| X/Twitter | API v2        | Impressions, retweets, link clicks, follower delta |

All five platforms are available on Pro and Agency tiers.

The Free tier is limited to two connected platforms — enforced server-side on:

```txt
/platforms/connect/:platform
```

not in the client.

---

# Backend

Framework: Next.js API Routes or Node.js + Express, versioned at:

```txt
/api/v1/
```

Use Prisma as the ORM for all database access.

Schema migrations are committed to the repository and applied via:

```bash
prisma migrate deploy
```

on each deployment.

---

# Full Endpoint Set

## Auth

```txt
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
```

## Platforms

```txt
GET      /platforms
POST     /platforms/connect/:platform
DELETE   /platforms/:id
```

## Analytics

```txt
GET   /analytics/overview
GET   /analytics/growth
GET   /analytics/engagement
GET   /analytics/best-times
GET   /analytics/top-content
```

## AI

```txt
GET   /ai/recommendations
GET   /ai/forecast/:platform
```

## Reports

```txt
GET    /reports/export?format=json|csv|pdf
POST   /reports/schedule
```

## Workspaces

```txt
GET      /workspace
POST     /workspace
DELETE   /workspace/:id
POST     /workspace/invite
DELETE   /workspace/member/:id
```

## Billing

```txt
GET    /billing/plans
POST   /billing/subscribe
POST   /billing/cancel
```

---

# Background Sync Worker

Managed by BullMQ, backed by Redis:

* Incremental platform data sync every 6 hours per connected account
* ML model retraining weekly, triggered after the sync completes
* Weekly digest report generation and email dispatch every Monday at 08:00 UTC
* Expired OAuth token cleanup runs nightly and logs each purged token to `audit_logs`

---

# Automated Transactional Emails

Nodemailer with SendGrid or Resend.

All credentials in environment variables — never hardcoded.

| Trigger               | Email Sent                                         |
| --------------------- | -------------------------------------------------- |
| Account registration  | Verification link                                  |
| Platform connected    | Confirmation with platform name                    |
| Platform disconnected | Confirmation with reconnect link                   |
| Weekly digest         | Performance summary across all connected platforms |
| Subscription change   | Receipts for plan upgrades or cancellations        |
| Team invite           | Invite link with workspace name and inviter        |

---

# Billing

Three tiers enforced at the middleware layer.

Premium features are never gated client-side.

| Tier   | Connected Platforms | Workspaces | Members per Workspace | AI Features                                                   |
| ------ | ------------------- | ---------- | --------------------- | ------------------------------------------------------------- |
| Free   | 2                   | 1          | 1                     | Basic recommendations only                                    |
| Pro    | 5                   | 3          | 5                     | Full AI + forecasting + competitor benchmarking               |
| Agency | 5                   | Unlimited  | Unlimited             | Full AI + forecasting + competitor benchmarking + white-label |

Stripe webhooks handle the full subscription lifecycle:

* `customer.subscription.created`
* `customer.subscription.updated`
* `customer.subscription.deleted`
* `invoice.payment_failed`

Do not poll the Stripe API — listen only.

On `invoice.payment_failed`:

* Downgrade the workspace to Free tier immediately
* Email the account owner

---

# Security

* On login, a short-lived access token is issued (expires in 15 minutes)
* Refresh token valid for 7 days
* Every time the refresh token is used:

  * The old one is discarded
  * A new one is issued
* Reuse of an old refresh token shuts down the entire session immediately
* Any third-party login tokens are encrypted before being stored
* Tokens never appear in plain text in the database or logs
* Every endpoint has a request cap to stop bots
* Login routes limited to:

```txt
10 requests per minute per IP
```

* API accepts only approved domains
* HTTPS enabled in all environments outside local development
* All user-submitted data is checked and sanitised

---

# Data Processing

## Normalised Post Schema

Every platform's data maps to this before storage:

| Field                  | Type      | Notes                                             |
| ---------------------- | --------- | ------------------------------------------------- |
| post_id                | string    | Platform-native ID                                |
| platform               | enum      | youtube | instagram | tiktok | linkedin | twitter |
| content_type           | enum      | video | image | carousel | text | story | short   |
| published_at           | timestamp | UTC                                               |
| caption                | text      | Nullable                                          |
| hashtags               | string[]  |                                                   |
| views                  | integer   | Nullable                                          |
| likes                  | integer   | Nullable                                          |
| comments               | integer   | Nullable                                          |
| shares                 | integer   | Nullable                                          |
| saves                  | integer   | Nullable                                          |
| reach                  | integer   | Unique accounts that saw the post                 |
| impressions            | integer   | Total times the post was displayed                |
| engagement_rate        | float     | `(likes + comments + shares) / reach`             |
| followers_at_post_time | integer   | Nullable                                          |

### Engagement Rate Rules

* Stored as `null` when reach is zero or unavailable
* Never coerced to `0`

---

# Data Quality Rules Applied During Ingestion

* Deleted posts are detected by a missing `post_id` on re-fetch
* Soft-delete only — never hard-delete
* Missing metric values are imputed using the median for that `content_type` and `platform` combination over the trailing 90 days
* Never use a global average
* Pagination gaps are detected by comparing ingested post count against platform API totals
* Gaps trigger a targeted re-fetch before sync completion

---

# ML Models

## Engagement Classifier

### Algorithms

* XGBoost or LightGBM
* Logistic Regression as baseline

### Target

Predicts whether a post will land in the top half of all posts by engagement rate within the first 48 hours.

### Evaluation Metrics

* ROC-AUC
* Precision
* Recall
* F1

All logged to audit on every retrain.

### Output

* 0–100% confidence score per post card
* Posts scoring `70%+` labelled:

```txt
Predicted top performer
```

---

## Follower Growth Forecaster

### Algorithms

* Prophet as primary
* ARIMA as fallback when fewer than 90 days of history exist

### Output

30-day daily forecast per platform with:

* 80% confidence bands
* 95% confidence bands

### Evaluation Metrics

* MAE
* MAPE

Rolling 30-day back-test run before each retraining cycle.

---

## Best Posting Times

* Historical engagement aggregated into an hour × day-of-week matrix per platform
* Normalised by `followers_at_post_time`
* Prevents rapid follower growth from skewing early time slots

### Output

Top 3 posting windows per platform per week surfaced in:

* Heatmap panel
* AI recommendations panel

---

## Content Pattern Analysis

* Top 20% of posts by engagement analysed for patterns
* Fed into a GPT-4o or Claude prompt

### Output

Natural language recommendations refreshed weekly.

---

# API Response Contract

## Success

```json
{
  "success": true,
  "data": {}
}
```

## Failure

```json
{
  "success": false,
  "error": "PLATFORM_TOKEN_EXPIRED",
  "message": "Your Instagram token has expired. Reconnect your account to resume syncing."
}
```

---

# Required Error Codes

| Code                           | When to Use                              |
| ------------------------------ | ---------------------------------------- |
| PLATFORM_TOKEN_EXPIRED         | Connected account token has expired      |
| WORKSPACE_MEMBER_LIMIT_REACHED | Member cap has been hit                  |
| PLAN_UPGRADE_REQUIRED          | Feature requires a higher plan           |
| RATE_LIMIT_EXCEEDED            | Too many requests too fast               |
| INTERNAL_ERROR                 | Only when the cause is genuinely unknown |

---

# Logging

Every backend error must be logged with Winston or Pino.

Each log must include:

* Full error stack trace
* Request ID
* User ID (if authenticated)

---

# User Feedback Contract

Every mutating action must produce visible feedback:

* Connect platform
* Save settings
* Invite member
* Change plan

Failures must surface the human-readable message from the error contract.

Silent failures are not acceptable anywhere in the product.

---

# Performance

## Bundle & Rendering

* Dynamic imports and route-level code splitting via Next.js
* Each page chunk under `200 KB gzipped`
* Heavy chart components use:

```js
next/dynamic({ ssr: false })
```

* Initial dashboard render fetches only KPI data
* Remaining panels load via `IntersectionObserver`

---

# API & Data Layer

* Cursor-based pagination only
* Offset pagination not allowed
* BullMQ handles async work
* Stateless JWT enables horizontal scaling
* User-triggered API inputs debounced at `300ms`

### Scalability Target

The ingestion pipeline must handle:

```txt
10,000+ connected accounts
```

without degrading sync times.

Enforce with:

* BullMQ concurrency limits
* Per-platform rate-limit budgets

---

# Testing

Every layer requires tests.

The full test suite must pass in CI before deployment.

---

# Backend Testing (Jest or Vitest)

* Unit tests for:

  * Engagement rate formula
  * Median imputation logic
  * Feature engineering steps
* Integration tests for:

  * Every API endpoint
  * Success paths
  * Expired token
  * Plan limit exceeded
  * Invalid input
* Auth middleware tests:

  * Expired access tokens
  * Reused refresh tokens
  * Missing auth headers

---

# Frontend Testing (Vitest + React Testing Library)

* Component tests for:

  * Login
  * Platform connect
  * Member invite
  * Billing upgrade
* Covers:

  * Valid input
  * Invalid input
  * API error states
* Snapshot tests:

  * KPI cards
  * Heatmap

---

# End-to-End Testing (Playwright)

* Full OAuth connection flow using mocked OAuth server
* Dashboard load
* Date-range filter interaction
* Report export download

---

# Developer Documentation

Deliver these six documents alongside the codebase:

| Document         | Contents                                            |
| ---------------- | --------------------------------------------------- |
| Folder structure | Annotated repository tree explaining each directory |
| Local setup      | Setup from git clone to running dev server          |
| .env.example     | Every environment variable explained                |
| Database setup   | Prisma migration and seed instructions              |
| Deployment guide | Vercel, Railway, Docker Compose instructions        |
| API reference    | Every endpoint with request/response examples       |

---

# Technology Stack

| Layer           | Technologies                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| Frontend        | Next.js 14 (App Router), React, Framer Motion, Tailwind CSS, shadcn/ui, Zustand or TanStack Query, Recharts or Nivo |
| Backend         | Next.js API Routes or Node.js + Express, Prisma ORM, BullMQ, Winston or Pino, JWT + bcrypt, Zod                     |
| Email           | Nodemailer with SendGrid or Resend                                                                                  |
| Payments        | Stripe (webhooks only — no polling)                                                                                 |
| Data & Storage  | PostgreSQL, Redis, AWS S3 or Cloudflare R2                                                                          |
| ML Microservice | Python, FastAPI, scikit-learn, XGBoost, LightGBM, Prophet, OpenAI API (GPT-4o)                                      |

