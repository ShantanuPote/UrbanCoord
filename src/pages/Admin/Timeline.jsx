import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "../../firebase"; // make sure this path is correct

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/Select";

import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  format,
  isAfter,
  startOfWeek,
} from "date-fns";

export default function Timeline() {
  const [viewMode, setViewMode] = useState("week");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // 🔥 Fetch Projects from Firestore
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const snap = await getDocs(collection(db, "projects"));
      return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });

  // 🔥 Fetch Milestones from Firestore
  const { data: milestones = [], isLoading: milestonesLoading } = useQuery({
    queryKey: ["milestones"],
    queryFn: async () => {
      const snap = await getDocs(collection(db, "milestones"));
      return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });

  // 🔥 Fetch Departments from Firestore
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const snap = await getDocs(collection(db, "departments"));
      return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });

  const getDepartmentName = (id) => {
    const dept = departments.find((d) => d.id === id);
    return dept?.shortName || dept?.name || "Unknown";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "planning":
        return "bg-blue-100 text-blue-800";
      case "delayed":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMilestoneIcon = (status, dueDate) => {
    const now = new Date();
    if (status === "completed") return CheckCircle;
    if (isAfter(now, new Date(dueDate))) return AlertCircle;
    return Clock;
  };

  const getMilestoneColor = (status, dueDate) => {
    const now = new Date();
    if (status === "completed") return "text-green-600";
    if (isAfter(now, new Date(dueDate))) return "text-red-600";
    return "text-blue-600";
  };

  // 🔄 Filter data
  const filteredProjects = selectedDepartment === "all"
    ? projects
    : projects.filter(
        (p) =>
          p.leadDepartmentId === selectedDepartment ||
          p.collaboratingDepartments?.includes(selectedDepartment)
      );

  const filteredMilestones = selectedDepartment === "all"
    ? milestones
    : milestones.filter((m) => {
        const project = projects.find((p) => p.id === m.projectId);
        return (
          project &&
          (project.leadDepartmentId === selectedDepartment ||
            project.collaboratingDepartments?.includes(selectedDepartment))
        );
      });

  // 🧱 Timeline items
  const timelineItems = [];

  filteredProjects.forEach((project) => {
    if (project.startDate) {
      timelineItems.push({
        id: `start-${project.id}`,
        type: "project-start",
        date: new Date(project.startDate),
        title: `${project.title} - Start`,
        project,
        status: project.status,
      });
    }
    if (project.endDate) {
      timelineItems.push({
        id: `end-${project.id}`,
        type: "project-end",
        date: new Date(project.endDate),
        title: `${project.title} - End`,
        project,
        status: project.status,
      });
    }
  });

  filteredMilestones.forEach((milestone) => {
    const project = projects.find((p) => p.id === milestone.projectId);
    timelineItems.push({
      id: `milestone-${milestone.id}`,
      type: "milestone",
      date: new Date(milestone.dueDate),
      title: milestone.title,
      milestone,
      project,
      status: milestone.status || "pending",
    });
  });

  // 🗂️ Group items by week/month/year
  timelineItems.sort((a, b) => a.date.getTime() - b.date.getTime());

  const groupedItems = {};
  timelineItems.forEach((item) => {
    const date = new Date(item.date);
    let key;
    if (viewMode === "week") {
      key = format(startOfWeek(date), "yyyy-MM-dd");
    } else if (viewMode === "month") {
      key = format(date, "yyyy-MM");
    } else {
      key = format(date, "yyyy");
    }

    if (!groupedItems[key]) groupedItems[key] = [];
    groupedItems[key].push(item);
  });

  if (projectsLoading || milestonesLoading) {
    return <div className="text-gray-500 p-8">Loading timeline...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Timeline</h2>
        <div className="flex gap-4">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {Object.keys(groupedItems).length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <Calendar className="mx-auto h-10 w-10 text-gray-400 mb-3" />
              <p className="text-gray-500">No timeline items found.</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedItems).map(([key, items]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {viewMode === "week"
                    ? `Week of ${format(new Date(key), "MMM dd, yyyy")}`
                    : viewMode === "month"
                    ? format(new Date(`${key}-01`), "MMMM yyyy")
                    : key}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => {
                  const Icon =
                    item.type === "milestone"
                      ? getMilestoneIcon(item.status, item.date)
                      : item.type === "project-start"
                      ? CheckCircle
                      : Clock;

                  const iconColor =
                    item.type === "milestone"
                      ? getMilestoneColor(item.status, item.date)
                      : item.type === "project-start"
                      ? "text-green-600"
                      : "text-red-600";

                  return (
                    <div key={item.id} className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
                        <Icon className={`w-4 h-4 ${iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{item.title}</p>
                            <p className="text-xs text-gray-500">{format(item.date, "MMM dd, yyyy")}</p>
                            <div className="text-sm text-gray-600">
                              {item.project && (
                                <>
                                  <div className="mt-1 flex items-center gap-2">
                                    <Building2 className="w-3 h-3" />
                                    {getDepartmentName(item.project.leadDepartmentId)}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-3 h-3" />
                                    {item.project.location}
                                  </div>
                                </>
                              )}
                              {item.milestone?.description && (
                                <p className="mt-2">{item.milestone.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1 text-right">
                            <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.type === "milestone"
                                ? "Milestone"
                                : item.type === "project-start"
                                ? "Start"
                                : "End"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
