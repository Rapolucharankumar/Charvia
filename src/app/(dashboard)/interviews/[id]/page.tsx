import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { ArrowLeft, Building, Target, GraduationCap } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default async function InterviewDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  let session;
  try {
    session = await prisma.interviewSession.findUnique({
      where: { id: (await params).id, userId: user.id },
    });
  } catch (error) {
    notFound();
  }

  if (!session || !session.feedback) {
    notFound();
  }

  // Parse feedback from JSON
  const sessionData = session.feedback as any;
  const metadata = sessionData.metadata || { company: "Unknown", role: "Unknown", experience: "Unknown" };
  const prepGuide = sessionData.prepGuide || { hrQuestions: [], technicalQuestions: [], behavioralQuestions: [] };

  const categories = [
    { title: "HR & Cultural Fit", key: "hrQuestions", data: prepGuide.hrQuestions, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { title: "Technical Skills", key: "technicalQuestions", data: prepGuide.technicalQuestions, color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
    { title: "Behavioral (STAR Method)", key: "behavioralQuestions", data: prepGuide.behavioralQuestions, color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  ];

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center space-x-4">
        <Link href="/interviews" className={buttonVariants({ variant: "outline", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Interview Prep Guide</h2>
          <p className="text-muted-foreground">
            Review your tailored questions and model answers.
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <Badge variant="outline" className="px-4 py-2 text-sm flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          {metadata.company}
        </Badge>
        <Badge variant="outline" className="px-4 py-2 text-sm flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          {metadata.role}
        </Badge>
        <Badge variant="outline" className="px-4 py-2 text-sm flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          {metadata.experience}
        </Badge>
      </div>

      <div className="space-y-6">
        {categories.map((category, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs border ${category.color}`}>
                  {category.data.length} Questions
                </span>
                {category.title}
              </CardTitle>
              <CardDescription>Practice answering these questions out loud.</CardDescription>
            </CardHeader>
            <CardContent>
              {category.data.length === 0 ? (
                <p className="text-muted-foreground text-sm">No questions available for this category.</p>
              ) : (
                <Accordion className="w-full">
                  {category.data.map((item: any, i: number) => (
                    <AccordionItem value={`item-${i}`} key={i}>
                      <AccordionTrigger className="text-left font-medium text-base">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="bg-muted/50 p-4 rounded-md mt-2 text-sm text-foreground leading-relaxed">
                        <div className="font-semibold mb-2 text-primary">Model Answer:</div>
                        {item.modelAnswer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
