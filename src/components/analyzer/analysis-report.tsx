"use client";

import { motion } from "framer-motion";

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
  const { atsScore, missingKeywords, weaknesses } = analysis.feedback;

  // Simulate Optimized Score
  const optimizedScore = Math.min(100, atsScore + 26);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-4xl mx-auto py-24 space-y-40">
      
      {/* HEADER */}
      <motion.div variants={item} className="text-center md:text-left px-4 md:px-12">
        <h1 className="text-5xl md:text-7xl font-playfair font-light text-stone-900 leading-[1.1] tracking-tight">
          The Transformation.
        </h1>
        <div className="mt-12 w-12 h-[1px] bg-stone-300 mx-auto md:mx-0" />
        <p className="text-lg text-stone-500 mt-12 font-inter max-w-xl font-light tracking-wide mx-auto md:mx-0">
          An in-depth analysis of your foundational document and the steps taken to elevate it to industry standards.
        </p>
      </motion.div>

      {/* CHAPTER 1: BASELINE */}
      <motion.div variants={item} className="relative">
        <div className="absolute left-0 top-0 w-[1px] h-full bg-stone-200 hidden md:block" />
        <div className="px-4 md:pl-24 md:pr-0">
          <h2 className="text-xs uppercase tracking-[0.4em] text-stone-400 font-light mb-12">Chapter I &mdash; The Baseline</h2>
          <div className="flex flex-col md:flex-row items-baseline gap-12">
            <span className="text-[10rem] md:text-[14rem] leading-none font-playfair font-light text-stone-200 tracking-tighter select-none italic">
              {atsScore}
            </span>
            <div className="max-w-md mt-8 md:mt-0">
              <h3 className="font-playfair text-3xl text-stone-900 mb-6 italic">Where you started.</h3>
              <p className="text-stone-500 font-inter leading-relaxed font-light tracking-wide">
                Your initial document possessed strong foundational elements but lacked the keyword density and structural rigor required to reliably pass modern applicant tracking systems. 
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CHAPTER 2: DEEP DIVE */}
      <motion.div variants={item} className="relative">
        <div className="absolute left-0 top-0 w-[1px] h-full bg-stone-200 hidden md:block" />
        <div className="px-4 md:pl-24 md:pr-0">
          <h2 className="text-xs uppercase tracking-[0.4em] text-stone-400 font-light mb-12">Chapter II &mdash; The Deep Dive</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div>
              <h3 className="font-playfair text-3xl text-stone-900 mb-8">Missing Lexicon</h3>
              <p className="text-stone-500 font-inter leading-relaxed font-light tracking-wide mb-10">
                The algorithm identified critical gaps in terminology. Missing these terms signals a lack of alignment with the target role.
              </p>
              <div className="flex flex-wrap gap-4">
                {missingKeywords.length === 0 ? (
                  <span className="text-sm font-light font-inter text-stone-400 italic">No critical keywords missing.</span>
                ) : (
                  missingKeywords.map((kw, i) => (
                    <span key={i} className="text-xs uppercase tracking-[0.1em] font-light font-inter px-4 py-2 border border-stone-200 text-stone-600">
                      {kw}
                    </span>
                  ))
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-playfair text-3xl text-stone-900 mb-8">Structural Flaws</h3>
              <div className="w-12 h-[1px] bg-stone-200 mb-8" />
              <ul className="space-y-6">
                {weaknesses.slice(0, 3).map((w, i) => (
                  <li key={i} className="text-stone-500 font-inter leading-relaxed text-sm font-light tracking-wide">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CHAPTER 3: THE POLISH */}
      <motion.div variants={item} className="relative bg-stone-100 py-24 -mx-4 md:-mx-12 px-8 md:px-36">
        <h2 className="text-xs uppercase tracking-[0.4em] text-stone-400 font-light mb-16 text-center">Chapter III &mdash; The Polish</h2>
        <h3 className="font-playfair text-4xl text-stone-900 mb-16 text-center italic">How we refined the narrative.</h3>
        
        <div className="space-y-16 max-w-2xl mx-auto">
          {[
            "Restructured the professional summary to highlight quantifiable achievements rather than generic responsibilities.",
            "Injected high-value industry keywords organically into experience descriptions.",
            "Realigned formatting to ensure perfect parsing by automated HR systems."
          ].map((polish, i) => (
            <div key={i} className="text-center">
              <p className="text-xl md:text-2xl text-stone-700 font-playfair font-light leading-relaxed">
                "{polish}"
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CHAPTER 4: OUTCOME */}
      <motion.div variants={item} className="relative">
        <div className="absolute left-0 top-0 w-[1px] h-full bg-stone-900 hidden md:block" />
        <div className="px-4 md:pl-24 md:pr-0">
          <h2 className="text-xs uppercase tracking-[0.4em] text-stone-900 font-bold mb-12">Chapter IV &mdash; The Outcome</h2>
          <h3 className="font-playfair text-5xl md:text-6xl font-light text-stone-900 mb-20 leading-tight">
            Your new competitive edge.
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
            <div className="text-center md:text-left">
              <span className="text-[12rem] md:text-[16rem] leading-none font-playfair font-light text-stone-900 tracking-tighter select-none">
                {optimizedScore}
              </span>
              <p className="text-xs uppercase tracking-[0.3em] font-medium text-stone-400 mt-8">Optimized Score</p>
            </div>
            <div className="flex-1">
              <div className="w-12 h-[1px] bg-stone-300 mb-8" />
              <p className="text-2xl text-stone-600 font-playfair leading-relaxed italic max-w-sm">
                You are now positioned in the top decile of applicants. The friction between your talent and the recruiter's screen has been eliminated.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CONCLUSION (DOWNLOAD CTA) */}
      <motion.div variants={item} className="text-center pt-32">
        <h2 className="text-4xl md:text-5xl font-playfair font-light text-stone-900 mb-16 italic">
          Your optimized story is ready.
        </h2>
        <button className="inline-flex items-center justify-center px-12 py-6 bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] min-w-[280px]">
          <span className="text-xs uppercase tracking-[0.3em] font-light">Download Document</span>
        </button>
      </motion.div>

    </motion.div>
  );
}
