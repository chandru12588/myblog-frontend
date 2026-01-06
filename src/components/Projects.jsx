import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { auth } from "../config/firebase";

function Projects() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  /* ================= AUTH ================= */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  /* ================= LOAD PROJECTS ================= */
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await api.get("/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Error loading projects", err.message);
    }
  };

  /* ================= LIKE PROJECT ================= */
  const handleLike = async (project) => {
    if (!user) {
      alert("Login required ❌");
      return;
    }

    const alreadyLiked = project.likedBy?.some(
      (u) => u.uid === user.uid
    );

    if (alreadyLiked) {
      alert("You already liked this ❤️");
      return;
    }

    try {
      const token = await user.getIdToken();

      await api.patch(
        `/api/projects/like/${project._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Like failed ❌");
    }
  };

  /* ================= DELETE PROJECT ================= */
  const handleDelete = async (id) => {
    if (!user) return;
    if (!window.confirm("Delete project? 🗑")) return;

    try {
      const token = await user.getIdToken();

      await api.delete(`/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      loadProjects();
    } catch {
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="px-10 py-14">
      <h2 className="text-4xl font-bold mb-10">🚀 Projects</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((p) => {
          const likedByUser =
            user && p.likedBy?.some((u) => u.uid === user.uid);

          return (
            <div key={p._id} className="bg-white shadow rounded p-5">
              {p.image && (
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-48 w-full object-cover rounded mb-4"
                />
              )}

              <h3 className="text-2xl font-semibold">{p.title}</h3>

              <p className="text-sm text-gray-400">
                {p.ownerEmail}
              </p>

              <p className="text-gray-600 mt-2">
                {p.description}
              </p>

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
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    Live
                  </a>
                )}

                {p.githubLink && (
                  <a
                    href={p.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700"
                  >
                    GitHub
                  </a>
                )}
              </div>

              {/* 👀 ❤️ 💬 ACTIONS */}
              <div className="flex items-center gap-4 mt-4 text-sm">
                <span className="text-gray-600">
                  👀 {p.views || 0}
                </span>

                <button
                  disabled={likedByUser}
                  onClick={() => handleLike(p)}
                  className={`font-semibold ${
                    likedByUser
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-pink-600"
                  }`}
                >
                  ❤️ {p.likes || 0}
                </button>

                <span className="text-gray-600">
                  💬 {p.comments?.length || 0}
                </span>
              </div>

              {/* 🔐 OWNER ONLY */}
              {user && p.ownerId === user.uid && (
                <div className="flex gap-4 mt-4">
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
          );
        })}
      </div>
    </div>
  );
}

export default Projects;
