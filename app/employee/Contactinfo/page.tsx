import React from 'react';
import { Mail, Phone, MessageCircle, MapPin, Clock } from 'lucide-react';
import Sidebar from "@/app/components/sidebaremp";
import Navbar from "@/app/components/navbaremp";

const ContactModern = () => {
  const contactData = [
    { icon: <Mail />, title: "Email", value: "infoABC@gmail.com" },
    { icon: <Phone />, title: "Call Us", value: "+94 77 123 4567" },
    { icon: <MessageCircle />, title: "WhatsApp", value: "+94 77 123 4567" },
    { icon: <MapPin />, title: "Location", value: "Colombo, Sri Lanka" },
    { icon: <Clock />, title: "Office Time", value: "9:00 AM - 5:00 PM" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
       
        <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
          <div className="max-w-5xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-white tracking-tight">Contact Us</h2>
              <p className="text-slate-400 mt-2">We are always here to help you.</p>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {contactData.map((item, index) => (
                <div 
                  key={index} 
                  className="group relative bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer hover:border-indigo-500/50"
                >
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-slate-400 mt-1 font-medium">{item.value}</p>
                  
                  {/* Decorative circle */}
                  <div className="absolute -top-2 -right-2 w-20 h-20 bg-indigo-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContactModern;