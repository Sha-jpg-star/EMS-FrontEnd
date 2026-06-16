"use client";

import { 
  LayoutDashboard, Users, Building2,  Database, Sliders,
  FileSpreadsheet, Calendar, Wallet, UserMinus ,FileDown
} from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
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
        <div className="mb-8 flex flex-col items-center text-center border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <Building2 size={36} className="text-blue-500" />
            <h1 className="text-xl font-bold tracking-wider text-white">Enterprise</h1>
          </div>
          <p className="text-xs text-white">Employee & Payroll Automation System</p>
        </div>

        <ul className="space-y-2">
          <li><Link href="/admin/dashboard" className={linkClass("/admin/dashboard")}><LayoutDashboard size={18} /> Dashboard</Link></li>
          <li><Link href="/admin/employees" className={linkClass("/admin/employees")}><Users size={18} /> Employees Management</Link></li>
          <li><Link href="/admin/staff" className={linkClass("/admin/staff")}>< FileSpreadsheet size={18} /> HR Management</Link></li>
       
          
          <li><Link href="/admin/Leaves" className={linkClass("/admin/Leaves")}><Calendar size={18} /> Leave Requests</Link></li>
          <li><Link href="/admin/Attendanceadmin" className={linkClass("/admin/Attendanceadmin")}>< FileSpreadsheet size={18} /> Attendance</Link></li>
          <li><Link href="/admin/payroll" className={linkClass("/admin/payroll")}><Wallet size={18} /> Payroll & Payslips</Link></li>
          <li><Link href="/admin/reports" className={linkClass("/admin/reports")}><FileDown size={18} /> Reports</Link></li>

         
          <li><Link href="/admin/resignation" className={linkClass("/admin/resignation")}><UserMinus size={18} /> Resignation</Link></li>
          
          
          <li><Link href="/admin/database-backup" className={linkClass("/admin/database-backup")}><Database size={18} /> DB Backup</Link></li>
        </ul>
      </div>

      <div className="border-t border-slate-800 pt-4">
        <Link href="/admin/Settings" className={linkClass("/admin/Settings")}>
          <Sliders size={18} /> Company Settings
        </Link>
      </div>
    </div>
  );
}