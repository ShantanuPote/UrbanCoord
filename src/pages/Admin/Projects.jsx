import { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import EditProjectModal from "../../components/EditProjectModal";

export default function Projects() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    departments: [],
    isInterDepartmental: false,
  });

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [interDeptOnly, setInterDeptOnly] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const departmentsList = ["NMC", "PWD", "MNGL", "MJP", "Smart City SPV", "MSEDCL"];

  // 🔄 Fetch All Projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProjects(data);
    setFilteredProjects(data);
  };

  // 🔍 Filtering
  useEffect(() => {
    let filtered = [...projects];

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterDept) {
      filtered = filtered.filter((p) => p.departments?.includes(filterDept));
    }

    if (interDeptOnly) {
      filtered = filtered.filter((p) => p.isInterDepartmental);
    }

    setFilteredProjects(filtered);
  }, [search, filterDept, interDeptOnly, projects]);

  // 📦 Form Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "departments") {
      const updated = [...form.departments];
      if (checked) updated.push(value);
      else updated.splice(updated.indexOf(value), 1);
      setForm({ ...form, departments: updated });
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "projects"), {
        ...form,
        createdAt: Timestamp.now(),
        createdBy: auth.currentUser.uid,
      });
      alert("✅ Project added!");
      setForm({
        title: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
        departments: [],
        isInterDepartmental: false,
      });
      fetchProjects();
    } catch (err) {
      console.error("Error adding project:", err);
      alert("❌ Failed to add project.");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this project?");
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, "projects", id));
      alert("🗑️ Project deleted!");
      fetchProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete.");
    }
  };
 
  const handleEdit = (project) => setEditingProject(project);
  const handleUpdate = async () => {
    await fetchProjects();
    setEditingProject(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* 🆕 Add Project Form */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">📋 Add New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="input w-full" type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <textarea className="input w-full" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
          <input className="input w-full" type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
          <div className="flex gap-4">
            <input className="input flex-1" type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
            <input className="input flex-1" type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
          </div>

          <div>
            <label className="block font-semibold mb-2">🏛️ Departments:</label>
            <div className="flex flex-wrap gap-4">
              {departmentsList.map((dept) => (
                <label key={dept} className="flex items-center gap-2">
                  <input type="checkbox" name="departments" value={dept} checked={form.departments.includes(dept)} onChange={handleChange} />
                  {dept}
                </label>
              ))}
            </div>
          </div>

          <label className="block mt-2">
            <input type="checkbox" name="isInterDepartmental" checked={form.isInterDepartmental} onChange={handleChange} />
            <span className="ml-2">Is Inter-Departmental?</span>
          </label>

          <button type="submit" className="btn">➕ Add Project</button>
        </form>
      </div>

      {/* 📃 Project List & Filters */}
      <div>
        <h2 className="text-xl font-bold mb-4">📃 Project List</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <input type="text" placeholder="Search title/location" className="input" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="input" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
            <option value="">All Departments</option>
            {departmentsList.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={interDeptOnly} onChange={(e) => setInterDeptOnly(e.target.checked)} />
            Inter-departmental only
          </label>
        </div>

        <div className="space-y-4">
          {filteredProjects.length === 0 && <p className="text-gray-500">No projects found.</p>}
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white p-4 rounded shadow hover:bg-gray-50 transition">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="text-gray-600">{project.description}</p>
              <p className="text-sm text-gray-500">
                📍 {project.location} | 🏛 {project.departments?.join(", ")} | 📅 {project.startDate} → {project.endDate}
              </p>
              {project.isInterDepartmental && (
                <span className="inline-block mt-2 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded">
                  Inter-Departmental
                </span>
              )}
              <div className="mt-4 flex gap-4">
                <button className="text-blue-600 hover:underline" onClick={() => handleEdit(project)}>✏️ Edit</button>
                <button className="text-red-600 hover:underline" onClick={() => handleDelete(project.id)}>❌ Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✏️ Edit Modal */}
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
