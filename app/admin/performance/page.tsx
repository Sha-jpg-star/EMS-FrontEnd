"use client" 

import Sidebar from "@/app/components/sidebaradmin";
import Navbar from "@/app/components/navbar";


export default function Departments() {


  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="h-screen bg-gray-100 flex-1 flex flex-col">
        <Navbar />

       
        </div>
      </div>
   
  );
}