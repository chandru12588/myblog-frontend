import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";               // ✅ use api.js
import { auth } from "../config/firebase";

function Projects() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await api.get("/api/projects"); // ✅ no localhost
      setProjects(res.data);
    } catch (err) {
      console.error("Error loading projects", err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete project?")) return;
    if (!user) return;

    try {
      const token = await user.getIdToken();

      await api.delete(`/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      loadProjects();
    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="px-10 py-14">
      <h2 className="text-4xl font-bold mb-10">🚀 Projects</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((p) => (
          <div key={p._id} className="bg-white shadow rounded p-5">
            {p.image && (
              <img
                src={p.image}
                alt={p.title || "Project image"}   // ✅ alt added
                className="h-48 w-full object-cover rounded mb-4"
              />
            )}

            <h3 className="text-2xl font-semibold">{p.title}</h3>
            <p className="text-gray-600 mt-2">{p.description}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              {p.techStack.map((t, i) => (
                <span
                  key={i}
                  className="bg-gray-100 px-3 py-1 rounded text-sm"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-4 mt-4">
              {p.liveLink && (
                <a
                  href={p.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"   // ✅ security fix
                  className="text-blue-600"
                >
                  Live
                </a>
              )}

              {p.githubLink && (
                <a
                  href={p.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"   // ✅ security fix
                  className="text-gray-700"
                >
                  GitHub
                </a>
              )}
            </div>

            {user && user.email === p.owner && (
              <div className="flex gap-4 mt-5">
                <button
                  onClick={() => navigate(`/edit-project/${p._id}`)}
                  className="text-green-600"
                >
                  ✏ Edit
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-red-600"
                >
                  🗑 Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
