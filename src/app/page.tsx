"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  TrendingUp, ArrowRight, Eye, EyeOff, Globe, Code2,
  BarChart3, Zap, Shield, Users, Sparkles, ChevronRight,
  Check, Play, Star,
} from "lucide-react";
import { mockPricingPlans } from "@/lib/mock-data";

type AuthMode = "landing" | "login" | "signup";

export default function LandingPage() {
  const [mode, setMode] = useState<AuthMode>("landing");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setAuthenticated } = useAppStore();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setAuthenticated(true);
    router.push("/onboarding");
  };

  const features = [
    { icon: BarChart3, title: "Unified Analytics", description: "All platforms in one dashboard. No more tab switching." },
    { icon: Sparkles, title: "AI-Powered Insights", description: "ML models predict performance and recommend strategies." },
    { icon: Zap, title: "Real-Time Data", description: "Metrics update automatically with zero manual effort." },
    { icon: Shield, title: "Enterprise Security", description: "AES-256 encryption, JWT rotation, SOC 2 compliant." },
    { icon: Users, title: "Team Workspaces", description: "Collaborate without stepping on each other's toes." },
    { icon: TrendingUp, title: "Growth Forecasting", description: "30-day follower predictions with confidence bands." },
  ];

  const stats = [
    { value: "12K+", label: "Active Users" },
    { value: "5M+", label: "Posts Analyzed" },
    { value: "98.9%", label: "Uptime" },
    { value: "4.9★", label: "User Rating" },
  ];

  if (mode === "landing") {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] overflow-hidden">
        {/* Animated background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px]" />
          <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-pink-500/5 blur-[100px]" />
        </div>

        {/* Nav */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">SocialPulse</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMode("login")}
              className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className="px-5 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-medium transition-colors"
            >
              Get Started
            </button>
          </div>
        </motion.nav>

        {/* Hero */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 lg:pt-24 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/20 mb-6">
              <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
              <span className="text-sm text-[var(--color-accent)]">Now with AI-powered forecasting</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Social media analytics
              <br />
              <span className="gradient-text">that actually work</span>
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop switching between five dashboards. SocialPulse unifies YouTube, Instagram,
              TikTok, LinkedIn, and X into one intelligent workspace with AI predictions,
              heatmaps, and actionable recommendations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setMode("signup")}
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)] font-medium transition-all">
                <Play className="w-4 h-4" />
                Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl lg:text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Features */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Everything you need, nothing you don&apos;t</h2>
            <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
              Built for creators, agencies, and teams who take growth seriously.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-card p-6 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-muted)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-accent)] transition-colors">
                  <feature.icon className="w-6 h-6 text-[var(--color-accent)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-[var(--color-text-secondary)]">Start free. Scale when you&apos;re ready.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockPricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className={cn(
                  "relative rounded-2xl p-6 border transition-all",
                  plan.popular
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)]/30 shadow-lg shadow-indigo-500/10"
                    : "border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-hover)]"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-xs font-semibold text-white">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold">${plan.price}</span>
                  <span className="text-[var(--color-text-muted)]">/mo</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                      <span className="text-[var(--color-text-secondary)]">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setMode("signup")}
                  className={cn(
                    "w-full py-3 rounded-xl font-medium text-sm transition-colors",
                    plan.popular
                      ? "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white"
                      : "bg-[var(--color-bg-input)] hover:bg-[var(--color-bg-card-hover)] text-[var(--color-text-primary)] border border-[var(--color-border)]"
                  )}
                >
                  {plan.price === 0 ? "Start Free" : "Get Started"}
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-[var(--color-border)] py-8 px-6 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            © 2025 SocialPulse. All rights reserved.
          </p>
        </footer>
      </div>
    );
  }

  // Auth Form (login/signup)
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">SocialPulse</span>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6">
            {mode === "login"
              ? "Sign in to access your dashboard"
              : "Start your 14-day free trial"}
          </p>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg-card-hover)] transition-colors text-sm">
              <Globe className="w-4 h-4" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg-card-hover)] transition-colors text-sm">
              <Code2 className="w-4 h-4" />
              GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[var(--color-border)]" />
            <span className="text-xs text-[var(--color-text-muted)]">or continue with email</span>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-input)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none text-sm transition-colors"
                  required
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-input)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none text-sm transition-colors"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-input)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none text-sm transition-colors pr-12"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full py-3 rounded-xl font-medium text-sm transition-all",
                isSubmitting
                  ? "bg-[var(--color-accent)]/70 cursor-not-allowed"
                  : "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]",
                "text-white"
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                  />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </span>
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          <p className="text-sm text-center text-[var(--color-text-secondary)] mt-6">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            {" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>

          <button
            onClick={() => setMode("landing")}
            className="w-full mt-4 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
          >
            ← Back to landing page
          </button>
        </div>
      </motion.div>
    </div>
  );
}
