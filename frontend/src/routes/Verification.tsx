// src/routes/Verification.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Verification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Try to get username from location state (passed from registration)
  const username = location.state?.username || "";

  // If no username in state, allow user to enter it
  const [userIdInput, setUserIdInput] = useState(username);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post("http://localhost:5001/api/auth/confirm", {
        username: userIdInput,
        code: verificationCode,
      });

      // Show success message
      alert("Your account has been verified successfully! You can now log in.");

      // Redirect to login page
      navigate("/login");
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(
        err.response?.data?.error ||
          "Failed to verify your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fce6d2]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Verify Your Account</h2>
        <p className="mb-4 text-gray-600">
          Please enter the verification code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className="w-full">
          {!username && (
            <input
              type="text"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              placeholder="User ID"
              className="w-full p-2 border rounded mb-4"
              required
            />
          )}

          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Verification Code"
            className="w-full p-2 border rounded mb-4"
            required
          />

          <button
            type="submit"
            className="w-full bg-[#faab99] text-white py-2 rounded hover:bg-[#f89686]"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Account"}
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Verification;
