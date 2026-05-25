"use client";

import { create } from "zustand";
import { Platform, Notification, DateRange } from "./types";
import { mockNotifications, mockPlatformConnections } from "./mock-data";

interface AppState {
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Auth
  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;

  // Onboarding
  onboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;

  // Active workspace
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;

  // Platform filters
  activePlatforms: Platform[];
  togglePlatform: (platform: Platform) => void;
  setActivePlatforms: (platforms: Platform[]) => void;

  // Date range
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;

  // Platform connections
  connectedPlatforms: Platform[];
  connectPlatform: (platform: Platform) => void;
  disconnectPlatform: (platform: Platform) => void;

  // Theme
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  isAuthenticated: false,
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),

  onboardingComplete: false,
  setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),

  activeWorkspaceId: "ws_1",
  setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),

  activePlatforms: ["youtube", "instagram", "tiktok", "linkedin", "twitter"],
  togglePlatform: (platform) =>
    set((state) => ({
      activePlatforms: state.activePlatforms.includes(platform)
        ? state.activePlatforms.filter((p) => p !== platform)
        : [...state.activePlatforms, platform],
    })),
  setActivePlatforms: (platforms) => set({ activePlatforms: platforms }),

  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
    label: "Last 30 days",
  },
  setDateRange: (range) => set({ dateRange: range }),

  notifications: mockNotifications,
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  connectedPlatforms: mockPlatformConnections
    .filter((p) => p.connected)
    .map((p) => p.platform),
  connectPlatform: (platform) =>
    set((state) => ({
      connectedPlatforms: [...state.connectedPlatforms, platform],
    })),
  disconnectPlatform: (platform) =>
    set((state) => ({
      connectedPlatforms: state.connectedPlatforms.filter((p) => p !== platform),
    })),

  theme: "dark",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
}));
