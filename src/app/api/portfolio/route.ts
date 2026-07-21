import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

// GET all portfolios for the current user
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const portfolios = await prisma.portfolio.findMany({
      where: { userId: user.id },
      include: {
        sections: {
          orderBy: { order: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(portfolios);
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST create a new portfolio
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { username, theme, resumeId, colorHex, fontFamily, sectionsData } = body;

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Check if username is taken
    const existing = await prisma.portfolio.findUnique({
      where: { username }
    });

    if (existing) {
      return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        userId: user.id,
        username,
        theme: theme || "minimal",
        colorHex: colorHex || "#000000",
        fontFamily: fontFamily || "inter",
        resumeId,
        sections: {
          create: sectionsData ? [
            { type: "hero", order: 0, content: sectionsData.hero || { title: "Hello", subtitle: "" } },
            { type: "about", order: 1, content: sectionsData.about || { text: "" } },
            { type: "skills", order: 2, content: { skills: sectionsData.skills || [] } },
            { type: "experience", order: 3, content: { jobs: sectionsData.experience || [] } },
            { type: "projects", order: 4, content: { projects: sectionsData.projects || [] } },
          ] : [
            { type: "hero", order: 0, content: { title: "Hello, I am a Professional" } },
            { type: "about", order: 1, content: { text: "I build great things." } },
            { type: "skills", order: 2, content: { skills: [] } },
            { type: "experience", order: 3, content: { jobs: [] } },
            { type: "projects", order: 4, content: { projects: [] } },
          ]
        }
      },
      include: {
        sections: true
      }
    });

    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
