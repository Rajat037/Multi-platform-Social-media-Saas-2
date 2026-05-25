"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Platform } from "@/lib/types";
import { cn, getPlatformColor } from "@/lib/utils";
import {
  TrendingUp, ArrowRight, ArrowLeft, Check, Loader2,
  Youtube, Instagram, Linkedin, Plug, Sparkles, ChevronRight,
} from "lucide-react";

const TikTokIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z" />
  </svg>
);

const XIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface PlatformItem {
  id: Platform;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
  metrics: string[];
}

const platforms: PlatformItem[] = [
  {
    id: "youtube", name: "YouTube", icon: Youtube, color: "#FF0000",
    description: "Connect your YouTube channel for video analytics",
    metrics: ["Views", "Watch Time", "Subscribers", "CTR"],
  },
  {
    id: "instagram", name: "Instagram", icon: Instagram, color: "#E4405F",
    description: "Connect your Instagram business account",
    metrics: ["Reach", "Impressions", "Saves", "Growth"],
  },
  {
    id: "tiktok", name: "TikTok", icon: TikTokIcon, color: "#00F2EA",
    description: "Connect your TikTok creator account",
    metrics: ["Views", "Shares", "Completion", "Followers"],
  },
  {
    id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "#0A66C2",
    description: "Connect your LinkedIn page or profile",
    metrics: ["Impressions", "Clicks", "Demographics", "Followers"],
  },
  {
    id: "twitter", name: "X / Twitter", icon: XIcon, color: "#1DA1F2",
    description: "Connect your X account",
    metrics: ["Impressions", "Retweets", "Link Clicks", "Growth"],
  },
];

const steps = ["Connect Platforms", "Configure", "Ready"];

export default function OnboardingPage() {
  const router = useRouter();
  const { connectedPlatforms, connectPlatform, disconnectPlatform, setOnboardingComplete } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);

  const handleConnect = async (platform: Platform) => {
    setConnectingPlatform(platform);
    // Simulate OAuth flow
    await new Promise((r) => setTimeout(r, 1500));
    connectPlatform(platform);
    setConnectingPlatform(null);
  };

  const handleDisconnect = (platform: Platform) => {
    disconnectPlatform(platform);
  };

  const handleFinish = () => {
    setOnboardingComplete(true);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[30%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">SocialPulse</span>
        </div>
        <button
          onClick={handleFinish}
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          Skip for now →
        </button>
      </div>

      {/* Progress Steps */}
      <div className="relative z-10 max-w-xl mx-auto w-full px-6 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                  index < currentStep
                    ? "bg-[var(--color-success)] text-white"
                    : index === currentStep
                    ? "bg-[var(--color-accent)] text-white"
                    : "bg-[var(--color-bg-card)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                )}>
                  {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className={cn(
                  "text-sm hidden sm:inline",
                  index <= currentStep ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"
                )}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-px mx-3",
                  index < currentStep ? "bg-[var(--color-success)]" : "bg-[var(--color-border)]"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-start justify-center px-6 py-8">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-2xl"
            >
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-muted)] flex items-center justify-center mx-auto mb-4">
                  <Plug className="w-7 h-7 text-[var(--color-accent)]" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Connect Your Platforms</h2>
                <p className="text-[var(--color-text-secondary)]">
                  Link your social accounts to start pulling in analytics. Connect at least one to continue.
                </p>
              </div>

              <div className="space-y-3">
                {platforms.map((platform) => {
                  const isConnected = connectedPlatforms.includes(platform.id);
                  const isConnecting = connectingPlatform === platform.id;
                  const IconComp = platform.icon;

                  return (
                    <motion.div
                      key={platform.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border transition-all",
                        isConnected
                          ? "border-[var(--color-success)]/30 bg-[var(--color-success-muted)]/30"
                          : "border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-hover)]"
                      )}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: platform.color + "15" }}
                      >
                        <span style={{ color: platform.color }}>
                          <IconComp className="w-6 h-6" />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{platform.name}</h3>
                        <p className="text-xs text-[var(--color-text-muted)]">{platform.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {platform.metrics.map((m) => (
                            <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-bg-input)] text-[var(--color-text-muted)]">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => isConnected ? handleDisconnect(platform.id) : handleConnect(platform.id)}
                        disabled={isConnecting}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0",
                          isConnected
                            ? "bg-[var(--color-success-muted)] text-[var(--color-success)] hover:bg-[var(--color-error-muted)] hover:text-[var(--color-error)]"
                            : "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]",
                          isConnecting && "opacity-70 cursor-not-allowed"
                        )}
                      >
                        {isConnecting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isConnected ? (
                          <span className="flex items-center gap-1.5">
                            <Check className="w-4 h-4" /> Connected
                          </span>
                        ) : (
                          "Connect"
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  disabled={connectedPlatforms.length === 0}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all",
                    connectedPlatforms.length > 0
                      ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
                      : "bg-[var(--color-bg-card)] text-[var(--color-text-muted)] cursor-not-allowed"
                  )}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-lg"
            >
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-muted)] flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-7 h-7 text-[var(--color-accent)]" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Configure Your Dashboard</h2>
                <p className="text-[var(--color-text-secondary)]">
                  Set your preferences. You can change these anytime in settings.
                </p>
              </div>

              <div className="space-y-4">
                <div className="glass-card p-5">
                  <h3 className="font-semibold mb-3">Sync Frequency</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {["Every 6h", "Every 12h", "Daily"].map((opt, i) => (
                      <button
                        key={opt}
                        className={cn(
                          "py-2.5 rounded-xl text-sm font-medium border transition-all",
                          i === 0
                            ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]"
                            : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-5">
                  <h3 className="font-semibold mb-3">Email Notifications</h3>
                  <div className="space-y-3">
                    {["Weekly performance digest", "AI recommendations", "Platform alerts"].map((item, i) => (
                      <label key={item} className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm text-[var(--color-text-secondary)]">{item}</span>
                        <div className={cn(
                          "w-10 h-6 rounded-full relative transition-colors cursor-pointer",
                          "bg-[var(--color-accent)]"
                        )}>
                          <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform" />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-5">
                  <h3 className="font-semibold mb-3">Timezone</h3>
                  <select className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-input)] border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-accent)]">
                    <option>America/New_York (EST)</option>
                    <option>America/Los_Angeles (PST)</option>
                    <option>Europe/London (GMT)</option>
                    <option>Asia/Tokyo (JST)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-all"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-success)] to-emerald-400 flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">You&apos;re all set!</h2>
              <p className="text-[var(--color-text-secondary)] mb-3">
                {connectedPlatforms.length} platform{connectedPlatforms.length !== 1 ? "s" : ""} connected.
                Your data is being synced and will be ready in a few minutes.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {connectedPlatforms.map((p) => {
                  const plat = platforms.find((pl) => pl.id === p);
                  return plat ? (
                    <span
                      key={p}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: plat.color + "20",
                        color: plat.color,
                      }}
                    >
                      {plat.name}
                    </span>
                  ) : null;
                })}
              </div>
              <button
                onClick={handleFinish}
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold mx-auto hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
