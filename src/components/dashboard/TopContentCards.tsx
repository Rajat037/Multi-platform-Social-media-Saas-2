"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopContent } from "@/lib/types";
import { cn, formatNumber, getPlatformColor, getPlatformGradient } from "@/lib/utils";
import { Heart, MessageCircle, Share2, Eye, Sparkles, ExternalLink } from "lucide-react";

interface TopContentCardsProps {
  content: TopContent[];
}

const typeIcons: Record<string, string> = {
  video: "🎬",
  image: "📷",
  carousel: "🎠",
  text: "📝",
  reel: "🎥",
  short: "⚡",
  story: "📖",
};

export default function TopContentCards({ content }: TopContentCardsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold">Top Performing Content</h3>
          <p className="text-sm text-[var(--color-text-muted)]">
            Ranked by engagement rate with AI prediction scores
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {content.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="group relative bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-border-hover)] overflow-hidden transition-all cursor-pointer"
          >
            {/* Thumbnail area */}
            <div className="relative h-36 bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-card)]">
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-20",
                getPlatformGradient(item.platform)
              )} />
              <div className="absolute inset-0 flex items-center justify-center text-4xl">
                {typeIcons[item.type] || "📄"}
              </div>

              {/* Platform badge */}
              <div
                className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white flex items-center gap-1"
                style={{ backgroundColor: getPlatformColor(item.platform) + "CC" }}
              >
                {item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
              </div>

              {/* AI Score */}
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] font-bold text-amber-400">{item.aiScore}%</span>
              </div>

              {/* Rank badge */}
              <div className="absolute bottom-3 left-3 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-xs font-bold">
                #{index + 1}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Content info */}
            <div className="p-4">
              <h4 className="text-sm font-semibold mb-2 line-clamp-2 group-hover:text-[var(--color-accent-hover)] transition-colors">
                {item.title}
              </h4>

              {/* Engagement rate bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[var(--color-text-muted)]">Engagement</span>
                  <span className="font-semibold text-[var(--color-accent)]">
                    {item.engagementRate}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--color-bg-input)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, item.engagementRate * 8)}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-purple-500"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2">
                <div className="flex flex-col items-center gap-0.5">
                  <Heart className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  <span className="text-[10px] font-medium">{formatNumber(item.likes)}</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <MessageCircle className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  <span className="text-[10px] font-medium">{formatNumber(item.comments)}</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Share2 className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  <span className="text-[10px] font-medium">{formatNumber(item.shares)}</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Eye className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  <span className="text-[10px] font-medium">{formatNumber(item.views || item.reach)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
