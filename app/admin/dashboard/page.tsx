"use client";


import Sidebar from "@/app/components/sidebaradmin";
import Navbar from "@/app/components/navbar";

export default function AdminDashboard() {



  return (
      <div className="flex min-h-screen bg-slate-950 text-slate-100">
              
              
              <Sidebar />
        
              
              <div className="flex-1 flex flex-col min-w-0">
                
               
                <Navbar />
        <div className="p-6 bg-slate-950 min-h-screen text-white">

     
        <div className="p-6">

          <h1 className="text-3xl font-bold text-gray-600">
            Admin Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Full system control panel
          </p>

         

         
        </div>

      </div>

    </div></div>
  );
}