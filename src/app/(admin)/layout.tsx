import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { LayoutDashboard, Users, ShieldAlert, Settings } from "lucide-react";
import Image from "next/image";
import { MobileNav } from "@/components/layout/mobile-nav";

const adminNavItems = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Exit to App", href: "/dashboard", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { isAdmin: true },
  });

  if (!dbUser?.isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <nav className="w-64 border-r bg-muted/40 shrink-0 hidden md:block">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-destructive">
            <ShieldAlert className="h-6 w-6" />
            <span className="text-lg">Admin Portal</span>
          </Link>
        </div>
        <div className="flex-1 py-4">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
            {adminNavItems.map((item) => (
              <Link key={item.title} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary transition-all">
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </nav>
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <MobileNav items={adminNavItems} title="Admin Menu" />
        </header>
        {children}
      </main>
    </div>
  );
}
