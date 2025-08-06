import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase"; // ✅ Make sure this path is correct

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { Input } from "../../ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/Select";
import {
  Plus,
  Search,
  Filter,
  Package,
  Wrench,
  Users,
  Truck,
} from "lucide-react";
// import ResourceForm from "../components/resources/resource-form";

// ✅ Firestore Query Function
const fetchResources = async () => {
  const snapshot = await getDocs(collection(db, "resources"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: fetchResources,
  });

  const getResourceIcon = (type) => {
    switch (type) {
      case 'equipment': return Wrench;
      case 'vehicle': return Truck;
      case 'personnel': return Users;
      default: return Package;
    }
  };

  const getStatusColor = (quantity, totalQuantity) => {
    const utilization = (quantity / totalQuantity) * 100;
    if (utilization >= 100) return 'bg-red-100 text-red-800';
    if (utilization >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getAvailabilityText = (quantity, totalQuantity) => {
    const utilization = (quantity / totalQuantity) * 100;
    if (utilization >= 100) return 'Fully Allocated';
    if (utilization >= 80) return 'Limited Availability';
    return 'Available';
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || resource.type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Resources</h2>
          <p className="text-gray-600">Manage equipment, personnel, and assets</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Resource
        </Button>
      </div>

      {isCreateDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Add New Resource</h2>
              <ResourceForm onSuccess={() => setIsCreateDialogOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          {({ value, onValueChange, isOpen, setIsOpen, disabled }) => (
            <>
              <SelectTrigger className="w-48" isOpen={isOpen} setIsOpen={setIsOpen} disabled={disabled}>
                <SelectValue placeholder="Filter by category" value={value} />
              </SelectTrigger>
              <SelectContent isOpen={isOpen} setIsOpen={setIsOpen}>
                <SelectItem value="all" onValueChange={onValueChange} setIsOpen={setIsOpen}>All Categories</SelectItem>
                <SelectItem value="equipment" onValueChange={onValueChange} setIsOpen={setIsOpen}>Equipment</SelectItem>
                <SelectItem value="vehicle" onValueChange={onValueChange} setIsOpen={setIsOpen}>Vehicles</SelectItem>
                <SelectItem value="personnel" onValueChange={onValueChange} setIsOpen={setIsOpen}>Personnel</SelectItem>
                <SelectItem value="technology" onValueChange={onValueChange} setIsOpen={setIsOpen}>Technology</SelectItem>
              </SelectContent>
            </>
          )}
        </Select>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || categoryFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by adding your first resource"}
            </p>
            {!searchQuery && categoryFilter === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Resource
              </Button>
            )}
          </div>
        ) : (
          filteredResources.map((resource) => {
            const ResourceIcon = getResourceIcon(resource.type);
            const allocated = resource.allocatedQuantity || 0;
            const total = resource.totalQuantity || 0;
            const available = total - allocated;

            return (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ResourceIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{resource.name}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">
                          {resource.type || 'general'}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={getStatusColor(allocated, total)} variant="secondary">
                      {getAvailabilityText(allocated, total)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {resource.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Availability</span>
                      <span className="font-medium">{available} of {total} available</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${total > 0 ? (allocated / total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {resource.currentLocation && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Location:</span> {resource.currentLocation}
                    </div>
                  )}

                  {resource.costPerUnit && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Cost:</span> ₹{resource.costPerUnit.toLocaleString()} per unit
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
