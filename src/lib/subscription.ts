import prisma from "./prisma";

export const FREE_ATS_LIMIT = 3;

export async function getUserSubscriptionPlan(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      subscriptionStatus: true,
      currentPeriodEnd: true,
      razorpayCustomerId: true,
      razorpaySubscriptionId: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if subscription is active
  const isPro =
    user.plan === "PRO" &&
    user.subscriptionStatus === "active" &&
    user.currentPeriodEnd &&
    user.currentPeriodEnd.getTime() > Date.now();

  return {
    ...user,
    isPro: !!isPro,
  };
}

export async function checkAtsLimit(userId: string) {
  const userPlan = await getUserSubscriptionPlan(userId);

  if (userPlan.isPro) {
    return true; // Pro users have unlimited access
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const usageCount = await prisma.resumeAnalysis.count({
    where: {
      resume: {
        userId: userId,
      },
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  return usageCount < FREE_ATS_LIMIT;
}

export async function checkProAccess(userId: string) {
  const userPlan = await getUserSubscriptionPlan(userId);
  return userPlan.isPro;
}
