"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebaremp";
import Navbar from "@/app/components/navbaremp";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString("en-LK")}`;

// ─── Payslip Modal (read-only) ────────────────────────────────────────────────
function PayslipModal({ payroll, onClose }) {
  if (!payroll) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        <div className="bg-[#0f172a] px-6 py-5 rounded-t-2xl border-b border-slate-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Payslip</p>
              <h2 className="text-xl font-bold text-white">{payroll.name}</h2>
              <p className="text-slate-400 text-xs mt-1">
                Emp #{payroll.empNo} · {payroll.role} · {payroll.department} · {payroll.monthLabel || payroll.month}
              </p>
            </div>
            <button onClick={onClose}
              className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-xl leading-none">×</button>
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Earnings</p>
            <div className="space-y-2">
              {[
                ["Basic Salary",        payroll.basicSalary],
                ["Transport Allowance", payroll.transportAllowance],
                ["Meal Allowance",      payroll.mealAllowance],
                ["Other Allowance",     payroll.otherAllowance],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-medium text-slate-200">{fmt(val)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-semibold text-slate-100 pt-2 border-t border-slate-800">
                <span>Gross Salary</span><span>{fmt(payroll.grossSalary)}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Deductions</p>
            <div className="space-y-2">
              {[
                ["EPF (Employee)",   payroll.epfEmployee],
                ["ETF",              payroll.etf],
                ["Late Deduction",   payroll.lateDeduction],
                ["Other Deductions", payroll.otherDeduction],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-medium text-red-400">− {fmt(val)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-semibold text-red-400 pt-2 border-t border-slate-800">
                <span>Total Deductions</span><span>− {fmt(payroll.totalDeductions)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl px-5 py-4 flex items-center justify-between">
            <span className="text-white font-semibold">Net Pay</span>
            <span className="text-green-400 text-2xl font-bold">{fmt(payroll.netPay)}</span>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button onClick={onClose}
            className="w-full border border-slate-700 text-slate-300 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MySalaryPage() {
  const [empNo, setEmpNo] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeDept, setEmployeeDept] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewPayslip, setViewPayslip] = useState(null);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (!user?.email) {
      setError("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    // empNo comes ONLY from the logged-in user's own email — never
    // something the user can type or change in the UI.
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

        return fetch(`${BASE}/payroll?empNo=${data.empNo}`);
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
        setError("Failed to load salary records.");
        setLoading(false);
      });
  }, []);

  const totalNet    = records.reduce((s, r) => s + (r.netPay || 0), 0);
  const totalGross  = records.reduce((s, r) => s + (r.grossSalary || 0), 0);
  const totalDed    = records.reduce((s, r) => s + (r.totalDeductions || 0), 0);
 
  const latestNetPay = records[0]?.netPay || 0;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto bg-slate-950">
          <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

            <div>
              <h1 className="text-2xl font-bold text-white">My Salary</h1>
              <p className="text-sm text-slate-500 mt-1">
                Your monthly payslips and earnings history
              </p>
            </div>

            {loading && (
              <div className="py-20 text-center">
                <svg className="animate-spin w-7 h-7 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <p className="text-slate-500 text-sm mt-3">Loading your salary records…</p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

  <div className="bg-slate-800 rounded-xl p-4">
    <p className="text-xs text-slate-400">Employee No</p>
    <p className="text-white font-semibold">{empNo}</p>
  </div>

  <div className="bg-slate-800 rounded-xl p-4">
    <p className="text-xs text-slate-400">Name</p>
    <p className="text-white font-semibold">{employeeName}</p>
  </div>

  <div className="bg-slate-800 rounded-xl p-4">
    <p className="text-xs text-slate-400">Department</p>
    <p className="text-white font-semibold">{employeeDept}</p>
  </div>

  <div className="bg-slate-800 rounded-xl p-4">
    <p className="text-xs text-slate-400">Role</p>
    <p className="text-white font-semibold">{employeeRole}</p>
  </div>

  <div className="bg-green-950 border border-green-900 rounded-xl p-4 md:col-span-2">
    <p className="text-xs text-green-500">Monthly Net Salary</p>
<p className="text-2xl font-bold text-green-400">
  {fmt(latestNetPay)}
</p>
  </div>

</div>
                </div>

                {/* Monthly Table */}
                {records.length > 0 ? (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-800">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Payslip History · {records.length} {records.length === 1 ? "record" : "records"}
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                            <th className="px-5 py-3 text-left">Month</th>
                            <th className="px-5 py-3 text-left">Role</th>
                            <th className="px-5 py-3 text-right">Basic</th>
                            <th className="px-5 py-3 text-right">Gross</th>
                            <th className="px-5 py-3 text-right">Deductions</th>
                            <th className="px-5 py-3 text-right">Net Pay</th>
                            <th className="px-5 py-3 text-center">Payslip</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {records.map((rec) => (
                            <tr key={rec._id} className="hover:bg-slate-800/50 transition">
                              <td className="px-5 py-3.5 font-medium text-white">
                                {rec.monthLabel || rec.month}
                              </td>
                              <td className="px-5 py-3.5">
                                <span className="text-xs bg-blue-950 text-blue-400 px-2 py-1 rounded-lg border border-blue-900">
                                  {rec.role || "—"}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-right text-slate-400 text-xs whitespace-nowrap">
                                {fmt(rec.basicSalary)}
                              </td>
                              <td className="px-5 py-3.5 text-right text-slate-300 text-xs whitespace-nowrap">
                                {fmt(rec.grossSalary)}
                              </td>
                              <td className="px-5 py-3.5 text-right text-red-400 text-xs whitespace-nowrap">
                                {fmt(rec.totalDeductions)}
                              </td>
                              <td className="px-5 py-3.5 text-right font-bold text-green-400 text-xs whitespace-nowrap">
                                {fmt(rec.netPay)}
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <button
                                  onClick={() => setViewPayslip(rec)}
                                  className="inline-flex items-center gap-1 text-xs bg-blue-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
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
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 py-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">No salary records found</p>
                    <p className="text-slate-600 text-xs mt-1">Your HR team hasn't generated payroll yet.</p>
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