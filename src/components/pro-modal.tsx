"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProModal({ isOpen, onClose }: ProModalProps) {
  const [step, setStep] = useState<"marketing" | "form" | "success">("marketing");
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    graduationYear: "",
  });

  const handleJoinList = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to join waitlist");
      }

      setStep("success");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => setStep("marketing"), 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-white/10 bg-background/80 backdrop-blur-3xl shadow-2xl">
        
        {/* Animated Background Mesh for Modal */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent opacity-50 -z-10" />

        <AnimatePresence mode="wait">
          {step === "marketing" && (
            <motion.div
              key="marketing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="p-6 flex flex-col items-center text-center relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-xl relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-glow" />
                <Lock className="w-8 h-8 text-primary relative z-10" />
              </div>

              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Charvia Pro
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  We're building advanced tools to help students land better jobs faster.
                </DialogDescription>
              </DialogHeader>

              <div className="w-full space-y-3 my-8 text-left bg-black/20 p-4 rounded-xl border border-white/5">
                {[
                  "Unlimited Resume Analysis",
                  "Unlimited Interview Practice",
                  "Premium ATS Templates",
                  "AI Career Guidance",
                  "Priority Support",
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-sm text-foreground/90">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col w-full gap-3">
                <Button 
                  onClick={() => setStep("form")} 
                  className="w-full h-12 text-md shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.5)] transition-all group"
                >
                  Join Early Access <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="ghost" onClick={handleClose} className="w-full">
                  Maybe Later
                </Button>
              </div>
            </motion.div>
          )}

          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-6"
            >
              <DialogHeader className="mb-6">
                <DialogTitle className="text-xl">Secure your spot</DialogTitle>
                <DialogDescription>
                  Enter your details to get early access to Charvia Pro when it launches.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleJoinList} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    required 
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-black/20 border-white/10 focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    placeholder="john@university.edu" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-black/20 border-white/10 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college">College / University</Label>
                  <Input 
                    id="college" 
                    required 
                    placeholder="Stanford University" 
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="bg-black/20 border-white/10 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Graduation Year</Label>
                  <Input 
                    id="year" 
                    required 
                    placeholder="2025" 
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    className="bg-black/20 border-white/10 focus:border-primary"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setStep("marketing")} className="w-1/3">
                    Back
                  </Button>
                  <Button type="submit" disabled={loading} className="w-2/3">
                    {loading ? "Saving..." : "Join Waitlist"}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 flex flex-col items-center text-center space-y-6 py-16"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">You're on the list!</h3>
                <p className="text-muted-foreground">
                  We'll notify you as soon as Charvia Pro is ready. Stay tuned!
                </p>
              </div>
              <Button onClick={handleClose} className="w-full mt-4">
                Return to Dashboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

      </DialogContent>
    </Dialog>
  );
}
