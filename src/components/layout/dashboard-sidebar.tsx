"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/(auth)/actions";
import { useState } from "react";
import { ProModal } from "@/components/pro-modal";
import { motion } from "framer-motion";

export const sidebarNavItems = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Resumes", href: "/resumes" },
  { title: "Job Match", href: "/match" },
  { title: "Self Intro", href: "/intro" },
  { title: "Applications", href: "/applications" },
  { title: "Interviews", href: "/interviews" },
  { title: "Settings", href: "/settings", isLocked: false },
  { title: "Premium Templates", href: "#premium-templates", isLocked: true },
  { title: "Career Roadmap", href: "#career-roadmap", isLocked: true },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  return (
    <nav className="hidden md:flex flex-col w-[260px] shrink-0 h-screen bg-transparent relative z-50 py-12 px-8 border-r border-slate-200/50">
      
      {/* Logo Section */}
      <div className="mb-16">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-playfair font-black tracking-tight text-slate-900">Charvia.</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="space-y-6">
          {sidebarNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.title}
                onClick={(e) => {
                  if (item.isLocked) {
                    e.preventDefault();
                    setIsProModalOpen(true);
                  } else {
                    window.location.href = item.href;
                  }
                }}
                className={cn(
                  "block w-full text-left transition-all duration-500 relative group font-inter",
                  isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <span className={cn("text-sm tracking-wide uppercase transition-all duration-300", isActive ? "font-bold" : "font-medium")}>
                  {item.title}
                </span>

                {/* Elegant Active Indicator: A very subtle left-offset dot or underline */}
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active-indicator"
                    className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-slate-900"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions Section */}
      <div className="mt-auto pt-12 space-y-8">
        {/* Pro Link */}
        <button 
          onClick={() => setIsProModalOpen(true)}
          className="block w-full text-left text-sm tracking-wide uppercase font-inter font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Upgrade to Pro →
        </button>

        {/* Logout */}
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-inter text-sm tracking-wide uppercase font-medium"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </div>

      <ProModal isOpen={isProModalOpen} onClose={() => setIsProModalOpen(false)} />
    </nav>
  );
}
