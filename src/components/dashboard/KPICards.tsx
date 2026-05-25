"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn, formatNumber, formatPercent } from "@/lib/utils";
import { KPIMetric } from "@/lib/types";
import { TrendingUp, TrendingDown, Users, Eye, Zap, Trophy } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  followers: Users,
  reach: Eye,
  engagement: Zap,
  tiktok: Trophy,
};

interface KPICardsProps {
  metrics: KPIMetric[];
}

export default function KPICards({ metrics }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.label.toLowerCase().includes("follower")
          ? Users
          : metric.label.toLowerCase().includes("reach")
          ? Eye
          : metric.label.toLowerCase().includes("engagement")
          ? Zap
          : Trophy;

        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="glass-card p-5 group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn(
                "p-2.5 rounded-xl",
                metric.changeType === "increase" ? "bg-[var(--color-success-muted)]" : "bg-[var(--color-error-muted)]"
              )}>
                <Icon className={cn(
                  "w-5 h-5",
                  metric.changeType === "increase" ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
                )} />
              </div>
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                metric.changeType === "increase"
                  ? "bg-[var(--color-success-muted)] text-[var(--color-success)]"
                  : "bg-[var(--color-error-muted)] text-[var(--color-error)]"
              )}>
                {metric.changeType === "increase" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {metric.change.toFixed(1)}%
              </div>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">{metric.label}</p>
            <p className="text-2xl font-bold tracking-tight">
              {metric.format === "percent" ? formatPercent(metric.value) : formatNumber(metric.value)}
            </p>
            <div className="mt-3 h-1 rounded-full bg-[var(--color-bg-input)] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (metric.value / (metric.previousValue * 1.5)) * 100)}%` }}
                transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full",
                  metric.changeType === "increase"
                    ? "bg-gradient-to-r from-[var(--color-success)] to-emerald-400"
                    : "bg-gradient-to-r from-[var(--color-error)] to-red-400"
                )}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
