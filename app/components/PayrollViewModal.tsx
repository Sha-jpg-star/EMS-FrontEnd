import React from "react";

export default function PayrollViewModal({ employee, onClose }: any) {
  const gross = (Number(employee.basicSalary) || 0) + (Number(employee.allowances) || 0);
  const totalDeductions = (Number(employee.deductions) || 0);
  const netPay = gross - totalDeductions;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-black">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">Payroll Summary — {employee.name}</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span>Work Days:</span> <span className="font-bold">20</span></div>
          <div className="flex justify-between"><span>Present Days:</span> <span className="font-bold text-green-600">{employee.presentDays || 0}</span></div>
          <div className="flex justify-between border-b pb-2"><span>Late (min):</span> <span className="font-bold text-red-600">{employee.totalLateMins || 0}</span></div>
          
          <div className="py-2">
            <h3 className="font-bold text-gray-500 uppercase text-xs mb-2">Earnings</h3>
            <div className="flex justify-between"><span>Basic Salary</span> <span>Rs. {employee.basicSalary || 0}</span></div>
            <div className="flex justify-between font-bold text-lg mt-2"><span>Gross Salary</span> <span>Rs. {gross}</span></div>
          </div>
          
          <div className="py-2 border-t">
            <h3 className="font-bold text-gray-500 uppercase text-xs mb-2">Deductions</h3>
            <div className="flex justify-between"><span>Total Deductions</span> <span className="text-red-600">- Rs. {totalDeductions}</span></div>
          </div>
          
          <div className="flex justify-between font-bold text-xl text-emerald-700 border-t pt-2">
            <span>Net Pay</span> <span>Rs. {netPay}</span>
          </div>
        </div>
        <button onClick={onClose} className="w-full mt-6 bg-slate-900 text-white py-2 rounded font-bold hover:bg-slate-800">Close</button>
      </div>
    </div>
  );
}