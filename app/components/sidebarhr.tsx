"use client";

import { 
  LayoutDashboard, 
  UserSquare2, 
  FileSpreadsheet, 
  Calendar, 
  Wallet, 
  Award, 
  UserMinus,
  Building2,
  Database
} from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HRSidebar() {
  const path = usePathname();

  const linkClass = (url: string) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
      path === url 
        ? "bg-blue-900 text-white shadow-md shadow-blue-950/50 border-l-4 border-blue-500" 
        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
    }`;

  return (
    <div className="w-64 h-screen bg-slate-900 text-white p-5 border-r border-slate-800 flex flex-col justify-between">
      <div>
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-center text-center border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <Building2 size={36} className="text-blue-500" />
            <h1 className="text-xl font-bold tracking-wider text-white">Enterprise</h1>
          </div>
          <p className="text-xs text-white">Employee & Payroll Automation System</p>
        </div>

        {/* Navigation List */}
        <ul className="space-y-2">
          <li><Link href="/hr/dashboard" className={linkClass("/hr/dashboard")}><LayoutDashboard size={18} /> Dashboard</Link></li>
          <li><Link href="/hr/employees" className={linkClass("/hr/employees")}><UserSquare2 size={18} /> Employees Management</Link></li>
          <li><Link href="/hr/Attendancehr" className={linkClass("/hr/Attendancehr")}><FileSpreadsheet size={18} /> Attendance</Link></li>
          <li><Link href="/hr/Leaves" className={linkClass("/hr/Leaves")}><Calendar size={18} /> Leave Requests</Link></li>
          <li><Link href="/hr/payroll" className={linkClass("/hr/payroll")}><Wallet size={18} /> Payroll & Payslips</Link></li>
          
          <li><Link href="/hr/resignation" className={linkClass("/hr/resignation")}><UserMinus size={18} /> Resignation</Link></li>
          
          
        </ul>
      </div>

      {/* Footer Status */}
      <div className="border-t border-slate-800 pt-4 text-center">
        <p className="text-[10px] text-slate-500 font-mono">Logged in as HR Officer</p>
      </div>
    </div>
  );
}