import React, { useState } from "react";

interface SalaryModalProps {
  employee: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

const SalaryModal: React.FC<SalaryModalProps> = ({ employee, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    basicSalary: employee.basicSalary || 0,
    transport: employee.transport || 0,
    meal: employee.meal || 0,
    otherAllowance: employee.otherAllowance || 0,
    epf: employee.epf || 0,
    etf: employee.etf || 0,
    lateDeduction: employee.lateDeduction || 0,
    otherDeduction: employee.otherDeduction || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl overflow-hidden text-black">
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Edit Salary — {employee.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>

        {/* Employee Info Box */}
        <div className="px-6 py-4">
          <div className="bg-[#1e293b] text-white p-4 rounded-lg">
            <p className="font-bold">{employee.name}</p>
            <p className="text-sm text-gray-300">
              Emp #{employee.empNo} | Security Dept | November 2025 | Present: {employee.presentDays} days | Late: {employee.totalLateMins} min
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="px-6 py-2 grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <h3 className="font-bold text-xs text-gray-500 uppercase mb-2">Earnings</h3>
            <label className="block text-sm">Basic Salary (Rs.)</label>
            <input name="basicSalary" type="number" defaultValue={formData.basicSalary} onChange={handleChange} className="w-full border rounded p-2 mb-2" />
            <label className="block text-sm">Transport Allowance (Rs.)</label>
            <input name="transport" type="number" defaultValue={formData.transport} onChange={handleChange} className="w-full border rounded p-2 mb-2" />
            <label className="block text-sm">Meal Allowance (Rs.)</label>
            <input name="meal" type="number" defaultValue={formData.meal} onChange={handleChange} className="w-full border rounded p-2 mb-2" />
            <label className="block text-sm">Other Allowance (Rs.)</label>
            <input name="otherAllowance" type="number" defaultValue={formData.otherAllowance} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-gray-500 uppercase mb-2">Deductions</h3>
            <label className="block text-sm">EPF Employee (Rs.)</label>
            <input name="epf" type="number" defaultValue={formData.epf} onChange={handleChange} className="w-full border rounded p-2 mb-2" />
            <label className="block text-sm">ETF (Rs.)</label>
            <input name="etf" type="number" defaultValue={formData.etf} onChange={handleChange} className="w-full border rounded p-2 mb-2" />
            <label className="block text-sm">Late Deduction (Rs.)</label>
            <input name="lateDeduction" type="number" defaultValue={formData.lateDeduction} onChange={handleChange} className="w-full border rounded p-2 mb-2" />
            <label className="block text-sm">Other Deduction (Rs.)</label>
            <input name="otherDeduction" type="number" defaultValue={formData.otherDeduction} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 border rounded font-semibold hover:bg-gray-100">Cancel</button>
          <button onClick={() => onSave(formData)} className="px-6 py-2 bg-[#1e293b] text-white rounded font-semibold hover:bg-black">
            ✓ Save Salary
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalaryModal;