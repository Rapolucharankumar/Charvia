"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Captured:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <h2 className="text-3xl font-bold mb-4">Critical System Failure</h2>
        <p className="text-muted-foreground mb-8">
          A fatal error occurred at the layout level.
        </p>
        <Button onClick={() => reset()} variant="default">
          Restart Application
        </Button>
      </body>
    </html>
  );
}
