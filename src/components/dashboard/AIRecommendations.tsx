"use client";

import React from "react";
import { motion } from "framer-motion";
import { AIRecommendation } from "@/lib/types";
import { cn, getPlatformColor } from "@/lib/utils";
import { Clock, FileText, Hash, Layout, TrendingUp, ChevronRight, Sparkles } from "lucide-react";

interface AIRecommendationsProps {
  recommendations: AIRecommendation[];
}

const typeConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  timing: { icon: Clock, label: "Timing", color: "#6366f1" },
  content: { icon: FileText, label: "Content", color: "#10b981" },
  hashtag: { icon: Hash, label: "Hashtag", color: "#f59e0b" },
  format: { icon: Layout, label: "Format", color: "#ec4899" },
  trend: { icon: TrendingUp, label: "Trend", color: "#06b6d4" },
};

const impactStyles: Record<string, string> = {
  high: "bg-[var(--color-success-muted)] text-[var(--color-success)] border-[var(--color-success)]/20",
  medium: "bg-[var(--color-warning-muted)] text-[var(--color-warning)] border-[var(--color-warning)]/20",
  low: "bg-[var(--color-bg-input)] text-[var(--color-text-muted)] border-[var(--color-border)]",
};

export default function AIRecommendations({ recommendations }: AIRecommendationsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">AI Recommendations</h3>
          <p className="text-sm text-[var(--color-text-muted)]">
            Actionable insights refreshed weekly
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          const config = typeConfig[rec.type];
          const Icon = config.icon;
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="group p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: config.color + "20" }}
                >
                  <Icon className="w-4 h-4" style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="text-sm font-semibold group-hover:text-[var(--color-accent-hover)] transition-colors">
                      {rec.title}
                    </h4>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                      impactStyles[rec.impact]
                    )}>
                      {rec.impact.toUpperCase()}
                    </span>
                    {rec.platform && (
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{
                          backgroundColor: getPlatformColor(rec.platform) + "20",
                          color: getPlatformColor(rec.platform),
                        }}
                      >
                        {rec.platform}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    {rec.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-1.5 rounded-full bg-[var(--color-bg-input)] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${rec.confidence}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                          className="h-full rounded-full bg-[var(--color-accent)]"
                        />
                      </div>
                      <span className="text-[10px] text-[var(--color-text-muted)]">
                        {rec.confidence}% confidence
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors flex-shrink-0 mt-1" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
