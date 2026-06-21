"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebarhr";
import Navbar from "@/app/components/navbarhr";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MonthOption {
  month: string;
  label: string;
}

interface PayrollRecord {
  _id: string;
  empNo: string;
  name: string;
  department: string;
  role: string;
  month: string;
  workDays: number;
  present: number;
  absent: number;
  lateMinutes: number;
  basicSalary: number;
  transportAllowance: number;
  mealAllowance: number;
  otherAllowance: number;
  grossSalary: number;
  epfEmployee: number;
  etf: number;
  lateDeduction: number;
  otherDeduction: number;
  totalDeductions: number;
  netPay: number;
}

interface DeptStatus {
  department: string;
  count: number;
  hasPayroll: boolean;
}

interface GenResult {
  message: string;
  count: number;
  data: PayrollRecord[];
  skipped?: string[]; // empNos with no attendance uploaded
}

// ─── API ──────────────────────────────────────────────────────────────────────
const api = {
  getMonths: async (department: string): Promise<MonthOption[]> => {
    const p = new URLSearchParams({ department });
    const res = await fetch(`${BASE}/attendance/months?${p}`);
    return res.json();
  },
  generatePayroll: async (department: string, month: string): Promise<GenResult> => {
    const res = await fetch(`${BASE}/payroll/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ department, month }),
    });
    return res.json();
  },
  getPayroll: async (department: string, month: string): Promise<PayrollRecord[]> => {
    const p = new URLSearchParams({ department, month });
    const res = await fetch(`${BASE}/payroll?${p}`);
    return res.json();
  },
  editPayroll: async (id: string, data: Partial<PayrollRecord>): Promise<PayrollRecord> => {
    const res = await fetch(`${BASE}/payroll/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getDepartmentStatus: async (month: string): Promise<DeptStatus[]> => {
    const res = await fetch(`${BASE}/payroll/status?month=${month}`);
    return res.json();
  },
};

// ─── Constants ────────────────────────────────────────────────────────────────
const DEPARTMENTS = ["Cleaning", "Security", "Non-Academic", "Academic"];

const SALARY_FIELDS = [
  { key: "basicSalary",        label: "Basic Salary",        section: "earnings"   },
  { key: "transportAllowance", label: "Transport Allowance", section: "earnings"   },
  { key: "mealAllowance",      label: "Meal Allowance",      section: "earnings"   },
  { key: "otherAllowance",     label: "Other Allowance",     section: "earnings"   },
  { key: "epfEmployee",        label: "EPF Employee (8%)",   section: "deductions" },
  { key: "etf",                label: "ETF (3%)",            section: "deductions" },
  { key: "lateDeduction",      label: "Late Deduction",      section: "deductions" },
  { key: "otherDeduction",     label: "Other Deduction",     section: "deductions" },
];

const fmt = (n: number) => `Rs. ${Number(n || 0).toLocaleString("en-LK")}`;

// ─── PayslipModal ─────────────────────────────────────────────────────────────
function PayslipModal({
  payroll,
  monthLabel,
  onClose,
  onEdit,
}: {
  payroll: PayrollRecord;
  monthLabel: string;
  onClose: () => void;
  onEdit: (p: PayrollRecord) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="bg-[#0f172a] px-6 py-5 rounded-t-2xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mb-1">Payslip</p>
              <h2 className="text-xl font-bold text-white">{payroll.name}</h2>
              <p className="text-slate-400 text-xs mt-1">
                Emp #{payroll.empNo} · {payroll.role} · {payroll.department} · {monthLabel}
              </p>
            </div>
            <button onClick={onClose}
              className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-xl leading-none">×</button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Work days", value: payroll.workDays,  color: "text-white"     },
              { label: "Present",   value: payroll.present,   color: "text-green-400" },
              { label: "Absent",    value: payroll.absent,    color: "text-red-400"   },
              { label: "Late min",  value: payroll.lateMinutes, color: "text-amber-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-2.5 text-center">
                <p className="text-slate-400 text-[10px] mb-1">{s.label}</p>
                <p className={`font-bold text-lg leading-none ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pt-4 pb-0">
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Role: {payroll.role} — Basic salary from role configuration
          </span>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Earnings</p>
            <div className="space-y-2">
              {[
                ["Basic Salary (role-based)", payroll.basicSalary],
                ["Transport Allowance",       payroll.transportAllowance],
                ["Meal Allowance",            payroll.mealAllowance],
                ["Other Allowance",           payroll.otherAllowance],
              ].map(([label, val]) => (
                <div key={label as string} className="flex justify-between text-sm">
                  <span className="text-slate-500">{label as string}</span>
                  <span className={`font-medium ${label === "Basic Salary (role-based)" ? "text-blue-700" : "text-slate-800"}`}>
                    {fmt(val as number)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-semibold text-slate-800 pt-2 border-t border-slate-100">
                <span>Gross Salary</span><span>{fmt(payroll.grossSalary)}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Deductions</p>
            <div className="space-y-2">
              {[
                ["EPF Employee (8%)", payroll.epfEmployee],
                ["ETF (3%)",          payroll.etf],
                ["Late Deduction",    payroll.lateDeduction],
                ["Other Deductions",  payroll.otherDeduction],
              ].map(([label, val]) => (
                <div key={label as string} className="flex justify-between text-sm">
                  <span className="text-slate-500">{label as string}</span>
                  <span className="font-medium text-red-500">− {fmt(val as number)}</span>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
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

// ─── EditSalaryModal ──────────────────────────────────────────────────────────
function EditSalaryModal({
  payroll,
  onClose,
  onSave,
  saving,
}: {
  payroll: PayrollRecord;
  onClose: () => void;
  onSave: (form: Record<string, string>) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    const init: Record<string, string> = {};
    SALARY_FIELDS.forEach((f) => { init[f.key] = String((payroll as any)[f.key] ?? 0); });
    setForm(init);
  }, [payroll]);

  const earnings   = SALARY_FIELDS.filter((f) => f.section === "earnings");
  const deductions = SALARY_FIELDS.filter((f) => f.section === "deductions");
  const gross      = earnings.reduce((s, f)   => s + (Number(form[f.key]) || 0), 0);
  const totalDed   = deductions.reduce((s, f) => s + (Number(form[f.key]) || 0), 0);
  const net        = gross - totalDed;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        <div className="bg-[#0f172a] px-5 py-4 rounded-t-2xl flex items-start justify-between">
          <div>
            <h2 className="text-white font-semibold text-base">Edit Salary</h2>
            <p className="text-slate-400 text-xs mt-0.5">
              {payroll.name} · Emp #{payroll.empNo} · {payroll.role} · {payroll.department}
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              Present: {payroll.present} days · Late: {payroll.lateMinutes} min
            </p>
          </div>
          <button onClick={onClose}
            className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-xl leading-none">×</button>
        </div>

        <div className="mx-5 mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 flex items-start gap-2">
          <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-blue-700">
            Basic salary was auto-filled from the <strong>{payroll.role}</strong> role configuration.
            Changes here apply to this payslip only.
          </p>
        </div>

        <div className="px-5 py-4 space-y-5">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Earnings</p>
            <div className="grid grid-cols-2 gap-3">
              {earnings.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-slate-600 mb-1">{f.label} (Rs.)</label>
                  <input type="number" min="0"
                    value={form[f.key] ?? "0"}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Deductions</p>
            <div className="grid grid-cols-2 gap-3">
              {deductions.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-slate-600 mb-1">{f.label} (Rs.)</label>
                  <input type="number" min="0"
                    value={form[f.key] ?? "0"}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
          <button onClick={() => onSave(form)} disabled={saving}
            className="flex-1 bg-[#0f172a] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-slate-700 transition disabled:opacity-50">
            {saving ? "Saving…" : "✓ Save Salary"}
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PayrollPage() {
  const [deptStatus,    setDeptStatus]    = useState<DeptStatus[]>([]);
  const [selectedDept,  setSelectedDept]  = useState("Cleaning");
  const [months,        setMonths]        = useState<MonthOption[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [payrolls,      setPayrolls]      = useState<PayrollRecord[]>([]);
  const [generating,    setGenerating]    = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [genMsg,        setGenMsg]        = useState<{ type: "success" | "error" | "warn"; text: string } | null>(null);
  const [warnings,      setWarnings]      = useState<string[]>([]);   // roles with no salary
  const [skipped,       setSkipped]       = useState<string[]>([]);   // empNos with no attendance
  const [viewPayslip,   setViewPayslip]   = useState<PayrollRecord | null>(null);
  const [editPayroll,   setEditPayroll]   = useState<PayrollRecord | null>(null);
  const [saving,        setSaving]        = useState(false);

  useEffect(() => {
    if (!selectedDept) return;
    api.getMonths(selectedDept).then((data) => {
      const arr = Array.isArray(data) ? data : [];
      setMonths(arr);
      setSelectedMonth(arr[0]?.month || "");
      setPayrolls([]);
    });
  }, [selectedDept]);

  useEffect(() => {
    if (selectedDept && selectedMonth) loadPayroll();
  }, [selectedDept, selectedMonth]);

  useEffect(() => {
    if (selectedMonth)
      api.getDepartmentStatus(selectedMonth).then((d) =>
        setDeptStatus(Array.isArray(d) ? d : [])
      );
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
    setWarnings([]);
    setSkipped([]);

    const res = await api.generatePayroll(selectedDept, selectedMonth);
    setGenerating(false);

    if (res.count != null) {
      const zeroSalary = (res.data || [])
        .filter((p: PayrollRecord) => p.basicSalary === 0)
        .map((p: PayrollRecord) => p.role);
      const uniqueZero = [...new Set(zeroSalary)] as string[];
      setWarnings(uniqueZero);
      setSkipped(res.skipped || []);

      if (uniqueZero.length > 0) {
        setGenMsg({
          type: "warn",
          text: `Generated for ${res.count} employees — ${uniqueZero.length} role(s) have no salary configured.`,
        });
      } else {
        setGenMsg({ type: "success", text: `Payroll generated for ${res.count} employees` });
      }
      await loadPayroll();
    } else {
      setGenMsg({ type: "error", text: (res as any).message || "Failed to generate payroll." });
    }
  };

  const handleSaveEdit = async (form: Record<string, string>) => {
    if (!editPayroll) return;
    setSaving(true);
    await api.editPayroll(editPayroll._id, form as any);
    setSaving(false);
    setEditPayroll(null);
    setViewPayslip(null);
    await loadPayroll();
  };

  const currentLabel = months.find((m) => m.month === selectedMonth)?.label || "";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 py-5 space-y-5">

            <div>
              <h1 className="text-2xl font-bold text-white">Payroll &amp; Payslips</h1>
              <p className="text-sm text-slate-400 mt-1">
                Basic salary is auto-filled from each employee's role configuration when you generate payroll.
              </p>
            </div>

            <div className="bg-blue-900/40 border border-blue-700/40 rounded-2xl px-5 py-3.5 flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-blue-300 text-sm font-medium">Role-based salary system</p>
                <p className="text-blue-400 text-xs mt-0.5">
                  Each employee's basic salary is automatically pulled from the{" "}
                  <span className="text-blue-200 font-medium">Salary Management</span> page during generation.
                  If an employee's role has no salary configured, basic salary will be Rs. 0.
                </p>
              </div>
            </div>

            {/* Roles with zero salary */}
            {warnings.length > 0 && (
              <div className="bg-amber-900/40 border border-amber-700/40 rounded-2xl px-5 py-3.5">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-amber-300 text-sm font-medium">Roles with no salary configured</p>
                    <p className="text-amber-400 text-xs mt-1">
                      Go to <span className="text-amber-200 font-medium">Salary Management</span> and set basic salary for:
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {warnings.map((role) => (
                        <span key={role}
                          className="bg-amber-800/50 text-amber-200 text-xs px-2.5 py-1 rounded-full border border-amber-700/50">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Employees skipped — no attendance uploaded this month */}
            {skipped.length > 0 && (
              <div className="bg-red-900/30 border border-red-700/40 rounded-2xl px-5 py-3.5">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <div>
                    <p className="text-red-300 text-sm font-medium">Skipped — no attendance found</p>
                    <p className="text-red-400 text-xs mt-1">
                      These employees have no attendance uploaded for {currentLabel}, so no payslip was generated:
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {skipped.map((empNo) => (
                        <span key={empNo}
                          className="bg-red-800/40 text-red-200 text-xs px-2.5 py-1 rounded-full border border-red-700/50">
                          Emp #{empNo}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedMonth && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DEPARTMENTS.map((dept) => {
                  const info   = deptStatus.find((d) => d.department === dept);
                  const active = dept === selectedDept;
                  return (
                    <button key={dept} onClick={() => setSelectedDept(dept)}
                      className={`p-4 rounded-2xl border text-left transition ${
                        active
                          ? "bg-[#0f172a] border-blue-600 shadow-md"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
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

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-3.5 flex flex-wrap gap-3 items-center justify-between">
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
                  <span className={`text-xs px-3 py-1.5 rounded-lg ${
                    genMsg.type === "success" ? "bg-green-50 text-green-700" :
                    genMsg.type === "warn"    ? "bg-amber-50 text-amber-700" :
                                               "bg-red-50 text-red-600"
                  }`}>
                    {genMsg.type === "success" ? "✓ " : genMsg.type === "warn" ? "⚠ " : "✕ "}
                    {genMsg.text}
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

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {payrolls.length > 0 && (
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    {selectedDept} — {currentLabel} · {payrolls.length} employees
                  </p>
                  <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Basic salary from role config
                  </span>
                </div>
              )}

              {payrolls.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 bg-white">
                        {["Emp No", "Name", "Role", "Attendance", "Late",
                          "Basic Salary", "Gross", "Deductions", "Net Pay", "Actions"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payrolls.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3.5 font-semibold text-[#0f172a] text-xs">{p.empNo}</td>
                          <td className="px-4 py-3.5 font-medium text-slate-700 whitespace-nowrap text-xs">{p.name}</td>

                          <td className="px-4 py-3.5">
                            <span className="bg-blue-50 text-blue-700 text-[10px] font-medium px-2 py-1 rounded-md border border-blue-100 whitespace-nowrap">
                              {p.role}
                            </span>
                          </td>

                          <td className="px-4 py-3.5 text-xs">
                            <span className="text-green-600 font-semibold">{p.present}</span>
                            <span className="text-slate-400">/{p.workDays}</span>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className={`text-xs font-medium ${p.lateMinutes > 0 ? "text-amber-600" : "text-slate-400"}`}>
                              {p.lateMinutes} min
                            </span>
                          </td>

                          <td className="px-4 py-3.5 whitespace-nowrap">
                            {p.basicSalary === 0 ? (
                              <span className="flex items-center gap-1 text-amber-600 text-xs font-medium">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Not set
                              </span>
                            ) : (
                              <span className="text-blue-700 text-xs font-semibold">
                                Rs. {Number(p.basicSalary).toLocaleString("en-LK")}
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3.5 text-slate-700 text-xs whitespace-nowrap">
                            Rs. {Number(p.grossSalary).toLocaleString("en-LK")}
                          </td>
                          <td className="px-4 py-3.5 text-red-500 text-xs whitespace-nowrap">
                            Rs. {Number(p.totalDeductions).toLocaleString("en-LK")}
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-green-600 text-xs whitespace-nowrap">
                            Rs. {Number(p.netPay).toLocaleString("en-LK")}
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="flex gap-1.5">
                              <button onClick={() => setEditPayroll(p)}
                                className="inline-flex items-center gap-1 text-xs border border-slate-200 text-slate-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition whitespace-nowrap">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit
                              </button>
                              <button onClick={() => setViewPayslip(p)}
                                className="inline-flex items-center gap-1 text-xs bg-[#0f172a] text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-700 transition whitespace-nowrap">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 font-medium text-sm">No payroll generated yet</p>
                  <p className="text-slate-400 text-xs mt-1">
                    Make sure role salaries are configured, then click Generate Payroll.
                  </p>
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

      {viewPayslip && (
        <PayslipModal
          payroll={viewPayslip}
          monthLabel={currentLabel}
          onClose={() => setViewPayslip(null)}
          onEdit={(p) => { setViewPayslip(null); setEditPayroll(p); }}
        />
      )}
      {editPayroll && (
        <EditSalaryModal
          payroll={editPayroll}
          onClose={() => setEditPayroll(null)}
          onSave={handleSaveEdit}
          saving={saving}
        />
      )}
    </div>
  );
}