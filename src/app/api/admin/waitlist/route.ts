import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const waitlist = await prisma.earlyAccessWaitlist.findMany({
      orderBy: { createdAt: "desc" },
    });

    const totalUsers = await prisma.user.count();
    const waitlistCount = waitlist.length;
    
    // Calculate conversion percentage (Waitlist Users / Total Base Users)
    const conversionRate = totalUsers > 0 ? ((waitlistCount / totalUsers) * 100).toFixed(1) : 0;

    return NextResponse.json({ 
      waitlist, 
      analytics: {
        totalUsers,
        waitlistCount,
        conversionRate
      }
    });
  } catch (error) {
    console.error("Admin Waitlist Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
