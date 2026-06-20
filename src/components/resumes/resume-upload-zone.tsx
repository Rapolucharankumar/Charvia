"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, UploadCloud, FileText } from "lucide-react";
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

      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));

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
    <div className="w-full max-w-5xl mx-auto py-12 px-4 md:px-8">
      
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-playfair font-semibold text-foreground tracking-tight mb-4">
          Resume Studio
        </h1>
        <p className="text-muted-foreground font-inter text-lg">
          Upload your resume for a comprehensive AI-driven analysis.
        </p>
      </div>

      <div className="glass-card p-2 md:p-8">
        <div
          {...getRootProps()}
          className={`w-full relative min-h-[400px] rounded-2xl border-2 transition-all duration-300 ease-out cursor-pointer flex flex-col items-center justify-center
            ${isDragActive ? "border-primary bg-primary/5" : "border-dashed border-border hover:border-primary/50 hover:bg-muted/50"}
            ${isUploading ? "pointer-events-none opacity-80" : ""}
          `}
        >
          <input {...getInputProps()} />

          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div 
                key="uploading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center text-center max-w-md mx-auto"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-inter font-semibold text-foreground mb-3">Analyzing document...</h3>
                <p className="text-muted-foreground font-inter text-sm tracking-wide">Evaluating formatting, keywords, and structural integrity against ATS benchmarks.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-16"
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 transition-colors duration-300 ${isDragActive ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}`}>
                  {isDragActive ? <UploadCloud className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-inter font-semibold text-foreground mb-3">
                  {isDragActive ? "Drop to upload" : "Click or drag document here"}
                </h3>
                <p className="text-muted-foreground font-inter text-sm">
                  We only accept <span className="font-semibold text-foreground">PDF</span> format to ensure accurate parsing.
                </p>
                <div className="mt-8 px-6 py-2 rounded-full bg-primary text-white text-sm font-medium shadow-sm transition-transform hover:scale-105">
                  Browse Files
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-destructive/10 px-4 py-2 rounded-lg"
            >
              <p className="text-sm font-medium text-destructive">{error}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
