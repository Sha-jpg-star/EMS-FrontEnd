"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { UserCheck, Check, X, AlertCircle } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    if (confirm("Are you sure you want to APPROVE this user?")) {
      await API.put(`/admin/approve/${id}`);
      fetchNotifications();
    }
  };

  const reject = async (id) => {
    if (confirm("Are you sure you want to REJECT this user?")) {
      await API.put(`/admin/reject/${id}`);
      fetchNotifications();
    }
  };

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <UserCheck className="text-blue-500 w-7 h-7" />
        <h1 className="text-2xl font-bold tracking-wide">Pending Approvals</h1>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading pending requests...</p>
      ) : notifications.length === 0 ? (
        <div className="flex items-center gap-2 p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-400">
          <AlertCircle size={20} className="text-blue-400" />
          <span>No pending registration requests found.</span>
        </div>
      ) : (
        <div className="overflow-hidden bg-slate-900 rounded-xl border border-slate-800 shadow-xl">
          <table className="w-full text-left text-sm text-slate-300 border-collapse">
            <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4 font-semibold">User Details</th>
                <th className="p-4 font-semibold">Email Address</th>
                <th className="p-4 font-semibold">Requested Role</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {notifications.map((n) => (
                <tr key={n._id} className="hover:bg-slate-800/30 transition-all">
                  <td className="p-4 font-medium text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-blue-400 border border-slate-700">
                      {n.name?.charAt(0).toUpperCase()}
                    </div>
                    {n.name}
                  </td>
                  <td className="p-4 text-slate-400">{n.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${
                      n.role === 'hr' 
                        ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/50' 
                        : 'bg-indigo-950/50 text-indigo-400 border border-indigo-800/50'
                    }`}>
                      {n.role || 'employee'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => approve(n._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-900/20 transition-all"
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button
                        onClick={() => reject(n._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-rose-900/20 transition-all"
                      >
                        <X size={14} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}