"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { GrowthDataPoint, Platform } from "@/lib/types";
import { formatNumber, getPlatformColor, cn } from "@/lib/utils";

interface GrowthChartProps {
  data: GrowthDataPoint[];
}

const platformLabels: Record<Platform, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  twitter: "X / Twitter",
};

const dateRangeOptions = [
  { label: "30D", days: 30 },
  { label: "60D", days: 60 },
  { label: "90D", days: 90 },
  { label: "All", days: 180 },
];

export default function GrowthChart({ data }: GrowthChartProps) {
  const [activePlatforms, setActivePlatforms] = useState<Platform[]>([
    "youtube", "instagram", "tiktok", "linkedin", "twitter",
  ]);
  const [dateRange, setDateRange] = useState(90);

  const filteredData = useMemo(() => {
    return data.slice(-dateRange);
  }, [data, dateRange]);

  const togglePlatform = (platform: Platform) => {
    setActivePlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="glass-card p-3 min-w-[180px]">
        <p className="text-xs text-[var(--color-text-muted)] mb-2">{label}</p>
        {payload.map((item: any) => (
          <div key={item.dataKey} className="flex items-center justify-between gap-4 py-0.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
              <span className="text-xs">{platformLabels[item.dataKey as Platform]}</span>
            </div>
            <span className="text-xs font-semibold">{formatNumber(item.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-5"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-lg font-semibold">Growth Analytics</h3>
          <p className="text-sm text-[var(--color-text-muted)]">Follower growth across platforms</p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-bg-input)]">
          {dateRangeOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setDateRange(opt.days)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                dateRange === opt.days
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Platform Toggles */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.keys(platformLabels) as Platform[]).map((platform) => (
          <button
            key={platform}
            onClick={() => togglePlatform(platform)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              activePlatforms.includes(platform)
                ? "border-transparent text-white"
                : "border-[var(--color-border)] text-[var(--color-text-muted)] opacity-50"
            )}
            style={{
              backgroundColor: activePlatforms.includes(platform)
                ? getPlatformColor(platform) + "20"
                : "transparent",
              color: activePlatforms.includes(platform) ? getPlatformColor(platform) : undefined,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getPlatformColor(platform) }}
            />
            {platformLabels[platform]}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-border)" }}
              interval={Math.floor(filteredData.length / 6)}
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
            {activePlatforms.map((platform) => (
              <Line
                key={platform}
                type="monotone"
                dataKey={platform}
                stroke={getPlatformColor(platform)}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
