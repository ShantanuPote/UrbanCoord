import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  query
} from "firebase/firestore";
import { db } from "../../firebase"; // ✅ Adjust if path differs

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Skeleton } from "../../ui/Skeleton";
import {
  Building2,
  Mail,
  Phone,
  Users,
  MapPin,
  Calendar
} from "lucide-react";
import { format } from "date-fns";

const fetchDepartments = async () => {
  const snapshot = await getDocs(collection(db, "departments"));
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date()
    };
  });
};

const fetchProjects = async () => {
  const snapshot = await getDocs(collection(db, "projects"));
  return snapshot.docs.map(doc => doc.data());
};

export default function Departments() {
  const { data: departments = [], isLoading: isLoadingDepartments } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects
  });

  const getDepartmentProjects = (departmentId) => {
    return projects.filter(project =>
      project.leadDepartmentId === departmentId ||
      project.collaboratingDepartments?.includes(departmentId)
    );
  };

  const getActiveProjects = (departmentId) => {
    return getDepartmentProjects(departmentId).filter(project =>
      project.status === 'active' || project.status === 'planning'
    ).length;
  };

  if (isLoadingDepartments) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Departments</h2>
          <p className="text-gray-600">Municipal departments and their coordination details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Departments</h2>
        <p className="text-gray-600">Municipal departments and their coordination details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <Card key={department.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{department.name}</CardTitle>
                    {department.shortName && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {department.shortName}
                      </Badge>
                    )}
                  </div>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${department.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {department.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {department.description}
                </p>
              )}

              {department.headOfDepartment && (
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="font-medium">Head:</span>
                  <span className="ml-1">{department.headOfDepartment}</span>
                </div>
              )}

              {department.location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{department.location}</span>
                </div>
              )}

              <div className="space-y-2">
                {department.contactEmail && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="truncate">{department.contactEmail}</span>
                  </div>
                )}
                {department.contactPhone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{department.contactPhone}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Active Projects</span>
                  <Badge variant="secondary">
                    {getActiveProjects(department.id)}
                  </Badge>
                </div>
              </div>

              {department.createdAt && (
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  Added: {format(new Date(department.createdAt), 'MMM dd, yyyy')}
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Projects
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
