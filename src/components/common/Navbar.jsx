import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const NavLink = ({ to, label }) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className="text-gray-700 hover:text-orange-500 transition font-medium"
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">

        {/* ================= LOGO ================= */}
        <h2
          className="text-2xl font-extrabold text-orange-500 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          Personal
        </h2>

        {/* ================= DESKTOP MENU ================= */}
        <div className="hidden md:flex items-center gap-6">

          <NavLink to="/home" label="Home" />
          <NavLink to="/blogs" label="Blogs" />
          <NavLink to="/projects" label="Projects" />
          <NavLink to="/about" label="About" />

          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Login
            </button>
          )}

          {user && (
            <div className="flex items-center gap-4">

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
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* ================= MOBILE TOGGLE ================= */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <span className="text-2xl">✕</span>
          ) : (
            <span className="text-2xl">☰</span>
          )}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-6 py-5 space-y-4">

          <NavLink to="/home" label="Home" />
          <NavLink to="/blogs" label="Blogs" />
          <NavLink to="/projects" label="Projects" />
          <NavLink to="/about" label="About" />

          {!user && (
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/login");
              }}
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Login
            </button>
          )}

          {user && (
            <>
              <button
                onClick={() => navigate("/add-project")}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              >
                + Add Project
              </button>

              <button
                onClick={() => navigate("/add-blog")}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              >
                + Add Blog
              </button>

              <button
                onClick={logout}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
