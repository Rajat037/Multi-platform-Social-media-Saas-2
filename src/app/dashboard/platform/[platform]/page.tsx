"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Platform } from "@/lib/types";
import {
  mockForecastData, mockEngagementData, mockTopContent,
  mockPlatformConnections, mockHeatmapData,
} from "@/lib/mock-data";
import { cn, formatNumber, getPlatformColor, formatPercent } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, Users, Eye, Heart, MessageCircle,
  Share2, Clock, ArrowUpRight, BarChart3, RefreshCw,
} from "lucide-react";

const platformNames: Record<string, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  twitter: "X / Twitter",
};

const platformMetrics: Record<string, { label: string; value: string; change: string; up: boolean }[]> = {
  youtube: [
    { label: "Subscribers", value: "284.5K", change: "+2.1K", up: true },
    { label: "Total Views", value: "12.8M", change: "+458K", up: true },
    { label: "Watch Time (hrs)", value: "94.2K", change: "+8.3K", up: true },
    { label: "Avg CTR", value: "6.8%", change: "+0.4%", up: true },
  ],
  instagram: [
    { label: "Followers", value: "192.3K", change: "+3.4K", up: true },
    { label: "Reach", value: "2.4M", change: "+180K", up: true },
    { label: "Impressions", value: "5.1M", change: "+320K", up: true },
    { label: "Saves", value: "18.2K", change: "+1.2K", up: true },
  ],
  tiktok: [
    { label: "Followers", value: "567.8K", change: "+12.4K", up: true },
    { label: "Total Views", value: "28.4M", change: "+2.1M", up: true },
    { label: "Completion Rate", value: "72.3%", change: "+3.1%", up: true },
    { label: "Shares", value: "89.2K", change: "+5.6K", up: true },
  ],
  linkedin: [
    { label: "Followers", value: "45.2K", change: "+890", up: true },
    { label: "Impressions", value: "680K", change: "+42K", up: true },
    { label: "Click Rate", value: "3.2%", change: "-0.2%", up: false },
    { label: "Demographics", value: "Tech", change: "85%", up: true },
  ],
  twitter: [
    { label: "Followers", value: "68.3K", change: "+1.2K", up: true },
    { label: "Impressions", value: "1.8M", change: "+95K", up: true },
    { label: "Retweets", value: "12.4K", change: "+890", up: true },
    { label: "Link Clicks", value: "8.9K", change: "+320", up: true },
  ],
};

export default function PlatformPage() {
  const params = useParams();
  const platform = params.platform as Platform;
  const color = getPlatformColor(platform);
  const name = platformNames[platform] || platform;
  const connection = mockPlatformConnections.find((p) => p.platform === platform);
  const metrics = platformMetrics[platform] || platformMetrics.youtube;
  const forecast = mockForecastData[platform] || [];
  const content = mockTopContent.filter((c) => c.platform === platform);

  const engagementData = useMemo(() => {
    return mockEngagementData
      .filter((d) => d.platform === platform)
      .map((d) => ({ date: d.date, rate: d.rate, likes: d.likes, comments: d.comments }))
      .slice(-30);
  }, [platform]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.[0]) return null;
    return (
      <div className="glass-card p-3">
        <p className="text-xs text-[var(--color-text-muted)]">
          {new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </p>
        <p className="text-sm font-semibold mt-1">{formatNumber(payload[0].value)}</p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Platform Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: color + "20" }}
          >
            <span className="text-2xl font-bold" style={{ color }}>
              {name[0]}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            {connection?.accountName && (
              <p className="text-sm text-[var(--color-text-secondary)]">{connection.accountName}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            connection?.connected
              ? "bg-[var(--color-success-muted)] text-[var(--color-success)]"
              : "bg-[var(--color-error-muted)] text-[var(--color-error)]"
          )}>
            {connection?.connected ? "Connected" : "Disconnected"}
          </span>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg-card-hover)] text-sm transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Sync
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-5"
          >
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">{metric.label}</p>
            <p className="text-2xl font-bold">{metric.value}</p>
            <div className={cn(
              "flex items-center gap-1 mt-2 text-xs font-medium",
              metric.up ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
            )}>
              {metric.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {metric.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Follower Forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Follower Growth Forecast</h3>
            <p className="text-sm text-[var(--color-text-muted)]">30-day AI prediction with confidence bands</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded" style={{ backgroundColor: color }} />
              <span className="text-[var(--color-text-muted)]">Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded border border-dashed" style={{ borderColor: color }} />
              <span className="text-[var(--color-text-muted)]">Predicted</span>
            </div>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast}>
              <defs>
                <linearGradient id={`forecastBand-${platform}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.1} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--color-border)" }}
                interval={Math.floor(forecast.length / 8)}
                tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatNumber(v)}
                width={55}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="upperBound" stroke="none" fill={color} fillOpacity={0.08} />
              <Area type="monotone" dataKey="lowerBound" stroke="none" fill="var(--color-bg-primary)" fillOpacity={1} />
              <Area type="monotone" dataKey="actual" stroke={color} strokeWidth={2} fill="none" dot={false} />
              <Area type="monotone" dataKey="predicted" stroke={color} strokeWidth={2} strokeDasharray="5 5" fill="none" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Engagement & Top Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Engagement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <h3 className="text-lg font-semibold mb-4">Engagement Rate (30 Days)</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData}>
                <defs>
                  <linearGradient id={`engGrad-${platform}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--color-border)" }}
                  interval={5}
                  tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                />
                <YAxis tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} width={35} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="rate" stroke={color} strokeWidth={2} fill={`url(#engGrad-${platform})`} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Content for this platform */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <h3 className="text-lg font-semibold mb-4">Top Content</h3>
          {content.length > 0 ? (
            <div className="space-y-3">
              {content.map((item, i) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all">
                  <span className="text-lg font-bold text-[var(--color-text-muted)] w-6">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-text-muted)]">
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatNumber(item.likes)}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{formatNumber(item.comments)}</span>
                      <span className="flex items-center gap-1"><Share2 className="w-3 h-3" />{formatNumber(item.shares)}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold" style={{ color }}>{item.engagementRate}%</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">engagement</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--color-text-muted)]">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No content data available for this platform yet.</p>
              <p className="text-xs mt-1">Connect your account and sync data to see results.</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
