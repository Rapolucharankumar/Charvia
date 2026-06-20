import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { ResumeUploadZone } from "@/components/resumes/resume-upload-zone";
import { ResumeCard } from "@/components/resumes/resume-card";

export default async function ResumesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Resumes</h2>
          <p className="text-muted-foreground">
            Upload and manage your resumes for targeted job applications.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-3">
          <ResumeUploadZone />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold tracking-tight">Your Uploaded Resumes</h3>
        
        {resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 rounded-xl border border-dashed bg-muted/20 text-muted-foreground">
            <p>No resumes uploaded yet.</p>
            <p className="text-sm mt-1">Upload a PDF above to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {resumes.map((resume) => (
              <ResumeCard 
                key={resume.id}
                id={resume.id}
                title={resume.title}
                createdAt={resume.createdAt}
                fileUrl={resume.fileUrl}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
