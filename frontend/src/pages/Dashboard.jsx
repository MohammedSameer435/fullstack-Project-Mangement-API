import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Projects from "./Projects";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setMessage("❌ Please log in first.");
          navigate("/login");
          return;
        }

        const res = await API.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setMessage("Error fetching user details. Please log in again.");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (message) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-red-600 text-lg">
        {message}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-700 text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome, <span className="text-blue-600">{user.username}</span> 👋
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>

        <div className="space-y-2 mb-6 text-gray-700">
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Role:</span> {user.role}</p>
        </div>

        <nav className="mb-6 border-b border-gray-200 pb-3">
          <Link
            to="projects"
            className="text-blue-600 hover:text-blue-800 font-medium transition"
          >
            View Projects
          </Link>
        </nav>

        <div>
          <Routes>
            <Route path="projects" element={<Projects />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
