import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, Mail, Phone } from "lucide-react"

export default function DepartmentDirectory() {
  const { data: departments = [], isLoading } = useQuery({
    queryKey: ["/api/departments"]
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="mr-2 h-5 w-5" />
            Department Directory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="mr-2 h-5 w-5" />
          Department Directory
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {departments.map(department => (
          <div
            key={department.id}
            className="border border-gray-200 rounded-lg p-3"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900 text-sm">
                  {department.name}
                </h4>
                {department.shortName && (
                  <Badge variant="outline" className="text-xs mt-1">
                    {department.shortName}
                  </Badge>
                )}
              </div>
              <div
                className={`w-2 h-2 rounded-full ${
                  department.isActive ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>

            {department.headOfDepartment && (
              <p className="text-xs text-gray-600 mb-2">
                Head: {department.headOfDepartment}
              </p>
            )}

            <div className="space-y-1">
              {department.contactEmail && (
                <div className="flex items-center text-xs text-gray-500">
                  <Mail className="h-3 w-3 mr-1" />
                  <span className="truncate">{department.contactEmail}</span>
                </div>
              )}
              {department.contactPhone && (
                <div className="flex items-center text-xs text-gray-500">
                  <Phone className="h-3 w-3 mr-1" />
                  {department.contactPhone}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
 