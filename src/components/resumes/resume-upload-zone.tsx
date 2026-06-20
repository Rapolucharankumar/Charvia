"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, Loader2, FileCheck2, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveResumeMetadata } from "@/app/(dashboard)/resumes/actions";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function ResumeUploadZone() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF document for best results.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError || !session?.user) throw new Error("Authentication required");

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error("Failed to upload file: " + uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from("resumes")
        .getPublicUrl(filePath);

      // Simulate a slightly longer processing time for cinematic UI feel
      await new Promise(resolve => setTimeout(resolve, 2000));

      await saveResumeMetadata(file.name, publicUrl);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
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
    <div className="w-full relative h-[400px] rounded-3xl overflow-hidden glass-card">
      <div
        {...getRootProps()}
        className={`w-full h-full p-8 md:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300
          ${isDragActive ? "bg-primary/5 border-primary" : "bg-transparent"}
          ${isUploading ? "opacity-90 cursor-not-allowed" : ""}
        `}
      >
        {/* Dashed Border Overlay */}
        <div className={`absolute inset-4 rounded-[2rem] border-2 border-dashed transition-colors duration-300 pointer-events-none ${isDragActive ? "border-primary bg-primary/5" : "border-slate-200"}`} />

        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center gap-6 relative z-10"
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
                <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-100">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold tracking-tight text-slate-900 flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> Optimizing Resume
                </p>
                <p className="text-sm font-medium text-slate-500 max-w-sm">
                  Our system is analyzing your document, extracting keywords, and scoring it against industry-standard ATS algorithms.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center gap-6 relative z-10"
            >
              <div className={`p-6 rounded-2xl transition-all duration-500 shadow-sm border border-slate-100 bg-white ${isDragActive ? "scale-110 shadow-lg shadow-primary/20 border-primary/30" : "hover:scale-105"}`}>
                {isDragActive ? (
                  <FileCheck2 className="h-10 w-10 text-primary" />
                ) : (
                  <UploadCloud className="h-10 w-10 text-slate-400" />
                )}
              </div>
              
              <div className="space-y-3">
                <p className="text-2xl font-bold tracking-tight text-slate-900">
                  {isDragActive 
                    ? "Drop your PDF here" 
                    : "Upload your resume"}
                </p>
                <p className="text-base text-slate-500 font-medium max-w-sm mx-auto">
                  Drag and drop your PDF here, or click to browse. We'll instantly process and score your profile.
                </p>
              </div>
              
              <Button size="lg" className="mt-4 rounded-xl font-semibold shadow-sm hover:shadow-md transition-shadow">
                Browse Files
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-8 px-6 py-3 rounded-xl bg-red-50 border border-red-200 shadow-sm z-20"
          >
            <p className="text-sm text-red-600 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" /> {error}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
