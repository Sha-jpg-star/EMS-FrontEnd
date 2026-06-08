"use client";

import { Bell, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/services/api";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);

    
      if (parsed.role !== "hr") {
        router.push("/login");
        return;
      }

      setUser(parsed);
    }

    fetchNotifications(); 
  }, []);

  
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/hr/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
     <div className="w-full h-16 bg-gradient-to-r from-blue-900 to-blue-700 flex justify-between items-center px-8 text-white">
      
      <h2 className="text-lg font-semibold">
        Welcome, {user?.name || "HR"}
      </h2>

     
      <div className="flex items-center gap-5">

     
        <div className="relative cursor-pointer">

          <button
            onClick={() => router.push("/hr/notifications")} 
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
          >
            <Bell size={18} />
          </button>

         
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full animate-pulse">
              {notifications.length}
            </span>
          )}

        </div>

        
        <button
          onClick={() => setOpen(!open)}
          className="w-10 h-10 rounded-full bg-white text-green-900 font-bold flex items-center justify-center"
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : "H"}
        </button>

       
        {open && (
          <div className="absolute top-14 right-10 bg-white text-black w-56 rounded-xl shadow-xl p-4">

            <h3 className="font-bold text-lg">{user?.name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-sm text-green-600 mt-1 capitalize">
              {user?.role}
            </p>

            <hr className="my-3" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-800"
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>
        )}

      </div>
    </div>
  );
}