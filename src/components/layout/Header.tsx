"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { mockWorkspaces } from "@/lib/mock-data";
import { cn, getRelativeTime } from "@/lib/utils";
import {
  Bell, ChevronDown, LogOut, User, Settings, Moon, Sun,
  Check, ChevronsUpDown, Plus,
} from "lucide-react";

export default function Header() {
  const {
    notifications, markNotificationRead, markAllRead,
    activeWorkspaceId, setActiveWorkspaceId, theme, toggleTheme,
    setAuthenticated,
  } = useAppStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWorkspaceSwitcher, setShowWorkspaceSwitcher] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeWorkspace = mockWorkspaces.find((w) => w.id === activeWorkspaceId);

  const notificationTypeStyles: Record<string, string> = {
    success: "bg-[var(--color-success)] text-white",
    info: "bg-[var(--color-accent)] text-white",
    warning: "bg-[var(--color-warning)] text-white",
    error: "bg-[var(--color-error)] text-white",
  };

  return (
    <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80 backdrop-blur-xl sticky top-0 z-20">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: Workspace Switcher */}
        <div className="relative ml-12 lg:ml-0">
          <button
            onClick={() => setShowWorkspaceSwitcher(!showWorkspaceSwitcher)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[var(--color-bg-card-hover)] transition-colors"
            aria-label="Switch workspace"
            aria-expanded={showWorkspaceSwitcher}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
              {activeWorkspace?.name?.[0] || "W"}
            </div>
            <span className="hidden sm:inline text-sm font-medium">{activeWorkspace?.name}</span>
            <ChevronsUpDown className="w-4 h-4 text-[var(--color-text-muted)]" />
          </button>

          <AnimatePresence>
            {showWorkspaceSwitcher && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowWorkspaceSwitcher(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-64 glass-card p-2 z-20"
                >
                  <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Workspaces
                  </p>
                  {mockWorkspaces.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        setActiveWorkspaceId(ws.id);
                        setShowWorkspaceSwitcher(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                        ws.id === activeWorkspaceId
                          ? "bg-[var(--color-accent-muted)] text-[var(--color-accent-hover)]"
                          : "hover:bg-[var(--color-bg-card-hover)] text-[var(--color-text-secondary)]"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {ws.name[0]}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{ws.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{ws.members.length} members</p>
                      </div>
                      {ws.id === activeWorkspaceId && <Check className="w-4 h-4 text-[var(--color-accent)]" />}
                    </button>
                  ))}
                  <div className="border-t border-[var(--color-border)] mt-2 pt-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card-hover)] transition-colors">
                      <Plus className="w-4 h-4" />
                      Create Workspace
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-[var(--color-bg-card-hover)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Moon className="w-5 h-5 text-[var(--color-text-secondary)]" /> : <Sun className="w-5 h-5 text-[var(--color-text-secondary)]" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-[var(--color-bg-card-hover)] transition-colors"
              aria-label={`Notifications - ${unreadCount} unread`}
              aria-expanded={showNotifications}
            >
              <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[var(--color-error)] text-white text-[10px] font-bold flex items-center justify-center"
                >
                  {unreadCount}
                </motion.span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 glass-card overflow-hidden z-20"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
                      <h3 className="text-sm font-semibold">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={cn(
                            "w-full flex gap-3 px-4 py-3 hover:bg-[var(--color-bg-card-hover)] transition-colors text-left",
                            !n.read && "bg-[var(--color-accent-muted)]/30"
                          )}
                        >
                          <div className={cn("w-2 h-2 rounded-full mt-2 flex-shrink-0", notificationTypeStyles[n.type])} />
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-sm", !n.read ? "font-medium" : "text-[var(--color-text-secondary)]")}>{n.title}</p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">{n.message}</p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-1">{getRelativeTime(n.createdAt)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-[var(--color-bg-card-hover)] transition-colors"
              aria-label="User menu"
              aria-expanded={showUserMenu}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                A
              </div>
              <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)] hidden sm:block" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 glass-card p-2 z-20"
                  >
                    <div className="px-3 py-2 mb-1">
                      <p className="text-sm font-medium">Alex Rivera</p>
                      <p className="text-xs text-[var(--color-text-muted)]">alex@socialpulse.io</p>
                    </div>
                    <div className="border-t border-[var(--color-border)] my-1" />
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card-hover)] transition-colors">
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card-hover)] transition-colors">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <div className="border-t border-[var(--color-border)] my-1" />
                    <button
                      onClick={() => setAuthenticated(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-error)] hover:bg-[var(--color-error-muted)] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
