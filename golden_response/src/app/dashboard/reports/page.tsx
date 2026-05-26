"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  FileText, Download, Calendar, Clock, ChevronRight,
  FilePlus, Trash2, Send, FileJson, FileSpreadsheet, FileType,
  Plus, Settings, Check,
} from "lucide-react";

interface Report {
  id: string;
  name: string;
  type: "overview" | "platform" | "content" | "custom";
  format: "pdf" | "csv" | "json";
  createdAt: string;
  size: string;
  status: "ready" | "generating" | "scheduled";
}

const mockReports: Report[] = [
  { id: "r1", name: "Weekly Performance Report - Jan 15", type: "overview", format: "pdf", createdAt: "2025-01-15T06:00:00Z", size: "2.4 MB", status: "ready" },
  { id: "r2", name: "TikTok Deep Dive - January", type: "platform", format: "pdf", createdAt: "2025-01-14T10:00:00Z", size: "1.8 MB", status: "ready" },
  { id: "r3", name: "Content Analytics Export", type: "content", format: "csv", createdAt: "2025-01-13T14:00:00Z", size: "456 KB", status: "ready" },
  { id: "r4", name: "Full Analytics Data - Q4 2024", type: "overview", format: "json", createdAt: "2025-01-10T08:00:00Z", size: "3.2 MB", status: "ready" },
  { id: "r5", name: "Weekly Report - Jan 22", type: "overview", format: "pdf", createdAt: "", size: "", status: "scheduled" },
];

const scheduledReports = [
  { name: "Weekly Performance Digest", frequency: "Every Monday 6 AM", format: "PDF", enabled: true },
  { name: "Monthly Analytics Export", frequency: "1st of each month", format: "CSV", enabled: true },
  { name: "Quarterly Summary", frequency: "Every quarter", format: "PDF", enabled: false },
];

const formatIcons: Record<string, React.ElementType> = {
  pdf: FileType,
  csv: FileSpreadsheet,
  json: FileJson,
};

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"reports" | "scheduled">("reports");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Generate, export, and schedule your analytics reports
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          New Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-bg-input)] w-fit">
        {(["reports", "scheduled"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize",
              activeTab === tab
                ? "bg-[var(--color-accent)] text-white"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "reports" ? (
        <div className="space-y-3">
          {/* Export format selector */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5"
          >
            <h3 className="text-lg font-semibold mb-4">Quick Export</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { format: "PDF", desc: "Print-ready report with charts", icon: FileType, color: "#ef4444" },
                { format: "CSV", desc: "Raw data for spreadsheets", icon: FileSpreadsheet, color: "#10b981" },
                { format: "JSON", desc: "Structured data for developers", icon: FileJson, color: "#f59e0b" },
              ].map((item) => (
                <button
                  key={item.format}
                  className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-border-hover)] bg-[var(--color-bg-card)] transition-all text-left group"
                >
                  <div className="p-2.5 rounded-lg" style={{ backgroundColor: item.color + "15" }}>
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold group-hover:text-[var(--color-accent-hover)] transition-colors">
                      Export as {item.format}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Report History */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5"
          >
            <h3 className="text-lg font-semibold mb-4">Report History</h3>
            <div className="space-y-2">
              {mockReports.map((report, i) => {
                const FormatIcon = formatIcons[report.format] || FileText;
                return (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--color-bg-card-hover)] transition-colors group"
                  >
                    <FormatIcon className="w-5 h-5 text-[var(--color-text-muted)] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{report.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--color-text-muted)]">
                        <span className="uppercase">{report.format}</span>
                        {report.size && <span>• {report.size}</span>}
                        {report.createdAt && (
                          <span>• {new Date(report.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        )}
                      </div>
                    </div>
                    {report.status === "ready" ? (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent-muted)] transition-colors opacity-0 group-hover:opacity-100">
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    ) : report.status === "scheduled" ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[var(--color-warning-muted)] text-[var(--color-warning)]">
                        Scheduled
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[var(--color-accent-muted)] text-[var(--color-accent)]">
                        Generating...
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5"
        >
          <h3 className="text-lg font-semibold mb-4">Scheduled Reports</h3>
          <div className="space-y-3">
            {scheduledReports.map((report, i) => (
              <div
                key={report.name}
                className="flex items-center gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]"
              >
                <div className="p-2 rounded-lg bg-[var(--color-accent-muted)]">
                  <Clock className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{report.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {report.frequency} • {report.format}
                  </p>
                </div>
                <div className={cn(
                  "w-10 h-6 rounded-full relative cursor-pointer transition-colors",
                  report.enabled ? "bg-[var(--color-accent)]" : "bg-[var(--color-bg-input)]"
                )}>
                  <div className={cn(
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                    report.enabled ? "right-0.5" : "left-0.5"
                  )} />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[var(--color-border)] text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)] transition-colors">
            <Plus className="w-4 h-4" />
            Add Scheduled Report
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
