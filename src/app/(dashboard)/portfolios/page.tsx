import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PlusCircle, Globe, Settings, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default async function PortfoliosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const portfolios = await prisma.portfolio.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Portfolios</h1>
          <p className="text-muted-foreground mt-1">
            Build and manage your professional portfolios.
          </p>
        </div>
        <Link href="/portfolios/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Portfolio
          </Button>
        </Link>
      </div>

      {portfolios.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <Globe className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No portfolios yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Create your first AI-generated portfolio by extracting data from your resume. Choose a theme and publish in minutes.
          </p>
          <Link href="/portfolios/new">
            <Button>Get Started</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id} className="flex flex-col overflow-hidden">
              <div 
                className="h-32 w-full bg-muted/50 border-b flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: portfolio.colorHex + '20' }}
              >
                {/* A simple preview placeholder */}
                <div 
                  className="w-3/4 h-3/4 bg-background rounded-t-md shadow-sm border-t border-l border-r flex flex-col items-center pt-4 opacity-80"
                >
                  <div className="w-1/2 h-2 rounded-full mb-2" style={{ backgroundColor: portfolio.colorHex }} />
                  <div className="w-3/4 h-2 bg-muted rounded-full" />
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl truncate flex items-center justify-between">
                  {portfolio.username}
                  <div className={`h-2 w-2 rounded-full ${portfolio.isPublished ? 'bg-green-500' : 'bg-yellow-500'}`} title={portfolio.isPublished ? 'Published' : 'Draft'} />
                </CardTitle>
                <CardDescription>
                  Theme: <span className="capitalize">{portfolio.theme}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 text-sm text-muted-foreground">
                <p>Created on {format(new Date(portfolio.createdAt), "MMM d, yyyy")}</p>
              </CardContent>
              <CardFooter className="flex gap-2 pt-4 border-t bg-muted/20">
                <Link href={`/portfolios/${portfolio.id}/editor`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <Settings className="h-4 w-4" /> Edit
                  </Button>
                </Link>
                {portfolio.isPublished && (
                  <Link href={`https://${portfolio.username}.charvia.app`} target="_blank" className="flex-1">
                    <Button variant="secondary" className="w-full gap-2">
                      View <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
