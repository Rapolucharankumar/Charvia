"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Search, Download, Target, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  college: string | null;
  graduationYear: string | null;
  createdAt: string;
}

interface Analytics {
  totalUsers: number;
  waitlistCount: number;
  conversionRate: string;
}

export default function AdminWaitlistPage() {
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<WaitlistUser[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({ totalUsers: 0, waitlistCount: 0, conversionRate: "0" });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/waitlist");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      
      setUsers(data.waitlist);
      setFilteredUsers(data.waitlist);
      setAnalytics(data.analytics);
    } catch (error) {
      toast.error("Could not load waitlist data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term) ||
      (user.college && user.college.toLowerCase().includes(term))
    );
    setFilteredUsers(filtered);
  };

  const handleExportCSV = () => {
    if (users.length === 0) return toast.info("No data to export");

    const headers = ["Name,Email,College,Graduation Year,Joined At"];
    const csvContent = users.map(u => 
      `"${u.name}","${u.email}","${u.college || ''}","${u.graduationYear || ''}","${format(new Date(u.createdAt), "yyyy-MM-dd")}"`
    );
    
    const blob = new Blob([[...headers, ...csvContent].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `charvia-waitlist-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading waitlist data...</div>;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Pro Waitlist</h1>
        <p className="text-muted-foreground">Manage and track early access interest for Charvia Pro.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Waitlist Signups</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.waitlistCount}</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">From total user base</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Platform Users</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table Area */}
      <Card className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users..." 
              value={search}
              onChange={handleSearch}
              className="pl-9 bg-black/20 border-white/10"
            />
          </div>
          <Button onClick={handleExportCSV} variant="outline" className="w-full sm:w-auto bg-black/20 border-white/10 hover:bg-white/5">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-black/20 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">College</th>
                <th className="px-6 py-4 font-medium">Grad Year</th>
                <th className="px-6 py-4 font-medium">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.college || "-"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.graduationYear || "-"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{format(new Date(user.createdAt), "MMM d, yyyy")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
