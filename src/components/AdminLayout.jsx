// import { NavLink, Outlet } from "react-router-dom";
// import { LogOut } from "lucide-react";

// export default function AdminLayout() {
//   const navItems = [
//     { name: "📊 Overview", path: "/admin" },
//     { name: "📋 Projects", path: "/admin/projects" },
//     // { name: "🧑‍💼 Departments", path: "/admin/departments" },
//     { name: "🔁 Coordination", path: "/admin/coordination" },
//     { name: "🧠 AI Suggestions", path: "/admin/suggestions" },
//     { name: "🔔 Notifications", path: "/admin/notifications" },
//     { name: "📁 Meeting Docs", path: "/admin/meeting-docs" },
//     { name: "⚙️ Settings", path: "/admin/settings" },

//   ];

//   const handleLogout = () => {
//     // add firebase logout logic
//     alert("Logging out (not implemented)");
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md p-4 space-y-6">
//         <h1 className="text-2xl font-bold text-blue-600">UrbanCoord</h1>
//         <nav className="flex flex-col gap-2">
//           {navItems.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               end={item.path === "."}
//               className={({ isActive }) =>
//                 `block px-3 py-2 rounded hover:bg-blue-100 ${
//                   isActive ? "bg-blue-500 text-white" : "text-gray-700"
//                 }`
//               }
//             >
//               {item.name}
//             </NavLink>
//           ))}
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Top Navbar */}
//         <header className="bg-white shadow p-4 flex justify-between items-center">
//           <div className="text-lg font-semibold">Welcome, Admin</div>
//           <button onClick={handleLogout} className="flex items-center text-red-500 hover:underline">
//             <LogOut size={16} className="mr-1" /> Logout
//           </button>
//         </header>

//         <main className="p-6 overflow-y-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import Header from "../Layouts/header";
import Sidebar from "../Layouts/Sidebar";

export default function AdminLayout() {
  const handleLogout = () => {
    // add firebase logout logic
    alert("Logging out (not implemented)");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Header />

        {/* Logout button (placed inside header if needed) */}
        <div className="flex justify-end px-6 py-2 bg-white border-b border-gray-200 md:hidden">
          <button
            onClick={handleLogout}
            className="text-red-500 text-sm flex items-center gap-1 hover:underline"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

