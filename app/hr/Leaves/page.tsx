"use client" 

import Sidebar from "../../components/sidebarhr";
import Navbar from "../../components/navbarhr";
import { useEffect, useState } from 'react';

export default function Departments() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/leaves')
      .then(res => res.json())
      .then(data => setLeaves(data))
      .catch(err => console.error("Error fetching leaves:", err));
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="h-screen bg-gray-100 flex-1 flex flex-col">
        <Navbar />

       
        </div>
      </div>
   
  );
}