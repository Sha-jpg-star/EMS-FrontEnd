"use client";
import { useState, useEffect } from "react";

import Sidebar from "@/app/components/sidebarhr";
import Navbar from "@/app/components/navbarhr";


const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = {
  uploadAttendance: async (file, department) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("department", department);
    const res = await fetch(`${BASE}/attendance/upload`, { method: "POST", body: fd });
    return res.json();
  },
  getAttendance: async (department, month) => {
    const p = new URLSearchParams();
    if (department) p.set("department", department);
    if (month) p.set("month", month);
    const res = await fetch(`${BASE}/attendance?${p}`);
    return res.json();
  },
  getMonths: async (department) => {
    const p = new URLSearchParams();
    if (department) p.set("department", department);
    const res = await fetch(`${BASE}/attendance/months?${p}`);
    return res.json();
  },
  updateBasicSalary: async (empNo, basicSalary) => {
    const res = await fetch(`${BASE}/attendance/salary/${empNo}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ basicSalary }),
    });
    return res.json();
  },
};

const DEPARTMENTS = ["Cleaning", "Security", "Non-Academic", "Academic"];






function SetSalaryModal({ employee, onClose, onSave, loading }) {
  const [salary, setSalary] = useState(employee?.basicSalary || 0);

  useEffect(() => {
    if (employee) setSalary(employee.basicSalary || 0);
  }, [employee]);

  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-[#0f172a] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold text-base">Set Basic Salary</h2>
              <p className="text-slate-400 text-xs mt-0.5">{employee.name} · Emp #{employee.empNo}</p>
            </div>
            <button onClick={onClose}
              className="text-slate-400 hover:text-white w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-xl leading-none">
              ×
            </button>
          </div>
        </div>

        <div className="px-5 py-5 space-y-4">
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {employee.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{employee.name}</p>
              <p className="text-xs text-slate-500">{employee.department} · {employee.role || "—"}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Basic Salary (Rs.)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">Rs.</span>
              <input type="number" min="0" value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0" />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">Saved to employee record · used when generating payroll</p>
          </div>
        </div>

        <div className="px-5 pb-5 flex gap-2">
          <button onClick={() => onSave(employee.empNo, Number(salary))} disabled={loading}
            className="flex-1 bg-[#0f172a] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-slate-700 transition disabled:opacity-50">
            {loading ? "Saving…" : "Save Salary"}
          </button>
          <button onClick={onClose}
            className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}


export default function AttendancePage() {
  const [uploadDept, setUploadDept] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);

  const [viewDept, setViewDept] = useState("");
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);

  const [salaryModal, setSalaryModal] = useState(null);
  const [savingSalary, setSavingSalary] = useState(false);

  useEffect(() => {
    if (viewDept) {
      api.getMonths(viewDept).then((data) => {
        setMonths(Array.isArray(data) ? data : []);
        setSelectedMonth("");
        setAttendance([]);
      });
    }
  }, [viewDept]);

  useEffect(() => {
    if (viewDept && selectedMonth) {
      setLoadingTable(true);
      api.getAttendance(viewDept, selectedMonth).then((data) => {
        setAttendance(Array.isArray(data) ? data : []);
        setLoadingTable(false);
      });
    }
  }, [viewDept, selectedMonth]);

  const handleUpload = async () => {
    if (!file || !uploadDept)
      return setUploadMsg({ type: "error", text: "Select a department and choose a file first." });
    setUploading(true);
    setUploadMsg(null);
    const res = await api.uploadAttendance(file, uploadDept);
    setUploading(false);
    if (res.message?.includes("success")) {
      setUploadMsg({ type: "success", text: `${res.count} employees uploaded — ${res.department}, ${res.monthLabel}` });
      setFile(null);
      if (viewDept === uploadDept)
        api.getMonths(viewDept).then((d) => setMonths(Array.isArray(d) ? d : []));
    } else {
      setUploadMsg({ type: "error", text: res.message || "Upload failed." });
    }
  };

  const handleSaveSalary = async (empNo, basicSalary) => {
    setSavingSalary(true);
    await api.updateBasicSalary(empNo, basicSalary);
    setSavingSalary(false);
    setSalaryModal(null);
    const data = await api.getAttendance(viewDept, selectedMonth);
    setAttendance(Array.isArray(data) ? data : []);
  };

  const currentLabel = months.find((m) => m.month === selectedMonth)?.label || "";

  return (
      <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
          
          {/* Sidebar */}
          <Sidebar />
    
          {/* Main Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            
            {/* Navbar */}
            <Navbar />

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

            {/* Page title */}
            <div>
              <h1 className="text-2xl font-bold text-white">Upload Department Attendance</h1>
              <p className="text-sm text-slate-500 mt-1">
                Upload monthly Excel attendance files per department. View summaries and set basic salaries below.
              </p>
            </div>

            {/* ── Upload Card ──────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Upload Excel File
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Department</label>
                  <select value={uploadDept} onChange={(e) => setUploadDept(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">— Select Department —</option>
                    {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Excel File (.xlsx)</label>
                  <label className="flex items-center gap-2 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-500 bg-white cursor-pointer hover:bg-slate-50 transition">
                    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="truncate">{file ? file.name : "Choose file…"}</span>
                    <input type="file" accept=".xlsx,.xls" className="hidden"
                      onChange={(e) => setFile(e.target.files[0] || null)} />
                  </label>
                </div>

                <div className="flex items-end">
                  <button onClick={handleUpload} disabled={uploading || !file || !uploadDept}
                    className="w-full bg-[#0f172a] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {uploading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Processing…
                      </>
                    ) : "Process Attendance"}
                  </button>
                </div>
              </div>

              {uploadMsg && (
                <div className={`mt-4 flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm ${
                  uploadMsg.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  <span className="text-base leading-none mt-0.5">{uploadMsg.type === "success" ? "✓" : "✕"}</span>
                  {uploadMsg.text}
                </div>
              )}
            </div>

            {/* ── Attendance Summary ───────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance Summary</h2>
                <div className="flex gap-2 flex-wrap">
                  <select value={viewDept} onChange={(e) => setViewDept(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">— Department —</option>
                    {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                  {months.length > 0 && (
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
                      className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">— Month —</option>
                      {months.map((m) => <option key={m.month} value={m.month}>{m.label}</option>)}
                    </select>
                  )}
                </div>
              </div>

              {attendance.length > 0 && (
                <>
                  <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs text-slate-500 font-medium">
                      {viewDept} · {currentLabel} · {attendance.length} employees
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                   <table className="w-full text-sm">
  <thead>
    <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 bg-white">
      {["Emp No", "Name", "Department", "Role", "Work Days", "Present", "Absent", "Late (min)", "Basic Salary"].map((h) => (
        <th key={h} className={`px-5 py-3 ${h === "Emp No" || h === "Name" || h === "Department" || h === "Role" ? "text-left" : "text-center"}`}>{h}</th>
      ))}
    </tr>
  </thead>
  <tbody className="divide-y divide-slate-100">
    {attendance.map((emp) => (
      <tr key={emp.empNo} className="hover:bg-slate-50 transition">
        <td className="px-5 py-3.5 font-semibold text-[#0f172a]">{emp.empNo}</td>
        <td className="px-5 py-3.5 text-slate-700 font-medium">{emp.name}</td>
        <td className="px-5 py-3.5 text-slate-600">{emp.department}</td>
        <td className="px-5 py-3.5 text-slate-600">{emp.role || "—"}</td>
        <td className="px-5 py-3.5 text-center text-slate-600">{emp.workDays}</td>
        <td className="px-5 py-3.5 text-center">
          <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-semibold text-xs">
            {emp.present}
          </span>
        </td>
        <td className="px-5 py-3.5 text-center">
          <span className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full font-semibold text-xs ${emp.absent > 0 ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-400"}`}>
            {emp.absent}
          </span>
        </td>
        <td className="px-5 py-3.5 text-center">
          <span className={`text-xs font-medium ${emp.lateMinutes > 0 ? "text-amber-600" : "text-slate-400"}`}>
            {emp.lateMinutes} min
          </span>
        </td>
        <td className="px-5 py-3.5 text-center text-slate-700 text-xs font-medium">
          Rs. {Number(emp.basicSalary || 0).toLocaleString("en-LK")}
        </td>
      </tr>
    ))}
  </tbody>
</table>
                  </div>
                </>
              )}

              {loadingTable && (
                <div className="py-12 text-center">
                  <svg className="animate-spin w-6 h-6 text-slate-400 mx-auto" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <p className="text-slate-400 text-sm mt-2">Loading attendance…</p>
                </div>
              )}

              {!loadingTable && viewDept && selectedMonth && attendance.length === 0 && (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-sm font-medium">No attendance data</p>
                  <p className="text-slate-400 text-xs mt-1">Upload an Excel file for {viewDept} first.</p>
                </div>
              )}

              {!viewDept && (
                <div className="py-12 text-center">
                  <p className="text-slate-400 text-sm">Select a department to view attendance records.</p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Modal */}
      <SetSalaryModal
        employee={salaryModal}
        onClose={() => setSalaryModal(null)}
        onSave={handleSaveSalary}
        loading={savingSalary}
      />
    </div>
  );
}