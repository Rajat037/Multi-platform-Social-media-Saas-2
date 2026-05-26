# SocialPulse Social Analytics Dashboard

SocialPulse is a responsive social media analytics dashboard prototype built with Next.js. It gives creators, agencies, and social teams a unified workspace for reviewing cross-platform growth, engagement, top-performing content, AI recommendations, reports, and account settings.

The application currently uses local mock data, so it can be run and explored without external API keys or connected social accounts.

## Features

- Marketing landing page with sign-in and sign-up flows
- Multi-step onboarding for connecting social platforms
- Dashboard overview with KPI cards, growth charts, engagement trends, heatmaps, top content, AI recommendations, and competitor benchmarking
- Analytics page with platform filters, follower distribution, and engagement visualizations
- Content analyzer with search, platform/type filters, sorting, grid view, and list view
- AI insights page with forecast charts, weekly digest metrics, content predictions, and recommendations
- Platform-specific pages for YouTube, Instagram, TikTok, LinkedIn, and X/Twitter
- Reports page for generated and scheduled report workflows
- Settings pages for platform connections, billing, team members, notifications, security, and account actions
- Global client state with Zustand
- Responsive layout with collapsible sidebar navigation

## Tech Stack

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Recharts](https://recharts.org/) for charts
- [Framer Motion](https://www.framer.com/motion/) for animation
- [Zustand](https://zustand-demo.pmnd.rs/) for state management
- [Radix UI](https://www.radix-ui.com/) primitives
- [Lucide React](https://lucide.dev/) icons

## Project Structure

```text
.
├── README.md
├── prompt.md
├── justification.md
└── golden_response/
    ├── package.json
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx
    │   │   ├── onboarding/
    │   │   └── dashboard/
    │   ├── components/
    │   │   ├── dashboard/
    │   │   ├── icons/
    │   │   └── layout/
    │   └── lib/
    │       ├── mock-data.ts
    │       ├── store.ts
    │       ├── types.ts
    │       └── utils.ts
    └── ...
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Install Dependencies

```bash
cd golden_response
npm install
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Available Scripts

Run these commands from the `golden_response` directory.

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the local Next.js development server |
| `npm run build` | Creates a production build |
| `npm run start` | Runs the production build |
| `npm run lint` | Runs ESLint |

## Data Model

The dashboard is powered by mock data in `src/lib/mock-data.ts`. Shared TypeScript types live in `src/lib/types.ts`, including:

- Users and workspaces
- Platform connections
- KPI metrics
- Growth and engagement series
- Heatmap cells
- Top content
- AI recommendations
- Competitor benchmarks
- Notifications
- Pricing plans

This makes it straightforward to replace mock data with real API responses later while keeping component props typed.

## App Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page with mock auth flow |
| `/onboarding` | Platform connection and dashboard setup flow |
| `/dashboard` | Main dashboard overview |
| `/dashboard/analytics` | Deeper analytics and platform comparison |
| `/dashboard/content` | Content analyzer |
| `/dashboard/ai-insights` | Forecasting and AI recommendations |
| `/dashboard/reports` | Generated and scheduled reports |
| `/dashboard/settings` | Platform, billing, team, notification, security, and account settings |
| `/dashboard/platform/[platform]` | Platform-specific analytics view |

## Notes

- Authentication is simulated in local client state.
- Platform connection actions update local Zustand state only.
- Charts and metrics are generated from mock data and are intended for demonstration.
- No environment variables are required for the current prototype.
