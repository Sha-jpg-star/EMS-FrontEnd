"use client";

import Sidebar from "../../components/sidebaradmin";
import Navbar from "@/app/components/navbar";
import { useEffect, useState } from "react";
import API from "@/services/api";
import { Sliders, Save, Building, Phone, Mail, FileText, MapPin } from "lucide-react";

export default function CompanySettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    phone: "",
    email: "",
    registrationNo: ""
  });

  useEffect(() => {
    fetchCompanyConfig();
  }, []);

  const fetchCompanyConfig = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/company-config");
      setFormData({
        companyName: res.data.companyName,
        address: res.data.address,
        phone: res.data.phone,
        email: res.data.email,
        registrationNo: res.data.registrationNo
      });
    } catch (err) {
      console.error("Error fetching company config:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await API.put("/admin/company-config", formData);
      alert("Company Settings updated successfully!");
      fetchCompanyConfig();
    } catch (err) {
      console.error("Error updating company settings:", err);
      alert("Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      
     
      <Sidebar />

      
      <div className="flex-1 flex flex-col min-w-0">
        
        
        <Navbar />

        
        <div className="p-6 md:p-8 overflow-y-auto max-w-4xl w-full mx-auto">
          
          
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wide text-white">Company Settings</h1>
              
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-slate-400 text-sm animate-pulse">Loading settings profile...</p>
            </div>
          ) : (
           
            <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Official Company Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                    />
                    <div className="absolute left-4 top-3 text-slate-500"><Building size={16} /></div>
                  </div>
                </div>

              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Company Registration Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.registrationNo}
                        onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                      />
                      <div className="absolute left-4 top-3 text-slate-500"><FileText size={16} /></div>
                    </div>
                  </div>

               
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Official Hotline Contact</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                      />
                      <div className="absolute left-4 top-3 text-slate-500"><Phone size={16} /></div>
                    </div>
                  </div>
                </div>

               
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Corporate Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                    />
                    <div className="absolute left-4 top-3 text-slate-500"><Mail size={16} /></div>
                  </div>
                </div>

                
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Headquarters Address</label>
                  <div className="relative">
                    <textarea
                      required
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                    <div className="absolute left-4 top-3.5 text-slate-500"><MapPin size={16} /></div>
                  </div>
                </div>

               
                <div className="border-t border-slate-800 pt-5 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold rounded-xl text-sm tracking-wide transition-all shadow-xl shadow-blue-950/40"
                  >
                    <Save size={16} />
                    {saving ? "Updating Profile..." : "Save Settings profile"}
                  </button>
                </div>

              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}