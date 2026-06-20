"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { analyzeResume } from "@/lib/ai/gemini";
import * as pdfParseModule from "pdf-parse";
import { checkAtsLimit } from "@/lib/subscription";

const pdfParse = (pdfParseModule as any).default || pdfParseModule;

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

    // 3. Extract text
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

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

    revalidatePath(`/dashboard/resumes/${resumeId}`);
    return newAnalysis;
  } catch (error: any) {
    console.error("Error generating analysis:", error);
    throw new Error(error.message || "An error occurred during analysis.");
  }
}
