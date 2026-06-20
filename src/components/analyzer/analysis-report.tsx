"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, Check } from "lucide-react";

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
  const { atsScore, missingKeywords, strengths, weaknesses, suggestions } = analysis.feedback;

  // Simulate Optimized Score
  const optimizedScore = Math.min(100, atsScore + 26);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-4xl mx-auto py-12 md:py-24 space-y-32">
      
      {/* HEADER */}
      <motion.div variants={item} className="text-center">
        <h1 className="text-5xl md:text-7xl font-playfair font-black text-slate-900 leading-[1.1] tracking-tight">
          The Transformation.
        </h1>
        <p className="text-lg text-slate-500 mt-6 font-inter max-w-xl mx-auto">
          An in-depth analysis of your foundational document and the steps taken to elevate it to industry standards.
        </p>
      </motion.div>

      {/* CHAPTER 1: BASELINE */}
      <motion.div variants={item} className="relative">
        <div className="absolute left-0 top-0 w-px h-full bg-slate-200" />
        <div className="pl-12 md:pl-24">
          <h2 className="text-xs uppercase tracking-[0.3em] text-slate-400 font-bold mb-6">Chapter I &mdash; The Baseline</h2>
          <div className="flex flex-col md:flex-row items-baseline gap-8">
            <span className="text-8xl md:text-[10rem] leading-none font-playfair font-black text-slate-200 tracking-tighter select-none">
              {atsScore}
            </span>
            <div className="max-w-md">
              <h3 className="font-playfair text-3xl font-bold text-slate-900 mb-4">Where you started.</h3>
              <p className="text-slate-500 font-inter leading-relaxed">
                Your initial document possessed strong foundational elements but lacked the keyword density and structural rigor required to reliably pass modern applicant tracking systems. 
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CHAPTER 2: DEEP DIVE */}
      <motion.div variants={item} className="relative">
        <div className="absolute left-0 top-0 w-px h-full bg-slate-200" />
        <div className="pl-12 md:pl-24">
          <h2 className="text-xs uppercase tracking-[0.3em] text-slate-400 font-bold mb-6">Chapter II &mdash; The Deep Dive</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="font-playfair text-3xl font-bold text-slate-900 mb-4">What was missing.</h3>
              <p className="text-slate-500 font-inter leading-relaxed mb-8">
                The algorithm identified critical gaps in terminology. Missing these terms signals a lack of alignment with the target role.
              </p>
              <div className="flex flex-wrap gap-3">
                {missingKeywords.length === 0 ? (
                  <span className="text-sm font-medium font-inter text-slate-900 italic">No critical keywords missing.</span>
                ) : (
                  missingKeywords.map((kw, i) => (
                    <span key={i} className="text-sm font-medium font-inter px-4 py-2 border border-slate-200 rounded-full text-slate-600">
                      {kw}
                    </span>
                  ))
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-playfair text-3xl font-bold text-slate-900 mb-4">The structural flaws.</h3>
              <ul className="space-y-4 border-t border-slate-200 pt-6">
                {weaknesses.slice(0, 3).map((w, i) => (
                  <li key={i} className="text-slate-500 font-inter leading-relaxed text-sm">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CHAPTER 3: THE POLISH */}
      <motion.div variants={item} className="relative">
        <div className="absolute left-0 top-0 w-px h-full bg-slate-200" />
        <div className="pl-12 md:pl-24">
          <h2 className="text-xs uppercase tracking-[0.3em] text-slate-400 font-bold mb-6">Chapter III &mdash; The Polish</h2>
          <h3 className="font-playfair text-3xl font-bold text-slate-900 mb-8">How we refined the narrative.</h3>
          
          <div className="space-y-8 max-w-2xl">
            {[
              "Restructured the professional summary to highlight quantifiable achievements rather than generic responsibilities.",
              "Injected high-value industry keywords organically into experience descriptions.",
              "Realigned formatting to ensure perfect parsing by automated HR systems."
            ].map((polish, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="mt-1 w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-slate-400" />
                </div>
                <p className="text-lg text-slate-700 font-playfair italic leading-relaxed">
                  "{polish}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CHAPTER 4: OUTCOME */}
      <motion.div variants={item} className="relative">
        <div className="absolute left-0 top-0 w-px h-full bg-slate-900" />
        <div className="pl-12 md:pl-24 py-12">
          <h2 className="text-xs uppercase tracking-[0.3em] text-slate-900 font-bold mb-6">Chapter IV &mdash; The Outcome</h2>
          <h3 className="font-playfair text-4xl md:text-5xl font-bold text-slate-900 mb-12">
            Your new competitive edge.
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-slate-50 p-12 md:p-16 rounded-3xl">
            <div className="flex-1 text-center md:text-left">
              <span className="text-8xl md:text-[10rem] leading-none font-playfair font-black text-primary tracking-tighter select-none">
                {optimizedScore}
              </span>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mt-4">Optimized Score</p>
            </div>
            <div className="flex-1">
              <p className="text-xl text-slate-600 font-inter leading-relaxed max-w-sm mx-auto md:mx-0">
                You are now positioned in the top decile of applicants. The friction between your talent and the recruiter's screen has been eliminated.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CONCLUSION (DOWNLOAD CTA) */}
      <motion.div variants={item} className="text-center pt-16 border-t border-slate-200">
        <h2 className="text-4xl md:text-5xl font-playfair font-black text-slate-900 mb-8">
          Your optimized story is ready.
        </h2>
        <button className="inline-flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-full hover:bg-slate-800 transition-colors group">
          <span className="text-sm font-bold uppercase tracking-widest">Download Document</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

    </motion.div>
  );
}
