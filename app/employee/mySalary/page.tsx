"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebaremp";
import Navbar from "@/app/components/navbaremp";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString("en-LK")}`;

//  PAYSLIP MODAL 
function PayslipModal({ payroll, onClose }) {
  if (!payroll) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-[#0f172a] px-6 py-5 rounded-t-2xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Payslip</p>
              <h2 className="text-xl font-bold text-white">{payroll.name}</h2>
              <p className="text-slate-400 text-xs mt-1">
                Emp #{payroll.empNo} · {payroll.department} Department · {payroll.monthLabel}
              </p>
            </div>
            <button onClick={onClose}
              className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-xl leading-none">
              ×
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Work Days", value: payroll.workDays,    color: "text-white"     },
              { label: "Present",   value: payroll.present,     color: "text-green-400" },
              { label: "Absent",    value: payroll.absent,      color: "text-red-400"   },
              { label: "Late min",  value: payroll.lateMinutes, color: "text-amber-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-2.5 text-center">
                <p className="text-slate-400 text-xs mb-1">{s.label}</p>
                <p className={`font-bold text-lg leading-none ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Earnings */}
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

          {/* Deductions */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Deductions</p>
            <div className="space-y-2">
              {[
                ["EPF (Employee)",    payroll.epfEmployee],
                ["ETF",              payroll.etf],
                ["Late Deduction",   payroll.lateDeduction],
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

          {/* Net Pay */}
          <div className="bg-[#0f172a] rounded-2xl px-5 py-4 flex items-center justify-between">
            <span className="text-white font-semibold">Net Pay</span>
            <span className="text-green-400 text-2xl font-bold">{fmt(payroll.netPay)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button onClick={onClose}
            className="w-full border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function EmployeePayrollPage() {
  const [empNo, setEmpNo]                 = useState(null);
  const [allPayrolls, setAllPayrolls]     = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [viewPayslip, setViewPayslip]     = useState(null);

  // Step 1: Get email from sessionStorage → fetch empNo from backend (same as profile page)
  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) {
      setError("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    const user = JSON.parse(stored);

    // If empNo directly in session, use it
    if (user.empNo) {
      setEmpNo(user.empNo);
      return;
    }

    // Otherwise fetch by email (same as profile page)
    if (user.email) {
      fetch(`${BASE}/employee/by-email/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.empNo) {
            setEmpNo(data.empNo);
          } else {
            setError("Employee record not found.");
            setLoading(false);
          }
        })
        .catch(() => {
          setError("Failed to load employee data.");
          setLoading(false);
        });
    } else {
      setError("Session expired. Please log in again.");
      setLoading(false);
    }
  }, []);

  // Step 2: Fetch payroll records using empNo
  useEffect(() => {
    if (!empNo) return;
    setLoading(true);
    fetch(`${BASE}/payroll?empNo=${empNo}`)
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        arr.sort((a, b) => b.month.localeCompare(a.month));
        setAllPayrolls(arr);
        if (arr.length > 0) setSelectedMonth(arr[0].month);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load payroll data.");
        setLoading(false);
      });
  }, [empNo]);

  const months  = [...new Map(allPayrolls.map((r) => [r.month, { month: r.month, label: r.monthLabel }])).values()];
  const current = allPayrolls.find((r) => r.month === selectedMonth) || null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto bg-slate-950">
          <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

            {/* Page title */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">My Payslips</h1>
                <p className="text-sm text-slate-500 mt-1">View your monthly salary and deductions.</p>
              </div>
              {months.length > 0 && (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {months.map((m) => (
                    <option key={m.month} value={m.month}>{m.label}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 px-5 py-4 bg-red-950 border border-red-800 rounded-2xl text-red-400 text-sm">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Loading */}
            {loading && !error && (
              <div className="py-20 text-center">
                <svg className="animate-spin w-7 h-7 text-slate-400 mx-auto" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <p className="text-slate-400 text-sm mt-3">Loading your payslips…</p>
              </div>
            )}

            {/* No data */}
            {!loading && !error && allPayrolls.length === 0 && (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                </div>
                <p className="text-slate-500 font-medium">No payslips available</p>
                <p className="text-slate-600 text-sm mt-1">Your payroll hasn't been processed yet.</p>
              </div>
            )}

            {/* Data */}
            {!loading && !error && current && (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Basic Salary", value: fmt(current.basicSalary),     color: "text-white",     bg: "bg-slate-800 border-slate-700"   },
                    { label: "Gross Salary", value: fmt(current.grossSalary),     color: "text-blue-400",  bg: "bg-blue-950 border-blue-900"     },
                    { label: "Deductions",   value: fmt(current.totalDeductions), color: "text-red-400",   bg: "bg-red-950 border-red-900"       },
                    { label: "Net Pay",      value: fmt(current.netPay),          color: "text-green-400", bg: "bg-green-950 border-green-900"   },
                  ].map((s) => (
                    <div key={s.label} className={`${s.bg} border rounded-2xl px-4 py-4`}>
                      <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                      <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Attendance summary */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 px-6 py-5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Attendance · {current.monthLabel}
                  </p>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    {[
                      { label: "Work Days", value: current.workDays,    color: "text-white"     },
                      { label: "Present",   value: current.present,     color: "text-green-400" },
                      { label: "Absent",    value: current.absent,      color: "text-red-400"   },
                      { label: "Late min",  value: current.lateMinutes, color: "text-amber-400" },
                    ].map((s) => (
                      <div key={s.label} className="bg-slate-800 rounded-xl py-3">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full payslip card */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="bg-[#0f172a] px-6 py-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Monthly Payslip</p>
                      <h2 className="text-lg font-bold text-white">{current.monthLabel}</h2>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {current.department} Department · Emp #{current.empNo}
                      </p>
                    </div>
                    <button onClick={() => setViewPayslip(current)}
                      className="bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 rounded-xl transition flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Full Payslip
                    </button>
                  </div>

                  {/* Earnings & Deductions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                    <div className="px-6 py-5">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Earnings</p>
                      <div className="space-y-2.5">
                        {[
                          ["Basic Salary",        current.basicSalary],
                          ["Transport Allowance", current.transportAllowance],
                          ["Meal Allowance",      current.mealAllowance],
                          ["Other Allowance",     current.otherAllowance],
                        ].map(([label, val]) => (
                          <div key={label} className="flex justify-between text-sm">
                            <span className="text-slate-400">{label}</span>
                            <span className="font-medium text-slate-200">{fmt(val)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-700">
                          <span>Gross</span>
                          <span className="text-blue-400">{fmt(current.grossSalary)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-5">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Deductions</p>
                      <div className="space-y-2.5">
                        {[
                          ["EPF (Employee)",    current.epfEmployee],
                          ["ETF",              current.etf],
                          ["Late Deduction",   current.lateDeduction],
                          ["Other Deductions", current.otherDeduction],
                        ].map(([label, val]) => (
                          <div key={label} className="flex justify-between text-sm">
                            <span className="text-slate-400">{label}</span>
                            <span className="font-medium text-red-400">− {fmt(val)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-sm font-bold text-red-400 pt-2 border-t border-slate-700">
                          <span>Total Deductions</span>
                          <span>− {fmt(current.totalDeductions)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Net Pay */}
                  <div className="bg-slate-800 border-t border-slate-700 px-6 py-4 flex items-center justify-between">
                    <span className="text-slate-300 font-semibold">Net Pay</span>
                    <span className="text-2xl font-bold text-green-400">{fmt(current.netPay)}</span>
                  </div>
                </div>

                {/* History table */}
                {allPayrolls.length > 1 && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-800">
                      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payslip History</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                            <th className="text-left px-6 py-3">Month</th>
                            <th className="text-right px-4 py-3">Basic</th>
                            <th className="text-right px-4 py-3">Gross</th>
                            <th className="text-right px-4 py-3">Deductions</th>
                            <th className="text-right px-4 py-3">Net Pay</th>
                            <th className="text-center px-4 py-3">Payslip</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {allPayrolls.map((p) => {
                            const isSelected = p.month === selectedMonth;
                            return (
                              <tr key={p._id} onClick={() => setSelectedMonth(p.month)}
                                className={`cursor-pointer transition ${
                                  isSelected ? "bg-blue-950 border-l-4 border-blue-500" : "hover:bg-slate-800/50"
                                }`}>
                                <td className="px-6 py-3 font-medium text-white">{p.monthLabel}</td>
                                <td className="px-4 py-3 text-right text-slate-400 text-xs">{fmt(p.basicSalary)}</td>
                                <td className="px-4 py-3 text-right text-slate-300 text-xs">{fmt(p.grossSalary)}</td>
                                <td className="px-4 py-3 text-right text-red-400 text-xs">{fmt(p.totalDeductions)}</td>
                                <td className="px-4 py-3 text-right font-bold text-green-400 text-xs">{fmt(p.netPay)}</td>
                                <td className="px-4 py-3 text-center">
                                  <button onClick={(e) => { e.stopPropagation(); setViewPayslip(p); }}
                                    className="text-xs bg-[#0f172a] text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-700 transition">
                                    View
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>
        </main>
      </div>

      <PayslipModal payroll={viewPayslip} onClose={() => setViewPayslip(null)} />
    </div>
  );
}