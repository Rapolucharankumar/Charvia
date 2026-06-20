"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { createApplication } from "./actions";
import { ApplicationStatus } from "@prisma/client";
import { Loader2 } from "lucide-react";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialStatus?: ApplicationStatus;
}

export function ApplicationModal({ isOpen, onClose, onSuccess, initialStatus = "APPLIED" }: ApplicationModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !jobTitle) return;

    try {
      setIsLoading(true);
      await createApplication({ companyName, jobTitle, status });
      onSuccess();
      setCompanyName("");
      setJobTitle("");
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Job Application</DialogTitle>
          <DialogDescription>Track a new application in your pipeline.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input 
              id="companyName" 
              placeholder="e.g. Google" 
              value={companyName} 
              onChange={(e) => setCompanyName(e.target.value)} 
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input 
              id="jobTitle" 
              placeholder="e.g. Frontend Engineer" 
              value={jobTitle} 
              onChange={(e) => setJobTitle(e.target.value)} 
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Stage</Label>
            <Select value={status} onValueChange={(val) => setStatus(val as ApplicationStatus)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APPLIED">Applied</SelectItem>
                <SelectItem value="ASSESSMENT">Assessment</SelectItem>
                <SelectItem value="INTERVIEW">Interview</SelectItem>
                <SelectItem value="HR_ROUND">HR Round</SelectItem>
                <SelectItem value="OFFER">Offer</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
