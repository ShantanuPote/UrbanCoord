// // src/pages/Admin/Overview.jsx
// import { useEffect, useState } from "react";
// import { db } from "../../firebase";
// import { collection, getDocs } from "firebase/firestore";
// import {
//   FolderIcon,
//   BuildingIcon,
//   AlertTriangle,
//   DollarSign,
//   Calendar,
// } from "lucide-react";

// export default function Overview() {
//   const [stats, setStats] = useState({
//     activeProjects: 0,
//     departments: 0,
//     conflicts: 0,
//     budgetUsed: 0,
//   });

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     const projectsSnap = await getDocs(collection(db, "projects"));
//     const deptSnap = await getDocs(collection(db, "departments")); // Optional

//     const activeProjects = projectsSnap.docs.length;
//     const departments = deptSnap.docs.length;

//     const budgetUsed = 0; // Placeholder
//     const conflicts = 0; // Placeholder: You can fetch from Firestore

//     setStats({ activeProjects, departments, conflicts, budgetUsed });
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-2xl font-bold">Dashboard Overview</h2>
//           <p className="text-sm text-gray-600">
//             Monitor inter-departmental projects and resource coordination
//           </p>
//         </div>
//         <div className="flex gap-4">
//           <button className="btn btn-outline">⬇ Export Data</button>
//           <button className="btn btn-primary">+ New Project</button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <StatCard
//           title="Active Projects"
//           value={stats.activeProjects}
//           icon={<FolderIcon />}
//           description="Currently in progress"
//         />
//         <StatCard
//           title="Departments"
//           value={stats.departments}
//           icon={<BuildingIcon />}
//           description="Total registered"
//         />
//         <StatCard
//           title="Conflicts"
//           value={stats.conflicts}
//           icon={<AlertTriangle />}
//           description="Requiring attention"
//         />
//         <StatCard
//           title="Budget Utilization"
//           value={`${stats.budgetUsed}%`}
//           icon={<DollarSign />}
//           description="Of allocated budget"
//         />
//       </div>

//       {/* Status Message */}
//       <div className="bg-green-100 text-green-800 rounded p-4 mb-6 flex items-center gap-3">
//         <AlertTriangle className="text-green-600" />
//         <div>
//           <strong>No Conflicts Detected</strong>
//           <p className="text-sm">All resource allocations and project timelines are properly coordinated.</p>
//         </div>
//       </div>

//       {/* Recent Projects & Upcoming Milestones */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-lg font-semibold mb-2">📁 Recent Projects</h3>
//           <div className="text-gray-500 text-sm text-center mt-10">
//             <FolderIcon className="mx-auto mb-2" />
//             No recent projects
//           </div>
//         </div>

//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-lg font-semibold mb-2">📅 Upcoming Milestones</h3>
//           <div className="text-gray-500 text-sm text-center mt-10">
//             <Calendar className="mx-auto mb-2" />
//             No upcoming milestones
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({ title, value, icon, description }) {
//   return (
//     <div className="bg-white rounded shadow p-4 flex flex-col justify-between">
//       <div className="flex justify-between items-center">
//         <div>
//           <h4 className="text-sm text-gray-600">{title}</h4>
//           <p className="text-2xl font-bold">{value}</p>
//         </div>
//         <div className="text-blue-600">{icon}</div>
//       </div>
//       <p className="text-xs text-gray-500 mt-1">{description}</p>
//     </div>
//   );
// }


import { useQuery } from "@tanstack/react-query";
import StatsCards from "./DashboardComponents/states-card";
import ConflictAlerts from "./DashboardComponents/conflict-alert";
import ProjectOverview from "./DashboardComponents/project-overview";
import UpcomingMilestones from "./DashboardComponents/upcoming-milestone";
import DepartmentDirectory from "./DashboardComponents/department-directory";
import RecentMessages from "./DashboardComponents/recent-message";
import ResourceAllocationTable from "./DashboardComponents/resource-allocation-table";
import { Button } from "../../ui/Button";
import { Download, Plus } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h2>
            <p className="text-gray-600">Monitor inter-departmental projects and resource coordination</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
        
        <StatsCards stats={stats} isLoading={statsLoading} />
      </div>

      <ConflictAlerts />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProjectOverview />
        </div>
        
        <div className="space-y-6">
          <UpcomingMilestones />
          <DepartmentDirectory />
          <RecentMessages />
        </div>
      </div>

      <div className="mt-8">
        <ResourceAllocationTable />
      </div>
    </div>
  );
}