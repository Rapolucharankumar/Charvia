"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { PlanType } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function checkIsAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { isAdmin: true },
  });

  if (!dbUser?.isAdmin) {
    throw new Error("Forbidden: Admins only");
  }

  return user;
}

export async function getAdminOverview() {
  await checkIsAdmin();

  const totalUsers = await prisma.user.count();
  
  const proUsers = await prisma.user.count({
    where: { plan: "PRO" },
  });

  const totalAnalyses = await prisma.resumeAnalysis.count();
  
  const totalInterviews = await prisma.interviewSession.count();

  // Simple MRR estimation: PRO users * 499 (assuming 499 INR/month)
  const mrr = proUsers * 499;

  return {
    totalUsers,
    proUsers,
    totalAnalyses,
    totalInterviews,
    mrr,
  };
}

export async function getUsersList() {
  await checkIsAdmin();

  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      plan: true,
      createdAt: true,
      isAdmin: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserPlan(userId: string, newPlan: PlanType) {
  await checkIsAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: { plan: newPlan },
  });

  revalidatePath("/admin/users");
}
