import Sidebar from "@/app/components/sidebarhr";
import Navbar from "@/app/components/navbarhr";

export default function HRDashboard() {

  return (

    <div className="flex min-h-screen">

      <Sidebar />

      
      <div className="flex-1 flex flex-col bg-gray-100">

       
        <Navbar />

       
        <div className="p-6">

          <h1 className="text-3xl font-bold text-gray-800">
            HR Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Employee management system 👨‍💼
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="font-semibold">Employees</h2>
              <p className="text-sm text-gray-500">View all employees</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="font-semibold">Attendance</h2>
              <p className="text-sm text-gray-500">Track attendance</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="font-semibold">Payroll</h2>
              <p className="text-sm text-gray-500">Salary management</p>
            </div>

          </div>

        </div>

      </div>

    </div>

  );

}