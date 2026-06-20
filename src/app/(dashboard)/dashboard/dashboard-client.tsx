"use client";

import { motion } from "framer-motion";
import { Activity, Briefcase, FileText, Target, TrendingUp, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface DashboardClientProps {
  firstName: string;
  stats: {
    applications: number;
    interviews: number;
    resumes: number;
    readiness: number;
    atsAvg: number;
  };
}

export function DashboardClient({ firstName, stats }: DashboardClientProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 w-full max-w-7xl mx-auto"
    >
      {/* Hero Readiness Card */}
      <motion.div variants={item} className="w-full relative overflow-hidden rounded-3xl glass-card p-8 md:p-12 border-none bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2">
              Good Morning, {firstName} 👋
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Your career trajectory is looking excellent. Let's make some progress today.
            </p>
          </div>
          <div className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={`${stats.readiness * 2.26} 226`} className="text-primary transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-bold text-slate-900">{stats.readiness}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Overall</p>
              <p className="text-2xl font-black text-slate-900">Readiness</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "ATS Match Average", value: `${stats.atsAvg}%`, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
          { title: "Active Applications", value: stats.applications, icon: Briefcase, color: "text-secondary", bg: "bg-secondary/10" },
          { title: "Interviews Ready", value: stats.interviews, icon: Target, color: "text-accent", bg: "bg-accent/10" },
          { title: "Resumes Built", value: stats.resumes, icon: Activity, color: "text-success", bg: "bg-success/10" },
        ].map((metric, i) => (
          <motion.div key={i} variants={item} whileHover={{ y: -5, scale: 1.02 }} className="block">
            <Card className="glass-card h-full border-none shadow-sm relative overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-slate-500">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-xl ${metric.bg}`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-slate-900">{metric.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity & Smart Actions */}
      <div className="grid gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <motion.div variants={item} className="xl:col-span-2 block">
          <Card className="glass-card h-full border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Activity Pipeline</CardTitle>
              <CardDescription>Your most recent career movements.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium max-w-sm">
                  Your pipeline is currently clear. Start by uploading a resume or adding a new target application to get moving.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="block">
          <Card className="glass-card h-full border-none shadow-sm bg-primary text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] -z-10" />
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Smart Coach</CardTitle>
              <CardDescription className="text-white/80">AI-driven next steps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex gap-3">
                   <CheckCircle2 className="h-5 w-5 text-white/80 shrink-0 mt-0.5" />
                   <p className="text-sm text-white font-medium leading-relaxed">
                     We recommend taking an AI Mock Interview to boost your readiness score by 15%.
                   </p>
                </div>
                <div className="p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex gap-3">
                   <FileText className="h-5 w-5 text-white/80 shrink-0 mt-0.5" />
                   <p className="text-sm text-white font-medium leading-relaxed">
                     Your latest resume "Frontend_Dev_v2.pdf" is scoring 92% for React roles. Great job!
                   </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
