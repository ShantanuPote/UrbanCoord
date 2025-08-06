// import { useEffect, useState } from "react";
// import { db, auth } from "../../firebase";
// import {
//   collection,
//   getDocs,
//   deleteDoc,
//   doc,
//   addDoc,
//   Timestamp,
// } from "firebase/firestore";
// import EditProjectModal from "../../components/EditProjectModal";

// export default function Projects() {
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     location: "",
//     startDate: "",
//     endDate: "",
//     departments: [],
//     isInterDepartmental: false,
//   });

//   const [projects, setProjects] = useState([]);
//   const [filteredProjects, setFilteredProjects] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filterDept, setFilterDept] = useState("");
//   const [interDeptOnly, setInterDeptOnly] = useState(false);
//   const [editingProject, setEditingProject] = useState(null);

//   const departmentsList = ["NMC", "PWD", "MNGL", "MJP", "Smart City SPV", "MSEDCL"];

//   // 🔄 Fetch All Projects
//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     const querySnapshot = await getDocs(collection(db, "projects"));
//     const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     setProjects(data);
//     setFilteredProjects(data);
//   };

//   // 🔍 Filtering
//   useEffect(() => {
//     let filtered = [...projects];

//     if (search) {
//       filtered = filtered.filter(
//         (p) =>
//           p.title.toLowerCase().includes(search.toLowerCase()) ||
//           p.location.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (filterDept) {
//       filtered = filtered.filter((p) => p.departments?.includes(filterDept));
//     }

//     if (interDeptOnly) {
//       filtered = filtered.filter((p) => p.isInterDepartmental);
//     }

//     setFilteredProjects(filtered);
//   }, [search, filterDept, interDeptOnly, projects]);

//   // 📦 Form Handlers
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (name === "departments") {
//       const updated = [...form.departments];
//       if (checked) updated.push(value);
//       else updated.splice(updated.indexOf(value), 1);
//       setForm({ ...form, departments: updated });
//     } else {
//       setForm({ ...form, [name]: type === "checkbox" ? checked : value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await addDoc(collection(db, "projects"), {
//         ...form,
//         createdAt: Timestamp.now(),
//         createdBy: auth.currentUser.uid,
//       });
//       alert("✅ Project added!");
//       setForm({
//         title: "",
//         description: "",
//         location: "",
//         startDate: "",
//         endDate: "",
//         departments: [],
//         isInterDepartmental: false,
//       });
//       fetchProjects();
//     } catch (err) {
//       console.error("Error adding project:", err);
//       alert("❌ Failed to add project.");
//     }
//   };

//   const handleDelete = async (id) => {
//     const confirm = window.confirm("Are you sure you want to delete this project?");
//     if (!confirm) return;
//     try {
//       await deleteDoc(doc(db, "projects", id));
//       alert("🗑️ Project deleted!");
//       fetchProjects();
//     } catch (err) {
//       console.error("Error deleting project:", err);
//       alert("Failed to delete.");
//     }
//   };
 
//   const handleEdit = (project) => setEditingProject(project);
//   const handleUpdate = async () => {
//     await fetchProjects();
//     setEditingProject(null);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-10">
//       {/* 🆕 Add Project Form */}
//       <div className="bg-white p-6 rounded shadow">
//         <h2 className="text-xl font-bold mb-4">📋 Add New Project</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input className="input w-full" type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
//           <textarea className="input w-full" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
//           <input className="input w-full" type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
//           <div className="flex gap-4">
//             <input className="input flex-1" type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
//             <input className="input flex-1" type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
//           </div>

//           <div>
//             <label className="block font-semibold mb-2">🏛️ Departments:</label>
//             <div className="flex flex-wrap gap-4">
//               {departmentsList.map((dept) => (
//                 <label key={dept} className="flex items-center gap-2">
//                   <input type="checkbox" name="departments" value={dept} checked={form.departments.includes(dept)} onChange={handleChange} />
//                   {dept}
//                 </label>
//               ))}
//             </div>
//           </div>

//           <label className="block mt-2">
//             <input type="checkbox" name="isInterDepartmental" checked={form.isInterDepartmental} onChange={handleChange} />
//             <span className="ml-2">Is Inter-Departmental?</span>
//           </label>

//           <button type="submit" className="btn">➕ Add Project</button>
//         </form>
//       </div>

//       {/* 📃 Project List & Filters */}
//       <div>
//         <h2 className="text-xl font-bold mb-4">📃 Project List</h2>
//         <div className="flex flex-wrap gap-4 mb-4">
//           <input type="text" placeholder="Search title/location" className="input" value={search} onChange={(e) => setSearch(e.target.value)} />
//           <select className="input" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
//             <option value="">All Departments</option>
//             {departmentsList.map((dept) => (
//               <option key={dept} value={dept}>{dept}</option>
//             ))}
//           </select>
//           <label className="flex items-center gap-2">
//             <input type="checkbox" checked={interDeptOnly} onChange={(e) => setInterDeptOnly(e.target.checked)} />
//             Inter-departmental only
//           </label>
//         </div>

//         <div className="space-y-4">
//           {filteredProjects.length === 0 && <p className="text-gray-500">No projects found.</p>}
//           {filteredProjects.map((project) => (
//             <div key={project.id} className="bg-white p-4 rounded shadow hover:bg-gray-50 transition">
//               <h3 className="text-lg font-semibold">{project.title}</h3>
//               <p className="text-gray-600">{project.description}</p>
//               <p className="text-sm text-gray-500">
//                 📍 {project.location} | 🏛 {project.departments?.join(", ")} | 📅 {project.startDate} → {project.endDate}
//               </p>
//               {project.isInterDepartmental && (
//                 <span className="inline-block mt-2 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded">
//                   Inter-Departmental
//                 </span>
//               )}
//               <div className="mt-4 flex gap-4">
//                 <button className="text-blue-600 hover:underline" onClick={() => handleEdit(project)}>✏️ Edit</button>
//                 <button className="text-red-600 hover:underline" onClick={() => handleDelete(project.id)}>❌ Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ✏️ Edit Modal */}
//       {editingProject && (
//         <EditProjectModal
//           project={editingProject}
//           onClose={() => setEditingProject(null)}
//           onUpdate={handleUpdate}
//         />
//       )}
//     </div>
//   );
// }


import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // adjust path if needed

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { Input } from "../../ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/Select";
import { Progress } from "../../ui/Progress";
import { Plus, Search, Filter, MapPin, Building2, Users, Calendar, FolderOpen } from "lucide-react";
import NewProjectForm from "../../components/NewProjectForm";
import { format } from "date-fns";

// Firestore query function for projects
const fetchProjects = async () => {
  const snapshot = await getDocs(collection(db, "projects"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Firestore query function for departments
const fetchDepartments = async () => {
  const snapshot = await getDocs(collection(db, "departments"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });

  const getDepartmentName = (id) => {
    const dept = departments.find((d) => d.id === id);
    return dept?.shortName || dept?.name || "Unknown Department";
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

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "planning":
        return "Planning";
      case "delayed":
        return "Delayed";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Projects</h2>
          <p className="text-gray-600">Manage inter-departmental projects and coordination</p>
        </div>

        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>

        {isCreateDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
                <NewProjectForm onSuccess={() => setIsCreateDialogOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FolderOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{project.title}</CardTitle>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="mr-1 h-4 w-4" />
                      {project.location}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusText(project.status)}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(project.priority)}>
                      {project.priority || "Medium"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {project.description || "No description provided"}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Building2 className="mr-1 h-4 w-4" />
                    {getDepartmentName(project.leadDepartmentId)}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="mr-1 h-4 w-4" />
                    {(project.collaboratingDepartments?.length || 0) + 1} Depts
                  </div>
                </div>

                {project.startDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-1 h-4 w-4" />
                    {format(new Date(project.startDate), "MMM dd, yyyy")}
                    {project.endDate && (
                      <span> - {format(new Date(project.endDate), "MMM dd, yyyy")}</span>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{project.progress || 0}%</span>
                  </div>
                  <Progress value={project.progress || 0} className="h-2" />
                </div>

                {project.budget && (
                  <div className="text-sm text-gray-600">
                    Budget: ₹{(project.budget / 100000).toFixed(1)}L
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
