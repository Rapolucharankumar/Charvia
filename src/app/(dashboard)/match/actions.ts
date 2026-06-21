"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calculateJobMatch, autoOptimizeResume } from "@/lib/ai/gemini";
import { checkJobMatchLimit, incrementJobMatchUsage } from "@/lib/subscription";


export async function generateMatchScore(
  resumeId: string, 
  companyName: string, 
  jobTitle: string, 
  jobDescriptionText: string
) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const withinLimit = await checkJobMatchLimit(user.id);
  if (!withinLimit) {
    throw new Error("FREE_LIMIT_EXCEEDED");
  }

  // 1. Fetch Resume to ensure ownership and get fileUrl
  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
  });

  if (!resume || resume.userId !== user.id) {
    throw new Error("Resume not found or unauthorized");
  }

  if (!resume.fileUrl) {
    throw new Error("No file associated with this resume");
  }

  try {
    // 2. Fetch the PDF file and parse it
    const response = await fetch(resume.fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use unpdf — compatible with Next.js App Router/Turbopack
    const { extractText } = await import("unpdf");
    const result = await extractText(new Uint8Array(buffer));
    const rawText = result.text;
    const resumeText = Array.isArray(rawText) ? rawText.join("\n") : rawText;

    if (!resumeText || resumeText.trim() === "") {
      throw new Error("Could not extract text from the PDF.");
    }

    // 3. Create or save Job Description
    const jobDescription = await prisma.jobDescription.create({
      data: {
        userId: user.id,
        companyName,
        jobTitle,
        content: jobDescriptionText,
      },
    });

    // 4. Call Gemini AI to calculate job match and optimize
    const [matchResult, optimizationResult] = await Promise.all([
      calculateJobMatch(resumeText, jobDescriptionText),
      autoOptimizeResume(resumeText, jobDescriptionText)
    ]);

    // 5. Save MatchScore to DB
    const newMatchScore = await prisma.matchScore.create({
      data: {
        resumeId: resume.id,
        jobDescriptionId: jobDescription.id,
        score: matchResult.matchScore,
        details: {
          ...matchResult,
          potentialMatchScore: optimizationResult.newScore,
          resumeChangesApplied: optimizationResult.changeSummary,
          optimizedResume: optimizationResult,
          originalFileUrl: resume.fileUrl
        },
      },
    });

    await incrementJobMatchUsage(user.id);

    revalidatePath("/match");
    return newMatchScore;
  } catch (error: any) {
    console.error("Error generating match score:", error);
    throw new Error(error.message || "An error occurred during analysis.");
  }
}
