"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";

interface MatchReportProps {
  report: {
    matchScore: number;
    missingSkills: string[];
    strongSkills: string[];
    improvementSuggestions: string[];
  };
}

export function MatchReport({ report }: MatchReportProps) {
  const { matchScore, missingSkills, strongSkills, improvementSuggestions } = report;

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
        <Card className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-card/50">
          <CardTitle className="text-xl mb-4 text-muted-foreground">Match Score</CardTitle>
          <div className="text-6xl font-extrabold mb-4">
            <span className={scoreColor}>{matchScore}</span>
            <span className="text-3xl text-muted-foreground">/100</span>
          </div>
          <Progress value={matchScore} className={`h-3 w-full [&>div]:${progressColor}`} />
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

        {/* Improvement Suggestions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {improvementSuggestions.map((item, i) => (
                <li key={i} className="text-sm flex items-start gap-2 bg-muted/50 p-3 rounded-md">
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
