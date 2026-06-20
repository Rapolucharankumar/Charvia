import { IntroForm } from "./intro-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NewIntroPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center space-x-4">
        <Link href="/intro" className={buttonVariants({ variant: "outline", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Self Introduction</h2>
          <p className="text-muted-foreground">
            Generate multiple personalized elevator pitches and introductions.
          </p>
        </div>
      </div>
      
      <IntroForm />
    </div>
  );
}
