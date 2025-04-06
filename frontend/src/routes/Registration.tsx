// tailwind docs: https://v2.tailwindcss.com/docs/
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { PROFILE_API_ENDPOINT } from "../consts";

const UserRegistration: React.FC = () => {
  const navigate = useNavigate();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const res = await axios.post(PROFILE_API_ENDPOINT, {
        userId: formData.userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        institution: formData.institution,
        fieldOfInterest: formData.fieldOfInterest,
        bio: formData.bio,
      });

      alert("Registration Successful!");
      console.log("User Created:", res.data);
      navigate(`/profile/${formData.userId}`, { replace: true });
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Registration failed. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fce6d2]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">User Registration</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            name="userId"
            placeholder="User ID"
            className="w-full p-2 border rounded mb-2"
            onChange={handleChange}
            required
          />
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
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;
