"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { mockGrowthData, mockEngagementData, mockHeatmapData } from "@/lib/mock-data";
import { cn, formatNumber, formatPercent, getPlatformColor } from "@/lib/utils";
import { Platform } from "@/lib/types";
import {
  TrendingUp, TrendingDown, ArrowUpRight, Calendar, Filter,
  Download, RefreshCw,
} from "lucide-react";

const PLATFORM_COLORS = {
  youtube: "#FF0000",
  instagram: "#E4405F",
  tiktok: "#00F2EA",
  linkedin: "#0A66C2",
  twitter: "#1DA1F2",
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState(30);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "all">("all");

  // Platform distribution data for pie chart
  const platformDistribution = useMemo(() => {
    const latest = mockGrowthData[mockGrowthData.length - 1];
    if (!latest) return [];
    return [
      { name: "YouTube", value: latest.youtube, color: PLATFORM_COLORS.youtube },
      { name: "Instagram", value: latest.instagram, color: PLATFORM_COLORS.instagram },
      { name: "TikTok", value: latest.tiktok, color: PLATFORM_COLORS.tiktok },
      { name: "LinkedIn", value: latest.linkedin, color: PLATFORM_COLORS.linkedin },
      { name: "Twitter", value: latest.twitter, color: PLATFORM_COLORS.twitter },
    ];
  }, []);

  // Engagement by platform (bar chart)
  const engagementByPlatform = useMemo(() => {
    const platforms: Platform[] = ["youtube", "instagram", "tiktok", "linkedin", "twitter"];
    return platforms.map((p) => {
      const platformData = mockEngagementData.filter((d) => d.platform === p);
      const avgRate = platformData.reduce((sum, d) => sum + d.rate, 0) / (platformData.length || 1);
      return {
        platform: p.charAt(0).toUpperCase() + p.slice(1),
        rate: Number(avgRate.toFixed(2)),
        color: PLATFORM_COLORS[p],
      };
    });
  }, []);

  // Engagement over time
  const engagementTimeline = useMemo(() => {
    const dateMap = new Map<string, { total: number; count: number }>();
    const filtered = selectedPlatform === "all"
      ? mockEngagementData
      : mockEngagementData.filter((d) => d.platform === selectedPlatform);

    filtered.forEach((d) => {
      const existing = dateMap.get(d.date);
      if (existing) {
        existing.total += d.rate;
        existing.count += 1;
      } else {
        dateMap.set(d.date, { total: d.rate, count: 1 });
      }
    });

    return Array.from(dateMap.entries())
      .map(([date, { total, count }]) => ({
        date,
        rate: Number((total / count).toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-dateRange);
  }, [selectedPlatform, dateRange]);

  const totalFollowers = useMemo(() => {
    const latest = mockGrowthData[mockGrowthData.length - 1];
    if (!latest) return 0;
    return latest.youtube + latest.instagram + latest.tiktok + latest.linkedin + latest.twitter;
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.[0]) return null;
    return (
      <div className="glass-card p-3">
        <p className="text-xs text-[var(--color-text-muted)]">
          {new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </p>
        <p className="text-sm font-semibold mt-1">{payload[0].value}%</p>
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Deep dive into your cross-platform performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-bg-input)]">
            {[7, 30, 60, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDateRange(d)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  dateRange === d
                    ? "bg-[var(--color-accent)] text-white"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                )}
              >
                {d}D
              </button>
            ))}
          </div>
          <button className="p-2.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg-card-hover)] transition-colors">
            <Download className="w-4 h-4 text-[var(--color-text-secondary)]" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Followers", value: formatNumber(totalFollowers), change: "+6.4%", up: true },
          { label: "Avg Engagement", value: "4.72%", change: "+9.5%", up: true },
          { label: "Content Published", value: "47", change: "+12", up: true },
          { label: "Total Reach", value: "4.3M", change: "+15.2%", up: true },
        ].map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-5"
          >
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
            <div className={cn(
              "flex items-center gap-1 mt-2 text-xs font-medium",
              card.up ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
            )}>
              {card.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {card.change} vs last period
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Engagement Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 xl:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Engagement Over Time</h3>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as Platform | "all")}
              className="px-3 py-1.5 rounded-lg bg-[var(--color-bg-input)] border border-[var(--color-border)] text-sm outline-none"
            >
              <option value="all">All Platforms</option>
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">X / Twitter</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementTimeline}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--color-border)" }}
                  interval={Math.floor(engagementTimeline.length / 5)}
                  tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="rate" stroke="var(--color-accent)" strokeWidth={2} fill="url(#areaGradient)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Platform Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <h3 className="text-lg font-semibold mb-4">Follower Distribution</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  stroke="none"
                >
                  {platformDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatNumber(value)}
                  contentStyle={{
                    background: "var(--color-bg-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {platformDistribution.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-[var(--color-text-secondary)]">{p.name}</span>
                </div>
                <span className="font-medium">{formatNumber(p.value)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Engagement by Platform */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-5"
      >
        <h3 className="text-lg font-semibold mb-4">Engagement Rate by Platform</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementByPlatform}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis
                dataKey="platform"
                tick={{ fontSize: 12, fill: "var(--color-text-muted)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--color-border)" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-bg-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value}%`, "Engagement Rate"]}
              />
              <Bar dataKey="rate" radius={[8, 8, 0, 0]} maxBarSize={60}>
                {engagementByPlatform.map((entry, index) => (
                  <Cell key={index} fill={entry.color} opacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}
