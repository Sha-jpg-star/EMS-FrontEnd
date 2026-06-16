"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebarhr";
import Navbar from "@/app/components/navbarhr";



const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = {
  getMonths: async (department) => {
    const p = new URLSearchParams();
    if (department) p.set("department", department);
    const res = await fetch(`${BASE}/attendance/months?${p}`);
    return res.json();
  },
  generatePayroll: async (department, month) => {
    const res = await fetch(`${BASE}/payroll/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ department, month }),
    });
    return res.json();
  },
  getPayroll: async (department, month) => {
    const p = new URLSearchParams();
    if (department) p.set("department", department);
    if (month) p.set("month", month);
    const res = await fetch(`${BASE}/payroll?${p}`);
    return res.json();
  },
  editPayroll: async (id, data) => {
    const res = await fetch(`${BASE}/payroll/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getDepartmentStatus: async (month) => {
    const q = month ? `?month=${month}` : "";
    const res = await fetch(`${BASE}/payroll/status${q}`);
    return res.json();
  },
};


const DEPARTMENTS = ["Cleaning", "Security", "Non-Academic", "Academic"];

const SALARY_FIELDS = [
  { key: "basicSalary",        label: "Basic Salary",        section: "earnings" },
  { key: "transportAllowance", label: "Transport Allowance", section: "earnings" },
  { key: "mealAllowance",      label: "Meal Allowance",      section: "earnings" },
  { key: "otherAllowance",     label: "Other Allowance",     section: "earnings" },
  { key: "epfEmployee",        label: "EPF Employee",        section: "deductions" },
  { key: "etf",                label: "ETF",                 section: "deductions" },
  { key: "lateDeduction",      label: "Late Deduction",      section: "deductions" },
  { key: "otherDeduction",     label: "Other Deduction",     section: "deductions" },
];


const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString("en-LK")}`;


function PayslipModal({ payroll, onClose, onEdit }) {
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
              { label: "Work Days", value: payroll.workDays, color: "text-white" },
              { label: "Present",   value: payroll.present,    color: "text-green-400" },
              { label: "Absent",    value: payroll.absent,     color: "text-red-400" },
              { label: "Late min",  value: payroll.lateMinutes,color: "text-amber-400" },
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
              {[["Basic Salary", payroll.basicSalary], ["Transport Allowance", payroll.transportAllowance],
                ["Meal Allowance", payroll.mealAllowance], ["Other Allowance", payroll.otherAllowance]].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-medium text-slate-800">{fmt(val)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-semibold text-slate-800 pt-2 border-t border-slate-100">
                <span>Gross Salary</span><span>{fmt(payroll.grossSalary)}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Deductions</p>
            <div className="space-y-2">
              {[["EPF (Employee)", payroll.epfEmployee], ["ETF", payroll.etf],
                ["Late Deduction", payroll.lateDeduction], ["Other Deductions", payroll.otherDeduction]].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-medium text-red-500">− {fmt(val)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-semibold text-red-600 pt-2 border-t border-slate-100">
                <span>Total Deductions</span><span>− {fmt(payroll.totalDeductions)}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] rounded-2xl px-5 py-4 flex items-center justify-between">
            <span className="text-white font-semibold">Net Pay</span>
            <span className="text-green-400 text-2xl font-bold">{fmt(payroll.netPay)}</span>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-2">
          <button onClick={() => onEdit(payroll)}
            className="flex-1 bg-[#0f172a] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-slate-700 transition flex items-center justify-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
          <button onClick={onClose}
            className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


function EditSalaryModal({ payroll, onClose, onSave, loading }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (payroll) {
      const init = {};
      SALARY_FIELDS.forEach((f) => { init[f.key] = payroll[f.key] ?? 0; });
      setForm(init);
    }
  }, [payroll]);

  if (!payroll) return null;

  const earnings   = SALARY_FIELDS.filter((f) => f.section === "earnings");
  const deductions = SALARY_FIELDS.filter((f) => f.section === "deductions");
  const gross    = earnings.reduce((s, f)   => s + (Number(form[f.key]) || 0), 0);
  const totalDed = deductions.reduce((s, f) => s + (Number(form[f.key]) || 0), 0);
  const net      = gross - totalDed;
  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="bg-[#0f172a] px-5 py-4 rounded-t-2xl flex items-start justify-between">
          <div>
            <h2 className="text-white font-semibold text-base">Edit Salary</h2>
            <p className="text-slate-400 text-xs mt-0.5">
              {payroll.name} · Emp #{payroll.empNo} · {payroll.department} · {payroll.monthLabel}
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              Present: {payroll.present} days · Late: {payroll.lateMinutes} min
            </p>
          </div>
          <button onClick={onClose}
            className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-xl leading-none">
            ×
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Earnings</p>
            <div className="grid grid-cols-2 gap-3">
              {earnings.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-slate-600 mb-1">{f.label} (Rs.)</label>
                  <input type="number" min="0" value={form[f.key] ?? 0}
                    onChange={(e) => set(f.key, e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Deductions</p>
            <div className="grid grid-cols-2 gap-3">
              {deductions.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-slate-600 mb-1">{f.label} (Rs.)</label>
                  <input type="number" min="0" value={form[f.key] ?? 0}
                    onChange={(e) => set(f.key, e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl px-4 py-3 space-y-2 border border-slate-100">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Gross Salary</span>
              <span className="font-medium">Rs. {gross.toLocaleString("en-LK")}</span>
            </div>
            <div className="flex justify-between text-sm text-red-500">
              <span>Total Deductions</span>
              <span>− Rs. {totalDed.toLocaleString("en-LK")}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Net Pay</span>
              <span className="text-green-600">Rs. {net.toLocaleString("en-LK")}</span>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 flex gap-2">
          <button onClick={() => onSave(form)} disabled={loading}
            className="flex-1 bg-[#0f172a] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-slate-700 transition disabled:opacity-50">
            {loading ? "Saving…" : "✓ Save Salary"}
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

export default function PayrollPage() {
  const [deptStatus, setDeptStatus]       = useState([]);
  const [selectedDept, setSelectedDept]   = useState("Cleaning");
  const [months, setMonths]               = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [payrolls, setPayrolls]           = useState([]);
  const [generating, setGenerating]       = useState(false);
  const [loading, setLoading]             = useState(false);
  const [genMsg, setGenMsg]               = useState(null);
  const [viewPayslip, setViewPayslip]     = useState(null);
  const [editPayroll, setEditPayroll]     = useState(null);
  const [saving, setSaving]               = useState(false);

  useEffect(() => {
    if (selectedDept) {
      api.getMonths(selectedDept).then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setMonths(arr);
        setSelectedMonth(arr[0]?.month || "");
        setPayrolls([]);
      });
    }
  }, [selectedDept]);

  useEffect(() => {
    if (selectedDept && selectedMonth) loadPayroll();
  }, [selectedDept, selectedMonth]);

  useEffect(() => {
    if (selectedMonth)
      api.getDepartmentStatus(selectedMonth).then((d) => setDeptStatus(Array.isArray(d) ? d : []));
  }, [selectedMonth, payrolls.length]);

  const loadPayroll = async () => {
    setLoading(true);
    const data = await api.getPayroll(selectedDept, selectedMonth);
    setPayrolls(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleGenerate = async () => {
    if (!selectedDept || !selectedMonth) return;
    setGenerating(true);
    setGenMsg(null);
    const res = await api.generatePayroll(selectedDept, selectedMonth);
    setGenerating(false);
    if (res.data) {
      setGenMsg({ type: "success", text: `Payroll generated for ${res.count} employees` });
      await loadPayroll();
    } else {
      setGenMsg({ type: "error", text: res.message || "Failed to generate payroll." });
    }
  };

  const handleSaveEdit = async (form) => {
    setSaving(true);
    await api.editPayroll(editPayroll._id, form);
    setSaving(false);
    setEditPayroll(null);
    setViewPayslip(null);
    await loadPayroll();
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
        <main className="flex-1 overflow-y-auto ">
          <div className="max-w-6xl mx-auto px-3 py-4 space-y-6">

            {/* Page title */}
            <div>
              <h1 className="text-2xl font-bold text-white">Payroll & Payslips</h1>
              <p className="text-sm text-slate-500 mt-1">
                Generate and manage monthly payroll. Edit earnings and deductions per employee.
              </p>
            </div>

            {/* ── Department Cards ──────────────────────────────────────── */}
            {selectedMonth && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DEPARTMENTS.map((dept) => {
                  const info   = deptStatus.find((d) => d.department === dept);
                  const active = dept === selectedDept;
                  return (
                    <button key={dept} onClick={() => setSelectedDept(dept)}
                      className={`p-4 rounded-2xl border text-left transition ${
                        active ? "bg-[#0f172a] border-[#0f172a] shadow-md" : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                      }`}>
                      <p className={`font-semibold text-sm ${active ? "text-white" : "text-slate-800"}`}>{dept}</p>
                      <p className={`text-xs mt-1 ${active ? "text-slate-400" : info?.hasPayroll ? "text-green-600" : "text-slate-400"}`}>
                        {info?.hasPayroll ? `${info.count} employees · ready` : "No payroll yet"}
                      </p>
                      {info?.hasPayroll && !active && (
                        <span className="inline-block mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/*  Controls  */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-4 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2 flex-wrap items-center">
                <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">— Select Month —</option>
                  {months.map((m) => <option key={m.month} value={m.month}>{m.label}</option>)}
                </select>
                {genMsg && (
                  <span className={`text-xs px-3 py-1.5 rounded-lg ${genMsg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                    {genMsg.type === "success" ? "✓ " : "✕ "}{genMsg.text}
                  </span>
                )}
              </div>

              <button onClick={handleGenerate} disabled={generating || !selectedMonth}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
                {generating ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Generating…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Payroll
                  </>
                )}
              </button>
            </div>

            {/* ── Payroll Table ──────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {payrolls.length > 0 && (
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-100">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    {selectedDept} — {currentLabel} · {payrolls.length} employees
                  </p>
                </div>
              )}

              {payrolls.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 bg-white">
                        {["Emp No", "Name", "Attendance", "Late", "Basic Salary", "Gross", "Deductions", "Net Pay", "Actions"].map((h) => (
                          <th key={h} className="text-left px-5 py-3 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payrolls.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50 transition">
                          <td className="px-5 py-3.5 font-semibold text-[#0f172a]">{p.empNo}</td>
                          <td className="px-5 py-3.5 text-slate-700 font-medium whitespace-nowrap">{p.name}</td>
                          <td className="px-5 py-3.5 text-slate-500">
                            <span className="text-green-600 font-semibold">{p.present}</span>
                            <span className="text-slate-400">/{p.workDays}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-medium ${p.lateMinutes > 0 ? "text-amber-600" : "text-slate-400"}`}>
                              {p.lateMinutes} min
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-600 text-xs whitespace-nowrap">
                            Rs. {Number(p.basicSalary).toLocaleString("en-LK")}
                          </td>
                          <td className="px-5 py-3.5 text-slate-700 text-xs whitespace-nowrap">
                            Rs. {Number(p.grossSalary).toLocaleString("en-LK")}
                          </td>
                          <td className="px-5 py-3.5 text-red-500 text-xs whitespace-nowrap">
                            Rs. {Number(p.totalDeductions).toLocaleString("en-LK")}
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-green-600 text-xs whitespace-nowrap">
                            Rs. {Number(p.netPay).toLocaleString("en-LK")}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex gap-1.5">
                              <button onClick={() => setEditPayroll(p)}
                                className="inline-flex items-center gap-1 text-xs border border-slate-200 text-slate-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition whitespace-nowrap">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit
                              </button>
                              <button onClick={() => setViewPayslip(p)}
                                className="inline-flex items-center gap-1 text-xs bg-[#0f172a] text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-700 transition whitespace-nowrap">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
                  <p className="text-slate-400 text-sm mt-2">Loading payroll…</p>
                </div>
              )}

              {!loading && selectedMonth && payrolls.length === 0 && (
                <div className="py-14 text-center px-6">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 font-medium text-sm">No payroll generated yet</p>
                  <p className="text-slate-400 text-xs mt-1">Upload attendance for {selectedDept}, then click Generate Payroll.</p>
                </div>
              )}

              {!selectedMonth && (
                <div className="py-12 text-center">
                  <p className="text-slate-400 text-sm">Select a department and month to view payroll.</p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Modals */}
      <PayslipModal
        payroll={viewPayslip}
        onClose={() => setViewPayslip(null)}
        onEdit={(p) => { setViewPayslip(null); setEditPayroll(p); }}
      />
      <EditSalaryModal
        payroll={editPayroll}
        onClose={() => setEditPayroll(null)}
        onSave={handleSaveEdit}
        loading={saving}
      />
    </div>
  );
}