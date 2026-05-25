import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toLocaleString();
}

export function formatPercent(num: number): string {
  return num.toFixed(2) + "%";
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    youtube: "#FF0000",
    instagram: "#E4405F",
    tiktok: "#00F2EA",
    linkedin: "#0A66C2",
    twitter: "#1DA1F2",
  };
  return colors[platform.toLowerCase()] || "#6366F1";
}

export function getPlatformGradient(platform: string): string {
  const gradients: Record<string, string> = {
    youtube: "from-red-500 to-red-700",
    instagram: "from-pink-500 via-purple-500 to-orange-400",
    tiktok: "from-cyan-400 to-pink-500",
    linkedin: "from-blue-600 to-blue-800",
    twitter: "from-sky-400 to-blue-500",
  };
  return gradients[platform.toLowerCase()] || "from-indigo-500 to-purple-600";
}
