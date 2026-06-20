"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BarChart3, Briefcase, FileText, Sparkles, Target, Zap } from "lucide-react";
import { useRef } from "react";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 bg-mesh opacity-80 -z-10" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />

      {/* Glow Effects */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse-glow" />

      <main className="flex flex-col items-center pt-32 pb-16 px-4 md:px-8">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8 max-w-5xl relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-primary/20 text-sm font-medium text-primary mb-4"
          >
            <Sparkles className="h-4 w-4" />
            <span>The future of career growth</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter"
          >
            Your career, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-blue-500">
              supercharged.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl text-lg md:text-xl text-muted-foreground font-light leading-relaxed"
          >
            Charvia is the premium platform for elite professionals. Build ATS-perfect resumes, master AI mock interviews, and land your dream role with precision.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-base font-semibold rounded-full shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transition-all">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* 3D Dashboard Showcase */}
        <motion.section 
          style={{ y, opacity }}
          initial={{ opacity: 0, scale: 0.9, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, type: "spring" as const }}
          className="relative w-full max-w-6xl mt-24 aspect-[16/9] perspective-[2000px]"
        >
          {/* Main Dashboard Panel */}
          <div className="absolute inset-0 glass-card rounded-2xl overflow-hidden border-white/10 shadow-2xl rotate-x-[15deg] rotate-y-[-5deg] transform-style-3d hover:rotate-x-[5deg] hover:rotate-y-[0deg] transition-all duration-700 ease-out">
            {/* Mockup Header */}
            <div className="h-12 border-b border-white/5 flex items-center px-6 gap-2 bg-black/20">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
            </div>
            
            {/* Mockup Body */}
            <div className="p-8 grid grid-cols-3 gap-6 h-full">
              {/* Sidebar Mock */}
              <div className="col-span-1 space-y-4">
                <div className="h-8 w-3/4 rounded bg-white/5" />
                <div className="h-4 w-1/2 rounded bg-white/5" />
                <div className="h-4 w-2/3 rounded bg-white/5" />
                <div className="h-4 w-1/2 rounded bg-white/5" />
              </div>
              
              {/* Main Content Mock */}
              <div className="col-span-2 space-y-6">
                <div className="h-32 rounded-xl bg-gradient-to-r from-primary/20 to-purple-500/20 border border-white/5" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-40 rounded-xl bg-white/5 border border-white/5" />
                  <div className="h-40 rounded-xl bg-white/5 border border-white/5" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating UI Elements */}
          <motion.div 
            className="absolute -left-12 top-1/4 glass-card p-4 rounded-xl border border-green-500/20 shadow-[0_0_30px_-5px_rgba(34,197,94,0.2)] animate-float z-20"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <span className="text-xl font-bold text-green-400">98</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">ATS Score</p>
                <p className="text-xs text-green-400">Perfect Match</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="absolute -right-8 bottom-1/3 glass-card p-4 rounded-xl border border-blue-500/20 shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)] animate-float-slow z-20"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Job Match</p>
                <p className="text-xs text-muted-foreground">Software Engineer</p>
              </div>
            </div>
          </motion.div>

        </motion.section>

        {/* Feature Highlights */}
        <section id="features" className="w-full max-w-6xl mt-48 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            { icon: FileText, title: "Smart Resumes", desc: "AI-driven formatting and content suggestions that beat ATS filters instantly." },
            { icon: Zap, title: "Mock Interviews", desc: "Practice with our AI interviewer. Get real-time feedback on your answers and tone." },
            { icon: Briefcase, title: "Application Tracking", desc: "Manage your entire job hunt pipeline with a sleek, automated Kanban board." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-8 rounded-2xl group cursor-default"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  );
}
