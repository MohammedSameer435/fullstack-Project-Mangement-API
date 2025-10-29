import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const Notes = () => {
  const { projectId } = useParams();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  // Load notes for this project
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await API.get(`/notes/${projectId}`);
        setNotes(res.data.data || []);
      } catch (err) {
        console.error("Failed to load notes", err);
        setMessage("Failed to load notes");
        setNotes([]);
      }
    };
    if (projectId) fetchNotes();
  }, [projectId]);

  // Create a note (Admin only)
  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, content };
      const res = await API.post(`/notes/${projectId}`, payload);
      setNotes((prev) => [...prev, res.data.data]);
      setTitle("");
      setContent("");
      setMessage("✅ Note added successfully!");
    } catch (err) {
      console.error("Create note error:", err.response || err);
      setMessage("❌ " + (err.response?.data?.message || "Failed to add note"));
    }
  };

  // Delete a note (Admin only)
  const handleDeleteNote = async (noteId) => {
    try {
      await API.delete(`/notes/${projectId}/n/${noteId}`);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
      setMessage("🗑️ Note deleted");
    } catch (err) {
      console.error("Delete note error:", err);
      setMessage("❌ Failed to delete note");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">📝 Notes for Project</h2>

      <form
        onSubmit={handleCreateNote}
        className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6"
      >
        <input
          className="w-full mb-3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2 h-24 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="Add a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <button
          type="submit"
          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-200"
        >
          ➕ Add Note
        </button>
      </form>

      {message && (
        <p className="text-center text-sm font-medium text-indigo-700 bg-indigo-50 py-2 rounded-md mb-4">
          {message}
        </p>
      )}

      <ul className="space-y-4">
        {notes.length === 0 ? (
          <li className="text-gray-500 text-center italic">No notes yet</li>
        ) : (
          notes.map((note) => (
            <li
              key={note._id}
              className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-150"
            >
              <strong className="block text-lg font-semibold text-gray-800">
                {note.title || "(no title)"}
              </strong>
              <p className="text-gray-700 mt-1">{note.content}</p>
              <small className="text-gray-500 block mt-2">
                By: {note.createdBy?.username || note.createdBy?.email || "Unknown"} —{" "}
                {new Date(note.createdAt).toLocaleString()}
              </small>
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition duration-150"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Notes;
