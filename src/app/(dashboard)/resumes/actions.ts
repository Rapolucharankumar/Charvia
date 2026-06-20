"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveResumeMetadata(title: string, fileUrl: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const newResume = await prisma.resume.create({
    data: {
      title,
      fileUrl,
      userId: user.id,
      content: {}, // Default empty JSON
    },
  });

  revalidatePath("/dashboard/resumes");
  return newResume;
}

export async function deleteResume(id: string, fileUrl: string | null) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const resume = await prisma.resume.findUnique({
    where: { id },
  });

  if (!resume || resume.userId !== user.id) {
    throw new Error("Resume not found or unauthorized");
  }

  // Attempt to delete from Supabase Storage if fileUrl exists
  if (fileUrl) {
    try {
      // Extract path after /resumes/
      const urlParts = fileUrl.split("/resumes/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        const { error: storageError } = await supabase.storage.from("resumes").remove([filePath]);
        if (storageError) {
          console.error("Supabase Storage deletion error:", storageError);
        }
      }
    } catch (e) {
      console.error("Error parsing or deleting file:", e);
    }
  }

  // Delete from Prisma
  await prisma.resume.delete({
    where: { id },
  });

  revalidatePath("/dashboard/resumes");
}
