"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockTopContent } from "@/lib/mock-data";
import { Platform, TopContent } from "@/lib/types";
import { cn, formatNumber, getPlatformColor } from "@/lib/utils";
import {
  Search, Filter, SortAsc, SortDesc, Grid3X3, List,
  Heart, MessageCircle, Share2, Eye, Sparkles, ExternalLink,
  ChevronDown, X,
} from "lucide-react";

// Generate more mock content
const allContent: TopContent[] = [
  ...mockTopContent,
  {
    id: "tc_7", platform: "youtube", type: "video", title: "Behind the Scenes: How I Edit My Videos",
    thumbnail: "", engagementRate: 5.6, likes: 12300, comments: 890, shares: 2100, views: 215000, reach: 180000,
    aiScore: 72, publishedAt: "2025-01-07T10:00:00Z", caption: "Full editing workflow reveal",
  },
  {
    id: "tc_8", platform: "instagram", type: "story", title: "Q&A: Ask Me Anything",
    thumbnail: "", engagementRate: 3.2, likes: 5400, comments: 320, shares: 180, views: 0, reach: 95000,
    aiScore: 58, publishedAt: "2025-01-09T18:00:00Z", caption: "Thanks for all your questions!",
  },
  {
    id: "tc_9", platform: "tiktok", type: "short", title: "When the algorithm finally hits",
    thumbnail: "", engagementRate: 14.2, likes: 124000, comments: 5600, shares: 22000, views: 2100000, reach: 1800000,
    aiScore: 97, publishedAt: "2025-01-05T19:00:00Z", caption: "This is what going viral looks like 🚀",
  },
  {
    id: "tc_10", platform: "linkedin", type: "text", title: "3 Lessons from Scaling a Content Business",
    thumbnail: "", engagementRate: 4.8, likes: 3100, comments: 220, shares: 640, views: 0, reach: 82000,
    aiScore: 76, publishedAt: "2025-01-06T07:30:00Z", caption: "What I wish I knew 2 years ago.",
  },
];

type SortField = "engagementRate" | "likes" | "views" | "aiScore" | "publishedAt";

export default function ContentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("engagementRate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredContent = useMemo(() => {
    let result = [...allContent];

    if (searchQuery) {
      result = result.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.caption.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (platformFilter !== "all") {
      result = result.filter((c) => c.platform === platformFilter);
    }

    if (typeFilter !== "all") {
      result = result.filter((c) => c.type === typeFilter);
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return result;
  }, [searchQuery, platformFilter, typeFilter, sortField, sortDir]);

  const contentTypes = [...new Set(allContent.map((c) => c.type))];

  const getAIScoreColor = (score: number) => {
    if (score >= 85) return "text-[var(--color-success)]";
    if (score >= 65) return "text-[var(--color-accent)]";
    if (score >= 45) return "text-[var(--color-warning)]";
    return "text-[var(--color-error)]";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Content Analyzer</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Explore, rank, and analyze all your content with AI-powered scoring
        </p>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search content..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-bg-input)] border border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none text-sm transition-colors"
              aria-label="Search content"
            />
          </div>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as Platform | "all")}
            className="px-3 py-2.5 rounded-xl bg-[var(--color-bg-input)] border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-accent)]"
            aria-label="Filter by platform"
          >
            <option value="all">All Platforms</option>
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">X / Twitter</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[var(--color-bg-input)] border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-accent)]"
            aria-label="Filter by content type"
          >
            <option value="all">All Types</option>
            {contentTypes.map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>

          {/* Sort */}
          <div className="flex items-center gap-1">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="px-3 py-2.5 rounded-xl bg-[var(--color-bg-input)] border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-accent)]"
              aria-label="Sort by"
            >
              <option value="engagementRate">Engagement</option>
              <option value="aiScore">AI Score</option>
              <option value="likes">Likes</option>
              <option value="views">Views</option>
              <option value="publishedAt">Date</option>
            </select>
            <button
              onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
              className="p-2.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg-card-hover)] transition-colors"
              aria-label={`Sort ${sortDir === "asc" ? "descending" : "ascending"}`}
            >
              {sortDir === "desc" ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-bg-input)]">
            <button
              onClick={() => setViewMode("grid")}
              className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-[var(--color-accent)] text-white" : "text-[var(--color-text-muted)]")}
              aria-label="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-[var(--color-accent)] text-white" : "text-[var(--color-text-muted)]")}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-[var(--color-text-muted)]">
        {filteredContent.length} content items
      </p>

      {/* Content Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredContent.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group glass-card overflow-hidden cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative h-32 bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-card)]">
                  <div className={cn("absolute inset-0 opacity-20")} style={{ background: `linear-gradient(135deg, ${getPlatformColor(item.platform)}30, transparent)` }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl">{item.type === "video" ? "🎬" : item.type === "carousel" ? "🎠" : item.type === "reel" ? "🎥" : item.type === "short" ? "⚡" : item.type === "story" ? "📖" : "📝"}</span>
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white" style={{ backgroundColor: getPlatformColor(item.platform) + "CC" }}>
                    {item.platform}
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span className={cn("text-[10px] font-bold", getAIScoreColor(item.aiScore))}>{item.aiScore}</span>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="text-sm font-semibold mb-1 line-clamp-2 group-hover:text-[var(--color-accent-hover)] transition-colors">{item.title}</h4>
                  <p className="text-xs text-[var(--color-text-muted)] mb-3 line-clamp-1">{item.caption}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatNumber(item.likes)}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{formatNumber(item.comments)}</span>
                      <span className="flex items-center gap-1"><Share2 className="w-3 h-3" />{formatNumber(item.shares)}</span>
                    </div>
                    <span className="text-xs font-bold text-[var(--color-accent)]">{item.engagementRate}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredContent.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="glass-card p-4 flex items-center gap-4 cursor-pointer"
              >
                <span className="text-lg font-bold text-[var(--color-text-muted)] w-6 flex-shrink-0">#{index + 1}</span>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: getPlatformColor(item.platform) + "15" }}
                >
                  <span className="text-lg">{item.type === "video" ? "🎬" : item.type === "carousel" ? "🎠" : "📝"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: getPlatformColor(item.platform) + "20", color: getPlatformColor(item.platform) }}>
                      {item.platform}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">{item.type}</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatNumber(item.likes)}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(item.views || item.reach)}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-bold text-[var(--color-accent)]">{item.engagementRate}%</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">engagement</p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/20">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span className={cn("text-xs font-bold", getAIScoreColor(item.aiScore))}>{item.aiScore}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
