import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { LayoutDashboard, Users, ShieldAlert, Settings } from "lucide-react";
import Image from "next/image";

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
            <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary transition-all">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary transition-all">
              <Users className="h-4 w-4" />
              Users
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary transition-all mt-8">
              <Settings className="h-4 w-4" />
              Exit to App
            </Link>
          </nav>
        </div>
      </nav>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
