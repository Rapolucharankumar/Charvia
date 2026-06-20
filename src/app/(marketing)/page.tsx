import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-16 md:pb-12 md:pt-24 lg:py-32 w-full flex flex-col items-center max-w-5xl text-center px-4">
        <h1 className="text-3xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
          Supercharge Your Career Journey
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Charvia is the ultimate career growth platform for students and freshers. Improve your resume, prepare for interviews, and track your applications all in one place.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/signup">
            <Button size="lg" className="h-12 px-8 text-md font-semibold">
              Start for free
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="h-12 px-8 text-md font-semibold">
              Explore features
            </Button>
          </Link>
        </div>
      </section>

      {/* Placeholder Features Section */}
      <section id="features" className="container space-y-6 bg-slate-50 dark:bg-transparent py-8 md:py-12 lg:py-24 w-full flex flex-col items-center">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Everything you need to land your dream job, packaged into a single modern platform.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 pt-8">
          {/* Feature Card 1 */}
          <div className="relative overflow-hidden rounded-lg border bg-background p-2 text-left">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">Resume Builder</h3>
                <p className="text-sm text-muted-foreground">Craft ATS-friendly resumes that stand out to recruiters.</p>
              </div>
            </div>
          </div>
          {/* Feature Card 2 */}
          <div className="relative overflow-hidden rounded-lg border bg-background p-2 text-left">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">Interview Prep</h3>
                <p className="text-sm text-muted-foreground">Practice with AI-powered mock interviews and feedback.</p>
              </div>
            </div>
          </div>
          {/* Feature Card 3 */}
          <div className="relative overflow-hidden rounded-lg border bg-background p-2 text-left">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">Application Tracker</h3>
                <p className="text-sm text-muted-foreground">Keep your job search organized with a Kanban-style board.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
