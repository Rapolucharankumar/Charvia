"use client";

import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Calendar, Target, FileText } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

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
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-10 w-full max-w-6xl mx-auto py-12 px-4 md:px-8"
    >
      {/* HEADER SECTION */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-playfair font-semibold text-foreground tracking-tight">
            Welcome back, {firstName}.
          </h1>
          <p className="text-muted-foreground font-inter mt-3 text-lg">
            Here is your actionable career snapshot for today.
          </p>
        </div>
        <Link href="/resumes" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-medium shadow-sm hover:shadow-md hover:bg-primary/90 transition-all font-inter">
          <FileText className="w-4 h-4" />
          Analyze New Resume
        </Link>
      </motion.div>

      {/* TOP METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* READINESS & ATS CARD (Takes up 8 columns) */}
        <motion.div variants={item} className="md:col-span-8 glass-card p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-semibold font-inter text-lg text-foreground">Career Readiness</h2>
            <Link href="/intro" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              Improve Score &rarr;
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Primary Readiness Ring */}
            <div className="relative flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-muted" />
                <circle 
                  cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                  strokeDasharray={440} strokeDashoffset={440 - (440 * stats.readiness) / 100}
                  className="text-primary transition-all duration-1000 ease-out" 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-bold font-inter text-foreground">{stats.readiness}%</span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Readiness</span>
              </div>
            </div>

            <div className="flex-1 space-y-6 w-full">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Average ATS Match</span>
                  <span className="text-2xl font-bold text-foreground font-inter">{stats.atsAvg}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div className="bg-accent h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${stats.atsAvg}%` }} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your profile is in the top 15% of candidates. A slight boost to your ATS formatting will push you into the highly-recruited tier.
              </p>
            </div>
          </div>
        </motion.div>

        {/* PIPELINE CARD (Takes up 4 columns) */}
        <motion.div variants={item} className="md:col-span-4 glass-card p-8 flex flex-col">
          <h2 className="font-semibold font-inter text-lg text-foreground mb-8">Active Pipeline</h2>
          
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold font-inter text-foreground">{stats.applications}</p>
              </div>
            </div>
            
            <div className="w-full h-[1px] bg-border" />
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Interviews</p>
                <p className="text-2xl font-bold font-inter text-foreground">{stats.interviews}</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* BOTTOM ROW - NEXT ACTION */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Next Action Highlight */}
        <div className="glass-card p-8 bg-gradient-to-br from-primary to-[#5143d9] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Target className="w-32 h-32" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-md">
                Next Recommended Action
              </span>
              <h3 className="text-3xl font-playfair font-semibold mb-4 leading-tight">Prepare for your upcoming interview.</h3>
              <p className="text-white/80 font-inter text-sm max-w-sm leading-relaxed mb-8">
                You have an upcoming interview scheduled. Engage with our AI simulator to refine your delivery and secure the offer.
              </p>
            </div>
            <Link href="/interviews" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-semibold shadow-sm hover:bg-gray-50 transition-colors w-fit">
              Start Simulation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Secondary Info / Match */}
        <div className="glass-card p-8 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold font-inter text-lg text-foreground mb-4">Job Match Engine</h3>
            <p className="text-muted-foreground text-sm font-inter leading-relaxed mb-6">
              Our AI is constantly scanning the market for roles that align with your updated resume and skill profile.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-muted border border-border">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-sm text-foreground">Matches Found</span>
              <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-md">12 New</span>
            </div>
            <Link href="/match" className="block w-full text-center text-sm font-medium text-foreground bg-white border border-border rounded-xl py-2.5 hover:bg-gray-50 transition-colors">
              Review Matches
            </Link>
          </div>
        </div>

      </motion.div>

    </motion.div>
  );
}
