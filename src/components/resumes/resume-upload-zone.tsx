"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2 } from "lucide-react";
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

      // Delicate editorial narrative delay
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

  return (
    <div className="w-full max-w-4xl mx-auto py-24 px-4 md:px-12">
      <div className="mb-24 text-center md:text-left">
        <h2 className="text-xs uppercase tracking-[0.4em] text-stone-400 font-light mb-8">The Studio</h2>
        <h1 className="text-5xl md:text-7xl font-playfair font-light text-stone-900 leading-[1.1] tracking-tight max-w-3xl">
          Your next opportunity begins with a better resume.
        </h1>
        <div className="mt-12 w-12 h-[1px] bg-stone-300 mx-auto md:mx-0" />
      </div>

      <div
        {...getRootProps()}
        className={`w-full relative min-h-[400px] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer flex flex-col items-center justify-center
          ${isDragActive ? "bg-stone-100/50" : "hover:bg-stone-50/50"}
          ${isUploading ? "pointer-events-none opacity-90" : ""}
        `}
      >
        {/* Extremely delicate dotted border that only appears gently on hover or drag */}
        <div className={`absolute inset-0 border border-stone-300 transition-all duration-1000 ${isDragActive ? 'border-solid border-stone-400' : 'border-dashed opacity-0 hover:opacity-100'}`} />

        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center text-center max-w-md mx-auto"
            >
              <Loader2 className="w-6 h-6 text-stone-400 animate-spin mb-10" strokeWidth={1} />
              <h3 className="text-3xl font-playfair font-light italic text-stone-900 mb-6">Reviewing the narrative...</h3>
              <p className="text-stone-500 font-inter text-sm font-light tracking-wide">Evaluating structural integrity against industry benchmarks.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-16"
            >
              <h3 className="text-3xl font-playfair font-light text-stone-900 mb-6">
                {isDragActive ? "Release to submit." : "Select or drop your document here."}
              </h3>
              <p className="text-stone-400 font-inter text-xs uppercase tracking-[0.2em] font-light">
                PDF format is required.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <p className="text-xs uppercase tracking-[0.2em] font-light text-red-800">{error}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
