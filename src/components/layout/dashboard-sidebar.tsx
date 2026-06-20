"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  CheckSquare,
  Settings,
  LogOut,
  Map,
  Lock,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/(auth)/actions";
import { useState } from "react";
import { ProModal } from "@/components/pro-modal";
import { Button } from "@/components/ui/button";

export const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Resumes",
    href: "/resumes",
    icon: FileText,
  },
  {
    title: "Job Match",
    href: "/match",
    icon: CheckSquare,
  },
  {
    title: "Self Intro",
    href: "/intro",
    icon: Briefcase,
  },
  {
    title: "Applications",
    href: "/applications",
    icon: LayoutDashboard,
  },
  {
    title: "Interviews",
    href: "/interviews",
    icon: Briefcase,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    isLocked: false,
  },
  {
    title: "Premium Templates",
    href: "#premium-templates",
    icon: FileText,
    isLocked: true,
  },
  {
    title: "Career Roadmap",
    href: "#career-roadmap",
    icon: Map,
    isLocked: true,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  return (
    <nav className="hidden border-r bg-muted/40 md:block w-64 min-h-screen shrink-0 relative">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/logo.svg" alt="Charvia Logo" width={24} height={24} className="rounded-sm" />
          <span className="text-lg">Charvia</span>
        </Link>
      </div>
      <div className="flex-1 py-4">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
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
                  "flex items-center justify-between rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive ? "bg-muted text-primary" : ""
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </div>
                {item.isLocked && <Lock className="h-3 w-3 text-yellow-500" />}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t space-y-4">
        <div 
          onClick={() => setIsProModalOpen(true)}
          className="w-full relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 p-4 cursor-pointer hover:border-primary/40 transition-colors group"
        >
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Upgrade to Pro</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Unlock unlimited AI tools and premium templates.</p>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </form>
      </div>
      <ProModal isOpen={isProModalOpen} onClose={() => setIsProModalOpen(false)} />
    </nav>
  );
}
