"use client";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/app/components/sidebarhr";
import Navbar from "@/app/components/navbarhr";
import axios from "axios";

const EMP_URL    = "http://localhost:5000/api/employees";
const SALARY_URL = "http://localhost:5000/api/salaries";
const DEPARTMENTS = ["All", "Security", "Cleaning", "Non-Academic", "Academic"];

// ─── Types ────────────────────────────────────────────────────────────────────
interface Employee {
  _id: string;
  empNo: string;
  name: string;
  role: string;
  department: string;
}

interface RoleSalary {
  _id?: string;
  role: string;
  department: string;
  basicSalary: number;
}

// One unique role row shown in the table
interface RoleRow {
  role: string;
  department: string;
  empCount: number;
  empNames: string[];   // first 3 names for preview
  basicSalary: number;
  salaryId?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SalaryManagementPage() {
  const [employees,    setEmployees]    = useState<Employee[]>([]);
  const [salaries,     setSalaries]     = useState<RoleSalary[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [loading,      setLoading]      = useState<boolean>(true);
  const [savingRole,   setSavingRole]   = useState<string | null>(null);
  const [toast,        setToast]        = useState<{ msg: string; ok: boolean } | null>(null);

  // local edits: role -> salary string
  const [localValues, setLocalValues]  = useState<Record<string, string>>({});

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, salRes] = await Promise.all([
        axios.get<Employee[]>(EMP_URL),
        axios.get<RoleSalary[]>(SALARY_URL),
      ]);
      setEmployees(empRes.data);
      setSalaries(salRes.data);
    } catch {
      showToast("Failed to load data.", false);
    } finally {
      setLoading(false);
    }
  };

  // ── Build role rows ────────────────────────────────────────────────────────
  // Group employees by (role + department), merge saved salary
  const roleRows: RoleRow[] = React.useMemo(() => {
    const map = new Map<string, RoleRow>();

    const filtered = selectedDept === "All"
      ? employees
      : employees.filter(e => e.department === selectedDept);

    filtered.forEach(emp => {
      const key = `${emp.role}||${emp.department}`;
      if (!map.has(key)) {
        const saved = salaries.find(
          s => s.role === emp.role && s.department === emp.department
        );
        map.set(key, {
          role:        emp.role,
          department:  emp.department,
          empCount:    0,
          empNames:    [],
          basicSalary: saved?.basicSalary ?? 0,
          salaryId:    saved?._id,
        });
      }
      const row = map.get(key)!;
      row.empCount++;
      if (row.empNames.length < 3) row.empNames.push(emp.name);
    });

    return Array.from(map.values()).sort((a, b) =>
      a.department.localeCompare(b.department) || a.role.localeCompare(b.role)
    );
  }, [employees, salaries, selectedDept]);

  // ── Save one role's salary ─────────────────────────────────────────────────
  const handleSave = async (row: RoleRow) => {
    const key = `${row.role}||${row.department}`;
    const val = localValues[key];
    const newSalary = val !== undefined ? parseFloat(val) : row.basicSalary;

    if (isNaN(newSalary) || newSalary < 0) {
      showToast("Enter a valid salary amount.", false);
      return;
    }

    setSavingRole(key);
    try {
      await axios.post(SALARY_URL, {
        id:          row.salaryId || "",
        role:        row.role,
        department:  row.department,
        basicSalary: newSalary,
      });
      showToast(`Saved — ${row.role} (${row.department})`, true);
      // update local salaries state so table reflects immediately
      setSalaries(prev => {
        const idx = prev.findIndex(
          s => s.role === row.role && s.department === row.department
        );
        const updated = { role: row.role, department: row.department, basicSalary: newSalary, _id: row.salaryId };
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], basicSalary: newSalary };
          return next;
        }
        return [...prev, updated];
      });
      // clear local edit for this key
      setLocalValues(prev => { const n = { ...prev }; delete n[key]; return n; });
    } catch {
      showToast("Failed to save salary.", false);
    } finally {
      setSavingRole(null);
    }
  };

  // ── Delete one role's salary ───────────────────────────────────────────────
  const handleDelete = async (row: RoleRow) => {
    if (!row.salaryId) {
      showToast("No saved salary to delete.", false);
      return;
    }
    const key = `${row.role}||${row.department}`;
    setSavingRole(key);
    try {
      await axios.delete(`${SALARY_URL}/${row.salaryId}`);
      showToast(`Deleted — ${row.role} (${row.department})`, true);
      setSalaries(prev => prev.filter(s => s._id !== row.salaryId));
    } catch {
      showToast("Failed to delete salary.", false);
    } finally {
      setSavingRole(null);
    }
  };

  // ── Toast helper ───────────────────────────────────────────────────────────
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string, ok: boolean) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, ok });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  // ── Dept colour dots ───────────────────────────────────────────────────────
  const deptColor: Record<string, string> = {
    Security:    "bg-blue-500",
    Cleaning:    "bg-green-500",
    "Non-Academic": "bg-amber-500",
    Academic:    "bg-purple-500",
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden w-full">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto px-8 py-6">

          {/* Page header */}
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-white">Salary Management</h1>
            <p className="text-slate-400 text-sm mt-1">
              Set basic salary per role. All employees sharing that role receive the same basic salary during payroll generation.
            </p>
          </header>

          {/* Department filter pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedDept === dept
                    ? "bg-blue-600 text-white shadow"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Summary stats */}
          {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {["Security","Cleaning","Non-Academic","Academic"].map(dept => {
                const rows = roleRows.filter(r => r.department === dept);
                const configured = rows.filter(r => r.basicSalary > 0).length;
                return (
                  <div key={dept} className="bg-slate-800 rounded-xl px-4 py-3 border border-slate-700">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${deptColor[dept]}`} />
                      <p className="text-xs text-slate-400 font-medium">{dept}</p>
                    </div>
                    <p className="text-white font-semibold text-lg leading-none">{configured}/{rows.length}</p>
                    <p className="text-slate-500 text-xs mt-0.5">roles configured</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full text-left text-black text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-gray-500 uppercase text-xs tracking-wider">
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Employees</th>
                  <th className="px-5 py-3.5">Basic Salary (Rs.)</th>
                  <th className="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      <svg className="animate-spin w-5 h-5 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Loading…
                    </td>
                  </tr>
                ) : roleRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      No employees found for this department.
                    </td>
                  </tr>
                ) : (
                  roleRows.map((row) => {
                    const key      = `${row.role}||${row.department}`;
                    const isSaving = savingRole === key;
                    const localVal = localValues[key];
                    const displayVal = localVal !== undefined
                      ? localVal
                      : row.basicSalary > 0 ? String(row.basicSalary) : "";
                    const isDirty   = localVal !== undefined &&
                      parseFloat(localVal) !== row.basicSalary;
                    const hasValue  = row.basicSalary > 0;

                    return (
                      <tr key={key} className="hover:bg-gray-50 transition">

                        {/* Department */}
                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${deptColor[row.department] || "bg-gray-400"}`} />
                            <span className="text-gray-700 font-medium text-xs">{row.department}</span>
                          </span>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-gray-800">{row.role}</span>
                        </td>

                        {/* Employees preview */}
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-gray-800">
                              {row.empCount} employee{row.empCount !== 1 ? "s" : ""}
                            </span>
                            <span className="text-xs text-gray-400">
                              {row.empNames.join(", ")}
                              {row.empCount > 3 ? ` +${row.empCount - 3} more` : ""}
                            </span>
                          </div>
                        </td>

                        {/* Salary input */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs font-medium">Rs.</span>
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={displayVal}
                              onChange={(e) =>
                                setLocalValues(prev => ({ ...prev, [key]: e.target.value }))
                              }
                              className={`w-32 px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition ${
                                isDirty
                                  ? "border-blue-400 bg-blue-50"
                                  : hasValue
                                  ? "border-green-300 bg-green-50"
                                  : "border-gray-200 bg-white"
                              }`}
                            />
                            {isDirty && (
                              <span className="text-xs text-blue-500 font-medium whitespace-nowrap">
                                unsaved
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleSave(row)}
                              disabled={isSaving}
                              className="flex items-center gap-1.5 bg-[#0f172a] text-white px-3.5 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-700 transition disabled:opacity-50"
                            >
                              {isSaving ? (
                                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                              {isSaving ? "Saving…" : "Save"}
                            </button>

                            <button
                              onClick={() => handleDelete(row)}
                              disabled={isSaving || !hasValue}
                              className="flex items-center gap-1.5 border border-red-200 text-red-500 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 transition disabled:opacity-30"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Info note */}
          <p className="text-slate-500 text-xs mt-4 flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Changes here apply to the next payroll generation. Existing generated payslips are not automatically updated.
          </p>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
          toast.ok ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.ok ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}
    </div>
  );
}