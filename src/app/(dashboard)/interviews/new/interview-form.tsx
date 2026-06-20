"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createInterviewPrep } from "../actions";
import { Loader2 } from "lucide-react";

export function InterviewForm() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role || !experience) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      const session = await createInterviewPrep(company, role, experience);
      router.push(`/dashboard/interviews/${session.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate interview prep guide");
      setIsGenerating(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Create Interview Prep Guide</CardTitle>
        <CardDescription>
          Enter the company and role details to generate targeted practice questions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input 
              id="company" 
              placeholder="e.g. Google, Amazon, Local Startup" 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Job Role</Label>
            <Input 
              id="role" 
              placeholder="e.g. Frontend Engineer, Product Manager" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience Level</Label>
            <Select value={experience} onValueChange={(val) => setExperience(val || "")}>
              <SelectTrigger id="experience">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Intern">Intern</SelectItem>
                <SelectItem value="Entry Level / Junior">Entry Level / Junior</SelectItem>
                <SelectItem value="Mid Level">Mid Level</SelectItem>
                <SelectItem value="Senior Level">Senior Level</SelectItem>
                <SelectItem value="Lead / Manager">Lead / Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isGenerating} className="w-full">
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isGenerating ? "Generating Guide via AI..." : "Generate Guide"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
