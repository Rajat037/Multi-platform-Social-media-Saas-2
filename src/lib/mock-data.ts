import {
  User, Workspace, PlatformConnection, KPIMetric, GrowthDataPoint,
  HeatmapCell, TopContent, AIRecommendation, CompetitorBenchmark,
  Notification, PricingPlan, EngagementDataPoint, ForecastDataPoint, Platform
} from "./types";

export const mockUser: User = {
  id: "usr_1",
  name: "Alex Rivera",
  email: "alex@socialpulse.io",
  avatar: "",
  plan: "pro",
  createdAt: "2024-06-15T10:00:00Z",
};

export const mockWorkspaces: Workspace[] = [
  {
    id: "ws_1",
    name: "Rivera Media",
    ownerId: "usr_1",
    members: [
      { id: "m1", userId: "usr_1", name: "Alex Rivera", email: "alex@socialpulse.io", avatar: "", role: "owner" },
      { id: "m2", userId: "usr_2", name: "Jordan Lee", email: "jordan@team.io", avatar: "", role: "admin" },
      { id: "m3", userId: "usr_3", name: "Sam Chen", email: "sam@team.io", avatar: "", role: "member" },
    ],
    createdAt: "2024-06-15T10:00:00Z",
  },
  {
    id: "ws_2",
    name: "Client: TechStartup",
    ownerId: "usr_1",
    members: [
      { id: "m4", userId: "usr_1", name: "Alex Rivera", email: "alex@socialpulse.io", avatar: "", role: "owner" },
    ],
    createdAt: "2024-09-01T10:00:00Z",
  },
];

export const mockPlatformConnections: PlatformConnection[] = [
  { platform: "youtube", connected: true, accountName: "@RiveraMedia", accountId: "UC123", followers: 284500, connectedAt: "2024-06-20T10:00:00Z", lastSyncAt: "2025-01-15T08:30:00Z", status: "active" },
  { platform: "instagram", connected: true, accountName: "@alexrivera.co", accountId: "ig_456", followers: 192300, connectedAt: "2024-06-20T10:05:00Z", lastSyncAt: "2025-01-15T08:30:00Z", status: "active" },
  { platform: "tiktok", connected: true, accountName: "@alexrivera", accountId: "tt_789", followers: 567800, connectedAt: "2024-07-01T10:00:00Z", lastSyncAt: "2025-01-15T08:30:00Z", status: "active" },
  { platform: "linkedin", connected: true, accountName: "Alex Rivera", accountId: "li_012", followers: 45200, connectedAt: "2024-08-10T10:00:00Z", lastSyncAt: "2025-01-15T08:30:00Z", status: "active" },
  { platform: "twitter", connected: false },
];

export const mockKPIs: KPIMetric[] = [
  { label: "Total Followers", value: 1089800, previousValue: 1024500, change: 6.38, changeType: "increase", format: "number" },
  { label: "Total Reach", value: 4250000, previousValue: 3890000, change: 9.25, changeType: "increase", format: "number" },
  { label: "Avg Engagement", value: 4.72, previousValue: 4.31, change: 9.51, changeType: "increase", format: "percent" },
  { label: "Best Platform", value: 567800, previousValue: 498200, change: 13.97, changeType: "increase", format: "number", icon: "tiktok" },
];

function generateGrowthData(): GrowthDataPoint[] {
  const data: GrowthDataPoint[] = [];
  const startDate = new Date("2024-07-01");
  for (let i = 0; i < 180; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const noise = () => Math.random() * 0.02 - 0.01;
    data.push({
      date: date.toISOString().split("T")[0],
      youtube: Math.round(180000 + i * 580 + Math.random() * 2000),
      instagram: Math.round(130000 + i * 345 + Math.random() * 1500),
      tiktok: Math.round(250000 + i * 1760 + Math.random() * 5000),
      linkedin: Math.round(32000 + i * 73 + Math.random() * 300),
      twitter: Math.round(48000 + i * 120 + Math.random() * 800),
    });
  }
  return data;
}

export const mockGrowthData: GrowthDataPoint[] = generateGrowthData();

function generateEngagementData(): EngagementDataPoint[] {
  const data: EngagementDataPoint[] = [];
  const platforms: Platform[] = ["youtube", "instagram", "tiktok", "linkedin", "twitter"];
  const startDate = new Date("2024-10-01");

  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    platforms.forEach((platform) => {
      const baseRate = platform === "tiktok" ? 6.5 : platform === "instagram" ? 4.2 : platform === "youtube" ? 3.8 : platform === "linkedin" ? 2.1 : 1.5;
      const rate = baseRate + (Math.random() - 0.5) * 2;
      data.push({
        date: date.toISOString().split("T")[0],
        rate: Math.max(0.5, rate),
        likes: Math.round(Math.random() * 10000 + 500),
        comments: Math.round(Math.random() * 800 + 50),
        shares: Math.round(Math.random() * 500 + 20),
        platform,
      });
    });
  }
  return data;
}

export const mockEngagementData: EngagementDataPoint[] = generateEngagementData();

function generateHeatmapData(): HeatmapCell[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const data: HeatmapCell[] = [];

  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      let value = Math.random() * 40;
      // Higher engagement during business hours and evenings
      if (hour >= 9 && hour <= 11) value += 30;
      if (hour >= 17 && hour <= 20) value += 45;
      if (hour >= 12 && hour <= 14) value += 20;
      // Weekday vs weekend
      if (day >= 1 && day <= 5) value += 15;
      // Peak: Tuesday/Wednesday evening
      if ((day === 2 || day === 3) && hour >= 18 && hour <= 20) value += 25;

      data.push({
        day,
        hour,
        value: Math.min(100, Math.round(value)),
        dayLabel: days[day],
        hourLabel: `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}${hour < 12 ? "AM" : "PM"}`,
      });
    }
  }
  return data;
}

export const mockHeatmapData: HeatmapCell[] = generateHeatmapData();

export const mockTopContent: TopContent[] = [
  {
    id: "tc_1", platform: "tiktok", type: "video", title: "5 AI Tools That Replaced My Entire Team",
    thumbnail: "/thumbnails/1.jpg", engagementRate: 12.4, likes: 89200, comments: 3420, shares: 15600, views: 1240000, reach: 980000,
    aiScore: 94, publishedAt: "2025-01-10T14:00:00Z", caption: "These AI tools completely changed how I work... #AItools #productivity #techreview",
  },
  {
    id: "tc_2", platform: "youtube", type: "video", title: "I Tried Every Social Media Tool So You Don't Have To",
    thumbnail: "/thumbnails/2.jpg", engagementRate: 8.7, likes: 24500, comments: 1890, shares: 4200, views: 458000, reach: 350000,
    aiScore: 88, publishedAt: "2025-01-08T16:00:00Z", caption: "After 3 months of testing, here are my honest thoughts on every major social media management tool.",
  },
  {
    id: "tc_3", platform: "instagram", type: "carousel", title: "10 Growth Hacks for Instagram in 2025",
    thumbnail: "/thumbnails/3.jpg", engagementRate: 7.9, likes: 15200, comments: 892, shares: 3100, views: 0, reach: 242000,
    aiScore: 82, publishedAt: "2025-01-12T11:00:00Z", caption: "These strategies took me from 50K to 190K followers 📈 Save this for later!",
  },
  {
    id: "tc_4", platform: "tiktok", type: "short", title: "POV: Your Analytics Dashboard Actually Works",
    thumbnail: "/thumbnails/4.jpg", engagementRate: 9.3, likes: 67800, comments: 2100, shares: 8900, views: 890000, reach: 720000,
    aiScore: 86, publishedAt: "2025-01-14T09:00:00Z", caption: "When everything just clicks 🔥 #analytics #dashboard #contentcreator",
  },
  {
    id: "tc_5", platform: "linkedin", type: "text", title: "The Real Cost of Content Creation in 2025",
    thumbnail: "/thumbnails/5.jpg", engagementRate: 5.2, likes: 2340, comments: 456, shares: 890, views: 0, reach: 68000,
    aiScore: 78, publishedAt: "2025-01-13T08:00:00Z", caption: "Let's talk about what nobody tells you about building a personal brand...",
  },
  {
    id: "tc_6", platform: "instagram", type: "reel", title: "Day in the Life of a Content Creator",
    thumbnail: "/thumbnails/6.jpg", engagementRate: 6.8, likes: 18900, comments: 720, shares: 2400, views: 310000, reach: 280000,
    aiScore: 80, publishedAt: "2025-01-11T13:00:00Z", caption: "This is what a typical Monday looks like for me 🎬",
  },
];

export const mockAIRecommendations: AIRecommendation[] = [
  {
    id: "rec_1", type: "timing", title: "Shift TikTok posting to 6-8 PM EST",
    description: "Your TikTok content posted between 6-8 PM EST sees 34% higher engagement compared to your current 2 PM posting schedule. Tuesday and Wednesday evenings show the strongest performance window.",
    impact: "high", platform: "tiktok", confidence: 91, createdAt: "2025-01-15T06:00:00Z",
  },
  {
    id: "rec_2", type: "content", title: "Double down on 'tool comparison' content",
    description: "Your comparison-style content outperforms tutorials by 2.3x on engagement rate across all platforms. Consider creating a weekly 'Tool Tuesday' series.",
    impact: "high", confidence: 87, createdAt: "2025-01-15T06:00:00Z",
  },
  {
    id: "rec_3", type: "hashtag", title: "Replace #productivity with #techreview on TikTok",
    description: "The hashtag #techreview has 3.2x higher average reach on TikTok compared to #productivity, while maintaining similar audience quality. Your tech-focused content aligns better with this hashtag's audience.",
    impact: "medium", platform: "tiktok", confidence: 78, createdAt: "2025-01-15T06:00:00Z",
  },
  {
    id: "rec_4", type: "format", title: "Instagram carousels outperform single images 4.7x",
    description: "Your carousel posts generate an average engagement rate of 7.9% compared to 1.7% for single images. Prioritise carousel format for all educational content on Instagram.",
    impact: "high", platform: "instagram", confidence: 93, createdAt: "2025-01-15T06:00:00Z",
  },
  {
    id: "rec_5", type: "trend", title: "AI-generated content is trending — lean in",
    description: "Content about AI tools saw a 156% increase in engagement across your niche this month. Your audience has shown strong interest — capitalize with more AI-focused content before the trend saturates.",
    impact: "medium", confidence: 72, createdAt: "2025-01-15T06:00:00Z",
  },
  {
    id: "rec_6", type: "timing", title: "Post LinkedIn content before 9 AM EST",
    description: "LinkedIn posts published between 7-9 AM EST on weekdays receive 45% more impressions. Your audience is most active during their morning commute.",
    impact: "medium", platform: "linkedin", confidence: 84, createdAt: "2025-01-15T06:00:00Z",
  },
];

export const mockCompetitorBenchmarks: CompetitorBenchmark[] = [
  { metric: "Engagement Rate", yourValue: 4.72, industryAvg: 2.8, topPerformer: 7.5, percentile: 72 },
  { metric: "Follower Growth", yourValue: 6.38, industryAvg: 3.2, topPerformer: 12.0, percentile: 68 },
  { metric: "Post Frequency", yourValue: 4.2, industryAvg: 5.0, topPerformer: 7.0, percentile: 45 },
  { metric: "Avg Reach", yourValue: 425000, industryAvg: 180000, topPerformer: 850000, percentile: 76 },
  { metric: "Response Rate", yourValue: 78, industryAvg: 45, topPerformer: 95, percentile: 82 },
  { metric: "Content Quality Score", yourValue: 84, industryAvg: 62, topPerformer: 96, percentile: 80 },
];

export const mockNotifications: Notification[] = [
  { id: "n1", type: "success", title: "TikTok sync complete", message: "All TikTok metrics have been updated.", read: false, createdAt: "2025-01-15T08:30:00Z" },
  { id: "n2", type: "info", title: "Weekly digest ready", message: "Your weekly performance report is ready to view.", read: false, createdAt: "2025-01-15T06:00:00Z" },
  { id: "n3", type: "warning", title: "Instagram token expiring", message: "Your Instagram connection will expire in 3 days. Please reconnect.", read: false, createdAt: "2025-01-14T12:00:00Z" },
  { id: "n4", type: "success", title: "AI recommendations updated", message: "New AI insights have been generated based on your latest data.", read: true, createdAt: "2025-01-14T06:00:00Z" },
  { id: "n5", type: "info", title: "Jordan Lee joined workspace", message: "Jordan Lee accepted your invitation to Rivera Media.", read: true, createdAt: "2025-01-13T14:00:00Z" },
];

export const mockPricingPlans: PricingPlan[] = [
  {
    id: "plan_free", name: "Free", price: 0, interval: "month", platforms: 2, workspaces: 1, members: 1, aiFeatures: "Basic",
    features: ["2 platform connections", "Basic analytics dashboard", "7-day data history", "Weekly email digest", "Basic AI insights"],
  },
  {
    id: "plan_pro", name: "Pro", price: 29, interval: "month", platforms: 5, workspaces: 3, members: 5, aiFeatures: "Full",
    features: ["All 5 platforms", "Advanced analytics & forecasting", "90-day data history", "Competitor benchmarking", "Full AI recommendations", "Priority support", "Export to CSV & PDF", "Custom date ranges"],
    popular: true,
  },
  {
    id: "plan_agency", name: "Agency", price: 99, interval: "month", platforms: 5, workspaces: "unlimited", members: "unlimited", aiFeatures: "Full + White-label",
    features: ["Everything in Pro", "Unlimited workspaces", "Unlimited team members", "White-label reports", "API access", "Dedicated account manager", "Custom integrations", "SLA guarantee"],
  },
];

function generateForecastData(platform: Platform): ForecastDataPoint[] {
  const data: ForecastDataPoint[] = [];
  const startDate = new Date("2024-11-01");
  const baseFollowers: Record<Platform, number> = {
    youtube: 240000, instagram: 160000, tiktok: 400000, linkedin: 38000, twitter: 55000,
  };
  const growthRate: Record<Platform, number> = {
    youtube: 450, instagram: 300, tiktok: 1400, linkedin: 55, twitter: 90,
  };

  let base = baseFollowers[platform];

  // Historical data (90 days)
  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    base += growthRate[platform] + (Math.random() - 0.4) * growthRate[platform] * 0.5;
    data.push({
      date: date.toISOString().split("T")[0],
      actual: Math.round(base),
      predicted: Math.round(base),
      upperBound: Math.round(base * 1.02),
      lowerBound: Math.round(base * 0.98),
    });
  }

  // Forecast (30 days)
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + 90 + i);
    base += growthRate[platform] + (Math.random() - 0.3) * growthRate[platform] * 0.3;
    const uncertainty = 1 + (i / 30) * 0.08;
    data.push({
      date: date.toISOString().split("T")[0],
      predicted: Math.round(base),
      upperBound: Math.round(base * uncertainty),
      lowerBound: Math.round(base / uncertainty),
    });
  }

  return data;
}

export const mockForecastData: Record<Platform, ForecastDataPoint[]> = {
  youtube: generateForecastData("youtube"),
  instagram: generateForecastData("instagram"),
  tiktok: generateForecastData("tiktok"),
  linkedin: generateForecastData("linkedin"),
  twitter: generateForecastData("twitter"),
};
