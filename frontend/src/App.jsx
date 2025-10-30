import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects"; // 👈 add this import
import Notes from "./pages/Notes"; // 👈 add this import
import ResetPassword from "./pages/ResetPassword"; // added import

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} /> {/*  added route */}

        {/* Dashboard and nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="projects" element={<Projects />} /> {/* /dashboard/projects */}
          <Route path="projects/:projectId/notes" element={<Notes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
