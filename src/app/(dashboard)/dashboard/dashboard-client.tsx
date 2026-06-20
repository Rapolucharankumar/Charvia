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
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-32 w-full max-w-4xl mx-auto py-24 px-4 md:px-12"
    >
      {/* 1. THE HOOK (HERO) */}
      <motion.div variants={item} className="max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-playfair text-stone-900 leading-[1.1] tracking-tight font-light">
          Good afternoon, {firstName}. <br />
          <span className="italic">Your career trajectory is accelerating.</span>
        </h1>
        <div className="mt-12 w-12 h-[1px] bg-stone-300" />
      </motion.div>

      {/* 2. THE MOMENTUM (APPLICATIONS & INTERVIEWS) */}
      <motion.div variants={item} className="flex flex-col md:flex-row gap-12 md:gap-24 items-start">
        <div className="flex-1 space-y-8">
          <p className="font-playfair text-3xl md:text-4xl leading-tight text-stone-800">
            You are currently tracking <span className="italic font-medium">{stats.applications} active applications</span>. The momentum is palpable.
          </p>
          <p className="text-lg text-stone-500 font-inter leading-relaxed max-w-lg font-light tracking-wide">
            This week alone, your activity has outpaced 85% of peers in your industry. Keep the pressure on, and prepare for the {stats.interviews} interviews on the horizon.
          </p>
          <Link href="/applications" className="inline-flex items-center gap-4 text-xs uppercase tracking-[0.2em] font-medium text-stone-900 hover:text-stone-500 transition-colors mt-8">
            View Application Board <ArrowRight className="w-4 h-4" strokeWidth={1} />
          </Link>
        </div>
      </motion.div>

      {/* 3. THE READINESS CHAPTER */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1 space-y-8">
          <h2 className="text-xs uppercase tracking-[0.3em] text-stone-400 font-light">Chapter 1 &mdash; Readiness</h2>
          <p className="font-playfair text-3xl md:text-4xl leading-tight text-stone-800">
            Your readiness score sits at a commanding <span className="italic">{stats.readiness}%</span>.
          </p>
          <p className="text-lg text-stone-500 font-inter leading-relaxed font-light tracking-wide">
            Your foundational documents are solid, but perfection lies in the details. A minor adjustment to your primary resume could push you past the 90% threshold.
          </p>
        </div>
        <div className="order-1 md:order-2 flex justify-end">
          <div className="text-[12rem] md:text-[16rem] leading-none font-playfair font-light text-stone-200 tracking-tighter select-none -ml-8 md:ml-0 italic">
            {stats.readiness}
          </div>
        </div>
      </motion.div>

      {/* 4. THE ACTIONABLE INSIGHTS */}
      <motion.div variants={item} className="border-t border-stone-200 pt-24">
        <h2 className="text-xs uppercase tracking-[0.3em] text-stone-400 font-light mb-16">The Next Move</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="space-y-6">
            <h3 className="font-playfair text-3xl text-stone-900 italic">Refine Your Narrative.</h3>
            <p className="text-stone-500 font-inter leading-relaxed font-light tracking-wide">
              Your resume averages an ATS score of {stats.atsAvg}%. By optimizing for specific roles, you can ensure your story is heard by the right algorithms.
            </p>
            <Link href="/resumes" className="inline-flex items-center gap-4 text-xs uppercase tracking-[0.2em] font-medium text-stone-900 hover:text-stone-500 transition-colors mt-4">
              Optimize Resumes <ArrowRight className="w-4 h-4" strokeWidth={1} />
            </Link>
          </div>
          
          <div className="space-y-6">
            <h3 className="font-playfair text-3xl text-stone-900 italic">Master the Delivery.</h3>
            <p className="text-stone-500 font-inter leading-relaxed font-light tracking-wide">
              A perfect resume gets you in the door. The interview secures the desk. Engage with our AI simulator to polish your delivery.
            </p>
            <Link href="/interviews" className="inline-flex items-center gap-4 text-xs uppercase tracking-[0.2em] font-medium text-stone-900 hover:text-stone-500 transition-colors mt-4">
              Start Simulation <ArrowRight className="w-4 h-4" strokeWidth={1} />
            </Link>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
