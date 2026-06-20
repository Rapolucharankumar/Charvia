"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateInterviewPrep } from "@/lib/ai/gemini";
import { InterviewType, InterviewStatus } from "@prisma/client";
import { checkProAccess } from "@/lib/subscription";

export async function createInterviewPrep(company: string, role: string, experience: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const hasAccess = await checkProAccess(user.id);
  if (!hasAccess) {
    throw new Error("PRO_PLAN_REQUIRED");
  }

  try {
    // 1. Call Gemini AI to generate the prep guide
    const prepGuide = await generateInterviewPrep(company, role, experience);

    // 2. Save the session to the database
    // We store the metadata (company, role, experience) alongside the generated questions inside the JSON feedback column
    const sessionData = {
      metadata: { company, role, experience },
      prepGuide
    };

    const newSession = await prisma.interviewSession.create({
      data: {
        userId: user.id,
        type: InterviewType.MOCK,
        status: InterviewStatus.COMPLETED,
        scheduledAt: new Date(),
        feedback: sessionData,
      },
    });

    revalidatePath("/dashboard/interviews");
    return newSession;
  } catch (error: any) {
    console.error("Error creating interview prep:", error);
    throw new Error(error.message || "An error occurred during interview generation.");
  }
}
