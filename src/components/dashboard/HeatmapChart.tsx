"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { HeatmapCell, Platform } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HeatmapChartProps {
  data: HeatmapCell[];
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = Array.from({ length: 24 }, (_, i) => {
  const h = i === 0 ? 12 : i > 12 ? i - 12 : i;
  return `${h}${i < 12 ? "a" : "p"}`;
});

function getHeatColor(value: number): string {
  if (value >= 80) return "rgba(99, 102, 241, 0.95)";
  if (value >= 60) return "rgba(99, 102, 241, 0.7)";
  if (value >= 40) return "rgba(99, 102, 241, 0.45)";
  if (value >= 20) return "rgba(99, 102, 241, 0.25)";
  return "rgba(99, 102, 241, 0.08)";
}

export default function HeatmapChart({ data }: HeatmapChartProps) {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

  const topSlots = useMemo(() => {
    return [...data].sort((a, b) => b.value - a.value).slice(0, 3);
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-5"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-lg font-semibold">Best Posting Times</h3>
          <p className="text-sm text-[var(--color-text-muted)]">
            Engagement by hour and day of week
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ background: "rgba(99, 102, 241, 0.08)" }} />
            <span className="text-xs text-[var(--color-text-muted)]">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ background: "rgba(99, 102, 241, 0.95)" }} />
            <span className="text-xs text-[var(--color-text-muted)]">High</span>
          </div>
        </div>
      </div>

      {/* Top 3 posting windows */}
      <div className="flex flex-wrap gap-2 mb-4">
        {topSlots.map((slot, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-accent-muted)] text-xs"
          >
            <span className="font-semibold text-[var(--color-accent)]">#{i + 1}</span>
            <span>{slot.dayLabel} {slot.hourLabel}</span>
          </div>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Hour labels */}
          <div className="flex ml-12">
            {hours.map((h, i) =>
              i % 2 === 0 ? (
                <div key={i} className="flex-1 text-center text-[10px] text-[var(--color-text-muted)] pb-1" style={{ minWidth: 0 }}>
                  {h}
                </div>
              ) : (
                <div key={i} className="flex-1" style={{ minWidth: 0 }} />
              )
            )}
          </div>

          {/* Rows */}
          {days.map((day, dayIndex) => (
            <div key={day} className="flex items-center gap-1 mb-1">
              <div className="w-10 text-right text-xs text-[var(--color-text-muted)] pr-2 flex-shrink-0">
                {day}
              </div>
              <div className="flex flex-1 gap-[2px]">
                {hours.map((_, hourIndex) => {
                  const cell = data.find(
                    (c) => c.day === dayIndex && c.hour === hourIndex
                  );
                  if (!cell) return <div key={hourIndex} className="flex-1 aspect-square" />;
                  const isTop = topSlots.some(
                    (s) => s.day === dayIndex && s.hour === hourIndex
                  );
                  return (
                    <motion.div
                      key={hourIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: (dayIndex * 24 + hourIndex) * 0.002,
                      }}
                      className={cn(
                        "flex-1 aspect-square rounded-[3px] cursor-pointer transition-all hover:ring-1 hover:ring-white/30 relative",
                        isTop && "ring-1 ring-[var(--color-accent)]"
                      )}
                      style={{ backgroundColor: getHeatColor(cell.value), minWidth: 0 }}
                      onMouseEnter={() => setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                      role="gridcell"
                      aria-label={`${day} ${cell.hourLabel}: engagement score ${cell.value}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-center text-sm text-[var(--color-text-secondary)]"
        >
          <span className="font-medium text-[var(--color-text-primary)]">
            {hoveredCell.dayLabel} at {hoveredCell.hourLabel}
          </span>
          {" — "}Engagement Score: <span className="font-semibold text-[var(--color-accent)]">{hoveredCell.value}/100</span>
        </motion.div>
      )}
    </motion.div>
  );
}
