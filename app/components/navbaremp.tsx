"use client";

import { Bell, LogOut, User } from "lucide-react";
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

    
      if (parsed.role !== "employee") {
        router.push("/login");
        return;
      }

      setUser(parsed);
    }

    fetchNotifications();
  }, []);

  
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/employee/notifications");
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
    <div className="w-full h-16  bg-blue-900 to-gray-700 flex justify-between items-center px-8 text-white">

     
      <div className="flex items-center gap-2">
        <User size={18} />
        <h2 className="text-lg font-semibold">
          Welcome, {user?.name || "Employee"}
        </h2>
      </div>

     
      <div className="flex items-center gap-5">

      
        <div className="relative cursor-pointer">

          <button
            onClick={() => router.push("/employee/notifications")}
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
              onClick={handleLogout}
              className="flex items-center gap-2 text-white hover: text-amber-50"
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>
      

      </div>
   
  );
}