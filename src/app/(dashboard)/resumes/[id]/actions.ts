"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { analyzeResume, autoOptimizeResume } from "@/lib/ai/gemini";
import { checkAtsLimit } from "@/lib/subscription";

export async function generateAnalysis(resumeId: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const withinLimit = await checkAtsLimit(user.id);
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
    // 2. Fetch the PDF file
    const response = await fetch(resume.fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Extract text using unpdf (Next.js App Router compatible)
    const { extractText } = await import("unpdf");
    const result = await extractText(new Uint8Array(buffer));
    const rawText = result.text;
    const text = Array.isArray(rawText) ? rawText.join("\n") : rawText;

    if (!text || text.trim() === "") {
      throw new Error("Could not extract text from the PDF.");
    }

    // 4. Call Gemini AI
    const analysisResult = await analyzeResume(text);

    // 5. Save Analysis to DB
    const newAnalysis = await prisma.resumeAnalysis.create({
      data: {
        resumeId: resume.id,
        overallScore: analysisResult.atsScore,
        feedback: analysisResult,
      },
    });

    revalidatePath(`/resumes/${resumeId}`);
    return newAnalysis;
  } catch (error: any) {
    console.error("Error generating analysis:", error);
    throw new Error(error.message || "An error occurred during analysis.");
  }
}

export async function generateOptimization(resumeId: string, jobDescriptionId?: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    include: {
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
      }
    }
  });

  if (!resume || resume.userId !== user.id) {
    throw new Error("Resume not found or unauthorized");
  }

  if (!resume.fileUrl) {
    throw new Error("No file associated with this resume");
  }

  // Get job description if provided
  let jobDescriptionText = undefined;
  if (jobDescriptionId) {
    const jd = await prisma.jobDescription.findUnique({
      where: { id: jobDescriptionId }
    });
    if (jd && jd.userId === user.id) {
      jobDescriptionText = jd.content;
    }
  }

  try {
    // Fetch PDF
    const response = await fetch(resume.fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text
    const { extractText } = await import("unpdf");
    const result = await extractText(new Uint8Array(buffer));
    const rawText = result.text;
    const text = Array.isArray(rawText) ? rawText.join("\n") : rawText;

    if (!text || text.trim() === "") {
      throw new Error("Could not extract text from the PDF.");
    }

    // Call Gemini to Auto-Optimize
    const optimizationResult = await autoOptimizeResume(text, jobDescriptionText);

    // Get original score (default to 50 if no prior analysis)
    const originalScore = resume.analyses.length > 0 && resume.analyses[0].overallScore 
      ? resume.analyses[0].overallScore 
      : 50;

    // Save Optimization to DB
    const newOptimization = await prisma.resumeOptimization.create({
      data: {
        resumeId: resume.id,
        jobDescriptionId: jobDescriptionId || null,
        originalScore: originalScore,
        newScore: optimizationResult.newScore,
        changeSummary: optimizationResult.changeSummary,
        optimizedContent: optimizationResult,
      },
    });

    revalidatePath(`/resumes/${resumeId}`);
    return newOptimization;
  } catch (error: any) {
    console.error("Error generating optimization:", error);
    throw new Error(error.message || "An error occurred during optimization.");
  }
}

