import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { PlusCircle, MessageCircle, Clock, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default async function IntrosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const intros = await prisma.selfIntroduction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Self Introductions</h2>
          <p className="text-muted-foreground">
            View and manage your AI-generated professional pitches.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/intro/new" className={buttonVariants()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Introduction
          </Link>
        </div>
      </div>

      {intros.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/20 border-dashed">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium">No introductions yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">
            Generate your first 30-second, 1-minute, HR, and technical elevator pitches instantly.
          </p>
          <Link href="/intro/new" className={buttonVariants()}>
            Generate Pitches
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {intros.map((intro) => {
            const inputs = intro.inputs as any;

            return (
              <Card key={intro.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl line-clamp-1">{inputs.name}</CardTitle>
                  </div>
                  <CardDescription className="flex items-center gap-1.5 font-medium text-foreground">
                    {inputs.degree}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Generated {formatDistanceToNow(new Date(intro.createdAt), { addSuffix: true })}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link 
                    href={`/intro/${intro.id}`}
                    className={buttonVariants({ variant: "secondary", className: "w-full" })}
                  >
                    View Pitches
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
