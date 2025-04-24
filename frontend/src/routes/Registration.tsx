// src/routes/Registration.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const { signup, error, loading } = useAuth();

  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    institution: "",
    fieldOfInterest: "",
    bio: "",
    password: "",
    confirmPassword: "",
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userIdExists, setUserIdExists] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Reset the userIdExists error when userId changes
    if (e.target.name === "userId") {
      setUserIdExists(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Use the signup method from our auth context
      await signup({
        userId: formData.userId,
        password: formData.password,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        institution: formData.institution,
        fieldOfInterest: formData.fieldOfInterest,
        bio: formData.bio,
      });

      // Instead of alert, show a success message in the UI
      setRegistrationSuccess(true);

      // Redirect to verification page and pass the username
      navigate("/verify", { state: { username: formData.userId } });
    } catch (error: any) {
      console.error("Error registering user:", error);

      // Handle specific error for existing user
      if (error.message && error.message.includes("already exists")) {
        setUserIdExists(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fce6d2]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">User Registration</h2>
        {registrationSuccess ? (
          <p className="text-green-600 font-semibold">
            Registration successful!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-2">
              <input
                type="text"
                name="userId"
                placeholder="User ID (for login)"
                className={`w-full p-2 border rounded ${userIdExists ? "border-red-500" : ""}`}
                onChange={handleChange}
                required
              />
              {userIdExists && (
                <p className="text-red-500 text-xs text-left mt-1">
                  This User ID already exists. Please choose another.
                </p>
              )}
            </div>

            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="w-full p-2 border rounded mb-2"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="w-full p-2 border rounded mb-2"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 border rounded mb-2"
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              className="w-full p-2 border rounded mb-2"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="institution"
              placeholder="Institution"
              className="w-full p-2 border rounded mb-2"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="fieldOfInterest"
              placeholder="Field of Interest"
              className="w-full p-2 border rounded mb-2"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="bio"
              placeholder="Bio"
              className="w-full p-2 border rounded mb-2"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 border rounded mb-2"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-2 border rounded mb-4"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-[#faab99] text-white py-2 rounded hover:bg-[#f89686]"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {error && !userIdExists && (
              <p className="text-red-500 mt-2">{error}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Registration;
