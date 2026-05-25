"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { mockAIRecommendations, mockForecastData, mockTopContent } from "@/lib/mock-data";
import { Platform } from "@/lib/types";
import { cn, formatNumber, getPlatformColor } from "@/lib/utils";
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import {
  Sparkles, Brain, Clock, FileText, Hash, Layout, TrendingUp,
  ChevronRight, Zap, Target, BarChart3, ArrowUpRight,
} from "lucide-react";

export default function AIInsightsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("tiktok");
  const forecast = mockForecastData[selectedPlatform];

  const platformNames: Record<Platform, string> = {
    youtube: "YouTube",
    instagram: "Instagram",
    tiktok: "TikTok",
    linkedin: "LinkedIn",
    twitter: "X / Twitter",
  };

  const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
    timing: { icon: Clock, color: "#6366f1" },
    content: { icon: FileText, color: "#10b981" },
    hashtag: { icon: Hash, color: "#f59e0b" },
    format: { icon: Layout, color: "#ec4899" },
    trend: { icon: TrendingUp, color: "#06b6d4" },
  };

  // AI content performance predictions
  const contentPredictions = mockTopContent.slice(0, 4).map((c) => ({
    ...c,
    predictedEngagement: (c.engagementRate * (0.8 + Math.random() * 0.4)).toFixed(1),
    confidence: c.aiScore,
  }));

  const weeklyDigest = {
    totalReach: "4.3M",
    topPlatform: "TikTok",
    bestPostingDay: "Wednesday",
    bestPostingTime: "6-8 PM EST",
    contentTypeWinner: "Comparison Videos",
    hashtagRecommendation: "#techreview",
    growthProjection: "+8.2%",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
            <Brain className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Insights</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              ML-powered analysis and recommendations
            </p>
          </div>
        </div>
        <div className="text-xs text-[var(--color-text-muted)] px-3 py-1.5 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)]">
          Last updated: Jan 15, 2025
        </div>
      </div>

      {/* Weekly Digest Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="gradient-border"
      >
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold">Weekly AI Digest</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {Object.entries(weeklyDigest).map(([key, value], i) => {
              const labels: Record<string, string> = {
                totalReach: "Total Reach",
                topPlatform: "Top Platform",
                bestPostingDay: "Best Day",
                bestPostingTime: "Best Time",
                contentTypeWinner: "Best Content",
                hashtagRecommendation: "Top Hashtag",
                growthProjection: "Growth",
              };
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="text-center"
                >
                  <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                    {labels[key]}
                  </p>
                  <p className="text-sm font-bold">{value}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Growth Forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Growth Forecast</h3>
            <p className="text-sm text-[var(--color-text-muted)]">30-day follower prediction with confidence bands</p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-bg-input)]">
            {(Object.keys(platformNames) as Platform[]).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  selectedPlatform === p
                    ? "text-white"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                )}
                style={selectedPlatform === p ? { backgroundColor: getPlatformColor(p) } : {}}
              >
                {p === "twitter" ? "X" : p.charAt(0).toUpperCase() + p.slice(1, 3)}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast}>
              <defs>
                <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getPlatformColor(selectedPlatform)} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={getPlatformColor(selectedPlatform)} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--color-border)" }}
                interval={Math.floor(forecast.length / 6)}
                tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatNumber(v)}
                width={55}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-bg-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [formatNumber(value)]}
              />
              <Area type="monotone" dataKey="upperBound" stroke="none" fill={getPlatformColor(selectedPlatform)} fillOpacity={0.06} />
              <Area type="monotone" dataKey="lowerBound" stroke="none" fill="var(--color-bg-primary)" fillOpacity={1} />
              <Area type="monotone" dataKey="actual" stroke={getPlatformColor(selectedPlatform)} strokeWidth={2} fill="none" dot={false} />
              <Area type="monotone" dataKey="predicted" stroke={getPlatformColor(selectedPlatform)} strokeWidth={2} strokeDasharray="5 5" fill="none" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recommendations + Content Predictions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <h3 className="text-lg font-semibold mb-4">Actionable Recommendations</h3>
          <div className="space-y-3">
            {mockAIRecommendations.map((rec, index) => {
              const config = typeConfig[rec.type];
              const Icon = config.icon;
              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="group p-3.5 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: config.color + "20" }}>
                      <Icon className="w-4 h-4" style={{ color: config.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold">{rec.title}</h4>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                          rec.impact === "high" ? "bg-[var(--color-success-muted)] text-[var(--color-success)]" :
                          rec.impact === "medium" ? "bg-[var(--color-warning-muted)] text-[var(--color-warning)]" :
                          "bg-[var(--color-bg-input)] text-[var(--color-text-muted)]"
                        )}>
                          {rec.impact}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">{rec.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1 rounded-full bg-[var(--color-bg-input)]">
                          <div className="h-full rounded-full bg-[var(--color-accent)]" style={{ width: `${rec.confidence}%` }} />
                        </div>
                        <span className="text-[10px] text-[var(--color-text-muted)]">{rec.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Content Performance Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <h3 className="text-lg font-semibold mb-1">Content Performance Predictions</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">AI-predicted engagement scores for recent posts</p>
          <div className="space-y-3">
            {contentPredictions.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: getPlatformColor(item.platform) + "15" }}>
                    <span className="text-lg">{item.type === "video" ? "🎬" : item.type === "carousel" ? "🎠" : "📝"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: getPlatformColor(item.platform) + "20", color: getPlatformColor(item.platform) }}>
                        {item.platform}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span className={cn(
                        "text-lg font-bold",
                        item.confidence >= 85 ? "text-[var(--color-success)]" :
                        item.confidence >= 65 ? "text-[var(--color-accent)]" :
                        "text-[var(--color-warning)]"
                      )}>
                        {item.confidence}
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--color-text-muted)]">AI Score</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-[var(--color-bg-input)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.confidence}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    className={cn(
                      "h-full rounded-full",
                      item.confidence >= 85 ? "bg-gradient-to-r from-[var(--color-success)] to-emerald-400" :
                      item.confidence >= 65 ? "bg-gradient-to-r from-[var(--color-accent)] to-purple-400" :
                      "bg-gradient-to-r from-[var(--color-warning)] to-amber-400"
                    )}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
