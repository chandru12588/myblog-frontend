import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { auth } from "../config/firebase";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);

  /* ================= AUTH ================= */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  /* ================= LOAD PROJECT ================= */
  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const res = await api.get(`/api/projects/${id}`);
      setProject(res.data);
    } catch {
      alert("Project not found ❌");
      navigate("/projects");
    }
  };

  if (!project) return null;

  const likedByUser =
    user && project.likedBy?.some((u) => u.uid === user.uid);

  /* ================= LIKE / UNLIKE ================= */
  const handleLikeToggle = async () => {
    if (!user) {
      alert("Login required ❌");
      return;
    }

    try {
      const token = await user.getIdToken();

      const endpoint = likedByUser
        ? `/api/projects/unlike/${project._id}`
        : `/api/projects/like/${project._id}`;

      const res = await api.patch(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProject(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Action failed ❌");
    }
  };

  /* ================= ADD COMMENT ================= */
  const handleComment = async () => {
    if (!user) {
      alert("Login required ❌");
      return;
    }

    if (!comment.trim()) return;

    try {
      const token = await user.getIdToken();

      const res = await api.post(
        `/api/projects/comment/${project._id}`,
        { text: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProject(res.data);
      setComment("");
    } catch {
      alert("Comment failed ❌");
    }
  };

  /* ================= DELETE OWN COMMENT ================= */
  const handleDeleteComment = async (index) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();

      const res = await api.delete(
        `/api/projects/comment/${project._id}/${index}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProject(res.data);
    } catch {
      alert("Delete comment failed ❌");
    }
  };

  return (
    <div className="px-6 md:px-12 py-12 max-w-5xl mx-auto">

      {/* BACK */}
      <button
        onClick={() => navigate("/projects")}
        className="text-sm text-gray-600 hover:text-orange-500 mb-6"
      >
        ← Back to Projects
      </button>

      {/* IMAGE */}
      {project.image && (
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-[350px] object-cover rounded-xl shadow mb-6"
        />
      )}

      {/* TITLE */}
      <h1 className="text-3xl md:text-4xl font-bold">
        {project.title}
      </h1>

      <p className="text-gray-500 mt-1">
        Created by {project.ownerEmail}
      </p>

      {/* STATS */}
      <div className="flex gap-6 mt-4 text-sm text-gray-600">
        <span>👀 {project.views}</span>
        <span>❤️ {project.likes}</span>
        <span>💬 {project.comments.length}</span>
      </div>

      {/* DESCRIPTION */}
      <p className="text-gray-700 mt-6 leading-relaxed">
        {project.description}
      </p>

      {/* TECH STACK */}
      <div className="flex flex-wrap gap-2 mt-4">
        {project.techStack.map((t, i) => (
          <span key={i} className="px-3 py-1 bg-gray-100 rounded text-sm">
            {t}
          </span>
        ))}
      </div>

      {/* LINKS */}
      <div className="flex gap-5 mt-6">
        {project.liveLink && (
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Live Project
          </a>
        )}

        {project.githubLink && (
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 underline"
          >
            GitHub Repo
          </a>
        )}
      </div>

      {/* LIKE BUTTON */}
      <button
        onClick={handleLikeToggle}
        className={`mt-8 px-6 py-2 rounded-lg font-semibold ${
          likedByUser
            ? "bg-gray-300 text-gray-700"
            : "bg-pink-500 text-white hover:bg-pink-600"
        }`}
      >
        ❤️ {likedByUser ? "Unlike" : "Like Project"}
      </button>

      {/* COMMENTS */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-3">💬 Comments</h3>

        {project.comments.length === 0 && (
          <p className="text-gray-500 text-sm">No comments yet</p>
        )}

        <div className="space-y-3">
          {project.comments.map((c, i) => (
            <div
              key={i}
              className="bg-gray-100 p-3 rounded flex justify-between"
            >
              <div>
                <p className="text-sm font-semibold">{c.email}</p>
                <p className="text-sm text-gray-700">{c.text}</p>
              </div>

              {user && c.uid === user.uid && (
                <button
                  onClick={() => handleDeleteComment(i)}
                  className="text-red-500 text-sm"
                >
                  🗑
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ADD COMMENT */}
        {user && (
          <div className="mt-4 flex gap-3">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              onClick={handleComment}
              className="bg-orange-500 text-white px-4 rounded"
            >
              Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;
