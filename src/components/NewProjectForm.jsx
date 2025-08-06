import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { useToast } from "../lib/utils";

function NewProjectForm({ onSuccess }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    leadDepartmentId: "",
    status: "planning",
    priority: "medium",
    progress: 0,
    budget: "",
    startDate: "",
    endDate: "",
    createdBy: "current-user-id",
  });

  // ✅ Fetch departments from Firestore
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const snap = await getDocs(collection(db, "departments"));
      return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data) => {
      const docRef = await addDoc(collection(db, "projects"), {
        ...data,
        budget: data.budget ? parseFloat(data.budget) : 0,
        createdAt: Timestamp.now(),
      });
      return docRef;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      setFormData({
        title: "",
        description: "",
        location: "",
        leadDepartmentId: "",
        status: "planning",
        priority: "medium",
        progress: 0,
        budget: "",
        startDate: "",
        endDate: "",
        createdBy: "current-user-id",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProjectMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Title
        </label>
        <Input
          placeholder="Enter project title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Textarea
          placeholder="Describe the project"
          className="min-h-[100px]"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Input
            placeholder="Project location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lead Department
          </label>
          <Select
            value={formData.leadDepartmentId}
            onValueChange={(val) => handleChange("leadDepartmentId", val)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder="Select department"
                value={
                  departments.find((d) => d.id === formData.leadDepartmentId)
                    ?.name || ""
                }
              />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name} ({dept.shortName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <Select
            value={formData.priority}
            onValueChange={(val) => handleChange("priority", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" value={formData.priority} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <Select
            value={formData.status}
            onValueChange={(val) => handleChange("status", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" value={formData.status} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Budget (₹)
        </label>
        <Input
          type="number"
          placeholder="Enter project budget"
          value={formData.budget}
          onChange={(e) => handleChange("budget", e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
          Cancel
        </Button>
        <Button type="submit" disabled={createProjectMutation.isPending}>
          {createProjectMutation.isPending ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </form>
  );
}

export default NewProjectForm;
