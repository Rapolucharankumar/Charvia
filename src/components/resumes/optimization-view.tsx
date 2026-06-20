"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, Download, CheckCircle2, TrendingUp } from "lucide-react";
import { generateOptimization } from "@/app/(dashboard)/resumes/[id]/actions";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { ResumePDF } from "./resume-pdf";
import { motion } from "framer-motion";

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then(mod => mod.PDFViewer), { ssr: false });
const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then(mod => mod.PDFDownloadLink), { ssr: false });

interface OptimizationViewProps {
  resumeId: string;
  jobDescriptionId?: string;
  existingOptimization?: any; // The latest ResumeOptimization from Prisma
}

export function OptimizationView({ resumeId, jobDescriptionId, existingOptimization }: OptimizationViewProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationData, setOptimizationData] = useState(existingOptimization);

  const handleOptimize = async () => {
    try {
      setIsOptimizing(true);
      const result = await generateOptimization(resumeId, jobDescriptionId);
      setOptimizationData(result);
      toast.success("Resume optimized successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to optimize resume");
    } finally {
      setIsOptimizing(false);
    }
  };

  if (!optimizationData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-card">
        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Wand2 className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Auto-Optimize with AI</h3>
        <p className="text-muted-foreground mb-8 max-w-md">
          Let our advanced AI rewrite your resume bullet points, strengthen action verbs, and structure it for maximum ATS compliance.
        </p>
        <Button 
          onClick={handleOptimize} 
          disabled={isOptimizing} 
          size="lg"
          className="relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          {isOptimizing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Optimizing your resume...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              Generate Optimized Resume
            </>
          )}
        </Button>
      </div>
    );
  }

  const { originalScore, newScore, changeSummary, optimizedContent } = optimizationData;
  const scoreIncrease = newScore - originalScore;

  return (
    <div className="space-y-8">
      {/* Score Comparison Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 border rounded-xl p-6 bg-card flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 h-32 w-32 bg-primary/10 rounded-full blur-2xl" />
          <h4 className="text-sm font-medium text-muted-foreground mb-2">ATS Score Increase</h4>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-muted-foreground line-through">{originalScore}</div>
            <TrendingUp className="h-6 w-6 text-green-500" />
            <div className="text-5xl font-black text-primary">{newScore}</div>
          </div>
          <p className="text-sm font-medium text-green-500 mt-2">+{scoreIncrease} points</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 md:col-span-2 border rounded-xl p-6 bg-card"
        >
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            AI Improvements Made
          </h4>
          <ul className="space-y-3">
            {changeSummary.map((change: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{change}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* PDF Viewer & Download */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border rounded-xl bg-card overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
          <div>
            <h4 className="font-semibold">Optimized Resume Preview</h4>
            <p className="text-sm text-muted-foreground">Ready to download and submit.</p>
          </div>
          
          <PDFDownloadLink 
            document={<ResumePDF data={optimizedContent} />} 
            fileName="Optimized_Resume.pdf"
          >
            {({ loading }) => (
              <Button disabled={loading} variant="default">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download PDF
              </Button>
            )}
          </PDFDownloadLink>
        </div>
        
        <div className="h-[800px] w-full bg-muted/10 p-4">
          <PDFViewer width="100%" height="100%" className="rounded shadow-sm border-0">
            <ResumePDF data={optimizedContent} />
          </PDFViewer>
        </div>
      </motion.div>
    </div>
  );
}
