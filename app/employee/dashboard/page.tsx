import Sidebar from "@/app/components/sidebaremp";
import Navbar from "@/app/components/navbaremp";

export default function EmployeeDashboard() {

  return (

    <div className="flex min-h-screen">

     
      <Sidebar />

     
      <div className="flex-1 flex flex-col bg-gray-100">

      
        <Navbar />

      
        <div className="p-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Employee Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Welcome to your workspace 👋
          </p>

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="font-semibold text-gray-700">
                My Profile
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                View your personal details
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="font-semibold text-gray-700">
                Attendance
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Check your attendance records
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="font-semibold text-gray-700">
                Tasks
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                View assigned tasks
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>

  );

}