"use client";

import Sidebar from "@/app/components/sidebaradmin";
import Navbar from "@/app/components/navbar";
import { useEffect, useState } from "react";

export default function Dashboard() {
  // employees සඳහා පමණක් state එකක් භාවිතා කරන්න
  const [totalEmployees, setTotalEmployees] = useState("...");
const [totalUsers, setTotalUsers] = useState("...");
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await fetch("http://localhost:5000/api/employees");
        if (!response.ok) throw new Error("Failed to fetch");
        
        const data = await response.json();
        // දත්ත array එකක් ලෙස ලැබෙන්නේ නම් එහි දිග (length) ලබා ගන්න
        setTotalEmployees(data.length.toString());
      } catch (error) {
        console.error("Error fetching employees:", error);
        setTotalEmployees("0"); // දෝෂයක් වුවහොත් 0 ලෙස පෙන්වන්න
      }
    }
    fetchEmployees();
  }, []);

  return (
   <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar />
                  <div className="flex-1 overflow-y-auto bg-slate-950 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-slate-400">Welcome back, here is your HR summary.</p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { title: "Total Employees", value: totalEmployees, color: "text-blue-400" },
              { title: "Attendance", value: "92%", color: "text-emerald-400" }, // Static
              { title: "Leave Requests", value: "08", color: "text-amber-400" }, // Static
            ].map((item, index) => (
              <div key={index} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
                <h3 className="text-slate-400 text-sm font-medium">{item.title}</h3>
                <p className={`text-3xl font-bold mt-2 ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Main Content Area - ඉතිරි කොටස් ඒ ආකාරයෙන්ම */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-lg font-semibold mb-4">Leave Status Distribution</h2>
              <div className="h-48 flex items-center justify-center border border-dashed border-slate-700 rounded-xl text-slate-500">
                [Chart Component Goes Here]
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-lg font-semibold mb-4">Recent Requests</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-sm">John Perera</span>
                  <span className="text-xs bg-amber-900/30 text-amber-500 px-2 py-1 rounded">Pending</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-sm">Sarah Silva</span>
                  <span className="text-xs bg-emerald-900/30 text-emerald-500 px-2 py-1 rounded">Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}