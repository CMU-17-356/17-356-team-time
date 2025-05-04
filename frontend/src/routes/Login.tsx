// src/routes/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signin, error, loading } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signin(formData.username, formData.password);
      // Redirect to feed page on successful login
      navigate("/feed");
    } catch (error) {
      // Error is handled in the auth context
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#ffffff]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            name="username"
            placeholder="Username or User ID"
            className="w-full p-2 border rounded mb-2"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded mb-4"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#A9CEEF] text-white py-2 rounded hover:bg-[#86BBE9]"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
        <p className="mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-[#293577] hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
