"use client";
import React from 'react';
import { CalendarDays, Wallet, FileText } from 'lucide-react';
import Sidebar from "@/app/components/sidebaremp";
import Navbar from "@/app/components/navbaremp";

export default function EmployeeDashboard() {
  const stats = [
    { title: "Today's Attendance", value: "Present", icon: <CalendarDays className="text-blue-400" />, color: "text-blue-400" },
    { title: "Monthly Salary", value: "Rs. 85,000", icon: <Wallet className="text-emerald-400" />, color: "text-emerald-400" },
    { title: "Leave Balance", value: "12 Days", icon: <FileText className="text-amber-400" />, color: "text-amber-400" },
  ];

  return (
     <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Navbar />
                    <div className="flex-1 overflow-y-auto bg-slate-950 p-8">
          {/* Header */}
          <div className="mb-8 p-8">
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-slate-400">Welcome back, KTA Ariyawansha. Here is your summary.</p>
          

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg">{stat.icon}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions / Announcements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="flex gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">Apply for Leave</button>
                <button className="border border-slate-700 hover:bg-slate-900 px-4 py-2 rounded-lg text-sm transition-colors">View Payslip</button>
              </div>
            </div>
            
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Announcements</h2>
              <p className="text-slate-400 text-sm">No new announcements for today.</p>
            </div>
          </div>
        </div>
      </div>
    </div></div>
  );
}