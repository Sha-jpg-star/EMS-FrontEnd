"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebaradmin";
import Navbar from "@/app/components/navbar";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = {
  getAllMonths: async () => {
    const res = await fetch(`${BASE}/attendance/months`);
    return res.json();
  },
  getPayroll: async (department, month) => {
    const p = new URLSearchParams();
    if (department) p.set("department", department);
    if (month) p.set("month", month);
    const res = await fetch(`${BASE}/payroll?${p}`);
    return res.json();
  },
  getDepartmentStatus: async (month) => {
    const q = month ? `?month=${month}` : "";
    const res = await fetch(`${BASE}/payroll/status${q}`);
    return res.json();
  },
};

const DEPARTMENTS = ["Cleaning", "Security", "Non-Academic", "Academic"];
const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString("en-LK")}`;

// PAYSLIP VIEW MODAL (read-only) — monthLabel now passed as a prop, not read from payroll record
function PayslipModal({ payroll, monthLabel, onClose }) {
  if (!payroll) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        <div className="bg-[#0f172a] px-6 py-5 rounded-t-2xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Payslip</p>
              <h2 className="text-xl font-bold text-white">{payroll.name}</h2>
              <p className="text-slate-400 text-xs mt-1">
                Emp #{payroll.empNo} · {payroll.role} · {payroll.department} Department · {monthLabel}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Work Days", value: payroll.workDays,    color: "text-white" },
              { label: "Present",   value: payroll.present,     color: "text-green-400" },
              { label: "Absent",    value: payroll.absent,      color: "text-red-400" },
              { label: "Late min",  value: payroll.lateMinutes, color: "text-amber-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-2.5 text-center">
                <p className="text-slate-400 text-xs mb-1">{s.label}</p>
                <p className={`font-bold text-lg leading-none ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Earnings</p>
            <div className="space-y-2">
              {[
                ["Basic Salary",        payroll.basicSalary],
                ["Transport Allowance", payroll.transportAllowance],
                ["Meal Allowance",      payroll.mealAllowance],
                ["Other Allowance",     payroll.otherAllowance],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-medium text-slate-800">{fmt(val)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-semibold text-slate-800 pt-2 border-t border-slate-100">
                <span>Gross Salary</span>
                <span>{fmt(payroll.grossSalary)}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Deductions</p>
            <div className="space-y-2">
              {[
                ["EPF (Employee)",  payroll.epfEmployee],
                ["ETF",            payroll.etf],
                ["Late Deduction", payroll.lateDeduction],
                ["Other Deductions", payroll.otherDeduction],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-medium text-red-500">− {fmt(val)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-semibold text-red-600 pt-2 border-t border-slate-100">
                <span>Total Deductions</span>
                <span>− {fmt(payroll.totalDeductions)}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] rounded-2xl px-5 py-4 flex items-center justify-between">
            <span className="text-white font-semibold">Net Pay</span>
            <span className="text-green-400 text-2xl font-bold">{fmt(payroll.netPay)}</span>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPayrollPage() {
  const [months, setMonths]               = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDept, setSelectedDept]   = useState("All");
  const [deptStatus, setDeptStatus]       = useState([]);
  const [payrolls, setPayrolls]           = useState([]);
  const [loading, setLoading]             = useState(false);
  const [viewPayslip, setViewPayslip]     = useState(null);

  useEffect(() => {
    api.getAllMonths().then((data) => {
      const arr = Array.isArray(data) ? data : [];
      setMonths(arr);
      if (arr.length > 0) setSelectedMonth(arr[0].month);
    });
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      api.getDepartmentStatus(selectedMonth).then((d) =>
        setDeptStatus(Array.isArray(d) ? d : [])
      );
    }
  }, [selectedMonth]);

  useEffect(() => {
    if (!selectedMonth) return;
    setLoading(true);
    const dept = selectedDept === "All" ? "" : selectedDept;
    api.getPayroll(dept, selectedMonth).then((data) => {
      setPayrolls(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [selectedMonth, selectedDept]);

  const currentLabel = months.find((m) => m.month === selectedMonth)?.label || "";

  const totalGross  = payrolls.reduce((s, p) => s + (p.grossSalary     || 0), 0);
  const totalDed    = payrolls.reduce((s, p) => s + (p.totalDeductions  || 0), 0);
  const totalNet    = payrolls.reduce((s, p) => s + (p.netPay           || 0), 0);
  const totalEmp    = payrolls.length;

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto ">
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Payroll Overview</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Monthly payroll summary across all departments — read only view.
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <select
                  value={selectedMonth}
                  onChange={(e) => { setSelectedMonth(e.target.value); setSelectedDept("All"); }}
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

            {payrolls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Total Employees",   value: totalEmp,               color: "text-slate-800" },
                  { label: "Total Gross",        value: fmt(totalGross),        color: "text-blue-600"  },
                  { label: "Total Deductions",   value: fmt(totalDed),          color: "text-red-500"   },
                  { label: "Total Net Payable",  value: fmt(totalNet),          color: "text-green-600" },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4">
                    <p className="text-xs font-medium text-slate-500 mb-1">{s.label}</p>
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            )}

            {selectedMonth && deptStatus.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DEPARTMENTS.map((dept) => {
                  const info   = deptStatus.find((d) => d.department === dept);
                  const active = selectedDept === dept;
                  return (
                    <button
                      key={dept}
                      onClick={() => setSelectedDept(active ? "All" : dept)}
                      className={`p-4 rounded-2xl border text-left transition ${
                        active
                          ? "bg-[#0f172a] border-[#0f172a] shadow-md"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className={`font-semibold text-sm ${active ? "text-white" : "text-slate-800"}`}>
                          {dept}
                        </p>
                        {info?.hasPayroll && (
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${active ? "bg-green-400" : "bg-green-500"}`} />
                        )}
                      </div>
                      <p className={`text-xs mt-1 ${active ? "text-slate-400" : info?.hasPayroll ? "text-green-600" : "text-slate-400"}`}>
                        {info?.hasPayroll ? `${info.count} employees · ready` : "No payroll yet"}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {selectedDept === "All" ? "All Departments" : selectedDept}
                    {currentLabel && ` · ${currentLabel}`}
                  </h2>
                  {payrolls.length > 0 && (
                    <p className="text-xs text-slate-400 mt-0.5">{payrolls.length} records</p>
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

              {payrolls.length > 0 && !loading && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 bg-slate-50">
                        <th className="text-left px-5 py-3">Emp No</th>
                        <th className="text-left px-5 py-3">Name</th>
                        <th className="text-left px-5 py-3">Department</th>
                        <th className="text-left px-5 py-3">Role</th>
                        <th className="text-center px-5 py-3">Attendance</th>
                        <th className="text-center px-5 py-3">Late</th>
                        <th className="text-right px-5 py-3">Basic</th>
                        <th className="text-right px-5 py-3">Gross</th>
                        <th className="text-right px-5 py-3">Deductions</th>
                        <th className="text-right px-5 py-3">Net Pay</th>
                        <th className="text-center px-5 py-3">Payslip</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payrolls.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50 transition">
                          <td className="px-5 py-3.5 font-semibold text-slate-800">{p.empNo}</td>
                          <td className="px-5 py-3.5 text-slate-700 font-medium whitespace-nowrap">{p.name}</td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">
                              {p.department}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-medium border border-blue-100 whitespace-nowrap">
                              {p.role}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-center text-slate-500">
                            <span className="text-green-600 font-semibold">{p.present}</span>
                            <span className="text-slate-400">/{p.workDays}</span>
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span className={`text-xs font-medium ${p.lateMinutes > 0 ? "text-amber-600" : "text-slate-400"}`}>
                              {p.lateMinutes} min
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right text-slate-600 text-xs whitespace-nowrap">
                            {fmt(p.basicSalary)}
                          </td>
                          <td className="px-5 py-3.5 text-right text-slate-700 text-xs whitespace-nowrap">
                            {fmt(p.grossSalary)}
                          </td>
                          <td className="px-5 py-3.5 text-right text-red-500 text-xs whitespace-nowrap">
                            {fmt(p.totalDeductions)}
                          </td>
                          <td className="px-5 py-3.5 text-right font-bold text-green-600 text-xs whitespace-nowrap">
                            {fmt(p.netPay)}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <button
                              onClick={() => setViewPayslip(p)}
                              className="inline-flex items-center gap-1 text-xs bg-[#0f172a] text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-700 transition whitespace-nowrap"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    <tfoot>
                      <tr className="border-t-2 border-slate-200 bg-slate-50">
                        <td colSpan={6} className="px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Total · {payrolls.length} employees
                        </td>
                        <td className="px-5 py-3 text-right text-xs font-semibold text-slate-700">—</td>
                        <td className="px-5 py-3 text-right text-xs font-semibold text-slate-800 whitespace-nowrap">
                          {fmt(totalGross)}
                        </td>
                        <td className="px-5 py-3 text-right text-xs font-semibold text-red-600 whitespace-nowrap">
                          {fmt(totalDed)}
                        </td>
                        <td className="px-5 py-3 text-right text-xs font-bold text-green-600 whitespace-nowrap">
                          {fmt(totalNet)}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {loading && (
                <div className="py-12 text-center">
                  <svg className="animate-spin w-6 h-6 text-slate-400 mx-auto" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <p className="text-slate-400 text-sm mt-2">Loading payroll…</p>
                </div>
              )}

              {!loading && selectedMonth && payrolls.length === 0 && (
                <div className="py-14 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-sm font-medium">No payroll data</p>
                  <p className="text-slate-400 text-xs mt-1">
                    HR needs to generate payroll for this period first.
                  </p>
                </div>
              )}

              {!selectedMonth && (
                <div className="py-12 text-center">
                  <p className="text-slate-400 text-sm">Select a month to view payroll records.</p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      <PayslipModal
        payroll={viewPayslip}
        monthLabel={currentLabel}
        onClose={() => setViewPayslip(null)}
      />
    </div>
  );
}