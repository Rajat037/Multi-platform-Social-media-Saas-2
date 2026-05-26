"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { mockPlatformConnections, mockWorkspaces, mockPricingPlans } from "@/lib/mock-data";
import { Platform } from "@/lib/types";
import { cn, formatNumber, getPlatformColor, formatDate } from "@/lib/utils";
import {
  Settings, Plug, Bell, CreditCard, Users, Shield, Palette,
  Check, X, ExternalLink, Loader2, ChevronRight, Plus,
  Youtube, Instagram, Linkedin, Trash2, Crown, ArrowUpRight,
  Mail, Globe, Key, User as UserIcon,
} from "lucide-react";

const tabs = [
  { id: "platforms", label: "Platforms", icon: Plug },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "team", label: "Team", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "account", label: "Account", icon: UserIcon },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("platforms");
  const { connectedPlatforms, connectPlatform, disconnectPlatform } = useAppStore();
  const [connectingId, setConnectingId] = useState<Platform | null>(null);

  const handleConnect = async (platform: Platform) => {
    setConnectingId(platform);
    await new Promise((r) => setTimeout(r, 1500));
    connectPlatform(platform);
    setConnectingId(null);
  };

  const handleDisconnect = (platform: Platform) => {
    disconnectPlatform(platform);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Manage your account, platforms, billing, and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible p-1 lg:p-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-[var(--color-accent-muted)] text-[var(--color-accent-hover)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card-hover)]"
                )}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === "platforms" && (
              <motion.div
                key="platforms"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="glass-card p-5">
                  <h3 className="text-lg font-semibold mb-4">Platform Connections</h3>
                  <div className="space-y-3">
                    {mockPlatformConnections.map((connection) => {
                      const isConnected = connectedPlatforms.includes(connection.platform);
                      const isConnecting = connectingId === connection.platform;
                      return (
                        <div
                          key={connection.platform}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-xl border transition-all",
                            isConnected
                              ? "border-[var(--color-success)]/20 bg-[var(--color-success-muted)]/10"
                              : "border-[var(--color-border)] bg-[var(--color-bg-card)]"
                          )}
                        >
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: getPlatformColor(connection.platform) + "15" }}
                          >
                            <span className="text-lg font-bold" style={{ color: getPlatformColor(connection.platform) }}>
                              {connection.platform[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold capitalize">{connection.platform === "twitter" ? "X / Twitter" : connection.platform}</h4>
                            {isConnected && connection.accountName ? (
                              <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                {connection.accountName} • {formatNumber(connection.followers || 0)} followers
                                {connection.lastSyncAt && (
                                  <span> • Synced {formatDate(connection.lastSyncAt)}</span>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Not connected</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isConnected && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[var(--color-success-muted)] text-[var(--color-success)]">
                                Active
                              </span>
                            )}
                            <button
                              onClick={() => isConnected ? handleDisconnect(connection.platform) : handleConnect(connection.platform)}
                              disabled={isConnecting}
                              className={cn(
                                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                isConnected
                                  ? "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:border-[var(--color-error)]/30 hover:bg-[var(--color-error-muted)]"
                                  : "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]",
                                isConnecting && "opacity-70 cursor-not-allowed"
                              )}
                            >
                              {isConnecting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : isConnected ? (
                                "Disconnect"
                              ) : (
                                "Connect"
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "billing" && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {/* Current Plan */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Current Plan</h3>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
                      <Crown className="w-4 h-4 text-[var(--color-accent)]" />
                      <span className="text-sm font-semibold text-[var(--color-accent)]">Pro</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)]">Monthly Price</p>
                      <p className="text-lg font-bold">$29/mo</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)]">Platforms</p>
                      <p className="text-lg font-bold">5</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)]">Workspaces</p>
                      <p className="text-lg font-bold">3</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)]">AI Features</p>
                      <p className="text-lg font-bold">Full</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-[var(--color-text-muted)]">Next billing: Feb 15, 2025</p>
                  </div>
                </div>

                {/* Plans */}
                <div className="glass-card p-5">
                  <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockPricingPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className={cn(
                          "p-4 rounded-xl border transition-all",
                          plan.popular
                            ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)]/20"
                            : "border-[var(--color-border)] bg-[var(--color-bg-card)]"
                        )}
                      >
                        {plan.popular && (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-accent)] text-white mb-2">
                            CURRENT
                          </span>
                        )}
                        <h4 className="font-bold text-lg">{plan.name}</h4>
                        <div className="flex items-baseline gap-0.5 mt-1 mb-3">
                          <span className="text-2xl font-extrabold">${plan.price}</span>
                          <span className="text-xs text-[var(--color-text-muted)]">/mo</span>
                        </div>
                        <ul className="space-y-1.5 mb-4">
                          {plan.features.slice(0, 4).map((f) => (
                            <li key={f} className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                              <Check className="w-3 h-3 text-[var(--color-success)] flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <button className={cn(
                          "w-full py-2.5 rounded-xl text-sm font-medium transition-colors",
                          plan.popular
                            ? "bg-[var(--color-bg-input)] text-[var(--color-text-muted)] cursor-default"
                            : plan.price > 29
                            ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
                            : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card-hover)]"
                        )}>
                          {plan.popular ? "Current Plan" : plan.price > 29 ? "Upgrade" : "Downgrade"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "team" && (
              <motion.div
                key="team"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Team Members</h3>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-accent)] text-white text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors">
                      <Plus className="w-4 h-4" />
                      Invite Member
                    </button>
                  </div>
                  <div className="space-y-2">
                    {mockWorkspaces[0].members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--color-bg-card-hover)] transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                          {member.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{member.email}</p>
                        </div>
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase",
                          member.role === "owner"
                            ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400"
                            : member.role === "admin"
                            ? "bg-[var(--color-accent-muted)] text-[var(--color-accent)]"
                            : "bg-[var(--color-bg-input)] text-[var(--color-text-muted)]"
                        )}>
                          {member.role}
                        </span>
                        {member.role !== "owner" && (
                          <button className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-muted)] transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="glass-card p-5">
                  <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    {[
                      { label: "Weekly performance digest", desc: "Get a summary of your analytics every Monday", enabled: true },
                      { label: "AI recommendations", desc: "Notified when new AI insights are available", enabled: true },
                      { label: "Platform sync alerts", desc: "Get notified when sync completes or fails", enabled: true },
                      { label: "Token expiration warnings", desc: "Alert when platform connections need renewal", enabled: true },
                      { label: "Team activity", desc: "Notifications about team member actions", enabled: false },
                      { label: "Billing & subscription", desc: "Payment confirmations and plan changes", enabled: true },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-bg-card-hover)] transition-colors">
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.desc}</p>
                        </div>
                        <div className={cn(
                          "w-10 h-6 rounded-full relative cursor-pointer transition-colors",
                          item.enabled ? "bg-[var(--color-accent)]" : "bg-[var(--color-bg-input)]"
                        )}>
                          <div className={cn(
                            "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all",
                            item.enabled ? "right-0.5" : "left-0.5"
                          )} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "account" && (
              <motion.div
                key="account"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="glass-card p-5">
                  <h3 className="text-lg font-semibold mb-4">Profile</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                      A
                    </div>
                    <div>
                      <p className="font-semibold">Alex Rivera</p>
                      <p className="text-sm text-[var(--color-text-muted)]">alex@socialpulse.io</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Full Name</label>
                      <input type="text" defaultValue="Alex Rivera" className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-input)] border border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Email</label>
                      <input type="email" defaultValue="alex@socialpulse.io" className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-input)] border border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Timezone</label>
                      <select className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-input)] border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-accent)]">
                        <option>America/New_York (EST)</option>
                        <option>America/Los_Angeles (PST)</option>
                        <option>Europe/London (GMT)</option>
                      </select>
                    </div>
                    <button className="px-6 py-2.5 rounded-xl bg-[var(--color-accent)] text-white text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="glass-card p-5">
                  <h3 className="text-lg font-semibold mb-4">Security</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-bg-card-hover)] transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-[var(--color-text-muted)]" />
                        <div>
                          <p className="text-sm font-medium">Change Password</p>
                          <p className="text-xs text-[var(--color-text-muted)]">Last changed 30 days ago</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-bg-card-hover)] transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-[var(--color-text-muted)]" />
                        <div>
                          <p className="text-sm font-medium">Two-Factor Authentication</p>
                          <p className="text-xs text-[var(--color-text-muted)]">Add an extra layer of security</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-warning-muted)] text-[var(--color-warning)]">OFF</span>
                    </button>
                  </div>
                </div>

                <div className="glass-card p-5 border-[var(--color-error)]/20">
                  <h3 className="text-lg font-semibold text-[var(--color-error)] mb-2">Danger Zone</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mb-4">
                    Permanently delete your account and all associated data.
                  </p>
                  <button className="px-4 py-2 rounded-xl border border-[var(--color-error)]/30 text-[var(--color-error)] text-sm font-medium hover:bg-[var(--color-error-muted)] transition-colors">
                    Delete Account
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
