"use client";
import axios from "axios";
import { Download } from "lucide-react";

export default function ReportsPage() {
  const reports = [
    { title: "Staff", type: "staff" },
    { title: "Attendance", type: "attendance" },
    { title: "Leave", type: "leave" },
    { title: "Payroll", type: "payroll" },
  ];

  const handleExport = async (type, format) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reports/${type}/${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      a.click();
    } catch (e) { alert("Download failed"); }
  };

  return (
    <div className="p-10 bg-slate-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>
      <div className="grid grid-cols-2 gap-4">
        {reports.map((r, i) => (
          <div key={i} className="bg-slate-900 p-5 rounded-xl border border-slate-700">
            <h2 className="mb-4">{r.title}</h2>
            <div className="flex gap-2">
              <button onClick={() => handleExport(r.type, 'pdf')} className="bg-blue-600 px-3 py-1 rounded">PDF</button>
              <button onClick={() => handleExport(r.type, 'excel')} className="bg-green-600 px-3 py-1 rounded">Excel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}