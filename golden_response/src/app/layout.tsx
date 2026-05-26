import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SocialPulse — Multi-Platform Social Media Analytics Dashboard",
  description:
    "Unify YouTube, Instagram, TikTok, LinkedIn, and X analytics into one intelligent dashboard. AI-powered insights, growth forecasting, and team workspaces.",
  keywords: [
    "social media analytics",
    "dashboard",
    "youtube analytics",
    "instagram analytics",
    "tiktok analytics",
    "AI insights",
    "content performance",
  ],
  openGraph: {
    title: "SocialPulse — Social Media Analytics That Actually Work",
    description:
      "Stop switching between five dashboards. Get AI-powered insights across all your social platforms.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
