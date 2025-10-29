import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Trash2, Edit, Eye } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [showNotes, setShowNotes] = useState({});
  const [notes, setNotes] = useState({});
  const [noteInputs, setNoteInputs] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data.data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setMessage("❌ Failed to fetch projects");
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    try {
      const res = await API.post("/projects", {
        name: newProjectName,
        description: newProjectDescription,
      });
      setProjects([...projects, res.data.data]);
      setNewProjectName("");
      setNewProjectDescription("");
      setMessage("✅ Project created successfully!");
    } catch (err) {
      console.error("Error creating project:", err);
      setMessage("❌ Failed to create project");
    }
  };

  const handleUpdateProject = async (projectId) => {
    try {
      const res = await API.put(`/projects/${projectId}`, {
        name: editName,
        description: editDesc,
      });
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? res.data.data : p))
      );
      setEditingProjectId(null);
      setMessage("✏️ Project updated successfully!");
    } catch (err) {
      console.error("Error updating project:", err);
      setMessage("❌ Failed to update project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await API.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      setMessage("🗑️ Project deleted successfully!");
    } catch (err) {
      console.error("Error deleting project:", err);
      setMessage("❌ Failed to delete project");
    }
  };

  const handleAddMember = async (e, projectId) => {
    e.preventDefault();
    try {
      const res = await API.post(`/projects/${projectId}/members`, { email, role });
      const updatedProject = res.data.data;
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? updatedProject : p))
      );
      setMessage("✅ Member added successfully!");
      setEmail("");
      setRole("Member");
    } catch (err) {
      console.error("Error adding member:", err.response || err);
      setMessage(`❌ ${err.response?.data?.message || "Failed to add member"}`);
    }
  };

  const handleRemoveMember = async (projectId, memberId) => {
    try {
      const res = await API.delete(`/projects/${projectId}/members/${memberId}`);
      const updatedProject = res.data.data;
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? updatedProject : p))
      );
      setMessage("🗑️ Member removed successfully!");
    } catch (err) {
      console.error("Error removing member:", err);
      setMessage("❌ Failed to remove member");
    }
  };

  const toggleNotes = async (projectId) => {
    if (showNotes[projectId]) {
      setShowNotes((prev) => ({ ...prev, [projectId]: false }));
    } else {
      try {
        const res = await API.get(`/notes/${projectId}`);
        setNotes((prev) => ({ ...prev, [projectId]: res.data.data || [] }));
      } catch (err) {
        console.error("Error loading notes:", err);
        setNotes((prev) => ({ ...prev, [projectId]: [] }));
      }
      setShowNotes((prev) => ({ ...prev, [projectId]: true }));
    }
  };

  const handleAddNote = async (e, projectId) => {
    e.preventDefault();
    const content = noteInputs[projectId]?.trim();
    if (!content) return;

    try {
      const res = await API.post(`/notes/${projectId}`, { content });
      setNotes((prev) => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), res.data.data],
      }));
      setNoteInputs((prev) => ({ ...prev, [projectId]: "" }));
    } catch (err) {
      console.error("Error adding note:", err);
      setMessage("❌ Failed to add note");
    }
  };

  const handleDeleteNote = async (projectId, noteId) => {
    try {
      await API.delete(`/notes/${projectId}/n/${noteId}`);
      setNotes((prev) => ({
        ...prev,
        [projectId]: prev[projectId].filter((n) => n._id !== noteId),
      }));
    } catch (err) {
      console.error("Error deleting note:", err);
      setMessage("❌ Failed to delete note");
    }
  };

  const startEditing = (project) => {
    setEditingProjectId(project._id);
    setEditName(project.name);
    setEditDesc(project.description);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Projects</h2>
      {message && <p className="mb-4 text-blue-600">{message}</p>}

      {/* ➕ Add New Project */}
      <form
        onSubmit={handleAddProject}
        className="flex flex-col md:flex-row gap-3 mb-8"
      >
        <input
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="Project name"
          required
          className="border rounded-lg px-4 py-2 flex-1"
        />
        <input
          value={newProjectDescription}
          onChange={(e) => setNewProjectDescription(e.target.value)}
          placeholder="Project description"
          className="border rounded-lg px-4 py-2 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          Add Project
        </button>
      </form>

      {/* 📋 Project List */}
      <div className="space-y-6">
        {projects.length === 0 ? (
          <p className="text-gray-600">No projects found.</p>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
            >
              {editingProjectId === project._id ? (
                <div className="space-y-3">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border rounded-lg px-4 py-2 w-full"
                  />
                  <input
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="border rounded-lg px-4 py-2 w-full"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateProject(project._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProjectId(null)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {project.name}
                      </h3>
                      <p className="text-gray-600">{project.description}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => startEditing(project)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project._id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                      <button
                        onClick={() => toggleNotes(project._id)}
                        className="text-gray-700 hover:text-black flex items-center gap-1"
                      >
                        <Eye size={16} />{" "}
                        {showNotes[project._id] ? "Hide Notes" : "Notes"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-4 border-t pt-4">
                <h4 className="font-semibold text-gray-700 mb-2">Members:</h4>
                <ul className="space-y-1 mb-2">
                  {project.members && project.members.length > 0 ? (
                    project.members.map((m) => (
                      <li
                        key={m.user?._id || m._id}
                        className="flex justify-between items-center text-gray-700"
                      >
                        <span>
                          {m.user?.name || m.user?.email || "Unknown"} (
                          {m.role || "Member"})
                        </span>
                        <button
                          onClick={() =>
                            handleRemoveMember(project._id, m.user?._id || m._id)
                          }
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No members yet</li>
                  )}
                </ul>

                <form
                  onSubmit={(e) => handleAddMember(e, project._id)}
                  className="flex flex-col md:flex-row gap-2 mt-3"
                >
                  <input
                    type="email"
                    placeholder="Enter member's email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border rounded-lg px-3 py-2 flex-1"
                  />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="border rounded-lg px-3 py-2"
                  >
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Add Member
                  </button>
                </form>
              </div>

              {showNotes[project._id] && (
                <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Notes</h4>
                  <form
                    onSubmit={(e) => handleAddNote(e, project._id)}
                    className="flex flex-col md:flex-row gap-2 mb-3"
                  >
                    <input
                      placeholder="Write a note..."
                      value={noteInputs[project._id] || ""}
                      onChange={(e) =>
                        setNoteInputs((prev) => ({
                          ...prev,
                          [project._id]: e.target.value,
                        }))
                      }
                      className="border rounded-lg px-3 py-2 flex-1"
                    />
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      Add
                    </button>
                  </form>

                  <ul className="space-y-1">
                    {(notes[project._id] || []).length === 0 ? (
                      <li className="text-gray-500">No notes yet</li>
                    ) : (
                      notes[project._id].map((n) => (
                        <li
                          key={n._id}
                          className="flex justify-between items-center text-gray-700"
                        >
                          {n.content}
                          <button
                            onClick={() =>
                              handleDeleteNote(project._id, n._id)
                            }
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
