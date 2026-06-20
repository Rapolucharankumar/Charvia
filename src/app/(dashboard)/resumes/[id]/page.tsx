import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { AnalysisReport } from "@/components/analyzer/analysis-report";
import { AnalyzeButton } from "./analyze-button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export default async function ResumeDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const resume = await prisma.resume.findUnique({
    where: { id },
    include: {
      analyses: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!resume || resume.userId !== user.id) {
    notFound();
  }

  const latestAnalysis = resume.analyses[0];

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/resumes">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight truncate" title={resume.title}>
            {resume.title}
          </h2>
          <p className="text-muted-foreground text-sm">
            Uploaded {formatDistanceToNow(new Date(resume.createdAt), { addSuffix: true })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {resume.fileUrl && (
            <a 
              href={resume.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={buttonVariants({ variant: "outline" })}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View PDF
            </a>
          )}
          <AnalyzeButton resumeId={resume.id} isAnalyzingDisabled={false} />
        </div>
      </div>

      <div>
        {latestAnalysis ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Latest Analysis Report</h3>
              <p className="text-sm text-muted-foreground">
                Generated {formatDistanceToNow(new Date(latestAnalysis.createdAt), { addSuffix: true })}
              </p>
            </div>
            <AnalysisReport analysis={latestAnalysis as any} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl bg-muted/20">
            <div className="text-center max-w-sm space-y-4">
              <h3 className="text-lg font-semibold">No Analysis Yet</h3>
              <p className="text-sm text-muted-foreground">
                We haven't analyzed this resume yet. Click the button below to have our AI review your resume against ATS standards.
              </p>
              <AnalyzeButton resumeId={resume.id} isAnalyzingDisabled={false} />
            </div>
          </div>
        )}
      </div>

      {resume.analyses.length > 1 && (
        <div className="pt-8 border-t">
          <h3 className="text-lg font-semibold mb-4">Past Analyses</h3>
          <div className="space-y-4">
            {resume.analyses.slice(1).map((analysis) => (
              <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div>
                  <p className="font-medium">Score: {analysis.overallScore}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <Button variant="ghost" size="sm">View Report</Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
