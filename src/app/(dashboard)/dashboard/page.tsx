import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { DashboardClient } from "./dashboard-client";
import { getUserUsageStats } from "@/lib/subscription";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch real data
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      applications: true,
      resumes: {
        include: { analyses: true }
      },
      interviewSessions: true,
    }
  });

  const firstName = dbUser?.firstName || user.email?.split('@')[0] || "User";
  const applicationsCount = dbUser?.applications.length || 0;
  const resumesCount = dbUser?.resumes.length || 0;
  const interviewsCount = dbUser?.interviewSessions.length || 0;

  // Calculate Average ATS Score
  let totalScore = 0;
  let scoreCount = 0;
  dbUser?.resumes.forEach(resume => {
    resume.analyses.forEach(analysis => {
      if (analysis.overallScore) {
        totalScore += analysis.overallScore;
        scoreCount++;
      }
    });
  });
  const avgAtsScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
  
  // Calculate a "Readiness Score" based on activity
  const readinessScore = Math.min(100, Math.round((avgAtsScore * 0.5) + (applicationsCount * 5) + (interviewsCount * 10)) || 25);

  const stats = {
    applications: applicationsCount,
    interviews: interviewsCount,
    resumes: resumesCount,
    readiness: readinessScore,
    atsAvg: avgAtsScore,
  };

  const usageStats = await getUserUsageStats(user.id);

  return (
    <div className="flex-1 p-6 md:p-12 w-full">
      <DashboardClient firstName={firstName} stats={stats} usageStats={usageStats} />
    </div>
  );
}
