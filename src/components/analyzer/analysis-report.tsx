"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb } from "lucide-react";

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
  const { atsScore, missingKeywords, strengths, weaknesses, suggestions } = analysis.feedback;

  const scoreColor = 
    atsScore >= 80 ? "text-green-500" : 
    atsScore >= 60 ? "text-amber-500" : "text-destructive";

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Score Card */}
        <Card className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-card/50">
          <CardTitle className="text-xl mb-4 text-muted-foreground">Overall ATS Score</CardTitle>
          <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                className="text-muted/20"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
              <circle
                className={scoreColor}
                strokeWidth="10"
                strokeDasharray={364}
                strokeDashoffset={364 - (364 * atsScore) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
            </svg>
            <span className={`absolute text-4xl font-bold ${scoreColor}`}>
              {atsScore}
            </span>
          </div>
        </Card>

        {/* Missing Keywords */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Missing Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            {missingKeywords.length === 0 ? (
              <p className="text-sm text-muted-foreground">Your resume has excellent keyword coverage!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((keyword, i) => (
                  <Badge key={i} variant="secondary" className="px-3 py-1">
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Strengths */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {strengths.map((item, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {weaknesses.map((item, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Actionable Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {suggestions.map((item, i) => (
              <li key={i} className="text-sm flex items-start gap-2 bg-muted/50 p-3 rounded-md">
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
