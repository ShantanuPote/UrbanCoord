import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; // adjust if your path is different
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/Card";
import { Skeleton } from "../../../ui/Skeleton";
import { FolderOpen, Building2, AlertTriangle, DollarSign } from "lucide-react";

// Fetch stats from Firestore
const fetchStats = async () => {
  const [projectsSnap, departmentsSnap] = await Promise.all([
    getDocs(collection(db, "projects")),
    getDocs(collection(db, "departments")),
  ]);

  const projects = projectsSnap.docs.map(doc => doc.data());
  const departments = departmentsSnap.docs.map(doc => doc.data());

  const activeProjects = projects.filter(p => p.status === "active").length;
  const conflicts = projects.filter(p => p.hasConflict === true).length;

  const totalBudgetUsed = projects.reduce((sum, p) => sum + (p.budgetUsed || 0), 0);
  const totalBudgetAllocated = projects.reduce((sum, p) => sum + (p.budgetAllocated || 0), 0);

  const budgetUtilization = totalBudgetAllocated
    ? Math.round((totalBudgetUsed / totalBudgetAllocated) * 100)
    : 0;

  return {
    activeProjects,
    departments: departments.length,
    conflicts,
    budgetUtilization,
  };
};

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchStats,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Active Projects</CardTitle>
          <FolderOpen className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.activeProjects}</div>
          <p className="text-xs text-gray-600">Currently in progress</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Departments</CardTitle>
          <Building2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.departments}</div>
          <p className="text-xs text-gray-600">Total registered</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Conflicts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.conflicts}</div>
          <p className="text-xs text-gray-600">Requiring attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Budget Utilization</CardTitle>
          <DollarSign className="h-4 w-4 text-indigo-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.budgetUtilization}%</div>
          <p className="text-xs text-gray-600">Of allocated budget</p>
        </CardContent>
      </Card>
    </div>
  );
}
