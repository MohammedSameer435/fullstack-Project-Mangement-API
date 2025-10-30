import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { requestPasswordReset } from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", form);
      localStorage.setItem("token", res.data.token);
      setMessage("Logged in successfully!");

      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setMessage((err.response?.data?.message || "Invalid credentials"));
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset(resetEmail);
      setResetMessage(" Password reset link sent! Please check your email.");
    } catch (err) {
      setResetMessage((err.response?.data?.message || "Failed to send email"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold rounded-md py-2 hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}

        {/* Forgot password toggle */}
        <p className="mt-4 text-center text-sm">
          <button
            onClick={() => setShowForgot(!showForgot)}
            className="text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </p>

        {/* Forgot password form */}
        {showForgot && (
          <form onSubmit={handleForgotPassword} className="mt-4 space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold rounded-md py-2 hover:bg-blue-700 transition"
            >
              Send Reset Link
            </button>
            {resetMessage && (
              <p className="text-sm text-center text-gray-600">{resetMessage}</p>
            )}
          </form>
        )}

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <a href="/" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
