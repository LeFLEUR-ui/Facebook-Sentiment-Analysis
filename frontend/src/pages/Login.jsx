import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_email", email);

      navigate("/");
    } catch (err) {
      setError("Server error, please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="bg-[#eef2ff] flex items-center justify-center min-h-screen font-sans p-4">
      <div className="bg-white p-10 rounded-xl shadow-sm w-full max-w-[440px]">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#5d5cf5] p-3 rounded-xl mb-6 shadow-lg shadow-indigo-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Social Media Analytics
          </h1>
          <p className="text-gray-400 text-sm">Administrator login required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="garcia@example.com"
              className="w-full px-4 py-3 bg-[#f3f4f6] border-none rounded-lg text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-[#f3f4f6] border-none rounded-lg text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#050511] text-white py-3.5 rounded-lg font-medium hover:bg-black transition-colors duration-200 mt-2"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 bg-[#f9fafb] py-4 px-6 rounded-lg text-center">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
            Demo credentials:
          </p>
          <p className="text-xs text-gray-500">garcia@example.com / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;