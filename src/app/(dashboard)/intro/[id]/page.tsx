import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";

export default async function IntroDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const intro = await prisma.selfIntroduction.findUnique({
    where: { id: params.id, userId: user.id },
  });

  if (!intro) {
    notFound();
  }

  const generated = intro.generated as any;
  const inputs = intro.inputs as any;

  const versions = [
    { title: "30-Second Elevator Pitch", content: generated.thirtySecond },
    { title: "1-Minute Professional Intro", content: generated.oneMinute },
    { title: "HR / Cultural Fit Focus", content: generated.hrVersion },
    { title: "Technical Focus", content: generated.technicalVersion },
  ];

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/intro" className={buttonVariants({ variant: "outline", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Introductions</h2>
          <p className="text-muted-foreground">
            Custom pitches generated for {inputs.role || inputs.degree}.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {versions.map((version, idx) => (
          <Card key={idx} className="flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-xl">{version.title}</CardTitle>
              <CopyButton text={version.content} />
            </CardHeader>
            <CardContent className="flex-1 pt-4">
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {version.content}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
