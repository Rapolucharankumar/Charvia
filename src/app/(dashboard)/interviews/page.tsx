import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { PlusCircle, Building, Target, Clock, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default async function InterviewsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch mock interview sessions where feedback is not null
  const sessions = await prisma.interviewSession.findMany({
    where: { 
      userId: user.id,
      type: "MOCK"
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Interview Prep</h2>
          <p className="text-muted-foreground">
            Generate custom AI-powered interview questions and model answers.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/interviews/new" className={buttonVariants()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Prep Guide
          </Link>
        </div>
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No prep guides yet"
          description="Create your first interview prep guide to get AI-generated HR, technical, and behavioral questions tailored to your role."
          actionLabel="Create First Guide"
          actionHref="/interviews/new"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => {
            const feedback = session.feedback as any;
            const metadata = feedback?.metadata || { company: "Unknown", role: "Unknown", experience: "Unknown" };

            return (
              <Card key={session.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{metadata.role}</CardTitle>
                  </div>
                  <CardDescription className="flex items-center gap-1.5 font-medium text-foreground">
                    <Building className="h-4 w-4" />
                    {metadata.company}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Created {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {metadata.experience} Level
                  </div>
                </CardContent>
                <CardFooter>
                  <Link 
                    href={`/interviews/${session.id}`}
                    className={buttonVariants({ variant: "secondary", className: "w-full" })}
                  >
                    View Prep Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
