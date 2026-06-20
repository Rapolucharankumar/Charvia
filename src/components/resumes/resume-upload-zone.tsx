"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveResumeMetadata } from "@/app/(dashboard)/resumes/actions";
import { motion, AnimatePresence } from "framer-motion";

export function ResumeUploadZone() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    if (file.type !== "application/pdf") {
      setError("Please ensure your document is in PDF format.");
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
        throw new Error("Failed to process document: " + uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from("resumes")
        .getPublicUrl(filePath);

      // Simulate the editorial narrative delay
      await new Promise(resolve => setTimeout(resolve, 2500));

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

  return (
    <div className="w-full max-w-4xl mx-auto py-12 md:py-24">
      <div className="mb-16">
        <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400 font-bold mb-6">The Studio</h2>
        <h1 className="text-4xl md:text-6xl font-playfair font-black text-slate-900 leading-[1.1] tracking-tight max-w-2xl">
          Bring us your raw potential. We'll craft the narrative.
        </h1>
        <p className="text-lg text-slate-500 mt-6 font-inter leading-relaxed max-w-lg">
          Upload your foundational resume. Our AI engine will dismantle it, analyze it against industry standards, and rebuild it into a compelling story.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`w-full relative min-h-[300px] rounded-none border-t border-b py-16 transition-all duration-700 cursor-pointer flex flex-col items-center justify-center group
          ${isDragActive ? "border-slate-900 bg-slate-50/50" : "border-slate-200 hover:border-slate-400"}
          ${isUploading ? "pointer-events-none opacity-80" : ""}
        `}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center max-w-md mx-auto"
            >
              <Loader2 className="w-8 h-8 text-slate-900 animate-spin mb-6" strokeWidth={1} />
              <h3 className="text-2xl font-playfair font-bold text-slate-900 mb-2">Analyzing the narrative...</h3>
              <p className="text-slate-500 font-inter text-sm">Extracting key competencies and aligning with applicant tracking systems.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center max-w-md mx-auto"
            >
              <div className="w-16 h-16 mb-8 flex items-center justify-center rounded-full border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 text-slate-400 group-hover:scale-110">
                <ArrowRight className="w-6 h-6 rotate-90" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-slate-900 mb-2">
                {isDragActive ? "Release to drop" : "Select or drop a PDF document"}
              </h3>
              <p className="text-slate-500 font-inter text-sm tracking-wide">
                Strictly PDF format to ensure parser accuracy.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2"
          >
            <p className="text-sm font-medium text-red-500 tracking-wide">{error}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
