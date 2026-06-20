"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveResumeMetadata } from "@/app/(dashboard)/resumes/actions";
import { Button } from "@/components/ui/button";

export function ResumeUploadZone() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    // Ensure it's a PDF
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported");
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

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error("Failed to upload file: " + uploadError.message);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("resumes")
        .getPublicUrl(filePath);

      // Save to database
      await saveResumeMetadata(file.name, publicUrl);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          {isUploading ? (
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          ) : isDragActive ? (
            <UploadCloud className="h-10 w-10 text-primary animate-bounce" />
          ) : (
            <File className="h-10 w-10 text-muted-foreground" />
          )}
          
          <div className="space-y-1">
            <p className="text-lg font-medium">
              {isUploading 
                ? "Uploading your resume..." 
                : isDragActive 
                  ? "Drop the PDF here" 
                  : "Click or drag your resume here"}
            </p>
            <p className="text-sm text-muted-foreground">
              Supports PDF files up to 5MB
            </p>
          </div>
          
          {!isUploading && !isDragActive && (
            <Button variant="secondary" size="sm" className="mt-2">
              Select File
            </Button>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-3 text-sm text-destructive text-center font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
