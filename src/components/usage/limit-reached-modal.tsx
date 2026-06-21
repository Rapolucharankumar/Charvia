"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export function LimitReachedModal({ isOpen, onClose, feature = "this feature" }: LimitReachedModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 border-none bg-transparent">
        <div className="glass-card flex flex-col p-8 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
          
          <DialogHeader className="relative z-10 space-y-4 text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-sora font-semibold text-foreground">
              You've reached your free limit
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground font-inter">
              You have used all available free credits for {feature}. Charvia Pro will unlock unlimited access in the future.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="relative z-10 flex flex-col sm:flex-col gap-3 sm:space-x-0 pt-2">
            <Link href="/pro" className={cn(buttonVariants({ size: "lg" }), "w-full text-base py-6 rounded-xl shadow-lg")}>
              Join Early Access
            </Link>
            <Button 
              variant="ghost" 
              className="w-full text-muted-foreground hover:text-foreground" 
              onClick={onClose}
            >
              Maybe Later
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
