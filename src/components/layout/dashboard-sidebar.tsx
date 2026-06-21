"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logout } from "@/app/(auth)/actions";
import { useState } from "react";
import { ProModal } from "@/components/pro-modal";
import { LayoutDashboard, FileText, Target, UserCircle, Briefcase, Calendar, Settings, Crown, Map } from "lucide-react";

export const sidebarNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Resumes", href: "/resumes", icon: FileText },
  { title: "Job Match", href: "/match", icon: Target },
  { title: "Self Intro", href: "/intro", icon: UserCircle },
  { title: "Applications", href: "/applications", icon: Briefcase },
  { title: "Interviews", href: "/interviews", icon: Calendar },
  { title: "Settings", href: "/settings", icon: Settings, isLocked: false },
  { title: "Premium Templates", href: "#premium-templates", icon: Crown, isLocked: true },
  { title: "Career Roadmap", href: "#career-roadmap", icon: Map, isLocked: true },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  return (
    <nav className="hidden md:flex flex-col w-[280px] shrink-0 h-screen sticky top-0 bg-[#111827] z-50 py-10 px-6 border-r border-[#1f2937]">
      
      {/* Logo Section */}
      <div className="mb-12 px-4">
        <Link href="/" className="flex items-center">
          <span className="text-3xl font-sora font-black tracking-tight text-white">Charvia<span className="text-primary">.</span></span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="space-y-2">
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
                  "flex items-center gap-4 w-full text-left transition-all duration-300 relative group font-inter px-4 py-3 rounded-xl",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-400")} />
                <span className={cn("text-sm tracking-wide font-medium", isActive ? "text-white" : "text-gray-300 group-hover:text-white")}>
                  {item.title}
                </span>
                
                {/* Active Indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions Section */}
      <div className="mt-auto pt-8 space-y-4 border-t border-[#1f2937] px-4">
        {/* Pro CTA */}
        <button 
          onClick={() => setIsProModalOpen(true)}
          className="flex items-center gap-3 w-full text-left p-4 rounded-xl bg-gradient-to-tr from-primary/20 to-transparent border border-primary/20 hover:border-primary/40 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-sm font-semibold text-white">Upgrade to Pro</span>
            <span className="block text-xs text-gray-400">Unlock premium features</span>
          </div>
        </button>

        {/* Logout */}
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-4 w-full text-left text-sm tracking-wide font-inter font-medium text-gray-400 hover:text-white transition-colors px-4 py-3 rounded-xl hover:bg-white/5"
          >
            Sign Out
          </button>
        </form>
      </div>

      <ProModal isOpen={isProModalOpen} onClose={() => setIsProModalOpen(false)} />
    </nav>
  );
}
