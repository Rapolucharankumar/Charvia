"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Shield, Rocket } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function ProPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    graduationYear: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to join waitlist");
      }

      setIsJoined(true);
      toast.success("You're on the waitlist!", {
        description: "We'll notify you when Charvia Pro is ready.",
      });
    } catch (err) {
      toast.error("Something went wrong.", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#5143d9]/20 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Navbar (simple) */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link href="/" className="text-2xl font-sora font-bold text-foreground">
          Charvia
        </Link>
        <Link href="/dashboard" className={buttonVariants({ variant: "ghost" })}>Back to Dashboard</Link>
      </nav>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 z-10">
        
        {/* Left Content */}
        <motion.div 
          variants={container} 
          initial="hidden" 
          animate="show" 
          className="flex flex-col justify-center"
        >
          <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit mb-6 text-sm font-semibold tracking-wider uppercase">
            <Sparkles className="w-4 h-4" /> Coming Soon
          </motion.div>
          
          <motion.h1 variants={item} className="text-5xl md:text-6xl font-sora font-semibold tracking-tight text-foreground mb-6 leading-tight">
            Unlock your full <br/> career potential.
          </motion.h1>
          
          <motion.p variants={item} className="text-lg text-muted-foreground font-inter mb-10 max-w-lg leading-relaxed">
            Charvia Pro gives you unlimited access to our most powerful AI tools. Join the early access waitlist to be the first to know when we launch, and lock in exclusive founding-member pricing.
          </motion.p>
          
          <motion.div variants={item} className="space-y-6">
            {[
              { icon: Zap, text: "Unlimited ATS Resume Analyses & Optimizations" },
              { icon: Rocket, text: "Unlimited Smart Job Matching & Skill Gap Analysis" },
              { icon: Shield, text: "Unlimited AI Interview Practice with advanced feedback" },
              { icon: Sparkles, text: "Premium ATS-friendly Resume Templates" },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-inter font-medium text-foreground">{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center"
        >
          <div className="glass-card p-8 md:p-10 w-full max-w-md relative overflow-hidden">
            {isJoined ? (
              <div className="flex flex-col items-center text-center py-12">
                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-10 h-10 text-success" />
                </div>
                <h3 className="text-2xl font-sora font-semibold text-foreground mb-2">You're on the list!</h3>
                <p className="text-muted-foreground font-inter">We will be in touch soon with your exclusive early access invite.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-sora font-semibold text-foreground">Join the Waitlist</h3>
                  <p className="text-sm text-muted-foreground font-inter">No payment required. Sign up to secure your spot.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-inter"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email Address</label>
                    <input 
                      required
                      type="email" 
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-inter"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">College (Optional)</label>
                      <input 
                        type="text" 
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-inter"
                        placeholder="University Name"
                        value={formData.college}
                        onChange={(e) => setFormData({...formData, college: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Grad Year</label>
                      <input 
                        type="text" 
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-inter"
                        placeholder="2025"
                        value={formData.graduationYear}
                        onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full py-6 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all mt-2"
                >
                  {isSubmitting ? "Securing Spot..." : "Secure My Spot"}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
