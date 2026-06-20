"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle, Loader2 } from "lucide-react";
import { generateAnalysis } from "./actions";

interface AnalyzeButtonProps {
  resumeId: string;
  isAnalyzingDisabled?: boolean;
}

export function AnalyzeButton({ resumeId, isAnalyzingDisabled }: AnalyzeButtonProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);
      await generateAnalysis(resumeId);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze resume");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Button 
        onClick={handleAnalyze} 
        disabled={isAnalyzing || isAnalyzingDisabled}
        className="flex items-center gap-2"
      >
        {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
        {isAnalyzing ? "Analyzing via AI..." : "Run New Analysis"}
      </Button>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
