import { useUserRole } from "../hooks/useUserRole";


import AdminDashboard from "./Dashboards/AdminDashboard";
import OfficerDashboard from "./Dashboards/OfficerDashboard";
import ContractorDashboard from "./Dashboards/ContractorDashboard";
import EngineerDashboard from "./Dashboards/EngineerDashboard";

export default function Dashboard() {
  const user = useUserRole();

  if (!user) return <p className="p-4">Loading user data...</p>;

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "officer":
      return <OfficerDashboard department={user.department} />;
    case "contractor":
      return <ContractorDashboard />;
    case "engineer":
      return <EngineerDashboard />;
    default:
      return <p className="p-4 text-red-500">Unknown user role.</p>;
  }
}
