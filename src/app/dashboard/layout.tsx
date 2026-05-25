"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useAppStore } from "@/lib/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useAppStore();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Sidebar />
      <motion.div
        initial={false}
        animate={{ marginLeft: isDesktop ? (sidebarOpen ? 260 : 72) : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="min-h-screen layout-transition"
      >
        <Header />
        <main className="p-4 lg:p-6 max-w-[1600px] mx-auto" role="main">
          {children}
        </main>
      </motion.div>
    </div>
  );
}
