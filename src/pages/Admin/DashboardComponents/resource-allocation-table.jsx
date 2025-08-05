import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/Card";
import { Badge } from "../../../ui/Badge";
import { Button } from "../../../ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/Table";
import { Skeleton } from "../../../ui/Skeleton";
import { Package, Eye } from "lucide-react";
import { format } from "date-fns";

export default function ResourceAllocationTable() {
  const { data: allocations = [], isLoading: allocationsLoading } = useQuery({
    queryKey: ['/api/resource-allocations'],
  });

  const { data: resources = [] } = useQuery({
    queryKey: ['/api/resources'],
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['/api/projects'],
  });

  const getResourceName = (id) => {
    const resource = resources.find((r) => r.id === id);
    return resource?.name || 'Unknown Resource';
  };

  const getProjectName = (id) => {
    const project = projects.find((p) => p.id === id);
    return project?.title || 'Unknown Project';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // Show recent allocations
  const recentAllocations = allocations
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  if (allocationsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Resource Allocations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="mr-2 h-5 w-5" />
          Resource Allocations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentAllocations.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resource allocations</h3>
            <p className="text-gray-600">Resources will appear here once they are allocated to projects.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAllocations.map((allocation) => (
                  <TableRow key={allocation.id}>
                    <TableCell className="font-medium">
                      {getResourceName(allocation.resourceId)}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {getProjectName(allocation.projectId)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {allocation.allocatedQuantity}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(allocation.startDate), 'MMM dd')} - {format(new Date(allocation.endDate), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(allocation.status || 'active')}>
                        {allocation.status || 'active'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}