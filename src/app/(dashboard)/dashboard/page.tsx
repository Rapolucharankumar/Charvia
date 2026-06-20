"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Activity, Briefcase, FileText, Target } from "lucide-react";

export default function DashboardPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
      className="flex flex-col gap-6"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Metric Cards */}
        {[
          { title: "Total Applications", value: "12", desc: "+2 from last week", icon: Briefcase, color: "text-blue-400" },
          { title: "Interviews Scheduled", value: "3", desc: "+1 from last week", icon: Target, color: "text-green-400" },
          { title: "Resumes Created", value: "2", desc: "ATS Score: 85%", icon: FileText, color: "text-purple-400" },
          { title: "Profile Views", value: "42", desc: "+19% from last month", icon: Activity, color: "text-orange-400" },
        ].map((metric, i) => (
          <motion.div key={i} variants={item} whileHover={{ y: -5 }} className="block">
            <Card className="glass-card h-full border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.desc}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <motion.div variants={item} className="xl:col-span-2 block">
          <Card className="glass-card h-full border-white/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-1">
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest job applications and updates.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No recent activity found. Start applying!</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="block">
          <Card className="glass-card h-full border-white/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10" />
            <CardHeader>
              <CardTitle>Upcoming Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <Target className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">You have no upcoming interviews.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
