import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password match check
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl p-10 bg-white rounded-xl shadow-lg"
      >
        {/* ================= BACK TO HOME ================= */}
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 mb-4 transition"
        >
          ← Back to Home
        </button>

        {/* ================= TITLE ================= */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Sign Up 📝
        </h2>

        {/* ================= EMAIL ================= */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* ================= PASSWORD ================= */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* ================= CONFIRM PASSWORD ================= */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* ================= LOGIN LINK ================= */}
        <p
          className="text-blue-600 cursor-pointer my-3 hover:underline"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login here
        </p>

        {/* ================= SUBMIT ================= */}
        <button
          type="submit"
          className="
            bg-gradient-to-r from-orange-400 to-orange-500
            text-white py-3 px-6 rounded-lg
            hover:from-orange-500 hover:to-orange-600
            transition font-semibold
          "
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Signup;
