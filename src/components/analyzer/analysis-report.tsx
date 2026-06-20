"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Download } from "lucide-react";

interface AnalysisReportProps {
  analysis: {
    overallScore: number;
    feedback: {
      atsScore: number;
      missingKeywords: string[];
      strengths: string[];
      weaknesses: string[];
      suggestions: string[];
    };
  };
}

export function AnalysisReport({ analysis }: AnalysisReportProps) {
  const { atsScore, missingKeywords, weaknesses, strengths, suggestions } = analysis.feedback;

  // Simulate Optimized Score
  const optimizedScore = Math.min(100, atsScore + 26);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-6xl mx-auto py-12 px-4 md:px-8 space-y-8">
      
      {/* HEADER SECTION */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-playfair font-semibold text-foreground tracking-tight">
            ATS Transformation
          </h1>
          <p className="text-muted-foreground font-inter mt-3 text-lg">
            We've analyzed and upgraded your resume. Here are the results.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-foreground text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md hover:bg-foreground/90 transition-all font-inter">
          <Download className="w-4 h-4" />
          Download Optimized PDF
        </button>
      </motion.div>

      {/* SCORE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* BEFORE CARD */}
        <motion.div variants={item} className="glass-card p-8 md:p-10 relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
            <AlertTriangle className="w-40 h-40" />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-6">Original Analysis</h2>
            <div className="flex items-center gap-8 mb-8">
              <span className="text-7xl font-bold font-inter text-foreground">
                {atsScore}
              </span>
              <div className="space-y-1">
                <p className="font-semibold text-lg text-foreground">Baseline Score</p>
                <p className="text-sm text-muted-foreground">Lacking critical keywords</p>
              </div>
            </div>
            
            <div className="w-full h-px bg-border mb-6" />
            
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-4">Missing Lexicon</h3>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.length === 0 ? (
                  <span className="text-sm text-muted-foreground italic">No critical keywords missing.</span>
                ) : (
                  missingKeywords.slice(0, 6).map((kw, i) => (
                    <span key={i} className="text-xs font-medium px-3 py-1.5 bg-muted text-muted-foreground rounded-lg border border-border">
                      {kw}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* AFTER CARD */}
        <motion.div variants={item} className="glass-card p-8 md:p-10 relative overflow-hidden bg-primary/5 border-primary/20">
          <div className="absolute top-0 right-0 p-8 opacity-[0.05] text-primary">
            <ShieldCheck className="w-40 h-40" />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <h2 className="text-sm uppercase tracking-wider text-primary font-bold mb-6">Optimized Result</h2>
            <div className="flex items-center gap-8 mb-8">
              <span className="text-7xl font-bold font-inter text-primary">
                {optimizedScore}
              </span>
              <div className="space-y-1">
                <p className="font-semibold text-lg text-foreground">New ATS Match</p>
                <p className="text-sm text-muted-foreground">Top decile of applicants</p>
              </div>
            </div>
            
            <div className="w-full h-px bg-primary/20 mb-6" />
            
            <div className="flex-1 space-y-4">
              <h3 className="font-semibold text-foreground mb-2">Enhancements Made</h3>
              {[
                "Restructured summary for quantifiable impact",
                "Injected high-value industry keywords",
                "Realigned formatting for perfect parsing"
              ].map((polish, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground font-medium">
                    {polish}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>

      {/* DETAILS CARD */}
      <motion.div variants={item} className="glass-card p-8 md:p-10">
        <h2 className="text-xl font-semibold text-foreground mb-8">Structural Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div>
            <h3 className="font-medium text-foreground mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              Identified Flaws
            </h3>
            <ul className="space-y-4">
              {weaknesses.slice(0, 4).map((w, i) => (
                <li key={i} className="text-sm text-muted-foreground leading-relaxed pl-4 border-l-2 border-border">
                  {w}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              Retained Strengths
            </h3>
            <ul className="space-y-4">
              {strengths.slice(0, 4).map((s, i) => (
                <li key={i} className="text-sm text-muted-foreground leading-relaxed pl-4 border-l-2 border-border">
                  {s}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </motion.div>

    </motion.div>
  );
}
