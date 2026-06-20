"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createSelfIntroduction } from "../actions";
import { Loader2 } from "lucide-react";

export function IntroForm() {
  const router = useRouter();
  
  const [inputs, setInputs] = useState({
    name: "",
    degree: "",
    college: "",
    skills: "",
    projects: ""
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.name || !inputs.degree || !inputs.skills) {
      setError("Please fill out at least your name, degree, and skills.");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      const intro = await createSelfIntroduction(inputs);
      router.push(`/intro/${intro.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate introduction");
      setIsGenerating(false);
    }
  };

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Create Self Introduction</CardTitle>
        <CardDescription>
          Provide your background details to generate professional 30-second, 1-minute, HR, and technical pitches.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input 
                id="name" 
                placeholder="e.g. John Doe" 
                value={inputs.name}
                onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree">Degree / Major *</Label>
              <Input 
                id="degree" 
                placeholder="e.g. B.S. Computer Science" 
                value={inputs.degree}
                onChange={(e) => setInputs({ ...inputs, degree: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="college">College / University</Label>
            <Input 
              id="college" 
              placeholder="e.g. Stanford University" 
              value={inputs.college}
              onChange={(e) => setInputs({ ...inputs, college: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Key Skills *</Label>
            <Textarea 
              id="skills" 
              placeholder="e.g. React, Next.js, Node.js, Team Leadership" 
              value={inputs.skills}
              onChange={(e) => setInputs({ ...inputs, skills: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projects">Key Projects</Label>
            <Textarea 
              id="projects" 
              placeholder="e.g. Built an AI SaaS platform with 10k MRR, Led migration from Vue to React" 
              value={inputs.projects}
              onChange={(e) => setInputs({ ...inputs, projects: e.target.value })}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isGenerating} className="w-full md:w-auto">
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isGenerating ? "Generating Pitches..." : "Generate Introduction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
