"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { EngagementDataPoint, Platform } from "@/lib/types";
import { cn, formatPercent } from "@/lib/utils";

interface EngagementTrendsProps {
  data: EngagementDataPoint[];
}

const timeRanges = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

export default function EngagementTrends({ data }: EngagementTrendsProps) {
  const [selectedRange, setSelectedRange] = useState(30);

  const aggregatedData = useMemo(() => {
    const dateMap = new Map<string, { total: number; count: number }>();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - selectedRange - 100);

    data.forEach((d) => {
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
      .slice(-selectedRange);
  }, [data, selectedRange]);

  const avgRate = useMemo(() => {
    if (aggregatedData.length === 0) return 0;
    return aggregatedData.reduce((sum, d) => sum + d.rate, 0) / aggregatedData.length;
  }, [aggregatedData]);

  const trend = useMemo(() => {
    if (aggregatedData.length < 2) return 0;
    const first = aggregatedData.slice(0, Math.floor(aggregatedData.length / 2));
    const second = aggregatedData.slice(Math.floor(aggregatedData.length / 2));
    const firstAvg = first.reduce((s, d) => s + d.rate, 0) / first.length;
    const secondAvg = second.reduce((s, d) => s + d.rate, 0) / second.length;
    return ((secondAvg - firstAvg) / firstAvg) * 100;
  }, [aggregatedData]);

  // Find anomalies (values > 1.5 std dev from mean)
  const anomalies = useMemo(() => {
    const mean = avgRate;
    const variance =
      aggregatedData.reduce((sum, d) => sum + Math.pow(d.rate - mean, 2), 0) /
      aggregatedData.length;
    const stdDev = Math.sqrt(variance);
    return aggregatedData.filter(
      (d) => Math.abs(d.rate - mean) > 1.5 * stdDev
    );
  }, [aggregatedData, avgRate]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload[0]) return null;
    const isAnomaly = anomalies.some((a) => a.date === label);
    return (
      <div className="glass-card p-3">
        <p className="text-xs text-[var(--color-text-muted)]">
          {new Date(label).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
        <p className="text-sm font-semibold mt-1">
          {formatPercent(payload[0].value)}
        </p>
        {isAnomaly && (
          <p className="text-xs text-[var(--color-warning)] mt-1">⚡ Anomaly detected</p>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-5"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-lg font-semibold">Engagement Trends</h3>
          <p className="text-sm text-[var(--color-text-muted)]">
            Rolling engagement rate across all platforms
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-bg-input)]">
          {timeRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => setSelectedRange(range.days)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                selectedRange === range.days
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="flex gap-6 mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)]">Avg Rate</p>
          <p className="text-xl font-bold">{formatPercent(avgRate)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-text-muted)]">Trend</p>
          <p className={cn(
            "text-xl font-bold",
            trend > 0 ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
          )}>
            {trend > 0 ? "+" : ""}{trend.toFixed(1)}%
          </p>
        </div>
        {anomalies.length > 0 && (
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Anomalies</p>
            <p className="text-xl font-bold text-[var(--color-warning)]">{anomalies.length}</p>
          </div>
        )}
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={aggregatedData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
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
              interval={Math.floor(aggregatedData.length / 5)}
              tickFormatter={(v) =>
                new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="var(--color-accent)"
              strokeWidth={2}
              fill="url(#engagementGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "var(--color-accent)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
