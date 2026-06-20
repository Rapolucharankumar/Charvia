"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ApplicationStatus } from "@prisma/client";

export async function createApplication(data: { companyName: string; jobTitle: string; status: ApplicationStatus }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const app = await prisma.application.create({
    data: {
      userId: user.id,
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      status: data.status,
    },
  });

  revalidatePath("/dashboard/applications");
  return app;
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const updatedApp = await prisma.application.update({
    where: { id, userId: user.id },
    data: { status },
  });

  revalidatePath("/dashboard/applications");
  return updatedApp;
}

export async function deleteApplication(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  await prisma.application.delete({
    where: { id, userId: user.id },
  });

  revalidatePath("/dashboard/applications");
}
