"use client";
import Sidebar from "../../components/sidebaradmin";
import Navbar from "@/app/components/navbar";
import { useState } from "react";
import API from "@/services/api";
import { Database, Download, ShieldCheck, AlertTriangle } from "lucide-react";

export default function DatabaseBackup() {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadBackup = async () => {
    try {
      setDownloading(true);
      
     
      const response = await API.get("/admin/database-backup", {
        responseType: "blob",
      });

      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      
    
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute("download", `payroll_db_backup_${date}.json`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (err) {
      console.error("Backup download failed:", err);
      alert("Failed to download database backup.");
    } finally {
      setDownloading(false);
    }
  };

  return (
     <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Navbar />
                    <div className="flex-1 overflow-y-auto bg-slate-950 p-8">
      
      <div className="flex items-center gap-3 mb-6">
        <Database className="text-blue-500 w-7 h-7" />
        <h1 className="text-2xl font-bold tracking-wide">System Database Backup</h1>
      </div>

      <div className="max-w-2xl bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl space-y-6">
        
       
        <div className="flex items-center gap-4 p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-xl">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Data Security Protocol Active</h2>
            <p className="text-xs text-slate-400">All structural schemas and collection rows are encrypted during extraction.</p>
          </div>
        </div>

        
        <div className="flex items-start gap-3 p-4 bg-amber-950/20 border border-amber-900/40 rounded-lg text-xs text-amber-300">
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-amber-400" />
          <p>
            This will export all system records, including employee details, attendance, and salary information. Please keep the downloaded file safe and secure.
          </p>
        </div>

        
        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-slate-200">Manual Full Backup</h3>
            <p className="text-xs text-slate-500">Download all data as a readable .json structure.</p>
          </div>
          
          <button
            onClick={handleDownloadBackup}
            disabled={downloading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium rounded-lg text-sm transition-all shadow-lg shadow-blue-900/20"
          >
            <Download size={16} />
            {downloading ? "Generating Backup..." : "Download JSON Backup"}
          </button>
        </div>

      </div>
    </div></div>
      </div>
  );
}