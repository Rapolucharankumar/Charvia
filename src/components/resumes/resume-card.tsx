"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FileText, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { deleteResume } from "@/app/(dashboard)/resumes/actions";

interface ResumeCardProps {
  id: string;
  title: string;
  createdAt: Date;
  fileUrl: string | null;
}

export function ResumeCard({ id, title, createdAt, fileUrl }: ResumeCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteResume(id, fileUrl);
    } catch (error) {
      console.error("Failed to delete resume:", error);
      setIsDeleting(false);
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2 border-b bg-muted/20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="p-2 bg-primary/10 rounded-md shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-base truncate" title={title}>
                {title}
              </h3>
              <p className="text-xs text-muted-foreground">
                Uploaded {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-4">
        {/* Placeholder for future resume analysis summary or status */}
        <div className="flex items-center justify-center h-20 text-sm text-muted-foreground bg-muted/10 rounded-md border border-dashed">
          Ready for analysis
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2 flex-wrap">
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1 flex items-center gap-2"
          onClick={() => window.location.href = `/resumes/${id}`}
        >
          Analyze
        </Button>
        {fileUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => window.open(fileUrl, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
        <Button 
          variant="destructive" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
