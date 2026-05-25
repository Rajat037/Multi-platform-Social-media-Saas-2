"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { CompetitorBenchmark } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

interface CompetitorBenchmarkingProps {
  benchmarks: CompetitorBenchmark[];
}

export default function CompetitorBenchmarking({ benchmarks }: CompetitorBenchmarkingProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload[0]) return null;
    const benchmark = benchmarks.find((b) => b.metric === label);
    if (!benchmark) return null;
    return (
      <div className="glass-card p-3 min-w-[200px]">
        <p className="text-xs font-semibold mb-2">{label}</p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-[var(--color-accent)]">You</span>
            <span className="font-medium">{typeof benchmark.yourValue === "number" && benchmark.yourValue >= 100 ? formatNumber(benchmark.yourValue) : benchmark.yourValue + (label.includes("Rate") || label.includes("Growth") || label.includes("Score") ? "%" : "")}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[var(--color-text-muted)]">Industry Avg</span>
            <span>{typeof benchmark.industryAvg === "number" && benchmark.industryAvg >= 100 ? formatNumber(benchmark.industryAvg) : benchmark.industryAvg + (label.includes("Rate") || label.includes("Growth") || label.includes("Score") ? "%" : "")}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-amber-400">Top Performer</span>
            <span>{typeof benchmark.topPerformer === "number" && benchmark.topPerformer >= 100 ? formatNumber(benchmark.topPerformer) : benchmark.topPerformer + (label.includes("Rate") || label.includes("Growth") || label.includes("Score") ? "%" : "")}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold">Competitor Benchmarking</h3>
          <p className="text-sm text-[var(--color-text-muted)]">
            Your performance vs. industry averages
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-[var(--color-accent)]">
          PRO
        </span>
      </div>

      {/* Percentile Bars */}
      <div className="space-y-4 mb-6">
        {benchmarks.map((benchmark, index) => (
          <motion.div
            key={benchmark.metric}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium">{benchmark.metric}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[var(--color-accent)]">
                  {benchmark.percentile}th
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">percentile</span>
              </div>
            </div>
            <div className="relative h-2 rounded-full bg-[var(--color-bg-input)]">
              {/* Industry avg marker */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[var(--color-text-muted)] rounded-full z-10"
                style={{ left: `${(benchmark.industryAvg / benchmark.topPerformer) * 100}%` }}
                title="Industry Average"
              />
              {/* Your value bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${benchmark.percentile}%` }}
                transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full",
                  benchmark.percentile >= 70
                    ? "bg-gradient-to-r from-[var(--color-success)] to-emerald-400"
                    : benchmark.percentile >= 40
                    ? "bg-gradient-to-r from-[var(--color-accent)] to-purple-400"
                    : "bg-gradient-to-r from-[var(--color-warning)] to-amber-400"
                )}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-3 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <div className="w-8 h-1.5 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-purple-400" />
          Your Performance
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <div className="w-0.5 h-3 bg-[var(--color-text-muted)] rounded-full" />
          Industry Average
        </div>
      </div>
    </motion.div>
  );
}
