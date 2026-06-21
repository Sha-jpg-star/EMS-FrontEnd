"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebaradmin";
import Navbar from "@/app/components/navbar";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = {
  getAttendance: async (department, month) => {
    const p = new URLSearchParams();
    if (department) p.set("department", department);
    if (month) p.set("month", month);
    const res = await fetch(`${BASE}/attendance?${p}`);
    return res.json();
  },
  getAllMonths: async () => {
    const res = await fetch(`${BASE}/attendance/months`);
    return res.json();
  },
};

const DEPARTMENTS = ["Cleaning", "Security", "Non-Academic", "Academic"];

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4">
      <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default function AdminAttendancePage() {
  const [months, setMonths]               = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDept, setSelectedDept]   = useState("All");
  const [attendance, setAttendance]       = useState([]);
  const [loading, setLoading]             = useState(false);

  useEffect(() => {
    api.getAllMonths().then((data) => {
      const arr = Array.isArray(data) ? data : [];
      setMonths(arr);
      if (arr.length > 0) setSelectedMonth(arr[0].month);
    });
  }, []);

  useEffect(() => {
    if (!selectedMonth) return;
    setLoading(true);
    const dept = selectedDept === "All" ? "" : selectedDept;
    api.getAttendance(dept, selectedMonth).then((data) => {
      setAttendance(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [selectedMonth, selectedDept]);

  const currentLabel = months.find((m) => m.month === selectedMonth)?.label || "";

  const totalEmp     = attendance.length;
  const totalPresent = attendance.reduce((s, e) => s + (e.present || 0), 0);
  const totalAbsent  = attendance.reduce((s, e) => s + (e.absent || 0), 0);
  const totalLate    = attendance.reduce((s, e) => s + (e.lateMinutes || 0), 0);

  const deptSummary = DEPARTMENTS.map((dept) => {
    const rows = attendance.filter((e) => e.department === dept);
    return {
      dept,
      count: rows.length,
      present: rows.reduce((s, e) => s + (e.present || 0), 0),
      absent:  rows.reduce((s, e) => s + (e.absent  || 0), 0),
      late:    rows.reduce((s, e) => s + (e.lateMinutes || 0), 0),
    };
  }).filter((d) => d.count > 0);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto ">
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Attendance Overview</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Monthly attendance summary across all departments — read only view.
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">— Select Month —</option>
                  {months.map((m) => (
                    <option key={m.month} value={m.month}>{m.label}</option>
                  ))}
                </select>

                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Departments</option>
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {attendance.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Total Employees"  value={totalEmp}     color="text-slate-800" />
                <StatCard label="Total Present"    value={totalPresent} color="text-green-600" />
                <StatCard label="Total Absent"     value={totalAbsent}  color="text-red-500"   />
                <StatCard label="Total Late (min)" value={totalLate}    color="text-amber-600" />
              </div>
            )}

            {selectedDept === "All" && deptSummary.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {deptSummary.map((d) => (
                  <button
                    key={d.dept}
                    onClick={() => setSelectedDept(d.dept)}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-left hover:border-blue-400 hover:shadow-md transition group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-sm text-slate-800">{d.dept}</p>
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                        {d.count} emp
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-center text-xs">
                      <div>
                        <p className="text-green-600 font-bold text-base">{d.present}</p>
                        <p className="text-slate-400">Present</p>
                      </div>
                      <div>
                        <p className="text-red-500 font-bold text-base">{d.absent}</p>
                        <p className="text-slate-400">Absent</p>
                      </div>
                      <div>
                        <p className="text-amber-500 font-bold text-base">{d.late}</p>
                        <p className="text-slate-400">Late min</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {selectedDept === "All" ? "All Departments" : selectedDept}
                    {currentLabel && ` · ${currentLabel}`}
                  </h2>
                  {attendance.length > 0 && (
                    <p className="text-xs text-slate-400 mt-0.5">{attendance.length} employees</p>
                  )}
                </div>

                {selectedDept !== "All" && (
                  <button
                    onClick={() => setSelectedDept("All")}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    All Departments
                  </button>
                )}
              </div>

              {attendance.length > 0 && !loading && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 bg-slate-50">
                        <th className="text-left px-5 py-3">Emp No</th>
                        <th className="text-left px-5 py-3">Name</th>
                        <th className="text-left px-5 py-3">Department</th>
                        <th className="text-left px-5 py-3">Role</th>
                        <th className="text-center px-5 py-3">Work Days</th>
                        <th className="text-center px-5 py-3">Present</th>
                        <th className="text-center px-5 py-3">Absent</th>
                        <th className="text-center px-5 py-3">Late (min)</th>
                        <th className="text-center px-5 py-3">Attendance %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attendance.map((emp) => {
                        const pct = emp.workDays > 0
                          ? Math.round((emp.present / emp.workDays) * 100)
                          : 0;
                        return (
                          <tr key={`${emp.empNo}-${emp.department}`} className="hover:bg-slate-50 transition">
                            <td className="px-5 py-3.5 font-semibold text-slate-800">{emp.empNo}</td>
                            <td className="px-5 py-3.5 text-slate-700 font-medium">{emp.name}</td>
                            <td className="px-5 py-3.5">
                              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">
                                {emp.department}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-medium border border-blue-100">
                                {emp.role || "—"}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-center text-slate-600">{emp.workDays}</td>
                            <td className="px-5 py-3.5 text-center">
                              <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-semibold text-xs">
                                {emp.present}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <span className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full font-semibold text-xs ${
                                emp.absent > 0 ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-400"
                              }`}>
                                {emp.absent}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <span className={`text-xs font-medium ${emp.lateMinutes > 0 ? "text-amber-600" : "text-slate-400"}`}>
                                {emp.lateMinutes} min
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-amber-400" : "bg-red-400"}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className={`text-xs font-semibold ${pct >= 80 ? "text-green-600" : pct >= 60 ? "text-amber-600" : "text-red-500"}`}>
                                  {pct}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {loading && (
                <div className="py-12 text-center">
                  <svg className="animate-spin w-6 h-6 text-slate-400 mx-auto" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <p className="text-slate-400 text-sm mt-2">Loading attendance…</p>
                </div>
              )}

              {!loading && selectedMonth && attendance.length === 0 && (
                <div className="py-14 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-sm font-medium">No attendance data</p>
                  <p className="text-slate-400 text-xs mt-1">No records found for selected period.</p>
                </div>
              )}

              {!selectedMonth && (
                <div className="py-12 text-center">
                  <p className="text-slate-400 text-sm">Select a month to view attendance records.</p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}