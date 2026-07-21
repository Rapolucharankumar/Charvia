import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { enhanceResumeForPortfolio } from "@/lib/ai/portfolio";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId } = await req.json();

    if (!resumeId) {
      return NextResponse.json({ error: "resumeId is required" }, { status: 400 });
    }

    // Fetch the resume
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId, userId: user.id }
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Enhance the resume using Gemini
    const enhancedData = await enhanceResumeForPortfolio({
      title: resume.title,
      content: resume.content
    });

    return NextResponse.json({ success: true, data: enhancedData });

  } catch (error: any) {
    console.error("Error enhancing resume:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
