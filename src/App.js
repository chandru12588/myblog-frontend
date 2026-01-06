import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

/* ================= PAGES ================= */
import Home from "./components/Home.jsx";
import Blogs from "./components/Blogs.jsx";
import BlogDetails from "./pages/BlogDetails.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import About from "./components/About.jsx";
import Projects from "./components/Projects.jsx";
import ProjectDetails from "./pages/ProjectDetails.jsx"; // ✅ ADD THIS

/* ================= BLOG ACTIONS ================= */
import AddBlog from "./components/AddBlog.jsx";
import EditBlog from "./components/EditBlog.jsx";

/* ================= PROJECT ACTIONS ================= */
import AddProject from "./components/AddProject.jsx";
import EditProject from "./components/EditProject.jsx";

/* ================= LAYOUT ================= */
import Navbar from "./components/common/Navbar.jsx";
import Footer from "./components/common/Footer.jsx";

/* ================= AUTH ================= */
import AuthProvider from "./context/AuthContext.js";
import ProtectedRoute from "./ProtectedRoute.js";

function Layout() {
  const location = useLocation();
  const hideLayout = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {/* 🔔 Toast */}
      <Toaster position="top-center" />

      {!hideLayout && <Navbar />}

      <Routes>
        {/* ========== PUBLIC ROUTES ========== */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* BLOGS */}
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />

        {/* PROJECTS */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} /> {/* ✅ FIX */}

        {/* OTHERS */}
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ========== PROTECTED BLOG ROUTES ========== */}
        <Route
          path="/add-blog"
          element={
            <ProtectedRoute>
              <AddBlog />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-blog/:id"
          element={
            <ProtectedRoute>
              <EditBlog />
            </ProtectedRoute>
          }
        />

        {/* ========== PROTECTED PROJECT ROUTES ========== */}
        <Route
          path="/add-project"
          element={
            <ProtectedRoute>
              <AddProject />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-project/:id"
          element={
            <ProtectedRoute>
              <EditProject />
            </ProtectedRoute>
          }
        />

        {/* ========== FALLBACK ========== */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}
