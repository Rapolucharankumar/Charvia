import { InterviewForm } from "./interview-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { checkProAccess } from "@/lib/subscription";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NewInterviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const hasAccess = await checkProAccess(user.id);
  if (!hasAccess) {
    redirect("/pricing");
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center space-x-4">
        <Link href="/interviews" className={buttonVariants({ variant: "outline", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Interview Prep</h2>
          <p className="text-muted-foreground">
            Generate a targeted interview guide tailored to your next role.
          </p>
        </div>
      </div>
      
      <InterviewForm />
    </div>
  );
}
