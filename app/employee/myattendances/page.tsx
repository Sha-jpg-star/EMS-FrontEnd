"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebaremp";
import Navbar from "@/app/components/navbaremp";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function MyAttendancePage() {
  const [empNo, setEmpNo] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeDept, setEmployeeDept] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (!user?.email) {
      setError("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    fetch(`${BASE}/employee/by-email/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data?.empNo) {
          setError("Employee not found.");
          setLoading(false);
          return;
        }

        setEmpNo(data.empNo);
        setEmployeeName(data.name || "");
        setEmployeeDept(data.department || "");
        setEmployeeRole(data.role || "");

        return fetch(`${BASE}/attendance?empNo=${data.empNo}`);
      })
      .then((res) => res?.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRecords(data.sort((a, b) => b.month.localeCompare(a.month)));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load attendance.");
        setLoading(false);
      });
  }, []);

  const totalWorkDays = records.reduce((s, r) => s + (r.workDays || 0), 0);
  const totalPresent  = records.reduce((s, r) => s + (r.present || 0), 0);
  const totalAbsent   = records.reduce((s, r) => s + (r.absent || 0), 0);
  const totalLate     = records.reduce((s, r) => s + (r.lateMinutes || 0), 0);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto bg-slate-950">
          <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

            <div>
              <h1 className="text-2xl font-bold text-white">My Attendance</h1>
              <p className="text-sm text-slate-500 mt-1">
                Your monthly attendance records
              </p>
            </div>

            {loading && (
              <div className="py-20 text-center">
                <svg className="animate-spin w-7 h-7 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <p className="text-slate-500 text-sm mt-3">Loading your attendance…</p>
              </div>
            )}

            {!loading && error && (
              <div className="flex items-center gap-3 px-5 py-4 bg-red-950 border border-red-800 rounded-2xl text-red-400 text-sm">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {!loading && !error && (
              <>
                {/* Employee Info Card */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                      {employeeName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-white">{employeeName}</h2>
                      <p className="text-sm text-slate-400 flex items-center gap-2 flex-wrap">
                        <span>{employeeDept} · Emp #{empNo}</span>
                        {employeeRole && (
                          <span className="text-xs bg-blue-950 text-blue-400 px-2 py-0.5 rounded-full border border-blue-900">
                            {employeeRole}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-800 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-white">{totalWorkDays}</p>
                      <p className="text-xs text-slate-400 mt-1">Work Days</p>
                    </div>
                    <div className="bg-green-950 border border-green-900 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-green-400">{totalPresent}</p>
                      <p className="text-xs text-green-600 mt-1">Present</p>
                    </div>
                    <div className="bg-red-950 border border-red-900 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-red-400">{totalAbsent}</p>
                      <p className="text-xs text-red-600 mt-1">Absent</p>
                    </div>
                    <div className="bg-amber-950 border border-amber-900 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-amber-400">{totalLate}</p>
                      <p className="text-xs text-amber-600 mt-1">Late (min)</p>
                    </div>
                  </div>
                </div>

                {/* Monthly Table */}
                {records.length > 0 ? (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-800">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Monthly Breakdown · {records.length} {records.length === 1 ? "month" : "months"}
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                            {["Month", "Role", "Work Days", "Present", "Absent", "Late (min)"].map((h) => (
                              <th key={h} className={`px-5 py-3 ${h === "Month" || h === "Role" ? "text-left" : "text-center"}`}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {records.map((rec) => (
                            <tr key={rec.month} className="hover:bg-slate-800/50 transition">
                              <td className="px-5 py-3.5 font-medium text-white">
                                {rec.monthLabel || rec.month}
                              </td>
                              <td className="px-5 py-3.5">
                                <span className="text-xs bg-blue-950 text-blue-400 px-2 py-1 rounded-lg border border-blue-900">
                                  {rec.role || "—"}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-center text-slate-400">{rec.workDays}</td>
                              <td className="px-5 py-3.5 text-center">
                                <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full bg-green-900 text-green-400 font-semibold text-xs">
                                  {rec.present}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <span className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full font-semibold text-xs ${
                                  rec.absent > 0
                                    ? "bg-red-900 text-red-400"
                                    : "bg-slate-800 text-slate-500"
                                }`}>
                                  {rec.absent}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <span className={`text-xs font-medium ${
                                  rec.lateMinutes > 0 ? "text-amber-400" : "text-slate-500"
                                }`}>
                                  {rec.lateMinutes} min
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 py-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">No attendance records found</p>
                    <p className="text-slate-600 text-xs mt-1">Your HR team hasn't uploaded attendance data yet.</p>
                  </div>
                )}
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}