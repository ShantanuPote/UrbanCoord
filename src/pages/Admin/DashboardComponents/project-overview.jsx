import { useEffect, useState } from "react";
import { db } from "../../../firebase"; // Make sure your firebase.js exports db
import { collection, getDocs } from "firebase/firestore";

import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/Card";
import { Badge } from "../../../ui/Badge";
import { Progress } from "../../../ui/Progress";
import { Skeleton } from "../../../ui/Skeleton";
import { FolderOpen, MapPin, Building2 } from "lucide-react";
import { format } from "date-fns";

export default function ProjectOverview() {
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const projectSnap = await getDocs(collection(db, "projects"));
      const deptSnap = await getDocs(collection(db, "departments"));

      const projectData = projectSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const deptData = deptSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setProjects(projectData);
      setDepartments(deptData);
    } catch (err) {
      console.error("Error fetching projects or departments:", err);
    }
    setLoading(false);
  };

  const getDepartmentName = (id) => {
    const dept = departments.find((d) => d.id === id);
    return dept?.shortName || dept?.name || "Unknown Department";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "planning": return "bg-blue-100 text-blue-800";
      case "delayed": return "bg-red-100 text-red-800";
      case "completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const recentProjects = projects
    .filter(p => p.status === 'active' || p.status === 'planning')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FolderOpen className="mr-2 h-5 w-5" />
            Recent Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FolderOpen className="mr-2 h-5 w-5" />
          Recent Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentProjects.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active projects</h3>
            <p className="text-gray-600">Create your first project to get started with inter-departmental coordination.</p>
          </div>
        ) : (
          recentProjects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">{project.title}</h4>
                <Badge className={getStatusColor(project.status)} variant="secondary">
                  {project.status}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {project.location}
                </div>
                <div className="flex items-center">
                  <Building2 className="h-3 w-3 mr-1" />
                  {getDepartmentName(project.leadDepartmentId)}
                </div>
                {project.startDate && (
                  <div className="text-xs text-gray-500">
                    Started: {format(new Date(project.startDate), "MMM dd, yyyy")}
                  </div>
                )}
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{project.progress || 0}%</span>
                </div>
                <Progress value={project.progress || 0} className="h-2" />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
