import { Check } from "lucide-react";
import { CheckoutButton } from "./checkout-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import Link from "next/link";
import { buttonVariants, Button } from "@/components/ui/button";

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isPro = false;
  if (user) {
    const plan = await getUserSubscriptionPlan(user.id);
    isPro = plan.isPro;
  }

  return (
    <div className="flex min-h-screen flex-col items-center pt-24 bg-background">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Unlock your full career potential. Upgrade to Pro for unlimited ATS analyses and AI-powered mock interviews.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full px-4">
        {/* Free Plan */}
        <Card className="flex flex-col relative">
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Perfect to get started</CardDescription>
            <div className="text-4xl font-bold mt-4 mb-2">₹0<span className="text-lg text-muted-foreground font-normal">/month</span></div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary" />
                <span>Basic Resume Upload</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary" />
                <span>3 ATS Analyses Daily</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary" />
                <span>Job Matching Tool</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary" />
                <span>Self Introduction Generator</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-5 h-5 flex items-center justify-center rounded-full border border-dashed border-muted-foreground/50"></div>
                <span>Interview Preparation</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {!user ? (
              <Link href="/login" className={buttonVariants({ variant: "outline", className: "w-full mt-8", size: "lg" })}>
                Sign Up
              </Link>
            ) : (
              <Link href="/dashboard" className={buttonVariants({ variant: "outline", className: "w-full mt-8", size: "lg" })}>
                {isPro ? "Included in Pro" : "Current Plan"}
              </Link>
            )}
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="flex flex-col border-primary shadow-xl shadow-primary/10 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-purple-600"></div>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Pro</CardTitle>
              <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
            </div>
            <CardDescription>For serious job seekers</CardDescription>
            <div className="text-4xl font-bold mt-4 mb-2">₹499<span className="text-lg text-muted-foreground font-normal">/month</span></div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary" />
                <span className="font-medium">Unlimited ATS Analyses</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary" />
                <span className="font-medium">Unlimited Mock Interviews</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary" />
                <span>Advanced Resume Building (Soon)</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary" />
                <span>Everything in Free</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {!user ? (
              <Link href="/login" className={buttonVariants({ className: "w-full mt-8", size: "lg" })}>
                Sign Up to Upgrade
              </Link>
            ) : isPro ? (
              <Button disabled className="w-full mt-8" size="lg">You are on Pro</Button>
            ) : (
              <CheckoutButton />
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
