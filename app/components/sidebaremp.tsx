"use client";

import { LayoutDashboard, Users, Calendar, CreditCard, Building2,CalendarDays,Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
export default function Sidebar() {
  const [openEmp, setOpenEmp] = useState(false);
  const path = usePathname(); 

   
  const linkClass = (url: string) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
      path === url 
        ? "bg-blue-900 text-white shadow-md shadow-blue-950/50 border-l-4 border-blue-500" 
        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
    }`;

  return (
    <div className="w-64 h-screen bg-slate-900 text-white p-5">
  <div className="mb-10 flex flex-col items-center text-center">
  
 
  <div className="flex items-center gap-2">
    <Building2 size={60} className="text-blue-300" />
    <h1 className="text-xl font-bold">Enterprise</h1>
  </div>

 
  <p className="text-sm text-gray-100 mt-1">
    Employee & Payroll Automation System
  </p>

</div>

      <ul className="space-y-4">

        <li>
          <Link href="/employee/dashboard" className={linkClass("/employee/dashboard")} >
            <LayoutDashboard size={18}/> Dashboard
          </Link>
        </li>

         

        <li>
          <Link href="/employee/myattendances" className={linkClass("/employee/myattendances")}>
            <Calendar size={18}/>My Attendance
          </Link>
        </li>

      
        <li>
          <Link href="/employee/mySalary" className={linkClass("/employee/mySalary")}>
            <CreditCard size = {18}/>My Salary
          </Link>
        </li>

        <li>
          <Link href="/employee/EmployeeLeaves" className={linkClass("/employee/EmployeeLeaves")}>
            <CalendarDays size={18}/>Apply Leave
          </Link>
        </li>
        
        <li>
          <Link href="/employee/profile" className={linkClass("/employee/profile")}>
            <CalendarDays size={18}/>My Profile
          </Link>
        </li>
       
       <li>
          <Link href="/employee/Contactinfo" className={linkClass("/employee/Contactinfo")}>
            <Phone size={18}/>Contact information
          </Link>
        </li>

       

      </ul>
    </div>
  );
}