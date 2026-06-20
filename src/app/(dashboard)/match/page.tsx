import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { MatchClient } from "./match-client";

export default async function MatchPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Job Match</h2>
          <p className="text-muted-foreground">
            Compare your resume against a specific job description to get a targeted match score.
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <MatchClient resumes={resumes} />
      </div>
    </div>
  );
}
