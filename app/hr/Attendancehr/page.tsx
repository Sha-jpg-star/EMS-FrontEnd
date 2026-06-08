"use client";
import Sidebar from "../../components/sidebarhr";
import Navbar from "@/app/components/navbarhr";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface EmployeeSummary {
  empNo: string;
  name: string;
  presentDays: number;
  absentDays: number;
  totalLateMins: number;
}

interface UploadStatus {
  success: boolean;
  message: string;
  summaryData?: EmployeeSummary[];
}
const SalaryModal = ({ employee, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({
    basicSalary: "",
    transport: "",
    meal: "",
    otherAllowance: "",
    epf: "",
    etf: "",
    lateDeduction: "",
    otherDeduction: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden text-black">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <h2 className="font-bold">Edit Salary — {employee.name}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-900 text-white p-3 rounded text-sm">
            <p className="font-bold">{employee.name}</p>
            <p className="text-gray-400 text-xs">Emp #{employee.empNo} | Attendance: {employee.presentDays} days | Late: {employee.totalLateMins} min</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Earnings</label>
              <input name="basicSalary" type="number" placeholder="Basic Salary (Rs.)" className="w-full border p-2 mt-1 rounded" onChange={handleChange} />
              <input name="transport" type="number" placeholder="Transport (Rs.)" className="w-full border p-2 mt-2 rounded" onChange={handleChange} />
              <input name="meal" type="number" placeholder="Meal (Rs.)" className="w-full border p-2 mt-2 rounded" onChange={handleChange} />
              <input name="otherAllowance" type="number" placeholder="Other (Rs.)" className="w-full border p-2 mt-2 rounded" onChange={handleChange} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Deductions</label>
              <input name="epf" type="number" placeholder="EPF (Rs.)" className="w-full border p-2 mt-1 rounded" onChange={handleChange} />
              <input name="etf" type="number" placeholder="ETF (Rs.)" className="w-full border p-2 mt-2 rounded" onChange={handleChange} />
              <input name="lateDeduction" type="number" placeholder="Late Deduction (Rs.)" className="w-full border p-2 mt-2 rounded" onChange={handleChange} />
              <input name="otherDeduction" type="number" placeholder="Other Deduction (Rs.)" className="w-full border p-2 mt-2 rounded" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-2 bg-gray-50">
          <button onClick={onClose} className="px-6 py-2 border rounded hover:bg-gray-200">Cancel</button>
          <button onClick={() => onSave(formData)} className="px-6 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 font-bold">
            ✓ Save Salary
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AttendanceUpload() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [department, setDepartment] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<UploadStatus | null>(null);
  const router = useRouter();

  const BACKEND_URL = "http://localhost:5000/api/attendance/upload";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department) return alert("Please select the Department first!");
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("attendanceSheet", file);
    formData.append("department", department);

    try {
      setUploading(true);
      const res = await fetch(BACKEND_URL, { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok) {
        setStatus({
          success: true,
          message: data.message || "Success!",
          summaryData: data.summaryData,
        });
      } else {
        setStatus({ success: false, message: data.message || "Failed!" });
      }
    } catch (err) {
      setStatus({ success: false, message: "Cannot connect to server!" });
    } finally {
      setUploading(false);
    }
  };

  const handleGeneratePayroll = () => {
    if (status?.summaryData) {
      localStorage.setItem("payrollData", JSON.stringify(status.summaryData));
      localStorage.setItem("selectedDept", department);
      router.push("/hr/payroll");
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navbar />
        <div className="md:p-10 p-6 bg-slate-950 min-h-screen">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Upload Department Attendance</h1>
            
            <div className="bg-slate-900 rounded-xl p-8 border border-gray-700 mb-8">
              <form onSubmit={handleUpload} className="space-y-6">
                <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full md:w-1/2 p-3 rounded text-black" required>
                  <option value="">-- Select Department --</option>
                  <option value="Security">Security</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Academic">Academic</option>
                  <option value="Non-Academic">Non-Academic</option>
                </select>

                <input 
                  type="file" 
                  accept=".csv, .xlsx, .xls" 
                  onChange={handleFileChange} 
                  className="block w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded file:bg-blue-900 file:border-0" 
                />

                <button type="submit" disabled={uploading} className="bg-blue-900 px-6 py-3 rounded">
                  {uploading ? "Processing..." : "Process Attendance"}
                </button>
              </form>
            </div>

            {status?.success && (
              <div className="bg-white text-black rounded-xl overflow-hidden">
                <div className="bg-emerald-800 p-4 text-white flex justify-between">
                  <h2 className="font-bold">Summary: {department}</h2>
                  <button onClick={handleGeneratePayroll} className="bg-white text-emerald-800 px-4 py-1 rounded font-bold">
                    Generate Payroll
                  </button>
                </div>
                <table className="w-full text-left border-collapse text-black">
  <thead>
    <tr className="bg-gray-50 border-b">
      <th className="py-4 px-6">Emp No</th>
      <th className="py-4 px-6">Employee Name</th>
      <th className="py-4 px-6 text-center">Present</th>
      <th className="py-4 px-6 text-center">Absent</th>
      <th className="py-4 px-6 text-center">Late</th>
      <th className="py-4 px-6 text-center">Action</th> {/* අලුතින් එකතු විය */}
    </tr>
  </thead>
  <tbody>
    {status.summaryData?.map((emp) => (
      <tr key={emp.empNo} className="border-b">
        <td className="py-4 px-6">{emp.empNo}</td>
        <td className="py-4 px-6">{emp.name}</td>
        <td className="py-4 px-6 text-center">{emp.presentDays}</td>
        <td className="py-4 px-6 text-center">{emp.absentDays}</td>
        <td className="py-4 px-6 text-center">{emp.totalLateMins} mins</td>
        <td className="py-4 px-6 text-center">
          {/* Payslip Button */}
          <button 
      onClick={() => {
        setSelectedEmp(emp); // තෝරාගත් සේවකයා සකසන්න
        setIsModalOpen(true); // Modal එක විවෘත කරන්න
      }}
      className="bg-blue-600 text-white px-3 py-1 rounded"
    >
      Payslip
    </button>
    {isModalOpen && (
      <SalaryModal 
        employee={selectedEmp} 
        onClose={() => setIsModalOpen(false)} 
        onSave={(data: any) => {
          console.log("Saving for:", selectedEmp.name, data);
          setIsModalOpen(false);
          // මෙතැනදී මෙම දත්ත Payroll state එකට හෝ localStorage එකට යාවත්කාලීන කරන්න
        }} 
      />
    )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}