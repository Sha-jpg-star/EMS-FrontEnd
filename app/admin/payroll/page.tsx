"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/app/components/sidebaradmin";
import Navbar from "@/app/components/navbar";
import PayrollViewModal from "@/app/components/PayrollViewModal";

import SalaryModal from "@/app/components/SalaryModal";

export default function PayrollPage() {
  const [payrollList, setPayrollList] = useState<any[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("payrollData") || "[]");
    setPayrollList(data);
  }, []);

  const handleSaveUpdatedSalary = (updatedData: any) => {
    const newList = payrollList.map(emp => 
      emp.empNo === selectedEmp.empNo ? { ...emp, ...updatedData } : emp
    );
    setPayrollList(newList);
    localStorage.setItem("payrollData", JSON.stringify(newList));
    setIsEditModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">Security — November 2025 Payroll</h1>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4">EMP NO</th>
                  <th className="p-4">NAME</th>
                  <th className="p-4">ATTENDANCE</th>
                  <th className="p-4">LATE</th>
                  <th className="p-4">BASIC SALARY</th>
                  <th className="p-4">GROSS</th>
                  <th className="p-4">DEDUCTIONS</th>
                  <th className="p-4 text-emerald-600">NET PAY</th>
                  <th className="p-4 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {payrollList.map((emp) => {
                  const gross = (Number(emp.basicSalary) || 0) + (Number(emp.allowances) || 0);
                  const net = gross - (Number(emp.deductions) || 0);
                  return (
                    <tr key={emp.empNo} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-bold">{emp.empNo}</td>
                      <td className="p-4">{emp.name}</td>
                      <td className="p-4">{emp.presentDays}/20</td>
                      <td className="p-4">{emp.totalLateMins} min</td>
                      <td className="p-4">Rs. {emp.basicSalary || 0}</td>
                      <td className="p-4">Rs. {gross}</td>
                      <td className="p-4 text-red-600">Rs. {emp.deductions || 0}</td>
                      <td className="p-4 font-bold text-emerald-600">Rs. {net}</td>
                      <td className="p-4 flex justify-center gap-2">
                        <button onClick={() => { setSelectedEmp(emp); setIsEditModalOpen(true); }} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm">Edit</button>
                        <button onClick={() => { setSelectedEmp(emp); setIsViewModalOpen(true); }} className="px-3 py-1 bg-slate-900 text-white rounded hover:bg-slate-800 text-sm">View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isEditModalOpen && <SalaryModal employee={selectedEmp} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveUpdatedSalary} />}
      {isViewModalOpen && <PayrollViewModal employee={selectedEmp} onClose={() => setIsViewModalOpen(false)} />}
    </div>
  );
}