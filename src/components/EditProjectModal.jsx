import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function EditProjectModal({ project, onClose, onUpdate }) {
  const [formData, setFormData] = useState({ ...project });

  useEffect(() => {
    if (project) {
      setFormData({ ...project });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectRef = doc(db, "projects", project.id);
      await updateDoc(projectRef, formData);
      alert("Project updated!");
      onUpdate(); // refresh project list
      onClose(); // close modal
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4">✏️ Edit Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={formData.title || ""}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location || ""}
            onChange={handleChange}
            className="input"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description || ""}
            onChange={handleChange}
            className="input"
            rows={3}
          ></textarea>
          <input
            type="text"
            name="departments"
            placeholder="Departments (comma separated)"
            value={formData.departments?.join(", ") || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                departments: e.target.value.split(",").map((d) => d.trim()),
              })
            }
            className="input"
          />
          <input
            type="date"
            name="startDate"
            value={formData.startDate || ""}
            onChange={handleChange}
            className="input"
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate || ""}
            onChange={handleChange}
            className="input"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isInterDepartmental"
              checked={formData.isInterDepartmental || false}
              onChange={handleChange}
            />
            Inter-departmental project
          </label>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
