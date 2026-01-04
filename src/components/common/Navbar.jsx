import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="py-5 px-6 flex justify-between items-center bg-white shadow-sm">

      {/* ================= LOGO ================= */}
      <h2
        className="text-2xl font-extrabold cursor-pointer text-orange-500"
        onClick={() => navigate("/home")}
      >
        Personal
      </h2>

      {/* ================= MENU ================= */}
      <div className="flex items-center gap-6">

        {/* Public Links */}
        <Link className="nav-link" to="/home">Home</Link>
        <Link className="nav-link" to="/blogs">Blogs</Link>
        <Link className="nav-link" to="/projects">Projects</Link>
        <Link className="nav-link" to="/about">About</Link>

        {/* ================= NOT LOGGED IN ================= */}
        {!user && (
          <button
            className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition hidden md:block"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}

        {/* ================= LOGGED IN ================= */}
        {user && (
          <div className="flex items-center gap-4">

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/add-project")}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
              >
                + Project
              </button>

              <button
                onClick={() => navigate("/add-blog")}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                + Blog
              </button>
            </div>

            {/* Avatar */}
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="profile"
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                {user.email?.[0]?.toUpperCase()}
              </div>
            )}

            {/* Email */}
            <span className="hidden md:block text-gray-700 font-medium max-w-[180px] truncate">
              {user.email}
            </span>

            {/* Logout */}
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
