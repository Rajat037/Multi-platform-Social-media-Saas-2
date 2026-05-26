"use client";

import React, { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  mockKPIs, mockGrowthData, mockHeatmapData, mockEngagementData,
  mockTopContent, mockAIRecommendations, mockCompetitorBenchmarks,
} from "@/lib/mock-data";

// Lazy load heavy chart components
const KPICards = dynamic(() => import("@/components/dashboard/KPICards"), { ssr: false });
const GrowthChart = dynamic(() => import("@/components/dashboard/GrowthChart"), { ssr: false });
const HeatmapChart = dynamic(() => import("@/components/dashboard/HeatmapChart"), { ssr: false });
const EngagementTrends = dynamic(() => import("@/components/dashboard/EngagementTrends"), { ssr: false });
const TopContentCards = dynamic(() => import("@/components/dashboard/TopContentCards"), { ssr: false });
const AIRecommendations = dynamic(() => import("@/components/dashboard/AIRecommendations"), { ssr: false });
const CompetitorBenchmarking = dynamic(() => import("@/components/dashboard/CompetitorBenchmarking"), { ssr: false });

function SkeletonCard({ height = "h-48" }: { height?: string }) {
  return <div className={`skeleton ${height} w-full rounded-2xl`} />;
}

function SkeletonKPI() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton h-36 rounded-2xl" />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Your cross-platform performance at a glance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-muted)]">Last synced 2 hours ago</span>
          <button className="px-4 py-2 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-medium transition-colors">
            Sync Now
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <SkeletonKPI />
      ) : (
        <Suspense fallback={<SkeletonKPI />}>
          <KPICards metrics={mockKPIs} />
        </Suspense>
      )}

      {/* Growth + Engagement Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <SkeletonCard height="h-[460px]" />
            <SkeletonCard height="h-[460px]" />
          </>
        ) : (
          <>
            <Suspense fallback={<SkeletonCard height="h-[460px]" />}>
              <GrowthChart data={mockGrowthData} />
            </Suspense>
            <Suspense fallback={<SkeletonCard height="h-[460px]" />}>
              <EngagementTrends data={mockEngagementData} />
            </Suspense>
          </>
        )}
      </div>

      {/* Heatmap */}
      {isLoading ? (
        <SkeletonCard height="h-[320px]" />
      ) : (
        <Suspense fallback={<SkeletonCard height="h-[320px]" />}>
          <HeatmapChart data={mockHeatmapData} />
        </Suspense>
      )}

      {/* Top Content */}
      {isLoading ? (
        <SkeletonCard height="h-[400px]" />
      ) : (
        <Suspense fallback={<SkeletonCard height="h-[400px]" />}>
          <TopContentCards content={mockTopContent} />
        </Suspense>
      )}

      {/* AI Recommendations + Competitor Benchmarking */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <SkeletonCard height="h-[500px]" />
            <SkeletonCard height="h-[400px]" />
          </>
        ) : (
          <>
            <Suspense fallback={<SkeletonCard height="h-[500px]" />}>
              <AIRecommendations recommendations={mockAIRecommendations} />
            </Suspense>
            <Suspense fallback={<SkeletonCard height="h-[400px]" />}>
              <CompetitorBenchmarking benchmarks={mockCompetitorBenchmarks} />
            </Suspense>
          </>
        )}
      </div>
    </motion.div>
  );
}
