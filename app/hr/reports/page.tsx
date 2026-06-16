"use client";
import Sidebar from "@/app/components/sidebarhr";
import Navbar from "@/app/components/navbarhr";
import { Users, CalendarDays, FileText, Wallet, Download } from "lucide-react";

export default function ReportsPage() {
  const reports = [
    {
      title: "Employee Reports",
      icon: Users,
      description: "View employee details and department summaries.",
    },
    {
      title: "Attendance Reports",
      icon: CalendarDays,
      description: "Present, absent, late and monthly attendance reports.",
    },
    {
      title: "Leave Reports",
      icon: FileText,
      description: "Approved, pending and rejected leave reports.",
    },
    {
      title: "Payroll Reports",
      icon: Wallet,
      description: "Monthly salary and payslip reports.",
    },
  ];

  return (
     <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Navbar />
                    <div className="flex-1 overflow-y-auto bg-slate-950 p-8">
      <h1 className="text-4xl font-bold mb-8">Reports</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {reports.map((report, index) => {
          const Icon = report.icon;

          return (
            <div
              key={index}
              className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-600 p-3 rounded-xl">
                  <Icon size={28} />
                </div>

                <div>
                  <h2 className="text-2xl font-semibold">{report.title}</h2>
                  <p className="text-gray-400 text-sm">
                    {report.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl">
                  <Download size={18} />
                  PDF Export
                </button>

                <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl">
                  <Download size={18} />
                  Excel Export
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div></div></div>
  );
}