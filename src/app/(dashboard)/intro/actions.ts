"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateSelfIntroduction, IntroInputs } from "@/lib/ai/gemini";

export async function createSelfIntroduction(inputs: IntroInputs) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  try {
    // 1. Generate versions
    const generatedVersions = await generateSelfIntroduction(inputs);

    // 2. Save to db
    const intro = await prisma.selfIntroduction.create({
      data: {
        userId: user.id,
        inputs: inputs as any,
        generated: generatedVersions as any,
      },
    });

    revalidatePath("/intro");
    return intro;
  } catch (error: any) {
    console.error("Error generating self intro:", error);
    throw new Error(error.message || "Failed to generate introduction");
  }
}
