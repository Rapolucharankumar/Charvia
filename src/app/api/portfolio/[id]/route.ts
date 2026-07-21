import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { theme, colorHex, fontFamily, seoTitle, seoDescription, isPublished, sections } = body;

    const portfolioId = (await params).id;
    // First update the main portfolio record
    const portfolio = await prisma.portfolio.update({
      where: { id: portfolioId, userId: user.id },
      data: {
        theme,
        colorHex,
        fontFamily,
        seoTitle,
        seoDescription,
        isPublished
      }
    });

    // Then update all the sections
    // In a real app, you might want to use a transaction
    if (sections && Array.isArray(sections)) {
      for (const section of sections) {
        await prisma.portfolioSection.update({
          where: { id: section.id },
          data: {
            order: section.order,
            isHidden: section.isHidden,
            content: section.content
          }
        });
      }
    }

    return NextResponse.json({ success: true, portfolio });

  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
