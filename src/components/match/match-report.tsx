"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Lightbulb, Wand2, TrendingUp, Download, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ResumePDF } from "@/components/resumes/resume-pdf";

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then(mod => mod.PDFViewer), { ssr: false });
const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then(mod => mod.PDFDownloadLink), { ssr: false });

interface MatchReportProps {
  report: {
    matchScore: number;
    missingSkills: string[];
    strongSkills: string[];
    improvementSuggestions: string[];
    potentialMatchScore?: number;
    resumeChangesApplied?: string[];
    optimizedResume?: any;
    originalFileUrl?: string;
  };
}

export function MatchReport({ report }: MatchReportProps) {
  const { 
    matchScore, 
    missingSkills, 
    strongSkills, 
    improvementSuggestions,
    potentialMatchScore,
    resumeChangesApplied,
    optimizedResume,
    originalFileUrl
  } = report;

  const [compareMode, setCompareMode] = useState<"optimized" | "side-by-side">("optimized");

  const scoreColor = 
    matchScore >= 80 ? "text-green-500" : 
    matchScore >= 60 ? "text-amber-500" : "text-destructive";

  const progressColor =
    matchScore >= 80 ? "bg-green-500" :
    matchScore >= 60 ? "bg-amber-500" : "bg-destructive";

  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-2xl font-bold tracking-tight">Match Results</h3>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Match Score Card */}
        <Card className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-card/50 relative overflow-hidden">
          {potentialMatchScore && (
            <div className="absolute -right-10 -top-10 h-32 w-32 bg-primary/5 rounded-full blur-2xl" />
          )}
          <CardTitle className="text-xl mb-4 text-muted-foreground">Match Score</CardTitle>
          <div className="text-6xl font-extrabold mb-4 flex items-center justify-center w-full">
            {potentialMatchScore ? (
              <div className="flex flex-col items-center w-full">
                <div className="flex items-center justify-center gap-3">
                  <span className={`${scoreColor} line-through opacity-50 text-4xl`}>{matchScore}</span>
                  <TrendingUp className="h-6 w-6 text-green-500" />
                  <span className="text-primary">{potentialMatchScore}</span>
                </div>
                <span className="text-sm text-green-500 font-medium mt-2 bg-green-500/10 px-3 py-1 rounded-full">Potential Score</span>
              </div>
            ) : (
              <>
                <span className={scoreColor}>{matchScore}</span>
                <span className="text-3xl text-muted-foreground">/100</span>
              </>
            )}
          </div>
          {!potentialMatchScore && (
             <Progress value={matchScore} className={`h-3 w-full [&>div]:${progressColor}`} />
          )}
        </Card>

        {/* Strong Skills */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Strong Skills Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            {strongSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No significant matching skills found.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {strongSkills.map((skill, i) => (
                  <Badge key={i} variant="default" className="px-3 py-1 bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Missing Skills */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Missing Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            {missingSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">You match all the required skills!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill, i) => (
                  <Badge key={i} variant="destructive" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Improvement Suggestions & Changes Applied */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              {resumeChangesApplied ? (
                <>
                  <Wand2 className="h-5 w-5 text-primary" />
                  AI Resume Changes Applied
                </>
              ) : (
                <>
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Improvement Suggestions
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(resumeChangesApplied || improvementSuggestions).map((item, i) => (
                <li key={i} className="text-sm flex items-start gap-2 bg-muted/50 p-3 rounded-md">
                  {resumeChangesApplied && <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />}
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Optimized Resume Preview Section */}
      {optimizedResume && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border rounded-xl bg-card overflow-hidden flex flex-col mt-8"
        >
          <div className="p-4 border-b bg-muted/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Optimized Resume Preview
              </h4>
              <p className="text-sm text-muted-foreground">Tailored for this job description. Ready to download.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {originalFileUrl && (
                <Button 
                  variant="outline" 
                  onClick={() => setCompareMode(mode => mode === "optimized" ? "side-by-side" : "optimized")}
                  className="flex-1 sm:flex-none"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {compareMode === "optimized" ? "Compare Original" : "Show Optimized Only"}
                </Button>
              )}
              
              <PDFDownloadLink 
                document={<ResumePDF data={optimizedResume} />} 
                fileName="Optimized_Resume.pdf"
                className="flex-1 sm:flex-none"
              >
                {/* @ts-ignore - render props children type issue in PDFDownloadLink */}
                {({ loading }: { loading: boolean }) => (
                  <Button disabled={loading} variant="default" className="w-full">
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-transparent mr-2" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Download PDF
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          </div>
          
          <div className={`h-[800px] w-full bg-muted/10 p-4 grid gap-4 ${compareMode === "side-by-side" ? "grid-cols-2" : "grid-cols-1"}`}>
            {compareMode === "side-by-side" && originalFileUrl && (
              <div className="flex flex-col h-full border rounded shadow-sm bg-white overflow-hidden">
                <div className="bg-muted p-2 text-center text-sm font-semibold border-b">Original Resume</div>
                <iframe src={`${originalFileUrl}#toolbar=0`} className="w-full flex-1 border-0" />
              </div>
            )}
            
            <div className="flex flex-col h-full border rounded shadow-sm bg-white overflow-hidden">
              {compareMode === "side-by-side" && (
                <div className="bg-primary/10 text-primary p-2 text-center text-sm font-semibold border-b flex items-center justify-center gap-2">
                  <Wand2 className="h-4 w-4" /> Optimized Version
                </div>
              )}
              <PDFViewer width="100%" height="100%" className="flex-1 border-0">
                <ResumePDF data={optimizedResume} />
              </PDFViewer>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
