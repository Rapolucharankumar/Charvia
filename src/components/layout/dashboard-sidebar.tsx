"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logout } from "@/app/(auth)/actions";
import { useState } from "react";
import { ProModal } from "@/components/pro-modal";

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
    <nav className="hidden md:flex flex-col w-[280px] shrink-0 h-screen bg-transparent relative z-50 py-16 px-12 border-r border-stone-200/50">
      
      {/* Logo Section */}
      <div className="mb-20">
        <Link href="/" className="flex items-center">
          <span className="text-3xl font-playfair font-black tracking-tight text-stone-900">Charvia.</span>
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
                  "block w-full text-left transition-all duration-700 relative group font-inter",
                  isActive ? "text-stone-900" : "text-stone-400 hover:text-stone-700"
                )}
              >
                <span className={cn("text-sm tracking-[0.15em] uppercase transition-all duration-700", isActive ? "font-bold" : "font-light")}>
                  {item.title}
                </span>
                
                {/* Extremely delicate line indicator for active state */}
                {isActive && (
                  <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-px bg-stone-900" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions Section */}
      <div className="mt-auto pt-16 space-y-6 border-t border-stone-200/50">
        {/* Editorial Subscription Link */}
        <button 
          onClick={() => setIsProModalOpen(true)}
          className="block w-full text-left font-playfair italic text-lg text-stone-600 hover:text-stone-900 transition-colors"
        >
          Unlock Editorial access
        </button>

        {/* Logout */}
        <form action={logout}>
          <button
            type="submit"
            className="block w-full text-left text-xs tracking-[0.2em] uppercase font-inter font-light text-stone-400 hover:text-stone-900 transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>

      <ProModal isOpen={isProModalOpen} onClose={() => setIsProModalOpen(false)} />
    </nav>
  );
}
