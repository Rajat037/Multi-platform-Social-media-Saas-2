export type Platform = "youtube" | "instagram" | "tiktok" | "linkedin" | "twitter";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: "free" | "pro" | "agency";
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  members: WorkspaceMember[];
  createdAt: string;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  role: "owner" | "admin" | "member";
}

export interface PlatformConnection {
  platform: Platform;
  connected: boolean;
  accountName?: string;
  accountId?: string;
  avatar?: string;
  followers?: number;
  connectedAt?: string;
  lastSyncAt?: string;
  status?: "active" | "expired" | "error";
}

export interface KPIMetric {
  label: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  format: "number" | "percent" | "currency";
  icon?: string;
}

export interface GrowthDataPoint {
  date: string;
  youtube: number;
  instagram: number;
  tiktok: number;
  linkedin: number;
  twitter: number;
}

export interface EngagementDataPoint {
  date: string;
  rate: number;
  likes: number;
  comments: number;
  shares: number;
  platform: Platform;
}

export interface HeatmapCell {
  day: number; // 0-6 (Sun-Sat)
  hour: number; // 0-23
  value: number; // engagement score
  dayLabel: string;
  hourLabel: string;
}

export interface TopContent {
  id: string;
  platform: Platform;
  type: "video" | "image" | "carousel" | "text" | "reel" | "short" | "story";
  title: string;
  thumbnail: string;
  engagementRate: number;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  reach: number;
  aiScore: number;
  publishedAt: string;
  caption: string;
}

export interface AIRecommendation {
  id: string;
  type: "timing" | "content" | "hashtag" | "format" | "trend";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  platform?: Platform;
  confidence: number;
  createdAt: string;
}

export interface CompetitorBenchmark {
  metric: string;
  yourValue: number;
  industryAvg: number;
  topPerformer: number;
  percentile: number;
}

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  platforms: number | "unlimited";
  workspaces: number | "unlimited";
  members: number | "unlimited";
  aiFeatures: string;
  features: string[];
  popular?: boolean;
}

export interface ForecastDataPoint {
  date: string;
  actual?: number;
  predicted: number;
  upperBound: number;
  lowerBound: number;
}

export interface DateRange {
  start: Date;
  end: Date;
  label: string;
}
