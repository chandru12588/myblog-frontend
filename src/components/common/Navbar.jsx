import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      {/* ================= CONTAINER ================= */}
      <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">

        {/* ================= LOGO ================= */}
        <h2
          onClick={() => navigate("/home")}
          className="text-2xl font-extrabold text-orange-500 cursor-pointer"
        >
          Personal
        </h2>

        {/* ================= DESKTOP MENU ================= */}
        <div className="hidden md:flex items-center gap-6">

          <Link to="/home" className="nav-item">Home</Link>
          <Link to="/blogs" className="nav-item">Blogs</Link>
          <Link to="/projects" className="nav-item">Projects</Link>
          <Link to="/about" className="nav-item">About</Link>

          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="
                px-5 py-2 rounded-lg
                bg-gradient-to-r from-orange-500 to-orange-600
                text-white font-semibold
                shadow-md hover:shadow-lg transition
              "
            >
              Login
            </button>
          )}

          {user && (
            <div className="flex items-center gap-4">

              <button
                onClick={() => navigate("/add-project")}
                className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition"
              >
                + Project
              </button>

              <button
                onClick={() => navigate("/add-blog")}
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                + Blog
              </button>

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

              <button
                onClick={logout}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* ================= MOBILE TOGGLE ================= */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-6 py-6 space-y-5">

          <Link
            to="/home"
            onClick={() => setMenuOpen(false)}
            className="block text-lg font-medium text-gray-800 hover:text-orange-500"
          >
            Home
          </Link>

          <Link
            to="/blogs"
            onClick={() => setMenuOpen(false)}
            className="block text-lg font-medium text-gray-800 hover:text-orange-500"
          >
            Blogs
          </Link>

          <Link
            to="/projects"
            onClick={() => setMenuOpen(false)}
            className="block text-lg font-medium text-gray-800 hover:text-orange-500"
          >
            Projects
          </Link>

          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="block text-lg font-medium text-gray-800 hover:text-orange-500"
          >
            About
          </Link>

          <div className="border-t pt-4"></div>

          {!user && (
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/login");
              }}
              className="
                w-full py-3 rounded-xl
                bg-gradient-to-r from-orange-500 to-orange-600
                text-white font-semibold text-lg
                shadow-md hover:shadow-lg transition
              "
            >
              Login
            </button>
          )}

          {user && (
            <button
              onClick={logout}
              className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
