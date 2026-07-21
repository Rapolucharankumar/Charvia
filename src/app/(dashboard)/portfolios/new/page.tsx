"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Wand2, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function NewPortfolioPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    resumeId: "",
    theme: "minimal",
  });

  useEffect(() => {
    // Fetch user's resumes
    async function fetchResumes() {
      try {
        const res = await fetch("/api/resumes");
        if (res.ok) {
          const data = await res.json();
          setResumes(data.resumes || data || []);
        }
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResumes();
  }, []);

  const handleGenerate = async () => {
    if (!formData.username) {
      toast.error("Please enter a username");
      return;
    }
    if (!formData.resumeId) {
      toast.error("Please select a resume");
      return;
    }

    setIsGenerating(true);
    
    try {
      // 1. Enhance the resume via AI
      toast.loading("AI is enhancing your resume content...", { id: "generate" });
      const enhanceRes = await fetch("/api/portfolio/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: formData.resumeId })
      });
      
      if (!enhanceRes.ok) {
        throw new Error("Failed to enhance resume");
      }
      
      const enhancedData = await enhanceRes.json();
      
      // 2. Create the portfolio with the enhanced data
      toast.loading("Creating your portfolio...", { id: "generate" });
      const createRes = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          theme: formData.theme,
          resumeId: formData.resumeId,
          // We can pass the enhanced data here in a real implementation
          // Or update the sections right after creation
        })
      });

      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.error || "Failed to create portfolio");
      }
      
      const portfolio = await createRes.json();
      
      toast.success("Portfolio created successfully!", { id: "generate" });
      router.push(`/portfolios/${portfolio.id}/editor`);
      
    } catch (error: any) {
      toast.error(error.message || "An error occurred", { id: "generate" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            Generate AI Portfolio
          </CardTitle>
          <CardDescription>
            Select an existing resume to automatically extract data, enhance it with AI, and generate a stunning portfolio.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Portfolio URL</Label>
            <div className="flex items-center">
              <Input 
                id="username" 
                placeholder="johndoe" 
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                className="rounded-r-none"
              />
              <div className="bg-muted px-4 py-2 border border-l-0 rounded-r-md text-sm text-muted-foreground whitespace-nowrap">
                .charvia.app
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Only letters, numbers, and hyphens.</p>
          </div>

          <div className="space-y-2">
            <Label>Select Resume Data Source</Label>
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading resumes...
              </div>
            ) : resumes.length > 0 ? (
              <Select 
                value={formData.resumeId} 
                onValueChange={(val) => setFormData({ ...formData, resumeId: val || "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map(r => (
                    <SelectItem key={r.id} value={r.id}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {r.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="p-4 border border-dashed rounded-md bg-muted/30 text-center">
                <p className="text-sm text-muted-foreground mb-2">You don't have any resumes yet.</p>
                <Button variant="outline" size="sm" onClick={() => router.push('/resumes/new')}>
                  Create a Resume first
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Starting Theme</Label>
            <Select 
              value={formData.theme} 
              onValueChange={(val) => setFormData({ ...formData, theme: val || "minimal" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal (Clean & Simple)</SelectItem>
                <SelectItem value="developer">Developer (Dark & Technical)</SelectItem>
                <SelectItem value="creative">Creative (Bold & Colorful)</SelectItem>
                <SelectItem value="cyberpunk">Cyberpunk (Neon & Futuristic)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">You can always change the theme later in the editor.</p>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/20 border-t px-6 py-4">
          <Button 
            className="w-full gap-2" 
            size="lg"
            onClick={handleGenerate}
            disabled={isGenerating || !formData.username || !formData.resumeId}
          >
            {isGenerating ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Magic is happening...</>
            ) : (
              <>Generate with AI <ArrowRight className="h-5 w-5" /></>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
