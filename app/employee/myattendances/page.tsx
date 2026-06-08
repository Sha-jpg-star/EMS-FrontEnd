"use client" 

import Sidebar from "@/app/components/sidebaremp";
import Navbar from "@/app/components/navbaremp";


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