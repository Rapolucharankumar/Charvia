"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface DashboardClientProps {
  firstName: string;
  stats: {
    applications: number;
    interviews: number;
    resumes: number;
    readiness: number;
    atsAvg: number;
  };
}

export function DashboardClient({ firstName, stats }: DashboardClientProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-24 w-full max-w-4xl mx-auto py-16 px-4 md:px-12"
    >
      {/* 1. THE HOOK (HERO) */}
      <motion.div variants={item} className="max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-playfair font-black text-slate-900 leading-[1.1] tracking-tight">
          Good afternoon, {firstName}. Your career trajectory is accelerating.
        </h1>
        <div className="mt-8 w-16 h-1 bg-slate-900" />
      </motion.div>

      {/* 2. THE MOMENTUM (APPLICATIONS & INTERVIEWS) */}
      <motion.div variants={item} className="flex flex-col md:flex-row gap-12 md:gap-24 items-start">
        <div className="flex-1 space-y-6">
          <p className="font-playfair text-3xl md:text-4xl leading-tight text-slate-800">
            You are currently tracking <span className="font-black text-primary">{stats.applications} active applications</span>. The momentum is building.
          </p>
          <p className="text-lg text-slate-500 font-inter leading-relaxed max-w-lg">
            This week alone, your activity has outpaced 85% of peers in your industry. Keep the pressure on, and prepare for the {stats.interviews} interviews on the horizon.
          </p>
          <Link href="/applications" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-slate-900 hover:text-primary transition-colors mt-4">
            View Application Board <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* 3. THE READINESS CHAPTER */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-xs uppercase tracking-[0.3em] text-slate-400 font-bold mb-4">Chapter 1 &mdash; Readiness</h2>
          <p className="font-playfair text-3xl md:text-4xl leading-tight text-slate-800 mb-6">
            Your readiness score sits at a commanding <span className="italic">{stats.readiness}%</span>.
          </p>
          <p className="text-lg text-slate-500 font-inter leading-relaxed">
            Your foundational documents are solid, but perfection lies in the details. A minor adjustment to your primary resume could push you past the 90% threshold.
          </p>
        </div>
        <div className="order-1 md:order-2 flex justify-end">
          <div className="text-[12rem] leading-none font-playfair font-black text-slate-100 tracking-tighter select-none -ml-8 md:ml-0">
            {stats.readiness}
          </div>
        </div>
      </motion.div>

      {/* 4. THE ACTIONABLE INSIGHTS */}
      <motion.div variants={item} className="border-t border-slate-200 pt-16">
        <h2 className="text-xs uppercase tracking-[0.3em] text-slate-400 font-bold mb-12">The Next Move</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-4">
            <h3 className="font-playfair text-2xl font-bold text-slate-900">Refine Your Narrative.</h3>
            <p className="text-slate-500 font-inter leading-relaxed">
              Your resume averages an ATS score of {stats.atsAvg}%. By optimizing for specific roles, you can ensure your story is heard by the right algorithms.
            </p>
            <Link href="/resumes" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-primary hover:text-slate-900 transition-colors mt-2">
              Optimize Resumes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-playfair text-2xl font-bold text-slate-900">Master the Delivery.</h3>
            <p className="text-slate-500 font-inter leading-relaxed">
              A perfect resume gets you in the door. The interview secures the desk. Engage with our AI simulator to polish your delivery.
            </p>
            <Link href="/interviews" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-primary hover:text-slate-900 transition-colors mt-2">
              Start Simulation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
