import prisma from "./prisma";

export const FREE_ATS_LIMIT = 3;
export const FREE_JOB_MATCH_LIMIT = 5;
export const FREE_INTERVIEW_LIMIT = 10;

export async function getUserSubscriptionPlan(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      subscriptionStatus: true,
      currentPeriodEnd: true,
      resumeAnalysisUsed: true,
      jobMatchesUsed: true,
      interviewQuestionsUsed: true,
      lastResetDate: true,
    },
  });

  if (!user) {
    return {
      plan: "FREE",
      subscriptionStatus: null,
      currentPeriodEnd: null,
      resumeAnalysisUsed: 0,
      jobMatchesUsed: 0,
      interviewQuestionsUsed: 0,
      lastResetDate: new Date(),
      isPro: false,
    };
  }

  // Check if subscription is active
  const isPro = user.plan === "PRO";

  return {
    ...user,
    isPro: !!isPro,
  };
}

export async function syncUserUsage(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const now = new Date();
  const lastReset = user.lastResetDate;
  
  let needsUpdate = false;
  let updateData: any = {};

  // Check Monthly Reset (for ATS and Job Matches)
  if (
    lastReset.getMonth() !== now.getMonth() || 
    lastReset.getFullYear() !== now.getFullYear()
  ) {
    needsUpdate = true;
    updateData.resumeAnalysisUsed = 0;
    updateData.jobMatchesUsed = 0;
  }

  // Check Daily Reset (for Interview Questions)
  if (
    lastReset.getDate() !== now.getDate() ||
    lastReset.getMonth() !== now.getMonth() ||
    lastReset.getFullYear() !== now.getFullYear()
  ) {
    needsUpdate = true;
    updateData.interviewQuestionsUsed = 0;
  }

  if (needsUpdate) {
    updateData.lastResetDate = now;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });
    return updatedUser;
  }

  return user;
}

export async function checkAtsLimit(userId: string) {
  const userPlan = await getUserSubscriptionPlan(userId);
  if (userPlan.isPro) return true;

  const user = await syncUserUsage(userId);
  if (!user) return false;

  return user.resumeAnalysisUsed < FREE_ATS_LIMIT;
}

export async function checkJobMatchLimit(userId: string) {
  const userPlan = await getUserSubscriptionPlan(userId);
  if (userPlan.isPro) return true;

  const user = await syncUserUsage(userId);
  if (!user) return false;

  return user.jobMatchesUsed < FREE_JOB_MATCH_LIMIT;
}

export async function checkInterviewLimit(userId: string) {
  const userPlan = await getUserSubscriptionPlan(userId);
  if (userPlan.isPro) return true;

  const user = await syncUserUsage(userId);
  if (!user) return false;

  return user.interviewQuestionsUsed < FREE_INTERVIEW_LIMIT;
}

export async function incrementAtsUsage(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { resumeAnalysisUsed: { increment: 1 } }
  });
}

export async function incrementJobMatchUsage(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { jobMatchesUsed: { increment: 1 } }
  });
}

export async function incrementInterviewUsage(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { interviewQuestionsUsed: { increment: 1 } }
  });
}

export async function checkProAccess(userId: string) {
  const userPlan = await getUserSubscriptionPlan(userId);
  return userPlan.isPro;
}

export async function getUserUsageStats(userId: string) {
  const userPlan = await getUserSubscriptionPlan(userId);
  const user = await syncUserUsage(userId);
  
  if (!user) {
    return {
      isPro: false,
      resumeAnalysis: { used: 0, limit: FREE_ATS_LIMIT },
      jobMatches: { used: 0, limit: FREE_JOB_MATCH_LIMIT },
      interviewQuestions: { used: 0, limit: FREE_INTERVIEW_LIMIT }
    };
  }

  return {
    isPro: userPlan.isPro,
    resumeAnalysis: {
      used: user.resumeAnalysisUsed,
      limit: FREE_ATS_LIMIT
    },
    jobMatches: {
      used: user.jobMatchesUsed,
      limit: FREE_JOB_MATCH_LIMIT
    },
    interviewQuestions: {
      used: user.interviewQuestionsUsed,
      limit: FREE_INTERVIEW_LIMIT
    }
  };
}
