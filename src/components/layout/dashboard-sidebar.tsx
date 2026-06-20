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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/(auth)/actions";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Resumes",
    href: "/dashboard/resumes",
    icon: FileText,
  },
  {
    title: "Job Match",
    href: "/dashboard/match",
    icon: CheckSquare,
  },
  {
    title: "Self Intro",
    href: "/dashboard/intro",
    icon: Briefcase,
  },
  {
    title: "Applications",
    href: "/dashboard/applications",
    icon: LayoutDashboard,
  },
  {
    title: "Interviews",
    href: "/dashboard/interviews",
    icon: Briefcase,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <nav className="hidden border-r bg-muted/40 md:block w-64 min-h-screen shrink-0">
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
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive ? "bg-muted text-primary" : ""
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
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
    </nav>
  );
}
