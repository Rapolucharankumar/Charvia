"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateMatchScore } from "./actions";
import { MatchReport } from "@/components/match/match-report";
import { Loader2 } from "lucide-react";

interface MatchClientProps {
  resumes: { id: string; title: string }[];
}

export function MatchClient({ resumes }: MatchClientProps) {
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  
  const [isMatching, setIsMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResume || !companyName || !jobTitle || !jobDescription) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setIsMatching(true);
      setError(null);
      setMatchResult(null);

      const result = await generateMatchScore(
        selectedResume,
        companyName,
        jobTitle,
        jobDescription
      );

      setMatchResult(result.details);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate match score");
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Calculate Match Score</CardTitle>
          <CardDescription>
            Select a resume and paste a job description to see how well you match.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="resume">Select Resume</Label>
              <Select value={selectedResume} onValueChange={(val) => setSelectedResume(val || "")}>
                <SelectTrigger id="resume">
                  <SelectValue placeholder="Select a resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((resume) => (
                    <SelectItem key={resume.id} value={resume.id}>
                      {resume.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName" 
                  placeholder="e.g. Google" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input 
                  id="jobTitle" 
                  placeholder="e.g. Software Engineer" 
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea 
                id="jobDescription" 
                placeholder="Paste the full job description here..." 
                className="min-h-[200px]"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={isMatching} className="w-full md:w-auto">
              {isMatching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isMatching ? "Calculating Match..." : "Calculate Match"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {matchResult && <MatchReport report={matchResult} />}
    </div>
  );
}
