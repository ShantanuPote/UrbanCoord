import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import EditProjectModal from "../../components/EditProjectModal";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [interDeptOnly, setInterDeptOnly] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const departments = ["NMC", "PWD", "MNGL", "MJP", "Smart City SPV", "MSEDCL"];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProjects(data);
    setFilteredProjects(data);
  };

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

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this project?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "projects", id));
      alert("Project deleted!");
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project.");
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
  };

  const handleUpdate = async () => {
    await fetchProjects(); // reload updated data
    setEditingProject(null); // close modal
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📃 All Projects</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title or location"
          className="input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input"
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={interDeptOnly}
            onChange={(e) => setInterDeptOnly(e.target.checked)}
          />
          Inter-departmental only
        </label>
      </div>

      {/* Project List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 && (
          <p className="text-gray-500">No projects found.</p>
        )}

        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="border rounded p-4 bg-white shadow hover:bg-gray-50 transition"
          >
            <h3 className="text-lg font-semibold">{project.title}</h3>
            <p className="text-gray-600">{project.description}</p>
            <p className="text-sm text-gray-500">
              📍 {project.location} | 🏛 {project.departments?.join(", ")} | 📅{" "}
              {project.startDate} → {project.endDate}
            </p>

            {project.isInterDepartmental && (
              <span className="inline-block mt-2 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded">
                Inter-Departmental
              </span>
            )}

            {/* Edit/Delete Buttons */}
            <div className="mt-4 flex gap-4">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => handleEdit(project)}
              >
                ✏️ Edit
              </button>
              <button
                className="text-red-600 hover:underline"
                onClick={() => handleDelete(project.id)}
              >
                ❌ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
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
