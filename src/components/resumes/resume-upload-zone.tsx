"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, UploadCloud, FileText, Search, Tag, Wand2, Download, CheckCircle2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveResumeMetadata } from "@/app/(dashboard)/resumes/actions";
import { motion, AnimatePresence } from "framer-motion";

const PIPELINE_STEPS = [
  { id: 1, title: "Secure Upload", desc: "Your PDF is encrypted and securely staged.", icon: UploadCloud, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 2, title: "Deep ATS Analysis", desc: "We parse formatting, structure, and readability.", icon: Search, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { id: 3, title: "Keyword Detection", desc: "Extracting high-value skills and missing lexicon.", icon: Tag, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: 4, title: "AI Optimization", desc: "Bullet points are rewritten for maximum impact.", icon: Wand2, color: "text-pink-500", bg: "bg-pink-500/10" },
  { id: 5, title: "Ready for Submission", desc: "Download the perfect PDF and apply with confidence.", icon: Download, color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

export function ResumeUploadZone() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    if (file.type !== "application/pdf") {
      setError("Please provide your document in PDF format.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError || !session?.user) throw new Error("Authentication required.");

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error("We encountered an issue securing your document.");
      }

      const { data: { publicUrl } } = supabase.storage
        .from("resumes")
        .getPublicUrl(filePath);

      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      await saveResumeMetadata(file.name, publicUrl);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: isUploading
  });

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemAnim = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: THE UPLOAD ENGINE */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-sora font-bold text-foreground tracking-tight mb-3">
              Resume Analysis Studio
            </h1>
            <p className="text-muted-foreground font-inter text-lg max-w-xl">
              Drop your raw resume into the optimization engine. Transform your career trajectory and secure more interviews.
            </p>
          </div>

          <div 
            {...getRootProps()}
            className={`glass-card relative flex-1 min-h-[450px] flex flex-col items-center justify-center p-8 transition-all duration-500 overflow-hidden cursor-pointer
              ${isDragActive ? "ring-4 ring-primary/30 bg-primary/5 scale-[1.02]" : "hover:shadow-xl hover:-translate-y-1 hover:bg-muted/30"}
              ${isUploading ? "pointer-events-none" : ""}
            `}
          >
            <input {...getInputProps()} />

            <AnimatePresence mode="wait">
              {isUploading ? (
                <motion.div 
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col items-center justify-center relative"
                >
                  {/* Glowing Document Placeholder */}
                  <div className="w-48 h-64 border-2 border-primary/20 rounded-xl relative overflow-hidden bg-card backdrop-blur-sm shadow-xl">
                    {/* Skeleton lines */}
                    <div className="absolute inset-x-6 top-8 space-y-4">
                      <div className="h-3 w-3/4 bg-primary/10 rounded-full" />
                      <div className="h-2 w-full bg-primary/5 rounded-full" />
                      <div className="h-2 w-full bg-primary/5 rounded-full" />
                      <div className="h-2 w-5/6 bg-primary/5 rounded-full" />
                      <div className="h-3 w-1/2 bg-primary/10 rounded-full mt-6" />
                      <div className="h-2 w-full bg-primary/5 rounded-full" />
                      <div className="h-2 w-4/5 bg-primary/5 rounded-full" />
                    </div>

                    {/* Animated Laser Scan Line */}
                    <motion.div
                      initial={{ top: 0 }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 w-full h-1 bg-primary shadow-[0_0_15px_5px_rgba(124,58,237,0.5)] z-10"
                    />
                  </div>

                  <div className="mt-8 text-center space-y-2">
                    <h3 className="text-2xl font-sora font-semibold text-foreground flex items-center justify-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      Processing Document
                    </h3>
                    <p className="text-muted-foreground font-inter max-w-sm mx-auto">
                      Running deep AI analysis against thousands of successful applicant profiles...
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center text-center w-full h-full z-10 relative"
                >
                  {/* Background Accents */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

                  <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 shadow-xl relative
                    ${isDragActive ? 'bg-primary text-white scale-110 shadow-primary/40 rotate-6' : 'bg-card border border-border text-primary group-hover:shadow-primary/20'}
                  `}>
                    {isDragActive ? <UploadCloud className="w-10 h-10" /> : <FileText className="w-10 h-10" />}
                    {!isDragActive && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center border-4 border-card">
                        <ArrowRight className="w-4 h-4 text-white -rotate-45" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-3xl font-sora font-bold text-foreground mb-3 tracking-tight">
                    {isDragActive ? "Engage Optimization" : "Select PDF Resume"}
                  </h3>
                  <p className="text-muted-foreground font-inter text-base max-w-xs mb-8">
                    Drag and drop your document here, or click to browse files locally.
                  </p>
                  
                  <div className="px-8 py-3.5 rounded-full bg-foreground text-background font-semibold font-inter shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                    <UploadCloud className="w-5 h-5" />
                    Browse Files
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground px-6 py-2.5 rounded-full shadow-lg font-medium text-sm flex items-center gap-2 z-50 whitespace-nowrap"
              >
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                {error}
              </motion.div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: VISUAL STORYTELLING */}
        <div className="lg:col-span-5 flex flex-col justify-center h-full pt-8 lg:pt-0">
          <div className="mb-10">
            <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-2">The Process</h2>
            <h3 className="text-2xl font-sora font-semibold text-foreground">How we optimize your profile</h3>
          </div>

          <motion.div variants={container} initial="hidden" animate="show" className="relative space-y-8">
            {/* Vertical Line Connector */}
            <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-primary/50 via-secondary/30 to-transparent -z-10 hidden md:block" />

            {PIPELINE_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = isUploading && index <= 1; // Highlight first two steps during upload
              
              return (
                <motion.div key={step.id} variants={itemAnim} className="flex gap-6 items-start group">
                  <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm
                    ${isActive ? "bg-primary text-white scale-110 shadow-primary/30" : `bg-card border border-border ${step.color} group-hover:scale-105`}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="pt-1">
                    <h4 className={`font-semibold font-inter text-lg transition-colors duration-300 mb-1
                      ${isActive ? "text-primary" : "text-foreground group-hover:text-primary"}
                    `}>
                      {step.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Value Prop Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20 flex gap-4 items-start"
          >
            <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-foreground mb-1 text-sm">Top 10% Candidate Advantage</h5>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Profiles optimized through our engine see a 3x higher interview conversion rate compared to raw unformatted submissions.
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
