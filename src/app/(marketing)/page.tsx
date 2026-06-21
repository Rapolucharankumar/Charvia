"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Briefcase, FileText, Sparkles, Target, Zap, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Soft Ambient Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-accent/10 to-primary/5 blur-[100px] pointer-events-none" />

      <main className="flex flex-col items-center pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold text-primary"
          >
            <Sparkles className="h-4 w-4" />
            <span>The future of career growth</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-sora font-extrabold tracking-tight text-foreground leading-[1.1]"
          >
            Land Better Jobs. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Faster.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="max-w-2xl text-lg md:text-xl text-muted-foreground font-inter font-medium leading-relaxed"
          >
            Analyze resumes, improve ATS scores, prepare for interviews, and track applications in one platform.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 pt-6"
          >
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-lg font-semibold rounded-2xl shadow-[0_8px_30px_-8px_rgba(124,58,237,0.4)] hover:shadow-[0_12px_40px_-10px_rgba(124,58,237,0.5)] hover:-translate-y-1 transition-all">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold rounded-2xl bg-white border-slate-200 hover:bg-slate-50 transition-all">
                Sign In
              </Button>
            </Link>
          </motion.div>


        </section>

        {/* Dashboard Showcase & Bento Grid */}
        <section className="w-full mt-32 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Visual */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
            className="col-span-1 md:col-span-8 glass-card p-8 min-h-[400px] flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-secondary/10 to-transparent rounded-full blur-[80px] -z-10 group-hover:scale-110 transition-transform duration-700" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-sora font-bold text-foreground mb-4">Intelligent Career Command Center</h3>
              <p className="text-muted-foreground font-inter text-lg max-w-md leading-relaxed">
                Track your applications, monitor your ATS readiness score, and get actionable insights tailored specifically to your goals.
              </p>
            </div>
            <div className="mt-8 flex gap-4">
               <div className="px-4 py-2 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center gap-2 font-semibold text-slate-800">
                  <CheckCircle2 className="h-5 w-5 text-success" /> ATS Score: 98%
               </div>
            </div>
          </motion.div>

          {/* Side Bento Card 1 */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring", bounce: 0.3 }}
            className="col-span-1 md:col-span-4 glass-card p-8 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-sora font-bold text-foreground mb-4">AI Mock Interviews</h3>
              <p className="text-muted-foreground font-inter leading-relaxed">
                Practice with our advanced AI interviewer. Receive real-time feedback on tone, technical accuracy, and STAR method usage.
              </p>
            </div>
          </motion.div>

          {/* Bottom Bento Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1, type: "spring", bounce: 0.3 }}
            className="col-span-1 md:col-span-5 glass-card p-8"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-sora font-bold text-foreground mb-4">Resume Optimization Engine</h3>
            <p className="text-muted-foreground font-inter leading-relaxed">
              Drop your raw PDF into the engine. Our system automatically extracts keywords, realigns formatting, and ensures you bypass modern ATS filters.
            </p>
          </motion.div>

          {/* Bottom Bento Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring", bounce: 0.3 }}
            className="col-span-1 md:col-span-7 glass-card p-8 overflow-hidden relative"
          >
            <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] bg-gradient-to-tl from-success/10 to-transparent rounded-full blur-[60px] -z-10" />
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center mb-6">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-sora font-bold text-foreground mb-4">Mission Control Pipeline</h3>
            <p className="text-muted-foreground font-inter leading-relaxed max-w-xl">
              Visualize your applications with an elegant, drag-and-drop Kanban board. Track every stage from the initial application to the final offer letter effortlessly.
            </p>
          </motion.div>

        </section>
      </main>
    </div>
  );
}
